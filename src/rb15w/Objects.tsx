"use client";
import "@fontsource/dm-serif-display";
import "@fontsource-variable/dm-sans";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CartPanel, useCart, useWishlist, type Theme } from "@/rb15l/commerce";
import { Dialog, money } from "@/rb15l/ui";
import { MAKERS, OBJS, Silhouette, type Obj } from "./objects/data";

const Viewer = dynamic(() => import("./objects/Shelf").then((m) => m.Viewer), { ssr: false, loading: () => <p className="p-6 text-sm">Loading 3D…</p> });
const Shelf = dynamic(() => import("./objects/Shelf"), { ssr: false, loading: () => <p className="p-6 text-sm">Setting up the shelf…</p> });

const theme: Theme = { panel: "bg-[#f0e9dc] text-[#2b2620]", btn: "bg-[#2b2620] text-[#f0e9dc]", ghost: "border border-[#2b2620]/40", input: "border-[#2b2620]/30", muted: "text-[#2b2620]/60", font: "'DM Sans Variable', sans-serif" };
const serif = { fontFamily: "'DM Serif Display', serif" };
const CATS = ["All", "Ceramics", "Wood", "Glass", "Metal"];
const maker = (id: string) => MAKERS.find((m) => m.id === id)!;

export default function Objects({ reality }: { reality: string }) {
  const cart = useCart("objects");
  const wish = useWishlist("objects");
  const [bag, setBag] = useState(false);
  const [cat, setCat] = useState("All");
  const [mk, setMk] = useState("all");
  const [max, setMax] = useState(150);
  const [sort, setSort] = useState("featured");
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState<Obj | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [added, setAdded] = useState("");

  const items = useMemo(() => {
    let r = OBJS.filter((o) => (cat === "All" || o.cat === cat) && (mk === "all" || o.maker === mk) && o.price <= max && (!saved || wish.ids.includes(o.id)));
    if (sort === "asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [cat, mk, max, sort, saved, wish.ids]);
  const lines = cart.items.flatMap((i) => { const o = OBJS.find((x) => x.id === i.key); return o ? [{ key: i.key, title: o.name, sub: maker(o.maker).name, price: o.price, qty: i.qty }] : []; });
  const add = (o: Obj) => { cart.add(o.id); setAdded(`${o.name} added to your bag.`); };
  const selObj = OBJS.find((o) => o.id === sel);

  const Filters = (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-3" role="search" aria-label="Filter objects">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Material">{CATS.map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={"rounded-full px-4 py-1.5 text-sm " + (cat === c ? "bg-[#2b2620] text-[#f0e9dc]" : "border border-[#2b2620]/30")}>{c}</button>)}</div>
      <label className="text-xs">Maker<select value={mk} onChange={(e) => setMk(e.target.value)} className="ml-2 border border-[#2b2620]/30 bg-transparent px-2 py-1.5 text-sm"><option value="all">All makers</option>{MAKERS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
      <label className="text-xs">Up to <b>{money(max)}</b><input type="range" min={40} max={150} step={2} value={max} onChange={(e) => setMax(+e.target.value)} className="ml-2 align-middle" aria-label="Maximum price" /></label>
      <label className="text-xs">Sort<select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-2 border border-[#2b2620]/30 bg-transparent px-2 py-1.5 text-sm"><option value="featured">Featured</option><option value="asc">Price ↑</option><option value="desc">Price ↓</option><option value="name">Name</option></select></label>
      <button aria-pressed={saved} onClick={() => setSaved(!saved)} className="rounded-full border border-[#2b2620]/30 px-4 py-1.5 text-sm">♥ Saved ({wish.ids.length})</button>
      <span className="text-sm opacity-60" aria-live="polite">{items.length} objects</span>
    </div>
  );
  const Grid = items.length === 0 ? <p className="py-16 text-lg">No objects match. Try raising the price limit.</p> : (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-5">{items.map((o) => (
      <li key={o.id}><button onClick={() => setOpen(o)} className="group block w-full text-left"><div className="flex aspect-[4/5] items-center justify-center bg-[#ddd2bf] p-6 transition-colors group-hover:bg-[#d3c6ae]"><Silhouette o={o} className="w-full" /></div><p className="mt-2 text-lg leading-tight" style={serif}>{o.name}</p><p className="text-sm opacity-60">{maker(o.maker).name}</p></button>
        <div className="mt-1 flex items-center justify-between"><span className="text-sm font-semibold">{money(o.price)}</span><span className="flex gap-1"><button className="h-9 min-w-9 border border-[#2b2620]/30 px-2 text-sm" aria-pressed={wish.has(o.id)} aria-label={`Save ${o.name}`} onClick={() => wish.toggle(o.id)}>{wish.has(o.id) ? "♥" : "♡"}</button><button onClick={() => add(o)} className="h-9 bg-[#2b2620] px-3 text-sm text-[#f0e9dc]">Add</button></span></div></li>))}</ul>
  );

  return (
    <div className="min-h-screen bg-[#e8e0d2] text-[#2b2620]" style={{ fontFamily: "'DM Sans Variable', sans-serif" }}>
      <header className="sticky top-[88px] z-30 flex items-center justify-between bg-[#e8e0d2]/95 px-4 py-3 backdrop-blur sm:px-8"><span className="text-3xl" style={serif}>Objects</span><button onClick={() => setBag(true)} className="min-h-11 rounded-full bg-[#2b2620] px-5 text-sm text-[#f0e9dc]" aria-label={`Open bag, ${cart.count} items`}>Bag · {cart.count}</button></header>
      <p className="sr-only" role="status">{added}</p>
      {reality === "shop" && (
        <>
          <section className="grid gap-0 md:grid-cols-2"><div className="flex flex-col justify-end p-6 sm:p-12"><h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.95]" style={serif}>Things made slowly, for rooms lived in.</h1><p className="mt-5 max-w-md">Ten pieces from four makers. Each one turned, thrown, blown or spun by the person named beside it.</p></div>
            <div className="relative min-h-[50vh]"><Image src="/img/objects-still.jpg" alt="Handmade ceramic vases and a turned wooden bowl on a linen table" fill priority sizes="(max-width:768px) 100vw, 50vw" className="object-cover" /></div></section>
          <section className="px-4 py-14 sm:px-8"><div className="mb-8">{Filters}</div>{Grid}</section>
          <section className="bg-[#2b2620] px-4 py-16 text-[#f0e9dc] sm:px-8"><h2 className="text-5xl" style={serif}>Four makers</h2><div className="mt-8 grid gap-8 md:grid-cols-4">{MAKERS.map((m) => <article key={m.id}><h3 className="text-xl" style={serif}>{m.name}</h3><p className="text-xs uppercase tracking-[0.2em] opacity-60">{m.craft} · {m.place}</p><p className="mt-3 text-sm leading-relaxed opacity-85">{m.story}</p></article>)}</div></section>
        </>
      )}
      {reality === "workshop" && (
        <>
          <section className="px-4 py-14 sm:px-8"><h1 className="text-[clamp(3rem,9vw,8rem)] leading-[0.92]" style={serif}>Meet the hands.</h1><p className="mt-4 max-w-lg">Start with the maker, then the object. Four workshops, ten pieces.</p></section>
          {MAKERS.map((m, i) => { const mine = OBJS.filter((o) => o.maker === m.id); return (
            <section key={m.id} className={"grid gap-8 px-4 py-14 sm:px-8 md:grid-cols-[1fr_2fr] " + (i % 2 ? "bg-[#ddd2bf]" : "")}><div><p className="text-xs uppercase tracking-[0.25em] opacity-60">0{i + 1} · {m.craft} · {m.place}</p><h2 className="mt-2 text-5xl" style={serif}>{m.name}</h2><p className="mt-4 leading-relaxed">{m.story}</p></div>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">{mine.map((o) => <li key={o.id}><button onClick={() => setOpen(o)} className="block w-full text-left"><div className="flex aspect-square items-center justify-center bg-[#f0e9dc] p-5"><Silhouette o={o} className="w-full" /></div><p className="mt-2" style={serif}>{o.name}</p></button><p className="text-sm">{money(o.price)} · <button className="underline" onClick={() => add(o)}>add</button></p></li>)}</ul></section>); })}
        </>
      )}
      {reality === "inspect" && (
        <section className="grid lg:grid-cols-[1fr_340px]"><div className="h-[62vh] lg:h-[calc(100vh-140px)]"><Shelf items={OBJS} sel={sel} onSel={setSel} /></div>
          <aside className="p-5" aria-label="Selected object"><p className="text-xs uppercase tracking-[0.2em] opacity-60">Drag to look around · tap an object</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">{OBJS.map((o) => <li key={o.id}><button aria-pressed={sel === o.id} onClick={() => setSel(o.id)} className={"rounded-full border px-3 py-1.5 text-xs " + (sel === o.id ? "bg-[#2b2620] text-[#f0e9dc]" : "border-[#2b2620]/30")}>{o.name}</button></li>)}</ul>
            {selObj ? <div className="mt-6"><h2 className="text-4xl" style={serif}>{selObj.name}</h2><p className="text-sm opacity-60">{maker(selObj.maker).name} · {selObj.cat}</p><p className="mt-3">{selObj.desc}</p><p className="mt-3 text-2xl">{money(selObj.price)}</p><div className="mt-4 flex gap-2"><button onClick={() => add(selObj)} className="flex-1 bg-[#2b2620] px-4 py-3 text-[#f0e9dc]">Add to bag</button><button aria-pressed={wish.has(selObj.id)} onClick={() => wish.toggle(selObj.id)} className="border border-[#2b2620]/40 px-4">{wish.has(selObj.id) ? "♥" : "♡"}</button></div></div> : <p className="mt-6 text-sm opacity-70">Each object is turned on a lathe from the same profile curve used for its shop photograph. Select one to bring it to the front.</p>}</aside></section>
      )}

      <Dialog open={!!open} onClose={() => setOpen(null)} label={open?.name ?? "Object"} className={"max-w-4xl " + theme.panel}>
        {open && <div className="grid md:grid-cols-2"><div className="h-[340px] md:h-auto"><Viewer o={open} /></div>
          <div className="p-7"><div className="flex items-start justify-between gap-3"><h2 className="text-4xl" style={serif}>{open.name}</h2><button onClick={() => setOpen(null)} className="border border-[#2b2620]/40 px-3 py-1 text-sm">Close</button></div>
            <p className="mt-1 text-sm opacity-60">{open.cat} · by {maker(open.maker).name}, {maker(open.maker).place}</p><p className="mt-4">{open.desc}</p><p className="mt-4 text-3xl">{money(open.price)}</p>
            <div className="mt-5 flex gap-2"><button onClick={() => { add(open); }} className="flex-1 bg-[#2b2620] px-5 py-3 font-semibold text-[#f0e9dc]">Add to bag</button><button aria-pressed={wish.has(open.id)} onClick={() => wish.toggle(open.id)} className="border border-[#2b2620]/40 px-4">{wish.has(open.id) ? "♥ Saved" : "♡ Save"}</button></div>
            <p className="mt-2 text-sm" role="status">{added}</p><p className="mt-4 text-xs opacity-60">Drag the object to turn it. Delivery 3–5 days; free over £150. 30-day returns.</p></div></div>}
      </Dialog>
      <CartPanel open={bag} onClose={() => setBag(false)} ns="objects" lines={lines} onQty={cart.setQty} onRemove={cart.remove} onClear={cart.clear} theme={theme} />
    </div>
  );
}

