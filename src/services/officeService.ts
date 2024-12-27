import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { User } from "@/types/users.types";
import { GetUsersResponse } from "@/types/admin.types";
import { BaseResponse } from "@/types/base-api.type";
import { createRequest } from "@/helpers/request-response-helper";
import { OfficeRoom, GetOfficeRoomsResponse, GetOfficeRoomDataResponse } from "@/types/offices.types";




export class OfficeService {
  private static instance: OfficeService;

  private constructor() {}

  public static getInstance(): OfficeService {
    if (!OfficeService.instance) {
      OfficeService.instance = new OfficeService();
    }

    return OfficeService.instance;
  }

  public async getOffices(): Promise<Array<OfficeRoom>> {
    try {
      const response: AxiosResponse<GetOfficeRoomsResponse> = await api.get(
        `${API_CONFIG.ENDPOINTS.OFFICES.GET_OFFICES}`
      );

      if (response.status === 200 && response.data.status === "OK") {
        if (!response.data.data || response.data.data.length === 0) {
          return [];
        }
        return response.data.data;
      }

      throw new Error(response.data.errorDescription || "Failed to get offices");
    } catch (error: any) {
      if (error.response) {
        const errorResponse: GetUsersResponse = {
          date: new Date(),
          errorDescription: error.response.data.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: error.response.data.description || "Failed to get offices",
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

   public async getOfficeById(id: string): Promise<OfficeRoom> {
     try {
      if (!id) {
        throw new Error("User ID is required");
      }
       
      const response: AxiosResponse<GetOfficeRoomDataResponse> = await api.get(
        `${API_CONFIG.ENDPOINTS.OFFICES.GET_OFFICE_DATA + id}`
      );

      if (response.status === 200 && response.data.status === "OK") {
        if (!response.data.data) {
          throw new Error(response.data.errorDescription || "Failed to fetch office data");
        }
        return response.data.data;
      }

      throw new Error(response.data.errorDescription || "Failed to get offices");
    } catch (error: any) {
      if (error.response) {
        const errorResponse: GetOfficeRoomDataResponse = {
          date: new Date(),
          errorDescription: error.response.data.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: error.response.data.description || "Failed to get office data",
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
