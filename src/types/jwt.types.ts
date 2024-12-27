import { Reservation } from "./reservation.type";

export interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  id: string;
  username: string;
  password: string;
  // pictureUrl: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  reservations: Reservation[];
  // address: string;
  roleId: number;
  roleName: string;
}