import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { stillCollections, stillPhotographer } from "@/data/still";

export const metadata: Metadata = {
  title: "About — STILL",
  description: "The photographer, the method, the rules of the contact sheet.",
};

const RULES = [
  "Available light, or no picture.",
  "No directing strangers. Ask, or walk on.",
  "Black and white until color earns it.",
  "The contact sheet decides, not the shoot.",
  "One picture per wall. Never a grid at home.",
];

export default function StillAbout() {
  const total = stillCollections.reduce((n, c) => n + c.images.length, 0);
  return (
    <div className="still-root">
      <WorldExit id="still" label="Room 04 · STILL" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/still" className="kicker">← Contact sheet</Link>
        <p className="kicker" style={{ marginTop: 16 }}>{stillPhotographer.location}</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", fontWeight: 400, letterSpacing: "-0.04em", margin: "8px 0" }}>
          {stillPhotographer.name}
        </h1>
        <p style={{ fontSize: "1.25rem", maxWidth: "40ch" }}>{stillPhotographer.bio}</p>
        <p className="kicker" style={{ marginTop: 32 }}>Working rules</p>
        {RULES.map((r, i) => (
          <div key={r} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 12, padding: "12px 0", borderTop: "1px solid var(--line)" }}>
            <span>0{i + 1}</span>
            <span>{r}</span>
          </div>
        ))}
        <p className="kicker" style={{ marginTop: 32 }}>
          {stillCollections.length} collections · {total} pictures · <Link href="/worlds/still/prints">prints →</Link>
        </p>
        <hr className="rule" />
        <p className="kicker">Field notes — the interface philosophy</p>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em" }}>Why the site looks like nothing.</h2>
        <p style={{ lineHeight: 1.65 }}>A photography site has one job: get out of the way of the picture. So there is no hero, no slideshow, no parallax — a contact sheet, the way photographers have reviewed work for a century. Thumbnails are deliberately small and grayscale; the fullscreen view is the only place an image appears at full force.</p>
        <p style={{ lineHeight: 1.65 }}>Navigation is three filters and two links. The keyboard runs the lightbox because photographers already live on keyboards. Favorites exist because editing — choosing — is half the craft, and the site keeps your edit.</p>
        <p style={{ lineHeight: 1.65 }}>What this proves: restraint as a technical discipline. No frameworks for effects, no libraries for viewing — one page component, image optimization, and the confidence to stop.</p>
      </div>
    </div>
  );
}
