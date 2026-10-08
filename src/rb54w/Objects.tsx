"use client";

import { useMemo, useState } from "react";
import { media } from "@/rb54l/media";
import { Img } from "@/rb54l/ui";
import { useCart, money } from "@/rb54l/kit";
type XP = { reality: string; world?: unknown };

const ITEMS = [
  { id: "o1", sku: "VS-014", name: "Knot vase", cat: "Vases", colour: "Black", price: 88, p: media.objects[0], maker: "Deniz, Istanbul", story: "Thrown, then cut and rejoined while still leather-hard. No two knots line up the same way.", added: 5 },
  { id: "o2", sku: "VS-022", name: "Sun vase", cat: "Vases", colour: "Sand", price: 64, p: media.objects[1], maker: "Tia, Lisbon", story: "Unglazed outside so it goes darker where your hands hold it. That's the point.", added: 3 },
  { id: "o3", sku: "PT-003", name: "Parlour pitcher", cat: "Tableware", colour: "White", price: 120, p: media.objects[2], maker: "W. Finn, Leeds", story: "Pressed from a Victorian mould found in a house clearance.", added: 7 },
  { id: "o4", sku: "BW-110", name: "Bowls, set of 3", cat: "Tableware", colour: "Mixed", price: 72, p: media.objects[3], maker: "Mustapha, Fez", story: "Three glazes from the same kiln load. Colour depends on where they sat in the fire.", added: 1 },
  { id: "o5", sku: "TP-041", name: "Garden tea set", cat: "Tableware", colour: "Blue", price: 145, p: media.objects[4], maker: "Bát Tràng village", story: "Hand-painted in a village that's been making ceramics for 700 years.", added: 6 },
  { id: "o6", sku: "ST-002", name: "Plain stool", cat: "Furniture", colour: "Oak", price: 210, p: media.objects[5], maker: "Israel, Valencia", story: "Three legs so it never wobbles on an old floor. Oiled, not varnished.", added: 2 },
  { id: "o7", sku: "GR-008", name: "Spice grinder", cat: "Kitchen", colour: "Walnut", price: 38, p: media.objects[6], maker: "Marcelo, Porto", story: "Ceramic burr, walnut body. Sounds like gravel for the first week.", added: 4 },
];
const SORTS = { featured: "Featured", "price-asc": "Price ↑", "price-desc": "Price ↓", new: "Newest" } as const;
const BG = ["#ffd6c2", "#c9f0dd", "#fff0a8", "#d8d4ff", "#ffc9e3", "#c8e9ff", "#ffe0b0"];

