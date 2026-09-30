"use client";

import Link from "next/link";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
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
      <RealityShell world="orbit" current="console" basePath="/worlds/orbit" />
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
      <RealityShell world="orbit" current="compact" basePath="/worlds/orbit" />
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
      <RealityShell world="orbit" current="standup" basePath="/worlds/orbit" />
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
      <RealityShell world="orbit" current="forecast" basePath="/worlds/orbit" />
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
      <RealityShell world="orbit" current="brutalist" basePath="/worlds/orbit" />
      <div style={{ padding: "16px" }}>
        <p style={{ margin: 0 }}>ORBIT DATABASE DUMP — {rows.length} ROWS — READ ONLY</p>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", border: "3px solid #111", padding: 16, marginTop: 12 }}>{rows.join("\n")}</pre>
        <p>Writes happen in the <Link href="/worlds/orbit" style={{ textDecoration: "underline", fontWeight: 700 }}>full console →</Link></p>
      </div>
    </div>
  );
}
