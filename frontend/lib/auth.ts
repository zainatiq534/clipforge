import {
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { fetchMe, syncProfile, type UserProfile } from "@/lib/api";

export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  const idToken = await cred.user.getIdToken();

  let profile: UserProfile | null = null;
  try {
    const synced = await syncProfile(idToken, { provider: "password" });
    profile = synced.user;
  } catch {
    try {
      const me = await fetchMe(idToken);
      profile = me.user;
    } catch {
      profile = null;
    }
  }

  return { user: cred.user, idToken, profile };
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(getFirebaseAuth(), provider);
  const idToken = await cred.user.getIdToken();

  const synced = await syncProfile(idToken, {
    displayName: cred.user.displayName ?? undefined,
    photoURL: cred.user.photoURL ?? undefined,
    provider: "google",
  });

  return { user: cred.user, idToken, profile: synced.user };
}

export async function logout() {
  await signOut(getFirebaseAuth());
}

export async function sendResetPasswordEmail(email: string) {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function changeAccountPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = getFirebaseAuth().currentUser;
  if (!user?.email) {
    throw new Error("You must be signed in to change your password.");
  }
  const credential = EmailAuthProvider.credential(
    user.email,
    input.currentPassword,
  );
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, input.newPassword);
}

export function firebaseAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" &&
    error &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
      ? (error as { code: string }).code
      : null;

  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/requires-recent-login":
      return "Please sign in again, then retry changing your password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    default:
      return error instanceof Error ? error.message : "Something went wrong.";
  }
}
