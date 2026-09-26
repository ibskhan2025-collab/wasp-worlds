"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Lightbox } from "@/components/worlds/lightbox";
import { noirProducts } from "@/data/noir";
import { money } from "@/lib/use-cart";

const LOOKS = [
  { title: "Look 01 — Column", note: "The uniform. One coat, everything else disappears.", pieces: ["coat-01", "hat-01"], img: 0 },
  { title: "Look 02 — Night", note: "Leather that behaves like tailoring.", pieces: ["leather-01", "hat-01"], img: 1 },
  { title: "Look 03 — Bias", note: "Silk that moves when you do, over matte jersey.", pieces: ["dress-01", "dress-02"], img: 2 },
  { title: "Look 04 — Shadow", note: "Volume without apology.", pieces: ["coat-02", "mesh-01", "look-01"], img: 3 },
];

export function LookbookGrid() {
  const [open, setOpen] = useState<number | null>(null);
  const byId = new Map(noirProducts.map((p) => [p.id, p]));
  const images = LOOKS.map((l) => {
    const first = byId.get(l.pieces[0]);
    return { src: first?.image ?? "", alt: l.title };
  });

  return (
    <div>
      {LOOKS.map((look, i) => {
        const pieces = look.pieces.map((id) => byId.get(id)).filter((p) => p !== undefined);
        const total = pieces.reduce((n, p) => n + p.price, 0);
        return (
          <section key={look.title} style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 0 }} className="grid-2">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open ${look.title}`}
              style={{ border: 0, padding: 0, background: "none", position: "relative", minHeight: 480, display: "block", width: "100%" }}
            >
              <Image src={images[i].src} alt={images[i].alt} fill sizes="(max-width: 820px) 100vw, 55vw" style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.05)" }} />
            </button>
            <div style={{ padding: "48px 32px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#050505" }}>
              <p className="kicker">{look.title}</p>
              <p style={{ fontFamily: "var(--font-lux)", fontSize: "1.4rem", maxWidth: "26ch" }}>{look.note}</p>
              <div style={{ marginTop: 20 }}>
                {pieces.map((p) => (
                  <Link key={p.id} href={`/worlds/noir/product/${p.id}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderTop: "1px solid var(--line)", fontFamily: "var(--font-sans)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <span>{p.name}</span>
                    <span>{money(p.price)}</span>
                  </Link>
                ))}
              </div>
              <p className="kicker" style={{ marginTop: 12 }}>The look · {money(total)}</p>
            </div>
          </section>
        );
      })}
      {open !== null ? (
        <Lightbox images={images} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
      ) : null}
    </div>
  );
}
