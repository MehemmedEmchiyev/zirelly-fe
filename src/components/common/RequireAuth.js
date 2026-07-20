"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModals from "@/components/layout/AuthModals";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const { isLoggedIn, isReady } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      setAuthOpen(true);
    }
  }, [isReady, isLoggedIn]);

  if (!isReady) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <AuthModals
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false);
          router.push("/");
        }}
      />
    );
  }

  return children;
}
