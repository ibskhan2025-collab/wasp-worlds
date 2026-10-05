"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useWasp } from "@/context/wasp-context";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";
import { ROOM_IMAGE } from "@/components/wasp/experience";
import { WorldNavLink } from "@/components/wasp/world-wipe";

const ACCENT: Record<string, string> = {
  casa: "#ff5a2e",
  noir: "#f4f1ea",
  orbit: "#6fc3ff",
  still: "#ececec",
  signal: "#6fc3ff",
  objects: "#e2c08d",
  archive: "#c9a86d",
  motion: "#e8b86d",
  void: "#3ddc84",
  atlas: "#c98a3d",
  forge: "#ffb020",
  pulse: "#9d5cff",
  civic: "#2e6bd8",
  nest: "#c98a3d",
  vector: "#6fc3ff",
};

const TAGS = [...new Set(WORLDS.flatMap((w) => w.tags))];

function technoPos(i: number) {
  const a = i * 2.39996;
  const r = Math.sqrt((i + 0.6) / 15.4);
  return { x: 50 + Math.cos(a) * r * 44, y: 50 + Math.sin(a) * r * 41 };
}

/**
 * TECHNO field: the 8151 landing field, detail for detail — phyllotaxis
 * positions, glowing accent dots, discipline web, mono cap pills, bottom
 * readout bar — driven by live WORLDS + REALITIES. Shown on the landing
 * while the techno feel is active.
 */
