import { CompanyDto } from './company.type';

export interface DepartmentDto {
    id: string;
    departmentType: string; 
    name: string;
    company: CompanyDto;
  }