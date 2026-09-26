import type { Metadata } from "next";
import { LookbookGrid } from "./grid";

export const metadata: Metadata = {
  title: "Lookbook — NOIR",
  description: "Autumn 26, head to toe. Every look, no prices until desire.",
};

export default function LookbookPage() {
  return (
    <div style={{ padding: "8px 0 80px" }}>
      <header style={{ padding: "8px 20px 20px" }}>
        <p className="kicker">Autumn 26 · 8 looks</p>
        <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 500, margin: 0 }}>Lookbook</h1>
        <p style={{ maxWidth: "52ch", color: "var(--muted)" }}>
          The collection as sentences, not SKUs. Open a look to see what it&apos;s made of — then buy the pieces.
        </p>
      </header>
      <LookbookGrid />
    </div>
  );
}
