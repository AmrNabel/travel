'use client';

import { useState } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Rating, CreateRatingInput } from '@/types/rating';
import { useAuth } from '@/contexts/AuthContext';

export const useRatings = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const submitRating = async (input: CreateRatingInput): Promise<void> => {
    if (!user) throw new Error('Must be authenticated');

    setLoading(true);
    try {
      await addDoc(collection(db, 'ratings'), {
        ...input,
        fromUserId: user.id,
        createdAt: Timestamp.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserRatings = async (userId: string): Promise<Rating[]> => {
    const q = query(collection(db, 'ratings'), where('toUserId', '==', userId));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Rating[];
  };

  return {
    loading,
    submitRating,
    getUserRatings,
  };
};
