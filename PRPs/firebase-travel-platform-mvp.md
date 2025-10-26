name: "Firebase Travel Platform MVP - Complete Implementation"
description: |
Build a complete serverless travel/shipping platform MVP using Firebase backend services
and Next.js frontend - enabling travelers to deliver items for senders along their routes.

## Goal

Build a production-ready MVP of a peer-to-peer travel delivery platform where:

- **Travelers** post their upcoming trips and available capacity
- **Senders** post items they need delivered
- Both parties can search, match, chat, and rate each other
- Everything runs serverless using Firebase (Auth, Firestore, Storage, Cloud Functions, FCM)
- Modern, responsive UI using Next.js 14+ and Material-UI

**End State**: A fully functional web app deployable to Vercel with Firebase backend, ready for real users.

## Why

- **Business Value**: Creates a marketplace connecting two user groups with complementary needs
- **User Impact**: Enables affordable shipping via travelers + extra income for travelers
- **Technical Goals**: Demonstrate Firebase-first architecture with no dedicated backend server
- **MVP Speed**: Serverless approach allows rapid iteration without infrastructure management

## What

A web application with the following user-visible features:

### Core Features

1. **Authentication**: Email/phone signup with verification
2. **Trip Management**: Travelers create/edit/view their trips with route, date, capacity, price
3. **Request Management**: Senders create/edit/view delivery requests
4. **Search & Discovery**: Find matching trips or requests by route and date
5. **Real-time Chat**: In-app messaging between matched users
6. **Rating System**: Post-delivery mutual ratings affecting user reputation
7. **User Profiles**: View user info, ratings, history, verification status

### Technical Requirements

- TypeScript for type safety
- Responsive design (mobile-first)
- Real-time updates where appropriate (chat, new matches)
- Proper error handling and loading states
- Firebase Security Rules preventing unauthorized access
- Cloud Functions for notifications and background tasks

### Success Criteria

- [ ] User can sign up, verify email, and log in
- [ ] Traveler can post a trip with all required details
- [ ] Sender can post an item delivery request
- [ ] Users can search trips/requests by city and date
- [ ] Matched users can chat in real-time
- [ ] Users can view each other's profiles with ratings
- [ ] After delivery, both parties can rate each other
- [ ] Average ratings calculate and display correctly
- [ ] All Firebase Security Rules prevent unauthorized data access
- [ ] App deploys successfully to Vercel
- [ ] No TypeScript errors, all linting passes

## All Needed Context

### Documentation & References

