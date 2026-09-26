"use client";

import { useEffect, useMemo, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { orbitSeries, type OrbitCustomer, type OrbitProject } from "@/data/orbit";
import { isCustomerEmailTaken, loadOrbit, saveOrbit, touch } from "@/lib/orbit-store";

const VIEWS = ["Dashboard", "Customers", "Projects", "Team", "Activity", "Settings"] as const;
type View = (typeof VIEWS)[number];
type Range = "7d" | "30d" | "90d";

const STAGES: OrbitProject["stage"][] = ["Discovery", "Design", "Build", "QA", "Live"];

function Chart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const w = 560;
  const h = 160;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 16) + 8;
    const y = h - 16 - (v / max) * (h - 28);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="160" role="img" aria-label="Activity chart">
      <polyline fill="none" stroke="#b24a2e" strokeWidth="2.5" points={pts.join(" ")} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * (w - 16) + 8;
        const y = h - 16 - (v / max) * (h - 28);
        return <circle key={i} cx={x} cy={y} r="3" fill="#161615" />;
      })}
    </svg>
  );
}

function moneyK(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const inputStyle = { background: "transparent", border: "1px solid var(--line)", padding: "8px 10px", fontSize: 14 } as const;

export default function OrbitPage() {
  const [state, setState] = useState(loadOrbit);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("Dashboard");
  const [range, setRange] = useState<Range>("30d");
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState("All");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [err, setErr] = useState("");

  // Hydrate persisted state after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadOrbit());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => saveOrbit(state), 250);
    return () => window.clearTimeout(id);
  }, [state, ready]);

  const customers = useMemo(
    () =>
      state.customers.filter(
        (c) =>
          (health === "All" || c.health === health) &&
          `${c.name} ${c.company}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [state.customers, query, health],
  );
  const customer = state.customers.find((c) => c.id === customerId) ?? null;
  const project = state.projects.find((p) => p.id === projectId) ?? null;
  const revenue = state.customers.reduce((n, c) => n + c.spend, 0);
  const atRisk = state.customers.filter((c) => c.health === "Risk").length;

  function addCustomer(form: FormData) {
    const name = String(form.get("name") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const plan = String(form.get("plan") ?? "Studio") as OrbitCustomer["plan"];
    const spend = Math.floor(Number(form.get("spend") ?? 0));
    const healthV = String(form.get("health") ?? "Quiet") as OrbitCustomer["health"];
    if (!name || !company || !email.includes("@")) return setErr("Name, company and a valid email are required.");
    if (!Number.isFinite(spend) || spend < 0) return setErr("Spend must be 0 or more.");
    if (isCustomerEmailTaken(state, email)) return setErr("That email is already on a customer.");
    const c: OrbitCustomer = {
      id: `c${Date.now()}`, name: name.slice(0, 100), company: company.slice(0, 100),
      plan, spend, health: healthV, last: "just now", email: email.slice(0, 200),
    };
    setState((s) => touch({ ...s, customers: [c, ...s.customers] }, name, `joined as ${company}`));
    setShowAddCustomer(false);
    setErr("");
  }

  function saveCustomer(form: FormData) {
    if (!customer) return;
    const name = String(form.get("name") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!name || !company || !email.includes("@")) return setErr("Name, company and a valid email are required.");
    if (isCustomerEmailTaken(state, email, customer.id)) return setErr("That email belongs to another customer.");
    const plan = String(form.get("plan") ?? customer.plan) as OrbitCustomer["plan"];
    const healthV = String(form.get("health") ?? customer.health) as OrbitCustomer["health"];
    const spend = Math.floor(Number(form.get("spend") ?? customer.spend));
    if (!Number.isFinite(spend) || spend < 0) return setErr("Spend must be 0 or more.");
    setState((s) => {
      const next = {
        ...s,
        customers: s.customers.map((c) => (c.id === customer.id ? { ...c, name, company, email, plan, health: healthV, spend, last: "just now" } : c)),
      };
      return touch(next, name, "record updated");
    });
    setErr("");
  }

  function deleteCustomer() {
    if (!customer) return;
    setState((s) => touch({ ...s, customers: s.customers.filter((c) => c.id !== customer.id) }, customer.name, "removed"));
    setCustomerId(null);
  }

  function addProject(form: FormData) {
    const name = String(form.get("name") ?? "").trim();
    const client = String(form.get("client") ?? "").trim();
    if (!name || !client) return setErr("Project name and client are required.");
    const p: OrbitProject = {
      id: `p${Date.now()}`, name: name.slice(0, 120), client: client.slice(0, 100),
      stage: "Discovery", due: String(form.get("due") ?? "").trim().slice(0, 40) || "—",
      owner: String(form.get("owner") ?? "").trim().slice(0, 80) || "Unassigned",
    };
    setState((s) => touch({ ...s, projects: [p, ...s.projects] }, client, `opened ${name}`));
    setShowAddProject(false);
    setErr("");
  }

  function moveProject(id: string, stage: OrbitProject["stage"]) {
    setState((s) => {
      const p = s.projects.find((x) => x.id === id);
      if (!p || p.stage === stage) return s;
      const next = { ...s, projects: s.projects.map((x) => (x.id === id ? { ...x, stage } : x)) };
      return touch(next, p.owner, `moved ${p.name} to ${stage}`);
    });
  }

  function deleteProject() {
    if (!project) return;
    setState((s) => touch({ ...s, projects: s.projects.filter((p) => p.id !== project.id) }, project.client, `closed ${project.name}`));
    setProjectId(null);
  }

  function setTeamStatus(name: string, status: string) {
    setState((s) => touch({ ...s, team: s.team.map((m) => (m.name === name ? { ...m, status } : m)) }, name, `is now ${status}`));
  }

  const { notify, compact, density } = state.settings;
  function setSettings(patch: Partial<typeof state.settings>) {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }

  return (
    <div className="orbit-root">
      <WorldExit id="orbit" label="Room 03 · ORBIT" />
      <div className="orbit-shell">
        <aside className="orbit-side">
          <div style={{ fontWeight: 600, letterSpacing: "0.18em", fontSize: 12, padding: "8px 10px 18px" }}>ORBIT</div>
          {VIEWS.map((v) => (
            <button key={v} className={view === v ? "on" : ""} type="button" onClick={() => { setView(v); setCustomerId(null); setProjectId(null); setErr(""); }}>
              {v}
            </button>
          ))}
          <p className="kicker" style={{ marginTop: 24, padding: "0 10px" }}>
            Saved in this browser. Reset by clearing site data.
          </p>
        </aside>
        <main className="orbit-main" style={{ fontSize: compact ? 13 : 15 }}>
          {err ? <p role="alert" style={{ background: "#7a1f1f", color: "#fff", padding: "10px 12px", margin: "0 0 16px" }}>{err}</p> : null}
          {view === "Dashboard" ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <p className="kicker">Operations</p>
                  <h1 style={{ margin: "4px 0 16px", fontSize: "2rem", letterSpacing: "-0.04em" }}>Today&apos;s orbit</h1>
                </div>
                <div>
                  {(["7d", "30d", "90d"] as const).map((r) => (
                    <button key={r} className={range === r ? "chip-on" : "chip"} type="button" onClick={() => setRange(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid-3" style={{ marginBottom: 16 }}>
                <div className="metric"><span className="kicker">Customer spend</span><b>{moneyK(revenue)}</b></div>
                <div className="metric"><span className="kicker">Active</span><b>{state.customers.length}</b></div>
                <div className="metric"><span className="kicker">At risk</span><b>{atRisk}</b></div>
              </div>
              <div className="panel" style={{ background: "#f7f8f4" }}>
                <p className="kicker">Signals (sample)</p>
                <Chart data={orbitSeries[range]} />
              </div>
            </>
          ) : null}

          {view === "Customers" ? (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search customers" style={{ flex: 1, minWidth: 160, ...inputStyle }} />
                {["All", "Quiet", "Watch", "Risk"].map((h) => (
                  <button key={h} className={health === h ? "chip-on" : "chip"} type="button" onClick={() => setHealth(h)}>
                    {h}
                  </button>
                ))}
                <button className="btn" type="button" onClick={() => { setShowAddCustomer((v) => !v); setErr(""); }}>+ Add</button>
              </div>
              {showAddCustomer ? (
                <form className="panel" style={{ marginBottom: 16 }} onSubmit={(e) => { e.preventDefault(); addCustomer(new FormData(e.currentTarget)); }}>
                  <div className="grid-2">
                    <label className="field"><span>Name</span><input name="name" required /></label>
                    <label className="field"><span>Company</span><input name="company" required /></label>
                    <label className="field"><span>Email</span><input name="email" type="email" required /></label>
                    <label className="field"><span>Spend</span><input name="spend" type="number" min={0} defaultValue={0} /></label>
                    <label className="field"><span>Plan</span><select name="plan" defaultValue="Studio"><option>Studio</option><option>House</option><option>Orbit</option></select></label>
                    <label className="field"><span>Health</span><select name="health" defaultValue="Quiet"><option>Quiet</option><option>Watch</option><option>Risk</option></select></label>
                  </div>
                  <button className="btn" type="submit">Save customer</button>
                </form>
              ) : null}
              {customer ? (
                <form className="panel" onSubmit={(e) => { e.preventDefault(); saveCustomer(new FormData(e.currentTarget)); }}>
                  <button className="ghost" type="button" onClick={() => setCustomerId(null)}>← Back</button>
                  <div className="grid-2" style={{ marginTop: 12 }}>
                    <label className="field"><span>Name</span><input name="name" defaultValue={customer.name} required /></label>
                    <label className="field"><span>Company</span><input name="company" defaultValue={customer.company} required /></label>
                    <label className="field"><span>Email</span><input name="email" type="email" defaultValue={customer.email} required /></label>
                    <label className="field"><span>Spend</span><input name="spend" type="number" min={0} defaultValue={customer.spend} /></label>
                    <label className="field"><span>Plan</span><select name="plan" defaultValue={customer.plan}><option>Studio</option><option>House</option><option>Orbit</option></select></label>
                    <label className="field"><span>Health</span><select name="health" defaultValue={customer.health}><option>Quiet</option><option>Watch</option><option>Risk</option></select></label>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn" type="submit">Save</button>
                    <button className="btn ghost" type="button" onClick={deleteCustomer}>Delete</button>
                  </div>
                </form>
              ) : (
                <table className="orbit-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Company</th><th>Plan</th><th>Health</th><th>Last</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} onClick={() => setCustomerId(c.id)} style={{ cursor: "pointer" }}>
                        <td>{c.name}</td>
                        <td>{c.company}</td>
                        <td>{c.plan}</td>
                        <td>{c.health}</td>
                        <td>{c.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : null}

          {view === "Projects" ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <button className="btn" type="button" onClick={() => { setShowAddProject((v) => !v); setErr(""); }}>+ Add project</button>
              </div>
              {showAddProject ? (
                <form className="panel" style={{ marginBottom: 16 }} onSubmit={(e) => { e.preventDefault(); addProject(new FormData(e.currentTarget)); }}>
                  <div className="grid-2">
                    <label className="field"><span>Project</span><input name="name" required /></label>
                    <label className="field"><span>Client</span><input name="client" required /></label>
                    <label className="field"><span>Due</span><input name="due" placeholder="19 May" /></label>
                    <label className="field"><span>Owner</span><input name="owner" placeholder="A. Shah" /></label>
                  </div>
                  <button className="btn" type="submit">Save project</button>
                </form>
              ) : null}
              {project ? (
                <div className="panel">
                  <button className="ghost" type="button" onClick={() => setProjectId(null)}>← Back</button>
                  <h2>{project.name}</h2>
                  <p>{project.client}</p>
                  <p>Due: {project.due}</p>
                  <p>Owner: {project.owner}</p>
                  <label className="field"><span>Stage</span>
                    <select value={project.stage} onChange={(e) => moveProject(project.id, e.target.value as OrbitProject["stage"])}>
                      {STAGES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                  <button className="btn ghost" type="button" onClick={deleteProject}>Delete project</button>
                </div>
              ) : (
                <table className="orbit-table">
                  <thead>
                    <tr><th>Project</th><th>Client</th><th>Stage</th><th>Due</th><th>Owner</th></tr>
                  </thead>
                  <tbody>
                    {state.projects.map((p) => (
                      <tr key={p.id} onClick={() => setProjectId(p.id)} style={{ cursor: "pointer" }}>
                        <td>{p.name}</td>
                        <td>{p.client}</td>
                        <td>
                          <select
                            value={p.stage}
                            aria-label={`Stage for ${p.name}`}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => moveProject(p.id, e.target.value as OrbitProject["stage"])}
                          >
                            {STAGES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>{p.due}</td>
                        <td>{p.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : null}

          {view === "Team" ? (
            <div className="grid-2">
              {state.team.map((m) => (
                <div key={m.name} className="panel">
                  <h3 style={{ margin: "0 0 6px" }}>{m.name}</h3>
                  <p className="kicker">{m.role}</p>
                  <label className="field"><span>Status</span>
                    <select value={m.status} onChange={(e) => setTeamStatus(m.name, e.target.value)}>
                      {["In build", "Review", "Away", "Available"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          ) : null}

          {view === "Activity" ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {state.activity.map((a) => (
                <li key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                  <strong>{a.who}</strong> {a.what} <span className="kicker">{a.when}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {view === "Settings" ? (
            <div className="panel" style={{ maxWidth: 480 }}>
              <h2>Interface</h2>
              <label style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <input type="checkbox" checked={notify} onChange={(e) => setSettings({ notify: e.target.checked })} />
                Notifications in the room
              </label>
              <label style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <input type="checkbox" checked={compact} onChange={(e) => setSettings({ compact: e.target.checked })} />
                Compact density
              </label>
              <label className="field">
                <span>Layout</span>
                <select value={density} onChange={(e) => setSettings({ density: e.target.value })}>
                  <option>Comfortable</option>
                  <option>Dense</option>
                  <option>Editorial</option>
                </select>
              </label>
              <p>Current: {density}. {notify ? "You would see pings." : "Quiet."}</p>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
