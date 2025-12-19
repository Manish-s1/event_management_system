

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

export enum Role {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  USER = "USER",
}
