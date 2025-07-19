"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoadingSpinner from "@/components/base/LoadingSpinner";

interface AuthCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthCheck({
  children,
  redirectTo = "/auth/login",
  requireAuth = true,
}: AuthCheckProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if ((requireAuth && !user) || (!requireAuth && user)) {
        router.push(redirectTo);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, redirectTo, requireAuth]);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return <>{children}</>;
}
