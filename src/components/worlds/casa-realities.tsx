"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { dishes } from "@/data/casa";
import { money } from "@/lib/use-cart";

const shell = (id: "oceanic" | "analog") => (
  <>
    <WorldExit id="casa" label={`Room 01 · CASA/${id.toUpperCase()}`} />
    <RealityShell world="casa" current={id} basePath="/worlds/casa" />
  </>
);

export function CasaOceanic() {
  const tide = dishes.filter((d) => d.category === "Sea");
  const rest = dishes.filter((d) => d.category !== "Sea");
  return (
    <div style={{ background: "#06222b", color: "#e8f4f0", minHeight: "100dvh", fontFamily: "var(--font-serif)" }}>
      {shell("oceanic")}
      <header style={{ padding: "40px 20px 8px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#6fa3a5" }}>THE DINING ROOM FLOODS · ROOM 01B</p>
        <h1 style={{ fontSize: "clamp(3.4rem, 13vw, 9rem)", lineHeight: 0.9, margin: "8px 0", fontWeight: 500 }}>CASA<br />ABISAL</h1>
        <p style={{ maxWidth: "46ch", margin: "0 auto", color: "#9fd0d2" }}>Same kitchen, twelve fathoms down. The sea dishes lead; everything else holds its breath.</p>
      </header>
      <svg viewBox="0 0 400 40" width="100%" height="40" preserveAspectRatio="none" aria-hidden style={{ display: "block" }}>
        <path d="M0,20 Q25,5 50,20 T100,20 T150,20 T200,20 T250,20 T300,20 T350,20 T400,20" fill="none" stroke="#2ea8a0" strokeWidth="2" opacity="0.7" />
        <path d="M0,30 Q25,15 50,30 T100,30 T150,30 T200,30 T250,30 T300,30 T350,30 T400,30" fill="none" stroke="#2ea8a0" strokeWidth="1" opacity="0.4" />
      </svg>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#2ea8a0" }}>THE TIDE TABLE</p>
        {tide.map((d) => (
          <Link key={d.id} href={`/worlds/casa/menu/${d.id}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "18px 0", borderBottom: "1px solid rgba(232,244,240,0.2)" }}>
            <span><strong style={{ fontSize: "1.5rem", fontWeight: 500 }}>{d.name}</strong><br /><span style={{ color: "#6fa3a5" }}>{d.desc}</span></span>
            <span style={{ fontSize: "1.5rem", whiteSpace: "nowrap" }}>{money(d.price)}</span>
          </Link>
        ))}
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#2ea8a0", marginTop: 32 }}>ABOVE WATER</p>
        {rest.map((d) => (
          <Link key={d.id} href={`/worlds/casa/menu/${d.id}`} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid rgba(232,244,240,0.12)", color: "#9fd0d2" }}>
            {d.name} <span style={{ opacity: 0.6 }}>· {d.category}</span>
          </Link>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
          <Link href="/worlds/casa/reservations" style={{ background: "#2ea8a0", color: "#06222b", padding: "12px 20px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>DIVE IN — RESERVE →</Link>
        </div>
      </section>
      <WorldProof
        proves="Atmosphere you can swim in, utility that still floats: tide-first menu, same validated bookings. A restaurant site as a place, twice over."
        relatedHref="/worlds/objects"
        relatedName="OBJECTS"
      />
    </div>
  );
}

export function CasaAnalog() {
  return (
    <div style={{ background: "#e5d5b8", color: "#2a2018", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      {shell("analog")}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{ border: "3px double #2a2018", padding: "40px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.35em" }}>EST. VALLEY · No. 036</p>
          <h1 style={{ fontSize: "clamp(3rem, 10vw, 5.5rem)", margin: "12px 0", fontWeight: 400 }}>Casa Valle</h1>
          <p style={{ fontStyle: "italic" }}>Set menu, printed daily. What&apos;s crossed out is gone.</p>
          <div style={{ marginTop: 28, textAlign: "left" }}>
            {dishes.slice(0, 8).map((d, i) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px dashed #2a201855", textDecoration: i === 3 ? "line-through" : "none", opacity: i === 3 ? 0.55 : 1 }}>
                <span>{d.name} <em style={{ fontSize: "0.85rem" }}>· {d.category}</em></span>
                <span>{money(d.price)}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 20, fontSize: "0.85rem" }}>Full menu lives <Link href="/worlds/casa/menu" style={{ textDecoration: "underline" }}>in the dining room</Link>.</p>
          <div style={{ marginTop: 12, display: "inline-block", border: "2px solid #8a3b1f", color: "#8a3b1f", padding: "8px 18px", transform: "rotate(-4deg)", fontWeight: 700, letterSpacing: "0.2em", fontSize: 12 }}>STAMPED · FIRE-APPROVED</div>
          <div style={{ marginTop: 28 }}>
            <Link href="/worlds/casa/reservations" style={{ background: "#2a2018", color: "#e5d5b8", padding: "12px 24px", letterSpacing: "0.15em", fontSize: 12 }}>BOOK BY POSTCARD →</Link>
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.85rem", fontStyle: "italic" }}>Printed daily at noon. This copy is already out of date.</p>
      </div>
    </div>
  );
}

export function CasaZen() {
  return (
    <div style={{ background: "#f2efe6", color: "#2a2723", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="casa" label="Room 01 · CASA/ZEN" />
      <RealityShell world="casa" current="zen" basePath="/worlds/casa" />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "64px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", textAlign: "center" }}>一期一会 · ONE TIME, ONE MEETING</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 4.6rem)", fontWeight: 400, textAlign: "center", margin: "16px 0 8px" }}>Casa, quietly.</h1>
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#7a7268" }}>Five courses. No choices. No photos at the table.</p>
        <div style={{ marginTop: 48 }}>
          {["First — clear broth, yuzu, chive oil", "Second — leek, ember, brown butter", "Third — quail, honey, grilled citrus", "Fourth — rib, marrow butter, onion", "Sweet — olive oil cake, citrus leaf"].map((c, i) => (
            <div key={c} style={{ padding: "28px 0", borderTop: "1px solid rgba(42,39,35,0.25)", textAlign: "center" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#7a7268", margin: 0 }}>0{i + 1}</p>
              <p style={{ fontSize: "1.4rem", margin: "8px 0 0" }}>{c}</p>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 40 }}>Two seatings nightly: 17:30, 20:30. <Link href="/worlds/casa/reservations" style={{ textDecoration: "underline" }}>Reserve in silence →</Link></p>
      </div>
      <WorldProof
        proves="Restraint as hospitality: five courses, no menu to decode, booking in one gesture."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}
