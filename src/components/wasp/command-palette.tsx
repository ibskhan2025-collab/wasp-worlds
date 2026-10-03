"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { REALITIES } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";

type Entry = { title: string; sub: string; href: string; keys: string };

const PAGES: Entry[] = [
  { title: "Matrix", sub: "Every world, every reality", href: "/matrix", keys: "index all worlds realities" },
  { title: "Realities", sub: "One thing, many ways to experience it", href: "/realities", keys: "realities alternate dimensions" },
  { title: "Lab", sub: "Things being broken", href: "/lab", keys: "lab experiments playground" },
  { title: "WASP OS", sub: "The machinery behind the studio", href: "/os", keys: "os pipeline crm system" },
  { title: "Tools", sub: "Free instruments", href: "/tools", keys: "tools audit calculator" },
  { title: "Proof", sub: "No invented clients", href: "/studio/proof", keys: "proof trust testimonials" },
  { title: "Work", sub: "Rooms you can operate", href: "/studio/work", keys: "work cases portfolio" },
  { title: "Process", sub: "Enquiry to aftercare", href: "/process", keys: "process how we work steps" },
  { title: "Start a project", sub: "The intake", href: "/start", keys: "start contact brief project" },
  { title: "Studio", sub: "About WASP", href: "/studio", keys: "studio about" },
  { title: "Night", sub: "After dark", href: "/night", keys: "night dark" },
  { title: "3D index", sub: "Spatial realities", href: "/3d", keys: "3d spatial three webgl" },
  { title: "Analog index", sub: "Print realities", href: "/analog", keys: "analog print" },
  { title: "NEST case study", sub: "A house with six ways in", href: "/studio/case/nest", keys: "nest case breakdown" },
  { title: "CASA case study", sub: "A restaurant you can book", href: "/studio/case/casa", keys: "casa case breakdown" },
  { title: "NOIR case study", sub: "Fashion that holds a bag", href: "/studio/case/noir", keys: "noir case breakdown" },
  { title: "ORBIT case study", sub: "A product, not a product shot", href: "/studio/case/orbit", keys: "orbit case breakdown" },
  { title: "OBJECTS case study", sub: "Commerce with materials", href: "/studio/case/objects", keys: "objects case breakdown" },
];

function buildIndex(): Entry[] {
  const out: Entry[] = [...PAGES];
  for (const w of WORLDS) {
    out.push({ title: w.name, sub: `${w.kind} · Room ${w.room}`, href: w.href, keys: `${w.name} ${w.kind} world room` });
    for (const r of REALITIES[w.id] ?? []) {
      if (r.id === "classic") continue;
      out.push({
        title: `${w.name} / ${r.label}`,
        sub: r.note,
        href: `${w.href}/${r.id}`,
        keys: `${w.name} ${r.label} ${r.id} reality`,
      });
    }
  }
  return out;
}

export function CommandPalette() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);
  const prevPath = useRef(path);
  const index = useMemo(() => buildIndex(), []);

  function toggle() {
    setQ("");
    setSel(0);
    setOpen((v) => !v);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => input.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
  }, [open ]);

  useEffect(() => {
    if (prevPath.current !== path) {
      prevPath.current = path;
      queueMicrotask(() => setOpen(false));
    }
  });

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return index.filter((e) => !e.href.includes("/worlds/")).slice(0, 8);
    return index
      .filter((e) => `${e.title} ${e.sub} ${e.keys}`.toLowerCase().includes(needle))
      .slice(0, 10);
  }, [q, index]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  const inWorld = path.startsWith("/worlds/");

  return (
    <>
      {!inWorld ? (
        <button type="button" className="palette-trigger" onClick={toggle} aria-label="Search the site">
          Search <kbd>⌘K</kbd>
        </button>
      ) : null}
      {open ? (
        <div className="palette-backdrop" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search WASP"
            className="palette-box"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === "Enter" && results[sel]) go(results[sel].href);
            }}
          >
            <div className="palette-input-row">
              <input
                ref={input}
                value={q}
                onChange={(e) => { setQ(e.target.value); setSel(0); }}
                placeholder="Worlds, realities, pages…"
                aria-label="Search worlds, realities and pages"
                role="combobox"
                aria-expanded
                aria-controls="palette-list"
              />
              <kbd>esc</kbd>
            </div>
            <ul id="palette-list" role="listbox" className="palette-list">
              {results.length === 0 ? (
                <li className="palette-empty">Nothing by that name. Try “noir”, “ledger”, “lab”, “os”.</li>
              ) : null}
              {results.map((e, i) => (
                <li key={e.href} role="option" aria-selected={i === sel}>
                  <button
                    type="button"
                    onMouseEnter={() => setSel(i)}
                    onClick={() => go(e.href)}
                    className={i === sel ? "palette-item palette-item-on" : "palette-item"}
                  >
                    <strong>{e.title}</strong>
                    <span>{e.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="palette-foot"><span>↑↓ move · ↵ open · esc close</span><span>⌘K anywhere</span></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
