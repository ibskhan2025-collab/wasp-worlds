"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useWasp } from "@/context/wasp-context";

const LINKS = [
  { href: "/", label: "Work" },
  { href: "/studio/services", label: "Services" },
  { href: "/studio", label: "Studio" },
  { href: "/process", label: "Process" },
  { href: "/tools", label: "Tools" },
  { href: "/start", label: "Start" },
];

// Lab and OS live one click deeper: studio grid, homepage meta-links, footer.
const MORE_LINKS = [
  { href: "/lab", label: "Lab" },
  { href: "/os", label: "OS" },
];

export function SiteChrome({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { feel, motion } = useWasp();
  const inWorld = path.startsWith("/worlds/");
  const standalone = path === "/resume";
  const [open, setOpen] = useState(false);
  const [fine, setFine] = useState(false);

  // Close the mobile menu on navigation — legitimate external sync.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [path]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setFine(mq.matches && feel !== "quiet" && motion !== "still" && !rm.matches);
    apply();
    mq.addEventListener("change", apply);
    rm.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      rm.removeEventListener("change", apply);
    };
  }, [feel, motion]);

  useEffect(() => {
    document.body.classList.toggle("cursor-fine", fine);
    return () => document.body.classList.remove("cursor-fine");
  }, [fine]);

  return (
    <>
      {fine && !standalone ? <WaspCursor /> : null}
      {!inWorld && !standalone ? (
        <header className="nav-wasp">
          <Link className="nav-mark" href="/">
            WASP
          </Link>
          <button className="nav-toggle" type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            {open ? "Close" : "Menu"}
          </button>
          <nav className={`nav-links${open ? " open" : ""}`} aria-label="Primary">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
      ) : null}
      <div id="main">{children}</div>
      {!inWorld && !standalone ? (
        <footer className="wasp-footer">
          <Link className="nav-mark" href="/">WASP</Link>
          <nav aria-label="Footer">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
            {MORE_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
            <a href="mailto:hello@wasp.studio">hello@wasp.studio</a>
          </nav>
          <p>© {new Date().getFullYear()} WASP · Built with Next.js</p>
        </footer>
      ) : null}
    </>
  );
}

/**
 * Isolated cursor: updates the DOM node directly via refs so mousemove
 * never re-renders the page subtree. Position uses transform (compositor
 * only) instead of left/top (layout thrash).
 */
function WaspCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: -40, y: -40 });
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (raf.current) return;
      raf.current = window.requestAnimationFrame(() => {
        raf.current = 0;
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      });
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      el.classList.toggle("hot", Boolean(t?.closest("a, button, [data-hot]")));
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return <div ref={ref} className="wasp-cursor" aria-hidden />;
}
