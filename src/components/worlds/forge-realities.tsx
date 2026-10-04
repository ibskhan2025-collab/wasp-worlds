"use client";

import Link from "next/link";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { forgeProducts } from "@/data/forge";

export function ForgeNav({ current }: { current: string }) {
  return (
    <nav aria-label="FORGE realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#14161a", color: "#e8eaee", borderBottom: "1px solid rgba(232,234,238,0.3)", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/forge" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800, fontFamily: "var(--font-code)" }}>
        FORGE◌
      </Link>
      {[
        ["classic", "Ops", "/worlds/forge"],
        ["blueprint", "Blueprint", "/worlds/forge/blueprint"],
        ["datasheet", "Datasheet", "/worlds/forge/datasheet"],
        ["viewer", "Viewer", "/worlds/forge/viewer"],
        ["analog", "Microfiche", "/worlds/forge/analog"],
        ["floor", "Floor", "/worlds/forge/floor"],
        ["compare", "Compare", "/worlds/forge/compare"],
        ["catalogue", "Catalogue", "/worlds/forge/catalogue"],
        ["inspect", "Inspect", "/worlds/forge/inspect"],
      ].map(([id, label, href]) => (
        <Link
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            fontFamily: "var(--font-code)",
            color: current === id ? "#14161a" : "#e8eaee",
            background: current === id ? "#ffb020" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Link>
      ))}
      <Link href="/worlds/forge/quote" style={{ marginLeft: "auto", padding: "12px 8px", fontSize: 12, whiteSpace: "nowrap" }}>
        Quote →
      </Link>
    </nav>
  );
}

