"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

// Worlds with their own bespoke navigation opt out of the shared strip.
const BESPOKE = new Set(["noir", "orbit", "still", "objects", "signal", "archive", "motion", "void", "atlas", "forge", "pulse", "civic", "nest", "vector", "casa"]);

/**
 * Reality switch above every classic world page. Reality pages already
 * carry their own shell; sub-pages manage their own options — so this
 * renders only on /worlds/<id> exactly.
 */
export function WorldSwitch() {
  const path = usePathname();
  const seg = path.split("/");
  if (seg.length !== 3 || seg[1] !== "worlds") return null;
  const world = WORLDS.find((w) => w.id === seg[2]);
  if (!world) return null;
  // Worlds with their own bespoke navigation opt out of the shared strip.
  if (BESPOKE.has(world.id)) return null;
  const list = REALITIES[world.id] ?? [];
  if (list.length <= 1) return null;
  return (
    <nav aria-label={`${world.name} realities`} style={{ borderBottom: "1px solid var(--line)", padding: "10px var(--pad)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", background: "var(--bg)" }}>
      <span className="kicker">Reality</span>
      {list.map((r) => {
        const href = r.id === "classic" ? world.href : `${world.href}/${r.id}`;
        const on = r.id === "classic" && path === world.href;
        return (
          <Link
            key={r.id}
            href={href}
            aria-current={on ? "page" : undefined}
            className={on ? "chip-on" : "chip"}
            title={r.note}
          >
            {r.label}
          </Link>
        );
      })}
      <span className="kicker" style={{ marginLeft: "auto" }}>{list.length - 1} alternate forms</span>
    </nav>
  );
}
