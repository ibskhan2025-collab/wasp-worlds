"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { WORLDS, CAPS, LAB, worldBySlug } from "@/zip/evo/live";
import { media, px } from "@/zip/evo/media";
import { ask } from "@/zip/evo/operator";
import { ROUTES } from "@/zip/evo/operator";
import { Img, Kicker, Moment, Reveal } from "@/zip/evo/ui";
import { useWasp } from "@/zip/evo/state";

export function Hero() {
  const { memory, say } = useWasp();
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);
  const visited = memory.visited.map(worldBySlug).filter(Boolean);
  const surprise = () => {
    const r = ROUTES.surprise[Math.floor(Math.random() * ROUTES.surprise.length)];
    sessionStorage.setItem("wasp:route", JSON.stringify(r));
    say("Okay. Let's go.");
    router.push(r[0]);
  };
  return (
    <section className="relative flex min-h-[100svh] flex-col pt-14" aria-labelledby="hero-h" data-comp="Hero">
      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-8 px-4 pt-8 md:grid-cols-12 md:px-6 md:pt-14">
        <div className="md:col-span-8">
          <p className="mono text-ink-2">WASP · independent design + build studio</p>
          <h1 id="hero-h" className="display mt-4 text-[17vw] md:text-[9.2vw]">
            <span className="block overflow-hidden"><span className="block" style={{ animation: "rise 1s var(--ease-out) both" }}>Websites are</span></span>
            <span className="block overflow-hidden"><span className="block italic" style={{ animation: "rise 1s var(--ease-out) .12s both" }}>too small <span className="relative inline-block">a word.<svg aria-hidden className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" preserveAspectRatio="none" data-fx><path d="M2,14 C80,4 160,18 298,6" stroke="var(--signal)" strokeWidth="7" fill="none" strokeLinecap="round" style={{ strokeDasharray: 320, strokeDashoffset: 320, animation: "vdraw 1s var(--ease-out) .9s forwards" }} /></svg></span></span></span>
          </h1>
          <style>{"@keyframes vdraw{to{stroke-dashoffset:0}}"}</style>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-4 md:pb-4">
          <p className="text-lg leading-relaxed md:text-xl">We design and build the thing, not a picture of the thing: restaurant sites that take bookings, stores that take money, dashboards that let someone do the job.</p>
          <p className="text-ink-2">The fifteen worlds below are fictional brands we built as <em>working products</em> — to show you, instead of telling you.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/start" className="btn btn-primary" data-magnet data-cursor="START">Start a project →</Link>
            <Link href="/worlds" className="btn btn-ghost" data-cursor="EXPLORE">Explore the worlds</Link>
          </div>
          <div className="mono flex flex-wrap gap-x-4 gap-y-1 text-ink-2">
            <Link href="/tour/30" className="link-u hover:text-ink">I have 30 seconds</Link>
            <Link href="/tour/deep" className="link-u hover:text-ink">I have time</Link>
            <button onClick={surprise} className="link-u hover:text-ink">Surprise me</button>
          </div>
        </div>
      </div>

      {visited.length > 0 && (
        <div className="mono mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-2 px-4 pb-3 text-ink-2 md:px-6">
          <span>Continue exploring —</span>{visited.slice(-4).map((w) => <Link key={w!.slug} href={`/worlds/${w!.slug}`} className="border border-ink/30 px-2 py-0.5 hover:border-ink hover:text-ink">{w!.name}</Link>)}
          <span className="opacity-60">· {visited.length}/15 visited</span>
        </div>
      )}

      {/* The rail: 15 worlds assemble, then open under the cursor. Mobile: swipe. */}
      <div className="no-scrollbar flex h-[34svh] min-h-[220px] w-full snap-x snap-mandatory gap-1 overflow-x-auto px-1 md:overflow-visible md:snap-none" role="list" aria-label="The fifteen worlds" onPointerLeave={() => setActive(null)}>
        {WORLDS.map((w, i) => (
          <Link key={w.slug} href={`/worlds/${w.slug}`} role="listitem" onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)}
            className="group relative min-w-[42vw] snap-start overflow-hidden md:min-w-0 md:transition-[flex-grow] md:duration-700 md:ease-[var(--ease-out)]"
            style={{ flexGrow: active === i ? 7 : 1, flexBasis: 0, animation: `rise .9s var(--ease-out) ${0.3 + i * 0.045}s both` }} data-cursor="ENTER">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={px(w.cover, 900)} alt={w.cover.alt} className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${active === i ? "scale-100 grayscale-0" : "scale-110 md:grayscale"}`} loading={i < 6 ? "eager" : "lazy"} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <p className="mono opacity-70">{w.n}</p>
              <p className="text-lg font-black tracking-wide md:text-xl" style={{ fontFamily: active === i ? w.font : undefined }}>{w.name}</p>
              <p className={`mono transition-opacity duration-500 ${active === i ? "opacity-90" : "opacity-0 md:opacity-0"} max-md:opacity-80`}>{w.kind}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* 02 — PROOF: a tiny instrument panel. Each tab is a real, working miniature. */
const PROOF_TABS = ["Design", "Software", "3D", "AI", "Data", "Motion"] as const;
export function Proof() {
  const [t, setT] = useState<(typeof PROOF_TABS)[number]>("Design");
  const link: Record<string, [string, string]> = { Design: ["/tools#system", "Open the design system lab"], Software: ["/worlds/orbit", "Explore the product (ORBIT)"], "3D": ["/worlds/forge", "Enter the 3D inspector (FORGE)"], AI: ["/worlds", "Ask it anything with ⌘K"], Data: ["/worlds/vector", "Read the numbers (VECTOR)"], Motion: ["/worlds/motion", "Open the motion system"] };
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-24 md:px-6" aria-labelledby="proof-h" data-comp="Proof">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Kicker n="02">Proof, not adjectives</Kicker>
          <Reveal as="h2" className="display mt-4 text-6xl md:text-7xl">Don&apos;t take our word for it. <em>Poke it.</em></Reveal>
          <p className="mt-4 max-w-sm text-ink-2">Six working miniatures. Each one is a small piece of something bigger on this site.</p>
        </div>
        <div className="border border-ink bg-paper-2 md:col-span-8">
          <div className="flex overflow-x-auto border-b border-ink" role="tablist" aria-label="Capability demos">
            {PROOF_TABS.map((x) => <button key={x} role="tab" aria-selected={t === x} onClick={() => setT(x)} className={`mono flex-1 px-4 py-3 ${t === x ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{x}</button>)}
          </div>
          <div className="min-h-[340px] p-6" role="tabpanel" aria-label={t}>
            {t === "Design" && <MiniType />}{t === "Software" && <MiniCrud />}{t === "3D" && <MiniCube />}{t === "AI" && <MiniAsk />}{t === "Data" && <MiniData />}{t === "Motion" && <MiniSpring />}
          </div>
          <div className="flex items-center justify-between border-t border-ink px-6 py-3"><span className="mono text-ink-2">Miniature · the real one is bigger</span><Link href={link[t][0]} className="mono link-u">{link[t][1]} →</Link></div>
        </div>
      </div>
    </section>
  );
}
function MiniType() {
  const [ratio, setRatio] = useState(1.333); const [base, setBase] = useState(16);
  return (<div><div className="mb-4 flex flex-wrap gap-6 text-sm"><label className="flex items-center gap-2">Scale ratio {ratio.toFixed(3)}<input type="range" min={1.067} max={1.618} step={0.001} value={ratio} onChange={(e) => setRatio(+e.target.value)} className="accent-[var(--ink)]" /></label><label className="flex items-center gap-2">Base {base}px<input type="range" min={12} max={22} value={base} onChange={(e) => setBase(+e.target.value)} className="accent-[var(--ink)]" /></label></div>
    {[4, 3, 2, 1, 0].map((s) => <p key={s} className="truncate leading-tight" style={{ fontSize: base * Math.pow(ratio, s), fontFamily: s > 1 ? "var(--display)" : undefined }}><span className="mono mr-3 inline-block w-14 align-middle text-ink-2">{Math.round(base * Math.pow(ratio, s))}px</span>{["The room after the decision", "Hierarchy is a choice", "What you made large", "Everything else steps back", "Body text should just be readable."][4 - s]}</p>)}</div>);
}
function MiniCrud() {
  const [items, setItems] = useState([{ n: "Harbour Bakery", v: 49 }, { n: "Kiln & Co", v: 290 }]); const [n, setN] = useState("");
  return (<div><form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (n.trim()) { setItems([...items, { n: n.trim(), v: 49 }]); setN(""); } }}><input value={n} onChange={(e) => setN(e.target.value)} placeholder="Add a customer" aria-label="Customer name" className="flex-1 border border-ink bg-paper px-3 py-2" /><button className="btn btn-primary !py-2">Add</button></form>
    <p className="mono mt-4 text-ink-2">MRR (derived): €{items.reduce((a, b) => a + b.v, 0)} · {items.length} customers</p>
    <ul className="mt-2 divide-y divide-ink/15">{items.map((it, i) => <li key={i} className="flex items-center justify-between py-2"><span>{it.n}</span><span className="flex items-center gap-3"><button className="mono" onClick={() => setItems(items.map((x, j) => (j === i ? { ...x, v: x.v === 49 ? 290 : x.v === 290 ? 1200 : 49 } : x)))}>€{it.v} ↻</button><button className="mono text-red-700" onClick={() => setItems(items.filter((_, j) => j !== i))}>delete</button></span></li>)}</ul>
    {items.length === 0 && <p className="py-4">Empty. Good empty states tell you what to do next — add one above.</p>}</div>);
}
function MiniCube() {
  const [r, setR] = useState({ x: -20, y: 30 }); const d = useRef<{ x: number; y: number } | null>(null);
  return (<div className="flex flex-col items-center gap-4 md:flex-row md:justify-around"><div className="h-56 w-56 touch-none [perspective:700px]" data-cursor="ROTATE" onPointerDown={(e) => { d.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture?.(e.pointerId); }} onPointerMove={(e) => { if (!d.current) return; setR((p) => ({ x: p.x - (e.clientY - d.current!.y) * 0.5, y: p.y + (e.clientX - d.current!.x) * 0.5 })); d.current = { x: e.clientX, y: e.clientY }; }} onPointerUp={() => (d.current = null)}>
    <div className="relative mx-auto mt-10 h-32 w-32 [transform-style:preserve-3d]" style={{ transform: `rotateX(${r.x}deg) rotateY(${r.y}deg)` }}>
      {[["rotateY(0deg)", media.forge.gears], ["rotateY(90deg)", media.nest.stairs], ["rotateY(180deg)", media.casa.rigatoni], ["rotateY(-90deg)", media.pulse.night], ["rotateX(90deg)", media.still[0]], ["rotateX(-90deg)", media.objects[1]]].map(([tf, p], i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={px(p as typeof media.still[0], 300)} alt="" draggable={false} className="absolute inset-0 h-32 w-32 border border-ink object-cover" style={{ transform: `${tf} translateZ(64px)` }} />))}
    </div></div>
    <p className="max-w-xs text-ink-2">Drag to rotate. This one is CSS 3D — the lightweight kind. The WebGL scenes (FORGE&apos;s procedural gear, NEST&apos;s extruded floor plan) load only when you ask for them.</p></div>);
}
function MiniAsk() {
  const [q, setQ] = useState("Show me something technically difficult"); const a = useMemo(() => ask(q), [q]);
  return (<div><input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask the Operator" className="w-full border border-ink bg-paper px-3 py-3 text-lg" />
    <div className="mt-2 flex flex-wrap gap-2">{["I need a restaurant website", "Show me 3D", "Something weird", "I don't know what I need"].map((s) => <button key={s} onClick={() => setQ(s)} className="mono border border-ink/30 px-2 py-1 hover:border-ink">{s}</button>)}</div>
    <p className="mt-4 text-lg">{a.say}</p><ul className="mt-3 space-y-1">{a.results.map((r) => <li key={r.href}><Link href={r.href} className="link-u">→ {r.title} <span className="text-ink-2">— {r.sub}</span></Link></li>)}</ul>
    <p className="mono mt-4 text-ink-2">Operator: intent rules + fuzzy ranking over this site&apos;s index. It can&apos;t invent a project.</p></div>);
}
function MiniData() {
  // Real, public: approx. 2023 population of the five largest EU cities (Eurostat/city stats, rounded millions).
  const base = [["Berlin", 3.76], ["Madrid", 3.33], ["Rome", 2.75], ["Paris", 2.10], ["Vienna", 1.98]] as const;
  const [sort, setSort] = useState(true); const [h, setH] = useState<string | null>(null);
  const d = [...base].sort((a, b) => (sort ? b[1] - a[1] : a[0].localeCompare(b[0])));
  const avg = base.reduce((a, b) => a + b[1], 0) / base.length;
  return (<div><div className="mb-4 flex items-center justify-between"><p className="mono text-ink-2">City-proper population, millions · HISTORICAL · rounded</p><button onClick={() => setSort(!sort)} className="mono border border-ink px-2 py-1">Sort: {sort ? "value" : "name"}</button></div>
    <div className="space-y-2">{d.map(([c, v]) => <div key={c} className="flex items-center gap-3" onPointerEnter={() => setH(c)} onPointerLeave={() => setH(null)}><span className="w-16 text-sm">{c}</span><div className="relative h-8 flex-1 bg-ink/5"><div className="h-full bg-ink transition-all duration-500" style={{ width: `${(v / 4) * 100}%`, background: h === c ? "var(--signal)" : undefined }} /><div className="absolute top-0 h-full border-l-2 border-dashed border-red-600" style={{ left: `${(avg / 4) * 100}%` }} /></div><span className="mono w-24">{v.toFixed(2)}m {h === c && <span className="text-ink-2">{v > avg ? "+" : ""}{(((v - avg) / avg) * 100).toFixed(0)}%</span>}</span></div>)}</div>
    <p className="mono mt-3 text-ink-2">dashed = mean ({avg.toFixed(2)}m) · hover for difference from mean · Paris is small because the city proper is tiny, not because Paris is</p></div>);
}
function MiniSpring() {
  const ref = useRef<HTMLDivElement>(null); const box = useRef<HTMLDivElement>(null); const tgt = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => { let x = 0.5, y = 0.5, vx = 0, vy = 0, raf = 0; const loop = () => { const k = 120, c = 9; vx += (-k * (x - tgt.current.x) - c * vx) / 60 / 60 * 60 / 60; vy += (-k * (y - tgt.current.y) - c * vy) / 3600; x += vx / 60; y += vy / 60; if (ref.current && box.current) { ref.current.style.left = `${x * 100}%`; ref.current.style.top = `${y * 100}%`; ref.current.style.transform = `translate(-50%,-50%) scale(${1 + Math.min(Math.hypot(vx, vy) * 0.8, 0.6)}, ${1 - Math.min(Math.hypot(vx, vy) * 0.4, 0.3)}) rotate(${Math.atan2(vy, vx)}rad)`; } raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf); }, []);
  return (<div ref={box} className="relative h-[300px] cursor-crosshair overflow-hidden border border-dashed border-ink/30" data-cursor="CLICK" onPointerDown={(e) => { const r = box.current!.getBoundingClientRect(); tgt.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; }}>
    <div ref={ref} className="absolute h-10 w-10 rounded-full bg-[var(--signal)] ring-2 ring-ink" /><p className="mono absolute bottom-2 left-2 text-ink-2">Click anywhere. It&apos;s a spring, not a tween — it squashes along its velocity.</p></div>);
}

