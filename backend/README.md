# ClipForge Backend (Firebase + Firestore)

Express API using **Firebase Auth** (Admin SDK) and **Cloud Firestore**.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `POST` | `/auth/register` | — | Create Auth user + Firestore profile |
| `GET` | `/auth/me` | Bearer ID token | Return Firestore profile |
| `POST` | `/auth/sync` | Bearer ID token | Upsert Firestore profile |
| `GET` | `/uploads` | Bearer | List user uploads |
| `POST` | `/uploads/sign` | Bearer | Create Firestore row + Cloudinary signed upload |
| `POST` | `/uploads/:id/complete` | Bearer | Mark upload ready after Cloudinary |
| `POST` | `/uploads/:id/fail` | Bearer | Mark upload failed |
| `DELETE` | `/uploads/:id` | Bearer | Delete upload metadata |

## Setup

1. Create a Firebase project and enable **Email/Password** auth.
2. Create a Firestore database.
3. Project settings → Service accounts → **Generate new private key**.
4. Save the downloaded JSON as `backend/serviceAccountKey.json`.
5. Copy `.env.example` → `.env` (already points at `clipforge-8a74e` + that JSON path).

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
FIREBASE_PROJECT_ID=clipforge-8a74e
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

6. Install & run:

```bash
cd backend
npm install
npm run dev
```

7. Deploy `firestore.rules` from the Firebase console (or CLI).
8. Enable **Email/Password** (and Google if needed) under Authentication → Sign-in method.
9. Add Cloudinary keys to `.env` (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

## Register body

```json
{
  "email": "you@example.com",
  "password": "password123",
  "address": "Street 1",
  "phone": "+92 300 1234567"
}
```
