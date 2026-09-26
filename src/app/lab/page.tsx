"use client";

import { useEffect, useState } from "react";
import { loadJson, saveJson, WORKSHOP_KEY } from "@/lib/storage";

type W = {
  serif: boolean;
  scale: number;
  tracking: number;
  space: number;
  cols: number;
  radius: number;
  motion: number;
  gray: boolean;
  btn: "solid" | "line" | "text";
  nav: "top" | "side" | "none";
};

const fallback: W = { serif: true, scale: 1, tracking: -0.04, space: 1, cols: 2, radius: 0, motion: 400, gray: true, btn: "line", nav: "top" };

export default function LabPage() {
  const [w, setW] = useState<W>(fallback);
  useEffect(() => {
    setW(loadJson(WORKSHOP_KEY, fallback));
  }, []);
  useEffect(() => {
    saveJson(WORKSHOP_KEY, w);
  }, [w]);

  return (
    <div className="studio-page">
      <p className="kicker">Lab · workshop</p>
      <h1 className="display">Change one decision. Watch the room change.</h1>
      <div className="workshop-grid" style={{ marginTop: 28 }}>
        <aside className="panel">
          <label className="field"><span>Serif display</span>
            <input type="checkbox" checked={w.serif} onChange={(e) => setW({ ...w, serif: e.target.checked })} />
          </label>
          <label className="field"><span>Type scale {w.scale.toFixed(2)}</span>
            <input type="range" min={0.7} max={1.4} step={0.02} value={w.scale} onChange={(e) => setW({ ...w, scale: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Tracking {w.tracking}</span>
            <input type="range" min={-0.08} max={0.12} step={0.01} value={w.tracking} onChange={(e) => setW({ ...w, tracking: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Spacing {w.space.toFixed(2)}</span>
            <input type="range" min={0.6} max={1.6} step={0.05} value={w.space} onChange={(e) => setW({ ...w, space: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Grid {w.cols}</span>
            <input type="range" min={1} max={4} value={w.cols} onChange={(e) => setW({ ...w, cols: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Radius {w.radius}</span>
            <input type="range" min={0} max={28} value={w.radius} onChange={(e) => setW({ ...w, radius: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Motion {w.motion}ms</span>
            <input type="range" min={0} max={900} step={20} value={w.motion} onChange={(e) => setW({ ...w, motion: Number(e.target.value) })} />
          </label>
          <label className="field"><span>Image grayscale</span>
            <input type="checkbox" checked={w.gray} onChange={(e) => setW({ ...w, gray: e.target.checked })} />
          </label>
          <label className="field"><span>Button</span>
            <select value={w.btn} onChange={(e) => setW({ ...w, btn: e.target.value as W["btn"] })}>
              <option value="solid">Solid</option>
              <option value="line">Line</option>
              <option value="text">Text</option>
            </select>
          </label>
          <label className="field"><span>Navigation</span>
            <select value={w.nav} onChange={(e) => setW({ ...w, nav: e.target.value as W["nav"] })}>
              <option value="top">Top</option>
              <option value="side">Side</option>
              <option value="none">Almost none</option>
            </select>
          </label>
        </aside>
        <div
          className="preview-site"
          style={{
            padding: 24 * w.space,
            fontFamily: w.serif ? "var(--font-serif)" : "var(--font-sans)",
            transition: `all ${w.motion}ms ease`,
            display: w.nav === "side" ? "grid" : "block",
            gridTemplateColumns: w.nav === "side" ? "140px 1fr" : undefined,
          }}
        >
          {w.nav !== "none" ? (
            <div style={{ display: "flex", flexDirection: w.nav === "side" ? "column" : "row", gap: 12, marginBottom: 16, letterSpacing: "0.16em", fontSize: 11, textTransform: "uppercase" }}>
              <span>House</span><span>Work</span><span>Index</span>
            </div>
          ) : (
            <div className="kicker">A mark, nothing else</div>
          )}
          <div>
            <h2 style={{ fontSize: `${3.2 * w.scale}rem`, letterSpacing: `${w.tracking}em`, lineHeight: 0.9, margin: 0 }}>
              The room after the decision.
            </h2>
            <p style={{ maxWidth: "36ch", marginTop: 16 * w.space }}>
              Hierarchy is not a style. It is what you chose to make large.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${w.cols}, 1fr)`, gap: 12 * w.space, marginTop: 20 }}>
              {[1, 2, 3, 4].slice(0, Math.max(w.cols, 2)).map((n) => (
                <div key={n} style={{ border: "1px solid var(--line)", borderRadius: w.radius, overflow: "hidden" }}>
                  <div style={{ height: 80, background: "#222", filter: w.gray ? "grayscale(1)" : "none" }} />
                  <div style={{ padding: 10 }}>Object {n}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              style={{
                marginTop: 20,
                border: w.btn === "text" ? "0" : "1px solid var(--fg)",
                background: w.btn === "solid" ? "var(--fg)" : "transparent",
                color: w.btn === "solid" ? "var(--bg)" : "var(--fg)",
                padding: w.btn === "text" ? 0 : "10px 16px",
                borderRadius: w.radius,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontSize: 11,
              }}
            >
              A button with a job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
