import { BaseRequest, BaseResponse } from "./base-api.type";
import { UserDto } from "./users.types";

export interface RegisterUserRequest {
    email: string;
    username: string;
    pictureUrl?: string;
    firstName: string;
    lastName: string;
    phone: string;
    address?: string;
}

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: UserDto
    token: string;
    refreshToken: string;
}

export type RegisterRequestType = BaseRequest<RegisterUserRequest>;
export type LoginRequestType = BaseRequest<LoginUserRequest>;
export type LoginResponseType = BaseResponse<LoginResponse>;