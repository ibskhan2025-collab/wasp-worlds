"use client";

import Link from "next/link";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { archiveIssues } from "@/data/archive";

export function ArchiveTyper() {
  return (
    <div style={{ background: "#ece7db", color: "#1a1712", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/TYPER" />
      <RealityShell world="archive" current="typer" basePath="/worlds/archive" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ letterSpacing: "0.25em", fontSize: 11 }}>DRAFT · DO NOT CIRCULATE</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.2rem)", margin: "8px 0 8px" }}>THE ARCHIVE, TYPED.</h1>
        <p>Every essay below was hammered out at 2am. Typos fixed in pencil.</p>
        {archiveIssues.map((a, i) => (
          <article key={a.slug} style={{ borderTop: "2px solid #1a1712", padding: "20px 0" }}>
            <p style={{ margin: 0, fontSize: 12 }}>p.{(i + 1) * 4} ┄┄┄ {a.category.toUpperCase()} ┄┄┄ {a.read.toUpperCase()}</p>
            <h2 style={{ fontSize: "1.6rem", margin: "8px 0" }}>
              <Link href={`/worlds/archive/${a.slug}`} style={{ textDecoration: "underline" }}>{a.title}</Link>
            </h2>
            <p style={{ fontSize: "0.95rem" }}>{a.dek}</p>
            <p style={{ fontSize: "0.85rem", opacity: 0.75 }}>{a.body[0].slice(0, 140)}… <Link href={`/worlds/archive/${a.slug}`} style={{ textDecoration: "underline" }}>[read]</Link></p>
          </article>
        ))}
      </div>
      <WorldProof
        proves="Same essays, typewriter honesty. Long-form that survives being stripped of all design."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}

export function ArchiveTerminal() {
  const [slug, setSlug] = useState(archiveIssues[0].slug);
  const a = archiveIssues.find((x) => x.slug === slug) ?? archiveIssues[0];
  return (
    <div style={{ background: "#0c120c", color: "#cfe3c8", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/TERMINAL" />
      <RealityShell world="archive" current="terminal" basePath="/worlds/archive" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ color: "#3ddc84" }}>$ archive --night --list</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 24px" }}>
          {archiveIssues.map((x) => (
            <button
              key={x.slug}
              type="button"
              onClick={() => setSlug(x.slug)}
              aria-pressed={slug === x.slug}
              style={{
                background: slug === x.slug ? "#3ddc84" : "transparent",
                color: slug === x.slug ? "#0c120c" : "#cfe3c8",
                border: "1px solid #3ddc84", padding: "8px 12px", fontFamily: "inherit", fontSize: 12,
              }}
            >
              ./{x.slug}
            </button>
          ))}
        </div>
        <p style={{ color: "#3ddc84" }}>$ archive --read {a.slug}</p>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.4rem)", lineHeight: 1.05 }}>{a.title}</h1>
        <p style={{ color: "#7a8f72" }}>{a.category} · {a.read} · {a.date}</p>
        {a.body.map((p) => (
          <p key={p.slice(0, 32)} style={{ lineHeight: 1.7 }}>&gt; {p}</p>
        ))}
        <p style={{ color: "#7a8f72" }}>$ <span style={{ animation: "blink 1s steps(2) infinite" }}>|</span> <Link href={`/worlds/archive/${a.slug}`} style={{ color: "#3ddc84", textDecoration: "underline" }}>open full article →</Link></p>
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
      </div>
    </div>
  );
}

