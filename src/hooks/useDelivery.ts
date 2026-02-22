'use client';

import {
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

export const useDelivery = () => {
  const { user } = useAuth();

  const markAsPickedUp = async (requestId: string): Promise<void> => {
    if (!user) throw new Error('Must be authenticated');

    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, {
      status: 'in_transit',
      pickedUpAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Get request details for notification
    const requestDoc = await getDoc(requestRef);
    if (requestDoc.exists()) {
      const requestData = requestDoc.data();

      // Notify sender
      await addDoc(collection(db, 'notifications'), {
        userId: requestData.userId,
        type: 'status_update',
        priority: 'medium',
        title: '📦 Item Picked Up!',
        message: `Your ${requestData.itemType} has been picked up and is now in transit.`,
        titleKey: 'notification.itemPickedUpTitle',
        messageKey: 'notification.itemPickedUpMessage',
        messageParams: { itemType: requestData.itemType ?? '' },
        actionUrl: '/my-trips',
        actionData: { requestId },
        read: false,
        createdAt: Timestamp.now(),
      });
    }
  };

  const markAsDelivered = async (requestId: string): Promise<void> => {
    if (!user) throw new Error('Must be authenticated');

    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, {
      status: 'delivered',
      deliveredAt: Timestamp.now(),
      deliveredBy: user.id,
      updatedAt: Timestamp.now(),
    });

    // Get request details for notification
    const requestDoc = await getDoc(requestRef);
    if (requestDoc.exists()) {
      const requestData = requestDoc.data();

      // Notify sender
      await addDoc(collection(db, 'notifications'), {
        userId: requestData.userId,
        type: 'delivery_confirmed',
        priority: 'high',
        title: '✅ Item Delivered!',
        message: `Your ${requestData.itemType} has been successfully delivered!`,
        titleKey: 'notification.itemDeliveredTitle',
        messageKey: 'notification.itemDeliveredMessageWithType',
        messageParams: { itemType: requestData.itemType ?? '' },
        actionUrl: '/my-trips',
        actionData: { requestId },
        read: false,
        createdAt: Timestamp.now(),
      });
    }
  };

  return {
    markAsPickedUp,
    markAsDelivered,
  };
};