/* 03 — WORLDS as a giant index. Image follows the cursor. */
export function WorldIndex() {
  const [h, setH] = useState<number | null>(null); const img = useRef<HTMLDivElement>(null); const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => { let raf = 0; const loop = () => { const p = pos.current; p.x += (p.tx - p.x) * 0.14; p.y += (p.ty - p.y) * 0.14; if (img.current) img.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%,-50%) rotate(${(p.tx - p.x) * 0.03}deg)`; raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf); }, []);
  return (
    <section className="relative border-y border-ink bg-ink text-paper" aria-labelledby="wi-h" data-comp="WorldIndex" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); pos.current.tx = e.clientX - r.left; pos.current.ty = e.clientY - r.top; }}>
      <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mono opacity-60">03 — The universe</p><h2 id="wi-h" className="display mt-3 text-6xl md:text-8xl">Fifteen worlds.<br /><em>Fifteen different websites.</em></h2></div><p className="max-w-sm opacity-70">Different type, colour, motion, navigation and spatial logic in each. Same studio underneath. All fictional brands, all working code.</p></div>
        <ul className="mt-12" onPointerLeave={() => setH(null)}>
          {WORLDS.map((w, i) => (
            <li key={w.slug} className="border-t border-paper/15 last:border-b">
              <Link href={`/worlds/${w.slug}`} onPointerEnter={() => setH(i)} onFocus={() => setH(i)} className="group flex items-baseline gap-4 py-3 md:py-4" data-cursor="ENTER">
                <span className="mono w-8 opacity-40">{w.n}</span>
                <span className="text-4xl leading-none transition-all duration-500 md:text-7xl" style={{ fontFamily: h === i ? w.font : "var(--sans)", fontWeight: h === i ? 400 : 800, color: h === i ? w.accent === w.fg ? "var(--signal)" : w.accent : undefined, letterSpacing: h === i ? "0" : "-0.03em" }}>{w.name}</span>
                <span className="mono ml-auto hidden text-right opacity-50 md:block">{w.kind}<br />{w.mood}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/worlds" className="btn btn-primary">See them as a map →</Link><Link href="/city" className="btn btn-ghost">Or walk the 3D city</Link></div>
      </div>
      <div ref={img} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 hidden h-64 w-48 overflow-hidden transition-opacity duration-300 md:block" style={{ opacity: h === null ? 0 : 1 }} data-fx>
        {h !== null && /* eslint-disable-next-line @next/next/no-img-element */ <img src={px(WORLDS[h].cover, 500)} alt="" className="h-full w-full object-cover" />}
      </div>
    </section>
  );
}

/* 04 — FEATURED */
const FEAT = [
  { slug: "casa", claim: "A reservation flow that validates, stores the booking in Postgres, and tells you when Friday is filling up.", cta: "Enter the restaurant" },
  { slug: "forge", claim: "One part spec drives an SVG engineering drawing, a procedural Three.js model, and a quote with quantity breaks.", cta: "Open the machine" },
  { slug: "orbit", claim: "A SaaS console where every metric is derived from the table below it — and a terminal that edits the same data.", cta: "Explore the product" },
  { slug: "nest", claim: "An interactive floor plan whose rooms are extruded into walkable 3D walls from the same coordinates.", cta: "Walk the house" },
];
export function Featured() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-24 md:px-6" aria-labelledby="feat-h" data-comp="Featured">
      <Kicker n="04">Featured work</Kicker>
      <h2 id="feat-h" className="display mt-4 text-6xl md:text-7xl">Four to start with.</h2>
      <div className="mt-12 space-y-24">
        {FEAT.map((f, i) => { const w = worldBySlug(f.slug)!; return (
          <article key={f.slug} className={`grid items-center gap-8 md:grid-cols-12 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
            <Link href={`/worlds/${w.slug}`} className="block md:col-span-7 [direction:ltr]" data-cursor="ENTER"><Img p={w.cover} className="aspect-[4/3] w-full" shift caption={w.name} sizes="(min-width:768px) 58vw, 100vw" /></Link>
            <div className="md:col-span-5 [direction:ltr]">
              <p className="mono text-ink-2">{w.n} · {w.kind} · fictional brand</p>
              <h3 className="mt-2 text-6xl font-black tracking-tight" style={{ fontFamily: w.font }}>{w.name}</h3>
              <p className="mt-4 text-xl leading-snug">{f.claim}</p>
              <p className="mono mt-4 text-ink-2">{w.realities.map((r) => r.name).join(" · ")}</p>
              <div className="mt-6 flex flex-wrap gap-3"><Link href={`/worlds/${w.slug}`} className="btn btn-ghost">{f.cta} →</Link><Link href={`/worlds/${w.slug}#machine`} className="mono link-u self-center">See how it was built</Link></div>
            </div>
          </article>); })}
      </div>
      <div className="mt-24"><Moment q="Seen something close to what you need?" cta="Build something like this" note="Tell us which world. It helps." /></div>
    </section>
  );
}

