"use client";

import Link from "next/link";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { Lightbox } from "@/components/worlds/lightbox";
import { stillCollections } from "@/data/still";

function frames() {
  return stillCollections.flatMap((c) => c.images.map((img) => ({ ...img, collection: c.title })));
}

export function StillNegative() {
  const [open, setOpen] = useState<number | null>(null);
  const images = frames();
  return (
    <div style={{ background: "#0c0c0c", color: "#ececec", minHeight: "100dvh", fontFamily: "var(--font-serif)" }}>
      <WorldExit id="still" label="Room 04 · STILL/NEGATIVE" />
      <RealityShell world="still" current="negative" basePath="/worlds/still" />
      <header style={{ padding: "28px 20px 8px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#ff5a5a" }}>SAFELIGHT ON · NIGHT EDITING</p>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", margin: 0, fontWeight: 400 }}>STILL/DARK</h1>
        <p style={{ color: "#8a8a8a", maxWidth: "40ch" }}>The same twelve frames, evaluated the way film was: in the dark, one at a time.</p>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 2, padding: "0 20px", background: "#000" }}>
        {images.map((img, i) => (
          <button key={img.src} type="button" onClick={() => setOpen(i)} aria-label={`Open ${img.alt}`} style={{ border: 0, padding: 0, background: "#000", position: "relative", aspectRatio: "1", overflow: "hidden" }}>
            <img src={img.src} alt={img.alt} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.9)" }} />
            <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, fontFamily: "monospace", color: "#ff5a5a" }}>FR.{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: "24px 20px 0" }}>
        <Link href="/worlds/still/prints" style={{ color: "#ececec", borderBottom: "1px solid #ececec" }}>Prints survive the dark →</Link>
      </div>
      {open !== null && images[open] ? (
        <Lightbox images={images.map((g) => ({ src: g.src, alt: g.alt }))} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
      ) : null}
      <WorldProof
        proves="Same frames, night shift. A grid that inverts without losing a single interaction."
        relatedHref="/worlds/archive"
        relatedName="ARCHIVE"
      />
    </div>
  );
}

