"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { forgeProducts } from "@/data/forge";

export function ForgeBlueprint() {
  return (
    <div style={{ background: "#12305a", color: "#e8f1ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="forge" label="Room 11 · FORGE/BLUEPRINT" />
      <RealityShell world="forge" current="blueprint" basePath="/worlds/forge" />
      <svg width="100%" height="60" preserveAspectRatio="none" viewBox="0 0 400 60" aria-hidden style={{ display: "block", borderBottom: "1px solid rgba(232,241,255,0.3)" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="60" stroke="rgba(232,241,255,0.15)" strokeWidth="1" />
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 15} x2="400" y2={(i + 1) * 15} stroke="rgba(232,241,255,0.15)" strokeWidth="1" />
        ))}
      </svg>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fc3ff" }}>DWG-11 · REV C · SCALE — · SHEET 1/1</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)", margin: "8px 0", fontWeight: 400 }}>FORGE, DRAWN.</h1>
        {forgeProducts.map((p) => {
          const w = Math.max(60, Math.min(220, p.dims.w));
          const h = Math.max(30, Math.min(110, p.dims.h));
          return (
            <Link key={p.slug} href={`/worlds/forge/${p.slug}`} style={{ display: "grid", gridTemplateColumns: "200px 1fr auto", gap: 20, padding: "20px 0", borderBottom: "1px solid rgba(232,241,255,0.3)", alignItems: "center" }} className="grid-2">
              <svg viewBox="0 0 260 150" width="100%" role="img" aria-label={`Diagram of ${p.name}`}>
                <rect x={130 - w / 2} y={75 - h / 2} width={w} height={h} fill="none" stroke="#e8f1ff" strokeWidth="2" />
                {p.dims.bore > 0 ? <circle cx="130" cy="75" r={Math.max(6, Math.min(22, p.dims.bore / 2))} fill="none" stroke="#6fc3ff" strokeWidth="2" strokeDasharray="5 3" /> : null}
                <text x="130" y="142" textAnchor="middle" fontSize="11" fill="#6fc3ff">{p.dims.w}×{p.dims.h}{p.dims.bore ? ` Ø${p.dims.bore}` : ""}</text>
              </svg>
              <div>
                <strong style={{ fontSize: "1.4rem" }}>{p.name}</strong>
                <div style={{ color: "#8ba6c9", fontSize: "0.85rem" }}>{p.family} · {p.tolerance} · {p.lead}</div>
              </div>
              <span style={{ color: "#6fc3ff" }}>OPEN →</span>
            </Link>
          );
        })}
      </div>
      <WorldProof
        proves="The catalogue as a drawing set. Engineers read drawings faster than paragraphs — so the index is one."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}

export function ForgeDatasheet() {
  return (
    <div style={{ background: "#f4f4f0", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)", fontSize: "0.85rem" }}>
      <WorldExit id="forge" label="Room 11 · FORGE/DATASHEET" />
      <RealityShell world="forge" current="datasheet" basePath="/worlds/forge" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ border: "3px solid #111", padding: "16px 20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <strong>FORGE INDUSTRIES — CONDENSED DATASHEET</strong>
          <span>DOC FG-11-C · PRINT & FILE</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 0 }}>
          <thead>
            <tr style={{ textAlign: "left", border: "3px solid #111", background: "#111", color: "#f4f4f0" }}>
              <th style={{ padding: "10px 12px" }}>PART</th><th>FAM</th><th>LOAD</th><th>TOL</th><th>FINISHES</th><th>LEAD</th><th></th>
            </tr>
          </thead>
          <tbody>
            {forgeProducts.map((p) => (
              <tr key={p.slug} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "10px 12px", fontWeight: 700 }}>{p.name}</td>
                <td style={{ padding: "10px 12px" }}>{p.family}</td>
                <td style={{ padding: "10px 12px" }}>{p.load}kN</td>
                <td style={{ padding: "10px 12px" }}>{p.tolerance}</td>
                <td style={{ padding: "10px 12px" }}>{p.finishes.join(" / ")}</td>
                <td style={{ padding: "10px 12px" }}>{p.lead}</td>
                <td style={{ padding: "10px 12px" }}><Link href={`/worlds/forge/${p.slug}`} style={{ textDecoration: "underline", fontWeight: 700 }}>DWG→</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 16 }}>Five parts, one page, zero decoration. <Link href="/worlds/forge/quote" style={{ textDecoration: "underline", fontWeight: 700 }}>Request a quote →</Link></p>
      </div>
    </div>
  );
}
