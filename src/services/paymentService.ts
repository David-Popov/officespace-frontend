import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";
import { BaseRequest, BaseResponse } from "@/types/base-api.type";
import { createRequest } from "@/helpers/request-response-helper";
import { ConfirmPaymentRequest, Payment, PaymentSessionRequest, PaymentSessionResponse, PaymentSessionResponseType } from "@/types/payment.types";

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }

    return PaymentService.instance;
  }

  public async createSession(data: PaymentSessionRequest): Promise<PaymentSessionResponse> {
    try {
      const paymentRequest = createRequest(data);

      const response: AxiosResponse<BaseResponse<PaymentSessionResponse>> = await api.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.CREATE_PAYMENT_SESSION}`,
        paymentRequest
      );

      if (response.status !== 200 || response.data.data === null) {
        console.log("Couldnt create payment session");
        throw new Error("Couldnt create payment session");
      }

      return response.data.data;
    } catch (error: any) {
      const errorResponse: PaymentSessionResponseType = {
        date: new Date(),
        errorDescription: error.response?.data?.message || "Payment session creation failed",
        responseId: crypto.randomUUID(),
        status: error.response?.status || 500,
        description: error.response?.description || "An unknown error occurred",
        data: null,
      };

      throw errorResponse;
    }
  }

  public async confirmPayment(data: ConfirmPaymentRequest): Promise<Payment> {
    try {
      const confirmPaymentRequest = createRequest(data);

      const response: AxiosResponse<BaseResponse<Payment>> = await api.post(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.CONFIRM_PAYMENT}`,
        confirmPaymentRequest
      );

      if (response.status !== 200 || response.data.data === null) {
        console.log("Couldnt create payment");
        throw new Error("Couldnt create payment");
      }

      return response.data.data;
    } catch (error: any) {
      const errorResponse: PaymentSessionResponseType = {
        date: new Date(),
        errorDescription: error.response?.data?.message || "Payment creation failed",
        responseId: crypto.randomUUID(),
        status: error.response?.status || 500,
        description: error.response?.description || "An unknown error occurred",
        data: null,
      };

      throw errorResponse;
    }
  }
}
