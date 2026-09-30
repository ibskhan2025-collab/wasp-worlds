"use client";

import SignalPage from "@/app/worlds/signal/page";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";

/**
 * SIGNAL alternates reuse the real game — the canvas reads its palette
 * from CSS variables, so each reality is the same rules in new light.
 */
export function SignalMono() {
  return (
    <div className="sig-mono">
      <WorldExit id="signal" label="Room 05 · SIGNAL/MONO" />
      <RealityShell world="signal" current="mono" basePath="/worlds/signal" />
      <SignalPage bare />
    </div>
  );
}

export function SignalPaper() {
  return (
    <div className="sig-paper">
      <WorldExit id="signal" label="Room 05 · SIGNAL/PAPER" />
      <RealityShell world="signal" current="paper" basePath="/worlds/signal" />
      <SignalPage bare />
    </div>
  );
}

export function SignalArcade() {
  return (
    <div className="sig-arcade">
      <WorldExit id="signal" label="Room 05 · SIGNAL/ARCADE" />
      <RealityShell world="signal" current="arcade" basePath="/worlds/signal" />
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
      <RealityShell world="signal" current="pocket" basePath="/worlds/signal" />
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
      <RealityShell world="signal" current="future" basePath="/worlds/signal" />
      <SignalPage bare />
    </div>
  );
}
