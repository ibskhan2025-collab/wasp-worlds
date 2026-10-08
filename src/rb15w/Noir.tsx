"use client";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/jost";
import "@fontsource/ibm-plex-mono/400.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { CartPanel, useCart, useWishlist, type Theme } from "@/rb15l/commerce";
import { Field, isEmail, money, post } from "@/rb15l/ui";
import { CATS, PRODUCTS, Garment, BuyBox, type Product } from "./noir/data";

const Showroom = dynamic(() => import("./noir/Showroom"), { ssr: false, loading: () => <p className="p-10 font-mono text-xs text-white">Lighting the showroom…</p> });

const JOURNAL = [
  { t: "On black", b: "There is no such thing as a single black. There is the black of wool that has been dyed four times, the black of silk that shines at an angle, and the black of a coat that has been worn for ten winters and has turned, very slightly, green. We keep a shelf of black swatches in the studio. Most days we argue about which one is right." },
  { t: "The half-second", b: "A bias-cut dress arrives a half-second after the body that wears it. That delay is the whole point. It is the only part of fashion that cannot be photographed, only felt, which is why we keep trying to photograph it." },
  { t: "Fewer, then better", b: "We make nine pieces. Not because nine is a number we like, but because we could not honestly defend a tenth. Every piece in the collection replaced two others that were almost as good." },
];

function useNoir() {
  const cart = useCart("noir");
  const wish = useWishlist("noir");
  const [bag, setBag] = useState(false);
  const lines = cart.items.flatMap((i) => { const [id, size] = i.key.split("|"); const p = PRODUCTS.find((x) => x.id === id); return p ? [{ key: i.key, title: p.name, sub: `Size ${size}`, price: p.price, qty: i.qty }] : []; });
  return { cart, wish, bag, setBag, lines, add: (p: Product, size: string, qty: number) => { cart.add(`${p.id}|${size}`, qty); } };
}
type N = ReturnType<typeof useNoir>;
const themeEd: Theme = { panel: "bg-[#eee9e0] text-black", btn: "bg-black text-[#eee9e0]", ghost: "border border-black/40", input: "border-black/30", muted: "text-black/60", font: "'Jost Variable', sans-serif" };
const themeAr: Theme = { panel: "bg-[#f1efe8] text-black", btn: "bg-black text-[#f1efe8]", ghost: "border border-black/60", input: "border-black/40 rounded-none", muted: "text-black/60", font: "'IBM Plex Mono', monospace" };
const themeSh: Theme = { panel: "bg-[#111] text-[#eee9e0] border border-white/20", btn: "bg-[#b89b6a] text-black", ghost: "border border-white/30", input: "border-white/30", muted: "text-white/60", font: "'Jost Variable', sans-serif" };

function useFilter() {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");
  const [saved, setSaved] = useState(false);
  return { cat, setCat, sort, setSort, saved, setSaved };
}
function list(f: ReturnType<typeof useFilter>, wish: string[]) {
  let r = PRODUCTS.filter((p) => (f.cat === "All" || p.cat === f.cat) && (!f.saved || wish.includes(p.id)));
  if (f.sort === "asc") r = [...r].sort((a, b) => a.price - b.price);
  if (f.sort === "desc") r = [...r].sort((a, b) => b.price - a.price);
  return r;
}

