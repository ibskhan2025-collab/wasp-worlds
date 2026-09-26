"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadCart, saveCart } from "./storage";
import type { CartItem } from "./types";

export function useCart(store: "noir" | "objects") {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart(store));
    setReady(true);
  }, [store]);

  useEffect(() => {
    if (ready) saveCart(store, items);
  }, [items, ready, store]);

  const add = useCallback((item: Omit<CartItem, "qty"> & { qty?: number }) => {
    setItems((current) => {
      const key = `${item.id}-${item.size ?? ""}-${item.option ?? ""}`;
      const existing = current.find((row) => `${row.id}-${row.size ?? ""}-${row.option ?? ""}` === key);
      if (existing) {
        return current.map((row) =>
          `${row.id}-${row.size ?? ""}-${row.option ?? ""}` === key
            ? { ...row, qty: row.qty + (item.qty ?? 1) }
            : row,
        );
      }
      return [...current, { ...item, qty: item.qty ?? 1 }];
    });
  }, []);

  const setQty = useCallback((index: number, qty: number) => {
    if (!Number.isFinite(qty)) return;
    const q = Math.floor(qty);
    setItems((current) => current.map((row, i) => (i === index ? { ...row, qty: q } : row)).filter((row) => row.qty > 0 && row.qty <= 99));
  }, []);

  const remove = useCallback((index: number) => {
    setItems((current) => current.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((n, i) => n + i.price * i.qty, 0), [items]);

  return { items, add, setQty, remove, clear, count, subtotal, ready };
}

export { money } from "./format";
