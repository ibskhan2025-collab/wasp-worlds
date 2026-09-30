"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { fmtSecs, releases, shows } from "@/data/pulse";

export function PulseFlyer() {
  return (
    <div style={{ background: "#ece8df", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE/FLYER" />
      <RealityShell world="pulse" current="flyer" basePath="/worlds/pulse" />
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
      <RealityShell world="pulse" current="vinyl" basePath="/worlds/pulse" />
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
      <RealityShell world="pulse" current="oceanic" basePath="/worlds/pulse" />
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
      <RealityShell world="pulse" current="setlist" basePath="/worlds/pulse" />
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
      <RealityShell world="pulse" current="booth" basePath="/worlds/pulse" />
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
