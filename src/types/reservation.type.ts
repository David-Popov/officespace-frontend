import { BaseResponse,BaseRequest } from './base-api.type';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Event {
  id?: string;
  meetingTitle: string;
  description?: string;
  attendees?: string[];
  contactEmail: string;
  department: string;
  reservationId?: string;
}

export interface Reservation {
  event: Event | null;
  reservation_title: string;
  user_uuid: string;
  start_date_time: string;
  end_date_time: string;
  durationAsHours: number;
  status: ReservationStatus;
  office_room_uuid: string;
}
export interface CreateReservation {
  event: Event | null;
  reservation_title: string;
  user_uuid: string;
  start_date_time: string;
  end_date_time: string;
  durationAsHours: number;
  office_room_uuid: string;
}

export interface Event {
  id?: string;
  meetingTitle: string;
  description?: string;
  attendees?: string[];
  contactEmail: string;
  department: string;
  reservationId?: string;
}

export type CreateReservationType = BaseRequest<CreateReservation>;