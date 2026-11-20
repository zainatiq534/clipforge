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

  // Sync profile in background so login → dashboard feels instant
  void syncProfile(idToken, { provider: "password" })
    .catch(() => fetchMe(idToken))
    .catch(() => null);

  return { user: cred.user, idToken, profile: null as UserProfile | null };
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(getFirebaseAuth(), provider);
  const idToken = await cred.user.getIdToken();

  void syncProfile(idToken, {
    displayName: cred.user.displayName ?? undefined,
    photoURL: cred.user.photoURL ?? undefined,
    provider: "google",
  }).catch(() => null);

  return { user: cred.user, idToken, profile: null as UserProfile | null };
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
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup. Allow popups for this site and try again.";
    case "auth/unauthorized-domain":
      return "This site’s domain isn’t allowed in Firebase Auth. Open http://localhost:3000, or add your LAN IP under Firebase Console → Authentication → Settings → Authorized domains.";
    case "auth/network-request-failed":
      return "Can’t reach Firebase (network). Check your internet/VPN/firewall, then retry.";
    case "auth/operation-not-allowed":
      return "This sign-in method is disabled. Enable Email/Password (and Google if needed) in Firebase Console → Authentication → Sign-in method.";
    case "auth/internal-error":
      return "Firebase had a temporary error. Wait a moment and try again.";
    default: {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      if (/unauthorized.?domain/i.test(message)) {
        return "This site’s domain isn’t allowed in Firebase Auth. Use localhost:3000 or add the domain in Firebase Console → Authentication → Authorized domains.";
      }
      if (/network/i.test(message)) {
        return "Can’t reach Firebase (network). Check your internet/VPN/firewall, then retry.";
      }
      return message;
    }
  }
}
