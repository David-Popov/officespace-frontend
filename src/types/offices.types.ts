import { BaseResponse } from "./base-api.type";
import { ReservationDto } from "./reservation.type";
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
  officeRoomName: string;
  address: string | null;
  building: string | null;
  floor: string;
  type: string;
  capacity: number;
  status: RoomStatus;
  pictureUrl: string | null;
  pricePerHour: number;
  company: CompanyDto;
  reservations: ReservationDto[];
  resources: ResourceDto[];
}

export const emptyOfficeObject: OfficeRoom = {
  id: "1",
  officeRoomName: "",
  address: "",
  building: "",
  floor: "",
  type: "",
  capacity: 0,
  status: RoomStatus.AVAILABLE,
  pictureUrl: "",
  pricePerHour: 0,
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