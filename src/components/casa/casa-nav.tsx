"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/worlds/casa", label: "House" },
  { href: "/worlds/casa/menu", label: "Menu" },
  { href: "/worlds/casa/reservations", label: "Reservations" },
  { href: "/worlds/casa/about", label: "Story" },
  { href: "/worlds/casa/gallery", label: "Gallery" },
  { href: "/worlds/casa/contact", label: "Contact" },
];

export function CasaNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <nav className="casa-nav">
      <Link className="casa-brand" href="/worlds/casa">
        Casa Valle
      </Link>
      <button
        type="button"
        className="ghost"
        style={{ display: "none" }}
        onClick={() => setOpen((v) => !v)}
        id="casa-menu-btn"
      >
        Menu
      </button>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
      <style>{`
        @media (max-width: 720px) {
          #casa-menu-btn { display: block !important; }
        }
      `}</style>
      {open ? (
        <div style={{ position: "absolute", right: 16, top: 56, background: "#100e0c", border: "1px solid rgba(243,236,227,0.2)", padding: 16, display: "grid", gap: 10 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
