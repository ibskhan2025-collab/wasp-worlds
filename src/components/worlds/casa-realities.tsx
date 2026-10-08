"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { RealityShell } from "@/components/worlds/reality-shell";
import { WorldProof } from "@/components/worlds/world-proof";
import { casa, casaGallery, dishes } from "@/data/casa";
import { media } from "@/lib/media";
import { CasaSubNav } from "@/components/worlds/casa-views";
import { type CasaViewId } from "@/components/worlds/casa-view-themes";
import { money } from "@/lib/use-cart";

export function CasaNav({ current }: { current: string }) {
  return (
    <nav aria-label="CASA realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#140f0c", color: "#f3e8d8", borderBottom: "1px solid rgba(243,232,216,0.25)", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/casa" style={{ padding: "12px 8px", letterSpacing: "0.25em", fontSize: 12, fontWeight: 800, fontFamily: "var(--font-code)" }}>
        CASA◌
      </Link>
      {[
        ["classic", "Classic", "/worlds/casa"],
        ["spatial", "Spatial", "/worlds/casa/spatial"],
        ["oceanic", "Oceanic", "/worlds/casa/oceanic"],
        ["brutalist", "Brutalist", "/worlds/casa/brutalist"],
        ["japanese", "Japanese", "/worlds/casa/japanese"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="casa"
          label={label}
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            fontFamily: "var(--font-code)",
            color: current === id ? "#140f0c" : "#f3e8d8",
            background: current === id ? "#ff5a2e" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </WorldNavLink>
      ))}
    </nav>
  );
}

const KANJI = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四"];

const shell = (id: "oceanic" | "counter" | "cellar" | "brutalist" | "japanese" | "garden") => (
  <>
    <WorldExit id="casa" label={`Room 01 · CASA/${id.toUpperCase()}`} />
    <CasaNav current={id} />
    <CasaSubNav reality={id as CasaViewId} current="house" />
  </>
);

