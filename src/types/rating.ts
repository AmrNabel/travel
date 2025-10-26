export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  tripId?: string;
  requestId?: string;
  score: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface CreateRatingInput {
  toUserId: string;
  tripId?: string;
  requestId?: string;
  score: number;
  comment?: string;
}
