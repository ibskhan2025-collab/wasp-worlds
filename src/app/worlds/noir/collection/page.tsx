"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { noirProducts } from "@/data/noir";
import { loadJson, saveJson } from "@/lib/storage";
import { money } from "@/lib/use-cart";

const CATS = ["All", "Outer", "Dress", "Knit", "Look", "Object"];
const WISH_KEY = "wasp-v11-noir-wishlist";

export default function NoirCollection() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [wish, setWish] = useState<string[]>([]);
  const [onlyWish, setOnlyWish] = useState(false);

  // Hydrate persisted wishlist after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWish(loadJson<string[]>(WISH_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(WISH_KEY, wish);
  }, [wish]);

  const list = useMemo(() => {
    const out = noirProducts.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!onlyWish || wish.includes(p.id)) &&
        `${p.name} ${p.fabric}`.toLowerCase().includes(q.toLowerCase()),
    );
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    return out;
  }, [cat, q, sort, onlyWish, wish]);

  function toggleWish(id: string) {
    setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }

  return (
    <div style={{ padding: "20px 0 80px" }}>
      <div style={{ padding: "8px 20px 20px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", margin: 0, fontWeight: 500 }}>Collection</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            aria-label="Search collection"
            style={{ background: "transparent", border: "1px solid var(--line)", padding: 8, minWidth: 140 }}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort collection" style={{ background: "transparent", border: "1px solid var(--line)", padding: 8 }}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
          {CATS.map((c) => (
            <button key={c} className={cat === c ? "chip-on" : "chip"} type="button" onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
          <button className={onlyWish ? "chip-on" : "chip"} type="button" onClick={() => setOnlyWish((v) => !v)} aria-pressed={onlyWish}>
            ♥ Saved ({wish.length})
          </button>
        </div>
      </div>
      <div className="noir-grid">
        {list.map((p) => (
          <div key={p.id} className="noir-card" style={{ position: "relative" }}>
            <Link href={`/worlds/noir/product/${p.id}`}>
              <span style={{ position: "relative", display: "block", aspectRatio: "2/3", background: "#111" }}>
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 820px) 50vw, 25vw" style={{ objectFit: "cover" }} />
              </span>
              <div className="meta">
                <div>{p.name}</div>
                <div>{money(p.price)}</div>
              </div>
            </Link>
            <button
              type="button"
              className={wish.includes(p.id) ? "chip-on" : "chip"}
              aria-pressed={wish.includes(p.id)}
              aria-label={wish.includes(p.id) ? `Unsave ${p.name}` : `Save ${p.name}`}
              onClick={() => toggleWish(p.id)}
              style={{ position: "absolute", top: 8, right: 8 }}
            >
              {wish.includes(p.id) ? "♥" : "♡"}
            </button>
          </div>
        ))}
      </div>
      {list.length === 0 ? <p style={{ padding: "0 20px" }}>Nothing matches. Loosen the filter.</p> : null}
    </div>
  );
}
