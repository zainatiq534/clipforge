"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

type AuthGateProps = {
  children: ReactNode;
};

/**
 * Protects dashboard routes.
 * Always renders `{children}` so Next.js can keep navigations instant
 * (never replace the page tree with a blank "Checking session…" screen).
 */
export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const [blocking, setBlocking] = useState(
    () => !getFirebaseAuth().currentUser,
  );

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth.currentUser) setBlocking(false);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setBlocking(true);
        router.replace("/login");
        return;
      }
      setBlocking(false);
    });
    return () => unsub();
  }, [router]);

  return (
    <>
      {children}
      {blocking ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f7f5fc]/92 font-sans text-sm text-[#6b7280] backdrop-blur-[2px]">
          Checking session…
        </div>
      ) : null}
    </>
  );
}
