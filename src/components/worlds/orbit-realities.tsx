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
