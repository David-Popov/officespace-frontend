import { BaseRequest, BaseResponse } from "./base-api.type";
import { User } from "./users.types";

export interface RegisterUserRequest {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    // pictureUrl?: string;
    // address?: string;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User
    token: string;
    refreshToken: string;
}

export type RegisterRequestType = BaseRequest<RegisterUserRequest>;
export type LoginRequestType = BaseRequest<LoginUserRequest>;
export type LoginResponseType = BaseResponse<LoginResponse>;