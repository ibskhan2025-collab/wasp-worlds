"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useLocal } from "@/rb54l/state";
type XP = { reality: string; world?: unknown };

type Cust = { id: number; name: string; plan: "Starter" | "Team" | "Scale"; mrr: number; health: number; owner: string };
type Proj = { id: number; name: string; status: "Planned" | "Building" | "Shipped" };
type Act = { t: number; msg: string };
const SEED: Cust[] = [
  { id: 1, name: "Harbour Bakery", plan: "Starter", mrr: 49, health: 82, owner: "Ana" },
  { id: 2, name: "Northlight Clinic", plan: "Team", mrr: 290, health: 64, owner: "Luis" },
  { id: 3, name: "Kiln & Co", plan: "Team", mrr: 290, health: 91, owner: "Ana" },
  { id: 4, name: "Meridian Freight", plan: "Scale", mrr: 1200, health: 38, owner: "Mo" },
  { id: 5, name: "Paper Tiger Press", plan: "Starter", mrr: 49, health: 55, owner: "Luis" },
  { id: 6, name: "Oakline Studio", plan: "Scale", mrr: 1200, health: 77, owner: "Mo" },
];
const PRICE = { Starter: 49, Team: 290, Scale: 1200 } as const;
const TEAM = [["Ana", "Customer success", "online"], ["Luis", "Sales", "away"], ["Mo", "Solutions", "online"]];

