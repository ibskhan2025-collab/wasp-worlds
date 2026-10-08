"use client";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "@fontsource/anton";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Dialog, Field, isEmail, post } from "@/rb15l/ui";
import { useReducedMotion } from "@/rb15l/hooks";
import { COURSES, DIETS, DISHES, GALLERY, DishArt, type Dish } from "./casa/data";
import Reserve, { type Skin } from "./casa/Reserve";

const Casa3D = dynamic(() => import("./casa/Casa3D"), { ssr: false, loading: () => <p className="p-10 font-mono text-xs">Loading the dining room…</p> });

/* ---------- shared engine ---------- */
function useMenu() {
  const [q, setQ] = useState("");
  const [course, setCourse] = useState("All");
  const [diets, setDiets] = useState<string[]>([]);
  const [sort, setSort] = useState("menu");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let r = DISHES.filter((d) => (course === "All" || d.course === course) && diets.every((t) => d.tags.includes(t)) && (!s || (d.name + " " + d.desc + " " + d.ing).toLowerCase().includes(s)));
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [q, course, diets, sort]);
  return { q, setQ, course, setCourse, diets, sort, setSort, list, toggle: (t: string) => setDiets((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t])), reset: () => { setQ(""); setCourse("All"); setDiets([]); setSort("menu"); } };
}
type Menu = ReturnType<typeof useMenu>;
type Cls = { input: string; chip: string; on: string };

function Controls({ m, c, label = "Filter the menu" }: { m: Menu; c: Cls; label?: string }) {
  return (
    <div role="search" aria-label={label} className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="min-w-[200px] flex-1"><label htmlFor="casa-q" className="sr-only">Search dishes or ingredients</label><input id="casa-q" type="search" value={m.q} onChange={(e) => m.setQ(e.target.value)} placeholder="Search dishes or ingredients…" className={"w-full border bg-transparent px-3 py-2.5 text-[15px] outline-none " + c.input} /></div>
        <div><label htmlFor="casa-sort" className="sr-only">Sort</label><select id="casa-sort" value={m.sort} onChange={(e) => m.setSort(e.target.value)} className={"border bg-transparent px-3 py-2.5 text-[15px] " + c.input}><option className="text-black" value="menu">Menu order</option><option className="text-black" value="price-asc">Price ↑</option><option className="text-black" value="price-desc">Price ↓</option></select></div>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Course">
        {COURSES.map((x) => <button key={x} aria-pressed={m.course === x} onClick={() => m.setCourse(x)} className={"border px-3 py-1.5 text-sm " + (m.course === x ? c.on : c.chip)}>{x}</button>)}
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Dietary">
        {DIETS.map(([k, l]) => <button key={k} aria-pressed={m.diets.includes(k)} onClick={() => m.toggle(k)} className={"border px-3 py-1.5 text-sm " + (m.diets.includes(k) ? c.on : c.chip)}>{l}</button>)}
        <span className="ml-2 text-sm opacity-70" aria-live="polite">{m.list.length} of {DISHES.length} dishes</span>
        {(m.q || m.course !== "All" || m.diets.length > 0) && <button onClick={m.reset} className="text-sm underline">Reset</button>}
      </div>
    </div>
  );
}

const Empty = ({ m }: { m: Menu }) => <p className="py-10 text-lg">Nothing matches that. <button className="underline" onClick={m.reset}>Clear filters</button></p>;
const tagLabel = (t: string) => DIETS.find((d) => d[0] === t)?.[1] ?? t;

