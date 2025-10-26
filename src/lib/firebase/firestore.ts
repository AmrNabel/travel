import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
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
export const timestampToDate = (timestamp: unknown): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  const ts = timestamp as { seconds?: number; nanoseconds?: number };
  if (ts?.seconds) {
    return new Timestamp(ts.seconds, ts.nanoseconds || 0).toDate();
  }
  return new Date(timestamp as string | number | Date);
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
  } as unknown as T;
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
      }) as T
  );
};
