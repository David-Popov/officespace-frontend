import { BaseResponse } from "./base-api.type";
import { User } from "./users.types";


export type GetUsersResponse = BaseResponse<User[]>;