import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { CommissionForm } from "./form";

export const metadata: Metadata = {
  title: "Commissions — MOTION",
  description: "Launch films, scroll campaigns, event visuals. Tell us the date first.",
};

export default function CommissionsPage() {
  return (
    <div className="mot-root">
      <WorldExit id="motion" label="Room 08 · MOTION" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px" }}>
        <Link href="/worlds/motion" className="kicker">← The sequence</Link>
        <p className="kicker" style={{ marginTop: 16 }}>Commissions</p>
        <h1 style={{ fontSize: "clamp(3rem, 9vw, 6rem)", lineHeight: 0.9, margin: "8px 0" }}>MOVE SOMETHING</h1>
        <p style={{ fontFamily: "var(--font-sans)", color: "#ffffffaa", maxWidth: "46ch" }}>
          Launch sequences, scroll campaigns, event visuals. We take four motion commissions a quarter —
          the first question is always the date.
        </p>
        <CommissionForm />
      </div>
    </div>
  );
}
