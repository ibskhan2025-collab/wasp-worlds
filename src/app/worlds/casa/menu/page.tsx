"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { dishes } from "@/data/casa";
import { loadJson, saveJson } from "@/lib/storage";
import { money } from "@/lib/use-cart";

const CATS = ["All", "Fire", "Garden", "Sea", "Sweet", "Wine"] as const;
const FAV_KEY = "wasp-v11-casa-favs";

export default function CasaMenu() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [diet, setDiet] = useState<"all" | "vegetarian" | "vegan">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"menu" | "price-asc" | "price-desc">("menu");
  const [favs, setFavs] = useState<string[]>([]);

  // Hydrate persisted favorites after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavs(loadJson<string[]>(FAV_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(FAV_KEY, favs);
  }, [favs]);

  const list = useMemo(() => {
    const out = dishes.filter(
      (d) =>
        (cat === "All" || d.category === cat) &&
        (diet === "all" || d.dietary.includes(diet)) &&
        `${d.name} ${d.desc}`.toLowerCase().includes(q.toLowerCase()),
    );
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    return out;
  }, [cat, diet, q, sort]);

  function toggleFav(id: string) {
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  return (
    <div style={{ padding: "28px 22px 80px", maxWidth: 920, margin: "0 auto" }}>
      <p className="kicker">The list</p>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 500, margin: "6px 0 24px" }}>
        Menu
      </h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the menu"
          aria-label="Search dishes"
          style={{ flex: 1, minWidth: 160, background: "transparent", border: "1px solid var(--line)", padding: 8 }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort dishes" style={{ background: "transparent", border: "1px solid var(--line)", padding: 8 }}>
          <option value="menu">Menu order</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {CATS.map((c) => (
          <button key={c} className={cat === c ? "chip-on" : "chip"} type="button" onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {(["all", "vegetarian", "vegan"] as const).map((d) => (
          <button key={d} className={diet === d ? "chip-on" : "chip"} type="button" onClick={() => setDiet(d)}>
            {d}
          </button>
        ))}
      </div>
      {list.map((dish) => (
        <div key={dish.id} className="casa-menu-item">
          <Link href={`/worlds/casa/menu/${dish.id}`} style={{ flex: 1 }}>
            <div className="kicker">{dish.category}{favs.includes(dish.id) ? " · ★ saved" : ""}</div>
            <h3>{dish.name}</h3>
            <p style={{ color: "var(--muted)", margin: "6px 0 0" }}>{dish.desc}</p>
          </Link>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ fontFamily: "var(--font-lux)", fontSize: "1.4rem" }}>{money(dish.price)}</div>
            <button
              type="button"
              className={favs.includes(dish.id) ? "chip-on" : "chip"}
              aria-pressed={favs.includes(dish.id)}
              aria-label={favs.includes(dish.id) ? `Unsave ${dish.name}` : `Save ${dish.name}`}
              onClick={() => toggleFav(dish.id)}
            >
              {favs.includes(dish.id) ? "★" : "☆"}
            </button>
          </div>
        </div>
      ))}
      {list.length === 0 ? <p>Nothing in this filter tonight.</p> : null}
    </div>
  );
}
