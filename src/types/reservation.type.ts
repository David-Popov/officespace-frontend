import { BaseResponse } from "./base-api.type";

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

export interface CreateReservationRequest {
  reservation_title: string;
  user_uuid: string;
  start_date_time: string;
  end_date_time: string;
  durationAsHours: number;
  office_room_uuid: string;
  participant_uuids?: string[] | null;
  event?: Event | null;
}

export const emptyReservation: CreateReservationRequest = {
  event: null,
  reservation_title: "",
  user_uuid: "",
  start_date_time: "",
  end_date_time: "",
  durationAsHours: 0,
  office_room_uuid: "",
  participant_uuids: null
};

export type createReservationResponse = BaseResponse<string>

export interface EventBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | undefined;
  selectedTime: string;
  duration: string;
  roomName: string;
  onSubmit: (eventData: Event) => void;
}

export type CreateReservationType = BaseRequest<CreateReservation>;