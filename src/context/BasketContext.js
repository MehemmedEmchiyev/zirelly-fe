"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/utils/api";

const BasketContext = createContext(null);

export function BasketProvider({ children }) {
  const { isLoggedIn, isReady } = useAuth();
  const [productIds, setProductIds] = useState(() => new Set());

  const refresh = useCallback(async () => {
    if (!isLoggedIn) {
      setProductIds(new Set());
      return;
    }

    try {
      const response = await authFetch("/basket");
      setProductIds(
        new Set(
          (response.data?.items ?? [])
            .map((item) => item.product?.id)
            .filter(Boolean),
        ),
      );
    } catch {
      // səbəti oxumaq alınmasa mövcud vəziyyət saxlanılır
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isReady) return;
    refresh();
  }, [refresh, isReady]);

  const addProduct = useCallback(async (productId) => {
    await authFetch("/basket/items", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });

    setProductIds((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  }, []);

  const has = useCallback((productId) => productIds.has(productId), [productIds]);

  const value = useMemo(
    () => ({ has, addProduct, refresh }),
    [has, addProduct, refresh],
  );

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);

  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }

  return context;
}
