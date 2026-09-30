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

export function NoirFuture() {
  return (
    <div style={{ background: "#05070d", color: "#dfe8ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/2049" />
      <RealityShell world="noir" current="future" basePath="/worlds/noir" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fc3ff" }}>ATELIER 2049 · DROP 07 · FABRICATION ON DEMAND</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)", margin: "8px 0", fontWeight: 400 }}>NOIR<span style={{ color: "#6fc3ff" }}>_FUTURE</span></h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, background: "rgba(223,232,255,0.2)", border: "1px solid rgba(223,232,255,0.2)", marginTop: 24 }}>
          {noirProducts.map((p) => (
            <div key={p.id} style={{ background: "#05070d", padding: 16 }}>
              <p style={{ fontSize: 10, color: "#6fc3ff", margin: 0 }}>SKU.{p.id.toUpperCase()} // {p.category.toUpperCase()}</p>
              <p style={{ fontSize: "1.2rem", margin: "8px 0" }}>
                <Link href={`/worlds/noir/product/${p.id}`} style={{ textDecoration: "underline" }}>{p.name}</Link>
              </p>
              <p style={{ fontSize: "0.8rem", color: "#7f8fb0", margin: 0 }}>{p.fabric} · {p.sizes.join("/")}</p>
              <p style={{ fontSize: "1.3rem", color: "#6fc3ff", margin: "8px 0 0" }}>{money(p.price)}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: "0.85rem", color: "#7f8fb0" }}>Rendered on demand. Shipped from the future. <Link href="/worlds/noir/collection" style={{ textDecoration: "underline", color: "#6fc3ff" }}>Classic index →</Link></p>
      </div>
    </div>
  );
}
