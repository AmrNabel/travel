'use client';

import {
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

export const useTrip = () => {
  const { user } = useAuth();

  const markTripAsComplete = async (tripId: string): Promise<void> => {
    if (!user) throw new Error('Must be authenticated');

    const tripRef = doc(db, 'trips', tripId);
    await updateDoc(tripRef, {
      status: 'completed',
      updatedAt: Timestamp.now(),
    });

    // Get all accepted offers for this trip
    const offersQuery = query(
      collection(db, 'offers'),
      where('tripId', '==', tripId),
      where('status', '==', 'accepted')
    );
    const offersSnapshot = await getDocs(offersQuery);

    // Update all associated requests to delivered status
    for (const offerDoc of offersSnapshot.docs) {
      const offer = offerDoc.data();
      const requestRef = doc(db, 'requests', offer.requestId);

      // Only update if not already delivered
      const requestDoc = await getDoc(requestRef);
      if (requestDoc.exists() && requestDoc.data().status !== 'delivered') {
        await updateDoc(requestRef, {
          status: 'delivered',
          deliveredAt: Timestamp.now(),
          deliveredBy: user.id,
          updatedAt: Timestamp.now(),
        });

        // Notify sender about delivery
        await addDoc(collection(db, 'notifications'), {
          userId: offer.senderId,
          type: 'delivery_confirmed',
          priority: 'high',
          title: '✅ Item Delivered!',
          message: 'Your item has been delivered! Please rate your experience.',
          actionUrl: `/profile/${user.id}`,
          actionData: {
            tripId,
            requestId: offer.requestId,
            offerId: offerDoc.id,
            travelerId: user.id,
          },
          read: false,
          createdAt: Timestamp.now(),
        });
      }
    }

    // Get trip details for notification
    const tripDoc = await getDoc(tripRef);
    if (tripDoc.exists()) {
      const tripData = tripDoc.data();

      // Notify traveler about completion and prompt for rating
      await addDoc(collection(db, 'notifications'), {
        userId: user.id,
        type: 'review_request',
        priority: 'medium',
        title: '🎉 Trip Completed!',
        message: `Your trip from ${tripData.fromCity} to ${tripData.toCity} is complete. Rate your senders!`,
        actionUrl: '/my-trips',
        actionData: { tripId },
        read: false,
        createdAt: Timestamp.now(),
      });
    }
  };

  return {
    markTripAsComplete,
  };
};
