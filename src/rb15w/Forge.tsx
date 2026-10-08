"use client";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Field, isEmail, money, post } from "@/rb15l/ui";
import { FAMILIES, FINISH_MULT, PARTS, defaults, leadDays, price, type Part, type V } from "./forge/parts";

const Forge3D = dynamic(() => import("./forge/Forge3D"), { ssr: false, loading: () => <p className="p-6 font-mono text-xs">Loading CAD viewer…</p> });
type Line = { id: string; v: V; finish: string; qty: number };
const head = { fontFamily: "'Barlow Condensed', sans-serif" };

function Diagram({ part, v, blue }: { part: Part; v: V; blue: boolean }) {
  const g = part.geom(v);
  const s = 180 / Math.max(g.od, g.len, 1), R = (g.od * s) / 2, r = (g.id * s) / 2, L = g.len * s;
  const ink = blue ? "#fff" : "#e6e8ea", dim = blue ? "#9ed0ff" : "#ffb400";
  const fx = 120, sx = 380, cy = 140;
  const hex = Array.from({ length: 6 }, (_, i) => `${fx + Math.cos((i / 6) * 6.283) * R},${cy + Math.sin((i / 6) * 6.283) * R}`).join(" ");
  const D = ({ x1, y1, x2, y2, t }: { x1: number; y1: number; x2: number; y2: number; t: string }) => <g stroke={dim} fill={dim} strokeWidth="1"><line x1={x1} y1={y1} x2={x2} y2={y2} /><line x1={x1} y1={y1 - 4} x2={x1} y2={y1 + 4} /><line x1={x2} y1={y2 - 4} x2={x2} y2={y2 + 4} /><text x={(x1 + x2) / 2} y={y1 - 6} textAnchor="middle" fontSize="11" stroke="none" fontFamily="IBM Plex Mono">{t}</text></g>;
  return (
    <svg viewBox="0 0 500 280" className="w-full" role="img" aria-label={`Dimension drawing of ${part.name}: outer ${g.od} millimetres, length ${g.len} millimetres`}>
      <g fill="none" stroke={ink} strokeWidth="1.6">
        {part.kind === "bolt" ? <polygon points={hex} /> : part.kind === "bracket" ? <polygon points={`${fx - R},${cy + R} ${fx + R},${cy + R} ${fx + R},${cy + R - v.t * s * 2} ${fx - R + v.t * s * 2},${cy + R - v.t * s * 2} ${fx - R + v.t * s * 2},${cy - R} ${fx - R},${cy - R}`} /> : <circle cx={fx} cy={cy} r={R} />}
        {r > 0 && <circle cx={fx} cy={cy} r={r} strokeDasharray="4 3" />}
        <rect x={sx - L / 2} y={cy - R} width={L} height={R * 2} />
        {r > 0 && <><line x1={sx - L / 2} x2={sx + L / 2} y1={cy - r} y2={cy - r} strokeDasharray="4 3" /><line x1={sx - L / 2} x2={sx + L / 2} y1={cy + r} y2={cy + r} strokeDasharray="4 3" /></>}
        <line x1={fx - R - 14} x2={fx + R + 14} y1={cy} y2={cy} strokeDasharray="10 3 2 3" strokeWidth=".8" /><line x1={sx - L / 2 - 14} x2={sx + L / 2 + 14} y1={cy} y2={cy} strokeDasharray="10 3 2 3" strokeWidth=".8" />
      </g>
      <D x1={fx - R} x2={fx + R} y1={cy + R + 26} y2={cy + R + 26} t={part.kind === "bracket" ? `W ${g.od}` : `⌀${Math.round(g.od * 10) / 10}`} />
      <D x1={sx - L / 2} x2={sx + L / 2} y1={cy - R - 12} y2={cy - R - 12} t={`L ${Math.round(g.len * 10) / 10}`} />
      {r > 0 && <text x={fx} y={cy + 4} textAnchor="middle" fontSize="10" fill={dim} fontFamily="IBM Plex Mono">⌀{Math.round(g.id * 10) / 10}</text>}
      <text x="10" y="270" fontSize="10" fill={ink} opacity=".6" fontFamily="IBM Plex Mono">{part.code} · SCALE {(s).toFixed(2)}:1 · UNITS mm · THIRD ANGLE</text>
    </svg>
  );
}

