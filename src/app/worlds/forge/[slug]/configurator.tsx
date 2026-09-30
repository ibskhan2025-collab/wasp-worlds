"use client";

import Link from "next/link";
import { useState } from "react";
import type { ForgeProduct } from "@/data/forge";

const FINISH_INK: Record<string, string> = {
  Zinc: "#5f7280",
  "Black oxide": "#161615",
  "Hot-dip": "#8a8f94",
  Steel: "#5f7280",
  Stainless: "#2e6bd8",
  "Powder grey": "#6d6f69",
  "Cast iron": "#3a3a38",
};

function Diagram({ dims, ink }: { dims: ForgeProduct["dims"]; ink: string }) {
  const w = Math.max(60, Math.min(220, dims.w));
  const h = Math.max(30, Math.min(140, dims.h));
  return (
    <svg viewBox="0 0 260 170" width="100%" height="220" role="img" aria-label="Dimensioned part diagram" style={{ background: "#f7f8f4", border: "1px solid var(--line)" }}>
      <rect x={130 - w / 2} y={85 - h / 2} width={w} height={h} fill="none" stroke="#161615" strokeWidth="2" />
      {dims.bore > 0 ? <circle cx="130" cy="85" r={Math.max(6, Math.min(24, dims.bore / 2))} fill="none" stroke={ink} strokeWidth="2" strokeDasharray="5 3" /> : null}
      <line x1={130 - w / 2} y1="150" x2={130 + w / 2} y2="150" stroke="#161615" strokeWidth="1" />
      <text x="130" y="163" textAnchor="middle" fontSize="11" fill="#161615">{dims.w} mm</text>
      <text x={130 - w / 2 - 8} y="89" textAnchor="end" fontSize="11" fill="#161615">{dims.h}</text>
      {dims.bore > 0 ? <text x="130" y={85 - h / 2 - 8} textAnchor="middle" fontSize="11" fill={ink}>Ø{dims.bore}</text> : null}
    </svg>
  );
}

export function ForgeConfigurator({ product: p }: { product: ForgeProduct }) {
  const [finish, setFinish] = useState(p.finishes[0]);
  const ink = FINISH_INK[finish] ?? "#b24a2e";
  return (
    <>
      <div className="grid-2" style={{ marginTop: 24 }}>
        <div>
          <Diagram dims={p.dims} ink={ink} />
          <p className="kicker" style={{ marginTop: 8 }}>Not to scale. The certs are. Shown in {finish}.</p>
        </div>
        <div>
          <img src={p.image} alt={p.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
        </div>
      </div>
      <p className="kicker" style={{ marginTop: 20 }}>Finish — redraws the drawing</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {p.finishes.map((f) => (
          <button key={f} type="button" className={finish === f ? "chip-on" : "chip"} aria-pressed={finish === f} onClick={() => setFinish(f)}>
            {f}
          </button>
        ))}
      </div>
      <table className="orbit-table" style={{ marginTop: 24 }}>
        <tbody>
          <tr><th>Rated load</th><td>{p.load} kN</td></tr>
          <tr><th>Tolerance</th><td>{p.tolerance}</td></tr>
          <tr><th>Finishes</th><td>{p.finishes.join(" · ")}</td></tr>
          <tr><th>Selected</th><td>{finish}</td></tr>
          <tr><th>Lead time</th><td>{p.lead}</td></tr>
        </tbody>
      </table>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
        <Link className="btn" href={`/worlds/forge/quote?add=${p.slug}`}>Add to quote →</Link>
      </div>
    </>
  );
}
