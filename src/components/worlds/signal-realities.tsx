"use client";

import SignalPage from "@/app/worlds/signal/page";
import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { loadJson } from "@/lib/storage";

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

export function SignalNav({ current }: { current: string }) {  return (
    <nav aria-label="SIGNAL realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#efe9dc", color: "#1a1712", borderBottom: "2px solid #1a1712", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/signal" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800 }}>
        SIGNAL◌
      </Link>
      {[
        ["classic", "CRT", "/worlds/signal"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="signal"
          label={label}
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
        </WorldNavLink>
      ))}
    </nav>
  );
}

const CHANNELS = [
  { id: "amber", label: "CH·AMBER", cls: "", hint: "The house broadcast." },
  { id: "mono", label: "CH·MONO", cls: "sig-mono", hint: "Pure contrast." },
  { id: "paper", label: "CH·PAPER", cls: "sig-paper", hint: "Ink on graph paper." },
  { id: "quantum", label: "CH·QUANTUM", cls: "sig-future", hint: "Cold vector sweep." },
] as const;

export function SignalCrt() {
  const [ch, setCh] = useState<(typeof CHANNELS)[number]>(CHANNELS[0]);
  const [bright, setBright] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [hold, setHold] = useState(0);
  const [power, setPower] = useState(true);
  return (
    <div style={{ background: "#14100a", color: "#ffb84d", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="signal" label="Room 05 · SIGNAL/CRT" />
      <SignalNav current="crt" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.4em", color: "#8a6a3a", margin: 0 }}>SOLID STATE · UHF · WARM-UP 3 SECONDS</p>
        <h1 style={{ fontSize: "clamp(2rem, 7vw, 4rem)", margin: "8px 0 24px" }}>CHANNEL 05</h1>
        <div style={{ background: "#241c10", borderRadius: 28, padding: "28px 28px 20px", border: "1px solid #3a2c14" }}>
          <div style={{ borderRadius: 18, overflow: "hidden", background: "#000", boxShadow: "inset 0 0 80px rgba(0,0,0,0.9)", position: "relative" }}>
            {power ? (
              <div className={ch.cls} style={{ filter: `brightness(${bright}%) contrast(${contrast}%)` }}>
                <SignalPage bare />
              </div>
            ) : (
              <div className="sig-off" aria-label="Television off" style={{ height: 420 }} />
            )}
            <div aria-hidden className="sig-scan" style={{ backgroundPosition: `0 ${hold}px` }} />
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", marginTop: 20 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {CHANNELS.map((c) => (
                <button key={c.id} type="button" aria-pressed={ch.id === c.id} onClick={() => { setCh(c); setPower(true); }} style={{ background: ch.id === c.id ? "#ffb84d" : "transparent", color: ch.id === c.id ? "#14100a" : "#ffb84d", border: "1px solid #ffb84d", borderRadius: "50%", width: 64, height: 64, fontSize: 10, letterSpacing: "0.05em", fontFamily: "inherit" }}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gap: 8, fontSize: 11, letterSpacing: "0.15em" }}>
              <label>BRIGHT <input type="range" min={40} max={160} value={bright} onChange={(e) => setBright(Number(e.target.value))} aria-label="Brightness" /></label>
              <label>CONTRAST <input type="range" min={40} max={180} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} aria-label="Contrast" /></label>
              <label>V-HOLD <input type="range" min={0} max={120} value={hold} onChange={(e) => setHold(Number(e.target.value))} aria-label="Vertical hold" /></label>
            </div>
            <button type="button" aria-pressed={power} onClick={() => setPower((p) => !p)} style={{ marginLeft: "auto", background: power ? "#ffb84d" : "transparent", color: power ? "#14100a" : "#ffb84d", border: "2px solid #ffb84d", borderRadius: "50%", width: 56, height: 56, fontWeight: 800, fontFamily: "inherit" }}>
              ⏻
            </button>
          </div>
          <p style={{ fontSize: 12, color: "#8a6a3a", margin: "16px 0 0" }}>{ch.hint} The knobs are real: brightness, contrast, and hold bend the live game.</p>
        </div>
      </div>
      <WorldProof
        proves="Hardware as frame: the same forty-five seconds, bent by glass and knobs — reception as reality."
        relatedHref="/worlds/signal/arcade"
        relatedName="ARCADE"
      />
    </div>
  );
}

export function SignalArena() {
  const [bests] = useState(() => loadJson<Record<string, number>>("wasp-signal-bests", {}));
  const rows = (["Calm", "Sharp", "Brutal"] as const).map((d) => ({ d, s: Number(bests[d] ?? 0) }));
  const champ = rows.reduce((a, b) => (b.s > a.s ? b : a), rows[0]);
  return (
    <div style={{ background: "#0b0d12", color: "#f2f2ee", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="signal" label="Room 05 · SIGNAL/ARENA" />
      <SignalNav current="arena" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 8px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.4em", color: "#ffd23f", margin: 0 }}>SOLD OUT · 40,000 SEATS · ONE CANVAS</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 8vw, 5rem)", margin: "8px 0" }}>THE ARENA</h1>
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
        <div className="sig-bracket" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2, background: "#2a2f3a", border: "2px solid #2a2f3a", marginBottom: 24 }}>
          {rows.map((r) => (
            <div key={r.d} style={{ background: "#14161c", padding: "16px", textAlign: "center" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#8a93a5", margin: "0 0 8px" }}>{r.d.toUpperCase()} DIVISION</p>
              <p style={{ fontSize: "2rem", margin: 0, color: r.d === champ.d && r.s > 0 ? "#ffd23f" : "#f2f2ee" }}>{r.s.toLocaleString()}</p>
              <p style={{ fontSize: 11, color: "#8a93a5", margin: "8px 0 0" }}>{r.d === champ.d && r.s > 0 ? "★ HOUSE CHAMPION" : r.s > 0 ? "CONTENDER" : "UNPLAYED — QUALIFY BELOW"}</p>
            </div>
          ))}
        </div>
        <div aria-hidden style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 8 }}>
          {Array.from({ length: 48 }).map((_, i) => (
            <span key={i} className="sig-crowd" style={{ animationDelay: `${(i % 12) * 0.18}s`, background: i % 5 === 0 ? "#ffd23f" : "#3a4152" }} />
          ))}
        </div>
        <div className="sig-stage" style={{ border: "8px solid #2a2f3a", background: "#000" }}>
          <SignalPage bare />
        </div>
        <p style={{ textAlign: "center", margin: "20px 0 64px", fontSize: 12, color: "#8a93a5" }}>Qualify below: your best scores per division seed the bracket above. Saved on this device only.</p>
      </div>
      <WorldProof
        proves="Competition as frame: your own bests become the bracket — the house champion is whoever played here."
        relatedHref="/worlds/signal"
        relatedName="SIGNAL"
      />
    </div>
  );
}
