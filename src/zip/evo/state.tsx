"use client";

import { useWasp as useMainWasp } from "@/context/wasp-context";

type EvoMemory = { visited: string[]; recent: string[]; lastPath?: string; seenIntro?: boolean };

/**
 * Minimal shim for the 8154 shell state. Only what the ported header, hero
 * and map read: memory.visited, remember, say, openPalette.
 * - say() has no toast host here, so it is a no-op (navigation still runs).
 * - openPalette() opens this site's own command palette via its hotkey.
 * - remember() records nothing this site reads back; visits already persist.
 */
export function useWasp(): {
  memory: { visited: string[] };
  remember: (fn: (m: EvoMemory) => EvoMemory) => void;
  say: (msg: string) => void;
  openPalette: (q?: string) => void;
  modes: { perf: "full" | "reduced" | "lite"; night: boolean; raw: boolean; system: boolean };
  setMode: (k: string, v: unknown) => void;
} {
  const main = useMainWasp();
  return {
    memory: { visited: [...main.visited] },
    remember: (fn) => {
      try {
        fn({ visited: [...main.visited], recent: [], lastPath: window.location.pathname });
      } catch {
        /* memory stays as-is */
      }
    },
    say: () => {},
    openPalette: () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
    },
    modes: { perf: "full", night: false, raw: false, system: false },
    setMode: () => {},
  };
}
