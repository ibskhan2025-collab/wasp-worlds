"use client";
import { useCallback, useEffect, useState } from "react";

/** localStorage-backed state. Hydrates after mount so SSR markup always matches. */
export function usePersist<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem("wasp:" + key);
      if (s) setV(JSON.parse(s) as T);
    } catch {}
    setReady(true);
  }, [key]);
  const set = useCallback(
    (n: T | ((p: T) => T)) =>
      setV((p) => {
        const nv = typeof n === "function" ? (n as (p: T) => T)(p) : n;
        try {
          localStorage.setItem("wasp:" + key, JSON.stringify(nv));
        } catch {}
        return nv;
      }),
    [key],
  );
  return [v, set, ready] as const;
}

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const f = () => setR(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}

export function useHotkeys(map: Record<string, () => void>, active = true) {
  useEffect(() => {
    if (!active) return;
    const f = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const fn = map[e.key.toLowerCase()];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  });
}
