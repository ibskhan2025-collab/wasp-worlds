"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useWasp } from "@/context/wasp-context";
import { loadJson, saveJson } from "@/lib/storage";
import { track } from "@/lib/track";
import type { WorldId } from "@/lib/types";

const STRIP_KEY = "wasp-v11-demo-strip";

export function WorldExit({ id, label }: { id: WorldId; label: string }) {
  const { visit } = useWasp();
  const seen = useRef<WorldId | null>(null);
  const [strip, setStrip] = useState(false);
  useEffect(() => {
    if (seen.current === id) return; // StrictMode double-effect guard
    seen.current = id;
    visit(id);
    track("world_visit", { world: id });
    setStrip(!loadJson<boolean>(STRIP_KEY, false));
  }, [id, visit]);

  function dismiss() {
    saveJson(STRIP_KEY, true);
    setStrip(false);
  }

  return (
    <>
      <div className="world-exit">
        <Link href="/">WASP · Exhibition</Link>
        <span>{label}</span>
        <Link href="/start">Start a project</Link>
      </div>
      {strip ? (
        <p className="demo-strip" role="note">
          <span>This is a working demo by <Link href="/">WASP</Link>, a design studio — not a real business. Explore it, then imagine yours.</span>
          <button type="button" onClick={dismiss} aria-label="Dismiss">✕</button>
        </p>
      ) : null}
    </>
  );
}
