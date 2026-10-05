"use client";
import Link from "next/link";
import { useState } from "react";
import { CapFilter, WorldField, matches } from "@/zip/rb3/WorldField";
import { WORLDS } from "@/zip/rb3/live";

export default function Universe() {
  const [sel, setSel] = useState<string[]>([]);
  const lit = WORLDS.filter((w) => matches(w, sel));
  return (
    <section id="field" className="border-t border-white/10 px-5 py-20 sm:px-10" aria-labelledby="field-h">
      <div className="mx-auto max-w-[1800px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">The world field · 15 worlds · multiple realities · one studio</p>
        <h2 id="field-h" className="mt-3 max-w-4xl text-[clamp(2.2rem,6vw,5.5rem)] font-black leading-[0.95] tracking-tight">Fifteen proofs that a site can be anything.</h2>
        <p className="mt-4 max-w-2xl text-white/60">Each world is a complete, working product — a restaurant that takes bookings, a game you can lose, a house you can walk into. All are fictional, self-initiated, and built to show range. Choose a capability to light up the ones that prove it.</p>
        <div className="mt-8"><CapFilter sel={sel} setSel={setSel} /></div>
        <div className="mt-6 border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent"><WorldField sel={sel} /></div>
        {sel.length > 0 && <ul className="mt-6 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4" aria-label="Matching worlds">{lit.map((w) => <li key={w.slug} className="bg-[#09090a]"><Link href={`/worlds/${w.slug}`} className="block p-4 hover:bg-white/5"><span className="font-mono text-[10px] text-white/50">WORLD {w.num}</span><br /><b className="text-xl" style={{ color: w.palette.accent }}>{w.name}</b><br /><span className="text-xs text-white/60">{w.caps.slice(0, 4).join(" · ")}</span></Link></li>)}</ul>}
        <div className="mt-6"><Link href="/worlds" className="border-b border-[#ffd23f] pb-1 text-sm uppercase tracking-[0.15em] text-[#ffd23f]">Open the full world index →</Link></div>
      </div>
    </section>
  );
}
