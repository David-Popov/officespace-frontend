import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { User } from "@/types/users.types";
import { GetUsersResponse, UpdateUserRequest } from "@/types/admin.types";
import { BaseResponse } from "@/types/base-api.type";
import { createRequest } from "@/helpers/request-response-helper";
import { CompanyDto, GetCompaniesResponse, UpdateCompanyRequest } from "@/types/company.type";
import { GetReservationsResponseObject, GetReservationsResponseObjectResponse } from "@/types/reservation.type";

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

  public async deleteCompany(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error("Company ID is required");
      }

      const route = API_CONFIG.ENDPOINTS.ADMIN.DELETECOMPANY + id;
      const response: AxiosResponse<BaseResponse<string>> = await api.delete(route);

      if (response.status !== 200) {
        throw new Error("Failed to delete company");
      }

      if (response.data.status !== "OK") {
        throw new Error(response.data.errorDescription || "Failed to delete company");
      }
    } catch (error: any) {
      if (error.response) {
        const errorResponse = {
          date: new Date(),
          errorDescription: error.response.data?.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: "Failed to delete company",
          data: null,
        };
        throw errorResponse;
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error(error.message || "Failed to delete company");
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

      let updateUserRequest: UpdateUserRequest = {
        Id: user.Id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        phone: user.phone,
        roleId: user.roleId,
        roleName: user.roleName,
      };

      const request = createRequest(updateUserRequest);
      const response: AxiosResponse<BaseResponse<User>> = await api.put(`${API_CONFIG.ENDPOINTS.ADMIN.UPDATE_USER}${updateUserRequest.Id}`,request);

      console.log("Response received:", response);

      return;
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

  public async getCompanies(): Promise<Array<CompanyDto>> {
    try {
      const response: AxiosResponse<GetCompaniesResponse> = await api.get(`${API_CONFIG.ENDPOINTS.ADMIN.GETCOMPANIES}`);

      if (response.status === 200 && response.data.status === "OK") {
        if (!response.data.data || response.data.data.length === 0) {
          return [];
        }
        return response.data.data;
      }

      throw new Error(response.data.errorDescription || "Failed to get companies");
    } catch (error: any) {
      if (error.response) {
        const errorResponse: GetCompaniesResponse = {
          date: new Date(),
          errorDescription: error.response.data.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: error.response.data.description || "Failed to get companies",
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

  public async getReservations(): Promise<Array<GetReservationsResponseObject>> {
    try {
      const response: AxiosResponse<GetReservationsResponseObjectResponse> = await api.get(`${API_CONFIG.ENDPOINTS.ADMIN.GETRESERVATIONS}`);

      console.log("Response: ", response)
      console.log("Response Data: ", response.data.data)

      if (response.status === 200 && response.data.status === "OK") {
        if (!response.data.data || response.data.data.length === 0) {
          return [];
        }
        return response.data.data;
      }

      throw new Error(response.data.errorDescription || "Failed to get reservations");
    } catch (error: any) {
      if (error.response) {
        const errorResponse: GetReservationsResponseObjectResponse = {
          date: new Date(),
          errorDescription: error.response.data.errorDescription || "Server error",
          responseId: crypto.randomUUID(),
          status: error.response.status.toString(),
          description: error.response.data.description || "Failed to get reservations",
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

  public async getCompanyById(id: string): Promise<CompanyDto> {
    try {
      if (!id) {
        throw new Error("Company ID is required");
      }

      const response: AxiosResponse<BaseResponse<CompanyDto>> = await api.get(
        `${API_CONFIG.ENDPOINTS.ADMIN.GET_COMPANY_BY_ID + id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch company data");
      }

      if (response.data.status !== "OK") {
        throw new Error(response.data.errorDescription || "Failed to fetch company data");
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
          description: "Failed to fetch company data",
          data: null,
        };
        throw errorResponse;
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error(error.message || "Failed to fetch company data");
      }
    }
  }

  public async updateCompany(company: CompanyDto): Promise<void> {
    try {
      if (!company) {
        throw new Error("Company is null");
      }

      let UpdateCompanyRequest: UpdateCompanyRequest = {
        name: company.name,
        address: company.address,
        type: company.type,
      };

      const request = createRequest(UpdateCompanyRequest);
      const response: AxiosResponse<BaseResponse<User>> = await api.put(`${API_CONFIG.ENDPOINTS.ADMIN.UPDATE_COMPANY}${company.id}`,request);

      console.log("Response received:", response);

      return;
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
