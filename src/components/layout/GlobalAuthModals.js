"use client";

import AuthModals from "@/components/layout/AuthModals";
import { useAuth } from "@/context/AuthContext";

export default function GlobalAuthModals() {
  const { authModalOpen, closeAuth } = useAuth();

  return <AuthModals isOpen={authModalOpen} onClose={closeAuth} />;
}
