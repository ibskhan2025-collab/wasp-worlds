"use client";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Plate } from "@/rb15l/plate";
import { Dialog, Field, isEmail, money, post } from "@/rb15l/ui";
import type { Photo } from "./still/Hall";

const Hall = dynamic(() => import("./still/Hall"), { ssr: false, loading: () => <p className="p-8 font-mono text-xs">Hanging the exhibition…</p> });

const P = (id: string, title: string, col: string, year: number, place: string, seed: number, kind: Photo["kind"], hue: number, land = false): Photo => ({ id, title, col, year, place, seed, kind, hue, land });
const PHOTOS: Photo[] = [
  P("d1", "Third Ridge, 6:12", "Dune", 2023, "Erg Chebbi, Morocco", 11, "dunes", 28), P("d2", "Wind has a handwriting", "Dune", 2023, "Namib Sand Sea", 12, "dunes", 18, true), P("d3", "Noon, nobody", "Dune", 2022, "White Sands, New Mexico", 13, "dunes", 40),
  P("a1", "Above the cloud line", "Altitude", 2024, "Dolomites, Italy", 21, "peaks", 210), P("a2", "Six ridges of blue", "Altitude", 2024, "Lofoten, Norway", 22, "peaks", 200, true), P("a3", "Ice that remembers", "Altitude", 2021, "Vatnajökull, Iceland", 23, "ice", 10),
  P("s1", "Low tide, low sun", "Shoreline", 2022, "Skagen, Denmark", 31, "sea", 25, true), P("s2", "The horizon is a decision", "Shoreline", 2022, "Hebrides, Scotland", 32, "sea", 350), P("s3", "Salt light", "Shoreline", 2023, "Alentejo, Portugal", 33, "sea", 35, true),
  P("n1", "Streets after the rain", "Nocturne", 2021, "Osaka, Japan", 41, "city", 20), P("n2", "Forty floors of someone else's evening", "Nocturne", 2021, "Hong Kong", 42, "city", 35, true), P("n3", "Fog in the pines", "Nocturne", 2024, "Bavarian Forest", 43, "forest", 20),
];
const COLS = ["All", "Dune", "Altitude", "Shoreline", "Nocturne"];
const SIZES = [{ s: "30 × 40 cm", price: 240, ed: 50 }, { s: "50 × 70 cm", price: 480, ed: 25 }, { s: "80 × 110 cm", price: 980, ed: 10 }];
const serif = { fontFamily: "'Cormorant Garamond', serif" };

