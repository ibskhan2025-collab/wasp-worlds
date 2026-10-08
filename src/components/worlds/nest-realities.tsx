"use client";

import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { nestMaterials, nestRooms } from "@/data/nest";

export function NestNav({ current }: { current: string }) {
  return (
    <nav aria-label="NEST realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#101210", color: "#e8e0d2", borderBottom: "1px solid rgba(232,224,210,0.2)", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/nest" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800, fontFamily: "var(--font-code)" }}>
        NEST◌
      </Link>
      {[
        ["classic", "Plaster", "/worlds/nest"],
        ["blueprint", "Blueprint", "/worlds/nest/blueprint"],
        ["material", "Material", "/worlds/nest/material"],
        ["3d", "3D", "/worlds/nest/3d"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="nest"
          label={label}
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            fontFamily: "var(--font-code)",
            color: current === id ? "#101210" : "#e8e0d2",
            background: current === id ? "#c98a3d" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </WorldNavLink>
      ))}
    </nav>
  );
}

export function NestDrawing() {
  return (
    <div style={{ background: "#e8e4da", color: "#1c1a16", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="nest" label="Room 14 · NEST/DRAWING" />
      <NestNav current="drawing" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em" }}>TRACING PAPER · REV B · SCALE 1:50</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0", fontWeight: 400 }}>THE PLAN, INKED.</h1>
        <svg viewBox="0 0 400 300" width="100%" role="group" aria-label="Inked floorplan">
          <rect x="0" y="0" width="400" height="300" fill="none" strokeWidth="3" stroke="#1c1a16" />
          {nestRooms.map((r) => (
            <Link key={r.slug} href={`/worlds/nest/${r.slug}`} aria-label={r.name}>
              <g>
                <rect x={r.rect.x} y={r.rect.y} width={r.rect.w} height={r.rect.h} fill="none" strokeWidth="2" stroke="#1c1a16" strokeDasharray="8 3" />
                <text x={r.rect.x + 8} y={r.rect.y + 22} fontSize="13" fill="#1c1a16" fontWeight="bold">{r.name.toUpperCase()}</text>
                <text x={r.rect.x + 8} y={r.rect.y + 40} fontSize="10" fill="#1c1a16">{r.size} · {r.light}</text>
              </g>
            </Link>
          ))}
          <text x="310" y="290" fontSize="10" fill="#1c1a16">N ↑ · DO NOT SCALE DRAWING</text>
        </svg>
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.25em" }}>MATERIAL PALETTE (ANNOTATED)</p>
          {nestMaterials.map((m) => (
            <div key={m.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #1c1a1655", fontSize: "0.85rem" }}>
              <span style={{ display: "inline-block", width: 44, height: 20, border: "2px solid #1c1a16", background: m.hex, flex: "0 0 auto" }} />
              <span><strong>{m.name}</strong> — {m.note}</span>
            </div>
          ))}
        </div>
      </div>
      <WorldProof
        proves="The same rooms, drafted. Ink, dashes and annotations — the plan as document, not decoration."
        relatedHref="/worlds/atlas"
        relatedName="ATLAS"
      />
    </div>
  );
}

const READOUTS: Record<string, { temp: string; light: string; air: string }> = {
  "reading-corner": { temp: "21.4°C", light: "340 lux W", air: "still" },
  "oak-table": { temp: "22.8°C", light: "1200 lux S", air: "lively" },
  "linen-bedroom": { temp: "19.6°C", light: "890 lux E", air: "slow" },
  "maker-niche": { temp: "20.2°C", light: "640 lux N", air: "even" },
};

export function NestSimulated() {
  return (
    <div style={{ background: "#0e1418", color: "#cfe0da", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="nest" label="Room 14 · NEST/SIM" />
      <NestNav current="simulated" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#3ddc84" }}>LIVE SIM · SENSORS: 4/4 NOMINAL</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0" }}>HOUSE TELEMETRY</h1>
        {nestRooms.map((r) => {
          const ro = READOUTS[r.slug] ?? { temp: "—", light: "—", air: "—" };
          return (
            <div key={r.slug} style={{ border: "1px solid rgba(207,224,218,0.25)", padding: 18, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <Link href={`/worlds/nest/${r.slug}`} style={{ fontSize: "1.4rem", fontWeight: 700, color: "#cfe0da", textDecoration: "underline" }}>{r.name}</Link>
                <span style={{ color: "#3ddc84" }}>● LIVE</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12, fontSize: "0.85rem" }}>
                <div><div style={{ color: "#6f8a80", fontSize: 10 }}>TEMP</div>{ro.temp}</div>
                <div><div style={{ color: "#6f8a80", fontSize: 10 }}>LIGHT</div>{ro.light}</div>
                <div><div style={{ color: "#6f8a80", fontSize: 10 }}>AIR</div>{ro.air}</div>
              </div>
              <p style={{ color: "#6f8a80", fontSize: "0.85rem", margin: "8px 0 0" }}>{r.size} · Tallinn calibration, simulated feed.</p>
            </div>
          );
        })}
        <p style={{ marginTop: 16, fontSize: "0.8rem", color: "#6f8a80" }}>Readouts simulated for demonstration. The draught by the niche is real.</p>
      </div>
    </div>
  );
}

export function NestMockup() {
  return (
    <div style={{ background: "#d9c39a", color: "#3a2f22", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="nest" label="Room 14 · NEST/MOCKUP" />
      <NestNav current="mockup" />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>CARDBOARD STUDY 1:4 · TAPE, NOT GLUE</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.4rem)", margin: "8px 0" }}>The house, mocked up.</h1>
        {nestRooms.map((r, i) => (
          <div key={r.slug} style={{ background: "#e6d3ab", border: "2px solid #3a2f22", boxShadow: "8px 8px 0 #3a2f2233", padding: 20, marginTop: 20, transform: `rotate(${i % 2 ? 0.7 : -0.7}deg)` }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", margin: 0 }}>PIECE {String(i + 1).padStart(2, "0")} · {r.size} · {r.light.toUpperCase()}</p>
            <h2 style={{ fontSize: "1.7rem", margin: "6px 0" }}>
              <Link href={`/worlds/nest/${r.slug}`} style={{ textDecoration: "underline" }}>{r.name}</Link>
            </h2>
            <p style={{ fontSize: "0.95rem" }}>{r.desc}</p>
          </div>
        ))}
        <p style={{ marginTop: 20, fontSize: "0.85rem" }}>Held together with tape and intent. <Link href="/worlds/nest" style={{ textDecoration: "underline", fontWeight: 700 }}>See the real plan →</Link></p>
      </div>
    </div>
  );
}
