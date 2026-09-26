"use client";

import { useState } from "react";
import { vectorQuarters } from "@/data/vector";

export function PerfChart() {
  const [labels, setLabels] = useState(true);
  const w = 640;
  const h = 220;
  const vals = vectorQuarters.map((d) => d.v);
  const min = Math.min(...vals) - 4;
  const max = Math.max(...vals) + 4;
  const x = (i: number) => 30 + (i / (vals.length - 1)) * (w - 40);
  const y = (v: number) => h - 24 - ((v - min) / (max - min)) * (h - 48);
  const pts = vals.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const last = vals[vals.length - 1];
  const first = vals[0];
  const gain = (((last - first) / first) * 100).toFixed(1);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <strong style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>+{gain}% <span className="kicker">since Q1 23</span></strong>
        <button type="button" className={labels ? "chip-on" : "chip"} aria-pressed={labels} onClick={() => setLabels((v) => !v)}>
          {labels ? "Labels on" : "Labels off"}
        </button>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label={`Performance chart, up ${gain} percent since Q1 23`}>
        <polyline fill="none" stroke="#3ddc84" strokeWidth="2.5" points={pts} />
        {vectorQuarters.map((d, i) =>
          d.event && labels ? (
            <g key={d.q}>
              <circle cx={x(i)} cy={y(d.v)} r="4" fill="#e23a3a" />
              <text x={x(i)} y={y(d.v) - 10} textAnchor="middle" fontSize="10" fill="#e8e4dc">{d.event}</text>
            </g>
          ) : (
            <circle key={d.q} cx={x(i)} cy={y(d.v)} r="2.5" fill="#3ddc84" />
          ),
        )}
        <text x={x(0)} y={h - 8} fontSize="10" fill="#e8e4dc88">Q1 23</text>
        <text x={x(vals.length - 1)} y={h - 8} fontSize="10" fill="#e8e4dc88" textAnchor="end">Q2 26</text>
      </svg>
      <p className="kicker">Illustrative composite. Not advice, not a promise.</p>
    </div>
  );
}
