import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { User } from "@/types/users.types";
import { GetUsersResponse } from "@/types/admin.types";
import { BaseResponse } from "@/types/base-api.type";
import { createRequest } from "@/helpers/request-response-helper";

export class AdminService {
  private static instance: AdminService;

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }

    return AdminService.instance;
  }

  public async getUsers(): Promise<Array<User>> {
    try {
      const response: AxiosResponse<GetUsersResponse> = await api.get(
        `${API_CONFIG.ENDPOINTS.ADMIN.GETUSERS}`
      );

      if (response.status === 200 && response.data.status === "OK") {
        if (!response.data.data || response.data.data.length === 0) {
          return [];
        }
        return response.data.data;
      }

      throw new Error(response.data.errorDescription || "Failed to get users");
    } catch (error: any) {
      if (error.response) {
        const errorResponse: GetUsersResponse = {
          date: new Date(),
          errorDescription: error.response.data.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: error.response.data.description || "Failed to get users",
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

  public async deleteUser(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }

      const route = API_CONFIG.ENDPOINTS.ADMIN.DELETEUSER + id;
      const response: AxiosResponse<BaseResponse<string>> = await api.delete(route);

      if (response.status !== 200) {
        throw new Error("Failed to delete user");
      }

      if (response.data.status !== "OK") {
        throw new Error(response.data.errorDescription || "Failed to delete user");
      }
    } catch (error: any) {
      if (error.response) {
        const errorResponse = {
          date: new Date(),
          errorDescription: error.response.data?.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: "Failed to delete user",
          data: null,
        };
        throw errorResponse;
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error(error.message || "Failed to delete user");
      }
    }
  }

  public async getUserById(id: string): Promise<User> {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }

      const response: AxiosResponse<BaseResponse<User>> = await api.get(
        `${API_CONFIG.ENDPOINTS.USERS.GET_USER_DATA + id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch user data");
      }

      if (response.data.status !== "OK") {
        throw new Error(response.data.errorDescription || "Failed to fetch user data");
      }

      if (!response.data.data) {
        throw new Error("User not found");
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response) {
        const errorResponse = {
          date: new Date(),
          errorDescription: error.response.data?.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: "Failed to fetch user data",
          data: null,
        };
        throw errorResponse;
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error(error.message || "Failed to fetch user data");
      }
    }
  }

  public async updateUser(user: User): Promise<void> {
    try {
      if (!user) {
        throw new Error("User is null");
        }
        
      const request = createRequest(user);
      const response: AxiosResponse<BaseResponse<User>> = await api.put(
        `${API_CONFIG.ENDPOINTS.ADMIN.UPDATE_USER}`,
        request
        );
        
         console.log("Response received:", response); // Debug log
        
        // Add a return statement to properly resolve the promise
        return;

    //   if (response.status !== 200) {
    //     throw new Error("Failed to update user");
    //   }
    //   if (response.data.status !== "OK") {
    //     throw new Error(response.data.errorDescription || "Failed to update user");
    //   }
    } catch (error: any) {
      if (error.response) {
        const errorResponse = {
          date: new Date(),
          errorDescription: error.response.data?.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: "Failed to update user",
          data: null,
        };
        throw errorResponse;
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error(error.message || "Failed to update user");
      }
    }
  }
}
