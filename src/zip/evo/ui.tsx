"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { px, srcSet, type Photo } from "@/zip/evo/media";
import { useWasp } from "@/zip/evo/state";

/** Art-directed photograph: responsive srcset, lazy, credited, optional cursor-shift. */
export function Img({ p, className = "", sizes = "(min-width: 768px) 50vw, 100vw", shift = false, caption, eager, style, focal = "50% 50%" }: {
  p: Photo; className?: string; sizes?: string; shift?: boolean; caption?: boolean | string; eager?: boolean; style?: CSSProperties; focal?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const onMove = (e: React.PointerEvent) => {
    if (!shift || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    const img = ref.current.querySelector("img");
    if (img) img.style.transform = `scale(1.08) translate(${x * -14}px, ${y * -14}px)`;
  };
  const reset = () => { const img = ref.current?.querySelector("img"); if (img) img.style.transform = ""; };
  return (
    <figure className={`relative overflow-hidden ${className}`} style={style} ref={ref} onPointerMove={onMove} onPointerLeave={reset}>
      {failed ? (
        <div className="flex h-full w-full items-end bg-[repeating-linear-gradient(45deg,transparent_0_8px,rgba(0,0,0,.05)_8px_9px)] p-3">
          <span className="mono opacity-60">Image didn&apos;t load (offline?) — {p.alt}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={px(p, 1200)} srcSet={srcSet(p)} sizes={sizes} alt={p.alt} loading={eager ? "eager" : "lazy"} decoding="async"
          onLoad={() => setLoaded(true)} onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-[transform,opacity,filter] duration-[900ms] ease-[var(--ease-out)]"
          style={{ opacity: loaded ? 1 : 0, filter: loaded ? "none" : "blur(8px)", objectPosition: focal }}
        />
      )}
      {caption && (
        <figcaption className="mono pointer-events-none absolute bottom-2 left-2 bg-black/55 px-1.5 py-0.5 text-[9px] text-white/85">
          {typeof caption === "string" ? caption + " · " : ""}Photo: {p.by} / Pexels
        </figcaption>
      )}
    </figure>
  );
}

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (set(true), io.disconnect()), { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

export function Reveal({ children, className = "", as: As = "div" }: { children: ReactNode; className?: string; as?: "div" | "h2" | "p" }) {
  const [ref, v] = useInView<HTMLDivElement>();
  return <As ref={ref as never} className={`reveal ${v ? "in" : ""} ${className}`}>{children}</As>;
}

export function Kicker({ n, children }: { n?: string; children: ReactNode }) {
  return <p className="mono flex items-center gap-3 text-ink-2">{n && <span className="text-ink">{n}</span>}<span className="h-px w-8 bg-current" />{children}</p>;
}

/** Contextual conversion moment. Copy is passed in — never "Learn more". */
export function Moment({ q, cta, href = "/start", note }: { q: string; cta: string; href?: string; note?: string }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-y border-ink py-6 md:flex-row md:items-center">
      <p className="display text-3xl md:text-4xl">{q}</p>
      <div className="flex items-center gap-4">
        {note && <span className="mono max-w-[16rem] text-ink-2">{note}</span>}
        <Link href={href} className="btn btn-primary" data-magnet>{cta} →</Link>
      </div>
    </div>
  );
}

/** Mounts children only when visible AND perf mode allows heavy 3D. Otherwise shows `fallback`. */
export function Lazy3D({ children, fallback, className = "" }: { children: ReactNode; fallback: ReactNode; className?: string }) {
  const { modes } = useWasp();
  const [ref, v] = useInView<HTMLDivElement>(0.05);
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    try { const c = document.createElement("canvas"); setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl"))); } catch { setWebgl(false); }
  }, []);
  const allow = modes.perf !== "lite" && webgl;
  return <div ref={ref} className={className}>{allow ? (v ? children : <div className="mono flex h-full items-center justify-center opacity-60">Preparing scene…</div>) : fallback}</div>;
}