```yaml
# Firebase Core Documentation
- url: https://firebase.google.com/docs/web/setup
  why: Essential setup for Firebase in Next.js, initialization patterns
  sections: ['Install SDK', 'Initialize Firebase', 'Multiple environments']

- url: https://firebase.google.com/docs/auth/web/start
  why: Authentication flows, email/phone verification
  sections: ['Sign up new users', 'Sign in users', 'Email verification']
  critical: Must verify email before full access

- url: https://firebase.google.com/docs/firestore/quickstart
  why: Firestore CRUD operations, real-time listeners, queries
  sections: ['Add data', 'Read data', 'Real-time updates', 'Compound queries']
  critical: Compound queries require composite indexes

- url: https://firebase.google.com/docs/firestore/security/get-started
  why: Security rules syntax and patterns
  sections: ['Authentication-based rules', 'Data validation', 'Functions']
  critical: Rules must explicitly allow operations, default is deny

- url: https://firebase.google.com/docs/storage/web/start
  why: Upload user photos and ID documents
  sections: ['Upload files', 'Download URLs', 'Metadata', 'Security rules']

- url: https://firebase.google.com/docs/functions/get-started
  why: Cloud Functions for notifications and background tasks
  sections: ['Write functions', 'Firestore triggers', 'HTTPS endpoints']
  critical: Functions run in Node.js environment, need deployment config

- url: https://firebase.google.com/docs/cloud-messaging/js/client
  why: Push notifications for new messages and matches
  sections:
    ['Request permission', 'Receive messages', 'Background notifications']

# Next.js Documentation
- url: https://nextjs.org/docs/getting-started/installation
  why: Project setup with TypeScript and App Router
  sections: ['Automatic Installation', 'TypeScript', 'App Router']

- url: https://nextjs.org/docs/app/building-your-application/routing
  why: App Router structure, dynamic routes, route groups
  sections: ['Defining Routes', 'Dynamic Routes', 'Route Handlers']

- url: https://nextjs.org/docs/app/building-your-application/data-fetching
  why: Client vs server components, data fetching patterns
  sections: ['Server Components', 'Client Components', 'use client directive']
  critical: Firebase client SDK needs 'use client' directive

- url: https://nextjs.org/docs/app/api-reference/functions/use-router
  why: Navigation and routing in App Router
  sections: ['useRouter hook', 'push method', 'redirect']

# Material-UI Documentation
- url: https://mui.com/material-ui/getting-started/installation/
  why: UI component library setup and theming
  sections: ['Installation', 'Usage', 'Theming', 'Emotion/styled-components']

- url: https://mui.com/material-ui/react-text-field/
  why: Form inputs for trip and request creation
  sections: ['Basic TextField', 'Validation', 'Helper text']

- url: https://mui.com/material-ui/react-autocomplete/
  why: City selection with autocomplete
  sections: ['Combo box', 'Controlled state']

- url: https://mui.com/material-ui/customization/theming/
  why: Custom theme matching brand colors
  sections: ['createTheme', 'ThemeProvider', 'Palette']

# Best Practices & Patterns
- url: https://github.com/vercel/next.js/tree/canary/examples/with-firebase
  why: Official Next.js + Firebase example
  sections: ['Project structure', 'Firebase initialization', 'Auth context']

- url: https://github.com/firebase/quickstart-js/tree/master/firestore
  why: Firestore patterns and best practices
  sections: ['Data modeling', 'Query examples', 'Security rules examples']

- url: https://firebase.google.com/docs/firestore/best-practices
  why: Avoid common pitfalls
  critical: |
    - Avoid unbounded arrays (chats should be separate collection)
    - Use subcollections for scaling
    - Denormalize data for read performance
    - Limit document size to < 1MB

# TypeScript + Firebase
- url: https://firebase.google.com/docs/reference/js
  why: TypeScript type definitions for Firebase SDK
  sections: ['Type annotations', 'Generic types for collections']
```

### Current Codebase Structure

```bash
/Users/amr/Documents/travel/
├── INITIAL.md                    # Feature specification
├── PRPs/
│   ├── templates/
│   │   └── prp_base.md          # PRP template
│   └── firebase-travel-platform-mvp.md  # This PRP
```

### Desired Codebase Structure (After Implementation)

