import type { Metadata } from "next";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";

export const metadata: Metadata = {
  title: "About the game — SIGNAL",
  description: "Why a studio portfolio contains an arcade game, and how Intercept works.",
};

export default function SignalAbout() {
  return (
    <div className="signal-root">
      <WorldExit id="signal" label="Room 05 · SIGNAL" />
      <div className="signal-stage" style={{ paddingBottom: 80, maxWidth: 640 }}>
        <p className="kicker">Why is this here</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", margin: "6px 0 16px" }}>A PORTFOLIO THAT PLAYS BACK</h1>
        <p>SIGNAL exists for one argument: an interface should notice being touched. Most portfolio pieces are watched. This one keeps score.</p>
        <p>Intercept is the smallest game that proves the point — pointer input, a game loop, difficulty curves, persisted bests, pause. Everything a client&apos;s interactive campaign needs, minus the campaign.</p>
        <p className="kicker" style={{ marginTop: 24 }}>Built with</p>
        <p>One canvas, requestAnimationFrame, zero libraries. The whole game is a single page component.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
          <Link className="btn" href="/worlds/signal">Play →</Link>
          <Link className="btn ghost" href="/worlds/signal/records">Records</Link>
        </div>
      </div>
    </div>
  );
}
