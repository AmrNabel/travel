'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User, CreateUserInput } from '@/types/user';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: CreateUserInput
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (
    firebaseUser: FirebaseUser
  ): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await fetchUserData(firebaseUser);
      setUser(userData);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    userData: CreateUserInput
  ) => {
    // Create Firebase auth user
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name
    await updateProfile(firebaseUser, {
      displayName: userData.name,
    });

    // Send verification email
    await sendEmailVerification(firebaseUser);

    // Create user document in Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      rating: 0,
      totalRatings: 0,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Check if user document already exists
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      // Create user document for new Google user
      const userData: CreateUserInput = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: 'both',
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        photoURL: firebaseUser.photoURL,
        rating: 0,
        totalRatings: 0,
        verified: firebaseUser.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  const signInAnonymously = async () => {
    const result = await firebaseSignInAnonymously(auth);
    const firebaseUser = result.user;

    // Generate a default display name
    const guestName = `Guest User ${firebaseUser.uid.slice(0, 8)}`;

    // Update Firebase profile with display name
    await updateProfile(firebaseUser, {
      displayName: guestName,
    });

    // Create user document for anonymous user
    const userData: CreateUserInput = {
      email: '',
      name: guestName,
      role: 'both',
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      rating: 0,
      totalRatings: 0,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInAnonymously,
    signOut,
    refreshUser,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
