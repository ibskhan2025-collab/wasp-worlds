"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/zip/rb3/live";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const chord = useRef(0);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [path]);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "escape") setOpen(false);
      if (Date.now() < chord.current) {
        chord.current = 0;
        const n = NAV.find((x) => x.key === k);
        if (n) router.push(n.href);
        if (k === "h") router.push("/");
      } else if (k === "g") chord.current = Date.now() + 1200;
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [router]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const on = (h: string) => path === h || path.startsWith(h + "/");
  return (
    <header className="fixed inset-x-0 top-0 z-[60] h-11 border-b border-white/10 bg-black/80 text-white backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-white focus:px-3 focus:py-1 focus:text-black">Skip to content</a>
      <div className="mx-auto flex h-full max-w-[1800px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-black tracking-[0.3em]" aria-label="WASP home">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 1l7 4v8l-7 4-7-4V5z" fill="none" stroke="#ffd23f" strokeWidth="1.6" /><path d="M2 5l7 4 7-4M9 9v8" stroke="#ffd23f" strokeWidth="1.2" fill="none" /></svg>
          WASP
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={on(n.href) ? "page" : undefined}
              className={"rounded px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-white " + (on(n.href) ? "text-[#ffd23f]" : "text-white/60") + (n.label === "Start" ? " border border-white/30 text-white" : "")}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="font-mono text-[11px] uppercase tracking-[0.2em] md:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div ref={bar} className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-[#ffd23f]" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-11 flex flex-col bg-[#09090a] px-6 py-8 md:hidden" role="dialog" aria-label="Menu">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">WASP — we build worlds</p>
          <nav className="mt-6 flex flex-1 flex-col justify-between" aria-label="Mobile">
            {[{ href: "/", label: "Front door" }, ...NAV].map((n, i) => (
              <Link key={n.href} href={n.href} className={"flex items-baseline justify-between border-b border-white/10 py-2 text-[11vw] font-black uppercase leading-none " + (on(n.href) && n.href !== "/" ? "text-[#ffd23f]" : "")}>
                {n.label}<span className="font-mono text-xs text-white/40">0{i}</span>
              </Link>
            ))}
          </nav>
          <p className="mt-4 font-mono text-[10px] text-white/40">15 worlds · multiple realities · one studio</p>
        </div>
      )}
    </header>
  );
}