export function ForgeBlueprint() {
  return (
    <div style={{ background: "#12305a", color: "#e8f1ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="forge" label="Room 11 · FORGE/BLUEPRINT" />
      <ForgeNav current="blueprint" />
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
      <ForgeNav current="datasheet" />
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

export function ForgeAnalog() {
  return (
    <div style={{ background: "#d8cfb8", color: "#2a241c", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="forge" label="Room 11 · FORGE/MICROFICHE" />
      <ForgeNav current="analog" />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>MICROFICHE · DRAWER 11 · DO NOT REMOVE</p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)", margin: "8px 0", fontWeight: 400 }}>Parts, on film.</h1>
        <p style={{ fontSize: "0.9rem" }}>Scanned 1987, digitized reluctantly. Dimensions verified against the bench copy.</p>
        {forgeProducts.map((p, i) => (
          <article key={p.slug} style={{ border: "2px solid #2a241c", marginTop: 20, padding: 18, background: "#e2d8bd", transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}>
            <p style={{ margin: 0, fontSize: 11 }}>FRAME {String(i + 1).padStart(3, "0")} · {p.family.toUpperCase()} · LEAD {p.lead.toUpperCase()}</p>
            <h2 style={{ fontSize: "1.6rem", margin: "6px 0" }}>
              <Link href={`/worlds/forge/${p.slug}`} style={{ textDecoration: "underline" }}>{p.name}</Link>
            </h2>
            <p style={{ fontSize: "0.9rem" }}>{p.desc}</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>LOAD {p.load}kN · TOL {p.tolerance} · {p.finishes.join(" / ")}</p>
          </article>
        ))}
        <p style={{ marginTop: 20, fontSize: "0.85rem" }}>For current stock, <Link href="/worlds/forge" style={{ textDecoration: "underline" }}>see the ops floor →</Link></p>
      </div>
      <WorldProof
        proves="Forty years of parts on forty-year-old film. Specs outlive their medium — good data survives any rendering."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}

export function ForgeFloor() {
  const fams = [...new Set(forgeProducts.map((p) => p.family))];
  return (
    <div style={{ background: "#14161a", color: "#e8eaee", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="forge" label="Room 11 · FORGE/FLOOR" />
      <ForgeNav current="floor" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#ffb020" }}>SHIFT B · THREE CELLS · FLOOR IS AUDIBLE</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>Floor.</h1>
        <p style={{ color: "#9aa0ac", maxWidth: "56ch" }}>The catalogue as work orders. Every part on a cell, every cell with a lead time — the factory you buy from, mid-shift.</p>
        {fams.map((fam) => (
          <section key={fam} style={{ marginTop: 32 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#ffb020" }}>CELL · {fam.toUpperCase()}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {forgeProducts.filter((p) => p.family === fam).map((p) => (
                <div key={p.slug} style={{ border: "1px solid rgba(232,234,238,0.3)", borderLeft: "6px solid #ffb020", padding: 16, background: "#1b1e24" }}>
                  <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#ffb020", margin: 0 }}>WO · LEAD {p.lead.toUpperCase()}</p>
                  <h2 style={{ fontSize: "1.3rem", margin: "8px 0" }}>
                    <Link href={`/worlds/forge/${p.slug}`} style={{ textDecoration: "underline" }}>{p.name}</Link>
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "#9aa0ac", margin: 0 }}>{p.desc}</p>
                  <p style={{ fontSize: "0.8rem", margin: "8px 0 0" }}>{p.load}kN · {p.tolerance} · {p.finishes.join(" / ")}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
        <p style={{ marginTop: 28 }}>Floor walk over. <Link href="/worlds/forge/quote" style={{ textDecoration: "underline", color: "#ffb020" }}>Request a quote →</Link></p>
      </div>
      <WorldProof
        proves="Manufacturing you can hear: work orders, cells, lead times — B2B without the brochure."
        relatedHref="/worlds/orbit"
        relatedName="ORBIT"
      />
    </div>
  );
}

export function ForgeCompare() {
  const [a, setA] = useState(forgeProducts[0].slug);
  const [b, setB] = useState(forgeProducts[1].slug);
  const pa = forgeProducts.find((p) => p.slug === a) ?? forgeProducts[0];
  const pb = forgeProducts.find((p) => p.slug === b) ?? forgeProducts[1];
  const rows: [string, string, string][] = [
    ["Family", pa.family, pb.family],
    ["Rated load", `${pa.load} kN`, `${pb.load} kN`],
    ["Tolerance", pa.tolerance, pb.tolerance],
    ["Finishes", pa.finishes.join(", "), pb.finishes.join(", ")],
    ["Lead time", pa.lead, pb.lead],
    ["Dims W×H", `${pa.dims.w}×${pa.dims.h}`, `${pb.dims.w}×${pb.dims.h}`],
  ];
  return (
    <div style={{ background: "#f4f4f0", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="forge" label="Room 11 · FORGE/COMPARE" />
      <ForgeNav current="compare" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>HEAD TO HEAD · NO SALES REP REQUIRED</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>Compare.</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
          {[{ v: a, set: setA, label: "PART A" }, { v: b, set: setB, label: "PART B" }].map((s) => (
            <label key={s.label} style={{ display: "block", fontSize: 11, letterSpacing: "0.2em" }}>
              {s.label}
              <select value={s.v} onChange={(e) => s.set(e.target.value)} style={{ display: "block", width: "100%", marginTop: 6, padding: 10, fontSize: "0.95rem", border: "2px solid #111", background: "#fff" }}>
                {forgeProducts.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 11, letterSpacing: "0.2em", borderBottom: "3px solid #111" }}>
              <th style={{ padding: "10px 8px" }}>SPEC</th>
              <th style={{ padding: "10px 8px" }}><Link href={`/worlds/forge/${pa.slug}`} style={{ textDecoration: "underline" }}>{pa.name.toUpperCase()}</Link></th>
              <th style={{ padding: "10px 8px" }}><Link href={`/worlds/forge/${pb.slug}`} style={{ textDecoration: "underline" }}>{pb.name.toUpperCase()}</Link></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, va, vb]) => (
              <tr key={k} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 8px", fontWeight: 700 }}>{k}</td>
                <td style={{ padding: "12px 8px", background: va === vb ? "transparent" : "rgba(178,74,46,0.12)", fontWeight: va === vb ? 400 : 700 }}>{va}</td>
                <td style={{ padding: "12px 8px", background: va === vb ? "transparent" : "rgba(178,74,46,0.12)", fontWeight: va === vb ? 400 : 700 }}>{vb}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 16, fontSize: "0.9rem" }}>Differences highlighted. Winner picked by the numbers, not the rep. <Link href="/worlds/forge/quote" style={{ textDecoration: "underline", fontWeight: 700 }}>Request a quote →</Link></p>
      </div>
      <WorldProof
        proves="Decisions, accelerated: side-by-side specs with differences lit — the fastest page in B2B."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}

export function ForgeCatalogue() {
  const fams = [...new Set(forgeProducts.map((p) => p.family))];
  return (
    <div style={{ background: "#f4f4f0", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)", paddingBottom: 80 }}>
      <WorldExit id="forge" label="Room 11 · FORGE/CATALOGUE" />
      <ForgeNav current="catalogue" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>GENERAL CATALOGUE · {forgeProducts.length} PARTS · ALL FAMILIES</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>Catalogue.</h1>
        {fams.map((fam) => (
          <section key={fam} style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 12, letterSpacing: "0.3em", borderBottom: "3px solid #111", paddingBottom: 8 }}>{fam.toUpperCase()}</h2>
            {forgeProducts
              .filter((p) => p.family === fam)
              .map((p) => (
                <div key={p.slug} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "14px 0", borderBottom: "1px solid #111", alignItems: "baseline" }}>
                  <span>
                    <Link href={`/worlds/forge/${p.slug}`} style={{ fontSize: "1.3rem", fontWeight: 700, textDecoration: "underline" }}>{p.name}</Link>
                    <br />
                    <span style={{ fontSize: "0.85rem", color: "#555" }}>
                      {p.load}kN · {p.tolerance} · {p.finishes.join(" / ")} · {p.lead}
                    </span>
                  </span>
                  <Link href={`/worlds/forge/${p.slug}`} style={{ border: "2px solid #111", padding: "8px 16px", fontSize: 12, fontWeight: 700 }}>
                    DWG →
                  </Link>
                </div>
              ))}
          </section>
        ))}
        <p style={{ marginTop: 28 }}>
          Found it? <Link href="/worlds/forge/quote" style={{ textDecoration: "underline", fontWeight: 700 }}>Request a quote →</Link>
        </p>
      </div>
      <WorldProof
        proves="The index before the drawings: every part findable in one scroll."
        relatedHref="/worlds/orbit"
        relatedName="ORBIT"
      />
    </div>
  );
}

export function ForgeInspect() {
  const [slug, setSlug] = useState(forgeProducts[0].slug);
  const [finish, setFinish] = useState(0);
  const p = forgeProducts.find((x) => x.slug === slug) ?? forgeProducts[0];
  return (
    <div style={{ background: "#0a1c33", color: "#e8f1ff", minHeight: "100dvh", fontFamily: "var(--font-code)", paddingBottom: 80 }}>
      <WorldExit id="forge" label="Room 11 · FORGE/INSPECT" />
      <ForgeNav current="inspect" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fc3ff" }}>INSPECTION BENCH · ONE PART AT A TIME</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>Inspect.</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {forgeProducts.map((x) => (
            <button
              key={x.slug}
              type="button"
              aria-pressed={slug === x.slug}
              onClick={() => { setSlug(x.slug); setFinish(0); }}
              style={{ border: "1px solid rgba(232,241,255,0.4)", background: slug === x.slug ? "#6fc3ff" : "transparent", color: slug === x.slug ? "#0a1c33" : "#e8f1ff", padding: "8px 14px", fontSize: 12 }}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div style={{ border: "1px solid rgba(232,241,255,0.3)", marginTop: 24, padding: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#6fc3ff", margin: 0 }}>PART · {p.family.toUpperCase()}</p>
          <h2 style={{ fontSize: "2rem", margin: "8px 0" }}>{p.name}</h2>
          <p style={{ color: "#8ba6c9" }}>{p.desc}</p>
          <dl style={{ margin: "20px 0 0" }}>
            {[
              ["Rated load", `${p.load} kN`],
              ["Tolerance", p.tolerance],
              ["Lead time", p.lead],
              ["W×H×bore", `${p.dims.w}×${p.dims.h}×${p.dims.bore}mm`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(232,241,255,0.25)", padding: "8px 0", fontSize: "0.95rem" }}>
                <dt>{k}</dt><dd style={{ margin: 0 }}>{v}</dd>
              </div>
            ))}
          </dl>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#6fc3ff", margin: "20px 0 8px" }}>FINISH</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.finishes.map((f, i) => (
              <button
                key={f}
                type="button"
                aria-pressed={finish === i}
                onClick={() => setFinish(i)}
                style={{ border: "1px solid rgba(232,241,255,0.4)", background: finish === i ? "#e8f1ff" : "transparent", color: finish === i ? "#0a1c33" : "#e8f1ff", padding: "8px 14px", fontSize: 12 }}
              >
                {f}
              </button>
            ))}
          </div>
          <p style={{ fontSize: "0.85rem", color: "#8ba6c9" }}>Selected: {p.finishes[finish]} · lead {p.lead}.</p>
          <p style={{ marginTop: 16 }}>
            <Link href={`/worlds/forge/${p.slug}`} style={{ textDecoration: "underline" }}>Full datasheet →</Link>
            {" · "}
            <Link href="/worlds/forge/quote" style={{ background: "#6fc3ff", color: "#0a1c33", padding: "10px 20px", fontWeight: 700, fontSize: 12 }}>QUOTE {p.name.toUpperCase()} →</Link>
          </p>
        </div>
      </div>
      <WorldProof
        proves="One part, fully interrogated: variants, dimensions, lead — then the quote."
        relatedHref="/worlds/objects"
        relatedName="OBJECTS"
      />
    </div>
  );
}