export function CasaOceanic() {
  const tide = dishes.filter((d) => d.category === "Sea");
  const rest = dishes.filter((d) => d.category !== "Sea");
  const wrap = useRef<HTMLDivElement | null>(null);
  const [depth, setDepth] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const f = () => {
      const el = wrap.current;
      if (!el) return;
      const max = el.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      setDepth(reduced ? 0 : p);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const top = mix([47, 182, 201], [2, 12, 30], Math.min(1, depth * 1.6));
  const bot = mix([10, 90, 130], [1, 6, 16], Math.min(1, depth * 1.3 + 0.2));
  return (
    <div ref={wrap} style={{ background: `linear-gradient(rgb(${top}), rgb(${bot}))`, color: "#e8f4f0", minHeight: "100dvh", fontFamily: "var(--font-serif)" }}>
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

export function CasaBrutalist() {
  return (
    <div style={{ background: "#f2f0e8", color: "#111", minHeight: "100dvh", fontFamily: "var(--font-code)" }}>
      <div aria-hidden style={{ overflow: "hidden", borderBottom: "4px solid #111", background: "#ffe600", padding: "8px 0", fontSize: 13, fontWeight: 700 }}>
        <div style={{ display: "flex", gap: 40, whiteSpace: "nowrap", width: "max-content" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>Tue–Sun 17:30 – 22:30 · Fire · Salt · Sea · No tasting menu</span>
          ))}
        </div>
      </div>
      {shell("brutalist")}
      <section style={{ borderBottom: "4px solid #111", padding: "24px 16px 0" }}>
        <h1 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(4rem, 26vw, 22rem)", lineHeight: 0.85, margin: 0, letterSpacing: "0.01em" }}>CASA</h1>
        <div style={{ display: "grid", gap: 0, borderTop: "4px solid #111", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <p style={{ padding: 16, fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>FOOD IS NOT A CONCEPT. IT IS HEAT, SALT, TIMING.</p>
          <p style={{ padding: 16, margin: 0 }}>12 dishes. One grill. Eight tables. A valley.</p>
          <Link href="/worlds/casa/reservations" style={{ background: "#111", padding: 16, fontWeight: 800, fontSize: "1.4rem", color: "#ffe600" }}>
            Book a table →
          </Link>
        </div>
      </section>
      <section style={{ padding: "40px 16px" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.6rem, 9vw, 6rem)", lineHeight: 0.9, margin: "0 0 24px" }}>
          MENU / {String(dishes.length).padStart(2, "0")}
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "4px solid #111", borderBottom: "4px solid #111", textAlign: "left" }}>
          <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Menu ledger</caption>
          <tbody>
            {dishes.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: "2px solid #111" }}>
                <td style={{ padding: 0 }} colSpan={4}>
                  <Link href={`/worlds/casa/menu/${d.id}`} style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr auto", gap: 12, padding: "12px 4px", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.85rem" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span style={{ display: "block", fontFamily: "var(--font-bebas)", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", lineHeight: 1 }}>{d.name}</span>
                      <span style={{ fontSize: 12, textTransform: "uppercase" }}>{d.category} · {d.dietary.join(" / ") || "omnivore"}</span>
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "1.2rem" }}>{money(d.price)}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section style={{ borderTop: "4px solid #111", background: "#ffe600", padding: "40px 16px" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.6rem, 9vw, 6rem)", lineHeight: 0.9, margin: "0 0 8px" }}>EVIDENCE</h2>
        <p style={{ maxWidth: "52ch" }}>The room, the fire, the plates. <Link href="/worlds/casa/gallery" style={{ textDecoration: "underline", fontWeight: 800 }}>See the gallery →</Link></p>
      </section>
      <section style={{ borderTop: "4px solid #111", padding: "40px 16px 64px" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.6rem, 9vw, 6rem)", lineHeight: 0.9, margin: "0 0 8px" }}>RESERVE</h2>
        <p>Names, dates, parties. Nothing else. <Link href="/worlds/casa/reservations" style={{ background: "#111", color: "#ffe600", padding: "10px 18px", fontWeight: 800 }}>Book →</Link></p>
        <p style={{ marginTop: 24, fontWeight: 700 }}>{casa.address.toUpperCase()} · CLOSED MONDAYS.</p>
      </section>
      <section style={{ borderTop: "4px solid #111", padding: "40px 16px 64px" }}>
        <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(2.6rem, 9vw, 6rem)", lineHeight: 0.9, margin: "0 0 8px" }}>WRITE / FIND</h2>
        <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 16 }}>
          <div>
            <p style={{ fontWeight: 800 }}>{casa.address.toUpperCase()}</p>
            <p>{casa.phone.toUpperCase()}<br />{casa.email.toUpperCase()}</p>
            <p style={{ marginTop: 12 }}>CLOSED MONDAYS.</p>
          </div>
          <div>
            {casa.hours.map((h) => (
              <p key={h.day} style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #111", padding: "8px 0", margin: 0, fontWeight: 700 }}>
                <span>{h.day.toUpperCase()}</span><span>{h.time}</span>
              </p>
            ))}
            <p style={{ marginTop: 16 }}><Link href="/worlds/casa/contact" style={{ textDecoration: "underline", fontWeight: 800 }}>FULL CONTACT →</Link></p>
          </div>
        </div>
      </section>
      <WorldProof
        proves="Luxury removed, appetite intact: the same kitchen as a ledger — numbered, priced, bookable."
        relatedHref="/worlds/noir"
        relatedName="NOIR"
      />
    </div>
  );
}

export function CasaJapanese() {
  const [diet, setDiet] = useState<string | null>(null);
  const listed = diet ? dishes.filter((d) => d.dietary.includes(diet)) : dishes;
  return (
    <div style={{ background: "#f3eee3", color: "#1d1b18", minHeight: "100dvh", fontFamily: "var(--font-plex)", fontWeight: 300 }}>
      {shell("japanese")}
      <section style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, padding: "64px 20px" }}>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(3.5rem, 9vw, 8rem)", letterSpacing: "0.3em", margin: 0, writingMode: "vertical-rl", textOrientation: "upright" }}>
          CASA
        </h1>
        <div style={{ position: "relative", alignSelf: "stretch", minHeight: 320 }}>
          <img src={media.casa.hero} alt="The CASA dining room in soft light" loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.35) contrast(.9) brightness(1.05)" }} />
          <span aria-hidden style={{ position: "absolute", bottom: -20, right: 16, width: 56, height: 56, display: "grid", placeItems: "center", background: "#b2332a", color: "#f3eee3", fontSize: 28 }}>
            家
          </span>
          <p style={{ position: "absolute", left: 0, top: 0, maxWidth: "14rem", background: "#f3eee3", padding: "8px 16px 8px 0", fontStyle: "italic", fontSize: "0.9rem", margin: 0 }}>
            A table, a fire, and silence between courses.
          </p>
        </div>
      </section>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <h2 style={{ textAlign: "center", fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "0.3em", margin: 0 }}>
          MENU · 品書き
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 20 }} role="group" aria-label="Filter by diet">
          {[null, "vegetarian", "vegan"].map((f) => (
            <button
              key={f ?? "all"}
              type="button"
              aria-pressed={diet === f}
              onClick={() => setDiet(f)}
              style={{ background: diet === f ? "#1d1b18" : "transparent", color: diet === f ? "#f3eee3" : "#1d1b18", border: "1px solid #1d1b18", padding: "8px 16px", fontSize: 12, letterSpacing: "0.1em" }}
            >
              {f ?? "ALL"}
            </button>
          ))}
        </div>
        <ol style={{ listStyle: "none", margin: "32px 0 0", padding: 0, display: "grid", gap: "0 64px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {listed.map((d, i) => (
            <li key={d.id} style={{ borderTop: "1px solid rgba(29,27,24,0.2)" }}>
              <Link href={`/worlds/casa/menu/${d.id}`} style={{ display: "flex", gap: 16, padding: "20px 0", textAlign: "left", width: "100%" }}>
                <span style={{ width: 32, flexShrink: 0, paddingTop: 4, fontSize: "0.9rem", color: "#b2332a", fontFamily: "var(--font-cormorant)" }}>
                  {KANJI[i] ?? String(i + 1)}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: "1.4rem", fontFamily: "var(--font-cormorant)" }}>{d.name}</span>
                  <span style={{ display: "block", marginTop: 4, fontSize: "0.85rem", lineHeight: 1.6, opacity: 0.7 }}>{d.desc}</span>
                </span>
                <span style={{ fontSize: "1.1rem", fontFamily: "var(--font-cormorant)" }}>{money(d.price)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {casaGallery.slice(0, 3).map((g) => (
            <figure key={g.src} style={{ margin: 0 }}>
              <img src={g.src} alt={g.alt} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", filter: "saturate(.4) brightness(1.05)" }} />
            </figure>
          ))}
        </div>
      </section>
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px 112px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", letterSpacing: "0.3em", margin: "0 0 24px" }}>
          予約 · RESERVE
        </h2>
        <Link href="/worlds/casa/reservations" style={{ border: "1px solid #1d1b18", padding: "12px 28px", letterSpacing: "0.15em", fontSize: 12 }}>
          BOOK BY MEDITATION →
        </Link>
      </section>
      <WorldProof
        proves="Stillness as service: the same kitchen at half tempo — courses, quiet, stamp."
        relatedHref="/worlds/still"
        relatedName="STILL"
      />
    </div>
  );
}

