"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { vectorInsights, vectorQuarters } from "@/data/vector";

export function VectorLedger() {
  return (
    <div style={{ background: "#f3efe8", color: "#1a1712", minHeight: "100dvh", fontFamily: "Georgia, serif", backgroundImage: "repeating-linear-gradient(transparent 0 27px, rgba(26,23,18,0.08) 27px 28px)" }}>
      <WorldExit id="vector" label="Room 15 · VECTOR/LEDGER" />
      <RealityShell world="vector" current="ledger" basePath="/worlds/vector" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 12 }}>LEDGER · Q1 23 – Q2 26 · KEPT IN PENCIL</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.4rem)", fontWeight: 400, margin: "8px 0" }}>The book, kept by hand.</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #1a1712", fontSize: 12 }}>
              <th style={{ padding: "8px 4px" }}>QTR</th><th style={{ textAlign: "right" }}>INDEX</th><th>NOTE</th>
            </tr>
          </thead>
          <tbody>
            {vectorQuarters.map((q) => (
              <tr key={q.q} style={{ borderBottom: "1px dotted #1a171266" }}>
                <td style={{ padding: "8px 4px" }}>{q.q}</td>
                <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: 700 }}>{q.v}</td>
                <td style={{ padding: "8px 4px", fontStyle: "italic", fontSize: "0.9rem" }}>{q.event ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 12, fontSize: "0.9rem", fontStyle: "italic" }}>Illustrative figures, copied carefully. Not advice.</p>
        <div style={{ marginTop: 16 }}>
          {vectorInsights.map((a) => (
            <Link key={a.slug} href={`/worlds/vector/${a.slug}`} style={{ display: "block", padding: "10px 0", borderTop: "1px solid #1a171244" }}>
              <strong>{a.title}</strong> <span style={{ fontSize: "0.9rem" }}>— {a.dek}</span>
            </Link>
          ))}
        </div>
      </div>
      <WorldProof
        proves="Fourteen quarters, ruled lines, no hiding. The ledger version of trust."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}

export function VectorFiling() {
  return (
    <div style={{ background: "#e8e8e4", color: "#141414", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="vector" label="Room 15 · VECTOR/FILING" />
      <RealityShell world="vector" current="filing" basePath="/worlds/vector" />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ border: "3px solid #141414", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", margin: 0 }}>FORM VP-15 · REGULATORY FILING</p>
            <span style={{ border: "2px solid #8a1f2d", color: "#8a1f2d", padding: "4px 12px", fontWeight: 800, fontSize: 11, letterSpacing: "0.2em" }}>ILLUSTRATIVE — NOT ADVICE</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)", margin: "12px 0" }}>Vector Partners, on record.</h1>
          <div style={{ display: "grid", gap: 0, marginTop: 16 }}>
            {[
              ["1. Identity", "Vector Partners, fictional advisory. No clients, no assets, no license."],
              ["2. Figures", "All fourteen quarters fabricated for interface demonstration."],
              ["3. Drawdowns", "Shown, not smoothed. Q2 24 −3.4%, Q1 26 −2.0%."],
              ["4. Fees", "0.6% to a million, 0.4% after, nothing on cash. Hypothetically."],
              ["5. Action", "Book a call and a partner replies. That part is real."],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, padding: "12px 0", borderTop: "1px solid #141414" }}>
                <strong style={{ fontSize: "0.85rem" }}>{k}</strong>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/worlds/vector" style={{ background: "#141414", color: "#e8e8e4", padding: "12px 20px", fontSize: 12, letterSpacing: "0.15em" }}>VIEW TERMINAL →</Link>
          </div>
        </div>
        <p style={{ marginTop: 16, fontSize: "0.85rem" }}>Filed for demonstration. Stamped for emphasis.</p>
      </div>
    </div>
  );
}

export function VectorSurface() {
  return (
    <div style={{ background: "#e8eef2", color: "#101418", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="vector" label="Room 15 · VECTOR/SURFACE" />
      <RealityShell world="vector" current="surface" basePath="/worlds/vector" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#0f6fbf" }}>QUIET BRIEFING · COFFEE PROVIDED</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.4rem)", fontWeight: 400, letterSpacing: "-0.02em", margin: "8px 0" }}>Money, explained calmly.</h1>
        <p style={{ fontSize: "1.15rem", color: "#33414b", maxWidth: "52ch" }}>The same fourteen quarters and three essays, without the terminal glow. Some clients prefer daylight.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
          {[
            ["+58%", "since Q1 23"],
            ["2", "drawdowns shown"],
            ["0.6%", "top fee rate"],
          ].map(([v, l]) => (
            <div key={l} style={{ border: "1px solid #c3d2da", background: "#fff", padding: 16 }}>
              <div style={{ fontSize: "2rem", fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: "0.85rem", color: "#5f7280" }}>{l}</div>
            </div>
          ))}
        </div>
        {vectorInsights.map((a) => (
          <Link key={a.slug} href={`/worlds/vector/${a.slug}`} style={{ display: "block", padding: "16px 0", borderBottom: "1px solid #c3d2da" }}>
            <strong style={{ fontSize: "1.3rem", fontWeight: 400 }}>{a.title}</strong>
            <div style={{ color: "#5f7280" }}>{a.dek}</div>
          </Link>
        ))}
        <p style={{ marginTop: 16, fontSize: "0.9rem", color: "#5f7280" }}>Illustrative figures, daylight edition. Not advice. <Link href="/worlds/vector" style={{ textDecoration: "underline" }}>Terminal version →</Link></p>
      </div>
      <WorldProof
        proves="The same numbers in daylight. Trust survives a change of lighting — that was the test."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}
