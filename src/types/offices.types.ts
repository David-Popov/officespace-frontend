import { BaseResponse } from "./base-api.type";
import { Reservation } from "./reservation.type";

export enum RoomType {
  CONFERENCE_ROOM = 'CONFERENCE_ROOM',
  MEETING_ROOM = 'MEETING_ROOM',
  OFFICE = 'OFFICE',
  DESK = 'DESK'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  PENDING = 'PENDING'
}



export interface Company {
  name: string;
  address: string;
  type: string;
}

export interface Resource {
  id: string;
  name: string;
  description?: string;
  available: boolean;
}

export interface OfficeRoom {
  id: string;
  office_room_name: string;
  address: string | null;
  building: string | null;
  floor: string;
  type: string;
  capacity: number;
  status: string;
  picture_url: string | null;
  price_per_hour: number;
  company: Company;
  reservations: Reservation[];
  resources: Resource[];
}

export type GetOfficeRoomsResponse = BaseResponse<OfficeRoom[]>;
export type GetOfficeRoomDataResponse = BaseResponse<OfficeRoom>;

export interface CreateOfficeRoomDto {
  office_room_name: string;
  address?: string;
  building?: string;
  floor: string;
  type: RoomType;
  capacity: number;
  picture_url?: string;
  price_per_hour: number;
  company_uuid: string;
}

export const emptyOfficeObject = {
  id: "1",
  office_room_name: "",
  address: "",
  building: "",
  floor: "",
  type: "",
  capacity: 0,
  status: "",
  picture_url: "",
  price_per_hour: 0,
  company: {
    name: "",
    address: "",
    type: "",
  },
  reservations: [
  ],
  resources: [],
}