/* 05 — CAPABILITY GRAPH: hover a capability, the worlds that prove it wake up. */
export function Capabilities() {
  const [cap, setCap] = useState<string>("commerce");
  const c = CAPS.find((x) => x.id === cap)!;
  const proving = WORLDS.filter((w) => w.caps.includes(cap));
  return (
    <section className="border-t border-ink bg-paper-2" aria-labelledby="cap-h" data-comp="Capabilities">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-24 md:grid-cols-12 md:px-6">
        <div className="md:col-span-5">
          <Kicker n="05">Capabilities, with receipts</Kicker>
          <h2 id="cap-h" className="display mt-4 text-6xl">No skill bars. <em>Evidence.</em></h2>
          <ul className="mt-8 flex flex-wrap gap-2">{CAPS.map((x) => <li key={x.id}><button onPointerEnter={() => setCap(x.id)} onFocus={() => setCap(x.id)} onClick={() => setCap(x.id)} aria-pressed={cap === x.id} className={`border px-3 py-1.5 text-sm transition ${cap === x.id ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink"}`}>{x.name}</button></li>)}</ul>
        </div>
        <div className="md:col-span-7" aria-live="polite">
          <p className="display text-4xl">{c.name}</p>
          <p className="mt-2 text-xl">{c.plain}</p>
          <p className="mono mt-4 text-ink-2">{c.name} → {c.uses.join(" → ")}</p>
          <div className="mt-6 grid grid-cols-5 gap-1.5">
            {WORLDS.map((w) => { const on = w.caps.includes(cap); return (
              <Link key={w.slug} href={`/worlds/${w.slug}`} className={`relative aspect-square overflow-hidden transition-all duration-500 ${on ? "opacity-100" : "opacity-20 grayscale"}`} aria-label={`${w.name}${on ? ` proves ${c.name}` : ""}`} tabIndex={on ? 0 : -1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={px(w.cover, 300)} alt="" className="h-full w-full object-cover" loading="lazy" /><span className="mono absolute bottom-1 left-1 bg-black/60 px-1 text-[9px] text-white">{w.name}</span>
              </Link>); })}
          </div>
          <p className="mono mt-3 text-ink-2">{proving.length} world{proving.length === 1 ? "" : "s"} prove this: {proving.map((w) => w.name).join(", ")}</p>
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] px-4 pb-16 md:px-6"><Moment q="Tell us what you're trying to build." cta="Start a project" /></div>
    </section>
  );
}

