import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Firebase web config (safe to expose in the browser).
 * Env vars from `.env.local` win; project defaults keep login working if
 * Turbopack/env loading misses NEXT_PUBLIC_* during local monorepo runs.
 */
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
    "AIzaSyAFCalChJ6OYMJFdQWpjWGL5tiKu6yA9Is",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ||
    "clipforge-8a74e.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    "clipforge-8a74e",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    "clipforge-8a74e.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ||
    "484877261397",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ||
    "1:484877261397:web:227b0f3676bcbf7868d2dc",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() ||
    "G-H2CS2B3ERL",
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY. Add it to frontend/.env.local and restart `npm run dev`.",
    );
  }

  app = initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getFirebaseApp());
  return auth;
}
