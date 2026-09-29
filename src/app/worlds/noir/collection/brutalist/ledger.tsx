"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { noirProducts } from "@/data/noir";
import { money } from "@/lib/use-cart";

const CATS = ["All", "Outer", "Dress", "Knit", "Look", "Object"] as const;

export function CollectionLedger() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const rows = useMemo(() => {
    const out = noirProducts.filter((p) => cat === "All" || p.category === cat);
    out.sort((a, b) => (dir === "asc" ? a.price - b.price : b.price - a.price));
    return out;
  }, [cat, dir]);

  return (
    <div style={{ background: "#f4f1ea", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/BRUTALIST" />
      <RealityShell world="noir" current="brutalist" basePath="/worlds/noir/collection" />
      <header style={{ padding: "20px", borderBottom: "3px solid #111" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.2em", margin: 0 }}>LEDGER · {rows.length} GARMENTS</p>
        <h1 style={{ fontSize: "clamp(3rem, 12vw, 8rem)", lineHeight: 0.85, margin: "8px 0 0", fontWeight: 900 }}>FULL STOCK</h1>
      </header>
      <div style={{ display: "flex", gap: 0, borderBottom: "3px solid #111", flexWrap: "wrap" }}>
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            style={{
              padding: "12px 18px", border: 0, borderRight: "2px solid #111",
              background: cat === c ? "#111" : "transparent", color: cat === c ? "#f4f1ea" : "#111",
              fontWeight: 800, fontSize: 12, letterSpacing: "0.1em",
            }}
          >
            {c.toUpperCase()}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
          style={{ padding: "12px 18px", border: 0, background: "#c41e3a", color: "#fff", fontWeight: 800, fontSize: 12 }}
        >
          PRICE {dir === "asc" ? "↑" : "↓"}
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Stock ledger">
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} style={{ borderBottom: "2px solid #111" }}>
              <td style={{ padding: "14px 20px", fontWeight: 800 }}>
                <Link href={`/worlds/noir/product/${p.id}`}>{p.name.toUpperCase()}</Link>
              </td>
              <td style={{ padding: "14px 20px", fontFamily: "var(--font-code)", fontSize: 12 }}>{p.sizes.join(" ")}</td>
              <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 800 }}>{money(p.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: "20px" }}>
        <Link href="/worlds/noir/brutalist" style={{ fontWeight: 800 }}>← BACK TO THE MANIFESTO</Link>
      </div>
    </div>
  );
}
