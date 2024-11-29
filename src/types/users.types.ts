import { BaseRequest } from "./base-api.type";

export interface User {
  Id: string;
  email: string;
  username: string;
  // pictureUrl: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  // address: string;
  roleId: number;
  roleNmae: string;
}

export interface RefreshTokenRequest {
  email: string
  refreshToken: string
}

export type RefreshTokenRequestType = BaseRequest<RefreshTokenRequest>

const mockUsers: User[] = [
  {
    Id: "123e4567-e89b-12d3-a456-426614174000",
    email: "john.doe@example.com",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    roleId: 1,
    roleNmae: ""
  },
  {
    Id: "223e4567-e89b-12d3-a456-426614174001",
    email: "jane.smith@example.com",
    username: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1 (555) 234-5678",
    roleId: 2,
    roleNmae: ""
  },
  {
    Id: "323e4567-e89b-12d3-a456-426614174002",
    email: "robert.johnson@example.com",
    username: "robjohnson",
    firstName: "Robert",
    lastName: "Johnson",
    phone: "+1 (555) 345-6789",
    roleId: 1,
    roleNmae: ""
  },
  {
    Id: "423e4567-e89b-12d3-a456-426614174003",
    email: "sarah.williams@example.com",
    username: "sarahw",
    firstName: "Sarah",
    lastName: "Williams",
    phone: "+1 (555) 456-7890",
    roleId: 2,
    roleNmae: ""
  },
  {
    Id: "523e4567-e89b-12d3-a456-426614174004",
    email: "michael.brown@example.com",
    username: "mikebrown",
    firstName: "Michael",
    lastName: "Brown",
    phone: "+1 (555) 567-8901",
    roleId: 1,
    roleNmae: ""
  },
  {
    Id: "623e4567-e89b-12d3-a456-426614174005",
    email: "emily.davis@example.com",
    username: "emilyd",
    firstName: "Emily",
    lastName: "Davis",
    phone: "+1 (555) 678-9012",
    roleId: 2,
    roleNmae: ""
  },
  {
    Id: "723e4567-e89b-12d3-a456-426614174006",
    email: "david.miller@example.com",
    username: "davidm",
    firstName: "David",
    lastName: "Miller",
    phone: "+1 (555) 789-0123",
    roleId: 1,
    roleNmae: ""
  },
  {
    Id: "823e4567-e89b-12d3-a456-426614174007",
    email: "lisa.wilson@example.com",
    username: "lisaw",
    firstName: "Lisa",
    lastName: "Wilson",
    phone: "+1 (555) 890-1234",
    roleId: 2,
    roleNmae: ""
  }
];

export default mockUsers;
