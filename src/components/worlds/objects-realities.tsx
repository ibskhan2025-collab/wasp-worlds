"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { objectProducts } from "@/data/objects";
import { money } from "@/lib/use-cart";

export function ObjectsTidal() {
  return (
    <div style={{ background: "#dfe9e4", color: "#14302a", minHeight: "100dvh", fontFamily: "var(--font-shop)" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/TIDAL" />
      <RealityShell world="objects" current="tidal" basePath="/worlds/objects" />
      <header style={{ padding: "36px 20px 8px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#0f6f5c" }}>FIRED NEAR WATER · ROOM 06B</p>
        <h1 style={{ fontSize: "clamp(3rem, 11vw, 8rem)", margin: "8px 0", fontWeight: 500, letterSpacing: "-0.04em" }}>Tidal Objects</h1>
        <p style={{ color: "#5f7a70", maxWidth: "48ch", margin: "0 auto" }}>Salt glazes, sea air, shelves that smell faintly of low tide.</p>
      </header>
      <svg viewBox="0 0 400 36" width="100%" height="36" preserveAspectRatio="none" aria-hidden style={{ display: "block" }}>
        <path d="M0,18 Q25,4 50,18 T100,18 T150,18 T200,18 T250,18 T300,18 T350,18 T400,18" fill="none" stroke="#0f6f5c" strokeWidth="2" opacity="0.7" />
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, padding: "24px 20px 40px" }}>
        {objectProducts.map((p) => (
          <Link key={p.id} href={`/worlds/objects/product/${p.id}`} style={{ background: "#14302a", color: "#dfe9e4", borderRadius: 20, overflow: "hidden", display: "block" }}>
            <img src={p.image} alt={p.name} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
            <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span>{p.name}</span>
              <strong>{money(p.price)}</strong>
            </div>
          </Link>
        ))}
      </div>
      <WorldProof
        proves="Same vessels, salt air. A shop that changes element without changing inventory."
        relatedHref="/worlds/casa"
        relatedName="CASA"
      />
    </div>
  );
}

export function ObjectsCatalogue() {
  return (
    <div style={{ background: "#e8ddc4", color: "#2a2118", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/CATALOGUE" />
      <RealityShell world="objects" current="catalogue" basePath="/worlds/objects" />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", textAlign: "center" }}>OBJECTS & CO. · MAIL ORDER · EST. 1974</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 4.6rem)", textAlign: "center", fontWeight: 400, margin: "8px 0" }}>The Catalogue</h1>
        <p style={{ textAlign: "center", fontStyle: "italic" }}>Circle your choices in pencil. Post the page. Allow 6–8 weeks.</p>
        <div style={{ border: "2px solid #2a2118", marginTop: 28 }}>
          {objectProducts.map((p, i) => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "52px 1fr auto", gap: 12, padding: "12px 14px", borderBottom: i === objectProducts.length - 1 ? 0 : "1px solid #2a211855", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700 }}>№{100 + i}</span>
              <span>
                <Link href={`/worlds/objects/product/${p.id}`} style={{ textDecoration: "underline", fontWeight: 700 }}>{p.name}</Link>
                <span style={{ fontSize: "0.85rem", opacity: 0.75 }}> — {p.desc}</span>
              </span>
              <strong>{money(p.price)}</strong>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: "0.9rem" }}>Postage & packing included. Cheques payable to Objects & Co.</p>
        <div style={{ marginTop: 16 }}>
          <Link href="/worlds/objects/shop" style={{ background: "#2a2118", color: "#e8ddc4", padding: "12px 20px", letterSpacing: "0.12em", fontSize: 12 }}>SHOP THE MODERN WAY →</Link>
        </div>
      </div>
    </div>
  );
}

