"use client";

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { WORLDS, TECH, LAB, techName } from "@/rb54t/graph";

/* ============ DATA OBSERVATORY ============ */
// HISTORICAL: Eurostat population on 1 Jan 2023 (millions, rounded to 0.1) and approximate land area (km²; France = metropolitan).
const RAW = [
  ["Germany ", "84,4 M", "357588"], ["france", "68.2", "551,695"], ["Italy", "58.9m", "302068"], ["Spain", "48.1", "505 990"], ["Poland", "36.8", "312696"],
  ["Romania", "19.1", "238397"], ["Netherlands", "17.8", "41543"], ["Belgium", "11.7", "30528"], ["Czechia", "10.8", "78871"], ["Sweden", "10.5", "450295"],
  ["Portugal", "10.5", "92212"], ["Greece", "10.4", "131957"], ["Hungary", "9.6", "93025"], ["Austria", "9.1", "83879"], ["Austria", "9.1", "83879"], ["Malta", "", "316"],
];
type Row = { country: string; pop: number; area: number; density: number };
function clean() {
  const log: string[] = []; const seen = new Set<string>(); const rows: Row[] = [];
  for (const [c, p, a] of RAW) {
    const country = c.trim().replace(/^\w/, (x) => x.toUpperCase());
    if (c !== country) log.push(`"${c}" → "${country}" (trim + capitalise)`);
    if (seen.has(country)) { log.push(`Dropped duplicate row: ${country}`); continue; }
    if (!p) { log.push(`Dropped ${country}: population missing (not imputed — guessing would be worse)`); continue; }
    const pop = parseFloat(p.replace(",", ".").replace(/[^\d.]/g, "")); if (p !== String(pop)) log.push(`${country} population "${p}" → ${pop}`);
    const area = parseInt(a.replace(/[\s,]/g, ""), 10); if (a !== String(area)) log.push(`${country} area "${a}" → ${area}`);
    seen.add(country); rows.push({ country, pop, area, density: Math.round((pop * 1e6) / area) });
  }
  return { rows, log };
}
export function Observatory() {
  const { rows, log } = useMemo(clean, []);
  const [raw, setRaw] = useState(false); const [metric, setMetric] = useState<"pop" | "area" | "density">("density");
  const [min, setMin] = useState(0); const [logScale, setLogScale] = useState(true); const [pick, setPick] = useState<string[]>(["Netherlands", "Sweden"]); const [hov, setHov] = useState<string | null>(null);
  const data = rows.filter((r) => r.pop >= min).sort((a, b) => b[metric] - a[metric]);
  const max = Math.max(...data.map((d) => d[metric]), 1);
  const med = [...data].sort((a, b) => a[metric] - b[metric])[Math.floor(data.length / 2)]?.[metric] ?? 0;
  const unit = { pop: "m people", area: "km²", density: "people/km²" }[metric];
  const sx = (v: number) => (logScale ? (Math.log10(v) - 4.4) / (5.8 - 4.4) : v / 560000) * 360 + 30;
  const sy = (v: number) => 230 - (logScale ? (Math.log10(v) - 0.9) / (2 - 0.9) : v / 90) * 210;
  const [A, B] = pick.map((p) => rows.find((r) => r.country === p));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3"><span className="mono border border-ink px-2 py-1">HISTORICAL · Eurostat 2023, rounded · messiness in the raw table is deliberate</span>
        <button onClick={() => setRaw(!raw)} className="mono border border-ink px-2 py-1">{raw ? "Show cleaned" : "Show raw input"}</button></div>
      {raw ? (
        <div className="mt-4 grid gap-6 md:grid-cols-2"><table className="mono w-full text-left"><thead><tr><th>country</th><th>population</th><th>area</th></tr></thead><tbody>{RAW.map((r, i) => <tr key={i} className="border-t border-ink/10">{r.map((c, j) => <td key={j} className="py-1">&quot;{c}&quot;</td>)}</tr>)}</tbody></table>
          <div><p className="mono text-ink-2">Cleaning log ({log.length} changes)</p><ul className="mt-2 space-y-1 text-sm">{log.map((l) => <li key={l}>→ {l}</li>)}</ul></div></div>
      ) : (<>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex border border-ink" role="radiogroup" aria-label="Metric">{(["pop", "area", "density"] as const).map((m) => <button key={m} role="radio" aria-checked={metric === m} onClick={() => setMetric(m)} className={`mono px-3 py-1.5 ${metric === m ? "bg-ink text-paper" : ""}`}>{m === "density" ? "density (derived)" : m}</button>)}</div>
          <label className="flex items-center gap-2">Min population {min}m<input type="range" min={0} max={40} value={min} onChange={(e) => setMin(+e.target.value)} className="accent-[var(--ink)]" /></label>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="space-y-1">{data.map((d) => <button key={d.country} onClick={() => setPick((p) => [p[1], d.country])} onPointerEnter={() => setHov(d.country)} onPointerLeave={() => setHov(null)} className="flex w-full items-center gap-2 text-left text-sm">
            <span className="w-24 truncate">{d.country}</span><span className="relative h-5 flex-1 bg-ink/5"><span className="absolute inset-y-0 left-0 transition-all duration-500" style={{ width: `${(d[metric] / max) * 100}%`, background: pick.includes(d.country) ? "var(--signal)" : hov === d.country ? "var(--ink-2)" : "var(--ink)" }} /><span className="absolute inset-y-0 border-l-2 border-dashed border-red-600" style={{ left: `${(med / max) * 100}%` }} /></span><span className="mono w-28 text-right">{d[metric].toLocaleString()} {metric === "pop" ? "m" : ""}</span></button>)}
            <p className="mono pt-2 text-ink-2">dashed = median ({med.toLocaleString()} {unit}) · click two countries to compare</p></div>
          <div>
            <div className="flex items-center justify-between"><p className="mono text-ink-2">Area vs population</p><label className="mono flex items-center gap-2"><input type="checkbox" checked={logScale} onChange={(e) => setLogScale(e.target.checked)} />log scales</label></div>
            <svg viewBox="0 0 400 250" className="mt-2 w-full border border-ink/20" aria-label="Scatter plot of land area against population">
              {data.map((d) => <g key={d.country} onPointerEnter={() => setHov(d.country)} onPointerLeave={() => setHov(null)}><circle cx={sx(d.area)} cy={sy(d.pop)} r={pick.includes(d.country) ? 7 : 5} fill={pick.includes(d.country) ? "var(--signal)" : "var(--ink)"} stroke="var(--ink)" className="transition-all duration-500" />{(hov === d.country || pick.includes(d.country)) && <text x={sx(d.area) + 9} y={sy(d.pop) + 4} fontSize="10" fill="currentColor">{d.country}</text>}</g>)}
              <text x="30" y="246" fontSize="9" fill="currentColor" opacity=".6">area →</text><text x="4" y="14" fontSize="9" fill="currentColor" opacity=".6">pop ↑</text>
            </svg>
            {A && B && <p className="mt-4 text-lg">{A.country} has <b>{(A.pop / B.pop).toFixed(1)}×</b> the people of {B.country} in <b>{(A.area / B.area).toFixed(2)}×</b> the area — <b>{(A.density / B.density).toFixed(1)}×</b> as dense.</p>}
            <p className="mt-2 text-sm text-ink-2">Note: without log scales, Germany and France flatten everyone else into a corner. The scale is an editorial choice; we let you make it.</p>
          </div>
        </div>
      </>)}
    </div>
  );
}

