import { AxiosResponse } from 'axios';
import { api } from '../lib/axios';
import { cookieService } from '../lib/cookie';
import { API_CONFIG } from '../config/api.config';
import { 
    LoginResponseType,
    LoginUserRequest,
    LoginRequestType,
    RegisterRequestType,
    RegisterUserRequest
} from '../types/auth.types';
import { createRequest } from "@/helpers/request-response-helper"

export class AuthService {
    private static instance: AuthService
    // private readonly BASE_PATH = '/auth'

    private constructor() { }
    
    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }

    public async login(credentials: LoginUserRequest): Promise<LoginResponseType> {
        try {
            const loginRequest: LoginRequestType = createRequest(credentials)

            const response: AxiosResponse<LoginResponseType> = await api.post(`${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, loginRequest);

            if (response.data.data) {
                const { token, refreshToken } = response.data.data;
                this.setAuthCookies(token, refreshToken)
            }

            return response.data
        } catch (error: any) {
            const errorResponse: LoginResponseType = {
                date: new Date(),
                errorDescription: error.response?.data?.message || 'Login failed',
                responseId: crypto.randomUUID(),
                httpStatus: error.response?.status || 500,
                description: error.response?.description ||'Login failed',
                data: null
            };

            throw errorResponse;
        }
    }


    //TODO LATER CHECK AGAIN EXPIRATION OF THE TOKENS
    private setAuthCookies(token: string, refreshToken: string): void {
        cookieService.set(API_CONFIG.AUTH_COOKIE_NAME, token, {
            expires: API_CONFIG.TOKEN_EXPIRY_DAYS,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        cookieService.set(API_CONFIG.REFRESH_COOKIE_NAME, refreshToken, {
            expires: API_CONFIG.TOKEN_EXPIRY_DAYS * 2,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    }
}