export default function Objects({ reality }: XP) {
  const cart = useCart("objects");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const lo = Math.min(...ITEMS.map((i) => i.price)), hi = Math.max(...ITEMS.map((i) => i.price));
  const [max, setMax] = useState(hi);
  const [story, setStory] = useState<(typeof ITEMS)[number] | null>(null);
  const [bag, setBag] = useState(false);
  const [bump, setBump] = useState(0);
  const [done, setDone] = useState(false);

  const { list, nearest } = useMemo(() => {
    const base = ITEMS.filter((i) => cat === "All" || i.cat === cat);
    let l = base.filter((i) => i.price <= max);
    const s = [...l];
    if (sort === "price-asc") s.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") s.sort((a, b) => b.price - a.price);
    if (sort === "new") s.sort((a, b) => a.added - b.added);
    l = s;
    const near = l.length ? null : [...base].sort((a, b) => a.price - b.price)[0] ?? null;
    return { list: l, nearest: near };
  }, [cat, sort, max]);

  const add = (i: (typeof ITEMS)[number]) => { cart.add({ id: i.id, name: i.name, price: i.price }); setBump((b) => b + 1); };

  const bar = (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4 md:px-10">
      {["All", ...new Set(ITEMS.map((i) => i.cat))].map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full border-2 border-black px-4 py-1.5 text-sm font-bold ${cat === c ? "bg-black text-[#fff4e0]" : "bg-white"}`}>{c}</button>)}
      <label className="ml-auto flex items-center gap-2 text-sm font-bold">Up to {money(max)}<input type="range" min={lo} max={hi} step={1} value={max} onChange={(e) => setMax(+e.target.value)} className="accent-[#ff5a1f]" aria-label="Maximum price" /></label>
      <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Sort" className="rounded-full border-2 border-black bg-white px-3 py-1.5 text-sm font-bold">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <button onClick={() => setBag(true)} className="rounded-full bg-[#ff5a1f] px-4 py-1.5 text-sm font-bold text-white">Bag <span key={bump} className="pop inline-block">{cart.count}</span> · ♥ {cart.wish.length}</button>
    </div>
  );

  return (
    <div className="bg-[#fff4e0] pb-16 text-[#1a1a1a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {bar}
      {nearest && <p className="px-5 pb-4 text-lg md:px-10">Nothing under {money(max)} in {cat}. Closest: <button className="font-bold underline" onClick={() => setMax(nearest.price)}>{nearest.name} at {money(nearest.price)}</button></p>}
      {reality === "catalogue" ? (
        <div className="overflow-x-auto px-5 md:px-10">
          <table className="w-full border-2 border-black bg-white text-sm">
            <thead className="bg-black text-left text-[#fff4e0]"><tr>{["SKU", "Item", "Maker", "Cat.", "Colour", "Retail", "Trade (−40%)", ""].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>{list.map((i) => <tr key={i.id} className="border-t border-black/20"><td className="px-3 py-2 font-mono">{i.sku}</td><td className="px-3 py-2 font-bold">{i.name}</td><td className="px-3 py-2">{i.maker}</td><td className="px-3 py-2">{i.cat}</td><td className="px-3 py-2">{i.colour}</td><td className="px-3 py-2 tabular-nums">{money(i.price)}</td><td className="px-3 py-2 tabular-nums">{money(Math.round(i.price * 0.6))}</td><td className="px-3 py-2"><button onClick={() => add(i)} className="bg-black px-2 py-1 text-xs text-white">+ Add</button></td></tr>)}</tbody>
          </table>
          <p className="mt-2 text-xs opacity-60">Trade prices shown for illustration. Minimum order would apply in a real store.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 px-5 md:grid-cols-3 md:px-10 lg:grid-cols-4">
          {list.map((i) => (
            <li key={i.id} className="group rounded-3xl border-2 border-black p-3 transition-transform duration-300 hover:-rotate-1" style={{ background: BG[ITEMS.indexOf(i)] }}>
              <div className="relative overflow-hidden rounded-2xl border-2 border-black">
                <Img p={i.p} className="aspect-square" shift sizes="(min-width:1024px) 25vw, 50vw" />
                <button onClick={() => cart.toggleWish(i.id)} aria-pressed={cart.wish.includes(i.id)} aria-label={`Wishlist ${i.name}`} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border-2 border-black bg-white">{cart.wish.includes(i.id) ? "♥" : "♡"}</button>
              </div>
              <div className="mt-3 flex items-start justify-between gap-2"><div><p className="text-lg font-bold leading-tight">{i.name}</p><button onClick={() => setStory(i)} className="text-sm underline decoration-2 underline-offset-2">by {i.maker}</button></div><p className="text-lg font-bold">{money(i.price)}</p></div>
              <button onClick={() => add(i)} className="mt-3 w-full rounded-full border-2 border-black bg-black py-2 text-sm font-bold text-white transition active:scale-95">Add to bag</button>
            </li>
          ))}
        </ul>
      )}
      {story && (
        <div role="dialog" aria-modal="true" aria-label={`Maker story: ${story.maker}`} className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-4 md:items-center" onClick={() => setStory(null)}>
          <div className="grid max-w-3xl overflow-hidden rounded-3xl border-2 border-black bg-[#fff4e0] md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
            <Img p={story.p} className="aspect-square" caption />
            <div className="p-6"><p className="text-sm font-bold uppercase">The maker</p><p className="mt-1 text-3xl font-bold">{story.maker}</p><p className="mt-4 text-lg">{story.story}</p><p className="mt-4 text-xs opacity-60">Maker names are fictional; the photographs are credited stock.</p>
              <div className="mt-6 flex gap-2"><button onClick={() => { add(story); setStory(null); }} className="rounded-full bg-[#ff5a1f] px-4 py-2 font-bold text-white">Add {story.name}</button><button onClick={() => setStory(null)} className="rounded-full border-2 border-black px-4 py-2 font-bold" autoFocus>Close</button></div></div>
          </div>
        </div>
      )}
      {bag && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/40" onClick={() => setBag(false)}>
          <aside role="dialog" aria-modal="true" aria-label="Bag" className="h-full w-full max-w-sm overflow-auto border-l-2 border-black bg-[#fff4e0] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between"><p className="text-2xl font-bold">Your bag</p><button onClick={() => setBag(false)} autoFocus>✕</button></div>
            {done ? <p className="mt-8 text-xl">Order placed — simulated, nothing charged. In a real build this is where Stripe takes over.</p> : cart.lines.length === 0 ? <p className="mt-8">Empty. The stool is very good, just saying.</p> : (<>
              <ul className="mt-6 space-y-3">{cart.lines.map((l, i) => <li key={l.id} className="flex items-center justify-between rounded-2xl border-2 border-black bg-white p-3"><span className="font-bold">{l.name}</span><span className="flex items-center gap-2"><button onClick={() => cart.setQty(i, l.qty - 1)} aria-label="Decrease">−</button>{l.qty}<button onClick={() => cart.setQty(i, l.qty + 1)} aria-label="Increase">+</button></span><span>{money(l.price * l.qty)}</span></li>)}</ul>
              <p className="mt-4 flex justify-between text-xl font-bold"><span>Total</span><span>{money(cart.total)}</span></p>
              <p className="text-sm opacity-60">{cart.total >= 150 ? "Free shipping unlocked." : `${money(150 - cart.total)} more for free shipping.`}</p>
              <button onClick={() => { cart.clear(); setDone(true); }} className="mt-4 w-full rounded-full bg-[#ff5a1f] py-3 font-bold text-white">Checkout (simulation)</button>
            </>)}
          </aside>
        </div>
      )}
    </div>
  );
}
