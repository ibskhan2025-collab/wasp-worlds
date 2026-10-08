"use client";
import "@fontsource/instrument-serif";
import "@fontsource-variable/inter";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Field, isEmail, money, post } from "@/rb15l/ui";
import { DESTS, LAND, MH, MONTHS, MW, km, proj, type Dest } from "./atlas/geo";

const Globe = dynamic(() => import("./atlas/Globe"), { ssr: false, loading: () => <p className="p-6 text-sm text-white">Spinning up the globe…</p> });
type Stop = { id: string; days: number };
const TAGS = ["All", "Culture", "Nature", "Food", "Coast", "Mountains"];
const serif = { fontFamily: "'Instrument Serif', serif" };

export default function Atlas({ reality }: { reality: string }) {
  const [trip, setTrip] = usePersist<Stop[]>("atlas-trip", []);
  const [tv, setTv] = usePersist("atlas-settings", { travellers: 2, month: new Date().getMonth() + 1 });
  const [tag, setTag] = useState("All"); const [q, setQ] = useState(""); const [inSeason, setInSeason] = useState(false); const [sort, setSort] = useState("rating");
  const [sel, setSel] = useState<string | null>("kyoto");
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const [drag, setDrag] = useState<number | null>(null);
  const [f, setF] = useState({ name: "", email: "", note: "" }); const [fe, setFe] = useState<Record<string, string>>({}); const [sent, setSent] = useState("");
  const ptrs = useRef(new Map<number, { x: number; y: number }>()); const pinch = useRef(0); const svg = useRef<SVGSVGElement>(null);

  const list = useMemo(() => {
    let r = DESTS.filter((d) => (tag === "All" || d.tags.includes(tag)) && (!inSeason || d.months.includes(tv.month)) && (d.name + d.country).toLowerCase().includes(q.toLowerCase()));
    r = [...r].sort((a, b) => (sort === "rating" ? b.rating - a.rating : sort === "cost" ? a.perDay - b.perDay : a.name.localeCompare(b.name)));
    return r;
  }, [tag, q, inSeason, sort, tv.month]);
  const stops = trip.map((s) => ({ ...s, d: DESTS.find((d) => d.id === s.id)! })).filter((s) => s.d);
  const selD = DESTS.find((d) => d.id === sel);
  const dist = stops.slice(1).reduce((a, s, i) => a + km(stops[i].d, s.d), 0);
  const days = stops.reduce((a, s) => a + s.days, 0);
  const stay = stops.reduce((a, s) => a + s.days * s.d.perDay * (s.d.months.includes(tv.month) ? 1.15 : 1), 0) * tv.travellers;
  const fly = dist * 0.09 * tv.travellers;
  const total = stay + fly;
  const add = (d: Dest) => setTrip((t) => (t.some((s) => s.id === d.id) ? t : [...t, { id: d.id, days: d.days }]));
  const move = (i: number, dir: number) => setTrip((t) => { const n = [...t]; const j = i + dir; if (j < 0 || j >= n.length) return t; [n[i], n[j]] = [n[j], n[i]]; return n; });

  const zoom = (k: number, cx = MW / 2, cy = MH / 2) => setView((v) => { const nk = Math.max(1, Math.min(8, v.k * k)); const r = nk / v.k; return { k: nk, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r }; });
  const clampV = (v: { k: number; x: number; y: number }) => ({ k: v.k, x: Math.min(0, Math.max(MW - MW * v.k, v.x)), y: Math.min(0, Math.max(MH - MH * v.k, v.y)) });
  const toSvg = (e: { clientX: number; clientY: number }) => { const r = svg.current!.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * MW, y: ((e.clientY - r.top) / r.height) * MH, sx: MW / r.width }; };
  const st0 = useRef(new Map<number, { x: number; y: number }>());
  const pd = (e: React.PointerEvent) => { ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); st0.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.current.size === 2) { const [a, b] = [...ptrs.current.values()]; pinch.current = Math.hypot(a.x - b.x, a.y - b.y); } };
  const pm = (e: React.PointerEvent) => {
    const p = ptrs.current.get(e.pointerId); if (!p) return;
    if (ptrs.current.size === 2) { ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); const [a, b] = [...ptrs.current.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch.current) { const c = toSvg({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }); setView((v) => clampV({ ...v, ...(() => { const nk = Math.max(1, Math.min(8, v.k * (d / pinch.current))); const r = nk / v.k; return { k: nk, x: c.x - (c.x - v.x) * r, y: c.y - (c.y - v.y) * r }; })() })); } pinch.current = d; return; }
    const s0 = st0.current.get(e.pointerId); if (s0 && Math.hypot(e.clientX - s0.x, e.clientY - s0.y) > 5 && !(e.currentTarget as Element).hasPointerCapture(e.pointerId)) (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const s = toSvg(e).sx; setView((v) => clampV({ ...v, x: v.x + (e.clientX - p.x) * s, y: v.y + (e.clientY - p.y) * s })); ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const pu = (e: React.PointerEvent) => { ptrs.current.delete(e.pointerId); st0.current.delete(e.pointerId); pinch.current = 0; };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (stops.length === 0) x.trip = "Add at least one stop first."; if (f.name.trim().length < 2) x.name = "Your name, please."; if (!isEmail(f.email)) x.email = "Enter a valid email.";
    setFe(x); if (Object.keys(x).length) return;
    const r = await post("/api/enquiries", { kind: "trip", name: f.name, email: f.email, payload: { month: MONTHS[tv.month - 1], travellers: tv.travellers, stops: stops.map((s) => `${s.d.name} (${s.days}d)`), days, km: Math.round(dist), estimate: Math.round(total), note: f.note } });
    setSent(r.ok ? `Request sent. We will reply to ${f.email} with a proposal.` : "Could not send. Please try again.");
  };

  const route = stops.map((s) => proj(s.d.lon, s.d.lat));
  return (
    <div className="bg-[#13263a] text-[#f1e9d6]" style={{ fontFamily: "'Inter Variable', sans-serif" }}>
      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        <div className="relative border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="relative h-[52vh] min-h-[360px] lg:h-[calc(100vh-132px)]">
            {reality === "globe" ? <Globe stops={stops.map((s) => s.d)} sel={sel} onSel={setSel} /> : (
              <>
                <svg ref={svg} viewBox={`0 0 ${MW} ${MH}`} className="h-full w-full touch-none bg-[#0f2a44]" preserveAspectRatio="xMidYMid slice" role="group" aria-label="World map. Drag to pan, scroll or pinch to zoom. Destinations are also listed beside the map." onPointerDown={pd} onPointerMove={pm} onPointerUp={pu} onPointerCancel={pu} onWheel={(e) => { const c = toSvg(e); zoom(e.deltaY < 0 ? 1.2 : 1 / 1.2, c.x, c.y); setView((v) => clampV(v)); }}>
                  <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
                    {Array.from({ length: 13 }, (_, i) => <line key={"v" + i} x1={(i / 12) * MW} x2={(i / 12) * MW} y1="0" y2={MH} stroke="#fff" strokeOpacity=".06" strokeWidth={1 / view.k} />)}{Array.from({ length: 7 }, (_, i) => <line key={"h" + i} y1={(i / 6) * MH} y2={(i / 6) * MH} x1="0" x2={MW} stroke="#fff" strokeOpacity=".06" strokeWidth={1 / view.k} />)}
                    {LAND.map((poly, i) => <polygon key={i} points={poly.map(([lo, la]) => proj(lo, la).join(",")).join(" ")} fill="#d8c79a" stroke="#f3e6bd" strokeWidth={0.8 / view.k} strokeLinejoin="round" />)}
                    {route.length > 1 && <polyline points={route.map((p) => p.join(",")).join(" ")} fill="none" stroke="#e8a33d" strokeWidth={2.5 / view.k} strokeDasharray={`${6 / view.k} ${4 / view.k}`} />}
                    {DESTS.map((d) => { const [x, y] = proj(d.lon, d.lat); const on = trip.some((s) => s.id === d.id); const r = (sel === d.id ? 9 : 6) / view.k; return (
                      <g key={d.id} transform={`translate(${x} ${y})`} onClick={() => setSel(d.id)} className="cursor-pointer"><circle r={r} fill={on ? "#e8a33d" : "#ff6a4d"} stroke="#fff" strokeWidth={1.5 / view.k} />{(view.k > 1.6 || sel === d.id) && <text x={r + 3 / view.k} y={4 / view.k} fontSize={11 / view.k} fill="#fff" stroke="#0f2a44" strokeWidth={3 / view.k} paintOrder="stroke">{d.name}</text>}</g>); })}
                  </g>
                </svg>
                <div className="absolute right-3 top-3 flex flex-col gap-1">{[["+", () => zoom(1.5)], ["−", () => { zoom(1 / 1.5); setView((v) => clampV(v)); }], ["⟲", () => setView({ k: 1, x: 0, y: 0 })]].map(([l, fn]) => <button key={l as string} onClick={fn as () => void} aria-label={l === "+" ? "Zoom in" : l === "−" ? "Zoom out" : "Reset view"} className="h-10 w-10 border border-white/40 bg-[#13263a]/90 text-lg">{l as string}</button>)}</div>
              </>
            )}
            <p className="pointer-events-none absolute bottom-2 left-3 bg-[#13263a]/80 px-2 py-1 text-[11px]">{reality === "globe" ? "Drag to rotate · tap a marker" : "Drag to pan · scroll / pinch to zoom · tap a marker"}</p>
          </div>
        </div>
        <aside className="p-5" aria-label="Destination details">
          <h1 className="text-6xl leading-none" style={serif}>Atlas</h1><p className="mt-1 text-sm text-white/60">Pick places, set the month, read the real total.</p>
          {selD && <div className="mt-5 border border-white/15 p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="text-3xl" style={serif}>{selD.name}, <span className="text-white/60">{selD.country}</span></h2><p className="text-sm">★ {selD.rating} · {money(selD.perDay)}/day · {selD.days} days suggested</p></div><button onClick={() => add(selD)} disabled={trip.some((s) => s.id === selD.id)} className="shrink-0 bg-[#e8a33d] px-4 py-2 text-sm font-semibold text-black disabled:opacity-40">{trip.some((s) => s.id === selD.id) ? "In trip" : "+ Add"}</button></div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{selD.blurb}</p>
            <div className="mt-3" aria-label={`Best months for ${selD.name}`}><p className="text-[11px] uppercase tracking-widest text-white/50">Best months</p><div className="mt-1 grid grid-cols-12 gap-0.5">{MONTHS.map((m, i) => <span key={m} title={m} className={"py-1 text-center text-[10px] " + (selD.months.includes(i + 1) ? "bg-[#e8a33d] text-black" : "bg-white/10 text-white/40") + (tv.month === i + 1 ? " outline outline-1 outline-white" : "")}>{m[0]}</span>)}</div></div>
            <details className="mt-3 text-sm"><summary className="cursor-pointer text-white/70">Packing list</summary><ul className="mt-2 list-disc pl-5 text-white/80">{selD.pack.map((p) => <li key={p}>{p}</li>)}</ul></details></div>}
        </aside>
      </div>

      <div className="grid gap-8 border-t border-white/10 p-5 lg:grid-cols-2 sm:p-8">
        <section aria-labelledby="dest-h"><h2 id="dest-h" className="text-4xl" style={serif}>Destinations</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" role="search" aria-label="Filter destinations"><label className="sr-only" htmlFor="aq">Search</label><input id="aq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search places" className="min-w-[140px] flex-1 border border-white/25 bg-transparent px-3 py-2" />
            <label className="sr-only" htmlFor="as">Sort</label><select id="as" value={sort} onChange={(e) => setSort(e.target.value)} className="border border-white/25 bg-[#13263a] px-2 py-2"><option value="rating">Top rated</option><option value="cost">Cheapest</option><option value="name">A–Z</option></select>
            <label className="flex items-center gap-2"><input type="checkbox" checked={inSeason} onChange={(e) => setInSeason(e.target.checked)} />In season for {MONTHS[tv.month - 1]}</label></div>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Type">{TAGS.map((t) => <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)} className={"px-3 py-1 text-xs " + (tag === t ? "bg-[#f1e9d6] text-black" : "border border-white/25")}>{t}</button>)}</div>
          <ul className="mt-4 divide-y divide-white/10">{list.map((d) => <li key={d.id} className="flex items-center gap-3 py-2.5"><button onClick={() => setSel(d.id)} className={"min-w-0 flex-1 text-left " + (sel === d.id ? "text-[#e8a33d]" : "")}><b>{d.name}</b> <span className="text-white/50">{d.country}</span><br /><span className="text-xs text-white/50">★ {d.rating} · {money(d.perDay)}/day · {d.tags.join(", ")}{d.months.includes(tv.month) ? " · in season" : ""}</span></button><button onClick={() => add(d)} disabled={trip.some((s) => s.id === d.id)} aria-label={`Add ${d.name} to trip`} className="h-10 min-w-10 border border-white/30 px-2 text-sm disabled:opacity-30">+</button></li>)}{list.length === 0 && <li className="py-6 text-white/60">No destinations match.</li>}</ul></section>

        <section aria-labelledby="trip-h"><h2 id="trip-h" className="text-4xl" style={serif}>Your itinerary</h2>
          <div className="mt-3 flex flex-wrap gap-4 text-sm"><label>Travellers <select value={tv.travellers} onChange={(e) => setTv({ ...tv, travellers: +e.target.value })} className="ml-1 border border-white/25 bg-[#13263a] px-2 py-1">{Array.from({ length: 10 }, (_, i) => <option key={i}>{i + 1}</option>)}</select></label><label>Month <select value={tv.month} onChange={(e) => setTv({ ...tv, month: +e.target.value })} className="ml-1 border border-white/25 bg-[#13263a] px-2 py-1">{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></label></div>
          {stops.length === 0 ? <p className="mt-6 text-white/60">No stops yet. Select a marker or use + in the list.</p> : (
            <ol className="mt-4 space-y-2">{stops.map((s, i) => (
              <li key={s.id} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag !== null && drag !== i) setTrip((t) => { const n = [...t]; const [m] = n.splice(drag, 1); n.splice(i, 0, m); return n; }); setDrag(null); }} className="flex items-center gap-2 border border-white/15 bg-white/5 p-2.5">
                <span className="w-6 text-center font-mono text-sm text-[#e8a33d]">{i + 1}</span><div className="min-w-0 flex-1"><b>{s.d.name}</b>{!s.d.months.includes(tv.month) && <span className="ml-2 text-xs text-amber-300">off-season in {MONTHS[tv.month - 1]}</span>}<p className="text-xs text-white/50">{i > 0 ? `${Math.round(km(stops[i - 1].d, s.d)).toLocaleString()} km from ${stops[i - 1].d.name}` : "Start"}</p></div>
                <label className="text-xs"><span className="sr-only">Days in {s.d.name}</span><input type="number" min={1} max={14} value={s.days} onChange={(e) => setTrip((t) => t.map((x) => (x.id === s.id ? { ...x, days: Math.max(1, Math.min(14, +e.target.value || 1)) } : x)))} className="w-14 border border-white/25 bg-transparent px-1 py-1" /> d</label>
                <button aria-label={`Move ${s.d.name} up`} disabled={i === 0} onClick={() => move(i, -1)} className="h-9 w-9 border border-white/25 disabled:opacity-30">↑</button><button aria-label={`Move ${s.d.name} down`} disabled={i === stops.length - 1} onClick={() => move(i, 1)} className="h-9 w-9 border border-white/25 disabled:opacity-30">↓</button><button aria-label={`Remove ${s.d.name}`} onClick={() => setTrip((t) => t.filter((x) => x.id !== s.id))} className="h-9 w-9 border border-white/25">×</button></li>))}</ol>)}
          <dl className="mt-5 grid grid-cols-2 gap-px bg-white/10 text-sm sm:grid-cols-4">{[["Days", String(days)], ["Distance", `${Math.round(dist).toLocaleString()} km`], ["Stay", money(Math.round(stay))], ["Travel", money(Math.round(fly))]].map(([l, v]) => <div key={l} className="bg-[#13263a] p-3"><dt className="text-[10px] uppercase tracking-widest text-white/50">{l}</dt><dd className="text-xl">{v}</dd></div>)}</dl>
          <p className="mt-3 text-2xl" style={serif}>Estimated total <b>{money(Math.round(total))}</b> <span className="text-sm text-white/50">for {tv.travellers} · {money(Math.round(total / tv.travellers))} each</span></p><p className="text-xs text-white/50">Stay = days × nightly cost × travellers (+15% in season). Travel = distance × £0.09/km/person. Indicative only.</p>
          <form onSubmit={submit} noValidate className="mt-6 grid gap-3 border-t border-white/10 pt-5" aria-label="Request this trip"><h3 className="text-2xl" style={serif}>Request this trip</h3>{fe.trip && <p role="alert" className="text-sm text-red-300">{fe.trip}</p>}
            <Field label="Name" name="tn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={fe.name} inputClass="border-white/30" /><Field label="Email" name="te" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={fe.email} inputClass="border-white/30" /><Field label="Anything we should know?" name="tno" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} inputClass="border-white/30" />
            <button className="bg-[#e8a33d] px-5 py-3 font-semibold text-black">Send request</button>{sent && <p role="status" className="text-sm">{sent}</p>}</form>
        </section>
      </div>
    </div>
  );
}

