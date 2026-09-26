"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { archiveIssues } from "@/data/archive";
import { loadJson, saveJson } from "@/lib/storage";

const MARK_KEY = "wasp-v11-archive-marks";

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = archiveIssues.find((a) => a.slug === slug);
  const [p, setP] = useState(0);
  const [saved, setSaved] = useState(false);
  const marked = useRef(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const v = max > 0 ? window.scrollY / max : 0;
        setP(v);
        if (v > 0.9 && !marked.current) {
          marked.current = true;
          const m = loadJson<{ saved: string[]; read: string[] }>(MARK_KEY, { saved: [], read: [] });
          if (!m.read.includes(slug)) saveJson(MARK_KEY, { ...m, read: [...m.read, slug] });
        }
      });
    };
    onScroll();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadJson<{ saved: string[]; read: string[] }>(MARK_KEY, { saved: [], read: [] }).saved.includes(slug));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [slug]);
  if (!article) return <p style={{ padding: 24 }}>Not in this issue.</p>;
  const related = archiveIssues.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 2);

  return (
    <div className="arc-root">
      <WorldExit id="archive" label="Room 07 · ARCHIVE" />
      <div className="progress-bar" style={{ transform: `scaleX(${p})` }} />
      <article style={{ padding: "32px 20px 80px", maxWidth: 680, margin: "0 auto" }}>
        <Link href="/worlds/archive" className="kicker">← The Archive</Link>
        <p className="kicker" style={{ marginTop: 16 }}>{article.category} · {article.read} · {article.date}</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", lineHeight: 0.95 }}>{article.title}</h1>
        <p style={{ fontSize: "1.3rem" }}>{article.dek}</p>
        <p className="kicker">By {article.author}</p>
        <button
          type="button"
          className={saved ? "chip-on" : "chip"}
          aria-pressed={saved}
          style={{ marginTop: 8 }}
          onClick={() => {
            const m = loadJson<{ saved: string[]; read: string[] }>(MARK_KEY, { saved: [], read: [] });
            const next = m.saved.includes(slug) ? m.saved.filter((x) => x !== slug) : [...m.saved, slug];
            saveJson(MARK_KEY, { ...m, saved: next });
            setSaved(next.includes(slug));
          }}
        >
          {saved ? "♥ Saved" : "♡ Save for later"}
        </button>
        <img src={article.image} alt="" style={{ width: "100%", margin: "24px 0", filter: "grayscale(0.3)" }} />
        {article.body.map((para) => (
          <p key={para} style={{ fontSize: "1.15rem", lineHeight: 1.6 }}>
            {para}
          </p>
        ))}
        <hr className="rule" />
        <p className="kicker">Related</p>
        {related.map((r) => (
          <Link key={r.slug} href={`/worlds/archive/${r.slug}`} style={{ display: "block", marginTop: 8 }}>
            {r.title}
          </Link>
        ))}
      </article>
    </div>
  );
}