function Appointment({ dark }: { dark?: boolean }) {
  const [f, setF] = useState({ name: "", email: "", date: "", kind: "Fitting" });
  const [e, setE] = useState<Record<string, string>>({});
  const [ok, setOk] = useState("");
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Your name, please.";
    if (!isEmail(f.email)) x.email = "Enter a valid email.";
    if (!f.date || new Date(f.date) < new Date(new Date().toDateString())) x.date = "Choose a future date.";
    setE(x);
    if (Object.keys(x).length) return;
    const r = await post("/api/enquiries", { kind: "appointment", name: f.name, email: f.email, payload: { world: "noir", date: f.date, kind: f.kind } });
    setOk(r.ok ? `Requested: ${f.kind.toLowerCase()} on ${f.date}. We will confirm by email.` : "Could not send. Please try again.");
  };
  const inp = dark ? "border-white/30" : "border-black/30";
  return (
    <form onSubmit={submit} noValidate className="grid max-w-xl gap-3" aria-label="Request an appointment">
      <Field label="Name" name="an" value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} error={e.name} inputClass={inp} />
      <Field label="Email" name="ae" type="email" value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} error={e.email} inputClass={inp} />
      <div className="grid grid-cols-2 gap-3"><Field label="Preferred date" name="ad" type="date" value={f.date} onChange={(x) => setF({ ...f, date: x.target.value })} error={e.date} inputClass={inp} />
        <div><label htmlFor="ak" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">Appointment</label><select id="ak" value={f.kind} onChange={(x) => setF({ ...f, kind: x.target.value })} className={"w-full border bg-transparent px-3 py-2.5 " + inp}>{["Fitting", "Private viewing", "Alterations"].map((k) => <option key={k} className="text-black">{k}</option>)}</select></div></div>
      <div><button className={"px-6 py-3 font-semibold " + (dark ? "bg-[#b89b6a] text-black" : "bg-black text-[#eee9e0]")}>Request appointment</button></div>
      {ok && <p role="status" className="text-sm">{ok}</p>}
    </form>
  );
}

function Product3({ p, n, onClose }: { p: Product; n: N; onClose: () => void }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2">
      <div className="md:col-span-2"><button onClick={onClose} className="text-sm underline">← Back to the collection</button></div>
      <Garment p={p} className="w-full" />
      <div className="self-center"><p className="text-xs uppercase tracking-[0.3em]">{p.cat}</p><h1 className="mt-2 text-6xl leading-none" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>{p.name}</h1><p className="mt-3 text-2xl">{money(p.price)}</p><p className="mt-5 max-w-md">{p.desc}</p>
        <dl className="mt-5 space-y-1 text-sm"><div><dt className="inline font-semibold">Fabric: </dt><dd className="inline">{p.fabric}</dd></div><div><dt className="inline font-semibold">Care: </dt><dd className="inline">{p.care}</dd></div></dl>
        <div className="mt-6 max-w-md"><BuyBox p={p} onAdd={(s, q) => n.add(p, s, q)} btn="bg-black text-[#eee9e0]" ghost="border border-black/40" wished={n.wish.has(p.id)} onWish={() => n.wish.toggle(p.id)} /></div></div>
    </div>
  );
}

