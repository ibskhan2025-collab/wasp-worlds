"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { destinations } from "@/data/atlas";
import { money } from "@/lib/use-cart";

export function AtlasExpedition() {
  return (
    <div style={{ background: "#101418", color: "#e8e4dc", minHeight: "100dvh" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/EXPEDITION" />
      <RealityShell world="atlas" current="expedition" basePath="/worlds/atlas" />
      <header style={{ padding: "40px 20px 8px", maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c98a3d" }}>NIGHT NAVIGATION · SIX ROUTES</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.88, margin: "8px 0", letterSpacing: "-0.05em" }}>GO FAR.<br />GO DARK.</h1>
      </header>
      {destinations.map((d) => (
        <section key={d.slug} style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px" }}>
          <Link href={`/worlds/atlas/${d.slug}`} style={{ display: "block", position: "relative" }}>
            <img src={d.image} alt={d.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "21/9", objectFit: "cover", filter: "brightness(0.7) saturate(0.9)" }} />
            <div style={{ position: "absolute", inset: "auto 0 0 0", padding: 20, background: "linear-gradient(transparent, rgba(16,20,24,0.9))" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c98a3d", margin: 0 }}>{d.region.toUpperCase()} · {d.season.toUpperCase()} · ★ {d.rating}</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.6rem)", margin: "4px 0" }}>{d.name}</h2>
              <p style={{ color: "#e8e4dcbb", margin: 0 }}>{d.days} days · {money(d.price)} · {d.stops.length} stops</p>
            </div>
          </Link>
        </section>
      ))}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "8px 20px 80px" }}>
        <Link href="/worlds/atlas/itinerary" style={{ background: "#c98a3d", color: "#101418", padding: "14px 24px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>PLAN BY STARLIGHT →</Link>
      </div>
      <WorldProof
        proves="Night navigation: the same six routes, recut for scale and slowness. Desire needs darkness."
        relatedHref="/worlds/nest"
        relatedName="NEST"
      />
    </div>
  );
}

export function AtlasField() {
  return (
    <div style={{ background: "#e4dcc8", color: "#241f16", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="atlas" label="Room 10 · ATLAS/FIELD" />
      <RealityShell world="atlas" current="field" basePath="/worlds/atlas" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>FIELD LOG · SURVEYOR&apos;S COPY</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", fontWeight: 400, margin: "8px 0" }}>Notes from the valley</h1>
        {destinations.map((d, i) => (
          <article key={d.slug} style={{ border: "2px dashed #241f1688", padding: 18, marginTop: 20, transform: `rotate(${i % 2 ? 0.5 : -0.5}deg)`, background: "#ece4cf" }}>
            <p style={{ margin: 0, fontSize: 12 }}>ENTRY {String(i + 1).padStart(2, "0")} · {d.season.toUpperCase()} · RATING {d.rating}/5</p>
            <h2 style={{ fontSize: "1.8rem", margin: "6px 0" }}>
              <Link href={`/worlds/atlas/${d.slug}`} style={{ textDecoration: "underline" }}>{d.name}</Link>
            </h2>
            <p style={{ fontStyle: "italic" }}>{d.blurb}</p>
            <p style={{ fontSize: "0.9rem" }}><strong>Pack:</strong> {d.pack}</p>
            <p style={{ fontSize: "0.9rem" }}><strong>Stops:</strong> {d.stops.map((s) => s.name).join(" → ")}</p>
            <span style={{ display: "inline-block", border: "2px solid #5a6e3f", color: "#5a6e3f", padding: "4px 12px", transform: "rotate(-3deg)", fontWeight: 700, fontSize: 11, letterSpacing: "0.2em" }}>SURVEYED ✓</span>
          </article>
        ))}
      </div>
    </div>
  );
}
