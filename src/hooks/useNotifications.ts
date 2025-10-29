'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Notification } from '@/types/notification';
import { useAuth } from '@/contexts/AuthContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          readAt: doc.data().readAt?.toDate(),
          expiresAt: doc.data().expiresAt?.toDate(),
        })) as Notification[];

        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter((n) => !n.read).length);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching notifications:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string): Promise<void> => {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, {
      read: true,
      readAt: new Date(),
    });
  };

  const markAllAsRead = async (): Promise<void> => {
    const batch = writeBatch(db);
    const unreadNotifications = notifications.filter((n) => !n.read);

    unreadNotifications.forEach((notification) => {
      const notifRef = doc(db, 'notifications', notification.id);
      batch.update(notifRef, {
        read: true,
        readAt: new Date(),
      });
    });

    await batch.commit();
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
};