export default function Forge({ reality }: { reality: string }) {
  const [fam, setFam] = useState("All");
  const [sel, setSel] = useState(PARTS[0].id);
  const [vals, setVals] = useState<Record<string, V>>(() => Object.fromEntries(PARTS.map((p) => [p.id, defaults(p)])));
  const [finish, setFinish] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(10);
  const [quote, setQuote] = usePersist<Line[]>("forge-quote", []);
  const [section, setSection] = useState(false); const [offset, setOffset] = useState(0);
  const [f, setF] = useState({ company: "", name: "", email: "", po: "" }); const [fe, setFe] = useState<Record<string, string>>({}); const [sent, setSent] = useState("");
  const part = PARTS.find((p) => p.id === sel)!; const v = vals[sel]; const fin = finish[sel] ?? part.finishes[0];
  const list = useMemo(() => PARTS.filter((p) => fam === "All" || p.family === fam), [fam]);
  const blue = reality === "blueprint";
  const unit = price(part, v, fin);
  const disc = (q: number) => (q >= 200 ? 0.9 : q >= 50 ? 0.95 : 1);
  const lineTotal = (l: Line) => { const p = PARTS.find((x) => x.id === l.id)!; return price(p, l.v, l.finish) * l.qty * disc(l.qty); };
  const total = quote.reduce((a, l) => a + lineTotal(l), 0);
  const lead = quote.reduce((a, l) => Math.max(a, leadDays(PARTS.find((x) => x.id === l.id)!, l.finish)), 0);
  const C = blue ? { root: "bg-[#0b3a7a] text-white", grid: { backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)", backgroundSize: "24px 24px" }, line: "border-white/30", acc: "#9ed0ff", btn: "bg-white text-[#0b3a7a]", card: "bg-[#0b3a7a]/60" } : { root: "bg-[#15171a] text-[#e6e8ea]", grid: {}, line: "border-white/15", acc: "#ffb400", btn: "bg-[#ffb400] text-black", card: "bg-white/[0.03]" };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (!quote.length) x.quote = "Add at least one line to the quote."; if (f.company.trim().length < 2) x.company = "Company is required."; if (f.name.trim().length < 2) x.name = "Name is required."; if (!isEmail(f.email)) x.email = "Valid email required.";
    setFe(x); if (Object.keys(x).length) return;
    const ref = "Q-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const r = await post("/api/enquiries", { kind: "quote", name: f.name, email: f.email, payload: { ref, company: f.company, po: f.po, lines: quote.map((l) => `${l.qty}× ${PARTS.find((p) => p.id === l.id)!.code} ${JSON.stringify(l.v)} ${l.finish}`), total: Math.round(total * 100) / 100, leadDays: lead } });
    if (r.ok) { setSent(`Quote ${ref} submitted. A named engineer will reply to ${f.email} within one working day.`); setQuote([]); } else setFe({ quote: "Could not submit right now. Your quote is saved on this device." });
  };

  return (
    <div className={`${C.root} min-h-[calc(100vh-88px)]`} style={{ fontFamily: "'IBM Plex Mono', monospace", ...C.grid }}>
      <div className="grid lg:grid-cols-[260px_1fr_360px]">
        <nav className={`border-b p-4 lg:border-b-0 lg:border-r ${C.line}`} aria-label="Components">
          <h1 className="text-4xl font-bold uppercase leading-none tracking-wide" style={head}>Forge <span style={{ color: C.acc }}>/ catalogue</span></h1>
          <div className="mt-4 flex flex-wrap gap-1" role="group" aria-label="Family">{FAMILIES.map((x) => <button key={x} aria-pressed={fam === x} onClick={() => setFam(x)} className={"border px-2 py-1 text-[11px] uppercase " + (fam === x ? "border-transparent " + C.btn : C.line)}>{x}</button>)}</div>
          <ul className="mt-4 max-h-[50vh] divide-y divide-white/10 overflow-auto lg:max-h-none">{list.map((p) => <li key={p.id}><button aria-pressed={sel === p.id} onClick={() => setSel(p.id)} className={"w-full px-2 py-2.5 text-left text-xs hover:bg-white/5 " + (sel === p.id ? "bg-white/10" : "")}><span style={{ color: C.acc }}>{p.code}</span><br /><b className="text-sm">{p.name}</b><br /><span className="opacity-50">{p.family}</span></button></li>)}{list.length === 0 && <li className="p-3 text-xs">No parts in this family.</li>}</ul>
        </nav>

        <section className="min-w-0 p-4 sm:p-6" aria-label={part.name}>
          <p className="text-xs" style={{ color: C.acc }}>{part.code} · {part.family}</p><h2 className="text-5xl font-bold uppercase leading-none" style={head}>{part.name}</h2><p className="mt-2 max-w-xl text-sm opacity-70">{part.blurb}</p>
          <div className={`mt-4 border ${C.line} ${C.card} ${reality === "inspect" ? "h-[52vh] min-h-[360px]" : "p-3"}`}>{reality === "inspect" ? <Forge3D part={part} v={v} finish={fin} section={section} offset={offset} /> : <Diagram part={part} v={v} blue={blue} />}</div>
          {reality === "inspect" && <div className="mt-3 flex flex-wrap items-center gap-4 text-xs"><label className="flex items-center gap-2"><input type="checkbox" checked={section} onChange={(e) => setSection(e.target.checked)} />Section cut</label>{section && <label className="flex items-center gap-2">Plane <input type="range" min={-1} max={1} step={0.05} value={offset} onChange={(e) => setOffset(+e.target.value)} aria-label="Section plane position" /></label>}<span className="opacity-50">Drag to rotate · scroll to zoom</span></div>}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{part.params.map((q) => <label key={q.k} className="block text-xs uppercase tracking-wider">{q.label}: <b style={{ color: C.acc }}>{v[q.k]}</b><input type="range" min={q.min} max={q.max} step={q.step} value={v[q.k]} onChange={(e) => setVals({ ...vals, [sel]: { ...v, [q.k]: +e.target.value } })} className="mt-1 block w-full" style={{ accentColor: C.acc }} /></label>)}</div>
          <table className={`mt-6 w-full border-t text-left text-sm ${C.line}`}><caption className="sr-only">Specification</caption><tbody>{[["Load rating", `${Math.round(part.load(v) * 100) / 100} — ${part.loadLabel}`], ["Tolerance", part.tol], ["Material", part.material], ["Lead time", `${leadDays(part, fin)} working days`], ["Unit price", `${money(unit)} (ex VAT)`]].map(([a, b]) => <tr key={a} className={`border-b ${C.line}`}><th className="w-32 py-2 pr-3 text-xs font-normal uppercase opacity-60">{a}</th><td className="py-2">{b}</td></tr>)}</tbody></table>
        </section>

        <aside className={`border-t p-4 lg:border-l lg:border-t-0 ${C.line}`} aria-label="Configure and quote">
          <h2 className="text-2xl font-bold uppercase" style={head}>Configure</h2>
          <fieldset className="mt-3"><legend className="text-[11px] uppercase tracking-wider opacity-60">Finish</legend><div className="mt-1 flex flex-wrap gap-1">{part.finishes.map((x) => <label key={x} className={"cursor-pointer border px-2 py-1.5 text-xs has-[:focus-visible]:ring-2 " + (fin === x ? "border-transparent " + C.btn : C.line)}><input type="radio" name="finish" className="sr-only" checked={fin === x} onChange={() => setFinish({ ...finish, [sel]: x })} />{x}{FINISH_MULT[x][0] > 1 ? ` +${Math.round((FINISH_MULT[x][0] - 1) * 100)}%` : ""}</label>)}</div></fieldset>
          <div className="mt-3 flex items-end gap-2"><label className="text-[11px] uppercase tracking-wider opacity-60">Qty<input type="number" min={1} max={5000} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(5000, +e.target.value || 1)))} className="mt-1 block w-24 border border-white/30 bg-transparent px-2 py-2 text-base" /></label><button onClick={() => setQuote((q) => [...q, { id: sel, v: { ...v }, finish: fin, qty }])} className={C.btn + " flex-1 px-3 py-2.5 text-sm font-semibold"}>Add {qty} to quote · {money(Math.round(unit * qty * disc(qty) * 100) / 100)}</button></div>
          <p className="mt-1 text-[11px] opacity-50">Volume breaks: 5% from 50, 10% from 200.</p>
          <h2 className="mt-6 text-2xl font-bold uppercase" style={head}>Quote ({quote.length})</h2>
          {quote.length === 0 ? <p className="mt-2 text-xs opacity-60">No lines yet.</p> : <ul className="mt-2 divide-y divide-white/10 text-xs">{quote.map((l, i) => { const p = PARTS.find((x) => x.id === l.id)!; return <li key={i} className="py-2"><div className="flex justify-between gap-2"><b style={{ color: C.acc }}>{p.code}</b><span>{money(Math.round(lineTotal(l) * 100) / 100)}</span></div><p className="opacity-60">{Object.entries(l.v).map(([k, x]) => `${k} ${x}`).join(" · ")} · {l.finish}</p><div className="mt-1 flex items-center gap-2"><label className="sr-only" htmlFor={`q${i}`}>Quantity</label><input id={`q${i}`} type="number" min={1} max={5000} value={l.qty} onChange={(e) => setQuote((q) => q.map((x, j) => (j === i ? { ...x, qty: Math.max(1, +e.target.value || 1) } : x)))} className="w-20 border border-white/30 bg-transparent px-1 py-1" /><button className="underline" onClick={() => setQuote((q) => q.filter((_, j) => j !== i))}>remove</button></div></li>; })}</ul>}
          <dl className="mt-3 grid grid-cols-2 gap-1 border-t border-white/20 pt-3 text-sm"><dt>Total (ex VAT)</dt><dd className="text-right font-semibold">{money(Math.round(total * 100) / 100)}</dd><dt>Longest lead</dt><dd className="text-right">{lead} days</dd></dl>
          <form onSubmit={submit} noValidate className="mt-4 grid gap-3" aria-label="Submit quote request"><Field label="Company" name="co" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} error={fe.company} inputClass="border-white/30" /><Field label="Contact name" name="cn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={fe.name} inputClass="border-white/30" /><Field label="Email" name="ce" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={fe.email} inputClass="border-white/30" /><Field label="PO reference (optional)" name="po" value={f.po} onChange={(e) => setF({ ...f, po: e.target.value })} inputClass="border-white/30" />
            {fe.quote && <p role="alert" className="text-xs text-red-400">{fe.quote}</p>}<button className={C.btn + " py-3 text-sm font-semibold"}>Request formal quote</button>{sent && <p role="status" className="text-xs">{sent}</p>}</form>
          <p className="mt-4 text-[10px] opacity-40">Fictional supplier. Prices and ratings are illustrative.</p>
        </aside>
      </div>
    </div>
  );
}

