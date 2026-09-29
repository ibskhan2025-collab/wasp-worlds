"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { archiveCategories, archiveIssues } from "@/data/archive";
import { loadJson, saveJson } from "@/lib/storage";

const MARK_KEY = "wasp-v11-archive-marks";

type Marks = { saved: string[]; read: string[] };

export default function ArchiveHome() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [marks, setMarks] = useState<Marks>({ saved: [], read: [] });
  const [onlySaved, setOnlySaved] = useState(false);

  // Hydrate persisted marks after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMarks(loadJson<Marks>(MARK_KEY, { saved: [], read: [] }));
  }, []);
  useEffect(() => {
    saveJson(MARK_KEY, marks);
  }, [marks]);
  const list = useMemo(
    () =>
      archiveIssues.filter(
        (a) =>
          (cat === "All" || a.category === cat) &&
          (!onlySaved || marks.saved.includes(a.slug)) &&
          `${a.title} ${a.dek} ${a.body.join(" ")}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [cat, q, onlySaved, marks.saved],
  );
  const featured = list.filter((a) => a.featured);

  function toggleSaved(slug: string) {
    setMarks((m) => ({
      ...m,
      saved: m.saved.includes(slug) ? m.saved.filter((x) => x !== slug) : [...m.saved, slug],
    }));
  }

  return (
    <div className="arc-root">
      <WorldExit id="archive" label="Room 07 · ARCHIVE" />
      <header style={{ padding: "32px 20px 12px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <p className="kicker">Vol. 04 · Independent</p>
          <p className="kicker">A magazine, not a blog skin</p>
        </div>
        <h1 className="arc-hero-title">THE ARCHIVE</h1>
        <p style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <Link href="/worlds/archive/about" className="kicker">Manifesto →</Link>
          <Link href="/worlds/archive/letters" className="kicker">Letters →</Link>
        </p>
      </header>
      <div style={{ padding: "16px 20px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the issue"
          aria-label="Search articles"
          style={{ background: "transparent", border: "1px solid var(--line)", padding: 8, minWidth: 180 }}
        />
        {archiveCategories.map((c) => (
          <button key={c} className={cat === c ? "chip-on" : "chip"} type="button" onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
        <button className={onlySaved ? "chip-on" : "chip"} type="button" onClick={() => setOnlySaved((v) => !v)} aria-pressed={onlySaved}>
          ♥ Saved ({marks.saved.length})
        </button>
        {marks.read.length ? <span className="kicker">Read {marks.read.length}/{archiveIssues.length}</span> : null}
      </div>
      <section style={{ padding: "8px 20px 40px" }}>
        {featured[0] ? (
          <Link href={`/worlds/archive/${featured[0].slug}`} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }} className="grid-2">
            <img src={featured[0].image} alt={featured[0].title} fetchPriority="high" decoding="async" style={{ width: "100%", minHeight: 260, objectFit: "cover", filter: "grayscale(0.4)" }} />
            <div>
              <p className="kicker">{featured[0].category} · {featured[0].read}</p>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 0.95 }}>{featured[0].title}</h2>
              <p>{featured[0].dek}</p>
            </div>
          </Link>
        ) : null}
        <div style={{ marginTop: 36, display: "grid", gap: 0 }}>
          {list.map((a) => (
            <div key={a.slug} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto auto", gap: 16, padding: "18px 0", borderTop: "1px solid var(--line)", alignItems: "center" }}>
              <span className="kicker">{a.category}</span>
              <Link href={`/worlds/archive/${a.slug}`}>
                <strong>{a.title}{marks.read.includes(a.slug) ? " · ✓" : ""}</strong>
                <div style={{ color: "var(--muted)" }}>{a.dek}</div>
              </Link>
              <span className="kicker">{a.date}</span>
              <button
                type="button"
                className={marks.saved.includes(a.slug) ? "chip-on" : "chip"}
                aria-pressed={marks.saved.includes(a.slug)}
                aria-label={marks.saved.includes(a.slug) ? `Unsave ${a.title}` : `Save ${a.title}`}
                onClick={() => toggleSaved(a.slug)}
              >
                {marks.saved.includes(a.slug) ? "♥" : "♡"}
              </button>
            </div>
          ))}
        </div>
        {list.length === 0 ? <p>Nothing filed under that.</p> : null}
      </section>
      <WorldProof
        proves="Readers stay when a publication keeps its promises. Progress bars, memory, search that works — the unglamorous machinery of being read."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}
