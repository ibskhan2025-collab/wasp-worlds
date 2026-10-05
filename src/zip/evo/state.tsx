"use client";

import { useWasp as useMainWasp } from "@/context/wasp-context";

/**
 * Minimal shim for the 8154 shell state. WorldMap only reads
 * memory.visited; everything else about their shell stays behind.
 */
export function useWasp(): { memory: { visited: string[] } } {
  const main = useMainWasp();
  return { memory: { visited: [...main.visited] } };
}
