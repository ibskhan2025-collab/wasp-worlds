import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { PrintForm } from "./form";

export const metadata: Metadata = {
  title: "Prints — STILL",
  description: "Silver gelatin, three sizes, editions of twelve. Enquire for a wall.",
};

const EDITIONS = [
  { size: "30 × 40 cm", price: "€180", note: "For hallways and small rooms." },
  { size: "50 × 70 cm", price: "€420", note: "The standard. One picture per wall." },
  { size: "70 × 100 cm", price: "€860", note: "For rooms that can take it." },
];

export default function PrintsPage() {
  return (
    <div className="still-root">
      <WorldExit id="still" label="Room 04 · STILL" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/still" className="kicker">← Contact sheet</Link>
        <p className="kicker" style={{ marginTop: 16 }}>Editions of twelve</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", fontWeight: 400, letterSpacing: "-0.04em", margin: "8px 0" }}>Prints</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "42ch" }}>
          Silver gelatin, signed, numbered. Any picture on the contact sheet can be printed —
          tell us which one and how big your wall is.
        </p>
        {EDITIONS.map((e) => (
          <div key={e.size} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "16px 0", borderTop: "1px solid var(--line)", alignItems: "baseline" }}>
            <div>
              <strong style={{ fontSize: "1.4rem" }}>{e.size}</strong>
              <p style={{ color: "var(--muted)", margin: "4px 0 0" }}>{e.note}</p>
            </div>
            <span style={{ fontSize: "1.4rem" }}>{e.price}</span>
          </div>
        ))}
        <PrintForm />
      </div>
    </div>
  );
}
