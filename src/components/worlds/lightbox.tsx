"use client";

import { useEffect } from "react";

export type LightboxImage = { src: string; alt: string; cap?: string };

/** Shared keyboard lightbox: Esc closes, arrows move, with counter. */
export function Lightbox({ images, index, onClose, onMove }: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const n = images.length;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove((index + 1) % n);
      if (e.key === "ArrowLeft") onMove((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onClose, onMove]);

  const img = images[index];
  if (!img) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={img.alt}>
      <button type="button" className="ghost" style={{ position: "absolute", top: 16, right: 16 }} onClick={onClose}>
        Close
      </button>
      <button type="button" className="ghost" aria-label="Previous image" style={{ position: "absolute", left: 16 }} onClick={() => onMove((index - 1 + n) % n)}>
        Prev
      </button>
      <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
      <button type="button" className="ghost" aria-label="Next image" style={{ position: "absolute", right: 16 }} onClick={() => onMove((index + 1) % n)}>
        Next
      </button>
      <p className="kicker" style={{ position: "absolute", bottom: 16 }}>
        {index + 1} / {n}{img.cap ? ` · ${img.cap}` : ""} · arrows · esc
      </p>
    </div>
  );
}
