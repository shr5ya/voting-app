export enum UserRole {
  ADMIN = 'admin',
  VOTER = 'voter'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Excluded from responses
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  registrationVerified: boolean;
  voterId?: string; // For voters
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  voterId?: string;
}

export interface VoterLoginRequest {
  voterId: string;
  accessCode: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
  user: UserResponse;
} 