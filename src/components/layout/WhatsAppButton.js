"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

const FALLBACK_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export default function WhatsAppButton() {
  const [number, setNumber] = useState(FALLBACK_NUMBER);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/contact")
      .then((response) => {
        if (cancelled) return;
        const adminNumber = response.data?.whatsapp_number;
        if (adminNumber) setNumber(adminNumber);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const digits = number.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ilə yazın"
      className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0px_4px_14px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 sm:right-6"
    >
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 3C9.373 3 4 8.373 4 15c0 2.25.62 4.354 1.699 6.152L4 29l8.078-1.656A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm0 21.818a9.77 9.77 0 0 1-4.98-1.361l-.357-.212-4.792.982 1.003-4.672-.233-.383A9.766 9.766 0 0 1 6.182 15c0-5.422 4.396-9.818 9.818-9.818S25.818 9.578 25.818 15 21.422 24.818 16 24.818Zm5.384-7.348c-.295-.148-1.746-.861-2.017-.959-.27-.099-.467-.148-.664.147-.196.296-.762.96-.934 1.157-.172.196-.344.221-.639.073-.295-.147-1.246-.459-2.373-1.464-.877-.782-1.469-1.748-1.641-2.043-.172-.296-.019-.456.129-.603.133-.132.295-.344.443-.516.147-.172.196-.295.295-.492.098-.196.049-.369-.025-.516-.074-.148-.664-1.6-.91-2.191-.239-.575-.483-.497-.664-.506l-.566-.01c-.196 0-.516.074-.786.369-.27.295-1.032 1.008-1.032 2.46 0 1.451 1.057 2.853 1.204 3.05.147.196 2.08 3.176 5.038 4.453.704.304 1.253.485 1.681.621.706.225 1.35.193 1.858.117.567-.085 1.746-.714 1.992-1.403.246-.69.246-1.28.172-1.403-.074-.123-.27-.197-.566-.345Z"
          fill="#fff"
        />
      </svg>
    </a>
  );
}
