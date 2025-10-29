export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'cancelled';

export interface Offer {
  id: string;
  // Parties
  senderId: string; // Person making the offer (sender)
  receiverId: string; // Person receiving offer (traveler)

  // References
  tripId: string;
  requestId: string;

  // Offer details
  offeredPrice: number;
  message?: string;
  itemDetails?: {
    type: string;
    weight: string;
    description: string;
  };

  // Status
  status: OfferStatus;

  // Timestamps
  createdAt: Date;
  respondedAt?: Date;
  expiresAt: Date;

  // Metadata
  viewed: boolean; // Has receiver seen it?
  viewedAt?: Date;
}

export interface CreateOfferInput {
  tripId: string;
  requestId: string;
  offeredPrice: number;
  message?: string;
}
