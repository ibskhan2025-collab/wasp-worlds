"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/worlds/lightbox";
import { casaGallery } from "@/data/casa";

export default function CasaGallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ padding: "24px 16px 80px" }}>
      <p className="kicker">The room</p>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 500 }}>Gallery</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8, marginTop: 24 }}>
        {casaGallery.map((img, i) => (
          <button key={img.src} type="button" onClick={() => setOpen(i)} style={{ border: 0, padding: 0, background: "none", position: "relative", height: 220 }} aria-label={`Open ${img.alt}`}>
            <Image src={img.src} alt={img.alt} fill sizes="(max-width: 820px) 50vw, 33vw" style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>
      {open !== null ? (
        <Lightbox images={casaGallery.map((g) => ({ src: g.src, alt: g.alt }))} index={open} onClose={() => setOpen(null)} onMove={setOpen} />
      ) : null}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32 }}>
        <Link className="btn" href="/worlds/casa/reservations">Hungry? Book →</Link>
        <Link className="btn ghost" href="/worlds/casa/menu">See the menu</Link>
      </div>
    </div>
  );
}
