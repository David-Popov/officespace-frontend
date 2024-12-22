import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { BaseResponse } from "@/types/base-api.type";
import { CreateTicket, CreateTicketType } from "@/types/ticket.type";
import { createRequest } from "@/helpers/request-response-helper";
import { GetUsersResponse } from "@/types/admin.types";

export class TicketService {
    private static instance: TicketService;

    private constructor() {}
  
    public static getInstance(): TicketService {
      if (!TicketService.instance) {
        TicketService.instance = new TicketService();
      }
  
      return TicketService.instance;
    }
  public async createTicket(data: CreateTicket): Promise<BaseResponse<string>>  {
    try {
      console.log("Create ticket request data:", data);

      const createTicketRequest: CreateTicketType = createRequest(data);

      console.log("Formatted request:", createTicketRequest);

      const response: AxiosResponse<BaseResponse<string>> = await api.post(
        `${API_CONFIG.ENDPOINTS.TICKETS.CREATE}`,
        createTicketRequest
      );

      console.log(response);
      console.log(response.status);

      return response.data; 
    } catch (error: any) {
      const errorResponse: GetUsersResponse = {
        date: new Date(),
        errorDescription: error.response?.data?.message || 'Ticket creation failed',
        responseId: crypto.randomUUID(),
        status: error.response?.status || 500,
        description: error.response?.description || 'An unknown error occurred',
        data: null,
      };

      throw errorResponse;
    }
  }
}