```bash
travel/
├── .env.local                    # Firebase config (gitignored)
├── .env.example                  # Template for env vars
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore file
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── firebase.json                # Firebase project config
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore composite indexes
├── storage.rules                # Storage security rules
│
├── public/                      # Static assets
│   └── firebase-messaging-sw.js # Service worker for FCM
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home/landing page
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   ├── add-trip/
│   │   │   └── page.tsx         # Create trip (traveler)
│   │   ├── send-item/
│   │   │   └── page.tsx         # Create request (sender)
│   │   ├── search/
│   │   │   └── page.tsx         # Search trips/requests
│   │   ├── chats/
│   │   │   ├── page.tsx         # Chat list
│   │   │   └── [chatId]/
│   │   │       └── page.tsx     # Individual chat
│   │   ├── profile/
│   │   │   └── [userId]/
│   │   │       └── page.tsx     # User profile view
│   │   └── api/                 # API routes (if needed)
│   │
│   ├── components/              # React components
│   │   ├── auth/
│   │   │   ├── AuthGuard.tsx    # Protected route wrapper
│   │   │   ├── LoginForm.tsx    # Login form component
│   │   │   └── SignupForm.tsx   # Signup form component
│   │   ├── trips/
│   │   │   ├── TripCard.tsx     # Trip display card
│   │   │   ├── TripForm.tsx     # Create/edit trip form
│   │   │   └── TripList.tsx     # List of trips
│   │   ├── requests/
│   │   │   ├── RequestCard.tsx  # Request display card
│   │   │   ├── RequestForm.tsx  # Create/edit request form
│   │   │   └── RequestList.tsx  # List of requests
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx   # Chat interface
│   │   │   ├── MessageList.tsx  # Message display
│   │   │   └── MessageInput.tsx # Message input field
│   │   ├── profile/
│   │   │   ├── ProfileView.tsx  # User profile display
│   │   │   ├── RatingStars.tsx  # Star rating component
│   │   │   └── RatingForm.tsx   # Submit rating form
│   │   ├── search/
│   │   │   ├── SearchBar.tsx    # Search input
│   │   │   └── SearchResults.tsx# Results display
│   │   └── common/
│   │       ├── Layout.tsx       # Page layout wrapper
│   │       ├── Navbar.tsx       # Navigation bar
│   │       ├── Loading.tsx      # Loading spinner
│   │       └── ErrorBoundary.tsx# Error boundary
│   │
│   ├── lib/                     # Core utilities
│   │   ├── firebase/
│   │   │   ├── config.ts        # Firebase initialization
│   │   │   ├── auth.ts          # Auth helper functions
│   │   │   ├── firestore.ts     # Firestore helper functions
│   │   │   ├── storage.ts       # Storage helper functions
│   │   │   └── fcm.ts           # Cloud messaging setup
│   │   └── utils/
│   │       ├── dateHelpers.ts   # Date formatting utilities
│   │       ├── validation.ts    # Input validation
│   │       └── constants.ts     # App constants
│   │
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx      # Auth state management
│   │   └── ThemeContext.tsx     # MUI theme provider
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Auth hook
│   │   ├── useTrips.ts          # Trips data hook
│   │   ├── useRequests.ts       # Requests data hook
│   │   ├── useChat.ts           # Chat data hook
│   │   └── useNotifications.ts  # FCM hook
│   │
│   └── types/                   # TypeScript types
│       ├── user.ts              # User type definitions
│       ├── trip.ts              # Trip type definitions
│       ├── request.ts           # Request type definitions
│       ├── chat.ts              # Chat type definitions
│       └── rating.ts            # Rating type definitions
│
├── functions/                   # Firebase Cloud Functions
│   ├── package.json             # Functions dependencies
│   ├── tsconfig.json            # Functions TypeScript config
│   └── src/
│       ├── index.ts             # Functions entry point
│       ├── triggers/
│       │   ├── onNewMessage.ts  # Notify on new chat message
│       │   ├── onNewMatch.ts    # Notify on trip/request match
│       │   └── onRatingUpdate.ts# Update user average rating
│       └── utils/
│           └── admin.ts         # Firebase Admin SDK setup
│
└── README.md                    # Project documentation
```

### Known Gotchas & Critical Patterns

```typescript
// CRITICAL: Firebase needs 'use client' in Next.js App Router
// All components using Firebase client SDK must be client components
'use client';
import { auth, db } from '@/lib/firebase/config';

// GOTCHA: Firestore timestamp requires special handling
import { serverTimestamp, Timestamp } from 'firebase/firestore';
// Use serverTimestamp() for new docs, Timestamp.fromDate() for specific dates

// PATTERN: Always handle auth state changes
import { onAuthStateChanged } from 'firebase/auth';
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    // Handle user state
  });
  return () => unsubscribe(); // CRITICAL: Cleanup listener
}, []);

// GOTCHA: Firestore queries require composite indexes for multiple where clauses
// Example: Searching by fromCity AND toCity requires an index
// Firebase will show error with link to auto-create index in console

// PATTERN: Real-time listeners must be cleaned up
import { onSnapshot, collection, query } from 'firebase/firestore';
useEffect(() => {
  const q = query(collection(db, 'chats'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    // Handle data
  });
  return () => unsubscribe(); // CRITICAL: Prevent memory leaks
}, []);

// GOTCHA: Security rules are NOT filters - queries must match rules
// If rule requires userId == auth.uid, query must include where('userId', '==', currentUserId)

// PATTERN: MUI ThemeProvider must wrap entire app
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// CssBaseline normalizes styles across browsers

// GOTCHA: Environment variables in Next.js must be prefixed with NEXT_PUBLIC_
// for client-side access
// .env.local:
// NEXT_PUBLIC_FIREBASE_API_KEY=your_key
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain

// CRITICAL: Never commit Firebase credentials to git
// Use .env.local (gitignored) and provide .env.example template

// PATTERN: Type Firestore collections for type safety
import { CollectionReference, collection } from 'firebase/firestore';
import { User, Trip } from '@/types';
const usersCol = collection(db, 'users') as CollectionReference<User>;
const tripsCol = collection(db, 'trips') as CollectionReference<Trip>;

// GOTCHA: Firebase Storage requires proper CORS configuration
// Must configure CORS for download URLs to work in browser

// PATTERN: Loading and error states for all async operations
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
try {
  setLoading(true);
  setError(null);
  // Firebase operation
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

## Implementation Blueprint

### Phase 1: Project Setup & Configuration

**Task 1.1: Initialize Next.js Project**

```bash
npx create-next-app@latest travel-platform --typescript --tailwind --app --src-dir --import-alias "@/*"
cd travel-platform
```

**Task 1.2: Install Core Dependencies**

```bash
npm install firebase
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install date-fns # Date manipulation
npm install react-hook-form # Form handling
npm install zod # Validation schemas
```

**Task 1.3: Install Dev Dependencies**

```bash
npm install -D @types/node
npm install -D eslint-config-next
npm install -D prettier eslint-config-prettier
```

**Task 1.4: Create Environment Configuration**

CREATE `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

