import { BaseRequest, BaseResponse } from "./base-api.type";
import { OfficeRoom } from "./offices.types";
import { User } from "./users.types";

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

export interface GetReservationsResponseObject {
    id: string;
    userEmail: string;
    reservationTitle: string;
    startDateTime: string;
    endDateTime: string;
    durationAsHours: number;
    status: ReservationStatus;
    officeRoomName: string;
    event?: Event;
}

export interface ReservationDto {
  Id: string,
  event: Event | null;
  reservationTitle: string;
  userUuid: string;
  startDateTime: string;
  endDateTime: string;
  durationAsHours: number;
  status: ReservationStatus;
  officeRoomUuid: string;
}

export interface ReservationDto {
  Id: string,
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

export type CreateReservationType = BaseRequest<CreateReservationRequest>;

export type GetReservationsResponseObjectResponse = BaseResponse<GetReservationsResponseObject[]>

export type GetReservationDtosResponse = BaseResponse<ReservationDto[]>