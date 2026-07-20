"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { authFetch } from "@/utils/api";
import { isAuthenticated } from "@/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const onCloseRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsReady(true);

    function handleStorage(event) {
      if (event.key === STORAGE_KEYS.AUTH_TOKEN) {
        setIsLoggedIn(isAuthenticated());
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const openAuth = useCallback((onClose) => {
    onCloseRef.current = typeof onClose === "function" ? onClose : null;
    setAuthModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthModalOpen(false);
    onCloseRef.current?.();
    onCloseRef.current = null;
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setIsLoggedIn(true);
    setAuthModalOpen(false);
    onCloseRef.current = null;
  }, []);

  const logout = useCallback(() => {
    authFetch("/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      isLoggedIn,
      isReady,
      authModalOpen,
      openAuth,
      closeAuth,
      login,
      logout,
    }),
    [isLoggedIn, isReady, authModalOpen, openAuth, closeAuth, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
