import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorldExit } from "@/components/wasp/world-exit";
import { fmtSecs, releases } from "@/data/pulse";
import { Countdown } from "./countdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = releases.find((x) => x.slug === slug);
  return r ? { title: `${r.title} — PULSE`, description: r.note } : { title: "Release not found — PULSE" };
}

export default async function ReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = releases.find((x) => x.slug === slug);
  if (!r) return notFound();
  const total = r.tracks.reduce((n, t) => n + t.secs, 0);
  return (
    <div className="mot-root" style={{ fontFamily: "var(--font-sans)" }}>
      <WorldExit id="pulse" label="Room 12 · PULSE" />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/pulse" className="kicker" style={{ color: "#e23a3a" }}>← Releases</Link>
        <div className="grid-2" style={{ marginTop: 16, alignItems: "start" }}>
          <img src={r.cover} alt={`${r.title} cover`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
          <div>
            <p className="kicker" style={{ color: "#e23a3a" }}>{r.artist} · {r.date}</p>
            <h1 style={{ fontFamily: "var(--font-poster)", fontSize: "clamp(2.6rem, 7vw, 4.6rem)", lineHeight: 0.9, margin: "8px 0" }}>{r.title.toUpperCase()}</h1>
            <p style={{ color: "#ffffffaa" }}>{r.note}</p>
            {<Countdown date={r.date} tracks={r.tracks.length} total={fmtSecs(total)} />}
          </div>
        </div>
        <p className="kicker" style={{ marginTop: 32, color: "#e23a3a" }}>Tracklist</p>
        {r.tracks.map((t, i) => (
          <div key={t.name} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #ffffff22" }}>
            <span>0{i + 1} · {t.name}</span>
            <span style={{ color: "#ffffffaa" }}>{fmtSecs(t.secs)}</span>
          </div>
        ))}
        <p className="kicker" style={{ marginTop: 12 }}>Total {fmtSecs(total)}</p>
      </article>
    </div>
  );
}
