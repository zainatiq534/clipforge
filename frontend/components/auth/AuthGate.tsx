"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { softReplace } from "@/lib/softNavigate";

type AuthGateProps = {
  children: ReactNode;
};

/**
 * Protects dashboard routes.
 * Always renders `{children}` so navigations stay instant.
 * Overlay only appears after a short delay (cached sessions never flash).
 */
export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const [blocking, setBlocking] = useState(
    () => !getFirebaseAuth().currentUser,
  );
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth.currentUser) {
      setBlocking(false);
      setShowOverlay(false);
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setBlocking(true);
        softReplace(router, "/login");
        return;
      }
      setBlocking(false);
      setShowOverlay(false);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!blocking) {
      setShowOverlay(false);
      return;
    }
    const t = window.setTimeout(() => setShowOverlay(true), 180);
    return () => window.clearTimeout(t);
  }, [blocking]);

  return (
    <>
      {children}
      {blocking && showOverlay ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f7f5fc]/75 font-sans text-sm text-[#6b7280] transition-opacity duration-150"
          style={{ animation: "cf-page-enter 180ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          Checking session…
        </div>
      ) : null}
    </>
  );
}