export function ArchivePoster() {
  return (
    <div style={{ background: "#14100c", color: "#f3ead8", minHeight: "100dvh" }}>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/POSTER" />
      <RealityShell world="archive" current="poster" basePath="/worlds/archive" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#e23a3a" }}>PASTED OVERNIGHT · READ BY MORNING</p>
        {archiveIssues.map((a, i) => (
          <article key={a.slug} style={{ borderBottom: "1px solid rgba(243,234,216,0.2)", padding: "40px 0", transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}>
            <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#e23a3a", margin: 0 }}>{a.category.toUpperCase()} · {a.read.toUpperCase()}</p>
            <h2 style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 0.9, letterSpacing: "-0.03em", margin: "10px 0" }}>
              <Link href={`/worlds/archive/${a.slug}`}>{a.title}</Link>
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#f3ead8bb", maxWidth: "40ch" }}>{a.dek}</p>
          </article>
        ))}
      </div>
      <WorldProof
        proves="Headlines as objects. Six essays set like protest posters — still fully readable."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

export function ArchiveStacks() {
  const cats = [...new Set(archiveIssues.map((a) => a.category))];
  return (
    <div style={{ background: "#241a12", color: "#e8ddc4", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/STACKS" />
      <RealityShell world="archive" current="stacks" basePath="/worlds/archive" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c9a86d" }}>CLOSED STACKS · FETCHED BY HAND · {archiveIssues.length} VOLUMES</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 9vw, 6rem)", fontWeight: 400, margin: "8px 0" }}>The Stacks.</h1>
        <p style={{ fontStyle: "italic", color: "#a89878" }}>Every issue shelved by section. Pull a spine — the full essay is on the shelf behind it.</p>
        {cats.map((cat) => (
          <section key={cat} style={{ marginTop: 36 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c9a86d" }}>SECTION · {cat.toUpperCase()}</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, borderBottom: "12px solid #3a2c1c", paddingBottom: 0, paddingTop: 12 }}>
              {archiveIssues.filter((a) => a.category === cat).map((a) => (
                <Link key={a.slug} href={`/worlds/archive/${a.slug}`} title={`${a.title} — ${a.dek}`}
                  style={{ display: "block", width: 64 + (a.title.length % 3) * 14, height: 190 + (a.body.length % 3) * 22, background: a.featured ? "#8a3b1f" : "#4a3a26", color: "#e8ddc4", textDecoration: "none", padding: "12px 8px", borderLeft: "3px solid rgba(232,221,196,0.35)" }}>
                  <span style={{ display: "block", transform: "rotate(180deg)", writingMode: "vertical-rl", fontSize: "0.8rem", height: "100%", overflow: "hidden" }}>{a.title}</span>
                </Link>
              ))}
            </div>
            {archiveIssues.filter((a) => a.category === cat).map((a) => (
              <p key={a.slug} style={{ fontSize: "0.9rem", margin: "8px 0 0" }}>
                <Link href={`/worlds/archive/${a.slug}`} style={{ textDecoration: "underline" }}>{a.title}</Link>
                <span style={{ color: "#a89878" }}> · {a.dek} · {a.read}</span>
              </p>
            ))}
          </section>
        ))}
      </div>
      <WorldProof
        proves="The library as interface: shelves you can pull from — every spine opens the real essay."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}

export function ArchiveReading() {
  const lead = archiveIssues.find((a) => a.featured) ?? archiveIssues[0];
  const rest = archiveIssues.filter((a) => a.slug !== lead.slug);
  return (
    <div style={{ background: "#faf7f0", color: "#141210", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/READING" />
      <RealityShell world="archive" current="reading" basePath="/worlds/archive" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "56px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", textAlign: "center" }}>READING ROOM · SILENCE FROM 09:00 · {lead.read} READ</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.2rem)", fontWeight: 400, textAlign: "center", margin: "16px 0 8px" }}>{lead.title}</h1>
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#6a6254" }}>{lead.dek} — {lead.author}, {lead.date}</p>
        <div style={{ marginTop: 40 }}>
          {lead.body.map((para, i) => (
            <p key={i} style={{ fontSize: "1.15rem", lineHeight: 1.75, margin: "0 0 1.4em" }}>
              {i === 0 ? <span style={{ float: "left", fontSize: "4.2rem", lineHeight: 0.85, paddingRight: 10, fontWeight: 700 }}>{para.charAt(0)}</span> : null}
              {i === 0 ? para.slice(1) : para}
            </p>
          ))}
        </div>
        <p style={{ textAlign: "center" }}><Link href={`/worlds/archive/${lead.slug}`} style={{ textDecoration: "underline" }}>Continue in the issue →</Link></p>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", marginTop: 48 }}>ALSO ON THE TABLE</p>
        {rest.map((a) => (
          <p key={a.slug} style={{ borderTop: "1px solid rgba(20,18,16,0.2)", padding: "12px 0", margin: 0 }}>
            <Link href={`/worlds/archive/${a.slug}`} style={{ textDecoration: "underline", fontSize: "1.1rem" }}>{a.title}</Link>
            <br /><span style={{ fontSize: "0.9rem", color: "#6a6254" }}>{a.dek} · {a.read}</span>
          </p>
        ))}
      </div>
      <WorldProof
        proves="Reading as the product: full essays, set for stamina — the archive earns keep-you-here minutes."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}
