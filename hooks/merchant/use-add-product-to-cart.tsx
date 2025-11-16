"use client";

import { useEffect, useMemo, useState } from "react";
import useGetMerchantById from "./use-get-merchant-by-id";
import type { Stock } from "@/types";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  photo_url: string;
  quantity: number;
};

const STORAGE_KEY = "qoin.cart";

const useAddProductToCart = () => {
  const { merchant } = useGetMerchantById();

  // Initialize empty to avoid SSR/CSR mismatch; hydrate from localStorage after mount
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount only
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          setCart(Array.isArray(parsed) ? parsed : []);
        }
      }
    } catch {
      // ignore read errors
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    if (!hydrated) return; // avoid overwriting before initial read
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      }
    } catch {
      toast.error("Gagal menambahkan cart ke penyimpanan lokal.");
    }
  }, [cart, hydrated]);

  const findStock = (productId: string): Stock | undefined =>
    merchant?.stocks?.find((s) => s.id === productId);

  const handleProduct = (productId: string) => {
    const stock = findStock(productId);
    if (!stock) return; // If merchant not loaded yet or id invalid

    setCart((prev) => {
      const idx = prev.findIndex((it) => it.id === productId);
      if (idx !== -1) {
        // increment quantity only
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      // add new item
      const newItem: CartItem = {
        id: stock.id,
        name: stock.name,
        price: stock.price,
        photo_url: stock.photo_url,
        quantity: 1,
      };
      return [...prev, newItem];
    });
  };

  const increment = (productId: string) => {
    setCart((prev) =>
      prev.map((it) =>
        it.id === productId ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  };

  const decrement = (productId: string) => {
    setCart((prev) =>
      prev
        .map((it) =>
          it.id === productId
            ? { ...it, quantity: Math.max(0, it.quantity - 1) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const remove = (productId: string) => {
    setCart((prev) => prev.filter((it) => it.id !== productId));
  };

  const clear = () => setCart([]);

  const totals = useMemo(() => {
    const totalQty = cart.reduce((acc, it) => acc + it.quantity, 0);
    const totalPrice = cart.reduce(
      (acc, it) => acc + it.quantity * it.price,
      0
    );
    return { totalQty, totalPrice };
  }, [cart]);

  return { cart, handleProduct, increment, decrement, remove, clear, totals };
};

export default useAddProductToCart;
