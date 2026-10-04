"use client";

import SignalPage from "@/app/worlds/signal/page";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";

/**
 * SIGNAL alternates reuse the real game — the canvas reads its palette
 * from CSS variables, so each reality is the same rules in new light.
 */
export function SignalMono() {
  return (
    <div className="sig-mono">
      <WorldExit id="signal" label="Room 05 · SIGNAL/MONO" />
      <SignalNav current="mono" />
      <SignalPage bare />
    </div>
  );
}

export function SignalPaper() {
  return (
    <div className="sig-paper">
      <WorldExit id="signal" label="Room 05 · SIGNAL/PAPER" />
      <SignalNav current="paper" />
      <SignalPage bare />
    </div>
  );
}

export function SignalArcade() {
  return (
    <div className="sig-arcade">
      <WorldExit id="signal" label="Room 05 · SIGNAL/ARCADE" />
      <SignalNav current="arcade" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px 8px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.4em", color: "#ff5a5a", margin: 0 }}>1 COIN · 1 PLAY · NO CONTINUES</p>
        <h1 style={{ fontSize: "clamp(2rem, 7vw, 4rem)", margin: "8px 0", color: "#ffd23f" }}>SIGNAL CABINET</h1>
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ border: "6px solid #2a2f3a", borderBottom: "none", background: "#14161c" }}>
          <SignalPage bare />
        </div>
        <div style={{ border: "6px solid #2a2f3a", background: "#14161c", padding: "12px 16px", display: "flex", justifyContent: "space-between", fontSize: 11, letterSpacing: "0.25em", color: "#8a93a5" }}>
          <span>◉ COIN SLOT</span><span>HIGH SCORE SAVES LOCALLY</span><span>P1 START →</span>
        </div>
      </div>
      <p style={{ textAlign: "center", margin: "24px 0 64px", fontSize: 12, color: "#8a93a5" }}>Same game as the restoring room — this one just takes quarters.</p>
    </div>
  );
}

export function SignalPocket() {
  return (
    <div className="sig-pocket">
      <WorldExit id="signal" label="Room 05 · SIGNAL/POCKET" />
      <SignalNav current="pocket" />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#5a6e3f", textAlign: "center" }}>CARTRIDGE 05 · 4 × AA · PLAYS ANYWHERE</p>
        <div style={{ border: "10px solid #3a4034", borderRadius: 18, background: "#9aa27e", padding: 12, marginTop: 16 }}>
          <SignalPage bare />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, color: "#3a4034", fontSize: 12, letterSpacing: "0.2em" }}>
          <span>✚ D-PAD</span><span>A&nbsp;&nbsp;&nbsp;&nbsp;B</span><span>START</span>
        </div>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem", color: "#5a6e3f" }}>The full game, pocket-sized. Batteries not included; the score still saves.</p>
      </div>
    </div>
  );
}
export function SignalFuture() {
  return (
    <div className="sig-future">
      <WorldExit id="signal" label="Room 05 · SIGNAL/QUANTUM" />
      <SignalNav current="future" />
      <SignalPage bare />
    </div>
  );
}

export function SignalInk() {
  return (
    <div className="sig-ink">
      <WorldExit id="signal" label="Room 05 · SIGNAL/INK" />
      <SignalNav current="ink" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em" }}>SUMI STUDY · ONE BRUSH · NO UNDO</p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2.6rem, 8vw, 5rem)", fontWeight: 400, margin: "8px 0" }}>
          Intercept, in ink.
        </h1>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", maxWidth: "52ch" }}>
          The same forty-five seconds, ground on a stone. Blips fall like drops; the core holds like a seal.
        </p>
        <div style={{ border: "2px solid currentColor", marginTop: 24 }}>
          <SignalPage bare />
        </div>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", marginTop: 16 }}>
          Best kept dry. <Link href="/worlds/signal" style={{ textDecoration: "underline" }}>The arcade original →</Link>
        </p>
      </div>
    </div>
  );
}

export function SignalNav({ current }: { current: string }) {
  return (
    <nav aria-label="SIGNAL realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#efe9dc", color: "#1a1712", borderBottom: "2px solid #1a1712", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/signal" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800 }}>
        SIGNAL◌
      </Link>
      {[
        ["classic", "CRT", "/worlds/signal"],
        ["mono", "Mono", "/worlds/signal/mono"],
        ["paper", "Paper", "/worlds/signal/paper"],
        ["future", "Quantum", "/worlds/signal/future"],
        ["arcade", "Arcade", "/worlds/signal/arcade"],
        ["pocket", "Pocket", "/worlds/signal/pocket"],
        ["ink", "Ink", "/worlds/signal/ink"],
      ].map(([id, label, href]) => (
        <Link
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: current === id ? "#efe9dc" : "#1a1712",
            background: current === id ? "#1a1712" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
