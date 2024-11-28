import { createContext, FC, PropsWithChildren, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/services/authService";
import { User } from "@/types/users.types";
import { LoginUserRequest, LoginResponseType } from "@/types/auth.types";
import { API_CONFIG } from "@/config/api.config";
import { cookieService } from "@/lib/cookie";
import React from "react";
import { stat } from "fs";
import { JwtPayload } from "@/types/jwt.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextData extends AuthState {
  login: (credentials: LoginUserRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  clearError: () => void;
}

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
  refreshUser: () => {},
  clearError: () => {},
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const authService = AuthService.getInstance();

  const updateState = (updates: Partial<AuthState>) => {
    setState((current) => ({ ...current, ...updates }));
  };

  const getUserFromToken = (token: string): User => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return {
        id: decoded.Id,
        username: decoded.username,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        phone: decoded.phone,
        roleId: decoded.roleId,
        roleNmae: decoded.roleName,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      throw new Error("Invalid token");
    }
  };

  const login = async (credentials: LoginUserRequest): Promise<void> => {
    updateState({ isLoading: true, error: null });

    try {
      const status = await authService.login(credentials);

      if (status === "200" || status === "OK") {
        const token = cookieService.get(API_CONFIG.AUTH_COOKIE_NAME);

        if (!token) {
          throw new Error("No token received after login");
        }

        const user = getUserFromToken(token);
        updateState({
          user,
          isAuthenticated: true,
          isAdmin: user.roleNmae.toUpperCase() === "ADMIN",
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
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

  const refreshUser = useCallback(() => {
    try {
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

      const decoded = jwtDecode<JwtPayload>(token);

      if (Date.now() >= decoded.exp * 1000) {
        logout();
        return;
      }

      const user = getUserFromToken(token);
      updateState({
        user,
        isAuthenticated: true,
        isAdmin: user.roleNmae.toUpperCase() === "ADMIN",
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Refresh user error:", error);
      logout();
    }
  }, [logout]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value: AuthContextData = {
    ...state,
    login,
    logout,
    refreshUser,
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
