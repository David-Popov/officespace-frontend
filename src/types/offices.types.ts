import { BaseResponse } from "./base-api.type";
import { Reservation } from "./reservation.type";
import { CompanyDto } from "./company.type";
import { ResourceDto } from "./resource.type";

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

export interface OfficeRoom {
  id: string;
  office_room_name: string;
  address: string | null;
  building: string | null;
  floor: string;
  type: string;
  capacity: number;
  status: RoomStatus;
  picture_url: string | null;
  price_per_hour: number;
  company: CompanyDto;
  reservations: Reservation[];
  resources: ResourceDto[];
}

export const emptyOfficeObject: OfficeRoom = {
  id: "1",
  office_room_name: "",
  address: "",
  building: "",
  floor: "",
  type: "",
  capacity: 0,
  status: RoomStatus.AVAILABLE,
  picture_url: "",
  price_per_hour: 0,
  company: {
    id: "0", 
    name: "",
    address: "",
    type: "",
  },
  reservations: [],
  resources: [],
};

export interface FindAvailabilRoomsRequest {
  startDateTime?: string; 
  endDateTime?: string;   
}

export interface FilterRoomsRequest {
  name?: string;
  building?: string;
  floor?: string;
  type?: string;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
}


export type GetOfficeRoomsResponse = BaseResponse<OfficeRoom[]>;
export type GetOfficeRoomDataResponse = BaseResponse<OfficeRoom>;
export type GetFilteredOfficeRoomsResponse = BaseResponse<OfficeRoom[]>;
export type GetAvaliableOfficeRoomsResponse = BaseResponse<OfficeRoom[]>;