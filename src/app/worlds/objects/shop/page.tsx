"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { objectProducts } from "@/data/objects";
import { loadJson, saveJson } from "@/lib/storage";
import { money } from "@/lib/use-cart";

const CATS = ["All", "Ceramic", "Seating", "Light", "Textile"];
const WISH_KEY = "wasp-v11-objects-wishlist";

export default function ObjectsShop() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [max, setMax] = useState(1000);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [wish, setWish] = useState<string[]>([]);

  // Hydrate persisted wishlist after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWish(loadJson<string[]>(WISH_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(WISH_KEY, wish);
  }, [wish]);

  const list = useMemo(() => {
    const out = objectProducts.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        p.price <= max &&
        `${p.name} ${p.desc}`.toLowerCase().includes(q.toLowerCase()),
    );
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "name") out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [cat, q, max, sort]);

  return (
    <div style={{ padding: "12px 20px 80px" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search objects"
          aria-label="Search objects"
          style={{ flex: 1, minWidth: 180, background: "transparent", border: "1px solid var(--line)", padding: 10 }}
        />
        {CATS.map((c) => (
          <button key={c} className={cat === c ? "chip-on" : "chip"} type="button" onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort objects" style={{ background: "transparent", border: "1px solid var(--line)", padding: 10 }}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="name">Name A–Z</option>
        </select>
        <label className="kicker" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Under {money(max)}
          <input type="range" min={80} max={1000} value={max} onChange={(e) => setMax(Number(e.target.value))} />
        </label>
      </div>
      <div className="obj-grid">
        {list.map((p) => (
          <div key={p.id} style={{ position: "relative" }}>
            <Link href={`/worlds/objects/product/${p.id}`}>
              <span style={{ position: "relative", display: "block", aspectRatio: "4/5", background: "#ddd6c9" }}>
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 820px) 50vw, 33vw" style={{ objectFit: "cover" }} />
              </span>
              <div style={{ paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span>{p.name}</span>
                <span>{money(p.price)}</span>
              </div>
            </Link>
            <button
              type="button"
              className={wish.includes(p.id) ? "chip-on" : "chip"}
              aria-pressed={wish.includes(p.id)}
              aria-label={wish.includes(p.id) ? `Unsave ${p.name}` : `Save ${p.name}`}
              onClick={() => setWish((w) => (w.includes(p.id) ? w.filter((x) => x !== p.id) : [...w, p.id]))}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              {wish.includes(p.id) ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>
      {list.length === 0 ? <p>Nothing in that corner of the shop.</p> : null}
    </div>
  );
}
