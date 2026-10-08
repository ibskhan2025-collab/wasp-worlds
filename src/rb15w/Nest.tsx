"use client";
import "@fontsource-variable/jost";
import "@fontsource/ibm-plex-mono/400.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Field, isEmail, post } from "@/rb15l/ui";
import { CLAD, FLOORS, HH, HW, LINES, GAPS, ROOMS, WALLS, type Mat } from "./nest/plan";

const House3D = dynamic(() => import("./nest/House3D"), { ssr: false, loading: () => <p className="p-8 text-sm">Raising the walls…</p> });
const S = 58, M = 44;

function Swatches({ label, items, value, onPick, dark }: { label: string; items: Mat[]; value: string; onPick: (m: Mat) => void; dark?: boolean }) {
  return (
    <fieldset className="mb-5"><legend className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{items.map((m) => <label key={m.id} className={"cursor-pointer border p-1.5 text-xs has-[:focus-visible]:ring-2 " + (value === m.id ? (dark ? "border-white" : "border-[#3d6b5a] border-2") : "border-current/20")}><input type="radio" name={label} className="sr-only" checked={value === m.id} onChange={() => onPick(m)} /><span className="block h-10 w-full" style={{ background: m.color }} />{m.label}</label>)}</div></fieldset>
  );
}

