export type TripStatus = 'active' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  userId: string; // Traveler's user ID
  fromCity: string;
  toCity: string;
  date: Date;
  capacity: string; // e.g., "10kg"
  pricePerKg: number;
  description?: string;
  trainNumber?: string;
  departureTime?: string;
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripInput {
  fromCity: string;
  toCity: string;
  date: Date;
  capacity: string;
  pricePerKg: number;
  description?: string;
  trainNumber?: string;
  departureTime?: string;
}
