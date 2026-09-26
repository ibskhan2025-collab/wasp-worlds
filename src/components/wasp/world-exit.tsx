"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useWasp } from "@/context/wasp-context";
import { track } from "@/lib/track";
import type { WorldId } from "@/lib/types";

export function WorldExit({ id, label }: { id: WorldId; label: string }) {
  const { visit } = useWasp();
  const seen = useRef<WorldId | null>(null);
  useEffect(() => {
    if (seen.current === id) return; // StrictMode double-effect guard
    seen.current = id;
    visit(id);
    track("world_visit", { world: id });
  }, [id, visit]);

  return (
    <div className="world-exit">
      <Link href="/">WASP · Exhibition</Link>
      <span>{label}</span>
      <Link href="/start">Start a project</Link>
    </div>
  );
}
