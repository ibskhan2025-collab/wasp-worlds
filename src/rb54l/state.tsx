"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Perf = "full" | "reduced" | "lite";
type Modes = { perf: Perf; night: boolean; raw: boolean; system: boolean };
type Memory = { visited: string[]; recent: string[]; lastPath?: string; seenIntro?: boolean };

type Ctx = {
  modes: Modes;
  setMode: <K extends keyof Modes>(k: K, v: Modes[K]) => void;
  memory: Memory;
  remember: (fn: (m: Memory) => Memory) => void;
  say: (msg: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  paletteQuery: string;
  openPalette: (q?: string) => void;
};

const C = createContext<Ctx | null>(null);
export const useWasp = () => {
  const c = useContext(C);
  if (!c) throw new Error("useWasp outside provider");
  return c;
};

/** localStorage-backed state. Everything stays in this browser. */
export function useLocal<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw));
    } catch {}
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV] as const;
}

const SECRETS: Record<string, string> = { night: "night", raw: "raw", sys: "system" };

export function WaspProvider({ children }: { children: ReactNode }) {
  const [modes, setModes] = useLocal<Modes>("wasp:modes", { perf: "full", night: false, raw: false, system: false });
  const [memory, setMemory] = useLocal<Memory>("wasp:memory", { visited: [], recent: [] });
  const [toast, setToast] = useState<{ msg: string; k: number } | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const buf = useRef("");

  const say = useCallback((msg: string) => setToast({ msg, k: Date.now() }), []);
  const setMode = useCallback(<K extends keyof Modes>(k: K, v: Modes[K]) => setModes((m) => ({ ...m, [k]: v })), [setModes]);
  const remember = useCallback((fn: (m: Memory) => Memory) => setMemory(fn), [setMemory]);
  const openPalette = useCallback((q = "") => { setPaletteQuery(q); setPaletteOpen(true); }, []);

  useEffect(() => {
    const h = document.documentElement;
    h.dataset.perf = modes.perf;
    h.dataset.night = modes.night ? "1" : "0";
    h.dataset.raw = modes.raw ? "1" : "0";
    h.dataset.system = modes.system ? "1" : "0";
  }, [modes]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Keyboard: ⌘K / Ctrl+K / "/" opens search. Typing night / raw / sys (outside inputs) toggles secret modes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteQuery(""); setPaletteOpen((o) => !o); return; }
      if (typing) return;
      if (e.key === "/") { e.preventDefault(); setPaletteQuery(""); setPaletteOpen(true); return; }
      if (e.key.length === 1) {
        buf.current = (buf.current + e.key.toLowerCase()).slice(-8);
        for (const [seq, mode] of Object.entries(SECRETS)) {
          if (buf.current.endsWith(seq)) {
            buf.current = "";
            setModes((m) => {
              const k = mode as "night" | "raw" | "system";
              const next = !m[k];
              setToast({ msg: next ? ({ night: "Night mode. The site after hours.", raw: "Raw mode. No tricks, just the work.", system: "System mode. Here's the scaffolding." }[k]) : "Back to normal.", k: Date.now() });
              return { ...m, [k]: next };
            });
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setModes]);

  return (
    <C.Provider value={{ modes, setMode, memory, remember, say, paletteOpen, setPaletteOpen, paletteQuery, openPalette }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed left-1/2 top-20 z-[80] -translate-x-1/2">
        {toast && (
          <div key={toast.k} className="mono border border-ink bg-signal px-3 py-2 text-[#141412] shadow-[3px_3px_0_#141412]" style={{ animation: "rise .4s var(--ease-out)" }}>
            {toast.msg}
          </div>
        )}
      </div>
    </C.Provider>
  );
}