function DishModal({ dish, onClose, onReserve, cls }: { dish: Dish | null; onClose: () => void; onReserve: () => void; cls: string }) {
  if (!dish) return null;
  return (
    <Dialog open onClose={onClose} label={dish.name} className={"max-w-3xl " + cls}>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="flex items-center justify-center bg-black/10 p-8"><DishArt d={dish} className="w-full max-w-[320px]" /></div>
        <div className="p-7">
          <div className="flex items-start justify-between gap-4"><h2 className="text-3xl font-semibold leading-tight" style={{ fontFamily: "'Fraunces Variable', serif" }}>{dish.name}</h2><button onClick={onClose} aria-label="Close dish" className="border border-current/30 px-3 py-1 text-sm">Close</button></div>
          <p className="mt-1 text-xl">£{dish.price} <span className="text-sm opacity-60">· {dish.course}</span></p>
          <p className="mt-4">{dish.desc}</p>
          <p className="mt-3 text-sm italic opacity-75">{dish.story}</p>
          <ul className="mt-4 flex flex-wrap gap-2">{dish.tags.map((t) => <li key={t} className="border border-current/30 px-2 py-0.5 text-xs">{tagLabel(t)}</li>)}</ul>
          <p className="mt-3 text-xs opacity-60">Ingredients: {dish.ing}. Tell us about allergies when you book.</p>
          <button onClick={() => { onClose(); onReserve(); }} className="mt-6 bg-current px-5 py-3 font-semibold"><span className="mix-blend-difference text-white">Reserve a table</span></button>
        </div>
      </div>
    </Dialog>
  );
}

function GalleryTile({ g, className = "", filter = "" }: { g: (typeof GALLERY)[number]; className?: string; filter?: string }) {
  const d = "dish" in g ? DISHES.find((x) => x.id === g.dish) : undefined;
  if (d) return <div className={"flex items-center justify-center bg-[#e9dcc4] p-6 " + className}><DishArt d={d} className="h-full max-h-[280px] w-full" /></div>;
  if (!g.src) return null;
  return (
    <div className={"relative overflow-hidden " + className}>
      <Image src={g.src} alt={g.cap} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" style={{ objectPosition: g.pos, transform: `scale(${g.scale ?? 1})`, filter }} />
    </div>
  );
}

function Gallery({ cls = "", tile = "aspect-[4/5]", filter = "", onOpen }: { cls?: string; tile?: string; filter?: string; onOpen: (i: number) => void }) {
  return (
    <ul className={"grid grid-cols-2 gap-3 md:grid-cols-4 " + cls}>
      {GALLERY.map((g, i) => <li key={g.id}><button onClick={() => onOpen(i)} className="group block w-full text-left" aria-label={`Open photograph: ${g.cap}`}><GalleryTile g={g} className={tile + " transition-transform duration-500 group-hover:scale-[1.02]"} filter={filter} /><span className="mt-1 block text-xs opacity-70">{g.cap}</span></button></li>)}
    </ul>
  );
}

function Lightbox({ i, setI, cls }: { i: number | null; setI: (n: number | null) => void; cls: string }) {
  useEffect(() => {
    if (i === null) return;
    const f = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((i + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setI((i + GALLERY.length - 1) % GALLERY.length);
    };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [i, setI]);
  if (i === null) return null;
  const g = GALLERY[i];
  return (
    <Dialog open onClose={() => setI(null)} label={`Photograph ${i + 1} of ${GALLERY.length}: ${g.cap}`} className={"max-w-4xl " + cls} z={95}>
      <figure className="p-3">
        <GalleryTile g={g} className="aspect-[4/3] w-full" />
        <figcaption className="flex items-center justify-between gap-3 px-1 pt-3 text-sm"><span>{g.cap} <span className="opacity-60">({i + 1}/{GALLERY.length})</span></span>
          <span className="flex gap-2"><button className="border border-current/30 px-3 py-1" onClick={() => setI((i + GALLERY.length - 1) % GALLERY.length)}>← Prev</button><button className="border border-current/30 px-3 py-1" onClick={() => setI((i + 1) % GALLERY.length)}>Next →</button><button className="border border-current/30 px-3 py-1" onClick={() => setI(null)}>Close</button></span></figcaption>
      </figure>
    </Dialog>
  );
}

function ContactForm({ skin }: { skin: Skin }) {
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [e, setE] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Your name, please.";
    if (!isEmail(f.email)) x.email = "Enter a valid email.";
    if (f.msg.trim().length < 10) x.msg = "A sentence or two, at least.";
    setE(x);
    if (Object.keys(x).length) return;
    const r = await post("/api/enquiries", { kind: "contact", name: f.name, email: f.email, payload: { world: "casa", message: f.msg } });
    if (r.ok) setOk(true);
    else setE({ msg: "Could not send just now. Please try again." });
  };
  if (ok) return <p role="status" className={skin.card + " p-5"}>Thank you — we read everything and reply within a day.</p>;
  return (
    <form onSubmit={submit} noValidate className="grid gap-3" aria-label="Contact CASA">
      <Field label="Name" name="cname" value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} error={e.name} inputClass={skin.input} />
      <Field label="Email" name="cemail" type="email" value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} error={e.email} inputClass={skin.input} />
      <Field label="Message" name="cmsg" value={f.msg} onChange={(x) => setF({ ...f, msg: x.target.value })} error={e.msg} inputClass={skin.input} />
      <div><button className={skin.btn + " px-5 py-2.5 font-semibold"}>Send message</button></div>
    </form>
  );
}

