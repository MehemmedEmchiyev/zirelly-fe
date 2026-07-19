"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModals from "@/components/layout/AuthModals";
import { isAuthenticated } from "@/utils/auth";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const ok = isAuthenticated();
    setAuthed(ok);

    if (!ok) {
      setAuthOpen(true);
    }
  }, []);

  if (authed === null) {
    return null;
  }

  if (!authed) {
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