CREATE `.env.example` (template for other developers):

```bash
# Copy this to .env.local and fill in your Firebase config values
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

UPDATE `.gitignore`:

```bash
# Add to existing .gitignore
.env.local
.env*.local
functions/.env
```

**Task 1.5: Configure TypeScript**

UPDATE `tsconfig.json` to include strict mode and path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Phase 2: Firebase Initialization & Core Types

**Task 2.1: Define TypeScript Types**

CREATE `src/types/user.ts`:

```typescript
export type UserRole = 'traveler' | 'sender' | 'both';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  photoURL?: string;
  rating: number;
  totalRatings: number; // For calculating average
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
}
```

CREATE `src/types/trip.ts`:

```typescript
export type TripStatus = 'active' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  userId: string; // Traveler's user ID
  fromCity: string;
  toCity: string;
  date: Date;
  capacity: string; // e.g., "10kg"
  pricePerKg: number;
  description?: string;
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripInput {
  fromCity: string;
  toCity: string;
  date: Date;
  capacity: string;
  pricePerKg: number;
  description?: string;
}
```

CREATE `src/types/request.ts`:

```typescript
export type RequestStatus =
  | 'pending'
  | 'matched'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface DeliveryRequest {
  id: string;
  userId: string; // Sender's user ID
  fromCity: string;
  toCity: string;
  itemType: string;
  weight: string;
  offerPrice: number;
  description?: string;
  notes?: string;
  status: RequestStatus;
  matchedTripId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestInput {
  fromCity: string;
  toCity: string;
  itemType: string;
  weight: string;
  offerPrice: number;
  description?: string;
  notes?: string;
}
```

CREATE `src/types/chat.ts`:

```typescript
export interface Chat {
  id: string;
  participants: string[]; // Array of user IDs [userA, userB]
  tripId?: string;
  requestId?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: Date;
}

export interface CreateMessageInput {
  chatId: string;
  text: string;
}
```

CREATE `src/types/rating.ts`:

```typescript
export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  tripId?: string;
  requestId?: string;
  score: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface CreateRatingInput {
  toUserId: string;
  tripId?: string;
  requestId?: string;
  score: number;
  comment?: string;
}
```

**Task 2.2: Initialize Firebase**

CREATE `src/lib/firebase/config.ts`:

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// PATTERN: Initialize only once
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// GOTCHA: Messaging only works in browser, not SSR
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export default app;
```

**Task 2.3: Create Firebase Helper Functions**

CREATE `src/lib/firebase/firestore.ts`:

```typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  CollectionReference,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

// PATTERN: Generic helper for type-safe Firestore operations
export const getCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

// Convert Firestore timestamp to Date
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.seconds) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }
  return new Date(timestamp);
};

// PATTERN: Add document with auto-generated ID
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const col = getCollection(collectionName);
  const now = Timestamp.now();
  const docRef = await addDoc(col, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

// PATTERN: Get single document by ID
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as T;
};

// PATTERN: Update document
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<Omit<T, 'id' | 'createdAt'>>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// PATTERN: Delete document
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// PATTERN: Query documents
export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  const col = getCollection<T>(collectionName);
  const q = query(col, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as T)
  );
};
```

### Phase 3: Authentication System

**Task 3.1: Create Auth Context**

CREATE `src/contexts/AuthContext.tsx`:

```typescript
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
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
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

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    user,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

**Task 3.2: Create Auth Guard Component**

CREATE `src/components/auth/AuthGuard.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};
```

**Task 3.3: Create Login Form**

CREATE `src/components/auth/LoginForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
    >
      <Typography variant='h4' component='h1' gutterBottom>
        Sign In
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label='Email'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        margin='normal'
      />

      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <Typography variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
        Don't have an account?{' '}
        <Link href='/signup' passHref legacyBehavior>
          <MuiLink>Sign Up</MuiLink>
        </Link>
      </Typography>
    </Box>
  );
};
```

**Task 3.4: Create Signup Form**

CREATE `src/components/auth/SignupForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'both' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
      });

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
    >
      <Typography variant='h4' component='h1' gutterBottom>
        Sign Up
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label='Full Name'
        name='name'
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Email'
        name='email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Phone (Optional)'
        name='phone'
        type='tel'
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin='normal'
      />

      <FormControl component='fieldset' sx={{ mt: 2 }}>
        <FormLabel component='legend'>I want to:</FormLabel>
        <RadioGroup name='role' value={formData.role} onChange={handleChange}>
          <FormControlLabel
            value='traveler'
            control={<Radio />}
            label='Deliver items as a traveler'
          />
          <FormControlLabel
            value='sender'
            control={<Radio />}
            label='Send items with travelers'
          />
          <FormControlLabel value='both' control={<Radio />} label='Both' />
        </RadioGroup>
      </FormControl>

      <TextField
        label='Password'
        name='password'
        type='password'
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
        helperText='At least 6 characters'
      />

      <TextField
        label='Confirm Password'
        name='confirmPassword'
        type='password'
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>

      <Typography variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link href='/login' passHref legacyBehavior>
          <MuiLink>Sign In</MuiLink>
        </Link>
      </Typography>
    </Box>
  );
};
```

### Phase 4: Trip Management

**Task 4.1: Create Trip Service Hook**

CREATE `src/hooks/useTrips.ts`:

```typescript
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
    const updateData: any = {
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
```

**Task 4.2: Create Trip Form Component**

CREATE `src/components/trips/TripForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, Alert, Grid } from '@mui/material';
import { CreateTripInput } from '@/types/trip';
import { useTrips } from '@/hooks/useTrips';

