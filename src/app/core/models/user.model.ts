export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  userName: string;
  email: string;
  phone: string;
  createdAt: string;
}
