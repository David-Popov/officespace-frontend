import { BaseRequest } from "./base-api.type";
import { Reservation } from "./reservation.type";

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
  reservations: Reservation[];
}

export interface RefreshTokenRequest {
  email: string
  refreshToken: string
}

export type RefreshTokenRequestType = BaseRequest<RefreshTokenRequest>