import { useState } from "react";

export type Product = { id: string; name: string; cat: string; price: number; sil: keyof typeof SIL; color: string; bg: string; desc: string; fabric: string; care: string; sizes: string[]; seed: number };

export const SIL = {
  coat: [[35, 10], [50, 17], [65, 10], [88, 24], [92, 72], [80, 74], [78, 50], [77, 124], [23, 124], [22, 50], [20, 74], [8, 72], [12, 24]],
  knit: [[35, 14], [50, 21], [65, 14], [90, 30], [88, 64], [76, 64], [76, 90], [24, 90], [24, 64], [12, 64], [10, 30]],
  trouser: [[30, 10], [70, 10], [76, 124], [54, 124], [50, 44], [46, 124], [24, 124]],
  blazer: [[34, 10], [50, 30], [66, 10], [88, 26], [90, 74], [78, 74], [76, 52], [75, 100], [25, 100], [24, 52], [22, 74], [10, 74], [12, 26]],
  tote: [[22, 48], [78, 48], [86, 112], [14, 112]],
  scarf: [[40, 8], [50, 24], [60, 8], [68, 102], [52, 94], [36, 106]],
  dress: [[38, 10], [50, 19], [62, 10], [66, 52], [86, 124], [14, 124], [34, 52]],
} as const;

const S = ["XS", "S", "M", "L", "XL"];
export const PRODUCTS: Product[] = [
  { id: "margaux", name: "Margaux Coat", cat: "Outerwear", price: 1450, sil: "coat", color: "#1b1b1b", bg: "#cfc9bd", desc: "A long, double-faced wool coat cut straight from the shoulder. No lining to fight the drape.", fabric: "100% virgin wool, double-faced, Biella", care: "Dry clean only. Hang on a wide shoulder.", sizes: S, seed: 1 },
  { id: "sable", name: "Sable Overshirt", cat: "Outerwear", price: 680, sil: "blazer", color: "#3a382f", bg: "#d8d3c6", desc: "A heavy brushed-cotton overshirt that works as a jacket, a layer, or a pyjama top if you are brave.", fabric: "Brushed Japanese cotton twill", care: "Cool wash, line dry.", sizes: S, seed: 2 },
  { id: "vesper", name: "Vesper Knit", cat: "Knitwear", price: 420, sil: "knit", color: "#d5cdbb", bg: "#1d1d1d", desc: "A fine-gauge cashmere polo neck knitted in one piece on a seamless machine.", fabric: "Grade-A Mongolian cashmere, 12-gauge", care: "Hand wash cold. Dry flat.", sizes: S, seed: 3 },
  { id: "ondine", name: "Ondine Cardigan", cat: "Knitwear", price: 480, sil: "knit", color: "#2b3a4a", bg: "#ddd7cb", desc: "Wide-shouldered, buttoned at the collarbone, ribbed at the hem. Wears like a cardigan, looks like an argument.", fabric: "Merino and silk blend", care: "Hand wash cool.", sizes: S, seed: 4 },
  { id: "lune", name: "Lune Trouser", cat: "Tailoring", price: 390, sil: "trouser", color: "#232323", bg: "#c9c3b6", desc: "High-rise, double-pleated, cut wide and stopped exactly at the ankle bone.", fabric: "Tropical wool, 260g", care: "Dry clean. Steam between wears.", sizes: S, seed: 5 },
  { id: "reve", name: "Rêve Blazer", cat: "Tailoring", price: 890, sil: "blazer", color: "#151515", bg: "#d4cec1", desc: "An unstructured single-breasted blazer with soft shoulders and a deliberately low button.", fabric: "Wool-mohair, half-canvassed", care: "Dry clean only.", sizes: S, seed: 6 },
  { id: "oblique", name: "Oblique Tote", cat: "Accessories", price: 760, sil: "tote", color: "#3a2a20", bg: "#d8d2c4", desc: "A single piece of vegetable-tanned calf leather folded, never stitched at the stress points.", fabric: "Italian calf leather, unlined suede interior", care: "Condition twice a year.", sizes: ["One size"], seed: 7 },
  { id: "kohl", name: "Kohl Scarf", cat: "Accessories", price: 240, sil: "scarf", color: "#0f0f0f", bg: "#cdc7ba", desc: "A long, narrow scarf in silk-wool twill with a hand-rolled edge. Black, in the way only a few blacks are.", fabric: "60% silk, 40% wool", care: "Dry clean.", sizes: ["One size"], seed: 8 },
  { id: "ash", name: "Ash Slip Dress", cat: "Dresses", price: 620, sil: "dress", color: "#8a8478", bg: "#1a1a1a", desc: "A bias-cut slip in heavy satin-back crepe. It moves half a second after you do.", fabric: "Viscose satin-back crepe", care: "Dry clean.", sizes: S, seed: 9 },
];
export const CATS = ["All", "Outerwear", "Knitwear", "Tailoring", "Dresses", "Accessories"];