function Editorial({ n }: { n: N }) {
  const f = useFilter();
  const [open, setOpen] = useState<Product | null>(null);
  const items = useMemo(() => list(f, n.wish.ids), [f, n.wish.ids]);
  return (
    <div className="bg-[#eee9e0] text-black" style={{ fontFamily: "'Jost Variable', sans-serif" }}>
      <header className="sticky top-[88px] z-30 flex items-center justify-between border-b border-black/15 bg-[#eee9e0]/95 px-5 py-3 backdrop-blur">
        <button onClick={() => setOpen(null)} className="text-3xl tracking-[0.25em]" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>NOIR</button>
        <nav className="flex items-center gap-5 text-xs uppercase tracking-[0.2em]" aria-label="NOIR"><a href="#collection">Collection</a><a href="#lookbook" className="hidden sm:inline">Lookbook</a><a href="#atelier" className="hidden sm:inline">Atelier</a><a href="#journal" className="hidden sm:inline">Journal</a>
          <button onClick={() => n.setBag(true)} className="border border-black px-3 py-1.5" aria-label={`Open bag, ${n.cart.count} items`}>Bag ({n.cart.count})</button></nav>
      </header>
      {open ? <Product3 p={open} n={n} onClose={() => setOpen(null)} /> : (
        <>
          <section className="grid min-h-[88vh] md:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col justify-between p-6 sm:p-12"><p className="text-xs uppercase tracking-[0.35em]">Autumn · Winter 26</p>
              <h1 className="text-[clamp(4rem,14vw,12rem)] font-normal italic leading-[0.85]" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>The<br />black<br />hour</h1>
              <div><p className="max-w-sm">Nine pieces. Wool, cashmere, calf leather, silk. Cut for a person who would like to be remembered for the coat, not the logo.</p><a href="#collection" className="mt-5 inline-block border-b border-black pb-1 text-sm uppercase tracking-[0.2em]">Enter the collection ↓</a></div></div>
            <div className="relative min-h-[60vh]"><Image src="/img/noir-hero.jpg" alt="Model in a long black wool coat against a grey studio wall" fill priority sizes="(max-width:768px) 100vw, 45vw" className="object-cover" /></div>
          </section>
          <section id="collection" className="px-5 py-20 sm:px-12"><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-6xl" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>Collection</h2>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter collection">{CATS.map((c) => <button key={c} aria-pressed={f.cat === c} onClick={() => f.setCat(c)} className={"px-3 py-1.5 text-xs uppercase tracking-[0.15em] " + (f.cat === c ? "bg-black text-[#eee9e0]" : "border border-black/30")}>{c}</button>)}
              <label className="sr-only" htmlFor="nsort">Sort</label><select id="nsort" value={f.sort} onChange={(e) => f.setSort(e.target.value)} className="border border-black/30 bg-transparent px-2 py-1.5 text-xs"><option value="featured">Featured</option><option value="asc">Price ↑</option><option value="desc">Price ↓</option></select>
              <button aria-pressed={f.saved} onClick={() => f.setSaved(!f.saved)} className="border border-black/30 px-3 py-1.5 text-xs uppercase tracking-[0.15em]">♥ Saved ({n.wish.ids.length})</button></div></div>
            {items.length === 0 ? <p className="mt-10">Nothing here yet. {f.saved ? "Save a piece with the heart." : ""}</p> : (
              <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">{items.map((p, i) => (
                <li key={p.id} className={i % 3 === 1 ? "md:mt-16" : ""}><button onClick={() => setOpen(p)} className="group block w-full text-left"><div className="overflow-hidden"><Garment p={p} className="w-full transition-transform duration-700 group-hover:scale-105" /></div><p className="mt-3 text-xs uppercase tracking-[0.2em] opacity-60">{p.cat}</p><p className="text-2xl" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>{p.name}</p><p>{money(p.price)}</p></button>
                  <button onClick={() => n.wish.toggle(p.id)} aria-pressed={n.wish.has(p.id)} className="mt-1 text-xs underline">{n.wish.has(p.id) ? "♥ Saved" : "♡ Save"}</button></li>
              ))}</ul>)}
          </section>
          <section id="lookbook" className="bg-black py-20 text-[#eee9e0]"><h2 className="px-5 text-6xl sm:px-12" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>Lookbook</h2>
            <ul className="mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-6 sm:px-12" tabIndex={0} aria-label="Lookbook, scroll horizontally">{[["Margaux + Lune", "50% 20%", 1], ["Vesper alone", "40% 60%", 1.6], ["Kohl, at dusk", "70% 35%", 1.3], ["Reve over Ash", "30% 40%", 1.2]].map(([t, pos, sc], i) => (
              <li key={t as string} className="relative w-[78vw] shrink-0 snap-center sm:w-[30vw]"><div className="relative aspect-[3/4] overflow-hidden"><Image src="/img/noir-hero.jpg" alt={`Look ${i + 1}: ${t}`} fill sizes="30vw" className="object-cover grayscale" style={{ objectPosition: pos as string, transform: `scale(${sc})` }} /></div><p className="mt-2 font-mono text-xs">LOOK 0{i + 1} — {t as string}</p></li>))}</ul></section>
          <section id="atelier" className="px-5 py-20 sm:px-12"><h2 className="text-6xl" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>Atelier</h2><p className="mb-8 mt-3 max-w-lg">Fittings, private viewings and alterations, by appointment. Wednesday to Saturday.</p><Appointment /></section>
          <section id="journal" className="border-t border-black/20 px-5 py-20 sm:px-12"><h2 className="text-6xl" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>Journal</h2><div className="mt-8 grid gap-10 md:grid-cols-3">{JOURNAL.map((j) => <article key={j.t}><h3 className="text-3xl italic" style={{ fontFamily: "'Bodoni Moda Variable', serif" }}>{j.t}</h3><p className="mt-3 leading-relaxed">{j.b}</p></article>)}</div></section>
        </>
      )}
    </div>
  );
}