/* ============ FUNNEL LAB ============ */
export function Funnel() {
  const [v, setV] = useState({ visitors: 20000, land: 45, product: 30, cart: 45, checkout: 55, aov: 64, repeat: 20 });
  const s1 = v.visitors, s2 = s1 * (v.land / 100), s3 = s2 * (v.product / 100), s4 = s3 * (v.cart / 100), s5 = s4 * (v.checkout / 100);
  const counts = [["Visitors", s1, null], ["Browse a product", s2, "land"], ["Add to cart", s3, "product"], ["Reach checkout", s4, "cart"], ["Pay", s5, "checkout"]] as const;
  const rev = s5 * v.aov; const ltv = v.aov * (1 + v.repeat / 100 * 2);
  const rates = { land: v.land, product: v.product, cart: v.cart, checkout: v.checkout };
  const weakest = (Object.entries(rates) as [keyof typeof rates, number][]).sort((a, b) => a[1] - b[1])[0][0];
  const sl = (k: keyof typeof v, l: string, a: number, b: number, st = 1, u = "%") => <label className="block text-sm"><span className="flex justify-between"><span>{l}</span><span className="mono">{v[k].toLocaleString()}{u}</span></span><input type="range" min={a} max={b} step={st} value={v[k]} onChange={(e) => setV({ ...v, [k]: +e.target.value })} className="w-full accent-[var(--ink)]" /></label>;
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-3 lg:col-span-4"><span className="mono border border-ink px-2 py-1">ILLUSTRATIVE assumptions — change them</span>
        {sl("visitors", "Monthly visitors", 1000, 100000, 1000, "")}{sl("land", "Landing → product page", 5, 90)}{sl("product", "Product → add to cart", 1, 60)}{sl("cart", "Cart → checkout", 10, 100)}{sl("checkout", "Checkout → paid", 10, 95)}{sl("aov", "Average order value", 10, 400, 1, "€")}{sl("repeat", "Buy again within a year", 0, 80)}</div>
      <div className="lg:col-span-8">
        <div className="space-y-1.5">{counts.map(([l, n, k]) => <div key={l} className="flex items-center gap-3"><span className="w-32 text-sm">{l}</span><div className="h-9 flex-1 bg-ink/5"><div className="flex h-full items-center px-2 font-mono text-xs text-paper transition-all duration-500" style={{ width: `${Math.max((n / s1) * 100, 1.5)}%`, background: k === weakest ? "#d23c1c" : "var(--ink)" }}>{Math.round(n).toLocaleString()}</div></div>{k && <span className="mono w-14 text-right">{rates[k as keyof typeof rates]}%</span>}</div>)}</div>
        <pre className="mono mt-6 overflow-auto whitespace-pre-wrap border border-ink bg-paper p-4 text-[11px] normal-case leading-relaxed">{`revenue = visitors × land × product × cart × checkout × AOV
        = ${s1.toLocaleString()} × ${v.land / 100} × ${v.product / 100} × ${v.cart / 100} × ${v.checkout / 100} × €${v.aov}
        = €${Math.round(rev).toLocaleString()} / month
12-month value per customer ≈ AOV × (1 + repeat × 2 orders) = €${ltv.toFixed(0)}`}</pre>
        <p className="mt-4 text-lg">Weakest step: <b className="text-[#d23c1c]">{counts.find((c) => c[2] === weakest)?.[0]}</b> at {rates[weakest]}%. Because the funnel multiplies, +10% relative on <em>any</em> step is +10% revenue (€{Math.round(rev * 0.1).toLocaleString()}). The question is which step is cheapest to move — usually the weakest.</p>
        <Link href="/lab" className="mono link-u mt-3 inline-block">Read: the funnel is multiplication →</Link>
      </div>
    </div>
  );
}

