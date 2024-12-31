import { BaseRequest } from "./base-api.type";
import { Payment } from "./payment.types";
import { ReservationDto } from "./reservation.type";

export interface User {
  Id: string;
  email: string;
  username: string;
  // pictureUrl: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  // address: string;
  roleId: number;
  roleName: string;
  reservations: ReservationDto[];
  payments: Payment[];
  notifications: UserNotificationDto[];
}

export interface UserNotificationDto{
  id: string;
  message: string;
  notificationType: string,
  read: boolean
  notificationDate: Date
}

export interface RefreshTokenRequest {
  email: string
  refreshToken: string
}

export type RefreshTokenRequestType = BaseRequest<RefreshTokenRequest>