export function StillContact() {
  const [open, setOpen] = useState<number | null>(null);
  const images = frames();
  return (
    <div style={{ background: "#e2d5b8", color: "#241f16", minHeight: "100dvh", fontFamily: "monospace" }}>
      <WorldExit id="still" label="Room 04 · STILL/CONTACT" />
      <RealityShell world="still" current="contact" basePath="/worlds/still" />
      <header style={{ padding: "24px 20px 8px", borderBottom: "2px solid #241f16" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", margin: 0 }}>ROLL 04 · 12 EXP · EDGE № 8A43</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", margin: "4px 0" }}>CONTACT SHEET</h1>
      </header>
      <div style={{ padding: "12px 20px 40px" }}>
        {images.map((img, i) => (
          <div key={img.src} style={{ display: "grid", gridTemplateColumns: "64px 96px 1fr auto", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #241f1644" }}>
            <span style={{ color: "#8a3b1f", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}A</span>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open ${img.alt}`} style={{ border: "1px solid #241f16", padding: 0, background: "none", width: 96, height: 96, overflow: "hidden" }}>
              <img src={img.src} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)" }} />
            </button>
            <span style={{ fontSize: "0.8rem" }}>{img.alt} <em style={{ opacity: 0.6 }}>· {img.collection}</em></span>
            <span style={{ color: "#8a3b1f" }}>◎ KEEP?</span>
          </div>
        ))}
        <p style={{ marginTop: 20 }}>Circle the keepers with grease pencil. Then <Link href="/worlds/still/prints" style={{ textDecoration: "underline" }}>order prints →</Link></p>
      </div>
      {open !== null && images[open] ? (
        <Lightbox images={images.map((g) => ({ src: g.src, alt: g.alt }))} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
      ) : null}
    </div>
  );
}

export function StillGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const images = stillCollections.flatMap((c) => c.images);
  return (
    <div style={{ background: "#e6ddc8", color: "#201a12", minHeight: "100dvh", fontFamily: "var(--font-serif)" }}>
      <WorldExit id="still" label="Room 04 · STILL/GALLERY" />
      <RealityShell world="still" current="gallery" basePath="/worlds/still" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 20px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em" }}>HUNG STRAIGHT · ONE WALL</p>
        {images.map((img, i) => (
          <figure key={img.src} style={{ margin: "64px auto", maxWidth: i % 3 === 0 ? 760 : 520 }}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open ${img.alt}`} style={{ border: "12px solid #fffdf6", padding: 0, background: "#fffdf6", boxShadow: "0 18px 50px rgba(32,26,18,0.25)", width: "100%" }}>
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" style={{ width: "100%", display: "block", filter: "grayscale(0.85)" }} />
            </button>
            <figcaption style={{ marginTop: 12, fontSize: "0.9rem", fontStyle: "italic" }}>{i + 1}. {img.alt}</figcaption>
          </figure>
        ))}
        <p><Link href="/worlds/still/prints" style={{ textDecoration: "underline" }}>Take one home →</Link></p>
      </div>
      {open !== null ? (
        <Lightbox images={images.map((g) => ({ src: g.src, alt: g.alt }))} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
      ) : null}
    </div>
  );
}

export function StillDarkroom() {
  const trays = stillCollections;
  return (
    <div style={{ background: "#120d0d", color: "#e8d8c8", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="still" label="Room 04 · STILL/DARKROOM" />
      <RealityShell world="still" current="darkroom" basePath="/worlds/still" />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#ff5a5a" }}>SAFELIGHT · THREE TRAYS · DON&apos;T OPEN THE DOOR</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 9vw, 6rem)", margin: "8px 0" }}>Darkroom.</h1>
        <p style={{ maxWidth: "52ch", color: "#a89880" }}>Every collection as a developing tray: dev, stop, fix. Times are the edit — what stays in the soup longest is what matters.</p>
        {trays.map((t, ti) => (
          <section key={t.id} style={{ marginTop: 36, border: "1px solid rgba(232,216,200,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "16px 20px", borderBottom: "1px solid rgba(232,216,200,0.3)", background: "#1a1212" }}>
              <strong style={{ fontSize: "1.4rem" }}>TRAY {ti + 1} · {t.title}</strong>
              <span style={{ fontSize: 12, color: "#ff5a5a" }}>{t.year} · DEV 0{ti + 2}:00 · AGITATE</span>
            </div>
            {t.images.map((img, ii) => (
              <div key={img.src} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, padding: "16px 20px", borderTop: ii ? "1px dashed rgba(232,216,200,0.25)" : "none" }}>
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" style={{ width: 120, height: 90, objectFit: "cover", filter: "grayscale(1) brightness(0.85) sepia(0.3)" }} />
                <div>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>{img.alt}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#a89880" }}>{img.w}×{img.h} · {t.note}</p>
                </div>
              </div>
            ))}
          </section>
        ))}
        <p style={{ marginTop: 28 }}>Washed and hung. <Link href="/worlds/still/prints" style={{ textDecoration: "underline" }}>Take one home →</Link></p>
      </div>
      <WorldProof
        proves="Process as presentation: the darkroom makes editing visible — every frame earned its place in the tray."
        relatedHref="/worlds/noir"
        relatedName="NOIR"
      />
    </div>
  );
}

export function StillFolio() {
  const plates = stillCollections.flatMap((c) => c.images.map((img) => ({ ...img, from: c.title })));
  const [i, setI] = useState(0);
  const plate = plates[i];
  return (
    <div style={{ background: "#f4f1ea", color: "#111", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="still" label="Room 04 · STILL/FOLIO" />
      <RealityShell world="still" current="folio" basePath="/worlds/still" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em" }}>FOLIO · ONE PLATE AT A TIME · {i + 1} / {plates.length}</p>
        <figure style={{ margin: "32px auto", maxWidth: 720 }}>
          <img src={plate.src} alt={plate.alt} style={{ width: "100%", display: "block", filter: "grayscale(0.9)", border: "1px solid #111" }} />
          <figcaption style={{ marginTop: 16, fontStyle: "italic" }}>Plate {i + 1} — {plate.alt} <span style={{ color: "#6a655e" }}>(from “{plate.from}”)</span></figcaption>
        </figure>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button type="button" onClick={() => setI((i - 1 + plates.length) % plates.length)} aria-label="Previous plate" style={{ border: "2px solid #111", background: "transparent", padding: "10px 22px", fontSize: 12, letterSpacing: "0.15em" }}>← PREV</button>
          <button type="button" onClick={() => setI((i + 1) % plates.length)} aria-label="Next plate" style={{ border: "2px solid #111", background: "#111", color: "#f4f1ea", padding: "10px 22px", fontSize: 12, letterSpacing: "0.15em" }}>NEXT →</button>
        </div>
        <p style={{ marginTop: 24 }}><Link href="/worlds/still/prints" style={{ textDecoration: "underline" }}>Take one home →</Link></p>
      </div>
      <WorldProof
        proves="Attention as luxury: one plate, full-bleed, nothing competing — the slowest way to look, on purpose."
        relatedHref="/worlds/archive"
        relatedName="ARCHIVE"
      />
    </div>
  );
}
