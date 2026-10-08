"use client";

import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { loadOrbit } from "@/lib/orbit-store";

function useSnapshot() {
  const [s] = useState(loadOrbit);
  return s;
}

export function OrbitConsole() {
  const s = useSnapshot();
  const revenue = s.customers.reduce((n, c) => n + c.spend, 0);
  const risk = s.customers.filter((c) => c.health === "Risk").length;
  return (
    <div style={{ background: "#101311", color: "#e6efe8", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/CONSOLE" />
      <OrbitNav current="console" />
      <header style={{ padding: "20px", borderBottom: "1px solid #2a332c" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#3ddc84", margin: 0 }}>ORBIT://CONSOLE · LIVE READOUT</p>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 12, fontSize: "0.95rem" }}>
          <span>REV <strong style={{ color: "#3ddc84" }}>${(revenue / 1000).toFixed(1)}k</strong></span>
          <span>ACCOUNTS <strong>{s.customers.length}</strong></span>
          <span>RISK <strong style={{ color: risk ? "#ff5a5a" : "#3ddc84" }}>{risk}</strong></span>
          <span>PROJECTS <strong>{s.projects.length}</strong></span>
          <span>EVENTS <strong>{s.activity.length}</strong></span>
        </div>
      </header>
      <div style={{ padding: "0 20px 24px", fontSize: "0.85rem" }}>
        <p style={{ color: "#7d8a80" }}>$ watch customers --health</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ textAlign: "left", color: "#7d8a80", borderBottom: "1px solid #2a332c" }}><th style={{ padding: "8px 4px" }}>NAME</th><th>CO</th><th>PLAN</th><th>SPEND</th><th>STATE</th></tr></thead>
          <tbody>
            {s.customers.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #1c231d" }}>
                <td style={{ padding: "8px 4px" }}>{c.name}</td>
                <td>{c.company}</td>
                <td>{c.plan}</td>
                <td>${c.spend.toLocaleString()}</td>
                <td style={{ color: c.health === "Risk" ? "#ff5a5a" : c.health === "Watch" ? "#e8b86d" : "#3ddc84" }}>{c.health.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ color: "#7d8a80" }}>$ watch projects --stage</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {s.projects.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #1c231d" }}>
                <td style={{ padding: "8px 4px" }}>{p.name}</td>
                <td>{p.client}</td>
                <td style={{ color: "#3ddc84" }}>[{p.stage.toUpperCase()}]</td>
                <td>{p.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 20 }}>
          <Link href="/worlds/orbit" style={{ background: "#3ddc84", color: "#101311", padding: "10px 16px", fontWeight: 700 }}>OPEN FULL CONSOLE →</Link>
        </div>
      </div>
      <WorldProof
        proves="Same dataset, terminal grammar. Operations data that survives a theme change is modeled right."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}

export function OrbitCompact() {
  const s = useSnapshot();
  const all = [
    ...s.customers.map((c) => ({ k: `C ${c.name} · ${c.company} · ${c.plan} · $${c.spend} · ${c.health}`, id: c.id })),
    ...s.projects.map((p) => ({ k: `P ${p.name} · ${p.client} · ${p.stage} · ${p.due}`, id: p.id })),
  ];
  return (
    <div style={{ background: "#e4e6e0", color: "#161615", minHeight: "100dvh", fontFamily: "var(--font-code)", fontSize: "0.8rem" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/COMPACT" />
      <OrbitNav current="compact" />
      <div style={{ padding: "12px 16px", borderBottom: "2px solid #161615", display: "flex", justifyContent: "space-between" }}>
        <strong>ORBIT/COMPACT — {all.length} ROWS, ZERO AIR</strong>
        <Link href="/worlds/orbit" style={{ textDecoration: "underline" }}>full →</Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {all.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #c9ccc2" }}>
              <td style={{ padding: "5px 16px" }}>{r.k}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: "12px 16px" }}>
        <p style={{ color: "#6d6f69" }}>Density is a feature. Mutations live in the <Link href="/worlds/orbit" style={{ textDecoration: "underline" }}>full console</Link>.</p>
      </div>
    </div>
  );
}

export function OrbitStandup() {
  const [s] = useState(loadOrbit);
  const blocked = s.projects.filter((p) => p.stage === "QA" || p.stage === "Discovery");
  const shipping = s.projects.filter((p) => p.stage === "Build");
  return (
    <div style={{ background: "#f6f1e6", color: "#23201a", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/STANDUP" />
      <OrbitNav current="standup" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>09:15 · FIFTEEN MINUTES · NO CHAIRS</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", fontWeight: 400, margin: "8px 0" }}>Standup.</h1>
        <p style={{ fontStyle: "italic", color: "#6b6254" }}>Yesterday, today, blocked — from the same board as the console, read aloud.</p>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", marginTop: 32 }}>ROUND THE ROOM</p>
        {s.team.map((m, i) => (
          <div key={m.name} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 12, padding: "14px 0", borderBottom: "1px solid rgba(35,32,26,0.2)" }}>
            <span style={{ fontSize: "1.6rem", color: "#8a3b1f" }}>{String(i + 1).padStart(2, "0")}</span>
            <span>
              <strong>{m.name}</strong> <em style={{ color: "#6b6254" }}>· {m.role}</em>
              <br /><span style={{ fontSize: "0.9rem" }}>{m.status === "Away" ? "Out today — nothing blocked on them." : `${m.status}; unblocked.`}</span>
            </span>
          </div>
        ))}
        <p style={{ fontSize: 11, letterSpacing: "0.3em", marginTop: 32 }}>YESTERDAY, IN THEIR WORDS</p>
        {s.activity.slice(0, 6).map((a) => (
          <p key={a.id} style={{ padding: "10px 0", borderBottom: "1px dashed rgba(35,32,26,0.3)", margin: 0 }}>
            <strong>{a.who}</strong> {a.what} <span style={{ color: "#6b6254", fontSize: "0.85rem" }}>· {a.when} ago</span>
          </p>
        ))}
        <p style={{ fontSize: 11, letterSpacing: "0.3em", marginTop: 32 }}>SHIPPING / BLOCKED</p>
        <p style={{ fontSize: "0.95rem" }}>In build: {shipping.map((p) => p.name).join(" · ") || "nothing"}. Needs eyes: {blocked.map((p) => `${p.name} (${p.stage})`).join(" · ") || "nothing"}.</p>
        <p style={{ marginTop: 24 }}>Standup over. <Link href="/worlds/orbit" style={{ textDecoration: "underline" }}>Back to the console →</Link></p>
      </div>
      <WorldProof
        proves="The meeting writes itself: same standup, zero status-update theatre — the board already knows."
        relatedHref="/worlds/civic"
        relatedName="CIVIC"
      />
    </div>
  );
}

export function OrbitForecast() {
  const [s] = useState(loadOrbit);
  const revenue = s.customers.reduce((n, c) => n + c.spend, 0);
  const stages = ["Discovery", "Design", "Build", "QA", "Live"];
  const max = Math.max(...s.customers.map((c) => c.spend));
  return (
    <div style={{ background: "#0d1420", color: "#dfe8f2", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/FORECAST" />
      <OrbitNav current="forecast" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fc3ff" }}>PIPELINE · REVENUE · NEXT 90 DAYS</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>${revenue.toLocaleString()} <span style={{ fontSize: "1.2rem", color: "#7f8fb0" }}>under management</span></h1>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fc3ff", marginTop: 32 }}>ACCOUNTS BY SPEND</p>
        {[...s.customers].sort((a, b) => b.spend - a.spend).map((c) => (
          <div key={c.id} style={{ margin: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
              <span>{c.company} <span style={{ color: "#7f8fb0" }}>· {c.plan} · {c.health}</span></span>
              <span>${c.spend.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: "rgba(223,232,242,0.12)", marginTop: 4 }}>
              <div style={{ height: "100%", width: `${Math.round((c.spend / max) * 100)}%`, background: c.health === "Risk" ? "#ff5a5a" : "#6fc3ff" }} />
            </div>
          </div>
        ))}
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fc3ff", marginTop: 32 }}>WORK BY STAGE</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
          {stages.map((st) => (
            <div key={st} style={{ border: "1px solid rgba(223,232,242,0.25)", padding: 12 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#7f8fb0", margin: "0 0 8px" }}>{st.toUpperCase()}</p>
              {s.projects.filter((p) => p.stage === st).map((p) => (
                <p key={p.id} style={{ fontSize: "0.8rem", margin: "4px 0" }}>{p.name} <span style={{ color: "#7f8fb0" }}>· {p.due}</span></p>
              ))}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24 }}>Numbers, not vibes. <Link href="/worlds/orbit" style={{ textDecoration: "underline", color: "#6fc3ff" }}>Open the console →</Link></p>
      </div>
      <WorldProof
        proves="The business at a glance: every dollar and every stage, no dashboard login required."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}
export function OrbitRaw() {
  const [s] = useState(loadOrbit);
  const rows: string[] = [
    ...s.customers.map((c) => `${c.id} | CUSTOMER | ${c.name} | ${c.company} | ${c.plan} | ${c.spend} | ${c.health} | ${c.email}`),
    ...s.projects.map((p) => `${p.id} | PROJECT | ${p.name} | ${p.client} | ${p.stage} | ${p.due} | ${p.owner}`),
    ...s.activity.slice(0, 20).map((a) => `${a.id} | EVENT | ${a.who} ${a.what} | ${a.when}`),
  ];
  return (
    <div style={{ background: "#f4f4f0", color: "#111", minHeight: "100dvh", fontFamily: "monospace", fontSize: "0.8rem" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/RAW" />
      <OrbitNav current="brutalist" />
      <div style={{ padding: "16px" }}>
        <p style={{ margin: 0 }}>ORBIT DATABASE DUMP — {rows.length} ROWS — READ ONLY</p>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", border: "3px solid #111", padding: 16, marginTop: 12 }}>{rows.join("\n")}</pre>
        <p>Writes happen in the <Link href="/worlds/orbit" style={{ textDecoration: "underline", fontWeight: 700 }}>full console →</Link></p>
      </div>
    </div>
  );
}

export function OrbitPaper() {
  const [s] = useState(loadOrbit);
  const revenue = s.customers.reduce((n, c) => n + c.spend, 0);
  const stages = ["Discovery", "Design", "Build", "QA", "Live"];
  return (
    <div style={{ background: "#f6f3ec", color: "#1c1b19", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/PAPER" />
      <OrbitNav current="paper" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>ORBIT QUARTERLY · PRINTED FOR THE BOARD · FIGURES IN USD</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 4.6rem)", fontWeight: 400, margin: "8px 0" }}>The quarter on paper.</h1>
        <p style={{ fontStyle: "italic", color: "#6b6254", maxWidth: "52ch" }}>
          The same console you operate, set for reading. Revenue, accounts, pipeline and events — signed off, printed, filed.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 32 }}>
          <tbody>
            {[
              ["Revenue under management", `$${revenue.toLocaleString()}`],
              ["Accounts", String(s.customers.length)],
              ["At risk", String(s.customers.filter((c) => c.health === "Risk").length)],
              ["Projects in flight", String(s.projects.filter((p) => p.stage !== "Live").length)],
              ["Events logged", String(s.activity.length)],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: "1px solid #1c1b19" }}>
                <td style={{ padding: "12px 0" }}>{k}</td>
                <td style={{ padding: "12px 0", textAlign: "right", fontSize: "1.4rem" }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 400, marginTop: 40 }}>Accounts</h2>
        {s.customers.map((c) => (
          <p key={c.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted rgba(28,27,25,0.4)", padding: "8px 0", margin: 0 }}>
            <span>{c.company} <span style={{ color: "#6b6254" }}>· {c.plan} · {c.health}</span></span>
            <span>${c.spend.toLocaleString()}</span>
          </p>
        ))}
        <h2 style={{ fontSize: "1.6rem", fontWeight: 400, marginTop: 40 }}>Pipeline by stage</h2>
        {stages.map((st) => (
          <p key={st} style={{ borderBottom: "1px dotted rgba(28,27,25,0.4)", padding: "8px 0", margin: 0 }}>
            <strong>{st}</strong>
            <span style={{ color: "#6b6254" }}> — {s.projects.filter((p) => p.stage === st).map((p) => p.name).join("; ") || "nothing"}</span>
          </p>
        ))}
        <h2 style={{ fontSize: "1.6rem", fontWeight: 400, marginTop: 40 }}>Minutes</h2>
        {s.activity.slice(0, 6).map((a) => (
          <p key={a.id} style={{ fontSize: "0.95rem", margin: "6px 0" }}>
            <strong>{a.who}</strong> {a.what} <span style={{ color: "#6b6254" }}>· {a.when} ago</span>
          </p>
        ))}
        <p style={{ marginTop: 32, fontStyle: "italic" }}>
          Signed, the console. <Link href="/worlds/orbit" style={{ textDecoration: "underline" }}>Operate it live →</Link>
        </p>
      </div>
      <WorldProof
        proves="The board pack writes itself: same data as the console, set for reading aloud."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}

const SCENARIOS = [
  { id: "hold", label: "Hold", growth: 1, churn: 2, recover: true },
  { id: "grow", label: "Grow", growth: 5, churn: 1.5, recover: true },
  { id: "strain", label: "Strain", growth: 0.5, churn: 4, recover: false },
] as const;

export function OrbitFuture() {
  const s = useSnapshot();
  const base = s.customers.reduce((n, c) => n + c.spend, 0);
  const atRisk = s.customers.filter((c) => c.health === "Risk").reduce((n, c) => n + c.spend, 0);
  const [preset, setPreset] = useState<(typeof SCENARIOS)[number]>(SCENARIOS[0]);
  const [growth, setGrowth] = useState<number>(SCENARIOS[0].growth);
  const [churn, setChurn] = useState<number>(SCENARIOS[0].churn);
  const [recover, setRecover] = useState(true);
  const months = Array.from({ length: 12 }, (_, m) => {
    let rev = base;
    for (let i = 0; i <= m; i++) {
      rev = rev * (1 + growth / 100) - rev * (churn / 100) - (recover ? 0 : (atRisk / 12) * 0.5);
    }
    return Math.max(Math.round(rev), 0);
  });
  const max = Math.max(...months, base);
  const delta = months[11] - base;
  return (
    <div style={{ background: "#0a0e1c", color: "#dfe4ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/FUTURE" />
      <OrbitNav current="future" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#a78bfa", margin: 0 }}>12-MONTH MODEL · PROJECTION, NOT PROMISE</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 8vw, 5rem)", margin: "8px 0" }}>
          ${months[11].toLocaleString()} <span style={{ fontSize: "1.2rem", color: delta >= 0 ? "#7dff8a" : "#ff7d7d" }}>{delta >= 0 ? "+" : ""}{delta.toLocaleString()} vs today</span>
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#8a93b8", maxWidth: "62ch" }}>
          Assumes {growth}% new business and {churn}% churn monthly on today&apos;s ${(base).toLocaleString()} across {s.customers.length} accounts
          {recover ? ", with at-risk revenue recovering" : ", with at-risk revenue draining"}. Change the weather below; the maths re-runs.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }} role="group" aria-label="Scenarios">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              aria-pressed={preset.id === sc.id && growth === sc.growth && churn === sc.churn}
              onClick={() => { setPreset(sc); setGrowth(sc.growth); setChurn(sc.churn); setRecover(sc.recover); }}
              style={{ background: preset.id === sc.id ? "#a78bfa" : "transparent", color: preset.id === sc.id ? "#0a0e1c" : "#dfe4ff", border: "1px solid #a78bfa", padding: "10px 20px", fontSize: 12, letterSpacing: "0.15em", fontFamily: "inherit" }}
            >
              {sc.label.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gap: 16, marginTop: 24, maxWidth: 520 }}>
          <label style={{ display: "grid", gap: 8, fontSize: 12, letterSpacing: "0.15em" }}>
            NEW BUSINESS · {growth}% / MO
            <input type="range" min={0} max={10} step={0.5} value={growth} onChange={(e) => setGrowth(Number(e.target.value))} aria-label="Monthly new business percent" />
          </label>
          <label style={{ display: "grid", gap: 8, fontSize: 12, letterSpacing: "0.15em" }}>
            CHURN · {churn}% / MO
            <input type="range" min={0} max={8} step={0.5} value={churn} onChange={(e) => setChurn(Number(e.target.value))} aria-label="Monthly churn percent" />
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, letterSpacing: "0.15em" }}>
            <input type="checkbox" checked={recover} onChange={(e) => setRecover(e.target.checked)} aria-label="At-risk revenue recovers" />
            AT-RISK ${atRisk.toLocaleString()} RECOVERS
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 180, marginTop: 32, borderBottom: "1px solid rgba(223,228,255,0.25)", paddingBottom: 0 }} role="img" aria-label={`Projected revenue over 12 months, ending at $${months[11].toLocaleString()}`}>
          {months.map((v, i) => (
            <div key={i} title={`Month ${i + 1}: $${v.toLocaleString()}`} style={{ flex: 1, height: `${Math.max(Math.round((v / max) * 100), 3)}%`, background: i === 11 ? "#a78bfa" : "rgba(167,139,250,0.45)" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a93b8", marginTop: 8 }}>
          <span>NOW · ${base.toLocaleString()}</span><span>+12 MO · ${months[11].toLocaleString()}</span>
        </div>
        <p style={{ marginTop: 24 }}>The present, unmodeled: <Link href="/worlds/orbit/forecast" style={{ textDecoration: "underline", color: "#a78bfa" }}>the forecast →</Link></p>
      </div>
      <WorldProof
        proves="Planning as play: the same ledger, bent by your assumptions — every number traceable to today."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}

export function OrbitNav({ current }: { current: string }) {  return (
    <nav aria-label="ORBIT realities" style={{ display: "flex", gap: 2, alignItems: "stretch", background: "#0d1420", color: "#dfe8f2", borderBottom: "2px solid #6fc3ff", padding: "0 12px", overflowX: "auto", fontFamily: "var(--font-code)" }}>
      <Link href="/worlds/orbit" style={{ padding: "12px 8px", fontWeight: 800, letterSpacing: "0.15em", fontSize: 12 }}>
        ORBIT://
      </Link>
      {[
        ["classic", "Product", "/worlds/orbit"],
        ["console", "Console", "/worlds/orbit/console"],
        ["paper", "Paper", "/worlds/orbit/paper"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="orbit"
          label={label}
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: current === id ? "#0d1420" : "#dfe8f2",
            background: current === id ? "#6fc3ff" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </WorldNavLink>
      ))}
    </nav>
  );
}

export function OrbitRetro() {
  const s = useSnapshot();
  const today = new Date().toISOString().slice(0, 10);
  const rows = [
    ...s.customers.map((c) => `C ${c.name.toUpperCase()} ${c.company.toUpperCase()} ${c.plan.toUpperCase()} $${c.spend} ${c.health.toUpperCase()}`),
    ...s.projects.map((p) => `P ${p.name.toUpperCase()} ${p.client.toUpperCase()} ${p.stage.toUpperCase()} DUE ${p.due.toUpperCase()}`),
  ];
  return (
    <div style={{ background: "#f4f1e4", color: "#1c1b16", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/RETRO" />
      <OrbitNav current="retro" />
      <div style={{ display: "flex", maxWidth: 900, margin: "32px auto" }}>
        <div aria-hidden style={{ width: 36, flexShrink: 0, background: "radial-gradient(circle at 50% 8px, #1c1b16 4px, transparent 5px)", backgroundSize: "100% 24px", backgroundRepeat: "repeat-y", borderRight: "1px dashed #1c1b16" }} />
        <div style={{ flex: 1, background: "repeating-linear-gradient(#f4f1e4 0 22px, #dde8d2 22px 44px)", padding: "24px 28px", borderTop: "1px solid #1c1b16", borderBottom: "1px solid #1c1b16" }}>
          <p style={{ margin: 0 }}>ORBIT MANAGEMENT SUMMARY · PRINTED {today} · PAGE 1 OF 1</p>
          <p style={{ margin: "4px 0 0" }}>*** {rows.length} RECORDS ON FILE *** DO NOT FOLD, SPINDLE, OR MUTILATE ***</p>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "16px 0", fontSize: "0.85rem", lineHeight: "22px" }}>
            {rows.join("\n")}
          </pre>
          <p style={{ margin: 0 }}>*** END OF REPORT *** FEED PAPER TO TEAR ***</p>
          <p style={{ marginTop: 16 }}><Link href="/worlds/orbit" style={{ textDecoration: "underline" }}>BACK TO THE LIVE CONSOLE →</Link></p>
        </div>
        <div aria-hidden style={{ width: 36, flexShrink: 0, background: "radial-gradient(circle at 50% 8px, #1c1b16 4px, transparent 5px)", backgroundSize: "100% 24px", backgroundRepeat: "repeat-y", borderLeft: "1px dashed #1c1b16" }} />
      </div>
      <WorldProof
        proves="The same dataset, printed: fanfold honesty — if the numbers survive dot-matrix, they're modeled right."
        relatedHref="/worlds/orbit/paper"
        relatedName="PAPER"
      />
    </div>
  );
}

const HELP = "commands: customers [quiet|watch|risk] · projects [stage] · risk · search <q> · team · clear";

export function OrbitTerminal() {
  const s = useSnapshot();
  const [lines, setLines] = useState<string[]>(["ORBIT://TERMINAL — live data, typed. " + HELP]);
  const [value, setValue] = useState("");
  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    const [verb, ...rest] = cmd.toLowerCase().split(/\s+/);
    const q = rest.join(" ");
    let out: string[] = [];
    if (verb === "help") out = [HELP];
    else if (verb === "clear") { setLines([]); return; }
    else if (verb === "customers") {
      const list = q ? s.customers.filter((c) => c.health === q[0].toUpperCase() + q.slice(1)) : s.customers;
      out = list.length ? list.map((c) => `${c.name} · ${c.company} · ${c.plan} · $${c.spend.toLocaleString()} · ${c.health}`) : [`no customers with health "${q}"`];
    } else if (verb === "projects") {
      const list = q ? s.projects.filter((p) => p.stage.toLowerCase() === q) : s.projects;
      out = list.length ? list.map((p) => `${p.name} · ${p.client} · ${p.stage} · ${p.due}`) : [`no projects in stage "${q}"`];
    } else if (verb === "risk") {
      const list = s.customers.filter((c) => c.health === "Risk");
      out = list.length ? list.map((c) => `! ${c.name} · ${c.company} · $${c.spend.toLocaleString()} · ${c.last}`) : ["no accounts at risk. stand down."];
    } else if (verb === "search") {
      if (!q) out = ["usage: search <name, company, or project>"];
      else {
        const hit = [
          ...s.customers.filter((c) => `${c.name} ${c.company}`.toLowerCase().includes(q)).map((c) => `C ${c.name} · ${c.company} · ${c.health}`),
          ...s.projects.filter((p) => `${p.name} ${p.client}`.toLowerCase().includes(q)).map((p) => `P ${p.name} · ${p.client} · ${p.stage}`),
        ];
        out = hit.length ? hit : [`nothing matches "${q}"`];
      }
    } else if (verb === "team") {
      out = s.team.map((t) => `${t.name} · ${t.role} · ${t.status}`);
    } else out = [`unknown: "${verb}". ` + HELP];
    setLines((l) => [...l.slice(-60), `$ ${cmd}`, ...out]);
  }
  return (
    <div style={{ background: "#0a0d0a", color: "#c8f0c8", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="orbit" label="Room 03 · ORBIT/TERMINAL" />
      <OrbitNav current="terminal" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#5c705c" }}>{s.customers.length} ACCOUNTS · {s.projects.length} PROJECTS · LOCAL FIRST</p>
        <div role="log" aria-label="Terminal output" style={{ marginTop: 16, minHeight: 320, fontSize: "0.9rem", lineHeight: 1.7 }}>
          {lines.map((l, i) => (
            <p key={i} style={{ margin: 0, color: l.startsWith("$") ? "#7dff8a" : l.startsWith("!") ? "#ff7d7d" : "#c8f0c8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{l}</p>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); }} style={{ display: "flex", gap: 8, marginTop: 16, borderTop: "1px solid rgba(200,240,200,0.25)", paddingTop: 16 }}>
          <label htmlFor="orbit-term" style={{ color: "#7dff8a" }}>$</label>
          <input id="orbit-term" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck={false} placeholder="type help and press enter" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#c8f0c8", font: "inherit" }} />
        </form>
      </div>
      <WorldProof
        proves="Conversation as interface: the whole operations dataset, queryable by typing — same store, zero chrome."
        relatedHref="/worlds/orbit/console"
        relatedName="CONSOLE"
      />
    </div>
  );
}