const BEDS = ["Bed 01 · Alliums", "Bed 02 · Leaves", "Bed 03 · Roots", "Bed 04 · Herbs", "Bed 05 · Flowers", "Bed 06 · Compost"];

export function CasaGarden() {
  const [veg, setVeg] = useState(false);
  const greens = dishes.filter((d) => d.category === "Garden");
  const shown = veg ? greens.filter((d) => d.dietary.includes("vegetarian")) : greens;
  const rest = dishes.filter((d) => d.category !== "Garden");
  return (
    <div style={{ background: "#eef3e4", color: "#1d2a16", minHeight: "100dvh", fontFamily: "var(--font-serif)" }}>
      {shell("garden")}
      <header style={{ textAlign: "center", padding: "56px 20px 8px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.35em", color: "#5c7050", margin: 0 }}>THE KITCHEN GARDEN · PICKED AT 16:00, PLATED AT 17:30</p>
        <h1 style={{ fontSize: "clamp(3rem, 11vw, 8rem)", lineHeight: 0.95, margin: "12px 0", fontWeight: 500 }}>Garden</h1>
        <p style={{ maxWidth: "48ch", margin: "0 auto", color: "#3c4a34", fontStyle: "italic" }}>Eaten where it grows. The garden dishes lead the menu; the beds below are the actual planting plan.</p>
      </header>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#4a7c2e", margin: 0 }}>FROM THE BEDS · {shown.length} PLATES</p>
          <button type="button" aria-pressed={veg} onClick={() => setVeg((v) => !v)} style={{ background: veg ? "#1d2a16" : "transparent", color: veg ? "#eef3e4" : "#1d2a16", border: "1px solid #1d2a16", padding: "8px 16px", fontSize: 12, letterSpacing: "0.1em" }}>
            {veg ? "● VEGETARIAN ONLY" : "○ VEGETARIAN ONLY"}
          </button>
        </div>
        {shown.map((d) => (
          <Link key={d.id} href={`/worlds/casa/menu/${d.id}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "18px 0", borderBottom: "1px solid rgba(29,42,22,0.25)" }}>
            <span><strong style={{ fontSize: "1.4rem", fontWeight: 500 }}>{d.name}</strong><br /><span style={{ color: "#5c7050" }}>{d.desc}</span></span>
            <span style={{ fontSize: "1.4rem", whiteSpace: "nowrap" }}>{money(d.price)}</span>
          </Link>
        ))}
        <svg viewBox="0 0 600 220" width="100%" role="img" aria-label="Planting plan: six beds" style={{ marginTop: 32, border: "1px solid #1d2a16", background: "#e2e9d2" }}>
          {BEDS.map((b, i) => {
            const x = 20 + (i % 3) * 190;
            const y = 20 + Math.floor(i / 3) * 100;
            const dish = greens[i % Math.max(greens.length, 1)];
            return (
              <g key={b}>
                <rect x={x} y={y} width={170} height={80} fill="none" stroke="#1d2a16" strokeWidth="2" />
                {[0, 1, 2, 3].map((r) => (
                  <line key={r} x1={x} y1={y + 16 + r * 16} x2={x + 170} y2={y + 16 + r * 16} stroke="#4a7c2e" strokeWidth="1" opacity="0.5" />
                ))}
                <text x={x + 8} y={y + 18} fontSize="11" fill="#1d2a16" fontFamily="monospace">{b.toUpperCase()}</text>
                {dish ? <text x={x + 8} y={y + 68} fontSize="11" fill="#4a7c2e" fontStyle="italic" fontFamily="serif">{dish.name}</text> : null}
              </g>
            );
          })}
        </svg>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#4a7c2e", marginTop: 32 }}>FROM THE KITCHEN · THE REST</p>
        {rest.slice(0, 6).map((d) => (
          <Link key={d.id} href={`/worlds/casa/menu/${d.id}`} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid rgba(29,42,22,0.15)", color: "#3c4a34" }}>
            {d.name} <span style={{ opacity: 0.6 }}>· {d.category}</span>
          </Link>
        ))}
        <p style={{ marginTop: 28 }}><Link href="/worlds/casa/reservations" style={{ background: "#1d2a16", color: "#eef3e4", padding: "12px 20px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>BOOK AMONG THE BEDS →</Link></p>
      </section>
      <WorldProof
        proves="Provenance as menu: the planting plan is the menu plan — same dishes, same bookings, picked an hour before service."
        relatedHref="/worlds/casa/counter"
        relatedName="COUNTER"
      />
    </div>
  );
}
