"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const { isLoggedIn, isReady, openAuth } = useAuth();

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      openAuth(() => router.push("/"));
    }
  }, [isReady, isLoggedIn, openAuth, router]);

  if (!isReady) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}
