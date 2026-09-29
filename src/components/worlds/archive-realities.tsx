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
        <p style={{ color: "#7a8f72" }}>$ <span style={{ animation: "blink 1s steps(2) infinite" }}>█</span> <Link href={`/worlds/archive/${a.slug}`} style={{ color: "#3ddc84", textDecoration: "underline" }}>open full article →</Link></p>
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
      </div>
    </div>
  );
}
