export type NotificationType =
  | 'offer_received' // New offer for your trip
  | 'offer_accepted' // Your offer was accepted
  | 'offer_declined' // Your offer was declined
  | 'message_received' // New chat message
  | 'status_update' // Delivery status changed
  | 'review_request' // Please leave a review
  | 'match_found' // Perfect match for your request
  | 'delivery_confirmed' // Delivery completed
  | 'payment_received'; // Payment processed

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  userId: string;

  type: NotificationType;
  priority: NotificationPriority;

  title: string;
  message: string;

  /** i18n: key for t() to render title in user language */
  titleKey?: string;
  /** i18n: key for t() to render message in user language */
  messageKey?: string;
  messageParams?: Record<string, string | number>;

  // Status
  read: boolean;
  readAt?: Date;

  // Action
  actionUrl?: string;
  actionData?: {
    offerId?: string;
    chatId?: string;
    tripId?: string;
    requestId?: string;
  };

  // Display
  icon?: string;
  avatarUrl?: string;

  // Timing
  createdAt: Date;
  expiresAt?: Date;
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  titleKey?: string;
  messageKey?: string;
  messageParams?: Record<string, string | number>;
  actionUrl?: string;
  actionData?: Record<string, string>;
  priority?: NotificationPriority;
}
