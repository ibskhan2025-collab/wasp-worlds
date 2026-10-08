"use client";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif";
import { useMemo, useState } from "react";
import { Dialog, Field, download, isEmail } from "@/rb15l/ui";
import { usePersist } from "@/rb15l/hooks";

type Plan = "Starter" | "Growth" | "Scale";
type Status = "Active" | "Trial" | "Churned";
type Cust = { id: string; name: string; contact: string; email: string; plan: Plan; status: Status; since: string };
type Proj = { id: string; name: string; owner: string; col: number; due: string };
type Member = { id: string; name: string; email: string; role: string };
type Act = { t: string; text: string };
type Settings = { workspace: string; currency: string; emailDigest: boolean; slack: boolean; fiscal: string };
type State = { customers: Cust[]; projects: Proj[]; team: Member[]; activity: Act[]; settings: Settings };

const PRICE: Record<Plan, number> = { Starter: 49, Growth: 149, Scale: 499 };
const COLS = ["Backlog", "In progress", "In review", "Shipped"];
const iso = (d: number) => new Date(Date.now() - d * 864e5).toISOString();
const seed: State = {
  customers: [
    ["Halcyon Freight", "Maya Ortiz", "Scale", "Active", 410], ["Mori Ceramics", "Kenji Mori", "Starter", "Active", 330], ["Northgate Clinics", "Dr. Amara Bell", "Scale", "Active", 290],
    ["Quill & Co", "Tom Quill", "Growth", "Active", 250], ["Brightwater Labs", "Ioana Pop", "Growth", "Active", 200], ["Tessellate Studio", "Sam Reyes", "Starter", "Trial", 9],
    ["Ferro Logistics", "Luca Ferro", "Scale", "Active", 160], ["Olive Street Bakery", "Rosa Lind", "Starter", "Active", 140], ["Pine Analytics", "Hugh Pine", "Growth", "Churned", 120],
    ["Kite Legal", "Nora Kite", "Growth", "Active", 90], ["Lumen Schools", "Grace Adu", "Scale", "Trial", 5], ["Fathom Marine", "Jon Fathom", "Growth", "Active", 70],
    ["Ardent Coffee", "Bea Ardent", "Starter", "Active", 40], ["Saltmarsh Press", "Vic Marsh", "Starter", "Churned", 30],
  ].map(([name, contact, plan, status, d], i) => ({ id: "c" + i, name: name as string, contact: contact as string, email: `${(contact as string).split(" ").pop()!.toLowerCase().replace(/\W/g, "")}@${(name as string).toLowerCase().replace(/\W/g, "")}.example`, plan: plan as Plan, status: status as Status, since: iso(d as number).slice(0, 10) })),
  projects: [["Onboarding flow v2", "Maya", 1, 12], ["Usage-based billing", "Dev", 1, 20], ["Audit log export", "Priya", 2, 5], ["Dark mode", "Sam", 3, -3], ["SSO (SAML)", "Dev", 0, 40], ["Mobile dashboard", "Priya", 2, 9], ["Webhook retries", "Sam", 3, -10], ["Public API docs", "Maya", 0, 30]].map(([name, owner, col, due], i) => ({ id: "p" + i, name: name as string, owner: owner as string, col: col as number, due: new Date(Date.now() + (due as number) * 864e5).toISOString().slice(0, 10) })),
  team: [["Maya Chen", "maya@orbit.example", "Founder"], ["Dev Anand", "dev@orbit.example", "Engineering"], ["Priya Rao", "priya@orbit.example", "Design"], ["Sam Okoye", "sam@orbit.example", "Engineering"], ["Lena Hoff", "lena@orbit.example", "Support"]].map(([name, email, role], i) => ({ id: "m" + i, name, email, role })),
  activity: [{ t: iso(0.1), text: "Lumen Schools started a Scale trial" }, { t: iso(0.6), text: "Dark mode shipped to production" }, { t: iso(1.2), text: "Pine Analytics churned (Growth)" }, { t: iso(2.4), text: "Halcyon Freight upgraded to Scale" }],
  settings: { workspace: "Orbit Labs", currency: "£", emailDigest: true, slack: false, fiscal: "January" },
};

