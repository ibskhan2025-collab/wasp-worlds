"use client";

import { useState } from "react";
import { casaGallery } from "@/data/casa";

export default function CasaGallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ padding: "24px 16px 80px" }}>
      <p className="kicker">The room</p>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 500 }}>Gallery</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8, marginTop: 24 }}>
        {casaGallery.map((img, i) => (
          <button key={img.src} type="button" onClick={() => setOpen(i)} style={{ border: 0, padding: 0, background: "none" }}>
            <img src={img.src} alt={img.alt} style={{ width: "100%", height: 220, objectFit: "cover" }} />
          </button>
        ))}
      </div>
      {open !== null ? (
        <div className="lightbox" role="dialog" aria-label="Image">
          <button type="button" className="ghost" onClick={() => setOpen(null)} style={{ position: "absolute", top: 16, right: 16 }}>
            Close
          </button>
          <img src={casaGallery[open].src} alt={casaGallery[open].alt} />
        </div>
      ) : null}
    </div>
  );
}
