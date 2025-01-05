import { BaseRequest, BaseResponse } from "./base-api.type";

export interface Payment {
  id: string
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerId: string;
  date: string;
  chargeId: string;
  userId: string;
}

export interface PaymentSessionRequest {
    amount: number;
    currency: string;
    description: string;
    quantity: number;
    userId: string;
}

export interface PaymentSessionResponse {
  stripePaymentUrl: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  sessionId: string;
}

export interface ConfirmPaymentRequest {
    amount: number;
    currency: string;
    description: string;
    quantity: number;
    sessionId: string;
}



export type PaymentSessionRequestType = BaseRequest<PaymentSessionRequest>
export type PaymentSessionResponseType = BaseResponse<PaymentSessionResponse>
export type ConfirmPaymentRequestType = BaseResponse<ConfirmPaymentRequest>
export type PaymentResponseType = BaseResponse<PaymentResponse>