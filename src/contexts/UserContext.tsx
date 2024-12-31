import { createContext, FC, PropsWithChildren, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/services/authService";
// import { User } from "@/types/users.types";
import {
  LoginUserRequest,
  LoginResponseType,
  AuthState,
  AuthContextData,
} from "@/types/auth.types";
import { API_CONFIG } from "@/config/api.config";
import { cookieService } from "@/lib/cookie";
import React from "react";
import { JwtPayload } from "@/types/jwt.types";
import { UserService } from "@/services/userService";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextData>({
  ...initialState,
  login: async () => {},
  logout: () => {},
  reloadUser: async () => {},
  clearError: () => {},
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const authService = AuthService.getInstance();
  const userService = UserService.getInstance();

  const updateState = (updates: Partial<AuthState>) => {
    setState((current) => ({ ...current, ...updates }));
  };

  const login = async (credentials: LoginUserRequest): Promise<void> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);

      if (response.status === "200" || response.status === "OK") {
        const token = cookieService.get(API_CONFIG.AUTH_COOKIE_NAME);

        if (!token) {
          throw new Error("No token received after login");
        }

        const user = response.data?.user;
        updateState({
          user,
          isAuthenticated: true,
          isAdmin: user!.roleName.toUpperCase() === "ADMIN",
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      let errorMessage = "Login failed";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if ((error as LoginResponseType).errorDescription) {
        errorMessage = (error as LoginResponseType).errorDescription;
      }

      updateState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  };

  const logout = useCallback(() => {
    cookieService.remove(API_CONFIG.AUTH_COOKIE_NAME);
    cookieService.remove(API_CONFIG.REFRESH_COOKIE_NAME);

    updateState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const checkTokenAndLoadUser = useCallback(async () => {
    const token = cookieService.get(API_CONFIG.AUTH_COOKIE_NAME);

    if (!token) {
      updateState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (Date.now() >= decoded.exp * 1000) {
        logout();
        return;
      }

      // Token is valid, get fresh user data from backend
      const response = await userService.getUserByEmail(decoded.email);
      const user = response.data!;

      updateState({
        user,
        isAuthenticated: true,
        isAdmin: user.roleName.toUpperCase() === "ADMIN",
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Token validation or user load error:", error);
      logout();
    }
  }, [logout, userService]);

  const reloadUser = async (email: string): Promise<void> => {
    try {
      if (!email) {
        throw new Error("Email cannot be null or empty");
      }

      const response = await userService.getUserByEmail(email);
      const user = response.data!;

      updateState({
        user,
        isAuthenticated: true,
        isAdmin: user.roleName.toUpperCase() === "ADMIN",
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, []);

  useEffect(() => {
    checkTokenAndLoadUser();
    const interval = setInterval(checkTokenAndLoadUser, 60000);
    return () => clearInterval(interval);
  }, [checkTokenAndLoadUser]);

  const value: AuthContextData = {
    ...state,
    login,
    logout,
    reloadUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