export default function Nest({ reality }: { reality: string }) {
  const [sel, setSel] = useState("living");
  const [fl, setFl] = usePersist<Record<string, string>>("nest-floors", Object.fromEntries(ROOMS.map((r) => [r.id, r.id === "bath" ? "slate" : r.id === "hall" ? "concrete" : "oak"])));
  const [wl, setWl] = usePersist("nest-wall", "lime");
  const [cl, setCl] = usePersist("nest-clad", "larch");
  const [walk, setWalk] = useState(false); const [cut, setCut] = useState(false); const [tod, setTod] = useState(0.5);
  const [f, setF] = useState({ name: "", email: "", site: "Rural plot", budget: "£500k–£1m", msg: "" }); const [fe, setFe] = useState<Record<string, string>>({}); const [sent, setSent] = useState("");
  const floors: Record<string, Mat> = Object.fromEntries(ROOMS.map((r) => [r.id, FLOORS.find((x) => x.id === (fl[r.id] ?? "oak")) ?? FLOORS[0]]));
  const wall = WALLS.find((w) => w.id === wl) ?? WALLS[0], clad = CLAD.find((c) => c.id === cl) ?? CLAD[0];
  const room = ROOMS.find((r) => r.id === sel)!; const area = (r: typeof room) => Math.round(r.w * r.h * 10) / 10;
  const total = ROOMS.reduce((a, r) => a + r.w * r.h, 0);
  const blue = reality === "blueprint";
  const dark = reality === "3d";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Your name, please."; if (!isEmail(f.email)) x.email = "Enter a valid email."; if (f.msg.trim().length < 15) x.msg = "Tell us a little about the project (15+ characters).";
    setFe(x); if (Object.keys(x).length) return;
    const r = await post("/api/enquiries", { kind: "architecture", name: f.name, email: f.email, payload: { site: f.site, budget: f.budget, msg: f.msg, materials: { wall: wall.label, cladding: clad.label, floors: Object.fromEntries(ROOMS.map((q) => [q.name, floors[q.id].label])) } } });
    setSent(r.ok ? "Thank you. We will reply within three working days, with your material selection attached." : "Could not send just now. Please try again.");
  };

  const Plan = (
    <svg viewBox={`0 0 ${HW * S + M * 2} ${HH * S + M * 2}`} className="w-full" role="group" aria-label="Interactive floor plan. Select a room with the pointer or use the room list.">
      <g transform={`translate(${M} ${M})`}>
        {ROOMS.map((r) => <g key={r.id} onClick={() => setSel(r.id)} className="cursor-pointer"><rect x={r.x * S} y={r.y * S} width={r.w * S} height={r.h * S} fill={blue ? (sel === r.id ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.04)") : floors[r.id].color} opacity={blue || sel === r.id ? 1 : 0.92} /><text x={(r.x + r.w / 2) * S} y={(r.y + r.h / 2) * S - 2} textAnchor="middle" fontSize="13" fontWeight="600" fill={blue ? "#fff" : "#23211d"} fontFamily="Jost Variable">{r.name}</text><text x={(r.x + r.w / 2) * S} y={(r.y + r.h / 2) * S + 14} textAnchor="middle" fontSize="10" fill={blue ? "#bfe0ff" : "#23211d"} opacity=".75" fontFamily="IBM Plex Mono">{area(r)} m²</text>{sel === r.id && <rect x={r.x * S + 2} y={r.y * S + 2} width={r.w * S - 4} height={r.h * S - 4} fill="none" stroke={blue ? "#ffe066" : "#3d6b5a"} strokeWidth="3" strokeDasharray="6 4" />}</g>)}
        {LINES.map((l, i) => { const gs = GAPS.filter((g) => g.axis === l.axis && g.c === l.c); const pts: [number, number][] = []; let cur = l.a0; [...gs].sort((a, b) => a.a0 - b.a0).forEach((g) => { pts.push([cur, g.a0]); cur = g.a1; }); pts.push([cur, l.a1]); return pts.filter(([a, b]) => b > a).map(([a, b], k) => <line key={`${i}-${k}`} x1={l.axis === "y" ? a * S : l.c * S} x2={l.axis === "y" ? b * S : l.c * S} y1={l.axis === "y" ? l.c * S : a * S} y2={l.axis === "y" ? l.c * S : b * S} stroke={blue ? "#fff" : "#23211d"} strokeWidth={l.ext ? 7 : 3.5} strokeLinecap="square" />); })}
        {GAPS.filter((g) => g.kind === "glass").map((g, i) => <line key={i} x1={g.axis === "y" ? g.a0 * S : g.c * S} x2={g.axis === "y" ? g.a1 * S : g.c * S} y1={g.axis === "y" ? g.c * S : g.a0 * S} y2={g.axis === "y" ? g.c * S : g.a1 * S} stroke={blue ? "#9ed0ff" : "#5da7cf"} strokeWidth="3" strokeDasharray="2 3" />)}
        <g stroke={blue ? "#9ed0ff" : "#3d6b5a"} fill="none" strokeWidth="1" fontFamily="IBM Plex Mono" fontSize="10"><line x1="0" x2={HW * S} y1={-18} y2={-18} /><line x1="0" x2="0" y1={-23} y2={-13} /><line x1={HW * S} x2={HW * S} y1={-23} y2={-13} /><text x={(HW * S) / 2} y={-24} textAnchor="middle" fill={blue ? "#9ed0ff" : "#3d6b5a"} stroke="none">{HW.toFixed(1)} m</text><line x1={-18} x2={-18} y1="0" y2={HH * S} /><text transform={`translate(-24 ${(HH * S) / 2}) rotate(-90)`} textAnchor="middle" fill={blue ? "#9ed0ff" : "#3d6b5a"} stroke="none">{HH.toFixed(1)} m</text></g>
        <g transform={`translate(${HW * S - 10} ${HH * S + 30})`} fill={blue ? "#fff" : "#23211d"} fontSize="10" fontFamily="IBM Plex Mono"><text textAnchor="end">N ↑ · scale 1:100 · GIA {Math.round(total)} m²</text></g>
      </g>
    </svg>
  );
  const Info = (
    <div aria-live="polite"><p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-60">Room {ROOMS.indexOf(room) + 1} / {ROOMS.length}</p><h2 className="text-4xl font-light" style={{ fontFamily: "'Jost Variable'" }}>{room.name}</h2>
      <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm"><dt className="opacity-60">Dimensions</dt><dd className="font-mono">{room.w} × {room.h} m</dd><dt className="opacity-60">Area</dt><dd className="font-mono">{area(room)} m²</dd><dt className="opacity-60">Ceiling</dt><dd className="font-mono">{room.ceil} m</dd><dt className="opacity-60">Use</dt><dd>{room.use}</dd><dt className="opacity-60">Light</dt><dd>{room.light}</dd><dt className="opacity-60">Floor</dt><dd>{floors[room.id].label}</dd></dl><p className="mt-3 text-sm leading-relaxed opacity-80">{room.text}</p></div>
  );
  const Rooms = <ul className="flex flex-wrap gap-1.5" aria-label="Rooms">{ROOMS.map((r) => <li key={r.id}><button aria-pressed={sel === r.id} onClick={() => setSel(r.id)} className={"border px-3 py-1.5 text-xs " + (sel === r.id ? (blue ? "border-[#ffe066] text-[#ffe066]" : dark ? "border-white bg-white text-black" : "border-[#3d6b5a] bg-[#3d6b5a] text-white") : "border-current/30")}>{r.name}</button></li>)}</ul>;

  const Enquire = (
    <section className={"px-5 py-14 sm:px-12 " + (dark ? "bg-[#14130f] text-[#e9e5dc]" : blue ? "bg-[#092c5e] text-white" : "bg-[#23211d] text-[#e9e5dc]")} aria-labelledby="nq-h"><h2 id="nq-h" className="text-5xl font-light" style={{ fontFamily: "'Jost Variable'" }}>Build something like this</h2><p className="mb-6 mt-2 max-w-lg text-sm opacity-70">Your selected materials travel with the enquiry. NEST is a fictional practice and this house is a design study.</p>
      <form onSubmit={submit} noValidate className="grid max-w-2xl gap-3 sm:grid-cols-2" aria-label="Project enquiry"><Field label="Name" name="nn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={fe.name} inputClass="border-white/40" /><Field label="Email" name="ne" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={fe.email} inputClass="border-white/40" />
        {([["site", "Site", ["Rural plot", "Urban plot", "Renovation"]], ["budget", "Budget", ["Under £500k", "£500k–£1m", "£1m+"]]] as const).map(([k, l, o]) => <label key={k} className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">{l}<select value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1 w-full border border-white/40 bg-transparent px-3 py-2.5 text-[15px] normal-case">{o.map((x) => <option key={x} className="text-black">{x}</option>)}</select></label>)}
        <Field className="sm:col-span-2" label="About the project" name="nm" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} error={fe.msg} inputClass="border-white/40" /><div className="sm:col-span-2"><button className="bg-white px-6 py-3 font-semibold text-black">Send enquiry</button></div>{sent && <p role="status" className="sm:col-span-2 text-sm">{sent}</p>}</form></section>
  );

  if (reality === "3d") return (
    <div className="bg-[#14130f] text-[#e9e5dc]">
      <div className="grid lg:grid-cols-[1fr_340px]"><div className="relative h-[66vh] lg:h-[calc(100vh-132px)]"><House3D floors={floors} wall={wall} clad={clad} sel={sel} onSel={setSel} walk={walk} cut={cut} tod={tod} />
        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 text-xs"><button aria-pressed={walk} onClick={() => setWalk(!walk)} className="border border-white/40 bg-black/60 px-3 py-2 backdrop-blur">{walk ? "Exit walk" : "Walk inside"}</button><button aria-pressed={cut} onClick={() => setCut(!cut)} className="border border-white/40 bg-black/60 px-3 py-2 backdrop-blur">{cut ? "Close roof & walls" : "Cutaway"}</button><label className="flex items-center gap-2 border border-white/40 bg-black/60 px-3 py-2 backdrop-blur">Time of day<input type="range" min={0.05} max={0.95} step={0.01} value={tod} onChange={(e) => setTod(+e.target.value)} aria-label="Time of day" /></label></div>
        <p className="pointer-events-none absolute left-3 top-3 bg-black/60 px-2 py-1 font-mono text-[11px]">{walk ? "WASD / arrows to move · drag to look · walls block you" : "Drag to orbit · scroll to zoom · click a floor to select a room"}</p></div>
        <aside className="space-y-5 border-t border-white/10 p-5 lg:border-l lg:border-t-0" aria-label="Room">{Rooms}{Info}<Swatches dark label={`Floor in ${room.name}`} items={FLOORS} value={fl[room.id] ?? "oak"} onPick={(m) => setFl({ ...fl, [room.id]: m.id })} /><Swatches dark label="Interior walls" items={WALLS} value={wl} onPick={(m) => setWl(m.id)} /><Swatches dark label="Exterior" items={CLAD} value={cl} onPick={(m) => setCl(m.id)} /></aside></div>{Enquire}</div>
  );

  return (
    <div className={blue ? "bg-[#0b3a7a] text-white" : "bg-[#e9e5dc] text-[#23211d]"} style={{ fontFamily: "'Jost Variable', sans-serif", ...(blue ? { backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)", backgroundSize: "29px 29px" } : {}) }}>
      {!blue && <section className="relative h-[50vh] min-h-[320px]"><Image src="/img/nest-house.jpg" alt="The Nest house: board-marked concrete and timber with a long glazed elevation, at dusk" fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-0 p-6 text-white sm:p-12"><p className="font-mono text-xs uppercase tracking-[0.3em]">Nest · house study · 12 × 9 m</p><h1 className="text-[clamp(3rem,9vw,8rem)] font-light leading-none">Room by room</h1></div></section>}
      {blue && <header className="px-5 pt-10 sm:px-12"><p className="font-mono text-xs uppercase tracking-[0.3em]">Sheet A-101 · Ground floor plan</p><h1 className="text-[clamp(3rem,9vw,8rem)] font-light leading-none">Plan</h1></header>}
      <div className="grid gap-8 p-5 sm:p-12 lg:grid-cols-[1.4fr_1fr]"><div>{Plan}</div>
        <div className="space-y-6">{Rooms}{Info}
          {!blue && <div><Swatches label={`Floor in ${room.name}`} items={FLOORS} value={fl[room.id] ?? "oak"} onPick={(m) => setFl({ ...fl, [room.id]: m.id })} /><Swatches label="Interior walls" items={WALLS} value={wl} onPick={(m) => setWl(m.id)} /><Swatches label="Exterior cladding" items={CLAD} value={cl} onPick={(m) => setCl(m.id)} /><p className="text-xs opacity-60">Choices are saved and appear in the plan, in 3D and in your enquiry.</p></div>}
          {blue && <div className="border border-white/30 p-4 text-sm"><p className="font-mono text-xs uppercase tracking-widest text-[#9ed0ff]">Schedule</p><table className="mt-2 w-full text-left"><tbody>{ROOMS.map((r) => <tr key={r.id} className="border-b border-white/15"><td className="py-1">{r.name}</td><td className="text-right font-mono">{area(r)} m²</td></tr>)}<tr><td className="pt-2 font-semibold">Total GIA</td><td className="pt-2 text-right font-mono font-semibold">{Math.round(total * 10) / 10} m²</td></tr></tbody></table><p className="mt-3 text-xs opacity-70">Switch to Material to choose finishes, or 3D to step inside.</p></div>}
        </div></div>{Enquire}</div>
  );
}

