"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { noirProducts } from "@/data/noir";
import { money, useCart } from "@/lib/use-cart";

/**
 * NOIR/BRUTALIST — the same fashion house redrawn with no mercy:
 * raw grid, hard 2px rules, oversized grotesk type, collection as a
 * ledger table instead of cards. Same inventory, same bag, new building.
 */
export function NoirBrutalist() {
  const { count } = useCart("noir");
  return (
    <div style={{ background: "#f4f1ea", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-sans)" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/BRUTALIST" />
      <RealityShell world="noir" current="brutalist" basePath="/worlds/noir" />
      <RealityShell world="noir" current="brutalist" basePath="/worlds/noir" />

      <header style={{ borderBottom: "3px solid #111" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px", borderBottom: "2px solid #111", fontSize: 12, letterSpacing: "0.2em" }}>
          <span>MAISON NOIR — ROOM 02B</span>
          <Link href="/worlds/noir/bag" style={{ fontWeight: 700 }}>BAG ({count})</Link>
        </div>
        <h1 style={{ fontSize: "clamp(4rem, 18vw, 13rem)", lineHeight: 0.85, letterSpacing: "-0.04em", margin: 0, padding: "16px 20px", fontWeight: 900 }}>
          NOIR<br />BRUTALIST
        </h1>
        <p style={{ padding: "0 20px 20px", margin: 0, maxWidth: "60ch", fontSize: "1.05rem" }}>
          The same eight garments. No photography budget, no mercy. Every item below
          is real stock with real prices — the grid is the lookbook.
        </p>
      </header>

      <nav aria-label="House" style={{ display: "flex", gap: 0, borderBottom: "3px solid #111", flexWrap: "wrap" }}>
        {[
          ["/worlds/noir/collection", "COLLECTION"],
          ["/worlds/noir/lookbook", "LOOKBOOK"],
          ["/worlds/noir/journal", "JOURNAL"],
          ["/worlds/noir/appointments", "APPOINTMENTS"],
          ["/worlds/noir", "CLASSIC →"],
        ].map(([href, label]) => (
          <Link key={href + label} href={href} style={{ padding: "14px 20px", borderRight: "2px solid #111", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em" }}>
            {label}
          </Link>
        ))}
      </nav>

      <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Full inventory ledger">
        <thead>
          <tr style={{ borderBottom: "3px solid #111", textAlign: "left", fontSize: 12, letterSpacing: "0.18em" }}>
            <th style={{ padding: "12px 20px" }}>GARMENT</th>
            <th style={{ padding: "12px 20px" }}>CAT</th>
            <th style={{ padding: "12px 20px" }}>FABRIC</th>
            <th style={{ padding: "12px 20px" }}>SIZES</th>
            <th style={{ padding: "12px 20px", textAlign: "right" }}>PRICE</th>
          </tr>
        </thead>
        <tbody>
          {noirProducts.map((p, i) => (
            <tr key={p.id} style={{ borderBottom: "2px solid #111", background: i % 2 ? "#e8e2d4" : "transparent" }}>
              <td style={{ padding: "14px 20px", fontWeight: 800, fontSize: "1.1rem" }}>
                <Link href={`/worlds/noir/product/${p.id}`}>{p.name.toUpperCase()}</Link>
              </td>
              <td style={{ padding: "14px 20px" }}>{p.category}</td>
              <td style={{ padding: "14px 20px" }}>{p.fabric}</td>
              <td style={{ padding: "14px 20px", fontFamily: "var(--font-code)", fontSize: 12 }}>{p.sizes.join(" / ")}</td>
              <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 800 }}>{money(p.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: "32px 20px", borderBottom: "3px solid #111" }}>
        <p style={{ fontSize: "1.3rem", fontWeight: 700, maxWidth: "40ch", margin: 0 }}>
          NO RULE: if it can&apos;t survive a table, it doesn&apos;t deserve a photograph.
        </p>
      </div>

      <WorldProof
        proves="Same stock, new building. Brutalism is information architecture with the padding removed — and the till still adds up."
        relatedHref="/worlds/objects"
        relatedName="OBJECTS"
      />
    </div>
  );
}
