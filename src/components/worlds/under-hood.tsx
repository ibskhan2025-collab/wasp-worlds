"use client";

import Link from "next/link";
import { useState } from "react";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";
import type { WorldId } from "@/lib/types";
import { worldBySlug, type World as World51 } from "@/rb15l/worlds51";

function Hood({ w }: { w: World51 }) {
  const [open, setOpen] = useState<number>(0);
  const levels = [
    { k: "Level 1", t: "What is it?", body: <p>{w.line} {w.hood.built}</p> },
    { k: "Level 2", t: "How does it work?", body: <p>{w.hood.model}</p> },
    { k: "Level 3", t: "How was it built?", body: <><p><b>Why.</b> {w.hood.why}</p><p className="mt-3"><b>How.</b> {w.hood.how}</p></> },
    { k: "Level 4", t: "Technical breakdown", body: <><p><b>Technology.</b></p><ul className="mt-2 flex flex-wrap gap-2">{w.hood.tech.map((t) => <li key={t} className="rounded-full border border-white/20 px-3 py-1 font-mono text-xs">{t}</li>)}</ul><p className="mt-4"><b>Challenges.</b> {w.hood.challenges}</p></> },
  ];
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {levels.map((l, i) => (
        <div key={l.k}>
          <h3>
            <button aria-expanded={open === i} aria-controls={`lvl-${l.k}`} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-baseline gap-4 py-4 text-left">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{l.k}</span>
              <span className="text-xl font-semibold">{l.t}</span>
              <span className="ml-auto font-mono text-lg" aria-hidden="true">{open === i ? "−" : "+"}</span>
            </button>
          </h3>
          <div id={`lvl-${l.k}`} hidden={open !== i} className="max-w-3xl pb-6 text-[15px] leading-relaxed text-white/75">{l.body}</div>
        </div>
      ))}
    </div>
  );
}

export function UnderHood({ world }: { world: WorldId }) {
  const w51 = worldBySlug(world);
  const realities = REALITIES[world] ?? [];
  const idx = WORLDS.findIndex((w) => w.id === world);
  const prev = WORLDS[(idx + WORLDS.length - 1) % WORLDS.length];
  const next = WORLDS[(idx + 1) % WORLDS.length];
  if (!w51) return null;
  return (
    <section id="proof" className="border-t border-white/10 bg-[#0a0a0b] px-5 py-16 text-white sm:px-10" aria-labelledby={`proof-h-${world}`}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">Layer 3 · Proof</p>
        <h2 id={`proof-h-${world}`} className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">Under the hood</h2>
        <p className="mt-3 max-w-2xl text-white/65">{w51.name} is a self-initiated, fictional concept. Nothing here is a real client. Everything here works.</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <Hood w={w51} />
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Demonstrates</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {w51.caps.map((c) => (
                <li key={c} className="rounded-full border border-white/20 px-3 py-1 text-xs">{c}</li>
              ))}
            </ul>
            <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Realities ({realities.length})</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {realities.map((r) => (
                <li key={r.id}>
                  <Link href={r.id === "classic" ? `/worlds/${world}` : `/worlds/${world}/${r.id}`} className="font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{r.label}</Link> — {r.note}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav className="mt-14 grid grid-cols-2 gap-px bg-white/10" aria-label="Adjacent worlds">
          <Link href={`/worlds/${prev.id}`} className="block bg-[#0a0a0b] p-5 hover:bg-white/5"><span className="font-mono text-[11px] text-white/50">← World {prev.room}</span><br /><span className="text-2xl font-black">{prev.name}</span></Link>
          <Link href={`/worlds/${next.id}`} className="block bg-[#0a0a0b] p-5 text-right hover:bg-white/5"><span className="font-mono text-[11px] text-white/50">World {next.room} →</span><br /><span className="text-2xl font-black">{next.name}</span></Link>
        </nav>
      </div>
    </section>
  );
}