/* ============ DESIGN SYSTEM LAB ============ */
export function SystemLab() {
  const [t, setT] = useState({ font: "Inter Tight", ratio: 1.25, base: 16, space: 8, radius: 6, density: 1, motion: 200, cols: 3, hue: 45 });
  const vars = { fontFamily: t.font === "Mono" ? "var(--mono)" : t.font === "Serif" ? "'Newsreader', serif" : "var(--sans)", "--acc": `hsl(${t.hue} 95% 50%)` } as React.CSSProperties;
  const fs = (n: number) => t.base * Math.pow(t.ratio, n); const sp = (n: number) => t.space * n * t.density;
  const tokens = JSON.stringify({ type: { base: t.base, ratio: t.ratio, h1: +fs(4).toFixed(1), h2: +fs(2).toFixed(1) }, space: { unit: t.space * t.density }, radius: t.radius, motion: { duration: t.motion }, grid: { columns: t.cols }, color: { accent: `hsl(${t.hue} 95% 50%)` } }, null, 2);
  const sl = (k: keyof typeof t, l: string, a: number, b: number, st = 1) => <label className="block text-sm"><span className="flex justify-between"><span>{l}</span><span className="mono">{t[k]}</span></span><input type="range" min={a} max={b} step={st} value={t[k] as number} onChange={(e) => setT({ ...t, [k]: +e.target.value })} className="w-full accent-[var(--ink)]" /></label>;
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-3 lg:col-span-3">
        <div className="flex border border-ink">{["Inter Tight", "Serif", "Mono"].map((f) => <button key={f} onClick={() => setT({ ...t, font: f })} aria-pressed={t.font === f} className={`mono flex-1 py-1.5 ${t.font === f ? "bg-ink text-paper" : ""}`}>{f.split(" ")[0]}</button>)}</div>
        {sl("ratio", "Type scale ratio", 1.067, 1.5, 0.001)}{sl("base", "Base size", 12, 22)}{sl("space", "Spacing unit", 4, 16)}{sl("density", "Density", 0.6, 1.6, 0.1)}{sl("radius", "Radius", 0, 28)}{sl("motion", "Motion (ms)", 0, 800, 10)}{sl("cols", "Grid columns", 1, 4)}{sl("hue", "Accent hue", 0, 360)}
      </div>
      <div className="border border-ink bg-white text-[#141412] lg:col-span-6" style={{ ...vars, padding: sp(3) }}>
        <nav className="flex items-center justify-between" style={{ marginBottom: sp(3) }}><b style={{ fontSize: fs(1) }}>Kiln&amp;Co</b><span className="flex" style={{ gap: sp(2), fontSize: fs(-1) }}><a>Shop</a><a>Makers</a><a>Journal</a></span></nav>
        <h3 style={{ fontSize: fs(4), lineHeight: 1.05, fontWeight: 700 }}>Things made by hand.</h3>
        <p style={{ fontSize: fs(0), marginTop: sp(1.5), maxWidth: "46ch", opacity: 0.75 }}>Every token on the left rebuilds this interface. Nothing here is a screenshot.</p>
        <div className="flex" style={{ gap: sp(1), marginTop: sp(2) }}><input placeholder="Email" style={{ borderRadius: t.radius, padding: `${sp(1)}px ${sp(1.5)}px`, border: "1px solid #14141244", fontSize: fs(0), flex: 1 }} aria-label="Demo email" /><button className="transition-transform hover:-translate-y-0.5" style={{ borderRadius: t.radius, padding: `${sp(1)}px ${sp(2)}px`, background: "var(--acc)", fontSize: fs(0), fontWeight: 600, transitionDuration: `${t.motion}ms` }}>Subscribe</button></div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${t.cols}, 1fr)`, gap: sp(1.5), marginTop: sp(3) }}>{["Vase", "Bowl", "Stool", "Pitcher"].slice(0, Math.max(t.cols, 2)).map((x, i) => <div key={x} className="transition-all hover:-translate-y-1" style={{ borderRadius: t.radius, border: "1px solid #14141222", padding: sp(1.5), transitionDuration: `${t.motion}ms` }}><div style={{ borderRadius: Math.max(t.radius - 2, 0), aspectRatio: "1", background: `hsl(${(t.hue + i * 40) % 360} 70% 88%)` }} /><p style={{ fontSize: fs(0), marginTop: sp(1), fontWeight: 600 }}>{x}</p><p style={{ fontSize: fs(-1), opacity: 0.6 }}>€{40 + i * 25}</p></div>)}</div>
      </div>
      <div className="lg:col-span-3"><p className="mono text-ink-2">tokens.json (live)</p><pre className="mt-2 overflow-auto border border-ink bg-[#141412] p-3 font-mono text-[11px] text-[#e6e2d7]">{tokens}</pre><button onClick={() => navigator.clipboard?.writeText(tokens)} className="mono link-u mt-2">Copy tokens</button></div>
    </div>
  );
}

/* ============ WORKBENCH ============ */
const WB = {
  world: { CASA: "a restaurant", NOIR: "a fashion house", FORGE: "a parts supplier", ATLAS: "a travel planner", CIVIC: "a council service", PULSE: "a music label" },
  style: { Brutalism: ["raw concrete type, no images, prices huge", "the layout refuses to decorate"], Editorial: ["magazine grids and serif captions", "reading comes first"], "Swiss": ["a strict 12-column grid and one sans", "information is the ornament"], "Y2K": ["chrome, blobs and optimism", "nostalgia as a hook"] },
  tech: { WebGL: "a real-time 3D scene", SVG: "crisp vector diagrams", "Web Audio": "synthesised sound", Canvas: "a 2D particle layer" },
  interaction: { Physics: "things you can drag, stack and throw", Scrubbing: "a timeline you scrub with the scroll", Typing: "a command line", "Cursor proximity": "elements that lean toward attention" },
  motion: { Springs: "springy, interruptible motion", Mechanical: "linear moves and hard stops", Cinematic: "slow crossfades and long rests", None: "no motion at all — stillness as a statement" },
  data: { "Live queue": "a live queue length", Weather: "today's weather", Inventory: "stock levels", "Visitor count (local only)": "how many times you have visited" },
};
type WBKey = keyof typeof WB;
export function Workbench() {
  const [s, setS] = useState<Record<WBKey, string>>({ world: "CASA", style: "Brutalism", tech: "WebGL", interaction: "Physics", motion: "Mechanical", data: "Live queue" });
  const shuffle = () => setS(Object.fromEntries((Object.keys(WB) as WBKey[]).map((k) => { const o = Object.keys(WB[k]); return [k, o[Math.floor(Math.random() * o.length)]]; })) as Record<WBKey, string>);
  const st = WB.style[s.style as keyof typeof WB.style];
  const concept = `${s.world} as ${WB.world[s.world as keyof typeof WB.world]} rendered in ${st[0]} — ${st[1]}. The centrepiece is ${WB.tech[s.tech as keyof typeof WB.tech]} with ${WB.interaction[s.interaction as keyof typeof WB.interaction]}, moving with ${WB.motion[s.motion as keyof typeof WB.motion]}. It reacts to ${WB.data[s.data as keyof typeof WB.data]}: when that number rises, the composition gets denser and heavier.`;
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="grid grid-cols-2 gap-3 lg:col-span-7">{(Object.keys(WB) as WBKey[]).map((k) => <label key={k} className="block"><span className="mono text-ink-2">{k}</span><select value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="mt-1 w-full border border-ink bg-paper p-2">{Object.keys(WB[k]).map((o) => <option key={o}>{o}</option>)}</select></label>)}
        <button onClick={shuffle} className="btn btn-ghost col-span-2 justify-center">Shuffle the bench</button></div>
      <div className="lg:col-span-5"><p className="display text-3xl">{(Object.keys(WB) as WBKey[]).map((k) => s[k]).join(" × ")}</p><p className="mt-4 text-lg leading-relaxed">{concept}</p><Link href={`/start?making=weird`} className="mono link-u mt-4 inline-block">Want this one built? →</Link></div>
    </div>
  );
}

/* ============ TECH CONSTELLATION ============ */
const SKILL: Record<string, string[]> = { react: ["dashboards", "SaaS", "interaction", "component systems"], three: ["spatial UI", "product inspection", "walkthroughs"], svg: ["plans", "maps", "charts", "drawings"], postgres: ["bookings", "RSVPs", "briefs", "reports"], canvas: ["particles", "games", "terrain"], audio: ["synth previews", "instruments"], schema: ["structured data", "entity graphs"], ts: ["typed data models", "quote maths", "validation"] };
export function Constellation() {
  const [sel, setSel] = useState("three");
  const worlds = WORLDS.filter((w) => w.tech.includes(sel)); const labs = LAB.filter((l) => l.tech.includes(sel));
  const R = 150, r2 = 70;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <svg viewBox="-200 -200 400 400" className="w-full max-w-[520px]" role="group" aria-label="Technology constellation">
        {TECH.map((t, i) => { const a = (i / TECH.length) * Math.PI * 2 - Math.PI / 2; const x = Math.cos(a) * R, y = Math.sin(a) * R; return (<g key={t.id}>
          {sel === t.id && WORLDS.map((w, j) => w.tech.includes(t.id) && <line key={w.slug} x1={x} y1={y} x2={Math.cos((j / 15) * Math.PI * 2) * r2} y2={Math.sin((j / 15) * Math.PI * 2) * r2} stroke="var(--ink)" strokeOpacity=".5" />)}
          <g role="button" tabIndex={0} aria-pressed={sel === t.id} onClick={() => setSel(t.id)} onKeyDown={(e) => e.key === "Enter" && setSel(t.id)} className="cursor-pointer"><circle cx={x} cy={y} r={sel === t.id ? 11 : 7} fill={sel === t.id ? "var(--signal)" : "var(--paper)"} stroke="var(--ink)" strokeWidth="1.5" /><text x={x * 1.18} y={y * 1.18 + 3} fontSize="10" textAnchor="middle" fill="currentColor">{t.name}</text></g></g>); })}
        {WORLDS.map((w, j) => { const a = (j / 15) * Math.PI * 2, on = w.tech.includes(sel); return <g key={w.slug} opacity={on ? 1 : 0.2}><circle cx={Math.cos(a) * r2} cy={Math.sin(a) * r2} r={on ? 5 : 3} fill="var(--ink)" /><text x={Math.cos(a) * (r2 - 14)} y={Math.sin(a) * (r2 - 14) + 3} fontSize="7" textAnchor="middle" fill="currentColor">{on ? w.name : ""}</text></g>; })}
      </svg>
      <div aria-live="polite"><p className="display text-5xl">{techName(sel)}</p><p className="mt-1 text-ink-2">{TECH.find((t) => t.id === sel)?.what}</p>
        {SKILL[sel] && <p className="mono mt-4">{techName(sel)} → {SKILL[sel].join(" → ")}</p>}
        <p className="mono mt-6 text-ink-2">Evidence · {worlds.length + labs.length} places</p>
        <ul className="mt-2 space-y-1">{worlds.map((w) => <li key={w.slug}><Link href={`/worlds/${w.slug}`} className="link-u">{w.name} — {w.demonstrates[0]}</Link></li>)}{labs.map((l) => <li key={l.slug}><Link href={`/lab#${l.slug}`} className="link-u">Lab: {l.name}</Link></li>)}{worlds.length + labs.length === 0 && <li className="text-ink-2">Used site-wide rather than in a single world (e.g. this graph itself).</li>}</ul>
        <p className="mt-6 text-sm text-ink-2">No percentages. A skill bar says nothing; a link to the thing says everything.</p></div>
    </div>
  );
}

