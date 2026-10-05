"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DISCIPLINES, WORLDS, type World } from "@/zip/rb3/live";

export const matches = (w: World, sel: string[]) => sel.length === 0 || sel.some((s) => w.disc.includes(s as never) || w.caps.includes(s));

export function CapFilter({ sel, setSel, extra }: { sel: string[]; setSel: (s: string[]) => void; extra?: string[] }) {
  const items = [...DISCIPLINES, ...(extra ?? [])];
  const n = (s: string) => WORLDS.filter((w) => matches(w, [s])).length;
  return (
    <div role="group" aria-label="Filter worlds by capability" className="flex flex-wrap items-center gap-2">
      {items.map((d) => (
        <button key={d} aria-pressed={sel.includes(d)} onClick={() => setSel(sel.includes(d) ? sel.filter((x) => x !== d) : [...sel, d])}
          className={"rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors " + (sel.includes(d) ? "border-[#ffd23f] bg-[#ffd23f] text-black" : "border-white/25 text-white/70 hover:border-white/60 hover:text-white")}>
          {d} <span className="opacity-60">{n(d)}</span>
        </button>
      ))}
      {sel.length > 0 && <button onClick={() => setSel([])} className="font-mono text-[11px] uppercase tracking-[0.15em] underline">Clear</button>}
    </div>
  );
}

function pos(i: number) {
  const a = i * 2.39996, r = Math.sqrt((i + 0.6) / 15.4);
  return { x: 50 + Math.cos(a) * r * 44, y: 50 + Math.sin(a) * r * 41 };
}

export function WorldField({ sel, tall = false }: { sel: string[]; tall?: boolean }) {
  const [hov, setHov] = useState<World | null>(null);
  const P = useMemo(() => WORLDS.map((_, i) => pos(i)), []);
  const links = useMemo(() => {
    const out: [number, number][] = [];
    WORLDS.forEach((a, i) => WORLDS.forEach((b, j) => { if (j > i && a.disc.filter((d) => b.disc.includes(d)).length >= 2) out.push([i, j]); }));
    return out;
  }, []);
  const on = (w: World) => matches(w, sel);
  return (
    <div className={"relative w-full overflow-hidden " + (tall ? "h-[78vh] min-h-[560px]" : "h-[72vh] min-h-[520px]")} role="group" aria-label="Field of 15 worlds">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {links.map(([i, j]) => { const act = on(WORLDS[i]) && on(WORLDS[j]); const hl = hov && (hov === WORLDS[i] || hov === WORLDS[j]); return <line key={i + "-" + j} x1={P[i].x} y1={P[i].y} x2={P[j].x} y2={P[j].y} stroke={hl ? "#ffd23f" : "#fff"} strokeOpacity={hl ? 0.8 : act ? 0.13 : 0.03} strokeWidth="0.15" vectorEffect="non-scaling-stroke" />; })}
      </svg>
      {WORLDS.map((w, i) => (
        <Link key={w.slug} href={`/worlds/${w.slug}`} onMouseEnter={() => setHov(w)} onMouseLeave={() => setHov(null)} onFocus={() => setHov(w)} onBlur={() => setHov(null)}
          aria-label={`World ${w.num}: ${w.name}. ${w.line}`}
          className="group absolute z-10 whitespace-nowrap transition-opacity duration-500" style={{ left: `${P[i].x}%`, top: `${P[i].y}%`, opacity: on(w) ? 1 : 0.12, animation: `wasp-float ${5 + (i % 5)}s ease-in-out ${i * 0.3}s infinite`, transform: "translate(-50%,-50%)" }}>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-[2.2] group-focus-visible:scale-[2.2]" style={{ background: w.palette.accent, boxShadow: `0 0 18px ${w.palette.accent}` }} />
            <span className="font-mono text-[10px] text-white/50">{w.num}</span>
            <span className="text-[clamp(1rem,3.2vw,2.6rem)] font-black leading-none tracking-tight text-white transition-colors group-hover:text-[color:var(--c)] group-focus-visible:text-[color:var(--c)]" style={{ "--c": w.palette.accent } as React.CSSProperties}>{w.name}</span>
          </span>
        </Link>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6" aria-live="polite">
        {hov ? (
          <div className="flex flex-wrap items-end gap-x-6 gap-y-1"><p className="text-3xl font-black" style={{ color: hov.palette.accent }}>{hov.name}</p><p className="max-w-xl text-sm text-white/80">{hov.line}</p><p className="font-mono text-[11px] uppercase tracking-widest text-white/50">{hov.realities.length} realities · {hov.disc.join(" / ")}</p></div>
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">{WORLDS.filter(on).length} of 15 worlds lit · hover, focus or tap a world · lines connect worlds that share disciplines</p>
        )}
      </div>
    </div>
  );
}
