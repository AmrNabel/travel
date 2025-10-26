export type UserRole = 'traveler' | 'sender' | 'both';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  photoURL?: string;
  rating: number;
  totalRatings: number; // For calculating average
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
}
