"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { stillCollections, stillPhotographer } from "@/data/still";
import { loadJson, saveJson } from "@/lib/storage";

const COL_KEY = "wasp-v11-still-collection";
const FAV_KEY = "wasp-v11-still-favs";

export default function StillPage() {
  const [col, setCol] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [onlyFavs, setOnlyFavs] = useState(false);

  // Hydrate persisted prefs after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCol(loadJson<string>(COL_KEY, "all"));
    setFavs(loadJson<string[]>(FAV_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(COL_KEY, col);
  }, [col]);
  useEffect(() => {
    saveJson(FAV_KEY, favs);
  }, [favs]);

  const images = useMemo(() => {
    const source = col === "all" ? stillCollections : stillCollections.filter((c) => c.id === col);
    const all = source.flatMap((c) => c.images.map((img) => ({ ...img, collection: c.title })));
    return onlyFavs ? all.filter((img) => favs.includes(img.src)) : all;
  }, [col, onlyFavs, favs]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((n) => (n === null ? n : (n + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((n) => (n === null ? n : (n - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <div className="still-root">
      <WorldExit id="still" label="Room 04 · STILL" />
      <header style={{ padding: "28px 20px 8px", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p className="kicker">{stillPhotographer.name}</p>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", margin: 0, fontWeight: 400, letterSpacing: "-0.04em" }}>STILL</h1>
          <p style={{ maxWidth: "36ch" }}>{stillPhotographer.bio}</p>
          <p style={{ display: "flex", gap: 16 }}>
            <Link href="/worlds/still/about" className="kicker">About →</Link>
            <Link href="/worlds/still/prints" className="kicker">Prints →</Link>
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
          <button className={col === "all" ? "chip-on" : "chip"} type="button" onClick={() => setCol("all")}>Contact sheet</button>
          {stillCollections.map((c) => (
            <button key={c.id} className={col === c.id ? "chip-on" : "chip"} type="button" onClick={() => setCol(c.id)}>
              {c.title}
            </button>
          ))}
          <button className={onlyFavs ? "chip-on" : "chip"} type="button" onClick={() => setOnlyFavs((v) => !v)} aria-pressed={onlyFavs}>
            ♥ Kept ({favs.length})
          </button>
        </div>
      </header>
      <div className="still-sheet">
        {images.map((img, i) => (
          <button key={`${img.src}-${i}`} type="button" onClick={() => setOpen(i)} aria-label={`Open ${img.alt}`} style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
            <Image src={img.src} alt={img.alt} fill sizes="(max-width: 820px) 33vw, 16vw" style={{ objectFit: "cover" }} />
            {favs.includes(img.src) ? (
              <span aria-hidden style={{ position: "absolute", top: 6, right: 8, color: "#fff", fontSize: 18 }}>♥</span>
            ) : null}
          </button>
        ))}
      </div>
      {images.length === 0 ? <p className="kicker" style={{ padding: "0 20px 40px" }}>Nothing kept yet — open a picture and keep it.</p> : null}
      {col !== "all" ? (
        <p className="kicker" style={{ padding: "0 20px 40px" }}>
          {stillCollections.find((c) => c.id === col)?.note}
        </p>
      ) : null}
      <div style={{ display: "flex", gap: 16, padding: "0 20px 60px" }}>
        <Link href="/worlds/still/prints" className="kicker">Like one? Prints →</Link>
        <Link href="/worlds/still/about" className="kicker">About →</Link>
      </div>
      <WorldProof
        proves="Twelve photographs and the confidence to stop there. No frameworks, no effects libraries, no noise."
        relatedHref="/worlds/archive"
        relatedName="ARCHIVE"
      />
      {open !== null && images[open] ? (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button type="button" className="ghost" style={{ position: "absolute", top: 16, right: 16 }} onClick={() => setOpen(null)}>
            Close
          </button>
          <button type="button" className="ghost" style={{ position: "absolute", left: 16 }} onClick={() => setOpen((open - 1 + images.length) % images.length)}>
            Prev
          </button>
          <img src={images[open].src} alt={images[open].alt} />
          <button type="button" className="ghost" style={{ position: "absolute", right: 16 }} onClick={() => setOpen((open + 1) % images.length)}>
            Next
          </button>
          <div style={{ position: "absolute", bottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <p className="kicker" style={{ margin: 0 }}>{images[open].collection} · {open + 1} / {images.length} · arrows · esc</p>
            <button
              type="button"
              className={favs.includes(images[open].src) ? "chip-on" : "chip"}
              aria-pressed={favs.includes(images[open].src)}
              onClick={() =>
                setFavs((f) => (f.includes(images[open].src) ? f.filter((x) => x !== images[open].src) : [...f, images[open].src]))
              }
            >
              {favs.includes(images[open].src) ? "♥ Kept" : "♡ Keep"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
