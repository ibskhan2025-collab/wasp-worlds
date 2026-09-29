"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { noirProducts } from "@/data/noir";
import { money } from "@/lib/use-cart";

/**
 * NOIR/ANALOG — the collection as a photocopied zine: cut type,
 * tape lines, rotated blocks, one ink. Same garments, same till.
 */
export function NoirAnalog() {
  return (
    <div style={{ background: "#cfcfcf", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/XEROX" />
      <RealityShell world="noir" current="analog" basePath="/worlds/noir" />
      <header style={{ padding: "32px 20px", borderBottom: "4px solid #111" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>ISSUE 03 · COPIED, NOT PRINTED · 50 MADE</p>
        <h1 style={{ fontSize: "clamp(3rem, 14vw, 10rem)", lineHeight: 0.85, margin: "8px 0", fontWeight: 900 }}>NOIR<br />XEROX</h1>
        <p style={{ maxWidth: "52ch" }}>Third-generation copy of the Autumn collection. If you can read the price, it&apos;s in stock. Cut along the lines.</p>
      </header>
      <div style={{ padding: "8px 20px 80px" }}>
        {noirProducts.map((p, i) => (
          <article
            key={p.id}
            style={{
              border: "2px solid #111",
              margin: "20px 0",
              padding: 16,
              transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)`,
              background: i % 2 ? "#d8d8d8" : "#cfcfcf",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: "0.25em", margin: 0 }}>FIG. {String(i + 1).padStart(2, "0")} · {p.category.toUpperCase()}</p>
                <h2 style={{ fontSize: "2rem", margin: "6px 0", textTransform: "uppercase" }}>{p.name}</h2>
                <p style={{ maxWidth: "52ch", fontSize: "0.9rem" }}>{p.desc}</p>
                <p style={{ fontSize: 12 }}>{p.fabric} · {p.sizes.join(" ")}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900 }}>{money(p.price)}</div>
                <Link href={`/worlds/noir/product/${p.id}`} style={{ display: "inline-block", marginTop: 8, background: "#111", color: "#cfcfcf", padding: "10px 16px", fontWeight: 700, fontSize: 12 }}>
                  ORDER →
                </Link>
              </div>
            </div>
            <div style={{ borderTop: "1px dashed #111", marginTop: 12, paddingTop: 6, fontSize: 11 }}>✂ cut here · tape to wall · do not iron</div>
          </article>
        ))}
      </div>
      <WorldProof
        proves="Want, priced in toner. The zine proves the inverse of luxury: same garments, same till, zero artifice — and it still sells."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}
