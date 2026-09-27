"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { dishes } from "@/data/casa";

const CATS = ["All", "Fire", "Garden", "Sea", "Sweet", "Wine"] as const;

export default function CasaMenu() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [diet, setDiet] = useState<"all" | "vegetarian" | "vegan">("all");
  const list = useMemo(
    () =>
      dishes.filter((d) => (cat === "All" || d.category === cat) && (diet === "all" || d.dietary.includes(diet))),
    [cat, diet],
  );

  return (
    <div style={{ padding: "28px 22px 80px", maxWidth: 920, margin: "0 auto" }}>
      <p className="kicker">The list</p>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 500, margin: "6px 0 24px" }}>
        Menu
      </h1>
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
        <Link key={dish.id} href={`/worlds/casa/menu/${dish.id}`} className="casa-menu-item">
          <div>
            <div className="kicker">{dish.category}</div>
            <h3>{dish.name}</h3>
            <p style={{ color: "var(--muted)", margin: "6px 0 0" }}>{dish.desc}</p>
          </div>
          <div style={{ fontFamily: "var(--font-lux)", fontSize: "1.4rem" }}>{dish.price}</div>
        </Link>
      ))}
      {list.length === 0 ? <p>Nothing in this filter tonight.</p> : null}
    </div>
  );
}
