import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { GetUsersResponse } from "@/types/admin.types";
import { CreateReservation, CreateReservationType} from "@/types/reservation.type";
import { BaseResponse } from "@/types/base-api.type";
import { createRequest } from "@/helpers/request-response-helper"

export class ReservationService {
  private static instance: ReservationService;

  private constructor() {}

  public static getInstance(): ReservationService {
    if (!ReservationService.instance) {
        ReservationService.instance = new ReservationService();
    }

    return ReservationService.instance;
  }

  public async createReservation(data: CreateReservation): Promise<BaseResponse<string>> {
    try {
      console.log(data);
      const createReservationRequest: CreateReservationType = createRequest(data)

      console.log(createReservationRequest);

      const response: AxiosResponse<BaseResponse<string>> = await api.post(
        `${API_CONFIG.ENDPOINTS.RESERVATIONS.CREATE}`,
        createReservationRequest
      );

      console.log(response);
      console.log(response.status);

      return response.data; 
    } catch (error: any) {
      const errorResponse: GetUsersResponse = {
        date: new Date(),
        errorDescription: error.response?.data?.message || 'Reservation creation failed',
        responseId: crypto.randomUUID(),
        status: error.response?.status || 500,
        description: error.response?.description || 'An unknown error occurred',
        data: null,
      };

      throw errorResponse;
    }
  }
}
