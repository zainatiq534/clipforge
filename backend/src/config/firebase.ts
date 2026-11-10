import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { env } from "./env.js";

/**
 * Firebase Admin setup follows the official docs:
 * https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
 *
 * On a normal PC (not Google Cloud), Admin SDK needs a *service account key*
 * JSON — NOT the web apiKey/authDomain config from the Firebase JS SDK.
 *
 * Preferred (Firebase-recommended):
 *   set GOOGLE_APPLICATION_CREDENTIALS to the JSON path, then applicationDefault()
 *
 * Alternative:
 *   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
 */
function loadCredential() {
  const keyPath =
    env.firebase.serviceAccountPath ??
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (keyPath) {
    const absolute = resolve(keyPath);
    if (!existsSync(absolute)) {
      throw new Error(
        [
          `Firebase Admin service account file not found:`,
          `  ${absolute}`,
          ``,
          `This is required for the backend (Admin SDK).`,
          `The web config (apiKey / authDomain / appId) is only for the frontend.`,
          ``,
          `Do this once:`,
          `1. Open https://console.firebase.google.com/project/clipforge-8a74e/settings/serviceaccounts/adminsdk`,
          `2. Click "Generate new private key"`,
          `3. Save the downloaded JSON as:`,
          `     D:\\clipforge\\backend\\serviceAccountKey.json`,
          `4. Restart: npm run dev:backend`,
        ].join("\n"),
      );
    }

    const json = JSON.parse(readFileSync(absolute, "utf8")) as ServiceAccount;
    return cert(json);
  }

  if (env.firebase.clientEmail && env.firebase.privateKey) {
    return cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    });
  }

  // Docs-recommended path when GOOGLE_APPLICATION_CREDENTIALS is already set
  // in the shell environment (not only via .env file).
  try {
    return applicationDefault();
  } catch {
    throw new Error(
      [
        `Firebase Admin credentials are missing.`,
        ``,
        `Generate a service account key:`,
        `https://console.firebase.google.com/project/clipforge-8a74e/settings/serviceaccounts/adminsdk`,
        `Save it as backend/serviceAccountKey.json, then restart the API.`,
      ].join("\n"),
    );
  }
}

function createApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  return initializeApp({
    credential: loadCredential(),
    projectId: env.firebase.projectId,
  });
}

export const firebaseApp = createApp();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export const USERS_COLLECTION = "users";
