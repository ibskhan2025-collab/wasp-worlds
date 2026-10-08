"use client";
import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Field, isEmail, post } from "@/rb15l/ui";
import { ESSAYS, type Essay } from "./archive/essays";

const CATS = ["All", "Craft", "Engineering", "Design", "Culture", "Studio"];
const words = (e: Essay) => e.body.join(" ").split(/\s+/).length;
const mins = (e: Essay) => Math.max(1, Math.round(words(e) / 220));
const MANIFESTO = ["A page is a container. Build the thing inside it.", "Every state is a design: empty, loading, broken, done.", "Motion must carry information or get out.", "If it cannot be used with a keyboard, it is not finished.", "Fewer things, made properly."];
const serif = { fontFamily: "'Newsreader Variable', serif" };

export default function Archive({ reality }: { reality: string }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All"); const [marked, setMarked] = useState(false);
  const [saved, setSaved] = usePersist<string[]>("archive-saved", []); const [read, setRead] = usePersist<string[]>("archive-read", []);
  const [open, setOpen] = useState<string | null>(null); const [progress, setProgress] = useState(0);
  const [nl, setNl] = useState({ name: "", email: "" }); const [ne, setNe] = useState<Record<string, string>>({}); const [nd, setNd] = useState(false);
  const art = useRef<HTMLElement>(null);
  const list = useMemo(() => ESSAYS.filter((e) => (cat === "All" || e.cat === cat) && (!marked || saved.includes(e.id)) && (e.title + e.dek + e.body.join(" ")).toLowerCase().includes(q.toLowerCase())), [q, cat, marked, saved]);
  const cur = ESSAYS.find((e) => e.id === open);
  const toggle = (id: string) => setSaved((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  useEffect(() => {
    if (!cur) return;
    window.scrollTo({ top: 0 });
    const f = () => { const el = art.current; if (!el) return; const r = el.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (-r.top + window.innerHeight * 0.3) / Math.max(1, r.height))); setProgress(p); if (p > 0.92) setRead((prev) => (prev.includes(cur.id) ? prev : [...prev, cur.id])); };
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [cur, setRead]);

  const sub = async (e: React.FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (nl.name.trim().length < 2) x.name = "Your name, please."; if (!isEmail(nl.email)) x.email = "Enter a valid email.";
    setNe(x); if (Object.keys(x).length) return;
    const r = await post("/api/enquiries", { kind: "newsletter", name: nl.name, email: nl.email, payload: { world: "archive" } });
    if (r.ok) setNd(true); else setNe({ email: "Could not subscribe just now. Try again shortly." });
  };

  const broad = reality === "broadsheet", idx = reality === "index";
  const theme = idx ? "bg-white text-black" : "bg-[#f3efe6] text-[#1c1a17]";
  const accent = "#8c2f1b";

  const Newsletter = (
    <section aria-labelledby="nl-h" className={"border-t-2 border-current px-5 py-10 sm:px-10"}><h2 id="nl-h" className="text-3xl" style={idx ? { fontFamily: "'IBM Plex Mono'" } : serif}>The Archive letter</h2><p className="mb-4 mt-1 max-w-md text-sm opacity-70">One essay a month. No tracking pixels, no “we miss you”.</p>
      {nd ? <p role="status">Subscribed. The next essay lands in your inbox.</p> : <form onSubmit={sub} noValidate className="grid max-w-xl gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start"><Field label="Name" name="nn" value={nl.name} onChange={(e) => setNl({ ...nl, name: e.target.value })} error={ne.name} inputClass="border-current/40" /><Field label="Email" name="ne" type="email" value={nl.email} onChange={(e) => setNl({ ...nl, email: e.target.value })} error={ne.email} inputClass="border-current/40" /><button className="mt-5 bg-black px-5 py-2.5 text-sm font-semibold text-white">Subscribe</button></form>}</section>
  );

  if (cur) {
    const p = cur.body;
    return (
      <div className={theme + " min-h-screen"} style={idx ? { fontFamily: "'IBM Plex Mono', monospace" } : serif}>
        <div className="sticky top-[88px] z-30 h-1 bg-black/10" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><div className="h-1" style={{ width: `${progress * 100}%`, background: accent }} /></div>
        <article ref={art} className={broad ? "mx-auto max-w-5xl px-5 py-12" : "mx-auto max-w-[38rem] px-5 py-16"}>
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest"><button onClick={() => setOpen(null)} className="underline">← All essays</button><button aria-pressed={saved.includes(cur.id)} onClick={() => toggle(cur.id)} className="border border-current px-3 py-1.5">{saved.includes(cur.id) ? "★ Bookmarked" : "☆ Bookmark"}</button></div>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: accent }}>{cur.cat} · {mins(cur)} min read</p>
          <h1 className={(broad ? "text-6xl sm:text-8xl" : "text-5xl sm:text-6xl") + " mt-3 font-medium leading-[0.98] tracking-tight"}>{cur.title}</h1>
          <p className="mt-4 text-xl italic opacity-75">{cur.dek}</p><p className="mt-2 font-mono text-xs opacity-60">{cur.author} · {new Date(cur.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          <div className={"mt-10 text-[1.15rem] leading-[1.75] " + (broad ? "columns-1 gap-10 sm:columns-2 [&>p]:mb-5 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-2 [&>p:first-child]:first-letter:text-7xl [&>p:first-child]:first-letter:leading-[0.8]" : "space-y-6")}>{p.map((t, i) => <p key={i} className={idx ? "text-base" : ""}>{t}</p>)}</div>
          <p className="mt-12 font-mono text-xs opacity-60" role="status">{read.includes(cur.id) ? "✓ Marked as read." : "Scroll to the end to mark this as read."}</p>
          <div className="mt-8 flex justify-between border-t border-current/30 pt-5 text-sm">{(() => { const i = ESSAYS.indexOf(cur); const n = ESSAYS[(i + 1) % ESSAYS.length]; return <><span /><button className="text-right underline" onClick={() => setOpen(n.id)}>Next: {n.title} →</button></>; })()}</div>
        </article>{Newsletter}
      </div>
    );
  }

  return (
    <div className={theme + " min-h-screen"} style={idx ? { fontFamily: "'IBM Plex Mono', monospace" } : serif}>
      <header className={"px-5 pt-10 sm:px-10 " + (broad ? "border-b-4 border-double border-black text-center" : "")}>
        {broad && <p className="font-mono text-xs uppercase tracking-[0.3em]">Vol. I · No. 6 · Self-initiated · Free</p>}
        <h1 className={(broad ? "text-[clamp(3rem,13vw,11rem)] font-bold" : idx ? "text-2xl font-semibold uppercase tracking-widest" : "text-[clamp(3.5rem,10vw,8rem)] font-medium") + " leading-none tracking-tight"}>{idx ? "ARCHIVE / index of essays" : "The Archive"}</h1>
        {!idx && <p className="mx-auto mt-3 max-w-xl pb-6 text-lg italic opacity-70">Six essays on building things for screens. Read at your own pace; we remember where you stopped.</p>}
      </header>
      <div className="flex flex-wrap items-center gap-2 border-y border-current/30 px-5 py-3 font-mono text-xs sm:px-10" role="search"><label className="sr-only" htmlFor="aq">Search essays</label><input id="aq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the full text…" className="min-w-[200px] flex-1 border-b border-current/40 bg-transparent py-2 outline-none" />
        {CATS.map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={"px-2 py-1 uppercase " + (cat === c ? "bg-black text-white" : "border border-current/30")}>{c}</button>)}
        <button aria-pressed={marked} onClick={() => setMarked(!marked)} className={"px-2 py-1 uppercase " + (marked ? "bg-black text-white" : "border border-current/30")}>★ Saved ({saved.length})</button><span className="opacity-60" aria-live="polite">{list.length}/6 · {read.length} read</span></div>
      {list.length === 0 ? <p className="px-5 py-20 sm:px-10">Nothing found. Try a shorter search.</p> : idx ? (
        <table className="w-full px-5 text-left text-sm"><thead><tr className="border-b border-black text-xs uppercase"><th className="px-5 py-2 sm:px-10">No.</th><th>Title</th><th className="hidden sm:table-cell">Cat.</th><th className="hidden sm:table-cell">Min</th><th className="pr-5 sm:pr-10">State</th></tr></thead><tbody>{list.map((e) => <tr key={e.id} className="border-b border-black/20 hover:bg-black/5"><td className="px-5 py-3 sm:px-10">{String(ESSAYS.indexOf(e) + 1).padStart(2, "0")}</td><td><button onClick={() => setOpen(e.id)} className="text-left font-semibold underline">{e.title}</button></td><td className="hidden sm:table-cell">{e.cat}</td><td className="hidden sm:table-cell">{mins(e)}</td><td className="pr-5 sm:pr-10">{read.includes(e.id) ? "read" : "unread"}{saved.includes(e.id) ? " ★" : ""}</td></tr>)}</tbody></table>
      ) : (
        <ul className={"gap-0 px-5 py-8 sm:px-10 " + (broad ? "grid md:grid-cols-3 [&>li]:border-black md:[&>li]:border-r md:[&>li:nth-child(3n)]:border-r-0 [&>li]:px-5" : "mx-auto max-w-3xl divide-y divide-black/15")}>{list.map((e, i) => (
          <li key={e.id} className={"py-7 " + (broad && i === 0 ? "md:col-span-2" : "")}><p className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: accent }}>{e.cat} · {mins(e)} min {read.includes(e.id) && "· ✓ read"}</p>
            <h2 className={(broad && i === 0 ? "text-6xl" : "text-4xl") + " mt-2 font-medium leading-[1.02]"}><button className="text-left hover:underline" onClick={() => setOpen(e.id)}>{e.title}</button></h2><p className="mt-2 text-lg italic opacity-75">{e.dek}</p>
            <div className="mt-3 flex gap-4 font-mono text-xs"><button onClick={() => setOpen(e.id)} className="underline">Read →</button><button aria-pressed={saved.includes(e.id)} onClick={() => toggle(e.id)}>{saved.includes(e.id) ? "★ Saved" : "☆ Save"}</button></div></li>))}</ul>
      )}
      <section className="border-t-2 border-current px-5 py-12 sm:px-10" aria-labelledby="man-h"><h2 id="man-h" className="font-mono text-xs uppercase tracking-[0.3em]">Manifesto</h2><ol className="mt-4 space-y-2 text-3xl sm:text-5xl">{MANIFESTO.map((m, i) => <li key={m} className="leading-tight"><span className="mr-3 font-mono text-sm opacity-50">{i + 1}</span>{m}</li>)}</ol></section>
      {Newsletter}
    </div>
  );
}

