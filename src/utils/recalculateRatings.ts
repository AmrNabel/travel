'use client';

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

/**
 * Recalculates rating statistics for a specific user
 */
export async function recalculateUserRatings(
  userId: string
): Promise<{ rating: number; totalRatings: number }> {
  try {
    // Get all ratings for this user
    const q = query(collection(db, 'ratings'), where('toUserId', '==', userId));
    const snapshot = await getDocs(q);

    const ratings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Found ${ratings.length} ratings for user ${userId}`);

    if (ratings.length === 0) {
      // No ratings - set to defaults
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        rating: 0,
        totalRatings: 0,
      });
      return { rating: 0, totalRatings: 0 };
    }

    // Calculate new average
    const totalScore = ratings.reduce(
      (sum: number, rating: any) => sum + (rating.score || 0),
      0
    );
    const averageRating = totalScore / ratings.length;

    console.log(
      `Calculated average: ${averageRating} from ${ratings.length} ratings`
    );

    // Update user document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      rating: averageRating,
      totalRatings: ratings.length,
    });

    console.log(`✅ Updated user ${userId} stats successfully`);

    return { rating: averageRating, totalRatings: ratings.length };
  } catch (error) {
    console.error('Error recalculating user ratings:', error);
    throw error;
  }
}

/**
 * Recalculates rating statistics for ALL users
 * Use this to fix existing data or run periodically
 */
export async function recalculateAllUserRatings(): Promise<{
  updated: number;
  errors: number;
}> {
  try {
    console.log('🔄 Starting recalculation for all users...');

    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Found ${users.length} users to process`);

    let updated = 0;
    let errors = 0;

    // Process each user
    for (const user of users) {
      try {
        await recalculateUserRatings(user.id);
        updated++;
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        errors++;
      }
    }

    console.log(
      `✅ Recalculation complete: ${updated} updated, ${errors} errors`
    );

    return { updated, errors };
  } catch (error) {
    console.error('Error recalculating all user ratings:', error);
    throw error;
  }
}
