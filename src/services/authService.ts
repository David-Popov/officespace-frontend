import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { cookieService } from "../lib/cookie";
import { API_CONFIG } from "../config/api.config";
import {
  LoginResponseType,
  LoginUserRequest,
  LoginRequestType,
  RegisterRequestType,
  RegisterUserRequest,
} from "../types/auth.types";
import { createRequest } from "@/helpers/request-response-helper";
import { User } from "@/types/users.types";

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  public async login(credentials: LoginUserRequest): Promise<LoginResponseType> {
    try {
      const loginRequest: LoginRequestType = createRequest(credentials);
      const response: AxiosResponse<LoginResponseType> = await api.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        loginRequest
      );

      if (response.data.data) {
        const { token, refreshToken } = response.data.data;
        this.setAuthCookies(token, refreshToken);
      }
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, "Login failed");
    }
  }
  public async validateToken(): Promise<boolean> {
    const token = cookieService.get(API_CONFIG.AUTH_COOKIE_NAME);
    return !!token;
  }

  public async getUserInfo(): Promise<User | null> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.AUTH.GET_LOGGED_USER);
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  private handleError(error: any, defaultMessage: string): LoginResponseType {
    return {
      date: new Date(),
      errorDescription: error.response?.data?.message || defaultMessage,
      responseId: crypto.randomUUID(),
      status: error.response?.status || 500,
      description: error.response?.description || defaultMessage,
      data: null,
    };
  }

  public async register(credentials: RegisterUserRequest): Promise<void> {
    try {
      const registerRequest: RegisterRequestType = createRequest(credentials);

      const response: AxiosResponse<LoginResponseType> = await api.post(
        `${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        registerRequest
      );
      // console.log(response)
      // console.log(response.status)
    } catch (error: any) {
      const errorResponse: LoginResponseType = {
        date: new Date(),
        errorDescription: error.response?.data?.message || "Register failed",
        responseId: crypto.randomUUID(),
        status: error.response?.status || 500,
        description: error.response?.description || "Register failed",
        data: null,
      };

      throw errorResponse;
    }
  }

  //TODO LATER CHECK AGAIN EXPIRATION OF THE TOKENS
  private setAuthCookies(token: string, refreshToken: string): void {
    const tokenExpiry = new Date(Date.now() + API_CONFIG.TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const refreshTokenExpiry = new Date(
      Date.now() + API_CONFIG.TOKEN_EXPIRY_DAYS * 2 * 24 * 60 * 60 * 1000
    );
    cookieService.set(API_CONFIG.AUTH_COOKIE_NAME, token, {
      expires: tokenExpiry,
      path: "/",
      secure: false /*process.env.NODE_ENV === "production"*/,
      sameSite: "lax",
    });

    cookieService.set(API_CONFIG.REFRESH_COOKIE_NAME, refreshToken, {
      expires: refreshTokenExpiry,
      path: "/",
      secure: false /*process.env.NODE_ENV === "production"*/,
      sameSite: "lax",
    });
  }
}
