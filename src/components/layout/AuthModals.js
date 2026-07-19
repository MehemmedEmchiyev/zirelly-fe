"use client";

import { useEffect, useState } from "react";
import LoginModal from "@/components/layout/LoginModal";
import RegisterModal from "@/components/layout/RegisterModal";

export default function AuthModals({ isOpen, onClose, initialView = "login" }) {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  return (
    <>
      <LoginModal
        isOpen={isOpen && view === "login"}
        onClose={onClose}
        onSwitchToRegister={() => setView("register")}
      />
      <RegisterModal
        isOpen={isOpen && view === "register"}
        onClose={onClose}
        onSwitchToLogin={() => setView("login")}
      />
    </>
  );
}
