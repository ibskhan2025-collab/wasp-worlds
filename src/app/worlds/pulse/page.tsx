import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { fmtSecs, releases } from "@/data/pulse";
import { TourList } from "./tour-list";

export const metadata: Metadata = {
  title: "PULSE — The release is the event",
  description: "A culture-first world: releases, tracklists, countdowns and a tour you can RSVP to.",
};

export default function PulsePage() {
  return (
    <div className="mot-root" style={{ fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE" />
      <header style={{ padding: "48px 20px 12px", textAlign: "center" }}>
        <p className="kicker" style={{ color: "#e23a3a" }}>Room 12 · Music / Culture</p>
        <h1 style={{ fontFamily: "var(--font-poster)", fontSize: "clamp(4rem, 16vw, 11rem)", lineHeight: 0.85, margin: "8px 0" }}>PULSE</h1>
        <p style={{ letterSpacing: "0.1em" }}>CULTURE MOVES. THE SITE MOVES WITH IT.</p>
      </header>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        <p className="kicker" style={{ color: "#e23a3a" }}>Releases</p>
        {releases.map((r) => {
          const total = r.tracks.reduce((n, t) => n + t.secs, 0);
          return (
            <Link key={r.slug} href={`/worlds/pulse/${r.slug}`} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 20, padding: "20px 0", borderTop: "1px solid #ffffff22" }} className="grid-2">
              <img src={r.cover} alt={`${r.title} cover`} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
              <div>
                <p className="kicker" style={{ color: "#e23a3a" }}>{r.artist} · {r.date}</p>
                <h2 style={{ fontFamily: "var(--font-poster)", fontSize: "2.4rem", margin: "4px 0" }}>{r.title.toUpperCase()}</h2>
                <p style={{ color: "#ffffffaa" }}>{r.tracks.length} tracks · {fmtSecs(total)}</p>
              </div>
            </Link>
          );
        })}
      </section>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
        <p className="kicker" style={{ color: "#e23a3a" }}>On tour</p>
        <TourList />
      </section>
    </div>
  );
}
