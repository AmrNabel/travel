import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onRatingCreated = functions.firestore
  .document('ratings/{ratingId}')
  .onCreate(async (snap, context) => {
    const rating = snap.data();
    const toUserId = rating.toUserId;

    // Get all ratings for this user
    const ratingsSnapshot = await admin
      .firestore()
      .collection('ratings')
      .where('toUserId', '==', toUserId)
      .get();

    // Calculate average
    const scores = ratingsSnapshot.docs.map((doc) => doc.data().score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Update user document
    await admin.firestore().collection('users').doc(toUserId).update({
      rating: average,
      totalRatings: scores.length,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
