"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { media } from "@/rb54l/media";
import { Img } from "@/rb54l/ui";
import { useLocal } from "@/rb54l/state";
import { useSubmit, emailOk } from "@/rb54l/kit";
type XP = { reality: string; world?: unknown };

const ARTS = [
  { slug: "margins", cat: "Typography", title: "In defence of wide margins", dek: "The empty space around a paragraph is doing more work than the paragraph.", p: media.archive.spread,
    body: ["Open any book printed before 1950 and the margins are enormous. Not because paper was cheap — it wasn't — but because readers hold books, and thumbs need somewhere to go.", "On screens, margins got squeezed by the belief that empty space is wasted space. But a line of 110 characters is exhausting. The eye loses its place on the return sweep and rereads the same line.", "Sixty to seventy-five characters is the old rule, and it survives because it matches how eyes actually move. This page is set at about 68.", "Margins also signal pace. Tight layouts feel urgent; generous ones feel like you're allowed to take your time. A publication that wants to be read, rather than skimmed, should look like it has time."] },
  { slug: "index", cat: "Archives", title: "The index is the best part", dek: "Why the back of the book is a better interface than most search bars.", p: media.archive.diagrams,
    body: ["A good index is written by a person who read the whole book and decided what mattered. It includes things the text never names directly: 'grief, see also: letters'.", "Search bars only find what's literally there. An index finds what's meant.", "Digital archives could have both. Most choose neither — a search box that matches strings, and a list of tags nobody maintains."] },
  { slug: "paper", cat: "Materials", title: "Paper remembers", dek: "Foxing, fading and the chemistry of old pages.", p: media.archive.spanish,
    body: ["The brown spots on old books are called foxing. Nobody's entirely sure why they happen — fungus, iron impurities, humidity, probably all three.", "Acidic wood-pulp paper from the late 1800s is the worst. It yellows, then goes brittle, then breaks when you turn the page. Rag paper from centuries earlier often survives better.", "Which is a useful reminder for anyone building digital archives: the newest medium is not automatically the most durable."] },
  { slug: "reading", cat: "Attention", title: "Reading is interrupted", dek: "Designing for the reader who will leave halfway and come back.", p: media.archive.overhead,
    body: ["Nobody reads a long article in one sitting any more. They start on the bus, get to the office, remember it at lunch.", "So the most respectful feature a publication can build is memory: where you stopped, what you saved. This archive keeps both in your browser — nothing is sent anywhere.", "The progress bar at the top of each essay measures the article itself, not the whole page. Footers and newsletters don't count as reading."] },
];

export default function Archive({ reality }: XP) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const [marks, setMarks] = useLocal<string[]>("wasp:archive:marks", []);
  const [prog, setProg] = useLocal<Record<string, number>>("wasp:archive:progress", {});
  const reader = reality === "reader";
  const list = useMemo(() => ARTS.filter((a) => (cat === "All" || a.cat === cat) && (!q || `${a.title} ${a.dek} ${a.body.join(" ")}`.toLowerCase().includes(q.toLowerCase()))), [q, cat]);
  const art = ARTS.find((a) => a.slug === open);
  const f = { fontFamily: "'Newsreader', serif" };

  if (art) return <Article a={art} reader={reader} back={() => setOpen(null)} marked={marks.includes(art.slug)} toggle={() => setMarks((m) => (m.includes(art.slug) ? m.filter((x) => x !== art.slug) : [...m, art.slug]))} progress={prog[art.slug] ?? 0} setProgress={(v) => setProg((p) => ({ ...p, [art.slug]: Math.max(p[art.slug] ?? 0, v) }))} />;

  return (
    <div className="bg-[#f7f3ea] px-5 pb-16 text-[#1b1b1b] md:px-10" style={f}>
      <div className="flex flex-wrap items-center gap-4 border-y-[3px] border-double border-[#1b1b1b] py-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the archive…" aria-label="Search articles" className="flex-1 bg-transparent text-lg italic outline-none" />
        <div className="flex gap-3 text-sm uppercase tracking-widest" role="group" aria-label="Categories">{["All", ...new Set(ARTS.map((a) => a.cat))].map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={cat === c ? "text-[#8a1c1c] underline" : "opacity-60"}>{c}</button>)}</div>
      </div>
      {list.length === 0 && <p className="py-12 text-2xl italic">No essay mentions “{q}”. Try “paper” or “margins”.</p>}
      <div className={reader ? "mx-auto max-w-2xl divide-y divide-black/20" : "grid gap-x-10 md:grid-cols-3 md:divide-x md:divide-black/20"}>
        {list.map((a, i) => (
          <article key={a.slug} className={`py-8 ${!reader && i === 0 ? "md:col-span-2 md:pr-10" : "md:pl-10 first:md:pl-0"}`}>
            {!reader && i === 0 && <Img p={a.p} className="mb-5 aspect-[16/9] grayscale-[.3] sepia-[.2]" caption />}
            <p className="text-xs uppercase tracking-[.25em] text-[#8a1c1c]">{a.cat}{marks.includes(a.slug) && " · Bookmarked"}</p>
            <button onClick={() => setOpen(a.slug)} className="mt-2 block text-left"><h3 className={`${reader || i === 0 ? "text-5xl" : "text-3xl"} leading-[1.05] hover:text-[#8a1c1c]`}>{a.title}</h3></button>
            <p className="mt-3 text-lg italic opacity-80">{a.dek}</p>
            {(prog[a.slug] ?? 0) > 0.02 && <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-widest opacity-70"><div className="h-[2px] w-24 bg-black/15"><div className="h-full bg-[#8a1c1c]" style={{ width: `${(prog[a.slug] ?? 0) * 100}%` }} /></div>{Math.round((prog[a.slug] ?? 0) * 100)}% read — continue</div>}
          </article>
        ))}
      </div>
      <Newsletter />
    </div>
  );
}

