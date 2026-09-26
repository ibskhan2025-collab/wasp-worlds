import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { LettersForm } from "./form";

export const metadata: Metadata = {
  title: "Letters — ARCHIVE",
  description: "One email per issue. No funnels, no growth hacks, unsubscribe anytime.",
};

export default function LettersPage() {
  return (
    <div className="arc-root">
      <WorldExit id="archive" label="Room 07 · ARCHIVE" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/archive" className="kicker">← The Archive</Link>
        <p className="kicker" style={{ marginTop: 16 }}>The newsletter with no funnel</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", lineHeight: 0.95, margin: "8px 0" }}>Letters</h1>
        <p style={{ fontSize: "1.2rem" }}>
          One email per issue: what we built, what we got wrong, what we&apos;re reading.
          No sequences, no lead magnets, no &ldquo;just bumping this&rdquo;.
        </p>
        <LettersForm />
      </div>
    </div>
  );
}
