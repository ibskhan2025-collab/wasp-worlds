"use client";

import Link from "next/link";
import { useState } from "react";
import { Lightbox } from "@/components/worlds/lightbox";
import { objectProducts } from "@/data/objects";

export function GalleryGrid() {
  const [open, setOpen] = useState<number | null>(null);
  const images = objectProducts.map((p) => ({ src: p.image, alt: `${p.name} — ${p.category}` }));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, padding: "0 20px" }}>
        {objectProducts.map((p, i) => (
          <div key={p.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open ${p.name}`}
              style={{ border: 0, padding: 0, background: "none", width: "100%", position: "relative", aspectRatio: "4/5", display: "block" }}
            >
              <img src={p.image} alt={p.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
              <Link href={`/worlds/objects/product/${p.id}`}>{p.name}</Link>
              <span className="kicker">{p.option}</span>
            </div>
          </div>
        ))}
      </div>
      {open !== null ? (
        <Lightbox images={images} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
      ) : null}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "32px 20px 0" }}>
        <Link className="btn" href="/worlds/objects/shop">Shop the work →</Link>
        <Link className="btn ghost" href="/worlds/objects/makers">Meet the makers</Link>
      </div>
    </div>
  );
}
