export interface UserDto {
  Id: string; // UUID
  email: string;
  username: string;
  password: string;
  pictureUrl: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  roleId: number;
}

const mockUsers: UserDto[] = [
  {
    Id: "123e4567-e89b-12d3-a456-426614174000",
    email: "john.doe@example.com",
    username: "johndoe",
    password: "password123",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    roleId: 1,
  },
  {
    Id: "223e4567-e89b-12d3-a456-426614174001",
    email: "jane.smith@example.com",
    username: "janesmith",
    password: "password456",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    roleId: 2,
  },
  {
    Id: "323e4567-e89b-12d3-a456-426614174002",
    email: "robert.johnson@example.com",
    username: "robjohnson",
    password: "password789",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "Robert",
    lastName: "Johnson",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, Chicago, IL 60601",
    roleId: 1,
  },
  {
    Id: "423e4567-e89b-12d3-a456-426614174003",
    email: "sarah.williams@example.com",
    username: "sarahw",
    password: "passwordabc",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "Sarah",
    lastName: "Williams",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, Houston, TX 77001",
    roleId: 2,
  },
  {
    Id: "523e4567-e89b-12d3-a456-426614174004",
    email: "michael.brown@example.com",
    username: "mikebrown",
    password: "passworddef",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "Michael",
    lastName: "Brown",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Ave, Miami, FL 33101",
    roleId: 1,
  },
  {
    Id: "623e4567-e89b-12d3-a456-426614174005",
    email: "emily.davis@example.com",
    username: "emilyd",
    password: "passwordxyz",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "Emily",
    lastName: "Davis",
    phone: "+1 (555) 678-9012",
    address: "987 Cedar Rd, Seattle, WA 98101",
    roleId: 2,
  },
  {
    Id: "723e4567-e89b-12d3-a456-426614174006",
    email: "david.miller@example.com",
    username: "davidm",
    password: "password321",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "David",
    lastName: "Miller",
    phone: "+1 (555) 789-0123",
    address: "147 Birch Ln, Boston, MA 02101",
    roleId: 1,
  },
  {
    Id: "823e4567-e89b-12d3-a456-426614174007",
    email: "lisa.wilson@example.com",
    username: "lisaw",
    password: "password654",
    pictureUrl: "/api/placeholder/150/150",
    firstName: "Lisa",
    lastName: "Wilson",
    phone: "+1 (555) 890-1234",
    address: "258 Walnut Dr, San Francisco, CA 94101",
    roleId: 2,
  },
];

export default mockUsers;