function Archive({ n }: { n: N }) {
  const f = useFilter();
  const [ex, setEx] = useState<string | null>(null);
  const items = useMemo(() => list(f, n.wish.ids), [f, n.wish.ids]);
  return (
    <div className="min-h-screen bg-[#f1efe8] px-4 py-8 text-black sm:px-10" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-black pb-3"><h1 className="text-xl font-semibold uppercase tracking-[0.3em]">NOIR — Catalogue raisonné, AW26</h1><button onClick={() => n.setBag(true)} className="border border-black px-3 py-1 text-sm">BAG [{n.cart.count}]</button></div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs" role="group" aria-label="Filter">{CATS.map((c) => <button key={c} aria-pressed={f.cat === c} onClick={() => f.setCat(c)} className={"border border-black px-2 py-1 uppercase " + (f.cat === c ? "bg-black text-[#f1efe8]" : "")}>{c}</button>)}<button aria-pressed={f.saved} onClick={() => f.setSaved(!f.saved)} className="border border-black px-2 py-1">SAVED [{n.wish.ids.length}]</button>
        <select aria-label="Sort" value={f.sort} onChange={(e) => f.setSort(e.target.value)} className="border border-black bg-transparent px-2 py-1"><option value="featured">LOT ORDER</option><option value="asc">PRICE ASC</option><option value="desc">PRICE DESC</option></select></div>
      <table className="mt-5 w-full text-left text-sm"><thead><tr className="border-b border-black text-xs uppercase"><th className="py-2">Lot</th><th>Piece</th><th className="hidden sm:table-cell">Category</th><th className="hidden md:table-cell">Fabric</th><th className="text-right">GBP</th></tr></thead>
        <tbody>{items.map((p) => (<Fragment key={p.id}>
          <tr className="border-b border-black/30"><td className="py-3">{String(PRODUCTS.indexOf(p) + 1).padStart(3, "0")}</td><td><button aria-expanded={ex === p.id} onClick={() => setEx(ex === p.id ? null : p.id)} className="text-left font-semibold underline underline-offset-4">{p.name}</button></td><td className="hidden sm:table-cell">{p.cat}</td><td className="hidden md:table-cell">{p.fabric}</td><td className="text-right">{p.price}</td></tr>
          {ex === p.id && <tr key={p.id + "x"} className="border-b border-black"><td colSpan={5} className="bg-[#e7e4da] p-4"><div className="grid gap-6 md:grid-cols-[200px_1fr]"><Garment p={p} className="w-full max-w-[200px]" /><div><p>{p.desc}</p><p className="mt-2 text-xs">CARE: {p.care}</p><div className="mt-4 max-w-sm"><BuyBox p={p} onAdd={(s, q) => n.add(p, s, q)} btn="bg-black text-[#f1efe8]" ghost="border border-black" wished={n.wish.has(p.id)} onWish={() => n.wish.toggle(p.id)} /></div></div></div></td></tr>}
        </Fragment>))}</tbody></table>
      {items.length === 0 && <p className="mt-6 text-sm">NO LOTS MATCH.</p>}
      <div className="mt-14 grid gap-10 border-t-2 border-black pt-6 md:grid-cols-2"><div><h2 className="mb-3 text-sm uppercase tracking-[0.2em]">Appointments</h2><Appointment /></div><div><h2 className="mb-3 text-sm uppercase tracking-[0.2em]">Journal</h2>{JOURNAL.map((j) => <p key={j.t} className="mb-4 text-sm leading-relaxed"><b>{j.t}.</b> {j.b}</p>)}</div></div>
    </div>
  );
}

export default function Noir({ reality }: { reality: string }) {
  const n = useNoir();
  const theme = reality === "archive" ? themeAr : reality === "showroom" ? themeSh : themeEd;
  return (
    <>
      {reality === "editorial" && <Editorial n={n} />}
      {reality === "archive" && <Archive n={n} />}
      {reality === "showroom" && (<>
        <div className="flex justify-end bg-black px-4 py-2"><button onClick={() => n.setBag(true)} className="border border-white/30 px-3 py-1 text-sm text-white">Bag ({n.cart.count})</button></div>
        <Showroom onAdd={n.add} wished={n.wish.has} onWish={n.wish.toggle} btn={themeSh.btn} ghost={themeSh.ghost} /></>)}
      <CartPanel open={n.bag} onClose={() => n.setBag(false)} ns="noir" lines={n.lines} onQty={n.cart.setQty} onRemove={n.cart.remove} onClear={n.cart.clear} theme={theme} />
    </>
  );
}