function Article({ a, reader, back, marked, toggle, progress, setProgress }: { a: (typeof ARTS)[number]; reader: boolean; back: () => void; marked: boolean; toggle: () => void; progress: number; setProgress: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(progress);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "start" });
    const on = () => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); const v = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height)); setP(v); setProgress(v); };
    addEventListener("scroll", on, { passive: true }); return () => removeEventListener("scroll", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-[#f7f3ea] text-[#1b1b1b]" style={{ fontFamily: "'Newsreader', serif" }}>
      <div className="sticky top-[86px] z-30 h-[3px] bg-black/10" role="progressbar" aria-valuenow={Math.round(p * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress"><div className="h-full bg-[#8a1c1c] transition-[width] duration-100" style={{ width: `${p * 100}%` }} /></div>
      <div ref={ref} className={`mx-auto px-5 py-12 ${reader ? "max-w-2xl text-[22px]" : "max-w-[68ch] text-lg"} leading-[1.7]`}>
        <div className="mb-8 flex justify-between text-sm uppercase tracking-widest"><button onClick={back}>← Archive</button><button onClick={toggle} aria-pressed={marked}>{marked ? "★ Bookmarked" : "☆ Bookmark"}</button></div>
        <p className="text-xs uppercase tracking-[.25em] text-[#8a1c1c]">{a.cat}</p>
        <h2 className="mt-2 text-5xl leading-[1.02] md:text-6xl">{a.title}</h2>
        <p className="mt-4 text-2xl italic opacity-75">{a.dek}</p>
        {!reader && <Img p={a.p} className="my-10 aspect-[3/2]" caption />}
        {a.body.map((t, i) => <p key={i} className={`mt-6 ${i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:text-7xl first-letter:leading-[.8] first-letter:text-[#8a1c1c]" : ""}`}>{t}</p>)}
        <p className="mt-10 text-center text-2xl">❦</p>
      </div>
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const s = useSubmit("archive-newsletter");
  return (
    <section className="mt-12 border-t-[3px] border-double border-[#1b1b1b] pt-8" aria-labelledby="nl">
      <h3 id="nl" className="text-3xl">One essay a month. No tracking pixels.</h3>
      {s.state === "done" ? <p className="mt-3 text-lg italic">You&apos;re on the list — ref {s.ref}. (It&apos;s a fictional magazine, so the first issue may take a while.)</p> : (
        <form noValidate className="mt-4 flex max-w-lg gap-2" onSubmit={(e) => { e.preventDefault(); s.send({ email }, emailOk(email) ? {} : { email: "That doesn't look like a full email address — it needs an @ and a domain." }); }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email" aria-invalid={!!s.errors.email} className="flex-1 border-b-2 border-black bg-transparent py-2 text-lg" />
          <button className="bg-[#8a1c1c] px-5 text-white">{s.state === "sending" ? "…" : "Subscribe"}</button>
        </form>)}
      {s.errors.email && <p className="mt-2 text-[#8a1c1c]">{s.errors.email}</p>}
    </section>
  );
}