/* 06 — HOW + 07 — LAB + 08 — ABOUT */
export function HowLabAbout() {
  return (<>
    <section className="mx-auto max-w-[1600px] px-4 py-24 md:px-6" aria-labelledby="how-h">
      <Kicker n="06">How it&apos;s built</Kicker>
      <div className="mt-4 grid gap-10 md:grid-cols-12">
        <h2 id="how-h" className="display text-6xl md:col-span-5">Design and code in one motion.</h2>
        <ol className="grid gap-px bg-ink/20 sm:grid-cols-2 md:col-span-7">
          {[["01", "Find the job", "What must the site do? Book, sell, explain, run. We write that down before any pixels."], ["02", "Prototype in code", "Not a Figma picture — a clickable thing on a phone in week one."], ["03", "Build the system", "Content model, components, states: loading, empty, error, success."], ["04", "Ship, measure, fix", "Real people use it. We watch, change what's wrong, then hand it over."]].map(([n, t, d]) => (
            <li key={n} className="bg-paper p-6"><p className="mono text-ink-2">{n}</p><p className="mt-2 text-2xl font-semibold">{t}</p><p className="mt-2 text-ink-2">{d}</p></li>))}
        </ol>
      </div>
      <div className="mt-10"><Moment q="Have a project in mind?" cta="See the process" href="/process" note="Timelines, what we need from you, what you get." /></div>
    </section>

    <section className="border-y border-ink bg-[#101010] text-[#e8e8e8]" aria-labelledby="lab-h">
      <div className="mx-auto max-w-[1600px] px-4 py-24 md:px-6">
        <p className="mono opacity-60">07 — Lab</p>
        <h2 id="lab-h" className="mt-3 font-mono text-5xl md:text-7xl">things_that_arent_finished/</h2>
        <ul className="mt-10 grid gap-px bg-white/10 md:grid-cols-3">
          {LAB.map((x) => <li key={x.slug} className="bg-[#101010] p-6"><Link href={`/lab#${x.slug}`} className="group block" data-cursor="PLAY"><p className="mono flex justify-between opacity-60"><span>{x.slug}.exp</span><span className={x.status === "working" ? "text-[#7cf5d0]" : "text-[#ffb347]"}>{x.status}</span></p><p className="mt-3 text-2xl group-hover:text-[var(--signal)]">{x.name}</p><p className="mt-2 opacity-60">{x.line}</p></Link></li>)}
        </ul>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4"><p className="font-mono text-2xl">Have a weird idea?</p><div className="flex gap-3"><Link href="/lab" className="btn btn-ghost">Open the Lab</Link><Link href="/start?making=weird" className="btn btn-primary">Tell us about it →</Link></div></div>
      </div>
    </section>

    <section className="mx-auto max-w-[1600px] px-4 py-24 md:px-6" aria-labelledby="who-h">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="grid grid-cols-2 gap-2 md:col-span-6">
          <Img p={media.bench.sketch} className="col-span-2 aspect-[16/9]" caption="The bench (stock photo)" />
          <Img p={media.bench.blueprint} className="aspect-square" />
          <Img p={media.bench.ruler} className="aspect-square" />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Kicker n="08">Who is behind this?</Kicker>
          <h2 id="who-h" className="display mt-4 text-6xl">A studio that experiments in public.</h2>
          <p className="mt-6 text-lg leading-relaxed">WASP is small and independent. The people who draw the interface also build it, which means nothing gets designed that can&apos;t be shipped.</p>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">No portrait here on purpose — we&apos;d rather show the bench than a stock face. What you can see: fifteen things we built, the experiments that didn&apos;t work, and notes on what we&apos;re learning.</p>
          <p className="hand mt-6 text-2xl">currently learning: WebGPU compute, and when to not use 3D at all.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/studio" className="btn btn-ghost">Meet the studio</Link><Link href="/studio#failures" className="mono link-u self-center">Things that didn&apos;t work →</Link></div>
        </div>
      </div>
    </section>
  </>);
}

/* 09 — START with three clicks */
export function StartStrip() {
  const router = useRouter();
  const opts = [["website", "A website"], ["store", "An online store"], ["software", "Software / a dashboard"], ["restaurant", "A restaurant site"], ["brand", "A launch or brand"], ["data", "Something with data"], ["unsure", "Not sure yet"]];
  return (
    <section className="border-t border-ink bg-signal text-[#141412]" aria-labelledby="go-h" data-comp="StartStrip">
      <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-6">
        <p className="mono">09 — Start</p>
        <h2 id="go-h" className="display mt-3 text-6xl md:text-8xl">Let&apos;s build something.</h2>
        <p className="mt-4 max-w-xl text-lg">Click one. That&apos;s step one of three. You can add detail later — or not.</p>
        <div className="mt-8 flex flex-wrap gap-2">{opts.map(([id, l]) => <button key={id} onClick={() => router.push(`/start?making=${id}`)} className="border-2 border-[#141412] bg-[#efece4] px-5 py-3 text-lg font-semibold transition hover:-translate-y-0.5 hover:bg-[#141412] hover:text-[#ffd400]">{l}</button>)}</div>
        <p className="mono mt-6">Or just email hello@wasp.studio. A person replies.</p>
      </div>
    </section>
  );
}
