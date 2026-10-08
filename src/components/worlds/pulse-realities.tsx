"use client";

import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { fmtSecs, releases, shows } from "@/data/pulse";
import { loadJson, saveJson } from "@/lib/storage";

const GOING_KEY = "wasp-v11-pulse-rsvp";

export function PulseFlyer() {
  return (
    <div style={{ background: "#ece8df", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/FLYER" />
      <PulseNav current="flyer" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ border: "4px solid #111", padding: "28px 24px", transform: "rotate(-0.8deg)", background: "#f4f1ea" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", margin: 0 }}>WHEATPASTE · DO NOT REMOVE · PULSE RECORDINGS PRESENTS</p>
          <h1 style={{ fontSize: "clamp(3rem, 12vw, 6.5rem)", lineHeight: 0.85, margin: "12px 0", fontWeight: 900 }}>LOUD<br />NIGHTS,<br />CHEAP BEER</h1>
          {shows.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid #111", fontWeight: 700 }}>
              <span>{s.date} — {s.city.toUpperCase()} @ {s.venue}</span>
              <span>{s.status === "Sold out" ? "GONE" : "£18 OTD"}</span>
            </div>
          ))}
          <p style={{ marginTop: 16, fontSize: "0.85rem" }}>Releases: {releases.map((r) => r.title).join(" / ")}. Full details <Link href="/worlds/pulse" style={{ textDecoration: "underline" }}>at the label →</Link></p>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.8rem" }}>Photocopied 200×. If you&apos;re reading this, you were there.</p>
      </div>
      <WorldProof
        proves="One poster that does the job of a campaign: dates, prices, releases. Loud because the night is."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

export function PulseVinyl() {
  return (
    <div style={{ background: "#0d0716", color: "#e9defc", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/VINYL" />
      <PulseNav current="vinyl" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#9d5cff" }}>SLEEVE NOTES · 33⅓ RPM · PLAY LOUD</p>
        {releases.map((r, ri) => (
          <section key={r.slug} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, padding: "32px 0", borderBottom: "1px solid rgba(233,222,252,0.2)" }} className="grid-2">
            <div>
              <p style={{ color: "#9d5cff", fontSize: 12, letterSpacing: "0.25em" }}>SIDE {ri === 0 ? "A" : "B"} · {r.artist.toUpperCase()}</p>
              <h2 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", margin: "8px 0", lineHeight: 0.95 }}>{r.title}</h2>
              <p style={{ color: "#8f7fb8" }}>{r.note}</p>
              <Link href={`/worlds/pulse/${r.slug}`} style={{ color: "#9d5cff", textDecoration: "underline" }}>Full release →</Link>
            </div>
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {r.tracks.map((t, i) => (
                <li key={t.name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(233,222,252,0.12)" }}>
                  <span>{String.fromCharCode(65 + ri)}{i + 1}. {t.name}</span>
                  <span style={{ color: "#8f7fb8" }}>{fmtSecs(t.secs)}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

export function PulseOceanic() {
  return (
    <div style={{ background: "#04121e", color: "#bfe0ff", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/SUBMERGED" />
      <PulseNav current="oceanic" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", color: "#2e98c9" }}>RECORDED AT DEPTH · SLOW REVERB ONLY</p>
        <h1 style={{ fontSize: "clamp(3rem, 11vw, 7rem)", lineHeight: 0.9, margin: "12px 0", fontWeight: 800 }}>SUBMERGED</h1>
        {releases.map((r) => {
          const total = r.tracks.reduce((n, t) => n + t.secs, 0);
          return (
            <div key={r.slug} style={{ borderTop: "1px solid rgba(191,224,255,0.25)", padding: "28px 0" }}>
              <p style={{ color: "#2e98c9", fontSize: 12, letterSpacing: "0.25em", margin: 0 }}>{r.artist.toUpperCase()} · {r.tracks.length} TRACKS · {fmtSecs(total)}</p>
              <h2 style={{ fontSize: "2rem", margin: "8px 0" }}>
                <Link href={`/worlds/pulse/${r.slug}`} style={{ textDecoration: "underline" }}>{r.title}</Link>
              </h2>
              <p style={{ color: "#5f8fb0", maxWidth: "46ch", margin: "0 auto" }}>{r.note}</p>
            </div>
          );
        })}
        <div style={{ marginTop: 24 }}>
          {shows.filter((s) => s.status !== "Sold out").slice(0, 3).map((s) => (
            <p key={s.id} style={{ color: "#5f8fb0" }}>{s.date} — {s.city}, {s.venue}</p>
          ))}
          <p><Link href="/worlds/pulse" style={{ color: "#2e98c9", textDecoration: "underline" }}>Surface for tickets →</Link></p>
        </div>
      </div>
      <WorldProof
        proves="The label at forty fathoms: slower, bluer, same release dates. Mood is a mix setting."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

export function PulseSetlist() {
  const set = releases[0];
  const encore = releases[1].tracks.slice(0, 2);
  return (
    <div style={{ background: "#ece8df", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/SETLIST" />
      <PulseNav current="setlist" />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>TAPED TO THE STAGE · DO NOT REMOVE · {set.tracks.length} SONGS + ENCORE</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 9vw, 5.5rem)", margin: "8px 0", fontWeight: 900 }}>SETLIST</h1>
        <p style={{ fontSize: 12, letterSpacing: "0.2em" }}>TONIGHT: {set.artist.toUpperCase()} PLAYS “{set.title.toUpperCase()}” FRONT TO BACK</p>
        <ol style={{ listStyle: "none", margin: "28px 0 0", padding: 0, borderTop: "3px solid #111" }}>
          {set.tracks.map((t, i) => (
            <li key={t.name} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 4px", borderBottom: "1px solid #111", fontSize: "1.05rem" }}>
              <span><strong style={{ marginRight: 12 }}>{String(i + 1).padStart(2, "0")}</strong>{t.name}</span>
              <span>{fmtSecs(t.secs)}</span>
            </li>
          ))}
        </ol>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", marginTop: 24 }}>ENCORE (IF LOUD ENOUGH)</p>
        {encore.map((t, i) => (
          <p key={t.name} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #111", padding: "8px 4px", margin: 0 }}>
            <span>E{i + 1} · {t.name}</span><span>{fmtSecs(t.secs)}</span>
          </p>
        ))}
        <p style={{ fontSize: 11, letterSpacing: "0.3em", marginTop: 32 }}>ON TOUR</p>
        {shows.map((s) => (
          <p key={s.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(17,17,17,0.25)", padding: "8px 4px", margin: 0 }}>
            <span>{s.date} — {s.city}, {s.venue}</span>
            <strong style={{ color: s.status === "Sold out" ? "#8a8a8a" : s.status === "Low" ? "#b24a2e" : "#1d7a35" }}>{s.status.toUpperCase()}</strong>
          </p>
        ))}
        <p style={{ marginTop: 24 }}><Link href={`/worlds/pulse/${set.slug}`} style={{ textDecoration: "underline", fontWeight: 700 }}>The record behind the night →</Link></p>
      </div>
      <WorldProof
        proves="The gig as interface: set order, runtimes, tour dates with honest scarcity — fandom that converts."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

export function PulseBooth() {
  return (
    <div style={{ background: "#0d0716", color: "#e9defc", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/BOOTH" />
      <PulseNav current="booth" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#9d5cff" }}>BOOTH · TWO DECKS · CRATES BELOW</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>Booth.</h1>
        <p style={{ color: "#8f7fb8" }}>The catalogue as crates. Every record with its full runtime — add them up, that is the night.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginTop: 28 }}>
          {releases.map((r) => {
            const total = r.tracks.reduce((n, t) => n + t.secs, 0);
            return (
              <div key={r.slug} style={{ border: "1px solid rgba(233,222,252,0.3)", background: "#150c24", padding: 18 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "#9d5cff", margin: 0 }}>CRATE · {r.artist.toUpperCase()} · {fmtSecs(total)} TOTAL</p>
                <h2 style={{ fontSize: "1.5rem", margin: "8px 0" }}>
                  <Link href={`/worlds/pulse/${r.slug}`} style={{ color: "#e9defc", textDecoration: "underline" }}>{r.title}</Link>
                </h2>
                {r.tracks.map((t, i) => (
                  <p key={t.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderBottom: "1px dashed rgba(233,222,252,0.2)", padding: "5px 0", margin: 0 }}>
                    <span><span style={{ color: "#8f7fb8" }}>{String(i + 1).padStart(2, "0")}</span> {t.name}</span>
                    <span>{fmtSecs(t.secs)}</span>
                  </p>
                ))}
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: 24, color: "#8f7fb8" }}>Crates dug. <Link href="/worlds/pulse" style={{ color: "#9d5cff", textDecoration: "underline" }}>Back to the label →</Link></p>
      </div>
      <WorldProof
        proves="Crates, not cards: the catalogue organized the way DJs think — by runtime, by night."
        relatedHref="/worlds/archive"
        relatedName="ARCHIVE"
      />
    </div>
  );
}

export function PulseBoard() {
  const [going, setGoing] = useState<string[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoing(loadJson<string[]>(GOING_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(GOING_KEY, going);
  }, [going]);
  return (
    <div style={{ background: "#0b0b0b", color: "#f5c518", minHeight: "100dvh", fontFamily: "var(--font-code)", paddingBottom: 80 }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/BOARD" />
      <PulseNav current="board" />
      <div style={{ padding: "32px 20px 0" }}>
        <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)", lineHeight: 1, margin: 0 }}>DEPARTURES</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Label tour · tap a row to claim a night</p>
        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table style={{ width: "100%", minWidth: 640, textAlign: "left", fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
            <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Tour dates</caption>
            <thead style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
              <tr>
                <th style={{ padding: "8px 0" }}>Date</th><th>City</th><th>Venue</th><th>Status</th><th><span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Claim</span></th>
              </tr>
            </thead>
            <tbody>
              {shows.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid rgba(255,255,255,0.12)", opacity: s.status === "Sold out" ? 0.7 : 1 }}>
                  <td style={{ padding: "12px 0" }}>{s.date}</td>
                  <td>{s.city}</td>
                  <td>{s.venue}</td>
                  <td style={{ color: s.status === "Sold out" ? "#ff5a5a" : s.status === "Low" ? "#ffb020" : "#3ddc84" }}>{s.status.toUpperCase()}</td>
                  <td style={{ textAlign: "right" }}>
                    {s.status === "Sold out" ? (
                      <span style={{ fontSize: 12, color: "#ff5a5a" }}>GONE</span>
                    ) : (
                      <button
                        type="button"
                        aria-pressed={going.includes(s.id)}
                        onClick={() => setGoing(going.includes(s.id) ? going.filter((x) => x !== s.id) : [...going, s.id])}
                        style={{ border: "1px solid #f5c518", background: going.includes(s.id) ? "#f5c518" : "transparent", color: going.includes(s.id) ? "#000" : "#f5c518", padding: "8px 14px", fontSize: 12 }}
                      >
                        {going.includes(s.id) ? "✓ Going" : "Claim"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {going.length > 0 && (
          <p style={{ marginTop: 16, fontSize: "0.9rem" }}>{going.length} night{going.length === 1 ? "" : "s"} claimed. See you down front.</p>
        )}
      </div>
      <WorldProof
        proves="The tour as a departures board: dates, scarcity, commitment — no account required."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

function releaseParams(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { bpm: 96 + (h % 32), minor: h % 2 === 0, seed: h % 1000, hue: h % 360 };
}

export function PulseSound() {
  const [rid, setRid] = useState(releases[0].slug);
  const [on, setOn] = useState(false);
  const [vol, setVol] = useState(0.6);
  const [mute, setMute] = useState(false);
  const ac = useRef<{ ctx: AudioContext; out: GainNode; an: AnalyserNode; stop: () => void } | null>(null);
  const cv = useRef<HTMLCanvasElement | null>(null);
  const rel = releases.find((r) => r.slug === rid) ?? releases[0];
  const P = releaseParams(rel.slug);
  useEffect(() => {
    if (vol >= 0 && ac.current) ac.current.out.gain.value = mute ? 0 : vol;
  }, [vol, mute]);
  useEffect(() => () => {
    ac.current?.stop();
    ac.current?.ctx.close().catch(() => {});
  }, []);
  async function start() {
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const out = ctx.createGain();
    const an = ctx.createAnalyser();
    an.fftSize = 256;
    out.connect(an);
    an.connect(ctx.destination);
    out.gain.value = mute ? 0 : vol;
    const R = mulberry(P.seed * 77);
    const step = 60 / P.bpm / 4;
    const scale = P.minor ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9];
    const root = 38 + ((P.seed * 3) % 10);
    const f = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
    const bass = Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? scale[Math.floor(R() * 3)] : R() > 0.72 ? scale[Math.floor(R() * 5)] : -1));
    const arp = Array.from({ length: 16 }, () => (R() > 0.45 ? scale[Math.floor(R() * 5)] + 24 : -1));
    const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const tone = (type: OscillatorType, fr: number, t: number, d: number, v: number, cut = 2000) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const fl = ctx.createBiquadFilter();
      o.type = type;
      o.frequency.value = fr;
      fl.type = "lowpass";
      fl.frequency.value = cut;
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(fl);
      fl.connect(g);
      g.connect(out);
      o.start(t);
      o.stop(t + d + 0.02);
    };
    const noise = (t: number, d: number, v: number, hp: number) => {
      const s = ctx.createBufferSource();
      const g = ctx.createGain();
      const fl = ctx.createBiquadFilter();
      s.buffer = nb;
      fl.type = "highpass";
      fl.frequency.value = hp;
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d);
      s.connect(fl);
      fl.connect(g);
      g.connect(out);
      s.start(t);
      s.stop(t + d + 0.02);
    };
    const kick = (t: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g);
      g.connect(out);
      o.start(t);
      o.stop(t + 0.32);
    };
    let next = ctx.currentTime + 0.06;
    let i = 0;
    const timer = window.setInterval(() => {
      while (next < ctx.currentTime + 0.15) {
        const s = i % 16;
        if (P.bpm > 100 ? s % 4 === 0 : s === 0 || s === 8) kick(next);
        if (s % 2 === 1) noise(next, 0.04, 0.12, 7000);
        if (s === 4 || s === 12) {
          noise(next, 0.14, 0.3, 1500);
          tone("triangle", 190, next, 0.1, 0.25);
        }
        if (bass[s] >= 0) tone("sawtooth", f(root + bass[s]), next, step * 1.8, 0.28, 500 + Math.floor(i / 16) * 150);
        if (arp[s] >= 0) tone("square", f(root + arp[s]), next, step * 0.9, 0.06, 2600);
        next += step;
        i++;
      }
    }, 25);
    ac.current = {
      ctx,
      out,
      an,
      stop: () => window.clearInterval(timer),
    };
    setOn(true);
  }
  function kill() {
    ac.current?.stop();
    ac.current?.ctx.close().catch(() => {});
    ac.current = null;
    setOn(false);
  }
  useEffect(() => {
    if (!on) return;
    const canvas = cv.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !ac.current) return;
    const an = ac.current.an;
    const buf = new Uint8Array(an.frequencyBinCount);
    let raf = 0;
    const draw = () => {
      const W = (canvas.width = canvas.offsetWidth);
      const H = (canvas.height = 160);
      an.getByteFrequencyData(buf);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      const n = 48;
      for (let k = 0; k < n; k++) {
        const v = buf[Math.floor((k / n) * buf.length)] / 255;
        ctx.fillStyle = `hsl(${P.hue + k * 2},90%,${50 + v * 20}%)`;
        ctx.fillRect((k * W) / n + 1, H - v * H, W / n - 2, v * H);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [on, P.hue]);
  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100dvh", fontFamily: "var(--font-code)", paddingBottom: 80 }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/SOUND" />
      <PulseNav current="sound" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 0" }}>
        <h1 style={{ fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.9, margin: 0 }}>SOUND</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", maxWidth: "60ch" }}>
          Every release owns a seed. Tempo, scale and patterns generate from it in real time — nothing sampled, nothing autoplays.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
          {releases.map((r) => {
            const q = releaseParams(r.slug);
            return (
              <button
                key={r.slug}
                type="button"
                aria-pressed={rid === r.slug}
                onClick={() => setRid(r.slug)}
                style={{ border: "1px solid rgba(255,255,255,0.3)", background: rid === r.slug ? "#fff" : "transparent", color: rid === r.slug ? "#000" : "#fff", padding: "10px 14px", fontSize: 12 }}
              >
                {r.title} · {q.bpm} BPM {q.minor ? "minor" : "major"}
              </button>
            );
          })}
        </div>
        <canvas ref={cv} style={{ width: "100%", height: 160, display: "block", border: "1px solid rgba(255,255,255,0.2)", background: "#000", marginTop: 16 }} aria-label={on ? "Live audio spectrum" : "Audio spectrum, silent"} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
          <button type="button" onClick={() => (on ? kill() : void start())} style={{ background: "#fff", color: "#000", padding: "12px 24px", fontWeight: 700, border: 0 }}>
            {on ? "■ Stop" : "▶ Play generative mix"}
          </button>
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
            Volume
            <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(Number(e.target.value))} aria-label="Volume" />
          </label>
          <button type="button" aria-pressed={mute} onClick={() => setMute(!mute)} style={{ border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", padding: "10px 16px", fontSize: 12 }}>
            {mute ? "Unmute" : "Mute"}
          </button>
        </div>
        <p style={{ marginTop: 12 }}>Now: <strong>{rel.title}</strong> — {rel.artist}. {on ? "Playing." : "Stopped."}</p>
      </div>
      <WorldProof
        proves="Music as machinery: every release has a tempo, a scale, and a mix you can start."
        relatedHref="/worlds/signal"
        relatedName="SIGNAL"
      />
    </div>
  );
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function PulseNav({ current }: { current: string }) {
  return (
    <nav aria-label="PULSE realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#0d0716", color: "#e9defc", borderBottom: "1px solid rgba(233,222,252,0.25)", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/pulse" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800 }}>
        PULSE◌
      </Link>
      {[
        ["classic", "Signal", "/worlds/pulse"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="pulse"
          label={label}
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: current === id ? "#0d0716" : "#e9defc",
            background: current === id ? "#9d5cff" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </WorldNavLink>
      ))}
    </nav>
  );
}
