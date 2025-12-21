

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
export interface ICategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface IEvent {
   id: string;
  title: string;
  category: string;
  organizer: string;
}
