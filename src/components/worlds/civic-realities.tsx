"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { civicServices } from "@/data/civic";

export function CivicNoticeboard() {
  return (
    <div style={{ background: "#faf7f0", color: "#141210", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="civic" label="Room 13 · CIVIC/NOTICE" />
      <RealityShell world="civic" current="noticeboard" basePath="/worlds/civic" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ border: "4px solid #141210", padding: "24px" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", margin: 0 }}>BOROUGH OF NORTHGATE · BY ORDER · FICTIONAL</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 8vw, 5rem)", margin: "8px 0", lineHeight: 0.95 }}>NOTICES AFFECTING YOU</h1>
        </div>
        {civicServices.map((s, i) => (
          <article key={s.slug} style={{ border: "2px solid #141210", borderTop: 0, padding: 20 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", margin: 0 }}>NOTICE №{2400 + i} · {s.dept.toUpperCase()}</p>
            <h2 style={{ fontSize: "1.7rem", margin: "8px 0" }}>
              <Link href={`/worlds/civic/${s.slug}`} style={{ textDecoration: "underline" }}>{s.title}</Link>
            </h2>
            <p style={{ margin: "0 0 8px" }}>{s.intro}</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}><strong>{s.steps.length} steps.</strong> Posted Monday. Objections in writing.</p>
          </article>
        ))}
        <p style={{ marginTop: 16, fontSize: "0.85rem" }}>All notices fictional. The full guides live <Link href="/worlds/civic" style={{ textDecoration: "underline" }}>at the counter →</Link></p>
      </div>
      <WorldProof
        proves="The same guidance, pinned up. Statutory gravity without a single wasted word."
        relatedHref="/worlds/vector"
        relatedName="VECTOR"
      />
    </div>
  );
}

export function CivicPaperform() {
  return (
    <div style={{ background: "#e9e2d0", color: "#2a241c", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="civic" label="Room 13 · CIVIC/COUNTER" />
      <RealityShell world="civic" current="paperform" basePath="/worlds/civic" />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ background: "#f4efe0", border: "1px solid #2a241c", boxShadow: "6px 6px 0 #2a241c33", padding: "32px 28px" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", margin: 0 }}>FORM CVC-1 · PLEASE USE BLOCK CAPITALS</p>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.4rem)", fontWeight: 400, margin: "8px 0" }}>How can the counter help?</h1>
          <p style={{ fontStyle: "italic" }}>Tick what applies. A human reads every slip before lunch.</p>
          {civicServices.map((s) => (
            <label key={s.slug} style={{ display: "flex", gap: 12, padding: "14px 0", borderTop: "1px dashed #2a241c66", cursor: "pointer" }}>
              <input type="checkbox" style={{ width: 20, height: 20, marginTop: 2 }} />
              <span>
                <Link href={`/worlds/civic/${s.slug}`} style={{ fontWeight: 700, textDecoration: "underline" }}>{s.title}</Link>
                <br /><span style={{ fontSize: "0.9rem" }}>{s.intro}</span>
              </span>
            </label>
          ))}
          <p style={{ marginTop: 20, fontSize: "0.9rem" }}>Done ticking? <Link href="/worlds/civic" style={{ textDecoration: "underline", fontWeight: 700 }}>Hand it in at the digital counter →</Link></p>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.8rem", marginTop: 16, fontStyle: "italic" }}>Carbon copy retained for your records. Obviously.</p>
      </div>
    </div>
  );
}

export function CivicKiosk() {
  return (
    <div style={{ background: "#0d1117", color: "#e8eef2", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="civic" label="Room 13 · CIVIC/KIOSK" />
      <RealityShell world="civic" current="kiosk" basePath="/worlds/civic" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#2e6bd8" }}>PUBLIC TERMINAL · TOUCH TO BEGIN · FICTIONAL</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 8vw, 4.6rem)", margin: "8px 0 24px" }}>What do you need?</h1>
        {civicServices.map((s) => (
          <Link
            key={s.slug}
            href={`/worlds/civic/${s.slug}`}
            style={{ display: "block", padding: "22px 18px", border: "2px solid #e8eef2", marginBottom: 12, minHeight: 64 }}
          >
            <strong style={{ fontSize: "1.4rem" }}>{s.title}</strong>
            <div style={{ color: "#8a99a5", fontSize: "0.95rem", marginTop: 4 }}>{s.intro}</div>
            <div style={{ color: "#2e6bd8", fontSize: "0.85rem", marginTop: 6 }}>TAP TO CONTINUE →</div>
          </Link>
        ))}
        <p style={{ fontSize: "0.85rem", color: "#8a99a5" }}>Demonstration kiosk. For real services, <Link href="/worlds/civic" style={{ textDecoration: "underline", color: "#e8eef2" }}>use the counter →</Link></p>
      </div>
    </div>
  );
}

export function CivicChamber() {
  return (
    <div style={{ background: "#1c1611", color: "#ece4d2", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="civic" label="Room 13 · CIVIC/CHAMBER" />
      <RealityShell world="civic" current="chamber" basePath="/worlds/civic" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c9a86d" }}>ORDER OF BUSINESS · {civicServices.length} MOTIONS · PUBLIC GALLERY OPEN</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", fontWeight: 400, margin: "8px 0" }}>Chamber.</h1>
        <p style={{ fontStyle: "italic", color: "#a89878" }}>Every service as a motion before the council — moved, seconded, sourced.</p>
        {civicServices.map((s, i) => (
          <article key={s.slug} style={{ borderTop: "1px solid rgba(236,228,210,0.3)", padding: "20px 0" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c9a86d", margin: 0 }}>MOTION {i + 1} · {s.dept.toUpperCase()} · CARRIED</p>
            <h2 style={{ fontSize: "1.7rem", margin: "8px 0" }}>
              <Link href={`/worlds/civic/${s.slug}`} style={{ textDecoration: "underline" }}>{s.title}</Link>
            </h2>
            <p style={{ color: "#c9b891" }}>{s.intro}</p>
            <p style={{ fontSize: "0.85rem", color: "#a89878" }}>{s.steps.length} steps recorded · {s.source}</p>
          </article>
        ))}
        <p style={{ marginTop: 24, fontStyle: "italic" }}>Session adjourned. <Link href="/worlds/civic" style={{ textDecoration: "underline" }}>Back to the counter →</Link></p>
      </div>
      <WorldProof
        proves="Democracy legible: motions, departments, sources — civic services with the minutes attached."
        relatedHref="/worlds/archive"
        relatedName="ARCHIVE"
      />
    </div>
  );
}

export function CivicDesk() {
  const depts = [...new Set(civicServices.map((s) => s.dept))];
  return (
    <div style={{ background: "#e9e2d0", color: "#2a241c", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="civic" label="Room 13 · CIVIC/DESK" />
      <RealityShell world="civic" current="desk" basePath="/worlds/civic" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>FRONT DESK · TAKE A NUMBER · NOW SERVING 14</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>What brings you in?</h1>
        <p style={{ color: "#6a6254" }}>Say it in your own words — the desk hears keywords, not form fields.</p>
        {depts.map((dept) => (
          <section key={dept} style={{ marginTop: 28, border: "2px solid #2a241c", background: "#faf7f0" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", margin: 0, padding: "12px 16px", background: "#2a241c", color: "#e9e2d0" }}>DESK · {dept.toUpperCase()}</p>
            {civicServices.filter((s) => s.dept === dept).map((s) => (
              <div key={s.slug} style={{ padding: "14px 16px", borderTop: "1px solid rgba(42,36,28,0.2)" }}>
                <Link href={`/worlds/civic/${s.slug}`} style={{ fontWeight: 700, fontSize: "1.15rem", textDecoration: "underline" }}>{s.title}</Link>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {s.keywords.slice(0, 5).map((k) => (
                    <span key={k} style={{ fontSize: 11, border: "1px solid #2a241c", padding: "2px 8px", borderRadius: 20 }}>“{k}”</span>
                  ))}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#6a6254", margin: "8px 0 0" }}>{s.steps.length} steps · {s.intro}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
      <WorldProof
        proves="Triage, not forms: the desk understands plain words — keywords in, steps out."
        relatedHref="/worlds/orbit"
        relatedName="ORBIT"
      />
    </div>
  );
}
