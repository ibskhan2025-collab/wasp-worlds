"use client";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource-variable/newsreader";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Field, isEmail, post } from "@/rb15l/ui";
import type { Ser } from "./vector/Surface";

const Surface = dynamic(() => import("./vector/Surface"), { ssr: false, loading: () => <p className="p-6 font-mono text-xs">Building the surface…</p> });
const LABELS = ["Q1 ’23", "Q2 ’23", "Q3 ’23", "Q4 ’23", "Q1 ’24", "Q2 ’24", "Q3 ’24", "Q4 ’24", "Q1 ’25", "Q2 ’25", "Q3 ’25", "Q4 ’25", "Q1 ’26", "Q2 ’26"];
const RET: Record<string, number[]> = {
  core: [3.1, 2.4, -1.2, 4.0, 2.8, -3.5, 1.9, 3.3, 2.2, -0.8, 4.4, 2.1, -2.6, 3.7],
  mom: [7.5, 4.8, -6.9, 9.1, 5.2, -11.4, 3.3, 8.8, 4.1, -4.6, 10.2, 3.9, -9.3, 8.4],
  hedge: [1.1, 0.9, 1.4, 0.6, 1.2, 1.8, 0.4, 0.9, 1.1, 0.7, 0.8, 1.0, 1.6, 0.5],
  bench: [4.2, 3.0, -3.8, 5.5, 2.4, -7.1, 2.2, 4.6, 1.8, -2.9, 5.9, 1.4, -5.2, 4.9],
};
const NAMES: Record<string, string> = { core: "Vector Core", mom: "Momentum", hedge: "Hedge", bench: "Benchmark" };
const COL = { term: { core: "#2cff9a", mom: "#ffb000", hedge: "#6ab7ff", bench: "#9aa" }, rep: { core: "#0f5c3c", mom: "#b4490f", hedge: "#1f4f8f", bench: "#777" } };
const idx = (r: number[]) => { let v = 100; return r.map((x) => (v *= 1 + x / 100)); };
const dd = (vals: number[]) => { let pk = 100; return vals.map((v) => { pk = Math.max(pk, v); return v / pk - 1; }); };
const peaks = (vals: number[]) => { let pk = 100; return vals.map((v) => (pk = Math.max(pk, v))); };
const ESSAYS = [
  ["What a drawdown is actually telling you", "A drawdown is the distance between where you are and the highest point you have ever reached. It is not a loss you have realised; it is a measure of how uncomfortable the ride was. Two funds can end in the same place, and one of them will have asked far more of its investors to stay calm. That discomfort is the cost. We publish it next to the return because one without the other is half a sentence."],
  ["Why we publish the bad quarters", "Momentum lost 11.4% in Q2 ’24. The benchmark lost 7.1%. We could have smoothed that into an annual figure and moved on. We did not, because the honest version of this chart is the only one that teaches anyone anything. If the worst quarter is hidden, the whole series is marketing."],
  ["Illustrative is a word we take seriously", "Every number on this page is invented. The shapes are plausible, the arithmetic is real, and the data is fictional. VECTOR is a design study in how to show risk clearly. It is not a fund, not a prospectus and not advice. If you are looking for any of those, you are in the wrong place — and it is better to know that up front."],
];
const DISC = "ILLUSTRATIVE FIGURES — NOT FINANCIAL ADVICE";

