import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onMessageCreated = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const chatId = context.params.chatId;

    // Get chat data to find recipient
    const chatDoc = await admin
      .firestore()
      .collection('chats')
      .doc(chatId)
      .get();
    const chat = chatDoc.data();

    if (!chat) return;

    // Find recipient (not sender)
    const recipientId = chat.participants.find(
      (id: string) => id !== message.senderId
    );

    if (!recipientId) return;

    // Get recipient's FCM token
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(recipientId)
      .get();
    const user = userDoc.data();

    if (!user?.fcmToken) return;

    // Send notification
    await admin.messaging().send({
      token: user.fcmToken,
      notification: {
        title: 'New Message',
        body: message.text,
      },
      data: {
        chatId,
        type: 'new_message',
      },
    });
  });
