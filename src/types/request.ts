export type RequestStatus =
  | 'pending'
  | 'matched'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface DeliveryRequest {
  id: string;
  userId: string;
  itemType: string;
  weight: string;
  fromCity: string;
  toCity: string;
  offerPrice: number;
  description?: string;
  status: RequestStatus;
  deliveredAt?: Date;
  deliveredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestInput {
  itemType: string;
  weight: string;
  fromCity: string;
  toCity: string;
  offerPrice: number;
  description?: string;
}
