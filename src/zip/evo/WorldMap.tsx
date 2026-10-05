"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { WORLDS, CAPS, capName } from "@/zip/evo/live";
import { px } from "@/zip/evo/media";
import { useWasp } from "@/zip/evo/state";

// Hand-placed, and opinionated: x = how loud the world is, y = how much of a working product it is.
const POS: Record<string, [number, number]> = { casa: [0.45, 0.8], noir: [0.3, 0.66], orbit: [0.18, 0.95], still: [0.05, 0.48], signal: [0.95, 0.32], objects: [0.72, 0.86], archive: [0.1, 0.72], motion: [0.74, 0.18], void: [0.58, 0.05], atlas: [0.42, 0.9], forge: [0.34, 0.97], pulse: [0.9, 0.6], civic: [0.02, 0.99], nest: [0.24, 0.58], vector: [0.28, 0.4] };

export function WorldMap() {
  const sp = useSearchParams(); const router = useRouter();
  const cap = sp.get("cap");
  const [view, setView] = useState<"map" | "index">("map");
  const [h, setH] = useState<string | null>(null);
  const { memory } = useWasp();
  const hw = WORLDS.find((w) => w.slug === h);
  const links = useMemo(() => {
    if (!hw) return [];
    return WORLDS.filter((o) => o.slug !== hw.slug).map((o) => ({ o, n: o.caps.filter((c) => hw.caps.includes(c)).length })).filter((x) => x.n >= 2);
  }, [hw]);
  const lit = (slug: string) => !cap || WORLDS.find((w) => w.slug === slug)!.caps.includes(cap);

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-24 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div><p className="mono text-ink-2">Worlds · self-initiated · fictional brands · working code</p><h1 className="display mt-2 text-7xl md:text-9xl">The worlds.</h1></div>
        <div className="flex border border-ink" role="radiogroup" aria-label="View">
          {(["map", "index"] as const).map((v) => <button key={v} role="radio" aria-checked={view === v} onClick={() => setView(v)} className={`mono px-4 py-2 ${view === v ? "bg-ink text-paper" : ""}`}>{v}</button>)}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by capability">
        <span className="mono text-ink-2">Proves:</span>
        <button onClick={() => router.replace("/worlds")} aria-pressed={!cap} className={`border px-2 py-1 text-sm ${!cap ? "border-ink bg-ink text-paper" : "border-ink/25"}`}>Everything</button>
        {CAPS.map((c) => <button key={c.id} onClick={() => router.replace(`/worlds?cap=${c.id}`)} aria-pressed={cap === c.id} className={`border px-2 py-1 text-sm ${cap === c.id ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink"}`}>{c.name}</button>)}
      </div>
      {cap && <p className="mt-3 text-lg">{CAPS.find((c) => c.id === cap)?.plain}</p>}

      {view === "map" ? (
        <div className="relative mt-8 aspect-[4/5] w-full border border-ink bg-paper-2 sm:aspect-[16/10]" onPointerLeave={() => setH(null)}>
          <span className="mono absolute bottom-2 left-3 text-ink-2">← quiet</span><span className="mono absolute bottom-2 right-3 text-ink-2">loud →</span>
          <span className="mono absolute left-2 top-3 text-ink-2 [writing-mode:vertical-rl] rotate-180">product ↑</span>
          <span className="mono absolute bottom-10 left-2 text-ink-2 [writing-mode:vertical-rl] rotate-180">↓ experiment</span>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeOpacity=".08" vectorEffect="non-scaling-stroke" /><line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity=".08" vectorEffect="non-scaling-stroke" />
            {hw && links.map(({ o, n }) => { const a = POS[hw.slug], b = POS[o.slug]; return <line key={o.slug} x1={6 + a[0] * 88} y1={6 + (1 - a[1]) * 88} x2={6 + b[0] * 88} y2={6 + (1 - b[1]) * 88} stroke="var(--ink)" strokeWidth={n} strokeOpacity=".35" vectorEffect="non-scaling-stroke" strokeDasharray="4 3" />; })}
          </svg>
          {WORLDS.map((w) => { const [x, y] = POS[w.slug]; const on = lit(w.slug); const near = hw && (hw.slug === w.slug || links.some((l) => l.o.slug === w.slug)); return (
            <Link key={w.slug} href={`/worlds/${w.slug}`} onPointerEnter={() => setH(w.slug)} onFocus={() => setH(w.slug)} data-cursor="ENTER"
              className="group absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500" style={{ left: `${6 + x * 88}%`, top: `${6 + (1 - y) * 88}%`, opacity: on ? (hw && !near ? 0.35 : 1) : 0.12, zIndex: h === w.slug ? 10 : 1 }}>
              <span className={`block overflow-hidden rounded-full border-2 border-ink transition-all duration-500 ${h === w.slug ? "h-24 w-24 md:h-32 md:w-32" : "h-10 w-10 md:h-14 md:w-14"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={px(w.cover, 300)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </span>
              <span className="mono absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap bg-paper px-1">{w.name}{memory.visited.includes(w.slug) && " ✓"}</span>
            </Link>); })}
          {hw && (
            <div className="pointer-events-none absolute right-3 top-3 max-w-xs border border-ink bg-paper p-3 text-sm shadow-[3px_3px_0_var(--ink)]">
              <p className="font-bold">{hw.name} · {hw.kind}</p><p className="mt-1">{hw.line}</p>
              <p className="mono mt-2 text-ink-2">{hw.caps.map(capName).join(" · ")}</p>
              {links.length > 0 && <p className="mono mt-1 text-ink-2">dashed lines = shares 2+ capabilities</p>}
            </div>)}
        </div>
      ) : (
        <ul className="mt-8 grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.filter((w) => lit(w.slug)).map((w) => (
            <li key={w.slug} style={{ background: w.bg, color: w.fg }}>
              <Link href={`/worlds/${w.slug}`} className="group block p-5" data-cursor="ENTER">
                <div className="flex items-baseline justify-between"><span className="mono opacity-60">{w.n}</span><span className="mono opacity-60">{w.mood}{memory.visited.includes(w.slug) && " · visited"}</span></div>
                <p className="mt-6 text-5xl" style={{ fontFamily: w.font }}>{w.name}</p>
                <p className="mt-2 opacity-80">{w.line}</p>
                <div className="mt-4 aspect-[16/9] overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={px(w.cover, 700)} alt={w.cover.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <p className="mono mt-3 opacity-70">{w.realities.length} realities · {w.cta} →</p>
              </Link>
            </li>))}
        </ul>
      )}
      <p className="mt-6 max-w-2xl text-ink-2">Every world here is a fictional brand, built by WASP as a working product: real forms, real state, real 3D where it helps. Photography is credited stock used for art direction. Real client work lives separately, on <Link href="/work" className="underline">Work</Link>.</p>
    </div>
  );
}
