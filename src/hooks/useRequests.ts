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
import { DeliveryRequest, CreateRequestInput } from '@/types/request';
import { useAuth } from '@/contexts/AuthContext';

export const useRequests = (filters?: {
  fromCity?: string;
  toCity?: string;
  userId?: string;
}) => {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    // Start with base query
    let q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));

    // Apply filters
    if (filters?.userId) {
      // Fetch all requests for this specific user
      q = query(
        collection(db, 'requests'),
        where('userId', '==', filters.userId),
        orderBy('createdAt', 'desc')
      );
    } else if (filters) {
      // If filters object exists but no userId, it's from search page
      // Show only pending requests
      q = query(
        collection(db, 'requests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      // Apply city filters if they have values
      if (filters.fromCity && filters.fromCity.trim()) {
        q = query(q, where('fromCity', '==', filters.fromCity));
      }
      if (filters.toCity && filters.toCity.trim()) {
        q = query(q, where('toCity', '==', filters.toCity));
      }
    }
    // else: no filters at all - fetch all requests (for offers page)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requestsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as DeliveryRequest[];

        setRequests(requestsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching requests:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters?.fromCity, filters?.toCity, filters?.userId]);

  const createRequest = async (
    requestData: CreateRequestInput
  ): Promise<string> => {
    if (!user) throw new Error('Must be authenticated');

    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      userId: user.id,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  };

  const updateRequest = async (
    requestId: string,
    updates: Partial<CreateRequestInput>
  ): Promise<void> => {
    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  };

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequest,
  };
};