export function Garment({ p, className = "", label = true }: { p: Product; className?: string; label?: boolean }) {
  const pts = SIL[p.sil].map((q) => q.join(",")).join(" ");
  return (
    <svg viewBox="0 0 100 135" className={className} role="img" aria-label={label ? `${p.name}, ${p.cat}` : undefined} aria-hidden={label ? undefined : true} style={{ background: p.bg }}>
      <ellipse cx="50" cy="128" rx="32" ry="3" fill="rgba(0,0,0,.25)" />
      {p.sil === "tote" && <path d="M34 50 C34 20 66 20 66 50" fill="none" stroke={p.color} strokeWidth="3" />}
      <polygon points={pts} fill={p.color} stroke="rgba(255,255,255,.18)" strokeWidth=".6" strokeLinejoin="round" />
      {p.sil === "blazer" && <path d="M50 30 L44 62 M50 30 L56 62" stroke="rgba(255,255,255,.22)" strokeWidth=".8" fill="none" />}
      {p.sil === "coat" && <path d="M50 17 L50 124" stroke="rgba(255,255,255,.15)" strokeWidth=".8" />}
    </svg>
  );
}

export function BuyBox({ p, onAdd, btn, ghost, wished, onWish }: { p: Product; onAdd: (size: string, qty: number) => void; btn: string; ghost: string; wished: boolean; onWish: () => void }) {
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  return (
    <div>
      <fieldset><legend className="text-xs font-semibold uppercase tracking-[0.15em]">Size</legend>
        <div className="mt-2 flex flex-wrap gap-2">{p.sizes.map((s) => <label key={s} className={"cursor-pointer px-4 py-2 text-sm has-[:focus-visible]:ring-2 " + (size === s ? btn : ghost)}><input type="radio" name={"size-" + p.id} className="sr-only" checked={size === s} onChange={() => { setSize(s); setMsg(""); }} />{s}</label>)}</div>
      </fieldset>
      <div className="mt-4 flex items-center gap-2" role="group" aria-label="Quantity"><span className="text-xs font-semibold uppercase tracking-[0.15em]">Qty</span><button className={ghost + " h-9 w-9"} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button><span className="w-6 text-center">{qty}</span><button className={ghost + " h-9 w-9"} onClick={() => setQty(Math.min(9, qty + 1))} aria-label="Increase quantity">+</button></div>
      <div className="mt-5 flex gap-2">
        <button className={btn + " flex-1 px-5 py-3 font-semibold"} onClick={() => { if (!size) return setMsg("Please choose a size."); onAdd(size, qty); setMsg(`Added ${qty} × ${p.name} (${size}) to your bag.`); }}>Add to bag</button>
        <button className={ghost + " px-4 py-3"} aria-pressed={wished} onClick={onWish}>{wished ? "♥ Saved" : "♡ Save"}</button>
      </div>
      <p className="mt-2 min-h-5 text-sm" role="status">{msg}</p>
    </div>
  );
}
