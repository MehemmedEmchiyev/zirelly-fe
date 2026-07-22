"use client";

import { useEffect, useState } from "react";
import ForgotPasswordModal from "@/components/layout/ForgotPasswordModal";
import LoginModal from "@/components/layout/LoginModal";
import OtpModal from "@/components/layout/OtpModal";
import RegisterModal from "@/components/layout/RegisterModal";
import ResetPasswordModal from "@/components/layout/ResetPasswordModal";

export default function AuthModals({ isOpen, onClose, initialView = "login" }) {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState("");

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
        onForgotPassword={() => setView("forgot")}
        onOtpRequired={(mail) => {
          setEmail(mail);
          setView("otp");
        }}
      />

      <RegisterModal
        isOpen={isOpen && view === "register"}
        onClose={onClose}
        onSwitchToLogin={() => setView("login")}
        onOtpRequired={(mail) => {
          setEmail(mail);
          setView("otp");
        }}
      />

      <OtpModal
        isOpen={isOpen && view === "otp"}
        onClose={onClose}
        email={email}
        onSwitchToLogin={() => setView("login")}
      />

      <ForgotPasswordModal
        isOpen={isOpen && view === "forgot"}
        onClose={onClose}
        onSwitchToLogin={() => setView("login")}
        onCodeSent={(mail) => {
          setEmail(mail);
          setView("reset");
        }}
      />

      <ResetPasswordModal
        isOpen={isOpen && view === "reset"}
        onClose={onClose}
        email={email}
        onSwitchToLogin={() => setView("login")}
      />
    </>
  );
}
