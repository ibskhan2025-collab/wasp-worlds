"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { REALITIES, saveReality } from "@/lib/realities";
import { track } from "@/lib/track";
import type { WorldId } from "@/lib/types";

/**
 * Dimension strip + designed transition between a world's realities.
 * Full page navigation (not a theme swap): the next reality boots as its
 * own route after a 560ms wipe. Skipped entirely under reduced motion.
 */
export function RealityShell({ world, current, basePath }: {
  world: WorldId;
  current: string;
  basePath: string;
}) {
  const router = useRouter();
  const [wipe, setWipe] = useState<string | null>(null);
  const options = REALITIES[world] ?? [];
  if (options.length <= 1) return null;

  function go(id: string) {
    if (id === current || wipe) return;
    const label = options.find((r) => r.id === id)?.label ?? id;
    saveReality(world, id);
    track("preference_set", { kind: "reality", value: `${world}:${id}` });
    const target = id === "classic" ? basePath : `${basePath}/${id}`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      router.push(target);
      return;
    }
    setWipe(label);
    window.setTimeout(() => router.push(target), 560);
  }

  return (
    <>
      <div className="reality-shell" role="group" aria-label="Realities">
        <span className="kicker">Reality</span>
        {options.map((r) => (
          <button
            key={r.id}
            type="button"
            className={current === r.id ? "chip-on" : "chip"}
            aria-pressed={current === r.id}
            title={r.note}
            onClick={() => go(r.id)}
          >
            {r.label}
          </button>
        ))}
        <span className="kicker reality-note">{options.find((r) => r.id === current)?.note}</span>
      </div>
      {wipe ? (
        <div className="reality-wipe" aria-hidden>
          <span>{wipe}</span>
        </div>
      ) : null}
    </>
  );
}
