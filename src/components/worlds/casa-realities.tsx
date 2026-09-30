"use client";

import Link from "next/link";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { dishes } from "@/data/casa";
import { money } from "@/lib/use-cart";

const shell = (id: "oceanic" | "analog" | "counter" | "cellar") => (
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
        <div style={{ border: "1px solid rgba(46,168,160,0.5)", padding: "20px", marginTop: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#2ea8a0", margin: "0 0 12px" }}>TIDE TABLE · WHAT THE WATER GIVES</p>
          {[
            ["0–2m · shallows", "Sea greens, small shells. Crudo territory."],
            ["2–8m · the drop", "Prawns, head on. Garlic, smoke, bread for the oil."],
            ["8m+ · the dark", "Whatever the boats bring. The kitchen decides, you accept."],
          ].map(([zone, note]) => (
            <div key={zone} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, padding: "10px 0", borderTop: "1px solid rgba(232,244,240,0.15)", fontSize: "0.95rem" }}>
              <strong style={{ color: "#2ea8a0" }}>{zone}</strong>
              <span style={{ color: "#9fd0d2" }}>{note}</span>
            </div>
          ))}
        </div>
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

export function CasaCounter() {
  const fire = dishes.filter((d) => d.category === "Fire");
  const cold = dishes.filter((d) => d.category !== "Fire");
  const station = (d: (typeof dishes)[number]) =>
    d.category === "Fire" ? "OAK · FIRED TO ORDER" : d.category === "Sea" ? "COLD SIDE" : d.category === "Wine" ? "CELLAR · BY THE GLASS" : "GARDEN · MORNING CUT";
  return (
    <div style={{ background: "#140f0c", color: "#f3e8d8", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      {shell("counter")}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#ff5a2e" }}>THE PASS · EIGHT SEATS · TONIGHT&apos;S RAIL</p>
        <h1 style={{ fontSize: "clamp(3rem, 11vw, 7rem)", margin: "8px 0", fontWeight: 700, letterSpacing: "-0.02em" }}>COUNTER</h1>
        <p style={{ maxWidth: "52ch", color: "#c9a98a" }}>Sit at the pass and eat in fire order. Tickets go up, food comes down. Same menu as the dining room — no secrets, just heat.</p>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#ff5a2e", marginTop: 32 }}>FIRED FIRST · FROM THE OAK</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {fire.map((d, i) => (
            <article key={d.id} style={{ border: "1px solid rgba(243,232,216,0.25)", borderTop: "4px solid #ff5a2e", padding: 16, background: "#1c1410" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#ff5a2e", margin: 0 }}>TICKET {String(i + 1).padStart(3, "0")} · {station(d)}</p>
              <h2 style={{ fontSize: "1.3rem", margin: "8px 0" }}>
                <Link href={`/worlds/casa/menu/${d.id}`} style={{ textDecoration: "underline" }}>{d.name}</Link>
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#c9a98a", margin: 0 }}>{d.desc}</p>
              <p style={{ fontSize: "0.8rem", fontStyle: "italic", color: "#8a6f52" }}>{d.note}</p>
              <p style={{ fontSize: "1.2rem", margin: "8px 0 0" }}>{money(d.price)}</p>
            </article>
          ))}
        </div>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c9a98a", marginTop: 32 }}>HOLDING · COLD SIDE, GARDEN, CELLAR</p>
        {cold.map((d) => (
          <Link key={d.id} href={`/worlds/casa/menu/${d.id}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: "1px dashed rgba(243,232,216,0.25)" }}>
            <span><span style={{ fontSize: 10, letterSpacing: "0.2em", color: "#c9a98a" }}>{station(d)} · </span>{d.name} <span style={{ opacity: 0.6 }}>· {d.category}</span></span>
            <span style={{ whiteSpace: "nowrap" }}>{money(d.price)}</span>
          </Link>
        ))}
        <div style={{ marginTop: 28 }}>
          <Link href="/worlds/casa/reservations" style={{ background: "#ff5a2e", color: "#140f0c", padding: "12px 24px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>TAKE A STOOL →</Link>
        </div>
      </div>
      <WorldProof
        proves="The kitchen as interface: fire order, stations, tickets — ordering without leaving the heat."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}

export function CasaCellar() {
  const wines = dishes.filter((d) => d.category === "Wine");
  const food = dishes.filter((d) => d.category !== "Wine");
  return (
    <div style={{ background: "#171008", color: "#e9dcc0", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      {shell("cellar")}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", textAlign: "center", color: "#b98a3d" }}>BIN · GLASS · BOTTLE · ROOM 01C</p>
        <h1 style={{ fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 400, textAlign: "center", margin: "12px 0" }}>The Cellar Book</h1>
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#a08a60" }}>Short on purpose. Everything pours by the glass; bottles on request.</p>
        <div style={{ marginTop: 40, borderTop: "2px solid #b98a3d" }}>
          {wines.map((w, i) => (
            <div key={w.id} style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", gap: 16, padding: "20px 0", borderBottom: "1px solid rgba(185,138,61,0.4)" }}>
              <span style={{ fontSize: "2rem", color: "#b98a3d", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</span>
              <span>
                <Link href={`/worlds/casa/menu/${w.id}`} style={{ fontSize: "1.4rem", textDecoration: "underline" }}>{w.name}</Link>
                <br /><span style={{ color: "#c9b48a" }}>{w.desc}</span>
                <br /><span style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#a08a60" }}>{w.note}</span>
              </span>
              <span style={{ fontSize: "1.3rem", whiteSpace: "nowrap" }}>{money(w.price)}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#b98a3d", marginTop: 40 }}>WHAT IT DRINKS WITH</p>
        {food.slice(0, 6).map((d) => (
          <div key={d.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px dashed rgba(185,138,61,0.35)" }}>
            <span>{d.name} <em style={{ fontSize: "0.85rem", color: "#a08a60" }}>· {d.category}</em></span>
            <Link href={`/worlds/casa/menu/${d.id}`} style={{ textDecoration: "underline", whiteSpace: "nowrap", fontSize: "0.9rem" }}>pair it →</Link>
          </div>
        ))}
        <p style={{ textAlign: "center", marginTop: 32, fontStyle: "italic", color: "#a08a60" }}>The room decides the rest. <Link href="/worlds/casa/reservations" style={{ textDecoration: "underline" }}>Book the corner table →</Link></p>
      </div>
      <WorldProof
        proves="A wine list that behaves like one: bins, pours, and pairings that point at real plates."
        relatedHref="/worlds/objects"
        relatedName="OBJECTS"
      />
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
