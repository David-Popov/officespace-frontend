export interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
  Id: string;
  username: string;
  password: string;
  pictureUrl: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  roleId: number;
  roleName: string;
}