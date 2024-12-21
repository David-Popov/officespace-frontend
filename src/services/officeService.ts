import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { GetUsersResponse } from "@/types/admin.types";
import { OfficeRoom, 
  GetOfficeRoomsResponse, 
  GetOfficeRoomDataResponse, 
FindAvailabilRoomsRequest,
FilterRoomsRequest, 
GetFilteredOfficeRoomsResponse,
GetAvaliableOfficeRoomsResponse} from "@/types/offices.types";

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
       console.log(id)
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

  public async findAvailableRooms(request: FindAvailabilRoomsRequest): Promise<Array<OfficeRoom>> {
    try {
      const queryParams = new URLSearchParams();
      if (request.startDateTime) queryParams.append("startDateTime", request.startDateTime);
      if (request.endDateTime) queryParams.append("endDateTime", request.endDateTime);
      

      const response: AxiosResponse<GetAvaliableOfficeRoomsResponse> = await api.get(
        `${API_CONFIG.ENDPOINTS.OFFICES.GET_AVAILABLE_ROOMS}?${queryParams.toString()}`
      );

      if (response.status === 200 && response.data.status === "OK") {
        if (!response.data.data || response.data.data.length === 0) {
          return [];
        }
        console.log(response.data.data)
        return response.data.data;
      }

      throw new Error(response.data.errorDescription || "Failed to find available rooms");
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

  public async filterRooms(request: FilterRoomsRequest): Promise<Array<OfficeRoom>> {
    try {
      const queryParams = new URLSearchParams();
      if (request.name) queryParams.append("name", request.name);
      if (request.building) queryParams.append("building", request.building);
      if (request.floor) queryParams.append("floor", request.floor);
      if (request.type) queryParams.append("type", request.type);
      if (request.capacity !== undefined) queryParams.append("capacity", request.capacity.toString());

      const response: AxiosResponse<GetFilteredOfficeRoomsResponse> = await api.get(
        `${API_CONFIG.ENDPOINTS.OFFICES.FILTER_OFFICES}?${queryParams.toString()}`
      );

      if (response.status === 200 && response.data.status === "OK") {
        if (!response.data.data || response.data.data.length === 0) {
          return [];
        }
        return response.data.data;
      }

      throw new Error(response.data.errorDescription || "Failed to filter rooms");
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
  
}