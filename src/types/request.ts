export type RequestStatus =
  | 'pending'
  | 'matched'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface DeliveryRequest {
  id: string;
  userId: string; // Sender's user ID
  fromCity: string;
  toCity: string;
  itemType: string;
  weight: string;
  offerPrice: number;
  description?: string;
  notes?: string;
  status: RequestStatus;
  matchedTripId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestInput {
  fromCity: string;
  toCity: string;
  itemType: string;
  weight: string;
  offerPrice: number;
  description?: string;
  notes?: string;
}
