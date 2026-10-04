"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { SHOWROOM_CATS, SHOWROOM_PRODUCTS } from "@/data/noir-showroom";
import { noirProducts } from "@/data/noir";
import { money } from "@/lib/use-cart";
import { NoirBuyBox, NoirNav } from "@/components/worlds/noir-showroom";

/**
 * NOIR/ANALOG — the collection as a photocopied zine: cut type,
 * tape lines, rotated blocks, one ink. Same garments, same till.
 */
export function NoirAnalog() {
  return (
    <div style={{ background: "#cfcfcf", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/XEROX" />
      <NoirNav current="analog" />
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

export function NoirRunway() {
  return (
    <div style={{ background: "#0a0a0a", color: "#f4f1ea", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/RUNWAY" />
      <NoirNav current="runway" />
      <header style={{ padding: "40px 20px 8px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", color: "#8a8580" }}>AUTUMN · LOOKS 01–{String(noirProducts.length).padStart(2, "0")} · ONE PASS, NO ENCORE</p>
        <h1 style={{ fontSize: "clamp(3rem, 12vw, 8rem)", margin: "8px 0", fontWeight: 900, letterSpacing: "-0.02em" }}>RUNWAY</h1>
        <p style={{ color: "#8a8580" }}>The collection in show order. Walk, pause, turn. Prices after the lights.</p>
      </header>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 80px" }}>
        <div style={{ width: 2, margin: "0 auto", background: "linear-gradient(#f4f1ea, transparent)", height: 48 }} aria-hidden />
        {noirProducts.map((p, i) => (
          <article key={p.id} style={{ textAlign: "center", padding: "36px 0", borderBottom: "1px solid rgba(244,241,234,0.15)" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.4em", color: "#8a8580", margin: 0 }}>LOOK {String(i + 1).padStart(2, "0")}</p>
            <h2 style={{ fontSize: "2.2rem", margin: "8px 0", textTransform: "uppercase" }}>{p.name}</h2>
            <p style={{ color: "#b9b2a6", maxWidth: "46ch", margin: "0 auto" }}>{p.desc}</p>
            <p style={{ fontSize: 12, color: "#8a8580" }}>{p.fabric} · {p.colors.join(" / ")}</p>
            <p>
              <Link href={`/worlds/noir/product/${p.id}`} style={{ color: "#f4f1ea", textDecoration: "underline" }}>{money(p.price)} — view the piece →</Link>
            </p>
          </article>
        ))}
        <p style={{ textAlign: "center", marginTop: 32 }}>Front row ends here. <Link href="/worlds/noir/appointments" style={{ textDecoration: "underline" }}>Book the showroom →</Link></p>
      </div>
      <WorldProof
        proves="Desire, sequenced: the show as a sales instrument — every look numbered, every look buyable."
        relatedHref="/worlds/motion"
        relatedName="MOTION"
      />
    </div>
  );
}

export function NoirAtelier() {
  return (
    <div style={{ background: "#efe9dc", color: "#1a1712", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/ATELIER" />
      <NoirNav current="atelier" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>CUTTING TABLE · TOILES, NOT SAMPLES</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 9vw, 6rem)", fontWeight: 400, margin: "8px 0" }}>The Atelier</h1>
        <p style={{ maxWidth: "56ch", fontStyle: "italic", color: "#6b6254" }}>Every garment before it is a garment: cloth, sizes, and the note pinned to the toile. Same pieces as the shop — six weeks earlier.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1, background: "#1a1712", border: "1px solid #1a1712", marginTop: 32 }}>
          {noirProducts.map((p) => (
            <div key={p.id} style={{ background: "#efe9dc", padding: 20 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "#8a3b1f", margin: 0 }}>PATTERN {p.id.toUpperCase()}</p>
              <h2 style={{ fontSize: "1.5rem", margin: "8px 0" }}>
                <Link href={`/worlds/noir/product/${p.id}`} style={{ textDecoration: "underline" }}>{p.name}</Link>
              </h2>
              <dl style={{ fontSize: "0.85rem", margin: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted #6b6254", padding: "4px 0" }}><dt>Cloth</dt><dd style={{ margin: 0 }}>{p.fabric}</dd></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted #6b6254", padding: "4px 0" }}><dt>Colour</dt><dd style={{ margin: 0 }}>{p.colors.join(", ")}</dd></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dotted #6b6254", padding: "4px 0" }}><dt>Sizes</dt><dd style={{ margin: 0 }}>{p.sizes.join(" · ")}</dd></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><dt>Price</dt><dd style={{ margin: 0 }}>{money(p.price)}</dd></div>
              </dl>
              <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#6b6254" }}>“{p.desc}”</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24 }}>Toiles become garments at fittings. <Link href="/worlds/noir/appointments" style={{ textDecoration: "underline" }}>Book a fitting →</Link></p>
      </div>
      <WorldProof
        proves="Craft as evidence: patterns, cloths, and prices on one table — luxury that shows its working."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}

export function NoirFuture() {
  return (
    <div style={{ background: "#05070d", color: "#dfe8ff", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/2049" />
      <NoirNav current="future" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fc3ff" }}>ATELIER 2049 · DROP 07 · FABRICATION ON DEMAND</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5.5rem)", margin: "8px 0", fontWeight: 400 }}>NOIR<span style={{ color: "#6fc3ff" }}>_FUTURE</span></h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, background: "rgba(223,232,255,0.2)", border: "1px solid rgba(223,232,255,0.2)", marginTop: 24 }}>
          {noirProducts.map((p) => (
            <div key={p.id} style={{ background: "#05070d", padding: 16 }}>
              <p style={{ fontSize: 10, color: "#6fc3ff", margin: 0 }}>SKU.{p.id.toUpperCase()}{" // "}{p.category.toUpperCase()}</p>
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

export function NoirArchive() {
  const [cat, setCat] = useState<"All" | string>("All");
  const [ex, setEx] = useState<string | null>(null);
  const items = SHOWROOM_PRODUCTS.filter((p) => cat === "All" || p.cat === cat);
  return (
    <div style={{ background: "#f1efe8", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-mono)", padding: "0 0 80px" }}>
      <WorldExit id="noir" label="Room 02 · NOIR/ARCHIVE" />
      <NoirNav current="archive" />
      <div style={{ padding: "32px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline", borderBottom: "2px solid #111", paddingBottom: 12 }}>
          <h1 style={{ fontSize: "1.2rem", letterSpacing: "0.3em", margin: 0 }}>NOIR — CATALOGUE RAISONNÉ, AW26</h1>
          <Link href="/worlds/noir/bag" style={{ border: "1px solid #111", padding: "6px 12px", fontSize: 12 }}>BAG →</Link>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16, fontSize: 12 }} role="group" aria-label="Filter">
          {["All", ...SHOWROOM_CATS.slice(1)].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} style={{ border: "1px solid #111", background: cat === c ? "#111" : "transparent", color: cat === c ? "#f1efe8" : "#111", padding: "4px 10px", textTransform: "uppercase" }}>
              {c}
            </button>
          ))}
        </div>
        <table style={{ width: "100%", textAlign: "left", fontSize: "0.9rem", marginTop: 20 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #111", fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "8px 0" }}>Lot</th>
              <th>Piece</th>
              <th>Category</th>
              <th>Fabric</th>
              <th style={{ textAlign: "right" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <Fragment key={p.id}>
                <tr style={{ borderBottom: "1px solid rgba(17,17,17,0.3)" }}>
                  <td style={{ padding: "12px 0" }}>{String(SHOWROOM_PRODUCTS.indexOf(p) + 1).padStart(3, "0")}</td>
                  <td>
                    <button type="button" aria-expanded={ex === p.id} onClick={() => setEx(ex === p.id ? null : p.id)} style={{ background: "none", border: 0, padding: 0, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4, color: "inherit", textAlign: "left" }}>
                      {p.name}
                    </button>
                  </td>
                  <td>{p.cat}</td>
                  <td>{p.fabric}</td>
                  <td style={{ textAlign: "right" }}>{money(p.price)}</td>
                </tr>
                {ex === p.id && (
                  <tr style={{ borderBottom: "1px solid #111" }}>
                    <td colSpan={5} style={{ background: "#e7e4da", padding: 16 }}>
                      <p style={{ margin: "0 0 8px" }}>{p.desc}</p>
                      <p style={{ margin: "0 0 16px", fontSize: 12 }}>Care: {p.care}</p>
                      <div style={{ maxWidth: 420, color: "#111" }}>
                        <NoirBuyBox key={p.id} p={p} />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p style={{ marginTop: 24, fontSize: "0.9rem" }}>No lots match.</p>}
        <div style={{ display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", borderTop: "2px solid #111", marginTop: 56, paddingTop: 24 }}>
          <div>
            <h2 style={{ fontSize: 12, letterSpacing: "0.2em", margin: "0 0 12px" }}>Appointments</h2>
            <p style={{ fontSize: "0.9rem" }}>Fittings and private viewings, Wednesday to Saturday. <Link href="/worlds/noir/appointments" style={{ textDecoration: "underline" }}>Book →</Link></p>
          </div>
          <div>
            <h2 style={{ fontSize: 12, letterSpacing: "0.2em", margin: "0 0 12px" }}>Journal</h2>
            <p style={{ fontSize: "0.9rem" }}><strong>On black.</strong> There is no single black; we keep a shelf of swatches and argue about which one is right.</p>
            <p style={{ fontSize: "0.9rem" }}><strong>The half-second.</strong> A bias-cut dress arrives half a second after the body. That delay is the whole point.</p>
            <p style={{ fontSize: "0.9rem" }}><strong>Fewer, then better.</strong> Nine pieces. Every one replaced two others that were almost as good.</p>
          </div>
        </div>
      </div>
      <WorldProof
        proves="The catalogue as record: lot order, fabrics, care — provenance before purchase."
        relatedHref="/worlds/archive"
        relatedName="ARCHIVE"
      />
    </div>
  );
}
