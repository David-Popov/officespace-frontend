import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { BaseResponse } from "@/types/base-api.type";
import { User } from "@/types/users.types";
import { createRequest } from "@/helpers/request-response-helper"
import { GetUsersResponse } from "@/types/admin.types";

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
        UserService.instance = new UserService();
    }

    return UserService.instance;
}
    public async getUserByEmail(email: string): Promise<BaseResponse<User>> {

        try {
          const response: AxiosResponse<BaseResponse<User>> = await api.get(
            `${API_CONFIG.ENDPOINTS.USERS.GET_USER_BY_EMAIL}${email}`
          );
    
          console.log(response);
          return response.data;
        } catch (error: any) {
            if (error.response) {
              const errorResponse: GetUsersResponse = {
                date: new Date(),
                errorDescription: error.response.data.errorDescription || "Server error",
                responseId: crypto.randomUUID(),
                status: error.response.status.toString(),
                description: error.response.data.description || "Failed to get user data",
                data: null,
              };
              throw errorResponse;
            } else if (error.request) {
              throw new Error("No response received from server");
            } else {
              throw new Error("Error setting up request: " + error.message);
            }
          }
        }
}
  