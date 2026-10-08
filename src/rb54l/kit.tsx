"use client";

import { useState } from "react";
import { useLocal } from "@/rb54l/state";

export type Line = { id: string; name: string; price: number; qty: number; variant?: string };

/** Shared cart logic, per-world storage. Same infrastructure, different visuals. */
export function useCart(world: string) {
  const [lines, setLines] = useLocal<Line[]>(`wasp:${world}:cart`, []);
  const [wish, setWish] = useLocal<string[]>(`wasp:${world}:wish`, []);
  const add = (l: Omit<Line, "qty">) =>
    setLines((ls) => {
      const key = l.id + (l.variant ?? "");
      const hit = ls.find((x) => x.id + (x.variant ?? "") === key);
      return hit ? ls.map((x) => (x === hit ? { ...x, qty: x.qty + 1 } : x)) : [...ls, { ...l, qty: 1 }];
    });
  const setQty = (i: number, q: number) => setLines((ls) => (q <= 0 ? ls.filter((_, j) => j !== i) : ls.map((x, j) => (j === i ? { ...x, qty: q } : x))));
  const toggleWish = (id: string) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return { lines, add, setQty, clear: () => setLines([]), wish, toggleWish, total, count };
}

export type SubmitState = "idle" | "sending" | "done" | "error";

/** POSTs to /api/submit; surfaces field-level errors from the server. */
export function useSubmit(kind: string) {
  const [state, setState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [ref, setRef] = useState("");
  const send = async (payload: Record<string, unknown>, clientErrors: Record<string, string> = {}) => {
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); setState("error"); setMessage("A couple of things need fixing — they're marked below."); return false; }
    setState("sending"); setErrors({}); setMessage("");
    try {
      const r = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, payload }) });
      const j = await r.json();
      if (j.ok) { setState("done"); setRef(j.ref); return true; }
      setErrors(j.errors ?? {}); setMessage(j.error ?? "A couple of things need fixing — they're marked below."); setState("error");
    } catch {
      setState("error"); setMessage("Couldn't reach the server — are you offline? Nothing was lost; try again when you're back.");
    }
    return false;
  };
  return { state, errors, message, ref, send, reset: () => { setState("idle"); setErrors({}); } };
}

export const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const money = (n: number, c = "€") => `${c}${n.toLocaleString("en", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
