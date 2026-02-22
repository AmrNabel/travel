'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  writeBatch,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Offer, CreateOfferInput } from '@/types/offer';
import { useAuth } from '@/contexts/AuthContext';

export const useOffers = (filters?: {
  tripId?: string;
  requestId?: string;
  receiverId?: string;
  senderId?: string;
  status?: string;
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));

    // Apply filters
    if (filters?.tripId) {
      q = query(q, where('tripId', '==', filters.tripId));
    }
    if (filters?.requestId) {
      q = query(q, where('requestId', '==', filters.requestId));
    }
    if (filters?.receiverId) {
      q = query(q, where('receiverId', '==', filters.receiverId));
    }
    if (filters?.senderId) {
      q = query(q, where('senderId', '==', filters.senderId));
    }
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const offersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          respondedAt: doc.data().respondedAt?.toDate(),
          expiresAt: doc.data().expiresAt?.toDate(),
          viewedAt: doc.data().viewedAt?.toDate(),
        })) as Offer[];

        setOffers(offersData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching offers:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [
    user,
    filters?.tripId,
    filters?.requestId,
    filters?.receiverId,
    filters?.senderId,
    filters?.status,
  ]);

  const createOffer = async (input: CreateOfferInput): Promise<string> => {
    if (!user) throw new Error('Must be authenticated');

    // Get trip details to find the traveler
    const tripDoc = await getDoc(doc(db, 'trips', input.tripId));

    if (!tripDoc.exists()) throw new Error('Trip not found');
    const tripData = tripDoc.data();
    const trip = {
      id: tripDoc.id,
      ...tripData,
      date: tripData.date?.toDate(),
      createdAt: tripData.createdAt?.toDate(),
      updatedAt: tripData.updatedAt?.toDate(),
    };

    // Check if offer already exists
    const existingOffersQuery = query(
      collection(db, 'offers'),
      where('senderId', '==', user.id),
      where('tripId', '==', input.tripId),
      where('status', 'in', ['pending', 'accepted'])
    );
    const existingOffers = await getDocs(existingOffersQuery);

    if (!existingOffers.empty) {
      throw new Error('You already have a pending offer for this trip');
    }

    // Create offer
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const offerRef = await addDoc(collection(db, 'offers'), {
      senderId: user.id,
      receiverId: tripData.userId,
      tripId: input.tripId,
      requestId: input.requestId,
      offeredPrice: input.offeredPrice,
      message: input.message,
      status: 'pending',
      viewed: false,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
    });

    // Create notification for traveler immediately
    await addDoc(collection(db, 'notifications'), {
      userId: tripData.userId,
      type: 'offer_received',
      priority: 'high',
      title: '📬 New Offer Received!',
      message: `${user.name} sent you an offer of $${input.offeredPrice} for your trip to ${tripData.toCity || 'destination'}`,
      titleKey: 'notification.offerReceivedTitle',
      messageKey: 'notification.offerReceivedMessage',
      messageParams: {
        name: user.name ?? '',
        price: input.offeredPrice,
        city: tripData.toCity || 'destination',
      },
      actionUrl: '/offers',
      actionData: {
        offerId: offerRef.id,
        tripId: input.tripId,
      },
      read: false,
      createdAt: Timestamp.now(),
    });

    return offerRef.id;
  };

  const acceptOffer = async (offerId: string): Promise<void> => {
    if (!user) throw new Error('Must be authenticated');

    try {
      // Get the offer details
      const offerDoc = await getDoc(doc(db, 'offers', offerId));
      if (!offerDoc.exists()) throw new Error('Offer not found');

      const offer = { id: offerDoc.id, ...offerDoc.data() } as Offer;
      const { senderId, receiverId, tripId, requestId } = offer;

      // Start a batch write for atomic updates
      const batch = writeBatch(db);

      // 1. Update offer status to 'accepted'
      const offerRef = doc(db, 'offers', offerId);
      batch.update(offerRef, {
        status: 'accepted',
        respondedAt: Timestamp.now(),
      });

      // 2. Update request status to 'matched'
      const requestRef = doc(db, 'requests', requestId);
      batch.update(requestRef, {
        status: 'matched',
        matchedTripId: tripId,
        matchedTravelerId: receiverId,
        acceptedOfferId: offerId,
        updatedAt: Timestamp.now(),
      });

      // 3. Decline all other pending offers for this request
      const otherOffersQuery = query(
        collection(db, 'offers'),
        where('requestId', '==', requestId),
        where('status', '==', 'pending')
      );
      const otherOffersSnapshot = await getDocs(otherOffersQuery);

      otherOffersSnapshot.docs.forEach((offerDoc) => {
        if (offerDoc.id !== offerId) {
          batch.update(doc(db, 'offers', offerDoc.id), {
            status: 'declined',
            respondedAt: Timestamp.now(),
          });

          // Create notification for declined offer sender
          const declinedNotifRef = doc(collection(db, 'notifications'));
          batch.set(declinedNotifRef, {
            userId: offerDoc.data().senderId,
            type: 'offer_declined',
            priority: 'medium',
            title: 'Offer Not Selected',
            message: 'The traveler selected another offer for this delivery.',
            titleKey: 'notification.offerDeclinedTitle',
            messageKey: 'notification.offerDeclinedMessage',
            actionUrl: '/search',
            read: false,
            createdAt: Timestamp.now(),
          });
        }
      });

      // Commit all updates atomically
      await batch.commit();

      // 4. Create or get chat between parties (separate transaction)
      const chatId = await findOrCreateChat(
        senderId,
        receiverId,
        tripId,
        requestId
      );

      // 5. Create success notifications for both parties
      await Promise.all([
        // Notification for sender (their offer was accepted)
        addDoc(collection(db, 'notifications'), {
          userId: senderId,
          type: 'offer_accepted',
          priority: 'high',
          title: '🎉 Offer Accepted!',
          message:
            'Your offer has been accepted. Start chatting to coordinate!',
          titleKey: 'notification.offerAcceptedTitle',
          messageKey: 'notification.offerAcceptedMessage',
          actionUrl: `/chats/${chatId}`,
          actionData: { offerId, chatId, requestId, tripId },
          read: false,
          createdAt: Timestamp.now(),
        }),

        // Notification for receiver (they accepted an offer)
        addDoc(collection(db, 'notifications'), {
          userId: receiverId,
          type: 'match_found',
          priority: 'high',
          title: 'Match Confirmed!',
          message: 'You accepted an offer. Chat is ready for coordination.',
          titleKey: 'notification.matchFoundTitle',
          messageKey: 'notification.matchFoundMessage',
          actionUrl: `/chats/${chatId}`,
          actionData: { offerId, chatId, requestId, tripId },
          read: false,
          createdAt: Timestamp.now(),
        }),
      ]);

      console.log(`Offer ${offerId} accepted and processed successfully`);
    } catch (error) {
      console.error('Error accepting offer:', error);
      throw error;
    }
  };

  const declineOffer = async (offerId: string): Promise<void> => {
    if (!user) throw new Error('Must be authenticated');

    const offerRef = doc(db, 'offers', offerId);

    await updateDoc(offerRef, {
      status: 'declined',
      respondedAt: Timestamp.now(),
    });
  };

  const markOfferViewed = async (offerId: string): Promise<void> => {
    const offerRef = doc(db, 'offers', offerId);

    await updateDoc(offerRef, {
      viewed: true,
      viewedAt: Timestamp.now(),
    });
  };

  return {
    offers,
    loading,
    error,
    createOffer,
    acceptOffer,
    declineOffer,
    markOfferViewed,
  };
};

// Helper function to find or create chat
const findOrCreateChat = async (
  senderId: string,
  receiverId: string,
  tripId: string,
  requestId: string
): Promise<string> => {
  // Check if chat already exists
  const chatsQuery = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', senderId)
  );
  const chatsSnapshot = await getDocs(chatsQuery);

  for (const chatDoc of chatsSnapshot.docs) {
    const participants = chatDoc.data().participants;
    if (participants.includes(receiverId)) {
      return chatDoc.id;
    }
  }

  // Create new chat if it doesn't exist
  const chatRef = await addDoc(collection(db, 'chats'), {
    participants: [senderId, receiverId],
    tripId,
    requestId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return chatRef.id;
};
