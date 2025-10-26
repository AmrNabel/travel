### 🎯 **Goal**

Launch a **fast, scalable MVP** without a dedicated backend server — relying entirely on **Firebase** to manage:

- User authentication
- Identity verification
- Data storage
- Chat system
- Access control
- Notifications

---

### 🧩 **Architecture Overview**

| Component                | Technology                                                  |
| ------------------------ | ----------------------------------------------------------- |
| **Frontend**             | Next.js + TypeScript + MUI                                  |
| **Backend (Serverless)** | Firebase Cloud Functions                                    |
| **Database**             | Firestore (Cloud Firestore)                                 |
| **Auth & Verification**  | Firebase Authentication                                     |
| **Storage**              | Firebase Storage                                            |
| **Chat**                 | Firestore Realtime Updates or Realtime Database             |
| **Notifications**        | Firebase Cloud Messaging (FCM)                              |
| **Deployment**           | Vercel (Frontend) + Firebase Hosting (optional for backend) |

---

### 🧱 **Core Features**

#### 1. 🧍‍♂️ User Registration & Login

**Features:**

- Sign up via email or mobile number
- SMS or Email verification
- Basic user info stored in Firestore after registration

**Data (Collection: `users`)**

```json
{
  "id": "auto_id",
  "name": "Amr Nabil",
  "email": "amr@example.com",
  "phone": "+2010...",
  "role": "traveler" | "sender",
  "photoURL": "...",
  "rating": 4.8,
  "verified": true,
  "createdAt": "timestamp"
}
```

---

#### 2. 🚆 Post a Trip (Traveler)

**Features:**

- Traveler adds trip details (from/to, date, capacity, price)
- Stored in Firestore
- Visible to all users searching for trips

**Data (Collection: `trips`)**

```json
{
  "userId": "uid",
  "fromCity": "Cairo",
  "toCity": "Alexandria",
  "date": "2025-10-28",
  "capacity": "10kg",
  "price": 100,
  "status": "active",
  "createdAt": "timestamp"
}
```

---

#### 3. 📦 Send an Item (Sender Request)

**Features:**

- Sender fills in item details, destination, and suggested price
- Request added to a public list and matched with trips

**Data (Collection: `requests`)**

```json
{
  "userId": "uid",
  "fromCity": "Cairo",
  "toCity": "Alexandria",
  "itemType": "Documents",
  "weight": "2kg",
  "offerPrice": 80,
  "status": "pending",
  "notes": "Fragile please",
  "createdAt": "timestamp"
}
```

---

#### 4. 🔍 Search & Match

**Features:**

- Users can search by `fromCity`, `toCity`, and `date`
- Uses Firestore queries (indexed fields)
- Displays matching trips or requests in a simple UI

**Example code:**

```js
const tripsRef = collection(db, 'trips');
const q = query(
  tripsRef,
  where('fromCity', '==', from),
  where('toCity', '==', to)
);
```

---

#### 5. 💬 Chat System

**Features:**

- Automatically starts when a match occurs between two users
- Shared `chatId` created for both sides
- Real-time updates via Firestore or Realtime Database

**Collections:**

- `chats` → metadata for each conversation
- `messages` → actual messages in each chat

**Example:**

```json
// chats/{chatId}
{
  "users": ["userA", "userB"],
  "tripId": "trip123",
  "lastMessage": "All set!",
  "updatedAt": "timestamp"
}

// messages/{chatId}/{messageId}
{
  "senderId": "userA",
  "text": "I’ll travel tomorrow at 8 AM",
  "createdAt": "timestamp"
}
```

---

#### 6. ⭐ Post-Delivery Rating

**Features:**

- Both sides can rate each other after successful delivery
- Average rating auto-updated in user profile

**Data (Collection: `ratings`)**

```json
{
  "fromUser": "uid1",
  "toUser": "uid2",
  "tripId": "trip123",
  "score": 5,
  "comment": "Very reliable",
  "createdAt": "timestamp"
}
```

---

#### 7. 👤 User Profile

**Features:**

- Displays user info, rating, and trip history
- Rating calculated via client-side aggregation or Cloud Function

---

### 🔐 **Security & Verification**

- All operations protected via **Firebase Security Rules**
- **Storage Rules:** Only account owner can upload their own photo or ID
- **Firestore Rules:**

  - User can only edit their own data
  - No user can delete another user’s data
  - Ratings cannot be altered by others

**Example Rule:**

```js
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}
```

---

### 🔔 **Notifications**

- When someone sends a message or a request matches a trip → real-time notification
- Powered by **Firebase Cloud Messaging (FCM)**
- Triggered by **Cloud Functions** on new message or match events

---

### 🧠 **User Flow**

1. User signs up or logs in
2. Chooses their role (Traveler or Sender)
3. Traveler adds a trip / Sender adds a request
4. Firebase handles automatic or manual matching
5. Chat starts between the two users
6. After delivery → both users rate each other

---

### ⚙️ **Project Folder Structure**

```
/src
 ├── components/
 ├── pages/
 │   ├── index.tsx
 │   ├── add-trip.tsx
 │   ├── send-item.tsx
 │   ├── chat/[id].tsx
 │   └── profile/[uid].tsx
 ├── hooks/
 ├── firebase/
 │   ├── config.ts
 │   ├── auth.ts
 │   ├── firestore.ts
 │   ├── storage.ts
 └── utils/
```
