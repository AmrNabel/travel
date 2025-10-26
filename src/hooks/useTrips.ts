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
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Trip, CreateTripInput } from '@/types/trip';
import { useAuth } from '@/contexts/AuthContext';

export const useTrips = (filters?: {
  fromCity?: string;
  toCity?: string;
  userId?: string;
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    let q = query(
      collection(db, 'trips'),
      where('status', '==', 'active'),
      orderBy('date', 'desc')
    );

    // Apply filters
    if (filters?.userId) {
      q = query(collection(db, 'trips'), where('userId', '==', filters.userId));
    }
    if (filters?.fromCity) {
      q = query(q, where('fromCity', '==', filters.fromCity));
    }
    if (filters?.toCity) {
      q = query(q, where('toCity', '==', filters.toCity));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tripsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Trip[];

        setTrips(tripsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching trips:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters?.fromCity, filters?.toCity, filters?.userId]);

  const createTrip = async (tripData: CreateTripInput): Promise<string> => {
    if (!user) throw new Error('Must be authenticated');

    const docRef = await addDoc(collection(db, 'trips'), {
      ...tripData,
      userId: user.id,
      date: Timestamp.fromDate(tripData.date),
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  };

  const updateTrip = async (
    tripId: string,
    updates: Partial<CreateTripInput>
  ): Promise<void> => {
    const tripRef = doc(db, 'trips', tripId);
    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }

    await updateDoc(tripRef, updateData);
  };

  return {
    trips,
    loading,
    error,
    createTrip,
    updateTrip,
  };
};
