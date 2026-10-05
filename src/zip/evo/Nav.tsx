"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WORLDS } from "@/zip/evo/live";
import { useWasp } from "@/zip/evo/state";

const PRIMARY = [
  ["Worlds", "/worlds"], ["Work", "/work"], ["Lab", "/lab"], ["Tools", "/tools"], ["Studio", "/studio"], ["Process", "/process"], ["OS", "/os"],
] as const;

export function Nav() {
  const path = usePathname() || "/";
  const { openPalette, remember } = useWasp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const worldSlug = path.match(/^\/worlds\/([^/]+)/)?.[1];
  const world = WORLDS.find((w) => w.slug === worldSlug);

  useEffect(() => { setOpen(false); remember((m) => ({ ...m, lastPath: path })); }, [path, remember]);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 40);
    f(); addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);

  if (path.startsWith("/os")) return null; // OS brings its own chrome.

  // Inside a world: the world owns the page; WASP shrinks to a thin rail.
  if (world) {
    const i = WORLDS.indexOf(world);
    const prev = WORLDS[(i + WORLDS.length - 1) % WORLDS.length], next = WORLDS[(i + 1) % WORLDS.length];
    return (
      <header className="fixed inset-x-0 top-0 z-50 flex h-10 items-center justify-between border-b border-black/20 bg-[#141412] px-3 text-[#efece4]" data-comp="Nav/world">
        <div className="mono flex items-center gap-3">
          <Link href="/" className="font-bold tracking-[.2em] text-[#ffd400]">WASP</Link>
          <Link href="/worlds" className="opacity-70 hover:opacity-100">← All worlds</Link>
          <span className="hidden opacity-40 sm:inline">/ {world.n} {world.name} · fictional · self-initiated</span>
        </div>
        <div className="mono flex items-center gap-1">
          <Link href={`/worlds/${prev.slug}`} className="px-2 opacity-70 hover:opacity-100" aria-label={`Previous world: ${prev.name}`}>←</Link>
          <Link href={`/worlds/${next.slug}`} className="px-2 opacity-70 hover:opacity-100" aria-label={`Next world: ${next.name}`}>{next.name} →</Link>
          <button onClick={() => openPalette()} className="hidden px-2 opacity-70 hover:opacity-100 sm:block" aria-label="Search">⌘K</button>
          <Link href={`/start?from=${world.slug}`} className="ml-1 bg-[#ffd400] px-2 py-1 font-bold text-[#141412]">Start a project</Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? "border-b border-ink/15 bg-paper/90 backdrop-blur" : ""}`} data-comp="Nav">
        <nav aria-label="Primary" className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 md:px-6">
          <Link href="/" className="group flex items-baseline gap-2" aria-label="WASP home">
            <span className="text-lg font-black tracking-[.22em]">WASP</span>
            <span className="mono hidden text-ink-2 lg:inline">{path === "/" ? "studio · est. in public" : path.split("/")[1]}</span>
          </Link>
          <ul className="hidden items-center gap-5 md:flex">
            {PRIMARY.map(([l, h]) => (
              <li key={h}><Link href={h} aria-current={path.startsWith(h) ? "page" : undefined} className={`mono link-u ${path.startsWith(h) ? "text-ink" : "text-ink-2 hover:text-ink"}`}>{l}</Link></li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <button onClick={() => openPalette()} className="mono hidden items-center gap-2 border border-ink/30 px-2 py-1.5 text-ink-2 hover:border-ink hover:text-ink sm:flex" aria-label="Search or ask (Command K)">
              Search <kbd className="opacity-60">⌘K</kbd>
            </button>
            <Link href="/start" className="btn btn-primary !py-2 !px-3" data-magnet data-cursor="START">Start a project</Link>
            <button className="mono px-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mnav">{open ? "Close" : "Menu"}</button>
          </div>
        </nav>
        {open && (
          <div id="mnav" className="border-t border-ink bg-paper px-4 pb-6 md:hidden">
            {PRIMARY.map(([l, h], i) => (
              <Link key={h} href={h} className="flex items-baseline justify-between border-b border-ink/15 py-3">
                <span className="display text-4xl">{l}</span><span className="mono text-ink-2">0{i + 1}</span>
              </Link>
            ))}
            <Link href="/notes" className="flex items-baseline justify-between border-b border-ink/15 py-3"><span className="display text-4xl">Notes</span><span className="mono text-ink-2">08</span></Link>
          </div>
        )}
      </header>

      {/* Mobile bottom action bar — thumb reach. Never covers content: body has bottom padding on mobile. */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-ink bg-paper md:hidden" data-comp="MobileBar">
        <Link href="/worlds" className="mono py-3 text-center">Worlds</Link>
        <button onClick={() => openPalette()} className="mono border-x border-ink py-3">Ask / Search</button>
        <Link href="/start" className="mono bg-signal py-3 text-center font-bold text-[#141412]">Start →</Link>
      </div>
    </>
  );
}

export function Footer() {
  const { modes, setMode, say } = useWasp();
  const path = usePathname() || "/";
  if (path.startsWith("/os")) return null;
  return (
    <footer className="border-t border-ink bg-paper pb-20 md:pb-0" data-comp="Footer">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 md:grid-cols-12 md:px-6">
        <div className="md:col-span-6">
          <p className="display text-5xl md:text-7xl">Have a project<br />in mind?</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/start" className="btn btn-primary" data-magnet>Start a project →</Link>
            <a href="mailto:hello@wasp.studio" className="btn btn-ghost">hello@wasp.studio</a>
          </div>
          <p className="mt-4 max-w-md text-sm text-ink-2">You&apos;ll get a reply from a person with a next step — usually a few questions or a time to talk. No newsletter unless you ask.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:col-span-3">
          <ul className="space-y-1.5 text-sm">
            {[["Worlds", "/worlds"], ["Work", "/work"], ["Lab", "/lab"], ["Tools", "/tools"], ["Notes", "/notes"]].map(([l, h]) => <li key={h}><Link className="link-u" href={h}>{l}</Link></li>)}
          </ul>
          <ul className="space-y-1.5 text-sm">
            {[["Studio", "/studio"], ["Process", "/process"], ["OS", "/os"], ["City (3D)", "/city"], ["Credits", "/credits"]].map(([l, h]) => <li key={h}><Link className="link-u" href={h}>{l}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-3" data-comp="ModePanel">
          <p className="mono mb-2 text-ink-2">Performance</p>
          <div className="flex border border-ink" role="radiogroup" aria-label="Performance mode">
            {(["full", "reduced", "lite"] as const).map((p) => (
              <button key={p} role="radio" aria-checked={modes.perf === p} onClick={() => { setMode("perf", p); say(p === "lite" ? "Lite: 2D everywhere. Still the whole site." : p === "reduced" ? "Reduced: motion calmed." : "Full: everything on."); }} className={`mono flex-1 py-2 ${modes.perf === p ? "bg-ink text-paper" : ""}`}>{p}</button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-2">Lite swaps every 3D scene for a 2D version that answers the same question. Your system&apos;s reduced-motion setting is always respected. Settings stay in this browser.</p>
          <p className="hand mt-4 text-xl text-ink-2">psst — type <b>night</b>, <b>raw</b> or <b>sys</b></p>
        </div>
      </div>
      <div className="mono mx-auto flex max-w-[1600px] flex-wrap justify-between gap-2 border-t border-ink/20 px-4 py-4 text-ink-2 md:px-6">
        <span>© {new Date().getFullYear()} WASP · Built with Next.js, Postgres, Three.js</span>
        <span>Worlds are fictional brands built as working products. Photos: Pexels, credited.</span>
      </div>
    </footer>
  );
}
