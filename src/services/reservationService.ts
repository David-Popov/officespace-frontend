import { api } from "@/lib/axios";
import { API_CONFIG } from "@/config/api.config";
import { CreateReservationRequest, createReservationResponse } from "@/types/reservation.type";
import { AxiosResponse } from "axios";
import { createRequest } from "@/helpers/request-response-helper";

export class ReservationService {
  private static instance: ReservationService;

  private constructor() {}

  public static getInstance(): ReservationService {
    if (!ReservationService.instance) {
      ReservationService.instance = new ReservationService();
    }

    return ReservationService.instance;
  }

  public async makeReservation(
    createReservationRequest: CreateReservationRequest
  ): Promise<void> {
    if (
      !createReservationRequest.office_room_uuid ||
      !createReservationRequest.user_uuid ||
      !createReservationRequest.start_date_time ||
      !createReservationRequest.end_date_time
    ) {
      throw new Error("Missing required fields in reservation request");
    }

    const startDate = new Date(createReservationRequest.start_date_time);
    const endDate = new Date(createReservationRequest.end_date_time);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    if (startDate >= endDate) {
      throw new Error("End date must be after start date");
    }

    const request = createRequest(createReservationRequest);

    const response: AxiosResponse<createReservationResponse> = await api.post(
      `${API_CONFIG.ENDPOINTS.RESERVATIONS.MAKE_RESERVATION}`,
      request
    );

    if (response.status !== 200) {
      throw new Error(response.data.errorDescription || "Failed to create reservation");
    }
  }
  catch(error: any) {
    if (error.response) {
      const errorResponse: createReservationResponse = {
        date: new Date(),
        errorDescription: error.response.data.errorDescription || "Server error",
        responseId: crypto.randomUUID(),
        status: error.response.status.toString(),
        description: error.response.data.description || "Failed to create reservation",
        data: "",
      };
      throw errorResponse;
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("Error setting up request: " + error.message);
    }
  }
}
