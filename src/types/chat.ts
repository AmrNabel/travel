export interface Chat {
  id: string;
  participants: string[]; // Array of user IDs [userA, userB]
  tripId?: string;
  requestId?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: Date;
}

export interface CreateMessageInput {
  chatId: string;
  text: string;
}
