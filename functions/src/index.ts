import * as admin from 'firebase-admin';
import { onRatingCreated } from './triggers/onRatingUpdate';
import { onMessageCreated } from './triggers/onNewMessage';

// Initialize Firebase Admin
admin.initializeApp();

// Export Cloud Functions
export { onRatingCreated, onMessageCreated };