function useOrbit() {
  const [cs, setCs] = useLocal<Cust[]>("wasp:orbit:customers", SEED);
  const [ps, setPs] = useLocal<Proj[]>("wasp:orbit:projects", [{ id: 1, name: "SSO for Scale plan", status: "Building" }, { id: 2, name: "Usage-based billing", status: "Planned" }, { id: 3, name: "CSV import", status: "Shipped" }]);
  const [log, setLog] = useLocal<Act[]>("wasp:orbit:log", []);
  const [cfg, setCfg] = useLocal<{ dense: boolean; dark: boolean; cur: string }>("wasp:orbit:cfg", { dense: false, dark: false, cur: "€" });
  const act = (msg: string) => setLog((l) => [{ t: Date.now(), msg }, ...l].slice(0, 30));
  const m = useMemo(() => {
    const mrr = cs.reduce((s, c) => s + c.mrr, 0);
    return { mrr, arr: mrr * 12, n: cs.length, risk: cs.filter((c) => c.health < 50).length, avg: cs.length ? Math.round(mrr / cs.length) : 0, byPlan: (["Starter", "Team", "Scale"] as const).map((p) => [p, cs.filter((c) => c.plan === p).length] as const) };
  }, [cs]);
  const csv = () => {
    const rows = [["id", "name", "plan", "mrr", "health", "owner"], ...cs.map((c) => [c.id, c.name, c.plan, c.mrr, c.health, c.owner])];
    const blob = new Blob([rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `orbit-customers-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(a.href);
    act(`Exported ${cs.length} customers to CSV`);
  };
  return { cs, setCs, ps, setPs, log, act, m, csv, cfg, setCfg };
}

export default function Orbit({ reality }: XP) {
  const o = useOrbit();
  return reality === "terminal" ? <Terminal o={o} /> : <Consolev o={o} />;
}

function Consolev({ o }: { o: ReturnType<typeof useOrbit> }) {
  const [tab, setTab] = useState("Overview");
  const [q, setQ] = useState(""); const [sort, setSort] = useState<keyof Cust>("mrr");
  const [draft, setDraft] = useState({ name: "", plan: "Starter" as Cust["plan"] }); const [err, setErr] = useState("");
  const [edit, setEdit] = useState<number | null>(null);
  const { cs, setCs, m, cfg } = o;
  const dark = cfg.dark;
  const pad = cfg.dense ? "py-1.5" : "py-3";
  const rows = cs.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (typeof a[sort] === "number" ? (b[sort] as number) - (a[sort] as number) : String(a[sort]).localeCompare(String(b[sort]))));
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) return setErr("Customer name needs at least 2 characters.");
    if (cs.some((c) => c.name.toLowerCase() === draft.name.trim().toLowerCase())) return setErr(`${draft.name} already exists.`);
    const c: Cust = { id: Math.max(0, ...cs.map((x) => x.id)) + 1, name: draft.name.trim(), plan: draft.plan, mrr: PRICE[draft.plan], health: 70, owner: "Ana" };
    setCs([...cs, c]); o.act(`Added ${c.name} on ${c.plan}`); setDraft({ name: "", plan: "Starter" }); setErr("");
  };
  const shell = dark ? "bg-[#0b1020] text-slate-100" : "bg-[#f6f7f9] text-slate-900";
  const card = dark ? "bg-[#121a33] border-white/10" : "bg-white border-slate-200";
  return (
    <div className={`${shell} grid min-h-[80vh] md:grid-cols-[210px_1fr]`} style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <aside className={`flex gap-1 overflow-x-auto border-b p-3 md:flex-col md:border-b-0 md:border-r ${dark ? "border-white/10" : "border-slate-200"}`}>
        <p className="hidden px-3 pb-3 font-extrabold tracking-tight md:block">◐ orbit</p>
        {["Overview", "Customers", "Projects", "Team", "Reports", "Settings"].map((t) => (
          <button key={t} onClick={() => setTab(t)} aria-current={tab === t} className={`shrink-0 rounded-md px-3 py-2 text-left text-sm ${tab === t ? "bg-[#2f5bff] text-white" : "opacity-70 hover:opacity-100"}`}>{t}</button>
        ))}
        <p className="mt-auto hidden px-3 pt-6 text-[11px] opacity-50 md:block">DEMO DATA · stored in your browser</p>
      </aside>
      <div className="p-4 md:p-8">
        {tab === "Overview" && (<>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[["MRR", `${cfg.cur}${m.mrr.toLocaleString()}`], ["ARR (MRR×12)", `${cfg.cur}${m.arr.toLocaleString()}`], ["Customers", m.n], ["At risk (health<50)", m.risk]].map(([k, v]) => (
              <div key={k as string} className={`rounded-lg border p-4 ${card}`}><p className="text-xs opacity-60">{k}</p><p className="mt-1 text-3xl font-semibold tabular-nums">{v}</p></div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className={`rounded-lg border p-4 lg:col-span-2 ${card}`}><p className="text-xs opacity-60">Customers by plan (live from table)</p>
              <div className="mt-4 space-y-3">{m.byPlan.map(([p, n]) => (<div key={p} className="flex items-center gap-3 text-sm"><span className="w-16">{p}</span><div className="h-6 flex-1 rounded bg-slate-500/10"><div className="h-6 rounded bg-[#2f5bff] transition-all duration-300" style={{ width: `${m.n ? (n / m.n) * 100 : 0}%` }} /></div><span className="w-6 tabular-nums">{n}</span></div>))}</div>
            </div>
            <div className={`rounded-lg border p-4 ${card}`}><p className="text-xs opacity-60">Activity</p>
              <ul className="mt-3 space-y-2 text-sm">{o.log.length === 0 ? <li className="opacity-60">Nothing yet. Add or edit a customer and it shows up here.</li> : o.log.slice(0, 6).map((a) => <li key={a.t}><span className="opacity-50">{new Date(a.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span> {a.msg}</li>)}</ul>
            </div>
          </div>
        </>)}
        {tab === "Customers" && (<>
          <div className="flex flex-wrap items-end gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers" aria-label="Search customers" className={`rounded-md border px-3 py-2 text-sm ${card}`} />
            <form onSubmit={add} className="ml-auto flex flex-wrap gap-2" noValidate>
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="New customer name" aria-label="New customer name" aria-invalid={!!err} className={`rounded-md border px-3 py-2 text-sm ${card}`} />
              <select value={draft.plan} onChange={(e) => setDraft({ ...draft, plan: e.target.value as Cust["plan"] })} aria-label="Plan" className={`rounded-md border px-2 py-2 text-sm ${card}`}>{Object.keys(PRICE).map((p) => <option key={p}>{p}</option>)}</select>
              <button className="rounded-md bg-[#2f5bff] px-4 py-2 text-sm text-white">Add customer</button>
            </form>
          </div>
          {err && <p role="alert" className="mt-2 text-sm text-red-500">{err}</p>}
          {cs.length === 0 ? (
            <div className={`mt-6 rounded-lg border border-dashed p-10 text-center ${card}`}><p className="text-lg font-semibold">No customers — a clean slate.</p><p className="mt-1 text-sm opacity-70">Add one above, or restore the demo set.</p><button onClick={() => { setCs(SEED); o.act("Restored demo customers"); }} className="mt-4 rounded-md border px-4 py-2 text-sm">Restore demo data</button></div>
          ) : (
            <div className={`mt-4 overflow-x-auto rounded-lg border ${card}`}>
              <table className="w-full text-sm"><thead><tr className="text-left text-xs opacity-60">{(["name", "plan", "mrr", "health", "owner"] as const).map((k) => <th key={k} className="px-4 py-3"><button onClick={() => setSort(k)} aria-sort={sort === k ? "descending" : "none"}>{k.toUpperCase()}{sort === k ? " ↓" : ""}</button></th>)}<th /></tr></thead>
                <tbody>{rows.map((c) => (
                  <tr key={c.id} className={`border-t ${dark ? "border-white/5" : "border-slate-100"}`}>
                    <td className={`px-4 ${pad} font-medium`}>{edit === c.id ? <input autoFocus defaultValue={c.name} aria-label="Edit name" className="rounded border px-2 py-1 text-slate-900" onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== c.name) { setCs(cs.map((x) => (x.id === c.id ? { ...x, name: v } : x))); o.act(`Renamed ${c.name} → ${v}`); } setEdit(null); }} onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} /> : c.name}</td>
                    <td className={`px-4 ${pad}`}><select value={c.plan} aria-label={`Plan for ${c.name}`} onChange={(e) => { const p = e.target.value as Cust["plan"]; setCs(cs.map((x) => (x.id === c.id ? { ...x, plan: p, mrr: PRICE[p] } : x))); o.act(`${c.name}: ${c.plan} → ${p}`); }} className="bg-transparent">{Object.keys(PRICE).map((p) => <option key={p}>{p}</option>)}</select></td>
                    <td className={`px-4 ${pad} tabular-nums`}>{cfg.cur}{c.mrr}</td>
                    <td className={`px-4 ${pad}`}><span className={`rounded px-2 py-0.5 text-xs ${c.health < 50 ? "bg-red-500/15 text-red-500" : c.health < 70 ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"}`}>{c.health}</span></td>
                    <td className={`px-4 ${pad}`}>{c.owner}</td>
                    <td className={`px-4 ${pad} text-right`}><button onClick={() => setEdit(c.id)} className="mr-3 text-xs opacity-60 hover:opacity-100">Edit</button><button onClick={() => { setCs(cs.filter((x) => x.id !== c.id)); o.act(`Deleted ${c.name}`); }} className="text-xs text-red-500">Delete</button></td>
                  </tr>))}</tbody></table>
            </div>)}
        </>)}
        {tab === "Projects" && (
          <div className="grid gap-3 md:grid-cols-3">{(["Planned", "Building", "Shipped"] as const).map((s) => (
            <div key={s} className={`rounded-lg border p-3 ${card}`}><p className="text-xs opacity-60">{s}</p>
              {o.ps.filter((p) => p.status === s).map((p) => (
                <button key={p.id} onClick={() => { const next = s === "Planned" ? "Building" : s === "Building" ? "Shipped" : "Planned"; o.setPs(o.ps.map((x) => (x.id === p.id ? { ...x, status: next } : x))); o.act(`${p.name} → ${next}`); }} className={`mt-2 block w-full rounded-md border p-3 text-left text-sm ${dark ? "border-white/10" : "border-slate-200"} hover:border-[#2f5bff]`}>{p.name}<span className="block text-xs opacity-50">click to advance</span></button>
              ))}</div>))}</div>
        )}
        {tab === "Team" && <ul className="grid gap-3 md:grid-cols-3">{TEAM.map(([n, r, s]) => <li key={n} className={`rounded-lg border p-4 ${card}`}><p className="font-semibold">{n}</p><p className="text-sm opacity-60">{r}</p><p className="mt-2 text-xs"><span className={`mr-1 inline-block h-2 w-2 rounded-full ${s === "online" ? "bg-emerald-500" : "bg-amber-500"}`} />{s} · owns {o.cs.filter((c) => c.owner === n).length} accounts</p></li>)}</ul>}
        {tab === "Reports" && (
          <div className={`max-w-xl rounded-lg border p-6 ${card}`}><p className="text-lg font-semibold">Customer export</p><p className="mt-1 text-sm opacity-70">{o.cs.length} rows · {m.risk} flagged at risk · average {cfg.cur}{m.avg}/mo. Opens in Excel, Numbers or Sheets.</p>
            <button onClick={o.csv} disabled={!o.cs.length} className="mt-4 rounded-md bg-[#2f5bff] px-4 py-2 text-sm text-white disabled:opacity-40">Download CSV</button></div>
        )}
        {tab === "Settings" && (
          <div className={`max-w-xl space-y-4 rounded-lg border p-6 ${card}`}>
            {([["dense", "Compact tables"], ["dark", "Dark interface"]] as const).map(([k, l]) => (
              <label key={k} className="flex items-center justify-between text-sm">{l}<input type="checkbox" checked={o.cfg[k]} onChange={(e) => o.setCfg({ ...o.cfg, [k]: e.target.checked })} className="h-5 w-5 accent-[#2f5bff]" /></label>
            ))}
            <label className="flex items-center justify-between text-sm">Currency<select value={o.cfg.cur} onChange={(e) => o.setCfg({ ...o.cfg, cur: e.target.value })} className="bg-transparent">{["€", "$", "£"].map((c) => <option key={c}>{c}</option>)}</select></label>
            <button onClick={() => { o.setCs(SEED); o.act("Reset to demo data"); }} className="text-sm text-red-500">Reset demo data</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Terminal({ o }: { o: ReturnType<typeof useOrbit> }) {
  const [lines, setLines] = useState<string[]>(["orbit shell — same data as the console. type `help`."]);
  const [v, setV] = useState(""); const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ block: "nearest" }), [lines]);
  const run = (cmd: string) => {
    const [c, ...a] = cmd.trim().split(/\s+/); const out: string[] = [`$ ${cmd}`];
    const cmds = ["help", "ls", "add", "rm", "plan", "stats", "export", "clear", "log"];
    const near = cmds.find((x) => c && x.startsWith(c.slice(0, 2)));
    switch (c) {
      case "help": out.push("ls · add <name> [starter|team|scale] · rm <id> · plan <id> <plan> · stats · log · export · clear"); break;
      case "ls": o.cs.forEach((x) => out.push(`${String(x.id).padStart(3)}  ${x.name.padEnd(22)} ${x.plan.padEnd(8)} ${o.cfg.cur}${String(x.mrr).padStart(5)}  h=${x.health}`)); if (!o.cs.length) out.push("(empty) — try: add Acme team"); break;
      case "add": { const plan = (a.length > 1 && ["starter", "team", "scale"].includes(a[a.length - 1].toLowerCase()) ? a.pop()! : "starter"); const name = a.join(" "); if (!name) { out.push("usage: add <name> [plan]"); break; } const P = (plan[0].toUpperCase() + plan.slice(1).toLowerCase()) as Cust["plan"]; o.setCs([...o.cs, { id: Math.max(0, ...o.cs.map((x) => x.id)) + 1, name, plan: P, mrr: PRICE[P], health: 70, owner: "Ana" }]); o.act(`Added ${name} (terminal)`); out.push(`+ ${name} on ${P}`); break; }
      case "rm": { const id = Number(a[0]); const hit = o.cs.find((x) => x.id === id); if (!hit) out.push(`no customer with id ${a[0] ?? "?"} — run ls`); else { o.setCs(o.cs.filter((x) => x.id !== id)); o.act(`Deleted ${hit.name} (terminal)`); out.push(`- ${hit.name}`); } break; }
      case "plan": { const id = Number(a[0]); const p = a[1] ? ((a[1][0].toUpperCase() + a[1].slice(1).toLowerCase()) as Cust["plan"]) : undefined; if (!p || !(p in PRICE)) { out.push("usage: plan <id> starter|team|scale"); break; } o.setCs(o.cs.map((x) => (x.id === id ? { ...x, plan: p, mrr: PRICE[p] } : x))); out.push(`~ ${id} → ${p}`); break; }
      case "stats": out.push(`mrr ${o.cfg.cur}${o.m.mrr} · arr ${o.cfg.cur}${o.m.arr} · customers ${o.m.n} · at-risk ${o.m.risk} · avg ${o.cfg.cur}${o.m.avg}`); break;
      case "log": o.log.slice(0, 8).forEach((l) => out.push(`${new Date(l.t).toLocaleTimeString()}  ${l.msg}`)); break;
      case "export": o.csv(); out.push("csv downloaded"); break;
      case "clear": setLines([]); return;
      case undefined: return;
      default: out.push(`unknown command '${c}'${near ? ` — did you mean '${near}'?` : ""}`);
    }
    setLines((l) => [...l, ...out]);
  };
  return (
    <div className="min-h-[70vh] bg-[#0a0f0a] p-5 font-mono text-sm text-[#7dff9a] md:p-10" onClick={() => document.getElementById("orbit-cli")?.focus()}>
      {lines.map((l, i) => <pre key={i} className="whitespace-pre-wrap">{l}</pre>)}
      <form onSubmit={(e) => { e.preventDefault(); run(v); setV(""); }} className="flex gap-2"><span>$</span><input id="orbit-cli" value={v} onChange={(e) => setV(e.target.value)} autoFocus aria-label="Terminal command" className="flex-1 bg-transparent outline-none" autoComplete="off" spellCheck={false} /></form>
      <div ref={end} />
    </div>
  );
}
