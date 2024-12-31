import { BaseResponse, BaseRequest } from "./base-api.type";
import { User } from "./users.types";

export interface UpdateUserRequest{
  Id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  roleId: number;
  roleName: string;
}

export type GetUsersResponse = BaseResponse<User[]>;