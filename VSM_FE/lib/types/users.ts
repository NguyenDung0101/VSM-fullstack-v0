export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "editor" | "admin";
  createdAt: string;
  isActive: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  role?: User["role"];
  isActive?: boolean;
}

export interface UserQuery {
  role?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}