import { BaseResponse, BaseRequest } from "./base-api.type";

export enum TicketType {
  IT = "IT",
  MAINTENANCE = "MAINTENANCE",
  CLEANING = "CLEANING",
  OTHER = "OTHER",
}

export enum TicketStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED",
}

export interface Ticket {
  ticketId: string;
  ticketTitle: string;
  ticketDesc: string;
  ticketType: TicketType;
  ticketStatus: TicketStatus;
  officeRoom_uuid: string;
  ticketDate: string;
  user_uuid: string;
}

export interface CreateTicket {
  user_uuid: string;
  ticketTitle: string;
  ticketDesc: string;
  ticketType: TicketType;
  ticketStatus: TicketStatus;
  officeRoom_uuid: string;
  ticketDate: string;
}

export type CreateTicketType = BaseRequest<CreateTicket>;
