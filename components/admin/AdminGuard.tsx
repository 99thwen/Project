"use client";

import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          if (mounted) {
            setAuthenticated(false);
            setChecking(false);
          }

          router.replace("/admin/login");
          return;
        }

        try {
          const adminRef = doc(db, "admins", user.uid);
          const adminSnapshot = await getDoc(adminRef);

          const isAdmin =
            adminSnapshot.exists() &&
            adminSnapshot.data().role === "admin";

          if (!isAdmin) {
            await signOut(auth);

            if (mounted) {
              setAuthenticated(false);
              setChecking(false);
            }

            router.replace("/admin/login");
            return;
          }

          if (mounted) {
            setAuthenticated(true);
            setChecking(false);
          }
        } catch (error) {
          console.error("Admin verification failed:", error);

          await signOut(auth).catch(() => {});

          if (mounted) {
            setAuthenticated(false);
            setChecking(false);
          }

          router.replace("/admin/login");
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background-soft)]">
        <p className="text-sm text-[var(--text-muted)]">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}