const ago = (t: string) => { const m = Math.max(1, Math.round((Date.now() - new Date(t).getTime()) / 6e4)); return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`; };
const TABS = ["Dashboard", "Customers", "Projects", "Team", "Reports", "Settings"];

function MrrChart({ series, bars, cur, accent, ink }: { series: number[]; bars: boolean; cur: string; accent: string; ink: string }) {
  const [h, setH] = useState<number | null>(null);
  const W = 640, H = 220, P = 28;
  const max = Math.max(...series) * 1.1;
  const x = (i: number) => P + (i / (series.length - 1)) * (W - P * 2);
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const months = useMemo(() => { const d = new Date(); return series.map((_, i) => new Date(d.getFullYear(), d.getMonth() - (series.length - 1 - i), 1).toLocaleString("en", { month: "short" })); }, [series]);
  const line = series.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`MRR over the last 12 months, from ${cur}${Math.round(series[0])} to ${cur}${Math.round(series[11])}`}
        onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const i = Math.round((((e.clientX - r.left) / r.width) * W - P) / ((W - P * 2) / (series.length - 1))); setH(Math.max(0, Math.min(series.length - 1, i))); }} onPointerLeave={() => setH(null)}>
        {[0, 0.5, 1].map((t) => <line key={t} x1={P} x2={W - P} y1={y(max * t / 1.1)} y2={y(max * t / 1.1)} stroke={ink} strokeOpacity=".12" />)}
        {bars ? series.map((v, i) => <rect key={i} x={x(i) - 13} y={y(v)} width="26" height={H - P - y(v)} fill={accent} opacity={h === i ? 1 : 0.75} />) : (<>
          <path d={`${line} L${x(11)},${H - P} L${x(0)},${H - P} Z`} fill={accent} opacity=".15" /><path d={line} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" /></>)}
        {series.map((_, i) => i % 2 === 0 && <text key={i} x={x(i)} y={H - 8} fontSize="10" textAnchor="middle" fill={ink} opacity=".5">{months[i]}</text>)}
        {h !== null && <g><line x1={x(h)} x2={x(h)} y1={P / 2} y2={H - P} stroke={ink} strokeOpacity=".3" /><circle cx={x(h)} cy={y(series[h])} r="4.5" fill={accent} /><g transform={`translate(${Math.min(W - 120, Math.max(4, x(h) - 50))},4)`}><rect width="110" height="34" rx="4" fill={ink} /><text x="8" y="14" fontSize="10" fill="#fff" opacity=".7">{months[h]}</text><text x="8" y="28" fontSize="12" fill="#fff" fontWeight="700">{cur}{Math.round(series[h]).toLocaleString()}</text></g></g>}
      </svg>
      <table className="sr-only"><caption>MRR by month</caption><tbody>{series.map((v, i) => <tr key={i}><th>{months[i]}</th><td>{Math.round(v)}</td></tr>)}</tbody></table>
    </div>
  );
}

export default function Orbit({ reality }: { reality: string }) {
  const [s, setS] = usePersist<State>("orbit-v1", seed);
  const [tab, setTab] = useState("Dashboard");
  const paper = reality === "paper";
  const cur = s.settings.currency;
  const log = (text: string) => (st: State): State => ({ ...st, activity: [{ t: new Date().toISOString(), text }, ...st.activity].slice(0, 30) });
  const up = (fn: (st: State) => State) => setS((st) => fn(st));

  const k = paper
    ? { root: "bg-[#f6f3ec] text-[#1c1b19]", card: "bg-white border border-[#1c1b19]/15", muted: "text-[#1c1b19]/55", accent: "#b4492a", ink: "#1c1b19", btn: "bg-[#1c1b19] text-white", ghost: "border border-[#1c1b19]/30", input: "border-[#1c1b19]/30", head: { fontFamily: "'Instrument Serif', serif" }, row: "border-[#1c1b19]/10" }
    : { root: "bg-[#0a0f1c] text-[#dbe4ff]", card: "bg-[#111a2e] border border-white/10", muted: "text-[#dbe4ff]/55", accent: "#5b8cff", ink: "#dbe4ff", btn: "bg-[#5b8cff] text-[#04112e]", ghost: "border border-white/20", input: "border-white/25", head: { fontFamily: "'JetBrains Mono Variable', monospace" }, row: "border-white/10" };

  const active = s.customers.filter((c) => c.status === "Active");
  const mrr = active.reduce((a, c) => a + PRICE[c.plan], 0);
  const series = useMemo(() => Array.from({ length: 12 }, (_, i) => mrr * (0.46 + 0.54 * Math.pow(i / 11, 1.25)) + Math.sin(i * 1.9) * mrr * 0.015), [mrr]);
  const churned = s.customers.filter((c) => c.status === "Churned").length;
  const churn = (churned / Math.max(1, s.customers.length)) * 100;
  const plans = (["Starter", "Growth", "Scale"] as Plan[]).map((p) => ({ p, v: active.filter((c) => c.plan === p).reduce((a, c) => a + PRICE[c.plan], 0) }));

  /* customers */
  const [q, setQ] = useState(""); const [pf, setPf] = useState("All"); const [sort, setSort] = useState<{ k: keyof Cust; d: 1 | -1 }>({ k: "name", d: 1 });
  const [edit, setEdit] = useState<Cust | "new" | null>(null); const [del, setDel] = useState<Cust | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", email: "", plan: "Starter" as Plan, status: "Trial" as Status }); const [fe, setFe] = useState<Record<string, string>>({});
  const custs = useMemo(() => s.customers.filter((c) => (pf === "All" || c.plan === pf) && (c.name + c.contact + c.email).toLowerCase().includes(q.toLowerCase())).sort((a, b) => String(a[sort.k]).localeCompare(String(b[sort.k])) * sort.d), [s.customers, q, pf, sort]);
  const openEdit = (c: Cust | "new") => { setFe({}); setForm(c === "new" ? { name: "", contact: "", email: "", plan: "Starter", status: "Trial" } : { name: c.name, contact: c.contact, email: c.email, plan: c.plan, status: c.status }); setEdit(c); };
  const saveCust = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (form.name.trim().length < 2) x.name = "Company name is required.";
    if (form.contact.trim().length < 2) x.contact = "Contact name is required.";
    if (!isEmail(form.email)) x.email = "Enter a valid email.";
    setFe(x); if (Object.keys(x).length) return;
    if (edit === "new") up((st) => log(`Added customer ${form.name}`)({ ...st, customers: [{ id: "c" + Date.now(), ...form, since: new Date().toISOString().slice(0, 10) }, ...st.customers] }));
    else if (edit) up((st) => log(`Updated ${form.name}`)({ ...st, customers: st.customers.map((c) => (c.id === edit.id ? { ...c, ...form } : c)) }));
    setEdit(null);
  };
  /* projects */
  const [np, setNp] = useState(""); const [npo, setNpo] = useState("Maya");
  /* team */
  const [tm, setTm] = useState({ name: "", email: "", role: "Engineering" }); const [te, setTe] = useState<Record<string, string>>({});
  /* reports */
  const [rep, setRep] = useState("revenue");
  const repRows = useMemo(() => {
    if (rep === "revenue") return [["Plan", "Customers", "MRR"], ...plans.map((p) => [p.p, String(active.filter((c) => c.plan === p.p).length), `${p.v}`]), ["Total", String(active.length), String(mrr)]];
    if (rep === "customers") return [["Company", "Contact", "Plan", "Status", "Since"], ...s.customers.map((c) => [c.name, c.contact, c.plan, c.status, c.since])];
    return [["Project", "Owner", "Stage", "Due"], ...s.projects.map((p) => [p.name, p.owner, COLS[p.col], p.due])];
  }, [rep, s, plans, active, mrr]);
  const csv = () => download(`orbit-${rep}-${new Date().toISOString().slice(0, 10)}.csv`, repRows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv");

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`${k.card} ${paper ? "" : "rounded-lg"} p-4 ${className}`}>{children}</div>;
  const h2 = (t: string) => <h2 className={paper ? "text-4xl" : "text-lg font-semibold"} style={k.head}>{t}</h2>;
  const max = plans.reduce((a, b) => a + b.v, 0) || 1;

  const Nav = paper ? (
    <nav className="flex gap-1 overflow-x-auto border-b border-[#1c1b19]/15 px-4 sm:px-8" aria-label="Orbit">{TABS.map((t) => <button key={t} aria-current={tab === t ? "page" : undefined} onClick={() => setTab(t)} className={"shrink-0 px-4 py-3 text-sm " + (tab === t ? "border-b-2 border-[#b4492a] font-semibold" : "opacity-60")}>{t}</button>)}</nav>
  ) : (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[#0a0f1c] md:static md:w-52 md:shrink-0 md:flex-col md:border-r md:border-t-0 md:p-3" aria-label="Orbit">
      <p className="hidden px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#5b8cff] md:block">● {s.settings.workspace}</p>
      {TABS.map((t) => <button key={t} aria-current={tab === t ? "page" : undefined} onClick={() => setTab(t)} className={"flex-1 px-1 py-3 text-center text-[11px] md:flex-none md:rounded md:px-3 md:py-2 md:text-left md:text-sm " + (tab === t ? "bg-[#5b8cff]/15 text-[#5b8cff]" : "text-[#dbe4ff]/60")}>{t}</button>)}
    </nav>
  );

  return (
    <div className={`${k.root} ${paper ? "" : "md:flex"} min-h-[calc(100vh-88px)] pb-16 md:pb-0`} style={{ fontFamily: "'Inter Variable', sans-serif" }}>
      {Nav}
      <div className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2"><h1 className={paper ? "text-6xl" : "text-2xl font-semibold"} style={k.head}>{tab}</h1><p className={"text-xs " + k.muted}>{s.settings.workspace} · fictional product · data saved in this browser</p></div>

        {tab === "Dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{[["MRR", `${cur}${mrr.toLocaleString()}`], ["ARR", `${cur}${(mrr * 12).toLocaleString()}`], ["Active", String(active.length)], ["Trials", String(s.customers.filter((c) => c.status === "Trial").length)], ["Churn", churn.toFixed(1) + "%"]].map(([l, v]) => <Card key={l}><p className={"text-xs uppercase tracking-wider " + k.muted}>{l}</p><p className={"mt-1 " + (paper ? "text-4xl" : "text-2xl font-semibold")} style={k.head}>{v}</p></Card>)}</div>
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <Card><div className="mb-2">{h2("Monthly recurring revenue")}</div><MrrChart series={series} bars={paper} cur={cur} accent={k.accent} ink={k.ink} /></Card>
              <Card>{h2("Revenue by plan")}<ul className="mt-4 space-y-3">{plans.map((p) => <li key={p.p}><div className="flex justify-between text-sm"><span>{p.p}</span><span>{cur}{p.v.toLocaleString()}</span></div><div className="mt-1 h-2 bg-current/10"><div className="h-2" style={{ width: `${(p.v / max) * 100}%`, background: k.accent }} /></div></li>)}</ul></Card>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>{h2("Activity")}<ul className="mt-3 space-y-2 text-sm">{s.activity.slice(0, 8).map((a, i) => <li key={i} className={"flex justify-between gap-3 border-b pb-2 " + k.row}><span>{a.text}</span><span className={"shrink-0 text-xs " + k.muted}>{ago(a.t)}</span></li>)}</ul></Card>
              <Card>{h2("Newest customers")}<ul className="mt-3 space-y-2 text-sm">{[...s.customers].sort((a, b) => b.since.localeCompare(a.since)).slice(0, 5).map((c) => <li key={c.id} className={"flex justify-between border-b pb-2 " + k.row}><span>{c.name}</span><span className={k.muted}>{c.plan} · {c.status}</span></li>)}</ul></Card>
            </div>
          </div>
        )}

        {tab === "Customers" && (
          <Card>
            <div className="flex flex-wrap items-center gap-2"><label className="sr-only" htmlFor="oq">Search customers</label><input id="oq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, contact, email" className={"min-w-[180px] flex-1 border bg-transparent px-3 py-2 text-sm " + k.input} />
              <label className="sr-only" htmlFor="opf">Plan</label><select id="opf" value={pf} onChange={(e) => setPf(e.target.value)} className={"border bg-transparent px-2 py-2 text-sm " + k.input}>{["All", "Starter", "Growth", "Scale"].map((p) => <option key={p} className="text-black">{p}</option>)}</select>
              <button onClick={() => openEdit("new")} className={k.btn + " px-4 py-2 text-sm font-semibold"}>+ New customer</button></div>
            <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className={"border-b text-xs uppercase " + k.row + " " + k.muted}>{([["name", "Company"], ["plan", "Plan"], ["status", "Status"], ["since", "Since"]] as [keyof Cust, string][]).map(([key, l]) => <th key={key} className="py-2" aria-sort={sort.k === key ? (sort.d === 1 ? "ascending" : "descending") : "none"}><button onClick={() => setSort({ k: key, d: sort.k === key ? (-sort.d as 1 | -1) : 1 })}>{l} {sort.k === key ? (sort.d === 1 ? "↑" : "↓") : ""}</button></th>)}<th className="text-right">Actions</th></tr></thead>
              <tbody>{custs.map((c) => <tr key={c.id} className={"border-b " + k.row}><td className="py-3"><b>{c.name}</b><br /><span className={"text-xs " + k.muted}>{c.contact} · {c.email}</span></td><td>{c.plan}</td><td><span className={"rounded-full px-2 py-0.5 text-xs " + (c.status === "Active" ? "bg-emerald-500/20 text-emerald-600" : c.status === "Trial" ? "bg-amber-500/20 text-amber-600" : "bg-red-500/20 text-red-500")}>{c.status}</span></td><td>{c.since}</td><td className="space-x-2 text-right"><button className="underline" onClick={() => openEdit(c)}>Edit</button><button className="underline" onClick={() => setDel(c)}>Delete</button></td></tr>)}</tbody></table>{custs.length === 0 && <p className="py-8 text-center">No customers match.</p>}</div>
          </Card>
        )}

        {tab === "Projects" && (
          <div>
            <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (np.trim().length < 3) return; up((st) => log(`Created project ${np}`)({ ...st, projects: [...st.projects, { id: "p" + Date.now(), name: np.trim(), owner: npo, col: 0, due: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10) }] })); setNp(""); }}>
              <label className="sr-only" htmlFor="onp">Project name</label><input id="onp" value={np} onChange={(e) => setNp(e.target.value)} placeholder="New project (min 3 characters)" className={"min-w-[200px] flex-1 border bg-transparent px-3 py-2 text-sm " + k.input} />
              <label className="sr-only" htmlFor="onpo">Owner</label><select id="onpo" value={npo} onChange={(e) => setNpo(e.target.value)} className={"border bg-transparent px-2 text-sm " + k.input}>{s.team.map((m) => <option key={m.id} className="text-black">{m.name.split(" ")[0]}</option>)}</select><button className={k.btn + " px-4 py-2 text-sm font-semibold"}>Add</button></form>
            <div className="grid gap-3 md:grid-cols-4">{COLS.map((c, ci) => <section key={c} aria-label={c} className={k.card + " p-3"}><h2 className={"mb-2 text-xs font-semibold uppercase tracking-wider " + k.muted}>{c} ({s.projects.filter((p) => p.col === ci).length})</h2><ul className="space-y-2">{s.projects.filter((p) => p.col === ci).map((p) => <li key={p.id} className={"border p-3 text-sm " + k.row}><p className="font-semibold">{p.name}</p><p className={"text-xs " + k.muted}>{p.owner} · due {p.due}{p.col < 3 && p.due < new Date().toISOString().slice(0, 10) ? " · overdue" : ""}</p>
              <div className="mt-2 flex gap-1 text-xs"><button disabled={ci === 0} aria-label={`Move ${p.name} back`} className={k.ghost + " px-2 py-1 disabled:opacity-30"} onClick={() => up((st) => log(`Moved ${p.name} to ${COLS[ci - 1]}`)({ ...st, projects: st.projects.map((x) => (x.id === p.id ? { ...x, col: ci - 1 } : x)) }))}>←</button><button disabled={ci === 3} aria-label={`Move ${p.name} forward`} className={k.ghost + " px-2 py-1 disabled:opacity-30"} onClick={() => up((st) => log(`Moved ${p.name} to ${COLS[ci + 1]}`)({ ...st, projects: st.projects.map((x) => (x.id === p.id ? { ...x, col: ci + 1 } : x)) }))}>→</button><button className="ml-auto underline" onClick={() => up((st) => ({ ...st, projects: st.projects.filter((x) => x.id !== p.id) }))}>Delete</button></div></li>)}</ul></section>)}</div>
          </div>
        )}

        {tab === "Team" && (
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Card><ul>{s.team.map((m) => <li key={m.id} className={"flex items-center justify-between border-b py-3 " + k.row}><div><b>{m.name}</b><br /><span className={"text-xs " + k.muted}>{m.role} · {m.email}</span></div><button className="text-sm underline" onClick={() => up((st) => log(`Removed ${m.name}`)({ ...st, team: st.team.filter((x) => x.id !== m.id) }))}>Remove</button></li>)}</ul></Card>
            <Card>{h2("Invite a teammate")}<form noValidate className="mt-3 grid gap-3" onSubmit={(e) => { e.preventDefault(); const x: Record<string, string> = {}; if (tm.name.trim().length < 2) x.name = "Name required."; if (!isEmail(tm.email)) x.email = "Valid email required."; setTe(x); if (Object.keys(x).length) return; up((st) => log(`Invited ${tm.name}`)({ ...st, team: [...st.team, { id: "m" + Date.now(), ...tm }] })); setTm({ name: "", email: "", role: "Engineering" }); }}>
              <Field label="Name" name="tn" value={tm.name} onChange={(e) => setTm({ ...tm, name: e.target.value })} error={te.name} inputClass={k.input} /><Field label="Email" name="te" type="email" value={tm.email} onChange={(e) => setTm({ ...tm, email: e.target.value })} error={te.email} inputClass={k.input} />
              <label className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">Role<select value={tm.role} onChange={(e) => setTm({ ...tm, role: e.target.value })} className={"mt-1 w-full border bg-transparent px-3 py-2.5 text-[15px] normal-case " + k.input}>{["Engineering", "Design", "Support", "Sales", "Founder"].map((r) => <option key={r} className="text-black">{r}</option>)}</select></label><button className={k.btn + " px-4 py-2.5 font-semibold"}>Send invite</button></form></Card>
          </div>
        )}

        {tab === "Reports" && (
          <Card><div className="flex flex-wrap items-center gap-2" role="group" aria-label="Report type">{[["revenue", "Revenue by plan"], ["customers", "Customer list"], ["projects", "Project status"]].map(([v, l]) => <button key={v} aria-pressed={rep === v} onClick={() => setRep(v)} className={"px-3 py-1.5 text-sm " + (rep === v ? k.btn : k.ghost)}>{l}</button>)}<button onClick={csv} className={k.ghost + " ml-auto px-3 py-1.5 text-sm font-semibold"}>Export CSV ↓</button></div>
            <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className={"border-b " + k.row}>{repRows[0].map((h) => <th key={h} className="py-2 pr-4 text-xs uppercase">{h}</th>)}</tr></thead><tbody>{repRows.slice(1).map((r, i) => <tr key={i} className={"border-b " + k.row}>{r.map((c, j) => <td key={j} className="py-2 pr-4">{c}</td>)}</tr>)}</tbody></table></div></Card>
        )}

        {tab === "Settings" && (
          <Card className="max-w-xl"><div className="grid gap-4">
            <Field label="Workspace name" name="ws" value={s.settings.workspace} onChange={(e) => up((st) => ({ ...st, settings: { ...st.settings, workspace: e.target.value } }))} inputClass={k.input} />
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">Currency<select value={s.settings.currency} onChange={(e) => up((st) => ({ ...st, settings: { ...st.settings, currency: e.target.value } }))} className={"mt-1 w-full border bg-transparent px-3 py-2.5 text-[15px] normal-case " + k.input}>{["£", "$", "€"].map((c) => <option key={c} className="text-black">{c}</option>)}</select></label>
            {([["emailDigest", "Weekly email digest"], ["slack", "Post new customers to Slack (mock)"]] as const).map(([key, l]) => <label key={key} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={s.settings[key]} onChange={(e) => up((st) => ({ ...st, settings: { ...st.settings, [key]: e.target.checked } }))} className="h-5 w-5" />{l}</label>)}
            <p className={"text-xs " + k.muted}>Settings save automatically to this browser.</p>
            <button className={k.ghost + " w-fit px-4 py-2 text-sm"} onClick={() => { if (confirm("Reset all Orbit demo data?")) setS(seed); }}>Reset demo data</button></div></Card>
        )}
      </div>

      <Dialog open={!!edit} onClose={() => setEdit(null)} label={edit === "new" ? "New customer" : "Edit customer"} className={`max-w-md ${k.root}`}>
        <form onSubmit={saveCust} noValidate className="grid gap-3 p-6"><h2 className="text-xl font-semibold">{edit === "new" ? "New customer" : "Edit customer"}</h2>
          <Field label="Company" name="cn" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={fe.name} inputClass={k.input} /><Field label="Contact" name="cc" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} error={fe.contact} inputClass={k.input} /><Field label="Email" name="ce" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={fe.email} inputClass={k.input} />
          <div className="grid grid-cols-2 gap-3">{([["plan", ["Starter", "Growth", "Scale"]], ["status", ["Active", "Trial", "Churned"]]] as const).map(([key, opts]) => <label key={key} className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">{key}<select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={"mt-1 w-full border bg-transparent px-2 py-2.5 text-[15px] normal-case " + k.input}>{opts.map((o) => <option key={o} className="text-black">{o}</option>)}</select></label>)}</div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setEdit(null)} className={k.ghost + " px-4 py-2"}>Cancel</button><button className={k.btn + " px-4 py-2 font-semibold"}>Save</button></div></form>
      </Dialog>
      <Dialog open={!!del} onClose={() => setDel(null)} label="Confirm delete" className={`max-w-sm ${k.root}`}>
        <div className="p-6"><h2 className="text-xl font-semibold">Delete {del?.name}?</h2><p className={"mt-2 text-sm " + k.muted}>This removes the customer and their MRR from every chart. It cannot be undone.</p><div className="mt-5 flex justify-end gap-2"><button onClick={() => setDel(null)} className={k.ghost + " px-4 py-2"}>Keep</button><button onClick={() => { if (del) up((st) => log(`Deleted ${del.name}`)({ ...st, customers: st.customers.filter((c) => c.id !== del.id) })); setDel(null); }} className="bg-red-600 px-4 py-2 font-semibold text-white">Delete</button></div></div>
      </Dialog>
    </div>
  );
}