export function ObjectsPlayful() {
  return (
    <div style={{ background: "#fff3d6", color: "#241a12", minHeight: "100dvh", fontFamily: "var(--font-shop)" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/PLAY" />
      <RealityShell world="objects" current="playful" basePath="/worlds/objects" />
      <header style={{ padding: "36px 20px 8px", textAlign: "center", transform: "rotate(-1deg)" }}>
        <p style={{ fontWeight: 800, letterSpacing: "0.2em", fontSize: 12, color: "#e2542e" }}>★ BOING ★ POTS WITH PERSONALITY ★</p>
        <h1 style={{ fontSize: "clamp(3rem, 12vw, 7rem)", margin: "8px 0", fontWeight: 900 }}>WOBBLY & PROUD</h1>
      </header>
      <div style={{ display: "flex", gap: 18, padding: "12px 20px 60px", overflowX: "auto" }}>
        {objectProducts.map((p, i) => (
          <Link
            key={p.id}
            href={`/worlds/objects/product/${p.id}`}
            style={{
              flex: "0 0 220px", background: "#fff", border: "3px solid #241a12", borderRadius: 24,
              transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`, transition: "transform 200ms",
              display: "block", overflow: "hidden",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${i % 2 ? 1.5 : -1.5}deg)`)}
          >
            <img src={p.image} alt={p.name} loading="lazy" decoding="async" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "12px 14px" }}>
              <strong>{p.name}!</strong>
              <div style={{ color: "#e2542e", fontWeight: 800 }}>{money(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
      <WorldProof
        proves="Elastic shelves, same stock. Play is a layout strategy, not a lack of one."
        relatedHref="/worlds/pulse"
        relatedName="PULSE"
      />
    </div>
  );
}

export function ObjectsStoreroom() {
  const cats = [...new Set(objectProducts.map((p) => p.category))];
  return (
    <div style={{ background: "#1a1a1a", color: "#e8e4da", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/STOREROOM" />
      <RealityShell world="objects" current="storeroom" basePath="/worlds/objects" />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#e2c08d" }}>STAFF ONLY · MANIFEST 06 · {objectProducts.length} PIECES ON HAND</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5rem)", margin: "8px 0" }}>Storeroom.</h1>
        <p style={{ color: "#a89a80" }}>The shop with its sleeves up. Every piece, its variants, its bin — the back room you were never meant to see, now shoppable.</p>
        {cats.map((cat) => (
          <section key={cat} style={{ marginTop: 32 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#e2c08d" }}>BAY · {cat.toUpperCase()}</p>
            <div style={{ border: "1px solid rgba(232,228,218,0.3)" }}>
              {objectProducts.filter((p) => p.category === cat).map((p, i) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 12, padding: "12px 16px", borderTop: i ? "1px dashed rgba(232,228,218,0.25)" : "none", alignItems: "center" }}>
                  <span style={{ color: "#e2c08d" }}>BIN-{cat.slice(0, 2).toUpperCase()}{i + 1}</span>
                  <span>
                    <Link href={`/worlds/objects/product/${p.id}`} style={{ textDecoration: "underline", fontWeight: 700 }}>{p.name}</Link>
                    <br /><span style={{ fontSize: "0.8rem", color: "#a89a80" }}>{p.options.join(" / ")}</span>
                  </span>
                  <span>{money(p.price)}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
        <p style={{ marginTop: 28 }}>Front of house is prettier. <Link href="/worlds/objects/shop" style={{ textDecoration: "underline" }}>Back to the shop →</Link></p>
      </div>
      <WorldProof
        proves="Inventory with nothing to hide: bins, variants, prices — the stockroom as a sales floor."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}

export function ObjectsGift() {
  return (
    <div style={{ background: "#fbf3e4", color: "#3a2a1a", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/GIFT" />
      <RealityShell world="objects" current="gift" basePath="/worlds/objects" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em" }}>WRAPPED · TAGGED · NEVER A RECEIPT IN THE BOX</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 9vw, 5.5rem)", fontWeight: 400, margin: "12px 0" }}>Give it.</h1>
        <p style={{ fontStyle: "italic", color: "#8a6f52" }}>The whole stock, chosen for giving. Pick the piece, pick the wrap, write the tag.</p>
        <div style={{ textAlign: "left", marginTop: 36 }}>
          {objectProducts.map((p) => (
            <div key={p.id} style={{ border: "2px solid #3a2a1a", margin: "16px 0", padding: 20, background: "#fffdf6" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.25em", margin: 0 }}>GIFT Nº {p.id.toUpperCase()}</p>
              <h2 style={{ fontSize: "1.6rem", margin: "8px 0" }}>
                <Link href={`/worlds/objects/product/${p.id}`} style={{ textDecoration: "underline" }}>{p.name}</Link>
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#6b5a44" }}>{p.desc}</p>
              <p style={{ fontSize: "0.85rem" }}>Wrap: {p.options.join(" · ")} <span style={{ color: "#8a6f52" }}>(we choose the ribbon)</span></p>
              <p style={{ fontSize: "1.2rem", margin: "8px 0 0" }}>{money(p.price)} <span style={{ fontSize: "0.8rem", color: "#8a6f52" }}>+ wrap on us</span></p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24 }}><Link href="/worlds/objects/checkout" style={{ background: "#3a2a1a", color: "#fbf3e4", padding: "12px 24px", letterSpacing: "0.15em", fontSize: 12 }}>WRAP THEM ALL →</Link></p>
      </div>
      <WorldProof
        proves="Gifting as a layout: the same stock, reframed around the recipient — occasions outsell categories."
        relatedHref="/worlds/noir"
        relatedName="NOIR"
      />
    </div>
  );
}
