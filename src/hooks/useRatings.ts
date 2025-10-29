'use client';

import { useState } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
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
      // Filter out undefined values - Firebase doesn't like them
      const ratingData: any = {
        fromUserId: user.id,
        toUserId: input.toUserId,
        score: input.score,
        createdAt: Timestamp.now(),
      };

      // Only add optional fields if they have values
      if (input.tripId) ratingData.tripId = input.tripId;
      if (input.requestId) ratingData.requestId = input.requestId;
      if (input.comment) ratingData.comment = input.comment;

      // Add the rating
      await addDoc(collection(db, 'ratings'), ratingData);

      // Update user's rating statistics
      await updateUserRatingStats(input.toUserId);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRatingStats = async (userId: string): Promise<void> => {
    try {
      // Get all ratings for this user
      const ratings = await getUserRatings(userId);

      if (ratings.length === 0) return;

      // Calculate new average
      const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
      const averageRating = totalScore / ratings.length;

      // Update user document
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        rating: averageRating,
        totalRatings: ratings.length,
      });
    } catch (error) {
      console.error('Error updating user rating stats:', error);
      // Don't throw - rating was already saved
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

  const getUserRatingsWithDetails = async (
    userId: string
  ): Promise<(Rating & { fromUserName?: string })[]> => {
    const ratings = await getUserRatings(userId);

    // Fetch user details for each rating
    const ratingsWithDetails = await Promise.all(
      ratings.map(async (rating) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', rating.fromUserId));
          const userData = userDoc.data();
          return {
            ...rating,
            fromUserName: userData?.name || 'Anonymous',
          };
        } catch (error) {
          console.error('Error fetching user details:', error);
          return {
            ...rating,
            fromUserName: 'Anonymous',
          };
        }
      })
    );

    return ratingsWithDetails;
  };

  return {
    loading,
    submitRating,
    createRating: submitRating, // Alias for consistency with other hooks
    getUserRatings,
    getUserRatingsWithDetails,
    updateUserRatingStats,
  };
};