export function TechnoField() {
  const wasp = useWasp();
  const [hov, setHov] = useState<string | null>(null);
  const [sel, setSel] = useState<string[]>([]);
  const P = useMemo(() => WORLDS.map((_, i) => technoPos(i)), []);
  const links = useMemo(() => {
    const out: [number, number][] = [];
    WORLDS.forEach((a, i) =>
      WORLDS.forEach((b, j) => {
        if (j > i && a.tags.filter((t) => b.tags.includes(t)).length >= 2) out.push([i, j]);
      }),
    );
    return out;
  }, []);
  const hw = hov ? (WORLDS.find((w) => w.id === hov) ?? null) : null;
  const on = (id: string) => sel.length === 0 || sel.some((s) => WORLDS.find((w) => w.id === id)!.tags.includes(s));
  const litCount = WORLDS.filter((w) => on(w.id)).length;
  return (
    <section id="space" aria-label="Space: all fifteen worlds" style={{ borderBottom: "1px solid var(--line)", background: "#09090a", color: "#f4f4f5" }}>
      <div style={{ padding: "56px var(--pad) 0" }}>
        <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(244,244,245,0.5)", margin: 0 }}>The field</p>
        <h2 style={{ margin: "12px 0 0", fontSize: "clamp(2.2rem,6vw,5.5rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.02em" }}>Fifteen worlds, one sky.</h2>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 24 }} role="group" aria-label="Filter worlds by capability">
          {TAGS.map((d) => {
            const n = WORLDS.filter((w) => w.tags.includes(d)).length;
            const active = sel.includes(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => setSel(active ? sel.filter((x) => x !== d) : [...sel, d])}
                style={{ borderRadius: 999, border: `1px solid ${active ? "#ffd23f" : "rgba(255,255,255,0.25)"}`, background: active ? "#ffd23f" : "transparent", color: active ? "#000" : "rgba(255,255,255,0.7)", padding: "8px 16px", fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                {d} <span style={{ opacity: 0.6 }}>{n}</span>
              </button>
            );
          })}
          {sel.length > 0 ? (
            <button type="button" onClick={() => setSel([])} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", textDecoration: "underline", fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Clear
            </button>
          ) : null}
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", height: "72vh", minHeight: 520, overflow: "hidden" }} role="group" aria-label="Field of 15 worlds">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {links.map(([i, j]) => {
            const act = on(WORLDS[i].id) && on(WORLDS[j].id);
            const hl = hw !== null && (hw.id === WORLDS[i].id || hw.id === WORLDS[j].id);
            return <line key={`${i}-${j}`} x1={P[i].x} y1={P[i].y} x2={P[j].x} y2={P[j].y} stroke={hl ? "#ffd23f" : "#fff"} strokeOpacity={hl ? 0.8 : act ? 0.13 : 0.03} strokeWidth={0.15} vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
        {WORLDS.map((w, i) => (
          <WorldNavLink
            world={w.id}
            label={w.name}
            key={w.id}
            href={w.href}
            onMouseEnter={() => setHov(w.id)}
            onMouseLeave={() => setHov(null)}
            onFocus={() => setHov(w.id)}
            onBlur={() => setHov(null)}
            aria-label={`World ${w.room}: ${w.name}. ${w.line}`}
            style={{ position: "absolute", zIndex: 10, whiteSpace: "nowrap", left: `${P[i].x}%`, top: `${P[i].y}%`, opacity: on(w.id) ? 1 : 0.12, animation: `wasp-float ${5 + (i % 5)}s ease-in-out ${i * 0.3}s infinite`, transform: "translate(-50%,-50%)", transition: "opacity 500ms" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span aria-hidden style={{ width: 10, height: 10, borderRadius: "50%", background: ACCENT[w.id], boxShadow: `0 0 18px ${ACCENT[w.id]}`, transform: hov === w.id ? "scale(2.2)" : "scale(1)", transition: "transform 200ms" }} />
              <span style={{ fontFamily: "var(--font-code)", fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{w.room}</span>
              <span style={{ fontSize: "clamp(1rem,3.2vw,2.6rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", color: hov === w.id ? ACCENT[w.id] : "#fff", transition: "color 200ms" }}>{w.name}</span>
            </span>
          </WorldNavLink>
        ))}
        <div aria-live="polite" style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 20, borderTop: "1px solid rgba(255,255,255,0.1)", background: "linear-gradient(transparent, rgba(0,0,0,0.85))", padding: "16px var(--pad)" }}>
          {hw ? (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "4px 24px" }}>
              <p style={{ fontSize: "1.9rem", fontWeight: 900, margin: 0, color: ACCENT[hw.id] }}>{hw.name}</p>
              <p style={{ maxWidth: 480, margin: 0, fontSize: "0.95rem", color: "rgba(255,255,255,0.8)" }}>{hw.line}</p>
              <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                {(REALITIES[hw.id] ?? []).length} realities · {hw.tags.join(" / ")} · <WorldNavLink world={hw.id} label={hw.name} href={hw.href} style={{ textDecoration: "underline", color: "#ffd23f" }}>Enter →</WorldNavLink>
              </p>
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              {litCount} of 15 worlds lit · hover, focus or tap a world · lines connect worlds that share disciplines
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// Hand-placed, and opinionated: x = how loud the world is, y = how much of a working product it is.
const PAPER_POS: Record<string, [number, number]> = {
  casa: [0.45, 0.8], noir: [0.3, 0.66], orbit: [0.18, 0.95], still: [0.05, 0.48], signal: [0.95, 0.32],
  objects: [0.72, 0.86], archive: [0.1, 0.72], motion: [0.74, 0.18], void: [0.58, 0.05], atlas: [0.42, 0.9],
  forge: [0.34, 0.97], pulse: [0.9, 0.6], civic: [0.02, 0.99], nest: [0.24, 0.58], vector: [0.28, 0.4],
};

/**
 * PAPER map: the 8154 worlds map, detail for detail — loud/useful scatter,
 * photo bubbles that open under the cursor, dashed fan-out to kin, visited
 * ticks, capability pills, map/index toggle — driven by live WORLDS,
 * REALITIES and visits. Shown on the landing while the paper feel is on.
 */
export function PaperMap() {
  const wasp = useWasp();
  const [view, setView] = useState<"map" | "index">("map");
  const [h, setH] = useState<string | null>(null);
  const [cap, setCap] = useState<string | null>(null);
  const hw = h ? (WORLDS.find((w) => w.id === h) ?? null) : null;
  const links = useMemo(() => {
    if (!hw) return [];
    return WORLDS.filter((o) => o.id !== hw.id)
      .map((o) => ({ o, n: o.tags.filter((t) => hw.tags.includes(t)).length }))
      .filter((x) => x.n >= 2);
  }, [hw]);
  const lit = (id: string) => !cap || WORLDS.find((w) => w.id === id)!.tags.includes(cap);
  return (
    <section id="space" aria-label="Space: all fifteen worlds" style={{ background: "#efece4", color: "#141412", borderBottom: "1px solid #141412", padding: "64px 0 96px" }}>
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div>
            <p style={{ fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#57544c", margin: 0 }}>Worlds · self-initiated · fictional brands · working code</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 0.92, fontSize: "clamp(3.5rem,9vw,8rem)", margin: "8px 0 0" }}>The worlds.</h2>
          </div>
          <div style={{ display: "flex", border: "1px solid #141412" }} role="radiogroup" aria-label="View">
            {(["map", "index"] as const).map((v) => (
              <button key={v} type="button" role="radio" aria-checked={view === v} onClick={() => setView(v)} style={{ background: view === v ? "#141412" : "transparent", color: view === v ? "#efece4" : "#141412", border: "none", padding: "8px 16px", fontFamily: "var(--font-code)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 24 }} role="group" aria-label="Filter by capability">
          <span style={{ fontFamily: "var(--font-code)", fontSize: 11, textTransform: "uppercase", color: "#57544c" }}>Proves:</span>
          <button type="button" onClick={() => setCap(null)} aria-pressed={!cap} style={{ border: "1px solid #141412", background: !cap ? "#141412" : "transparent", color: !cap ? "#efece4" : "#141412", padding: "4px 8px", fontSize: "0.9rem" }}>Everything</button>
          {TAGS.map((t) => (
            <button key={t} type="button" onClick={() => setCap(cap === t ? null : t)} aria-pressed={cap === t} style={{ border: "1px solid #141412", background: cap === t ? "#141412" : "transparent", color: cap === t ? "#efece4" : "#141412", padding: "4px 8px", fontSize: "0.9rem", opacity: cap && cap !== t ? 0.45 : 1 }}>
              {t}
            </button>
          ))}
        </div>
        {cap ? <p style={{ marginTop: 12, fontSize: "1.1rem" }}>{WORLDS.filter((w) => w.tags.includes(cap)).length} worlds prove {cap}.</p> : null}

        {view === "map" ? (
          <div style={{ position: "relative", marginTop: 32, width: "100%", aspectRatio: "16/10", border: "1px solid #141412", background: "#e6e2d7" }} onPointerLeave={() => setH(null)}>
            <span style={{ position: "absolute", bottom: 8, left: 12, fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c" }}>← quiet</span>
            <span style={{ position: "absolute", bottom: 8, right: 12, fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c" }}>loud →</span>
            <span style={{ position: "absolute", left: 8, top: 12, fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>product ↑</span>
            <span style={{ position: "absolute", left: 8, bottom: 40, fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>↓ experiment</span>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <line x1="50" y1="0" x2="50" y2="100" stroke="#141412" strokeOpacity={0.08} vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#141412" strokeOpacity={0.08} vectorEffect="non-scaling-stroke" />
              {hw && links.map(({ o, n }) => {
                const a = PAPER_POS[hw.id];
                const b = PAPER_POS[o.id];
                return <line key={o.id} x1={6 + a[0] * 88} y1={6 + (1 - a[1]) * 88} x2={6 + b[0] * 88} y2={6 + (1 - b[1]) * 88} stroke="#141412" strokeWidth={n} strokeOpacity={0.35} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />;
              })}
            </svg>
            {WORLDS.map((w) => {
              const [x, y] = PAPER_POS[w.id];
              const isOn = lit(w.id);
              const near = hw !== null && (hw.id === w.id || links.some((l) => l.o.id === w.id));
              const big = h === w.id;
              return (
                <WorldNavLink
                  world={w.id}
                  label={w.name}
                  key={w.id}
                  href={w.href}
                  onPointerEnter={() => setH(w.id)}
                  onFocus={() => setH(w.id)}
                  aria-label={`Room ${w.room}: ${w.name}. ${w.line}`}
                  style={{ position: "absolute", left: `${6 + x * 88}%`, top: `${6 + (1 - y) * 88}%`, transform: "translate(-50%,-50%)", opacity: isOn ? (hw && !near ? 0.35 : 1) : 0.12, zIndex: big ? 10 : 1, transition: "opacity 500ms" }}
                >
                  <span style={{ display: "block", overflow: "hidden", borderRadius: "50%", border: "2px solid #141412", width: big ? 128 : 56, height: big ? 128 : 56, transition: "width 500ms, height 500ms" }}>
                    <img src={ROOM_IMAGE[w.id]} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </span>
                  <span style={{ position: "absolute", left: "50%", top: "100%", transform: "translateX(-50%)", marginTop: 4, whiteSpace: "nowrap", fontFamily: "var(--font-code)", fontSize: 11, textTransform: "uppercase", background: "#efece4", padding: "0 4px" }}>
                    {w.name}{wasp.visited.includes(w.id) ? " ✓" : ""}
                  </span>
                </WorldNavLink>
              );
            })}
            {hw ? (
              <div style={{ position: "absolute", right: 12, top: 12, maxWidth: 300, border: "1px solid #141412", background: "#efece4", padding: 12, fontSize: "0.9rem", boxShadow: "3px 3px 0 #141412", pointerEvents: "none" }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{hw.name} · {hw.kind}</p>
                <p style={{ margin: "4px 0 0" }}>{hw.line}</p>
                <p style={{ fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c", margin: "8px 0 0" }}>{hw.tags.join(" · ")}</p>
                {links.length > 0 ? <p style={{ fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c", margin: "4px 0 0" }}>dashed lines = shares 2+ capabilities</p> : null}
              </div>
            ) : null}
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: "32px 0 0", padding: 0, display: "grid", gap: 1, background: "#141412", border: "1px solid #141412", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {WORLDS.filter((w) => lit(w.id)).map((w) => (
              <li key={w.id} style={{ background: "#efece4" }}>
                <WorldNavLink world={w.id} label={w.name} href={w.href} style={{ display: "block", padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c" }}>
                    <span>ROOM {w.room}</span><span>{w.kind}{wasp.visited.includes(w.id) ? " · visited" : ""}</span>
                  </div>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "3rem", margin: "24px 0 0", lineHeight: 1 }}>{w.name}</p>
                  <p style={{ margin: "8px 0 0", color: "#3a3833" }}>{w.line}</p>
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", marginTop: 16 }}>
                    <img src={ROOM_IMAGE[w.id]} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-code)", fontSize: 11, color: "#57544c", margin: "12px 0 0" }}>{(REALITIES[w.id] ?? []).length} realities · Enter →</p>
                </WorldNavLink>
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: 24, maxWidth: 640, color: "#57544c" }}>Every world here is a fictional brand, built as a working product: real forms, real state, real 3D where it helps. Real client work lives separately, on <Link href="/work" style={{ textDecoration: "underline" }}>Work</Link>.</p>
      </div>
    </section>
  );
}
