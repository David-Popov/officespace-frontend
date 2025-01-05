import { BaseResponse } from "./base-api.type";

export interface CompanyDto {
    id: string;
    name: string;
    address: string;
    type: string;
}

export interface UpdateCompanyRequest{
    name: string;
    address: string;
    type: string
}
  
export type GetCompaniesResponse = BaseResponse<CompanyDto[]>;