export const TripForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateTripInput>({
    fromCity: '',
    toCity: '',
    date: new Date(),
    capacity: '',
    pricePerKg: 0,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createTrip } = useTrips();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pricePerKg' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tripId = await createTrip(formData);
      router.push(`/trips/${tripId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}
    >
      <Typography variant='h4' component='h1' gutterBottom>
        Post a Trip
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label='From City'
            name='fromCity'
            value={formData.fromCity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='To City'
            name='toCity'
            value={formData.toCity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='Travel Date'
            name='date'
            type='date'
            value={formData.date.toISOString().split('T')[0]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                date: new Date(e.target.value),
              }))
            }
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label='Capacity (e.g., 10kg)'
            name='capacity'
            value={formData.capacity}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label='Price per Kg'
            name='pricePerKg'
            type='number'
            value={formData.pricePerKg}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label='Description (Optional)'
            name='description'
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? 'Creating Trip...' : 'Post Trip'}
      </Button>
    </Box>
  );
};
```

**Task 4.3: Create Trip Card Component**

CREATE `src/components/trips/TripCard.tsx`:

```typescript
'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { Trip } from '@/types/trip';
import { format } from 'date-fns';

interface TripCardProps {
  trip: Trip;
  onContact?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onContact }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='start'>
          <Box>
            <Typography variant='h6' component='div'>
              {trip.fromCity} → {trip.toCity}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {format(trip.date, 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Chip
            label={trip.status}
            color={trip.status === 'active' ? 'success' : 'default'}
            size='small'
          />
        </Box>

        <Box mt={2}>
          <Typography variant='body2'>
            <strong>Capacity:</strong> {trip.capacity}
          </Typography>
          <Typography variant='body2'>
            <strong>Price:</strong> ${trip.pricePerKg}/kg
          </Typography>
          {trip.description && (
            <Typography variant='body2' mt={1}>
              {trip.description}
            </Typography>
          )}
        </Box>

        {onContact && (
          <Button
            variant='contained'
            size='small'
            onClick={onContact}
            sx={{ mt: 2 }}
          >
            Contact Traveler
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
```

### Phase 5: Request Management (Similar to Trips)

**Task 5.1: Create Requests Hook**

CREATE `src/hooks/useRequests.ts`:

```typescript
// PATTERN: Mirror useTrips.ts structure
// Replace 'trips' with 'requests' and Trip with DeliveryRequest
// Keep same filtering, real-time updates, CRUD operations
// Reference: src/hooks/useTrips.ts for pattern
```

**Task 5.2: Create Request Form**

CREATE `src/components/requests/RequestForm.tsx`:

```typescript
// PATTERN: Mirror TripForm.tsx structure
// Adjust fields: itemType, weight, offerPrice, notes
// Reference: src/components/trips/TripForm.tsx for pattern
```

**Task 5.3: Create Request Card**

CREATE `src/components/requests/RequestCard.tsx`:

```typescript
// PATTERN: Mirror TripCard.tsx structure
// Display request-specific fields
// Reference: src/components/trips/TripCard.tsx for pattern
```

### Phase 6: Chat System

**Task 6.1: Create Chat Hook**

CREATE `src/hooks/useChat.ts`:

```typescript
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
```

**Task 6.2: Create Chat Window Component**

CREATE `src/components/chat/ChatWindow.tsx`:

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ChatWindowProps {
  chatId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [messageText, setMessageText] = useState('');
  const { messages, sendMessage } = useChat(chatId);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await sendMessage({ chatId, text: messageText });
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Messages List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: isOwn ? 'primary.main' : 'grey.200',
                    color: isOwn ? 'white' : 'text.primary',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <Typography variant='body1'>{message.text}</Typography>
                  <Typography variant='caption' sx={{ opacity: 0.7 }}>
                    {format(message.createdAt, 'HH:mm')}
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component='form'
        onSubmit={handleSend}
        sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
      >
        <Box display='flex' gap={1}>
          <TextField
            fullWidth
            placeholder='Type a message...'
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            size='small'
          />
          <IconButton type='submit' color='primary'>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};
```

### Phase 7: Rating System

**Task 7.1: Create Rating Hook**

CREATE `src/hooks/useRatings.ts`:

```typescript
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
```

**Task 7.2: Create Rating Form Component**

CREATE `src/components/profile/RatingForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Rating as MuiRating,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { CreateRatingInput } from '@/types/rating';
import { useRatings } from '@/hooks/useRatings';

interface RatingFormProps {
  toUserId: string;
  tripId?: string;
  requestId?: string;
  onSuccess?: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({
  toUserId,
  tripId,
  requestId,
  onSuccess,
}) => {
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { submitRating, loading } = useRatings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await submitRating({
        toUserId,
        tripId,
        requestId,
        score,
        comment: comment || undefined,
      });

      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating');
    }
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <Typography variant='h6' gutterBottom>
        Rate Your Experience
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography component='legend'>Rating</Typography>
        <MuiRating
          value={score}
          onChange={(_, value) => setScore(value || 5)}
          size='large'
        />
      </Box>

      <TextField
        label='Comment (Optional)'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      <Button type='submit' variant='contained' fullWidth disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </Box>
  );
};
```

### Phase 8: Pages & Routing

**Task 8.1: Create Root Layout with Providers**

CREATE `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export const metadata: Metadata = {
  title: 'Travel Delivery Platform',
  description: 'Connect travelers with senders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Task 8.2: Create Login Page**

CREATE `src/app/login/page.tsx`:

```typescript
'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { Container } from '@mui/material';

export default function LoginPage() {
  return (
    <Container maxWidth='sm'>
      <LoginForm />
    </Container>
  );
}
```

**Task 8.3: Create Signup Page**

CREATE `src/app/signup/page.tsx`:

```typescript
'use client';

import { SignupForm } from '@/components/auth/SignupForm';
import { Container } from '@mui/material';

export default function SignupPage() {
  return (
    <Container maxWidth='sm'>
      <SignupForm />
    </Container>
  );
}
```

**Task 8.4: Create Add Trip Page**

CREATE `src/app/add-trip/page.tsx`:

```typescript
'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { TripForm } from '@/components/trips/TripForm';
import { Container } from '@mui/material';

export default function AddTripPage() {
  return (
    <AuthGuard>
      <Container maxWidth='md'>
        <TripForm />
      </Container>
    </AuthGuard>
  );
}
```

**Task 8.5: Create Send Item Page**

CREATE `src/app/send-item/page.tsx`:

```typescript
'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { RequestForm } from '@/components/requests/RequestForm';
import { Container } from '@mui/material';

export default function SendItemPage() {
  return (
    <AuthGuard>
      <Container maxWidth='md'>
        <RequestForm />
      </Container>
    </AuthGuard>
  );
}
```

**Task 8.6: Create Search Page**

CREATE `src/app/search/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { useTrips } from '@/hooks/useTrips';
import { useRequests } from '@/hooks/useRequests';
import { TripCard } from '@/components/trips/TripCard';
import { RequestCard } from '@/components/requests/RequestCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    fromCity: '',
    toCity: '',
  });
  const [activeTab, setActiveTab] = useState(0);

  const { trips, loading: tripsLoading } = useTrips(searchParams);
  const { requests, loading: requestsLoading } = useRequests(searchParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is reactive, so this just triggers re-query
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Search
      </Typography>

      <Box component='form' onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField
              label='From City'
              value={searchParams.fromCity}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  fromCity: e.target.value,
                }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label='To City'
              value={searchParams.toCity}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, toCity: e.target.value }))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 2 }}
      >
        <Tab label='Trips' />
        <Tab label='Requests' />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {tripsLoading ? (
            <Typography>Loading...</Typography>
          ) : trips.length === 0 ? (
            <Typography>No trips found</Typography>
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {requestsLoading ? (
            <Typography>Loading...</Typography>
          ) : requests.length === 0 ? (
            <Typography>No requests found</Typography>
          ) : (
            requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </Box>
      )}
    </Container>
  );
}
```

**Task 8.7: Create Chat Page**

CREATE `src/app/chats/[chatId]/page.tsx`:

```typescript
'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Container } from '@mui/material';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return (
    <AuthGuard>
      <Container maxWidth='md' sx={{ mt: 4 }}>
        <ChatWindow chatId={params.chatId} />
      </Container>
    </AuthGuard>
  );
}
```

### Phase 9: Firebase Security Rules

**Task 9.1: Create Firestore Security Rules**

CREATE `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false; // Never allow deletion
    }

    // Trips collection
    match /trips/{tripId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Requests collection
    match /requests/{requestId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Chats collection
    match /chats/{chatId} {
      allow read: if isAuthenticated() && request.auth.uid in resource.data.participants;
      allow create: if isAuthenticated() && request.auth.uid in request.resource.data.participants;
      allow update: if isAuthenticated() && request.auth.uid in resource.data.participants;

      // Messages subcollection
      match /messages/{messageId} {
        allow read: if isAuthenticated() && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow create: if isAuthenticated() && request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }

    // Ratings collection
    match /ratings/{ratingId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.fromUserId == request.auth.uid;
      allow update, delete: if false; // Ratings are immutable
    }
  }
}
```

**Task 9.2: Create Storage Security Rules**

CREATE `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // User profile photos
    match /users/{userId}/profile/{fileName} {
      allow read: if true; // Anyone can view profile photos
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // User ID documents (private)
    match /users/{userId}/documents/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Task 9.3: Create Firestore Indexes Configuration**

CREATE `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "trips",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "fromCity", "order": "ASCENDING" },
        { "fieldPath": "toCity", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "trips",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "requests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "fromCity", "order": "ASCENDING" },
        { "fieldPath": "toCity", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "chats",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "participants", "arrayConfig": "CONTAINS" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Phase 10: Firebase Cloud Functions (Optional but Recommended)

**Task 10.1: Initialize Cloud Functions**

```bash
# In project root
firebase init functions
# Choose TypeScript
# Install dependencies
```

**Task 10.2: Create Function to Update User Ratings**

CREATE `functions/src/triggers/onRatingUpdate.ts`:

```typescript
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
```

**Task 10.3: Create Function for Chat Notifications**

CREATE `functions/src/triggers/onNewMessage.ts`:

```typescript
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
```

## Validation Loop

### Level 1: Setup & Dependencies

```bash
# Verify Node.js and npm are installed
node --version  # Should be >= 18
npm --version   # Should be >= 9

# Install dependencies
npm install

# Verify Firebase config
# Check .env.local has all required variables
cat .env.local

# Expected: All NEXT_PUBLIC_FIREBASE_* variables set
```

### Level 2: TypeScript & Linting

```bash
# Type check
npx tsc --noEmit

# Expected: No type errors
# If errors: Read carefully, fix type mismatches, ensure Firebase types are correct

# Lint check
npm run lint

# Expected: No linting errors
# If errors: Run with --fix or manually correct
```

### Level 3: Development Server

```bash
# Start dev server
npm run dev

# Expected: Server starts at http://localhost:3000
# Check browser console for Firebase initialization errors
# Verify no 404s or module resolution errors
```

### Level 4: Manual Testing Checklist

```bash
# Test 1: Authentication
# 1. Navigate to /signup
# 2. Create account with email/password
# 3. Check Firebase Console > Authentication > Users (should see new user)
# 4. Check Firebase Console > Firestore > users (should see user document)
# 5. Log out and log back in at /login
# Expected: Success with no errors

# Test 2: Create Trip
# 1. Log in as traveler
# 2. Navigate to /add-trip
# 3. Fill form and submit
# 4. Check Firebase Console > Firestore > trips
# Expected: New trip document with correct userId

# Test 3: Create Request
# 1. Log in as sender
# 2. Navigate to /send-item
# 3. Fill form and submit
# 4. Check Firebase Console > Firestore > requests
# Expected: New request document

# Test 4: Search
# 1. Navigate to /search
# 2. Enter cities from test trip
# 3. Verify trip appears in results
# Expected: Real-time search works

# Test 5: Chat
# 1. From search results, click "Contact"
# 2. Send a message
# 3. Open chat in incognito as other user
# 4. Verify message appears in real-time
# Expected: Real-time chat works

# Test 6: Rating
# 1. After a trip, open rating form
# 2. Submit rating
# 3. Check Firebase Console > Firestore > ratings
# 4. Verify user's rating updated
# Expected: Rating creates and average calculates

# Test 7: Security Rules
# 1. Try to edit another user's trip via console
# 2. Try to read chat you're not part of
# Expected: Permission denied errors
```

### Level 5: Firebase Deployment

```bash
# Deploy Security Rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Expected: Rules deployed successfully

# Deploy Cloud Functions (if created)
cd functions
npm install
cd ..
firebase deploy --only functions

# Expected: Functions deployed successfully

# Deploy Indexes
firebase deploy --only firestore:indexes

# Expected: Indexes created successfully
```

### Level 6: Production Build

```bash
# Build for production
npm run build

# Expected: Build completes with no errors
# Check for:
# - No TypeScript errors
# - No missing modules
# - All pages render

# Test production build locally
npm run start

# Expected: App runs in production mode
```

## Final Validation Checklist

- [ ] All TypeScript files compile: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint`
- [ ] Production build succeeds: `npm run build`
- [ ] User can sign up and log in
- [ ] User can create trips
- [ ] User can create requests
- [ ] Search works with real-time updates
- [ ] Chat works with real-time messages
- [ ] Rating system works and updates user average
- [ ] Firebase Security Rules prevent unauthorized access
- [ ] All pages are responsive on mobile
- [ ] No console errors in browser
- [ ] Environment variables properly configured
- [ ] .gitignore includes .env.local
- [ ] README.md has setup instructions

---

## Anti-Patterns to Avoid

- ❌ Don't use Firebase on server components without Firebase Admin SDK
- ❌ Don't forget 'use client' directive on components using Firebase client SDK
- ❌ Don't query Firestore without matching security rules constraints
- ❌ Don't forget to unsubscribe from Firestore listeners
- ❌ Don't commit .env.local or Firebase credentials
- ❌ Don't create indexes manually - use firestore.indexes.json
- ❌ Don't store sensitive data in Firestore without encryption
- ❌ Don't use arrays for collections (use subcollections instead)
- ❌ Don't forget loading and error states
- ❌ Don't skip email verification for production

---

## Deployment Instructions

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to project
# - Add environment variables (copy from .env.local)
# - Deploy

# Production deployment
vercel --prod
```

### Environment Variables on Vercel

Add these in Vercel Dashboard > Settings > Environment Variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## Success Confidence Score

**9/10** - This PRP provides:
✅ Complete architecture with all Firebase services
✅ Comprehensive TypeScript types
✅ Detailed implementation with code examples
✅ Security rules for all data access
✅ Real-time features (chat, search)
✅ Step-by-step validation process
✅ Common pitfalls documented
✅ External documentation URLs
✅ Production deployment guide

The only gap is that some components (RequestForm, RequestCard, etc.) reference patterns from similar components rather than providing full implementations, but this is intentional to avoid excessive repetition. An AI agent should be able to mirror the provided patterns successfully.

**Estimated Implementation Time**: 6-10 hours for experienced developer, 12-16 hours for AI agent with validation loops.