export default function Vector({ reality }: { reality: string }) {
  const term = reality !== "report";
  const pal = term ? COL.term : COL.rep;
  const [on, setOn] = useState<Record<string, boolean>>({ core: true, mom: true, hedge: true, bench: true });
  const [showDD, setShowDD] = useState(true); const [labels, setLabels] = useState(true); const [log, setLog] = useState(false);
  const [q, setQ] = useState<number | null>(null);
  const [f, setF] = useState({ name: "", email: "", firm: "", aum: "Under £10m", msg: "" }); const [fe, setFe] = useState<Record<string, string>>({}); const [sent, setSent] = useState("");
  const series: Ser[] = useMemo(() => Object.keys(RET).map((k) => ({ id: k, name: NAMES[k], color: (pal as Record<string, string>)[k], vals: idx(RET[k]) })), [pal]);
  const vis = series.filter((s) => on[s.id]);
  const W = 780, H = 340, L = 50, R = 70, T = 22, B = 34;
  const all = vis.flatMap((s) => s.vals).concat(100);
  const lo = Math.min(...all) * 0.97, hi = Math.max(...all) * 1.03;
  const sy = (v: number) => { const a = log ? Math.log(v) : v, l = log ? Math.log(lo) : lo, h = log ? Math.log(hi) : hi; return H - B - ((a - l) / (h - l)) * (H - T - B); };
  const sx = (i: number) => L + (i / 13) * (W - L - R);
  const ink = term ? "#d4ffe9" : "#1b1b1b";
  const stats = series.map((s) => { const r = RET[s.id], d = dd(s.vals), mdd = Math.min(...d), tr = mdd === 0 ? 0 : d.indexOf(mdd), mean = r.reduce((a, b) => a + b, 0) / r.length, sd = Math.sqrt(r.reduce((a, b) => a + (b - mean) ** 2, 0) / r.length) * 2; return { ...s, total: s.vals[13] - 100, cagr: (Math.pow(s.vals[13] / 100, 1 / 3.5) - 1) * 100, mdd: mdd * 100, tr, vol: sd, best: Math.max(...r), worst: Math.min(...r), ratio: (((Math.pow(s.vals[13] / 100, 1 / 3.5) - 1) * 100) / sd) }; });
  const onKey = (e: React.KeyboardEvent) => { if (e.key === "ArrowRight") { e.preventDefault(); setQ((q ?? -1) + 1 > 13 ? 13 : (q ?? -1) + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); setQ(Math.max(0, (q ?? 1) - 1)); } if (e.key === "Escape") setQ(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Your name, please."; if (!isEmail(f.email)) x.email = "Enter a valid email."; if (f.firm.trim().length < 2) x.firm = "Firm or organisation."; if (f.msg.trim().length < 15) x.msg = "A sentence or two about what you are looking for (15+ characters).";
    setFe(x); if (Object.keys(x).length) return;
    const r = await post("/api/enquiries", { kind: "partner", name: f.name, email: f.email, payload: { firm: f.firm, aum: f.aum, msg: f.msg, notice: DISC } });
    setSent(r.ok ? "Received. This is a fictional fund, so nobody will call — but your enquiry is stored, and the form works exactly as a real one would." : "Could not send just now. Try again.");
  };

  const Chart = (
    <div>
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-sm" role="group" aria-label="Chart options">{series.map((s) => <label key={s.id} className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={on[s.id]} onChange={(e) => setOn({ ...on, [s.id]: e.target.checked })} /><span className="h-2.5 w-5" style={{ background: s.color }} />{s.name}</label>)}
        <span className="opacity-30">|</span>{([["Drawdowns", showDD, setShowDD], ["Labels", labels, setLabels], ["Log scale", log, setLog]] as const).map(([l, v, fn]) => <label key={l} className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={v} onChange={(e) => fn(e.target.checked)} />{l}</label>)}</div>
      <div tabIndex={0} onKeyDown={onKey} onBlur={() => setQ(null)} className="outline-offset-4" aria-label="Performance chart over 14 quarters. Use left and right arrow keys to read each quarter. A full data table follows.">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full touch-none" role="img" aria-label={`Index value over 14 quarters, starting at 100. ${stats.map((s) => `${s.name} ends at ${s.vals[13].toFixed(0)}`).join(", ")}.`}
          onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * W; setQ(Math.max(0, Math.min(13, Math.round(((x - L) / (W - L - R)) * 13)))); }} onPointerLeave={() => setQ(null)}>
          {[0, 1, 2, 3, 4].map((i) => { const v = lo + ((hi - lo) * i) / 4; const yy = sy(log ? Math.exp(Math.log(lo) + ((Math.log(hi) - Math.log(lo)) * i) / 4) : v); const val = log ? Math.exp(Math.log(lo) + ((Math.log(hi) - Math.log(lo)) * i) / 4) : v; return <g key={i}><line x1={L} x2={W - R} y1={yy} y2={yy} stroke={ink} strokeOpacity=".12" /><text x={L - 8} y={yy + 4} textAnchor="end" fontSize="10" fill={ink} opacity=".6">{val.toFixed(0)}</text></g>; })}
          <line x1={L} x2={W - R} y1={sy(100)} y2={sy(100)} stroke={ink} strokeOpacity=".4" strokeDasharray="4 4" /><text x={W - R + 4} y={sy(100) + 4} fontSize="10" fill={ink} opacity=".5">100</text>
          {LABELS.map((l, i) => (i % 2 === 0 || i === 13) && <text key={l} x={sx(i)} y={H - 10} textAnchor="middle" fontSize="10" fill={ink} opacity=".6">{l}</text>)}
          {showDD && vis.map((s) => { const pk = peaks(s.vals); return <path key={"d" + s.id} d={pk.map((p, i) => `${i ? "L" : "M"}${sx(i)},${sy(p)}`).join(" ") + " " + s.vals.map((v, i) => `L${sx(13 - i)},${sy(s.vals[13 - i])}`).join(" ") + "Z"} fill="#ff4d4d" opacity=".16" />; })}
          {vis.map((s) => <g key={s.id}><path d={s.vals.map((v, i) => `${i ? "L" : "M"}${sx(i)},${sy(v)}`).join(" ")} fill="none" stroke={s.color} strokeWidth={s.id === "core" ? 3 : 2} strokeLinejoin="round" />{labels && <text x={sx(13) + 6} y={sy(s.vals[13]) + 4} fontSize="11" fontWeight="600" fill={s.color}>{s.vals[13].toFixed(0)}</text>}</g>)}
          {labels && vis.filter((s) => s.id === "core" || s.id === "mom").map((s) => { const st = stats.find((x) => x.id === s.id)!; return <g key={"l" + s.id}><circle cx={sx(st.tr)} cy={sy(s.vals[st.tr])} r="4.5" fill="none" stroke="#ff4d4d" strokeWidth="2" /><text x={sx(st.tr)} y={sy(s.vals[st.tr]) + 18} textAnchor="middle" fontSize="10" fill="#ff6b6b">trough {st.mdd.toFixed(1)}%</text></g>; })}
          {q !== null && <g><line x1={sx(q)} x2={sx(q)} y1={T} y2={H - B} stroke={ink} strokeOpacity=".5" />{vis.map((s) => <circle key={s.id} cx={sx(q)} cy={sy(s.vals[q])} r="4" fill={s.color} />)}
            <g transform={`translate(${Math.min(W - 190, Math.max(L, sx(q) + 10))},${T + 4})`}><rect width="172" height={22 + vis.length * 17} fill={term ? "#020a07" : "#fff"} stroke={ink} strokeOpacity=".4" /><text x="8" y="15" fontSize="11" fontWeight="600" fill={ink}>{LABELS[q]}</text>{vis.map((s, i) => <text key={s.id} x="8" y={33 + i * 17} fontSize="10.5" fill={s.color}>{s.name.padEnd(12, " ")} {s.vals[q].toFixed(1)} ({RET[s.id][q] > 0 ? "+" : ""}{RET[s.id][q]}%)</text>)}</g></g>}
        </svg>
      </div>
      <p className="mt-1 text-xs opacity-60" role="status" aria-live="polite">{q !== null ? `${LABELS[q]}: ${vis.map((s) => `${s.name} ${s.vals[q].toFixed(1)}`).join(", ")}` : "Hover or focus the chart and use ← → to read a quarter. Red shading = drawdown from the running peak."} <b>{DISC}</b></p>
      <details className="mt-3 text-sm"><summary className="cursor-pointer">Data table</summary><div className="mt-2 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><thead><tr><th>Quarter</th>{series.map((s) => <th key={s.id}>{s.name}</th>)}</tr></thead><tbody>{LABELS.map((l, i) => <tr key={l} className="border-t border-current/20"><td>{l}</td>{series.map((s) => <td key={s.id}>{s.vals[i].toFixed(1)} ({RET[s.id][i] > 0 ? "+" : ""}{RET[s.id][i]}%)</td>)}</tr>)}</tbody></table></div></details>
    </div>
  );
  const Stats = (
    <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left text-sm"><caption className="sr-only">Summary statistics</caption><thead className="text-[11px] uppercase opacity-60"><tr><th className="py-1">Strategy</th><th>Total</th><th>CAGR</th><th>Max DD</th><th>Vol.</th><th>Best / worst Q</th></tr></thead><tbody>{stats.map((s) => <tr key={s.id} className="border-t border-current/20"><td className="py-2 font-semibold" style={{ color: s.color }}>{s.name}</td><td>{s.total > 0 ? "+" : ""}{s.total.toFixed(1)}%</td><td>{s.cagr.toFixed(1)}%</td><td className="text-red-500">{s.mdd.toFixed(1)}%</td><td>{s.vol.toFixed(1)}%</td><td>{s.best > 0 ? "+" : ""}{s.best}% / {s.worst}%</td></tr>)}</tbody></table></div>
  );
  const Form = (
    <form onSubmit={submit} noValidate className="grid max-w-2xl gap-3 sm:grid-cols-2" aria-label="Partner enquiry"><Field label="Name" name="vn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={fe.name} inputClass="border-current/40" /><Field label="Email" name="ve" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={fe.email} inputClass="border-current/40" /><Field label="Firm" name="vf" value={f.firm} onChange={(e) => setF({ ...f, firm: e.target.value })} error={fe.firm} inputClass="border-current/40" />
      <label className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">Assets<select value={f.aum} onChange={(e) => setF({ ...f, aum: e.target.value })} className="mt-1 w-full border border-current/40 bg-transparent px-3 py-2.5 text-[15px] normal-case">{["Under £10m", "£10m–£100m", "£100m+"].map((x) => <option key={x} className="text-black">{x}</option>)}</select></label>
      <Field className="sm:col-span-2" label="What are you looking for?" name="vm" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} error={fe.msg} inputClass="border-current/40" /><div className="sm:col-span-2"><button className={"px-6 py-3 font-semibold " + (term ? "bg-[#2cff9a] text-black" : "bg-[#1b1b1b] text-white")}>Send enquiry</button></div>{sent && <p role="status" className="sm:col-span-2 text-sm">{sent}</p>}</form>
  );

  if (reality === "report") return (
    <div className="bg-[#f6f1e7] text-[#1b1b1b]" style={{ fontFamily: "'Newsreader Variable', serif" }}>
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8"><p className="font-mono text-xs uppercase tracking-[0.3em]">Vector Capital · Fictional · Half-year report</p><h1 className="mt-3 text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.92] tracking-tight">Three and a half years, honestly.</h1><p className="mt-4 max-w-2xl text-xl italic opacity-75">What four strategies returned, what they cost in sleepless quarters, and why we show both.</p><p className="mt-3 inline-block bg-black px-3 py-1 font-mono text-xs font-bold text-white">{DISC}</p>
        <div className="mt-12 border-y-2 border-black py-6 font-mono text-sm">{Chart}</div><div className="mt-8 font-mono">{Stats}</div>
        <div className="mt-14 grid gap-10 md:grid-cols-3">{ESSAYS.map(([t, b]) => <article key={t}><h2 className="text-2xl font-medium leading-tight">{t}</h2><p className="mt-3 leading-relaxed">{b}</p></article>)}</div>
        <section className="mt-16 border-t-2 border-black pt-8" aria-labelledby="pe-h"><h2 id="pe-h" className="text-4xl">Partner enquiry</h2><div className="mb-5 mt-2 font-mono text-xs opacity-70">{DISC}</div>{Form}</section></div></div>
  );

  return (
    <div className="bg-[#06120f] text-[#d4ffe9]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <div className="overflow-hidden border-b border-[#2cff9a]/30 bg-black py-1.5 text-xs" aria-hidden="true"><div className="wasp-marquee flex w-max gap-10 whitespace-nowrap">{Array.from({ length: 6 }).flatMap((_, k) => stats.map((s) => <span key={k + s.id}><b style={{ color: s.color }}>{s.name.toUpperCase()}</b> {RET[s.id][13] > 0 ? "▲" : "▼"} {RET[s.id][13]}% Q2’26</span>))}</div></div>
      <div className="p-4 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-3"><h1 className="text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-none tracking-tight">VECTOR<span className="text-[#2cff9a]">_</span></h1><p className="border border-[#ffb000] px-3 py-1.5 text-xs font-bold text-[#ffb000]">{DISC}</p></div>
        {reality === "surface" ? <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_380px]"><div className="h-[60vh] min-h-[380px] border border-[#2cff9a]/30"><Surface series={series} labels={LABELS} on={on} /></div><div><div className="mb-3 flex flex-wrap gap-3 text-sm" role="group" aria-label="Series">{series.map((s) => <label key={s.id} className="flex items-center gap-2"><input type="checkbox" checked={on[s.id]} onChange={(e) => setOn({ ...on, [s.id]: e.target.checked })} /><span className="h-2.5 w-5" style={{ background: s.color }} />{s.name}</label>)}</div>{Stats}<p className="mt-3 text-xs opacity-60">Rows = strategies, columns = quarters, height = index value (start 100). Switch to Terminal for the 2D chart and a full table.</p></div></div>
          : <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]"><div className="border border-[#2cff9a]/30 p-4">{Chart}</div><div className="space-y-6"><div className="border border-[#2cff9a]/30 p-4"><h2 className="mb-2 text-xs uppercase tracking-[0.25em] text-[#2cff9a]">Summary</h2>{Stats}</div>
            <div className="border border-[#2cff9a]/30 p-4 text-sm"><h2 className="mb-2 text-xs uppercase tracking-[0.25em] text-[#2cff9a]">Quarter tape</h2><ul className="grid grid-cols-7 gap-1 text-[10px]">{LABELS.map((l, i) => { const v = RET.core[i]; return <li key={l} className="p-1.5 text-center" style={{ background: v < 0 ? "rgba(255,77,77,.25)" : "rgba(44,255,154,.15)" }}><span className="block opacity-60">{l}</span>{v > 0 ? "+" : ""}{v}</li>; })}</ul><p className="mt-2 text-[11px] opacity-50">Vector Core quarterly returns, %.</p></div></div></div>}
        <section className="mt-12 grid gap-8 border-t border-[#2cff9a]/30 pt-8 md:grid-cols-3" aria-label="Essays">{ESSAYS.map(([t, b], i) => <article key={t}><p className="text-xs text-[#2cff9a]">ESSAY {String(i + 1).padStart(2, "0")}</p><h2 className="mt-1 text-lg font-semibold">{t}</h2><p className="mt-2 text-sm leading-relaxed opacity-75">{b}</p></article>)}</section>
        <section className="mt-12 border-t border-[#2cff9a]/30 pt-8" aria-labelledby="pe-h"><h2 id="pe-h" className="text-3xl font-semibold">Partner enquiry</h2><p className="mb-5 mt-1 text-xs text-[#ffb000]">{DISC}</p>{Form}</section></div>
    </div>
  );
}