type VP = { m: Menu; open: (d: Dish) => void; table: string; setTable: (s: string) => void; reserveRef: MutableRefObject<() => void>; lb: (i: number) => void };
const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/* ---------- CLASSIC ---------- */
const CL: Skin & Cls = { input: "border-[#2a1810]/30 focus-visible:ring-[#b5502a]", btn: "bg-[#b5502a] text-[#fbf3e4] border-[#b5502a]", ghost: "border border-[#2a1810]/40", card: "bg-[#efe2cb]", muted: "text-[#2a1810]/60", chip: "border-[#2a1810]/25 hover:bg-[#2a1810]/5", on: "bg-[#2a1810] text-[#f7efe0] border-[#2a1810]" };
function Classic({ m, open, table, setTable, reserveRef, lb }: VP) {
  const [view, setView] = useState("home");
  const go = (v: string) => { setView(v); window.scrollTo({ top: 0 }); };
  reserveRef.current = () => go("reserve");
  const nav = ["home", "menu", "gallery", "story", "contact", "reserve"];
  return (
    <div className="min-h-screen bg-[#f7efe0] text-[#2a1810]" style={{ fontFamily: "'Inter Variable', sans-serif" }}>
      <nav className="sticky top-[88px] z-30 flex items-center justify-between border-b border-[#2a1810]/15 bg-[#f7efe0]/95 px-5 py-3 backdrop-blur" aria-label="CASA">
        <button onClick={() => go("home")} className="text-2xl font-semibold tracking-wide" style={{ fontFamily: "'Fraunces Variable', serif" }}>Casa</button>
        <ul className="flex gap-1 overflow-x-auto text-sm">{nav.slice(1).map((v) => <li key={v}><button aria-current={view === v ? "page" : undefined} onClick={() => go(v)} className={"px-3 py-1.5 capitalize " + (view === v ? "border-b-2 border-[#b5502a] font-semibold" : "opacity-70 hover:opacity-100")}>{v === "reserve" ? "Reserve" : v}</button></li>)}</ul>
      </nav>
      {view === "home" && (
        <>
          <section className="relative h-[78vh] min-h-[460px]">
            <Image src="/img/casa-hero.jpg" alt="Grilled sea bream with charred lemon on a dark ceramic plate" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810] via-[#2a1810]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-3xl p-6 text-[#fbf3e4] sm:p-12">
              <p className="font-mono text-xs uppercase tracking-[0.25em]">Harbour kitchen · Tuesday to Sunday</p>
              <h1 className="mt-3 text-5xl leading-[1.02] sm:text-7xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>Cooked over vine wood, eaten at the water.</h1>
              <div className="mt-6 flex gap-3"><button onClick={() => go("reserve")} className="bg-[#d9763a] px-6 py-3 font-semibold text-black">Reserve a table</button><button onClick={() => go("menu")} className="border border-white/70 px-6 py-3">See the menu</button></div>
            </div>
          </section>
          <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
            {DISHES.filter((d) => ["sea-bream", "burrata", "olive-cake"].includes(d.id)).map((d) => (
              <button key={d.id} onClick={() => open(d)} className="group text-left">
                <div className="flex aspect-square items-center justify-center bg-[#e9dcc4] p-8 transition-colors group-hover:bg-[#e2d1b0]"><DishArt d={d} className="w-full" /></div>
                <h2 className="mt-3 text-2xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>{d.name} <span className="text-base opacity-60">£{d.price}</span></h2><p className="text-sm opacity-75">{d.desc}</p>
              </button>
            ))}
          </section>
          <section className="bg-[#2a1810] px-5 py-16 text-[#f4e6d0]"><div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <div><h2 className="text-xl font-semibold">Hours</h2><p className="mt-2 opacity-80">Tuesday–Sunday, 17:30–22:30.<br />Closed Mondays. Last booking 22:00.</p></div>
            <div><h2 className="text-xl font-semibold">Find us</h2><p className="mt-2 opacity-80">14 Harbour Lane (fictional).<br />Step-free entrance on the quay side.</p></div>
            <div><h2 className="text-xl font-semibold">Dietary</h2><p className="mt-2 opacity-80">Every dish is tagged. Vegetarian, vegan, gluten-free and dairy-free are filterable on the menu.</p></div>
          </div></section>
        </>
      )}
      {view === "menu" && (
        <section className="mx-auto max-w-5xl px-5 py-12">
          <h1 className="text-5xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>The menu</h1>
          <div className="mt-6"><Controls m={m} c={CL} /></div>
          {m.list.length === 0 ? <Empty m={m} /> : (COURSES.slice(1).filter((c) => m.list.some((d) => d.course === c))).map((c) => (
            <div key={c} className="mt-10"><h2 className="border-b border-[#2a1810]/30 pb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5502a]">{c}</h2>
              <ul>{m.list.filter((d) => d.course === c).map((d) => (
                <li key={d.id} className="border-b border-[#2a1810]/10"><button onClick={() => open(d)} className="flex w-full items-center gap-4 py-4 text-left hover:bg-[#2a1810]/5"><DishArt d={d} className="h-16 w-16 shrink-0" /><span className="flex-1"><span className="block text-xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>{d.name}</span><span className="block text-sm opacity-70">{d.desc}</span><span className="mt-1 flex gap-1">{d.tags.map((t) => <span key={t} className="border border-[#2a1810]/30 px-1.5 text-[10px] uppercase">{t}</span>)}</span></span><span className="text-lg">£{d.price}</span></button></li>
              ))}</ul></div>
          ))}
        </section>
      )}
      {view === "gallery" && <section className="mx-auto max-w-6xl px-5 py-12"><h1 className="text-5xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>Gallery</h1><p className="mb-6 mt-2 opacity-70">Click any frame. Arrow keys move between them.</p><Gallery onOpen={lb} /></section>}
      {view === "story" && (
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2">
          <div className="relative aspect-[4/5]"><Image src="/img/casa-room.jpg" alt="The CASA dining room, candlelit" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" /></div>
          <div className="self-center"><h1 className="text-5xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>Story</h1>
            <p className="mt-5 text-lg leading-relaxed">CASA started as a wood grill and eleven tables in a former net loft. The idea was plain: cook what the boats bring in, cook it over fire, and never make the food more complicated than the morning it came from.</p>
            <p className="mt-4 leading-relaxed opacity-80">Seven years on there are fourteen dishes, one menu that changes when the sea says so, and a kitchen that still makes its own butter. We don&apos;t do tasting menus. We do dinner.</p>
            <p className="mt-4 text-sm opacity-60">CASA is a fictional restaurant, built by WASP as a world.</p></div>
        </section>
      )}
      {view === "contact" && <section className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-2"><div><h1 className="text-5xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>Contact</h1><p className="mt-4">14 Harbour Lane (fictional)<br />hello@casa.example<br />Tuesday–Sunday 17:30–22:30</p><p className="mt-4 text-sm opacity-70">Private dining for 12–30: write to us below.</p></div><ContactForm skin={CL} /></section>}
      {view === "reserve" && <section className="mx-auto max-w-3xl px-5 py-12"><h1 className="mb-6 text-5xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>Reserve a table</h1><Reserve skin={CL} table={table || undefined} onClearTable={() => setTable("")} /></section>}
    </div>
  );
}

/* ---------- OCEANIC ---------- */
function Water({ depth, reduced }: { depth: MutableRefObject<number>; reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0, w = 0, h = 0;
    const bubbles = Array.from({ length: 36 }, (_, i) => ({ x: (i * 97) % 100, y: (i * 53) % 100, r: 2 + (i % 5) * 2, s: 6 + (i % 7) * 3 }));
    const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const size = () => { w = c.width = c.clientWidth; h = c.height = c.clientHeight; };
    const draw = (t: number) => {
      const d = depth.current;
      const top = mix([47, 182, 201], [2, 12, 30], Math.min(1, d * 1.6)), bot = mix([10, 90, 130], [1, 6, 16], Math.min(1, d * 1.3 + 0.2));
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${top})`); g.addColorStop(1, `rgb(${bot})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const light = Math.max(0, 1 - d * 1.8);
      for (let i = 0; i < 9; i++) {
        const x = ((i * 137 + Math.sin(t / 3000 + i) * 90) % (w + 200)), y = (Math.sin(t / 4000 + i * 2) * 0.5 + 0.5) * h * 0.6;
        const r = 120 + (i % 4) * 60, rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, `rgba(180,255,245,${0.16 * light})`); rg.addColorStop(1, "rgba(180,255,245,0)");
        ctx.fillStyle = rg; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.globalCompositeOperation = "source-over";
      for (let k = 0; k < 4; k++) {
        ctx.beginPath(); ctx.moveTo(0, 0);
        for (let x = 0; x <= w; x += 12) ctx.lineTo(x, 20 + k * 14 + Math.sin(x * 0.012 + t / (700 + k * 200) + k) * (10 - k * 2));
        ctx.lineTo(w, 0); ctx.closePath(); ctx.fillStyle = `rgba(255,255,255,${0.12 - k * 0.025})`; ctx.fill();
      }
      ctx.strokeStyle = "rgba(200,255,255,.35)"; ctx.lineWidth = 1;
      bubbles.forEach((b) => { const y = h - (((t / 1000) * b.s + b.y * 8) % (h + 40)); ctx.beginPath(); ctx.arc((b.x / 100) * w + Math.sin(t / 900 + b.y) * 8, y, b.r, 0, 7); ctx.stroke(); });
    };
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
    size();
    if (reduced) { draw(0); const f = () => draw(0); window.addEventListener("scroll", f); window.addEventListener("resize", () => { size(); draw(0); }); return () => window.removeEventListener("scroll", f); }
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", size);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); };
  }, [depth, reduced]);
  return <canvas ref={ref} className="sticky top-[88px] block h-[calc(100vh-88px)] w-full" style={{ marginBottom: "calc(-100vh + 88px)" }} aria-hidden="true" />;
}

const OC: Skin & Cls = { input: "border-white/40 placeholder:text-white/50", btn: "bg-[#7ff3e0] text-[#02202a] border-[#7ff3e0]", ghost: "border border-white/40", card: "bg-white/10 backdrop-blur", muted: "text-white/70", chip: "border-white/30 bg-white/5 hover:bg-white/15", on: "bg-[#7ff3e0] text-[#02202a] border-[#7ff3e0]" };
function Oceanic({ m, open, table, setTable, reserveRef, lb }: VP) {
  const reduced = useReducedMotion();
  const depth = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const [meters, setMeters] = useState(0);
  const [inView, setInView] = useState(true);
  reserveRef.current = () => jump("ocean-reserve");
  useEffect(() => {
    const f = () => {
      const r = wrap.current!.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - window.innerHeight)));
      depth.current = p; setMeters(Math.round(p * 30)); setInView(r.bottom > window.innerHeight * 0.6 && r.top < window.innerHeight * 0.4);
    };
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const zones: [string, string, string][] = [["Small", "The shallows", "Light still reaches. Small plates drift up from the boats."], ["Pasta & rice", "The reef", "Warm and crowded. Rice and pasta, slow cooked."], ["Fire", "Open water", "Bigger, cooler, from the fire."], ["Sweet", "The deep", "Quiet down here. Sweet things."]];
  return (
    <div ref={wrap} className="relative text-white" style={{ fontFamily: "'Inter Variable', sans-serif" }}>
      <style>{`@keyframes casa-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>
      <Water depth={depth} reduced={reduced} />
      {inView && <div className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 font-mono text-[10px] sm:flex" aria-hidden="true"><span>0m</span><div className="relative h-40 w-px bg-white/40"><span className="absolute -left-1 h-2.5 w-2.5 rounded-full bg-[#7ff3e0]" style={{ top: `${(meters / 30) * 100}%` }} /></div><span>{meters}m</span></div>}
      <div className="relative z-10">
        <section className="flex min-h-[85vh] flex-col justify-center px-6 sm:px-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/80">Casa · oceanic · scroll to descend</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(3rem,10vw,9rem)] font-light leading-[0.95]" style={{ fontFamily: "'Fraunces Variable', serif" }}>The sea, served slowly.</h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">Everything on the menu started in water. Dive to see it, tap a bubble to take a closer look.</p>
          <div className="mt-8 max-w-3xl"><Controls m={m} c={OC} label="Sonar: filter the menu" /></div>
        </section>
        {m.list.length === 0 && <div className="px-6 sm:px-16"><Empty m={m} /></div>}
        {zones.filter(([c]) => m.list.some((d) => d.course === c)).map(([c, title, sub]) => (
          <section key={c} className="px-6 py-24 sm:px-16" aria-labelledby={`z-${c}`}>
            <h2 id={`z-${c}`} className="text-5xl font-light sm:text-7xl" style={{ fontFamily: "'Fraunces Variable', serif" }}>{title}</h2><p className="mt-2 text-white/75">{sub}</p>
            <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-14">
              {m.list.filter((d) => d.course === c).map((d, i) => (
                <li key={d.id} style={{ marginTop: (i % 3) * 28, animation: `casa-bob ${5 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` }}>
                  <button onClick={() => open(d)} className="group flex w-44 flex-col items-center text-center">
                    <span className="flex h-44 w-44 items-center justify-center rounded-full border border-white/40 bg-white/10 p-4 shadow-[inset_0_0_40px_rgba(255,255,255,.25)] backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"><DishArt d={d} className="w-full" /></span>
                    <span className="mt-3 text-lg leading-tight" style={{ fontFamily: "'Fraunces Variable', serif" }}>{d.name}</span><span className="text-sm text-white/70">£{d.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="px-6 py-20 sm:px-16"><h2 className="text-4xl font-light" style={{ fontFamily: "'Fraunces Variable', serif" }}>Through the glass</h2><div className="mt-6"><Gallery onOpen={lb} tile="aspect-square rounded-full" filter="saturate(.85) hue-rotate(-10deg)" /></div></section>
        <section id="ocean-reserve" className="px-6 pb-32 pt-20 sm:px-16"><div className="max-w-3xl rounded-3xl border border-white/30 bg-black/30 p-6 backdrop-blur-md sm:p-10"><h2 className="text-5xl font-light" style={{ fontFamily: "'Fraunces Variable', serif" }}>Drop anchor.</h2><p className="mb-6 mt-2 text-white/75">Reserve a table. Tuesday–Sunday, 17:30–22:30.</p><Reserve skin={OC} table={table || undefined} onClearTable={() => setTable("")} /></div></section>
      </div>
    </div>
  );
}

/* ---------- BRUTALIST ---------- */
const BR: Skin & Cls = { input: "border-black border-2 rounded-none", btn: "bg-black text-[#ffe600] border-black", ghost: "border-2 border-black", card: "border-4 border-black bg-[#ffe600]", muted: "text-black/70", chip: "border-black border-2 bg-transparent hover:bg-black hover:text-[#ffe600]", on: "border-black border-2 bg-black text-[#ffe600]" };
function Brutalist({ m, open, table, setTable, reserveRef, lb }: VP) {
  reserveRef.current = () => jump("br-reserve");
  return (
    <div className="bg-[#f2f0e8] text-black" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <div className="overflow-hidden border-b-4 border-black bg-[#ffe600] py-2 text-sm font-semibold uppercase" aria-hidden="true"><div className="wasp-marquee flex w-max gap-10 whitespace-nowrap">{Array.from({ length: 12 }).map((_, i) => <span key={i}>Tue–Sun 17:30 → 22:30 ✱ Fire ✱ Salt ✱ Sea ✱ No tasting menu</span>)}</div></div>
      <section className="border-b-4 border-black px-4 pt-6"><h1 className="select-none text-[34vw] leading-[0.78] tracking-tighter sm:text-[26vw]" style={{ fontFamily: "Anton, sans-serif" }}>CASA</h1>
        <div className="grid gap-0 border-t-4 border-black md:grid-cols-3"><p className="border-black p-4 text-lg font-semibold md:border-r-4">FOOD IS NOT A CONCEPT. IT IS HEAT, SALT, TIMING.</p><p className="border-black p-4 md:border-r-4">14 dishes. One grill. Eleven tables. A harbour.</p><button onClick={() => jump("br-reserve")} className="bg-black p-4 text-left text-2xl font-bold uppercase text-[#ffe600] hover:bg-red-600">Book a table ↓</button></div></section>
      <section id="br-menu" className="px-4 py-10"><h2 className="text-[16vw] leading-[0.85] sm:text-[9vw]" style={{ fontFamily: "Anton, sans-serif" }}>MENU / {String(m.list.length).padStart(2, "0")}</h2><div className="my-6"><Controls m={m} c={BR} /></div>
        {m.list.length === 0 ? <Empty m={m} /> : (
          <table className="w-full border-collapse border-y-4 border-black text-left"><caption className="sr-only">Menu ledger</caption><thead className="sr-only"><tr><th>No</th><th>Dish</th><th>Diet</th><th>Price</th></tr></thead>
            <tbody>{m.list.map((d) => (
              <tr key={d.id} className="group border-b-2 border-black"><td colSpan={4} className="p-0"><button onClick={() => open(d)} className="grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 px-1 py-3 text-left hover:bg-black hover:text-[#ffe600] sm:grid-cols-[4rem_1fr_12rem_5rem]"><span className="text-sm">{String(DISHES.indexOf(d) + 1).padStart(2, "0")}</span><span className="text-2xl uppercase leading-none sm:text-4xl" style={{ fontFamily: "Anton, sans-serif" }}>{d.name}</span><span className="hidden text-xs uppercase sm:block">{d.tags.join(" · ")}</span><span className="text-right text-xl font-semibold">£{d.price}</span></button></td></tr>
            ))}</tbody></table>
        )}</section>
      <section className="border-t-4 border-black bg-[#ffe600] px-4 py-10"><h2 className="text-[14vw] leading-[0.85] sm:text-[8vw]" style={{ fontFamily: "Anton, sans-serif" }}>EVIDENCE</h2><div className="mt-5"><Gallery onOpen={lb} cls="gap-0 md:grid-cols-4 [&_li]:border-2 [&_li]:border-black" tile="aspect-square" filter="grayscale(1) contrast(1.25)" /></div></section>
      <section id="br-reserve" className="px-4 py-10"><h2 className="text-[16vw] leading-[0.85] sm:text-[9vw]" style={{ fontFamily: "Anton, sans-serif" }}>RESERVE</h2><div className="mt-6 max-w-3xl"><Reserve skin={BR} table={table || undefined} onClearTable={() => setTable("")} /></div></section>
      <section className="border-t-4 border-black px-4 py-10"><h2 className="text-[10vw] leading-[0.85] sm:text-6xl" style={{ fontFamily: "Anton, sans-serif" }}>WRITE / FIND</h2><div className="mt-4 grid gap-8 md:grid-cols-2"><p>14 HARBOUR LANE (FICTIONAL)<br />HELLO@CASA.EXAMPLE<br />CLOSED MONDAYS.</p><ContactForm skin={BR} /></div></section>
    </div>
  );
}

/* ---------- JAPANESE ---------- */
const KANJI = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四"];
const JP: Skin & Cls = { input: "border-0 border-b border-[#1d1b18]/40 rounded-none px-0", btn: "border border-[#1d1b18] text-[#1d1b18] hover:bg-[#1d1b18] hover:text-[#f3eee3]", ghost: "border border-[#1d1b18]/50", card: "border border-[#1d1b18]/30", muted: "text-[#1d1b18]/60", chip: "border-transparent opacity-60 hover:opacity-100", on: "border-transparent border-b-[#b2332a] border-b-2 rounded-none" };
function Japanese({ m, open, table, setTable, reserveRef, lb }: VP) {
  reserveRef.current = () => jump("jp-reserve");
  const serif = { fontFamily: "'Cormorant Garamond', serif" };
  return (
    <div className="bg-[#f3eee3] text-[#1d1b18]" style={{ fontFamily: "'Inter Variable', sans-serif", fontWeight: 300 }}>
      <section className="mx-auto grid min-h-[90vh] max-w-6xl grid-cols-[auto_1fr] gap-8 px-6 py-16 sm:gap-20">
        <h1 className="text-7xl font-light tracking-[0.3em] sm:text-9xl" style={{ ...serif, writingMode: "vertical-rl", textOrientation: "upright" }}>CASA</h1>
        <div className="relative self-stretch"><Image src="/img/casa-room.jpg" alt="The CASA dining room in soft light" fill sizes="(max-width:768px) 70vw, 60vw" className="object-cover" style={{ filter: "saturate(.35) contrast(.9) brightness(1.05)" }} /><span className="absolute -bottom-5 right-4 flex h-14 w-14 items-center justify-center bg-[#b2332a] text-2xl text-[#f3eee3]" aria-hidden="true">家</span>
          <p className="absolute left-0 top-0 max-w-[14rem] -translate-y-1/2 bg-[#f3eee3] py-2 pr-4 text-sm italic" style={serif}>A table, a fire, and silence between courses.</p></div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16"><h2 className="text-center text-4xl font-light tracking-[0.3em]" style={serif}>MENU · 品書き</h2><div className="mx-auto my-8 max-w-2xl"><Controls m={m} c={JP} /></div>
        {m.list.length === 0 ? <Empty m={m} /> : <ol className="grid gap-x-16 md:grid-cols-2">{m.list.map((d) => (
          <li key={d.id} className="border-t border-[#1d1b18]/20"><button onClick={() => open(d)} className="flex w-full gap-4 py-6 text-left hover:opacity-60"><span className="w-8 shrink-0 pt-1 text-sm text-[#b2332a]" style={serif}>{KANJI[DISHES.indexOf(d)]}</span><span className="flex-1"><span className="block text-2xl" style={serif}>{d.name}</span><span className="mt-1 block text-sm leading-relaxed opacity-70">{d.desc}</span></span><span className="text-lg" style={serif}>{d.price}</span></button></li>
        ))}</ol>}</section>
      <section className="mx-auto max-w-5xl px-6 py-16"><Gallery onOpen={lb} cls="gap-8" tile="aspect-[3/4]" filter="saturate(.4) brightness(1.05)" /></section>
      <section id="jp-reserve" className="mx-auto max-w-xl px-6 pb-28 pt-10"><h2 className="mb-8 text-center text-4xl font-light tracking-[0.3em]" style={serif}>予約 · RESERVE</h2><Reserve skin={JP} table={table || undefined} onClearTable={() => setTable("")} /></section>
    </div>
  );
}

/* ---------- root ---------- */
export default function Casa({ reality }: { reality: string }) {
  const m = useMenu();
  const [dish, setDish] = useState<Dish | null>(null);
  const [lb, setLb] = useState<number | null>(null);
  const [table, setTable] = useState("");
  const reserveRef = useRef<() => void>(() => {});
  const p: VP = { m, open: setDish, table, setTable, reserveRef, lb: setLb };
  const modalCls = reality === "oceanic" ? "bg-[#05202c] text-white border border-white/30" : reality === "brutalist" ? "bg-[#ffe600] text-black border-4 border-black" : reality === "japanese" ? "bg-[#f3eee3] text-[#1d1b18]" : "bg-[#f7efe0] text-[#2a1810]";
  return (
    <>
      {reality === "classic" && <Classic {...p} />}
      {reality === "oceanic" && <Oceanic {...p} />}
      {reality === "brutalist" && <Brutalist {...p} />}
      {reality === "japanese" && <Japanese {...p} />}
      {reality === "3d" && <Casa3D />}
      <DishModal dish={dish} onClose={() => setDish(null)} onReserve={() => setTimeout(() => reserveRef.current(), 50)} cls={modalCls} />
      <Lightbox i={lb} setI={setLb} cls={modalCls} />
    </>
  );
}