export default function Still({ reality }: { reality: string }) {
  const [col, setCol] = useState("All");
  const [favOnly, setFavOnly] = useState(false);
  const [favs, setFavs] = usePersist<string[]>("still-favs", []);
  const [view, setView] = useState<string | null>(null);
  const [spot, setSpot] = useState(0);
  const [enq, setEnq] = useState(false);
  const [f, setF] = useState({ name: "", email: "", size: "0", note: "" });
  const [fe, setFe] = useState<Record<string, string>>({});
  const [sent, setSent] = useState("");

  const list = useMemo(() => PHOTOS.filter((p) => (col === "All" || p.col === col) && (!favOnly || favs.includes(p.id))), [col, favOnly, favs]);
  const idx = view ? list.findIndex((p) => p.id === view) : -1;
  const cur = view ? PHOTOS.find((p) => p.id === view) : null;
  const fav = (id: string) => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const step = useCallback((d: number) => { if (!list.length) return; const i = list.findIndex((p) => p.id === view); setView(list[(i + d + list.length) % list.length].id); setEnq(false); setSent(""); }, [list, view]);

  useEffect(() => {
    if (!view) return;
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement; if (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key.toLowerCase() === "f") fav(view);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, step]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Your name, please.";
    if (!isEmail(f.email)) x.email = "Enter a valid email.";
    setFe(x); if (Object.keys(x).length || !cur) return;
    const sz = SIZES[+f.size];
    const r = await post("/api/enquiries", { kind: "print", name: f.name, email: f.email, payload: { photo: cur.title, size: sz.s, price: sz.price, note: f.note } });
    setSent(r.ok ? `Thank you. We will write to ${f.email} about “${cur.title}”, ${sz.s}.` : "Could not send just now. Please try again.");
  };

  const Filters = (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs" role="group" aria-label="Filter photographs">
      {COLS.map((c) => <button key={c} aria-pressed={col === c} onClick={() => setCol(c)} className={"border px-3 py-1.5 uppercase tracking-widest " + (col === c ? "border-[#c8b88a] bg-[#c8b88a] text-black" : "border-white/25")}>{c}</button>)}
      <button aria-pressed={favOnly} onClick={() => setFavOnly(!favOnly)} className={"border px-3 py-1.5 uppercase tracking-widest " + (favOnly ? "border-[#c8b88a] bg-[#c8b88a] text-black" : "border-white/25")}>♥ Favourites ({favs.length})</button>
      <span className="ml-auto text-white/50" aria-live="polite">{list.length} photographs</span>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[#111110] text-[#e7e2d8]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      {reality === "gallery" && (
        <div className="px-4 py-10 sm:px-10">
          <header className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end"><h1 className="text-[clamp(3.5rem,11vw,10rem)] font-light leading-[0.85]" style={serif}>Still<span className="text-[#c8b88a]">.</span></h1><p className="max-w-sm text-sm leading-relaxed text-white/60">Twelve photographs from four collections, 2021–2024. Open any frame to view it large; ← → to travel, F to favourite, and order a print from the viewer.</p></header>
          {Filters}
          {list.length === 0 ? <p className="py-20 text-white/60">Nothing here yet. Favourite a photograph with ♥ and it will appear in this list.</p> : (
            <ul className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4">{list.map((p) => (
              <li key={p.id} className="mb-4 break-inside-avoid"><button onClick={() => setView(p.id)} className="group block w-full text-left" aria-label={`View ${p.title}, ${p.place}, ${p.year}`}><div className={"overflow-hidden " + (p.land ? "aspect-[5/4]" : "aspect-[4/5]")}><Plate seed={p.seed} kind={p.kind} hue={p.hue} label={p.title} w={p.land ? 600 : 480} h={p.land ? 480 : 600} className="transition-transform duration-700 group-hover:scale-105" /></div><p className="mt-2 text-xl" style={serif}>{p.title}</p><p className="text-[11px] uppercase tracking-widest text-white/50">{p.col} · {p.year}</p></button></li>))}</ul>)}
        </div>
      )}

      {reality === "contact" && (
        <div className="px-3 py-8 sm:px-8">
          <h1 className="text-sm uppercase tracking-[0.4em] text-[#ff8a3c]">Contact sheet · roll 07 · 12 exp.</h1><div className="my-4">{Filters}</div>
          <ul className="grid grid-cols-3 gap-x-1 gap-y-6 bg-[#1b1714] p-3 sm:grid-cols-4 lg:grid-cols-6" style={{ borderTop: "10px dashed #2a2521", borderBottom: "10px dashed #2a2521" }}>{list.map((p, i) => (
            <li key={p.id} className="relative"><button className="relative block aspect-[3/2] w-full overflow-hidden bg-black" onClick={() => setView(p.id)} aria-label={`Open frame ${i + 1}: ${p.title}`}><Plate seed={p.seed} kind={p.kind} hue={p.hue} label={p.title} w={360} h={240} className="grayscale contrast-125" />{favs.includes(p.id) && <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 66" aria-hidden="true"><ellipse cx="50" cy="33" rx="46" ry="29" fill="none" stroke="#ff3b2e" strokeWidth="2.2" transform="rotate(-4 50 33)" /></svg>}</button>
              <div className="mt-1 flex items-center justify-between text-[10px] text-[#ff8a3c]"><span>▸ {String(i + 1).padStart(2, "0")}</span><button aria-pressed={favs.includes(p.id)} onClick={() => fav(p.id)} className="underline">{favs.includes(p.id) ? "circled" : "circle"}</button></div></li>))}</ul>
          <p className="mt-4 text-xs text-white/50">Circle your selects with the grease pencil. They are stored on this device and appear under Favourites in every view.</p>
        </div>
      )}

      {reality === "hall" && (
        <div className="grid lg:grid-cols-[1fr_300px]">
          <div className="relative h-[68vh] lg:h-[calc(100vh-132px)]"><Hall photos={PHOTOS} spot={spot} onOpen={(i) => setView(PHOTOS[i].id)} /><p className="pointer-events-none absolute left-3 top-3 bg-black/60 px-2 py-1 text-[11px] uppercase tracking-widest">Walk: W A S D / arrows · drag to look · click a frame</p></div>
          <aside className="border-t border-white/10 p-4 lg:border-l lg:border-t-0" aria-label="Exhibition index"><h2 className="text-sm uppercase tracking-[0.3em] text-[#c8b88a]">Walk to</h2><ol className="mt-3 space-y-1 text-sm">{PHOTOS.map((p, i) => <li key={p.id}><button onClick={() => setSpot(i)} className={"w-full px-2 py-1.5 text-left hover:bg-white/10 " + (spot === i ? "bg-white/10 text-[#c8b88a]" : "")}>{String(i + 1).padStart(2, "0")} · {p.title}</button></li>)}</ol><p className="mt-4 text-xs text-white/50">Every frame in the hall is also reachable from this list and opens the same full-screen viewer.</p></aside>
        </div>
      )}

      <Dialog open={!!cur} onClose={() => { setView(null); setEnq(false); setSent(""); }} label={cur ? `${cur.title}, photograph ${Math.max(idx, 0) + 1} of ${list.length || PHOTOS.length}` : "Photograph"} className="h-[96vh] max-w-[1400px] bg-[#0b0b0a] text-[#e7e2d8]">
        {cur && (
          <div className="grid h-full min-h-[70vh] lg:grid-cols-[1fr_340px]">
            <div className="flex items-center justify-center bg-black p-3"><div className={cur.land ? "aspect-[5/4] w-full max-w-[900px]" : "aspect-[4/5] h-full max-h-[80vh]"}><Plate seed={cur.seed} kind={cur.kind} hue={cur.hue} label={`${cur.title}, ${cur.place}`} w={cur.land ? 1000 : 800} h={cur.land ? 800 : 1000} /></div></div>
            <div className="overflow-auto p-5">
              <div className="flex justify-between"><p className="text-[11px] uppercase tracking-widest text-white/50">{cur.col} · {cur.year}</p><button onClick={() => setView(null)} className="border border-white/30 px-3 py-1 text-xs">Close</button></div>
              <h2 className="mt-2 text-4xl font-light leading-tight" style={serif}>{cur.title}</h2><p className="text-sm text-white/60">{cur.place}</p>
              <div className="mt-4 flex gap-2 text-xs"><button className="flex-1 border border-white/30 px-3 py-2" onClick={() => step(-1)}>← Prev</button><button className="flex-1 border border-white/30 px-3 py-2" onClick={() => step(1)}>Next →</button><button aria-pressed={favs.includes(cur.id)} className="border border-white/30 px-3 py-2" onClick={() => fav(cur.id)}>{favs.includes(cur.id) ? "♥" : "♡"} F</button></div>
              <h3 className="mt-6 text-xs uppercase tracking-[0.25em] text-[#c8b88a]">Prints · archival pigment, cotton rag</h3>
              <ul className="mt-2 divide-y divide-white/10 text-sm">{SIZES.map((s) => <li key={s.s} className="flex justify-between py-2"><span>{s.s} <span className="text-white/50">· ed. of {s.ed}</span></span><span>{money(s.price)}</span></li>)}</ul>
              {!enq ? <button onClick={() => setEnq(true)} className="mt-4 w-full bg-[#c8b88a] py-3 text-sm font-semibold text-black">Enquire about a print</button> : sent ? <p role="status" className="mt-4 text-sm">{sent}</p> : (
                <form onSubmit={submit} noValidate className="mt-4 grid gap-3" aria-label="Print enquiry">
                  <Field label="Name" name="pn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={fe.name} inputClass="border-white/30" /><Field label="Email" name="pe" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={fe.email} inputClass="border-white/30" />
                  <label className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">Size<select value={f.size} onChange={(e) => setF({ ...f, size: e.target.value })} className="mt-1 w-full border border-white/30 bg-transparent px-2 py-2.5 text-[15px] normal-case">{SIZES.map((s, i) => <option key={s.s} value={i} className="text-black">{s.s} — {money(s.price)}</option>)}</select></label>
                  <button className="bg-[#c8b88a] py-3 text-sm font-semibold text-black">Send enquiry</button></form>)}
              <p className="mt-6 text-[11px] text-white/40">Images are procedurally generated by WASP for this self-initiated concept. Prints are fictional.</p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

