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
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Chat, Message, CreateMessageInput } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

export const useChat = (chatId?: string) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load user's chats
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.id),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastMessageAt: doc.data().lastMessageAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Chat[];

      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Load messages for specific chat
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Message[];

      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  const createChat = async (
    otherUserId: string,
    tripId?: string,
    requestId?: string
  ): Promise<string> => {
    if (!user) throw new Error('Must be authenticated');

    // Check if chat already exists
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.id)
    );
    const snapshot = await getDocs(q);
    const existingChat = snapshot.docs.find((doc) =>
      doc.data().participants.includes(otherUserId)
    );

    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat
    const docRef = await addDoc(collection(db, 'chats'), {
      participants: [user.id, otherUserId],
      tripId,
      requestId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  };

  const sendMessage = async (input: CreateMessageInput): Promise<void> => {
    if (!user) throw new Error('Must be authenticated');

    const messagesRef = collection(db, 'chats', input.chatId, 'messages');

    // Add message
    await addDoc(messagesRef, {
      chatId: input.chatId,
      senderId: user.id,
      text: input.text,
      read: false,
      createdAt: Timestamp.now(),
    });

    // Update chat metadata
    const chatRef = doc(db, 'chats', input.chatId);
    await updateDoc(chatRef, {
      lastMessage: input.text,
      lastMessageAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  };

  return {
    chats,
    messages,
    loading,
    createChat,
    sendMessage,
  };
};
