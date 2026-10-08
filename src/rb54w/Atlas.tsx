"use client";

import { useMemo, useState } from "react";
import { media, type Photo } from "@/rb54l/media";
import { Img } from "@/rb54l/ui";
import { useLocal } from "@/rb54l/state";
type XP = { reality: string; world?: unknown };

type Dest = { id: string; name: string; lat: number; lon: number; p: Photo; line: string };
const D: Dest[] = [
  { id: "ist", name: "Istanbul", lat: 41.01, lon: 28.98, p: media.atlas.aerial, line: "Start here. Ferries are the best public transport in the world." },
  { id: "ama", name: "Amasra", lat: 41.75, lon: 32.39, p: media.atlas.amasra, line: "Black Sea town on two bays. Eat the fish, skip the souvenirs." },
  { id: "sin", name: "Sinop", lat: 42.03, lon: 35.15, p: media.atlas.cottages, line: "The northernmost point. Quiet, green, a bit wild." },
  { id: "ayv", name: "Ayvalık", lat: 39.32, lon: 26.69, p: media.atlas.white, line: "Olive oil, stone houses, and islands a short boat away." },
  { id: "izm", name: "İzmir", lat: 38.42, lon: 27.14, p: media.atlas.bay, line: "The relaxed big city. Walk the Kordon at sunset." },
  { id: "bod", name: "Bodrum", lat: 37.03, lon: 27.43, p: media.atlas.alley, line: "Whitewash and boats. Go in May, not August." },
  { id: "mar", name: "Marmaris", lat: 36.85, lon: 28.27, p: media.atlas.marmaris, line: "Old town alleys above a busy marina." },
];
const B = { lon0: 25.6, lon1: 36, lat0: 35.9, lat1: 42.6 };
const proj = (lat: number, lon: number) => [((lon - B.lon0) / (B.lon1 - B.lon0)) * 1000, ((B.lat1 - lat) / (B.lat1 - B.lat0)) * 1000 * 0.78] as const;
const hav = (a: Dest, b: Dest) => { const R = 6371, r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r; const h = Math.sin(dl / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
type Stop = { id: string; nights: number };
type Cfg = { adults: number; kids: number; season: "summer" | "shoulder" | "winter"; style: "light" | "comfort" };

function packing(c: Cfg, nights: number, stops: string[]) {
  const L: string[] = ["Passport + a photo of it", "Charger and a Type F plug adapter", `${Math.min(nights, 7)} days of clothes (wash after that)`];
  if (c.season === "summer") L.push("Sunscreen SPF50", "Hat", "Swimwear", "Refillable water bottle");
  if (c.season === "shoulder") L.push("Light jacket", "Swimwear — the sea is still warm");
  if (c.season === "winter") L.push("Waterproof jacket", "Warm layers — the Black Sea coast is cold and wet", "Umbrella");
  if (stops.includes("ist")) L.push("Comfortable shoes for hills", "Headscarf for mosque visits");
  if (stops.some((s) => ["ama", "sin"].includes(s))) L.push("Motion-sickness tablets for coastal roads");
  if (c.kids > 0) L.push(`Snacks for ${c.kids} kid${c.kids > 1 ? "s" : ""}`, "Travel games", "Child sun protection");
  if (c.style === "light") L.push("Packable daypack", "Quick-dry towel"); else L.push("Proper suitcase — distances are long");
  return L;
}

export default function Atlas({ reality }: XP) {
  const night = reality === "night";
  const [stops, setStops] = useLocal<Stop[]>("wasp:atlas:stops", [{ id: "ist", nights: 3 }, { id: "izm", nights: 2 }, { id: "bod", nights: 3 }]);
  const [cfg, setCfg] = useLocal<Cfg>("wasp:atlas:cfg", { adults: 2, kids: 0, season: "shoulder", style: "light" });
  const [packed, setPacked] = useLocal<string[]>("wasp:atlas:packed", []);
  const [focus, setFocus] = useState("ist");
  const [drag, setDrag] = useState<number | null>(null);
  const route = stops.map((s) => D.find((d) => d.id === s.id)!);
  const legs = route.slice(1).map((d, i) => hav(route[i], d));
  const km = legs.reduce((a, b) => a + b, 0);
  const nights = stops.reduce((a, s) => a + s.nights, 0);
  const list = useMemo(() => packing(cfg, nights, stops.map((s) => s.id)), [cfg, nights, stops]);
  const f = D.find((d) => d.id === focus)!;
  const move = (i: number, j: number) => { if (j < 0 || j >= stops.length) return; const s = [...stops]; const [x] = s.splice(i, 1); s.splice(j, 0, x); setStops(s); };
  const theme = night ? { bg: "#0f1419", fg: "#e8e0c9", line: "#f2b134", dot: "#f2b134", sea: "#0f1419", grid: "#ffffff14" } : { bg: "#eef0e6", fg: "#1f2a1c", line: "#c0562b", dot: "#1f2a1c", sea: "#dfe6de", grid: "#1f2a1c18" };
  const pathD = route.map((d, i) => { const [x, y] = proj(d.lat, d.lon); return `${i ? "L" : "M"}${x},${y}`; }).join(" ");

  return (
    <div style={{ background: theme.bg, color: theme.fg }} className="pb-12">
      <div className="grid lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <svg viewBox="0 0 1000 780" className="w-full" style={{ background: theme.sea }} role="group" aria-label="Stylised map of the Turkish coast. Not for navigation.">
            {Array.from({ length: 11 }, (_, i) => B.lon0 + i).map((lon) => { const [x] = proj(0, lon); return <line key={lon} x1={x} x2={x} y1={0} y2={780} stroke={theme.grid} />; })}
            {Array.from({ length: 7 }, (_, i) => 36 + i).map((lat) => { const [, y] = proj(lat, 0); return <g key={lat}><line x1={0} x2={1000} y1={y} y2={y} stroke={theme.grid} /><text x={6} y={y - 4} fontSize="12" fill={theme.fg} opacity=".4">{lat}°N</text></g>; })}
            <text x={380} y={60} fontSize="18" fill={theme.fg} opacity=".35" fontStyle="italic" style={{ fontFamily: "'DM Serif Display', serif" }}>Black Sea</text>
            <text x={60} y={680} fontSize="18" fill={theme.fg} opacity=".35" fontStyle="italic" style={{ fontFamily: "'DM Serif Display', serif" }}>Aegean</text>
            <path key={pathD} d={pathD} fill="none" stroke={theme.line} strokeWidth="3" strokeDasharray="2000" strokeDashoffset="2000" style={{ animation: "atlasdraw 1.4s var(--ease-out) forwards" }} />
            <style>{"@keyframes atlasdraw{to{stroke-dashoffset:0}}"}</style>
            {D.map((d) => { const [x, y] = proj(d.lat, d.lon); const n = stops.findIndex((s) => s.id === d.id); return (
              <g key={d.id} transform={`translate(${x},${y})`} className="cursor-pointer" tabIndex={0} role="button" aria-label={`${d.name}${n >= 0 ? `, stop ${n + 1}` : ""}`} onClick={() => setFocus(d.id)} onKeyDown={(e) => e.key === "Enter" && setFocus(d.id)}>
                <circle r={focus === d.id ? 14 : 9} fill={n >= 0 ? theme.line : theme.bg} stroke={theme.dot} strokeWidth="2" className="transition-all" />
                {n >= 0 && <text y="4" textAnchor="middle" fontSize="11" fill={theme.bg} fontWeight="bold">{n + 1}</text>}
                <text x="16" y="5" fontSize="16" fill={theme.fg} style={{ fontFamily: "'DM Serif Display', serif" }}>{d.name}</text>
              </g>); })}
          </svg>
          <p className="mono absolute bottom-2 left-2 opacity-60">Stylised equirectangular projection · real coordinates · not for navigation</p>
        </div>
        <div className="p-5 lg:col-span-5 lg:p-8">
          <Img key={f.id} p={f.p} className="aspect-[16/10]" caption={f.name} />
          <p style={{ fontFamily: "'DM Serif Display', serif" }} className="mt-3 text-4xl">{f.name}</p>
          <p className="mt-1 opacity-80">{f.line}</p>
          <button disabled={stops.some((s) => s.id === f.id)} onClick={() => setStops([...stops, { id: f.id, nights: 2 }])} className="mono mt-3 px-3 py-2 disabled:opacity-40" style={{ background: theme.line, color: theme.bg }}>{stops.some((s) => s.id === f.id) ? "Already in the trip" : `Add ${f.name} to the trip`}</button>
        </div>
      </div>

      <div className="grid gap-10 px-5 pt-10 md:px-10 lg:grid-cols-3">
        <section aria-labelledby="it-h">
          <h3 id="it-h" style={{ fontFamily: night ? "'JetBrains Mono', monospace" : "'DM Serif Display', serif" }} className="text-3xl">{night ? "DEPARTURES" : "Itinerary"}</h3>
          <p className="mono mt-1 opacity-70">{stops.length} stops · {nights} nights · {Math.round(km)} km as the crow flies · ~{Math.round((km * 1.3) / 70)}h driving (rough)</p>
          <ol className="mt-4 space-y-2">
            {stops.map((s, i) => { const d = D.find((x) => x.id === s.id)!; return (
              <li key={s.id} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag !== null) move(drag, i); setDrag(null); }}
                className={`flex items-center gap-2 border p-2 ${night ? "border-white/15 font-mono" : "border-black/15 bg-white/50"}`} data-cursor="DRAG">
                <span className="mono w-5 opacity-50">{i + 1}</span>
                <button className="flex-1 text-left" onClick={() => setFocus(s.id)}>{d.name}{i > 0 && <span className="mono ml-2 opacity-50">+{Math.round(legs[i - 1])} km</span>}</button>
                <button aria-label="Fewer nights" onClick={() => setStops(stops.map((x, j) => (j === i ? { ...x, nights: Math.max(1, x.nights - 1) } : x)))}>−</button>
                <span className="mono w-8 text-center">{s.nights}n</span>
                <button aria-label="More nights" onClick={() => setStops(stops.map((x, j) => (j === i ? { ...x, nights: x.nights + 1 } : x)))}>+</button>
                <button aria-label={`Move ${d.name} up`} onClick={() => move(i, i - 1)} className="px-1 opacity-60">↑</button>
                <button aria-label={`Move ${d.name} down`} onClick={() => move(i, i + 1)} className="px-1 opacity-60">↓</button>
                <button aria-label={`Remove ${d.name}`} onClick={() => setStops(stops.filter((_, j) => j !== i))} className="px-1 opacity-60">✕</button>
              </li>); })}
          </ol>
          {stops.length === 0 && <p className="mt-4 opacity-70">No stops yet — click a town on the map.</p>}
        </section>
        <section aria-labelledby="tr-h">
          <h3 id="tr-h" style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl">Travellers</h3>
          {([["adults", "Adults", 1, 6], ["kids", "Kids", 0, 5]] as const).map(([k, l, a, b]) => (
            <div key={k} className="mt-3 flex items-center justify-between"><span>{l}</span><span className="flex items-center gap-3"><button aria-label={`Fewer ${l}`} onClick={() => setCfg({ ...cfg, [k]: Math.max(a, cfg[k] - 1) })}>−</button><span className="w-4 text-center">{cfg[k]}</span><button aria-label={`More ${l}`} onClick={() => setCfg({ ...cfg, [k]: Math.min(b, cfg[k] + 1) })}>+</button></span></div>
          ))}
          <p className="mono mt-4 opacity-60">Season</p>
          <div className="mt-1 flex gap-1">{(["summer", "shoulder", "winter"] as const).map((s) => <button key={s} aria-pressed={cfg.season === s} onClick={() => setCfg({ ...cfg, season: s })} className="mono flex-1 border py-2" style={{ borderColor: theme.fg + "44", background: cfg.season === s ? theme.fg : "transparent", color: cfg.season === s ? theme.bg : undefined }}>{s}</button>)}</div>
          <p className="mono mt-4 opacity-60">Style</p>
          <div className="mt-1 flex gap-1">{(["light", "comfort"] as const).map((s) => <button key={s} aria-pressed={cfg.style === s} onClick={() => setCfg({ ...cfg, style: s })} className="mono flex-1 border py-2" style={{ borderColor: theme.fg + "44", background: cfg.style === s ? theme.fg : "transparent", color: cfg.style === s ? theme.bg : undefined }}>{s}</button>)}</div>
        </section>
        <section aria-labelledby="pk-h">
          <h3 id="pk-h" style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl">Packing <span className="mono opacity-60">{list.filter((x) => packed.includes(x)).length}/{list.length}</span></h3>
          <ul className="mt-3 space-y-1.5">{list.map((x) => <li key={x}><label className="flex items-start gap-2"><input type="checkbox" checked={packed.includes(x)} onChange={() => setPacked((p) => (p.includes(x) ? p.filter((y) => y !== x) : [...p, x]))} className="mt-1" style={{ accentColor: theme.line }} /><span className={packed.includes(x) ? "line-through opacity-50" : ""}>{x}</span></label></li>)}</ul>
          <p className="mono mt-3 opacity-50">Rules, not AI: season, stops, kids and style each add items.</p>
        </section>
      </div>
    </div>
  );
}
