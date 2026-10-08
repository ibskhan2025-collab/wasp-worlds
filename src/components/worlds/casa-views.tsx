"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { CasaNav } from "@/components/worlds/casa-realities";
import { WorldProof } from "@/components/worlds/world-proof";
import { casa, casaGallery, dishes, type Dish } from "@/data/casa";
import { media } from "@/lib/media";
import { money } from "@/lib/use-cart";

export type CasaViewId = "oceanic" | "counter" | "cellar" | "brutalist" | "japanese" | "spatial" | "garden";
export type CasaSubView = "house" | "menu" | "story" | "gallery" | "contact" | "reservations";

type Theme = {
  bg: string;
  fg: string;
  muted: string;
  line: string;
  accent: string;
  font: string;
  roomLabel: string;
  tagline: string;
  hero: string;
  heroAlt: string;
  menuLead: string;
  first: Dish["category"][];
  story: [string, string];
  proof: string;
  proofHref: string;
  proofName: string;
};

const SERIF = "var(--font-serif)";
const CODE = "var(--font-code)";

export const CASA_VIEW_THEMES: Record<CasaViewId, Theme> = {
  oceanic: {
    bg: "#06222b", fg: "#e8f4f0", muted: "#6fa3a5", line: "rgba(232,244,240,0.2)", accent: "#2ea8a0", font: SERIF,
    roomLabel: "Room 01 · OCEANIC", tagline: "Twelve fathoms down, same kitchen.",
    hero: media.casa.dish1, heroAlt: "Seafood plated with herbs on black ceramic.",
    menuLead: "The sea dishes lead. Everything else holds its breath.",
    first: ["Sea", "Garden", "Fire", "Sweet", "Wine"],
    story: [
      "The flood started as a joke in a dry July: what if the dining room sank twelve fathoms and kept serving? The menu answered before we did — the sea dishes rose to the top and everything else learned to hold its breath.",
      "So this room runs tide-first. Shallows to dark water, boats to plates. The bookings, the kitchen, the fire are the same as upstairs; only the order of things changed.",
    ],
    proof: "Atmosphere you can swim in, utility that still floats: tide-first menu, same validated bookings.",
    proofHref: "/worlds/objects", proofName: "OBJECTS",
  },
  counter: {
    bg: "#140f0c", fg: "#f3e8d8", muted: "#c9a98a", line: "rgba(243,232,216,0.25)", accent: "#ff5a2e", font: CODE,
    roomLabel: "Room 01 · COUNTER", tagline: "Eight seats at the pass.",
    hero: media.casa.fire, heroAlt: "Kitchen fire catching as meat hits the grill.",
    menuLead: "Fire order. Tickets go up, food comes down.",
    first: ["Fire", "Sea", "Garden", "Sweet", "Wine"],
    story: [
      "There are eight stools at the pass and they are the best seats in the valley. You watch the tickets go up and the food come down, and the kitchen forgets to perform because it is too busy cooking.",
      "The counter menu is the whole menu in fire order: oak first, cold side holding, garden cut that morning. Same dishes as the dining room, eaten closer to the heat.",
    ],
    proof: "The kitchen as interface: fire order, stations, tickets — ordering without leaving the heat.",
    proofHref: "/worlds/forge", proofName: "FORGE",
  },
  cellar: {
    bg: "#171008", fg: "#e9dcc0", muted: "#a08a60", line: "rgba(185,138,61,0.4)", accent: "#b98a3d", font: "Georgia, serif",
    roomLabel: "Room 01 · CELLAR", tagline: "Short list. Everything pours.",
    hero: media.casa.wine, heroAlt: "Two wine glasses at a set table.",
    menuLead: "Bins, pours, and what each drinks with.",
    first: ["Wine", "Fire", "Sea", "Garden", "Sweet"],
    story: [
      "The cellar book is short on purpose. A dozen bins, everything by the glass, bottles only if you ask twice. The list was built backwards from the menu: every pour has to earn its plate.",
      "Down here the pairings do the talking. Pick a glass and the kitchen leans in — fire dishes first, then whatever the boats brought.",
    ],
    proof: "A wine list that behaves like one: bins, pours, and pairings that point at real plates.",
    proofHref: "/worlds/objects", proofName: "OBJECTS",
  },
  brutalist: {
    bg: "#f2f0e8", fg: "#111111", muted: "#555555", line: "#111111", accent: "#111111", font: CODE,
    roomLabel: "Room 01 · BRUTALIST", tagline: "Ledger, no mercy.",
    hero: media.casa.grill, heroAlt: "Grill over open fire, shot straight.",
    menuLead: "Twelve dishes. One grill. Read it like a ledger.",
    first: ["Fire", "Sea", "Garden", "Sweet", "Wine"],
    story: [
      "No tasting menu. No adjectives on the wall. The brutalist room is the menu as a ledger: dishes, prices, heat. If a sentence doesn't help you order, it doesn't get printed.",
      "Same kitchen, fewer words. The grill is the concept and the concept is the grill.",
    ],
    proof: "Ordering without decoration: the ledger is the menu and the menu is honest.",
    proofHref: "/worlds/vector", proofName: "VECTOR",
  },
  japanese: {
    bg: "#f3eee3", fg: "#1d1b18", muted: "#7a6a5c", line: "rgba(29,27,24,0.2)", accent: "#b2332a", font: "Georgia, serif",
    roomLabel: "Room 01 · JAPANESE", tagline: "Courses in silence.",
    hero: media.casa.hero, heroAlt: "The CASA dining room in soft light.",
    menuLead: "品書き — numbered courses, quiet room.",
    first: ["Sea", "Garden", "Fire", "Sweet", "Wine"],
    story: [
      "A table, a fire, and silence between courses. The Japanese room slows the whole operation to half tempo: five courses arrive when they arrive, and nobody explains them twice.",
      "The menu is numbered in kanji and means it. Same dishes as the loud room, eaten at the speed of attention.",
    ],
    proof: "Stillness as service: the same kitchen at half tempo — courses, quiet, stamp.",
    proofHref: "/worlds/still", proofName: "STILL",
  },
  spatial: {
    bg: "#171310", fg: "#e8e0d2", muted: "#8a7f6e", line: "rgba(232,224,210,0.25)", accent: "#c9803f", font: SERIF,
    roomLabel: "Room 01 · SPATIAL", tagline: "Walk in before you book.",
    hero: media.casa.room, heroAlt: "Dining room set for service, wide view.",
    menuLead: "Eight tables. Click one in the 3D room and it pre-fills the booking.",
    first: ["Fire", "Sea", "Garden", "Sweet", "Wine"],
    story: [
      "The dining room, to scale, in your browser. Eight tables with chairs and plates, pendants swaying, daylight on a slider — walk it, click a table, and the booking form already knows where you want to sit.",
      "Geometry with a purpose: every table in the 3D room is the same table the reservations ledger holds.",
    ],
    proof: "The plan is the booking flow: geometry that pre-fills the form.",
    proofHref: "/worlds/nest", proofName: "NEST",
  },
  garden: {
    bg: "#eef3e4", fg: "#1d2a16", muted: "#5c7050", line: "rgba(29,42,22,0.3)", accent: "#4a7c2e", font: SERIF,
    roomLabel: "Room 01 · GARDEN", tagline: "Picked at 16:00, plated at 17:30.",
    hero: media.casa.dish7, heroAlt: "Garden plate with charred allium and herbs.",
    menuLead: "The garden dishes lead. The beds are the menu plan.",
    first: ["Garden", "Sea", "Fire", "Sweet", "Wine"],
    story: [
      "Six beds behind the kitchen decide the menu. Whatever is ready at four in the afternoon is on the plate by half past five — the garden dishes lead and the rest follows the season.",
      "Eaten where it grows. The planting plan hangs by the pass so the cooks can't pretend August is May.",
    ],
    proof: "Provenance as menu: the planting plan is the menu plan.",
    proofHref: "/worlds/casa/counter", proofName: "COUNTER",
  },
};

const VIEWS: { id: Exclude<CasaSubView, "house">; label: string }[] = [
  { id: "menu", label: "Menu" },
  { id: "story", label: "Story" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
  { id: "reservations", label: "Reserve" },
];

export function CasaSubNav({ reality, current }: { reality: CasaViewId; current: CasaSubView }) {
  const t = CASA_VIEW_THEMES[reality];
  return (
    <nav aria-label={`${reality} sections`} style={{ display: "flex", gap: 2, alignItems: "center", background: t.bg, color: t.fg, borderBottom: `1px solid ${t.line}`, padding: "0 12px", overflowX: "auto", fontFamily: CODE }}>
      <Link
        href={`/worlds/casa/${reality}`}
        aria-current={current === "house" ? "page" : undefined}
        style={{ padding: "10px 12px", fontSize: 12, letterSpacing: "0.1em", color: current === "house" ? t.bg : t.fg, background: current === "house" ? t.accent : "transparent", whiteSpace: "nowrap", fontWeight: 800 }}
      >
        House
      </Link>
      {VIEWS.map((v) => (
        <Link
          key={v.id}
          href={`/worlds/casa/${reality}/${v.id}`}
          aria-current={current === v.id ? "page" : undefined}
          style={{ padding: "10px 12px", fontSize: 12, letterSpacing: "0.1em", color: current === v.id ? t.bg : t.fg, background: current === v.id ? t.accent : "transparent", whiteSpace: "nowrap" }}
        >
          {v.label}
        </Link>
      ))}
    </nav>
  );
}

function Shell({ reality, view, children, title, kicker }: { reality: CasaViewId; view: CasaSubView; children: React.ReactNode; title: string; kicker: string }) {
  const t = CASA_VIEW_THEMES[reality];
  return (
    <div style={{ background: t.bg, color: t.fg, minHeight: "100dvh", fontFamily: t.font }}>
      <WorldExit id="casa" label={t.roomLabel} />
      <CasaNav current={reality} />
      <CasaSubNav reality={reality} current={view} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", color: t.muted, margin: 0 }}>{kicker}</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 7vw, 4.6rem)", margin: "8px 0 8px", lineHeight: 1 }}>{title}</h1>
        <p style={{ fontStyle: "italic", color: t.muted, marginTop: 0 }}>{t.tagline}</p>
        {children}
      </div>
      <WorldProof proves={t.proof} relatedHref={t.proofHref} relatedName={t.proofName} />
    </div>
  );
}

function orderedDishes(reality: CasaViewId) {
  const order = CASA_VIEW_THEMES[reality].first;
  return [...dishes].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
}

export function CasaMenuView({ reality }: { reality: CasaViewId }) {
  const t = CASA_VIEW_THEMES[reality];
  const list = orderedDishes(reality);
  return (
    <Shell reality={reality} view="menu" title="Menu" kicker={`${t.roomLabel} · EAT`}>
      <img src={t.hero} alt={t.heroAlt} loading="lazy" decoding="async" style={{ width: "100%", maxHeight: 380, objectFit: "cover", margin: "16px 0 8px" }} />
      <p style={{ color: t.muted }}>{t.menuLead}</p>
      {list.map((d) => (
        <Link key={d.id} href={`/worlds/casa/menu/${d.id}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "16px 0", borderBottom: `1px solid ${t.line}` }}>
          <span>
            <strong style={{ fontSize: "1.3rem", fontWeight: 500 }}>{d.name}</strong>
            <br /><span style={{ color: t.muted, fontSize: "0.9rem" }}>{d.desc}</span>
            <br /><span style={{ fontSize: 11, letterSpacing: "0.15em", color: t.accent }}>{d.category.toUpperCase()}{d.dietary.length ? ` · ${d.dietary.join(" / ")}` : ""}</span>
          </span>
          <span style={{ fontSize: "1.3rem", whiteSpace: "nowrap" }}>{money(d.price)}</span>
        </Link>
      ))}
      <p style={{ marginTop: 28 }}>
        <Link href={`/worlds/casa/${reality}/reservations`} style={{ background: t.accent, color: t.bg, padding: "12px 20px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>
          BOOK THIS ROOM →
        </Link>
      </p>
    </Shell>
  );
}

export function CasaStoryView({ reality }: { reality: CasaViewId }) {
  const t = CASA_VIEW_THEMES[reality];
  const [p1, p2] = t.story;
  return (
    <Shell reality={reality} view="story" title="Story" kicker={`${t.roomLabel} · HOW IT STARTED`}>
      <img src={t.hero} alt={t.heroAlt} loading="lazy" decoding="async" style={{ width: "100%", maxHeight: 380, objectFit: "cover", margin: "16px 0 8px" }} />
      <p style={{ fontSize: "1.25rem", lineHeight: 1.6 }}>{p1}</p>
      <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: t.muted }}>{p2}</p>
      <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: t.muted }}>Casa Valle is a fictional restaurant in Ojai, built as a working study. The bookings are real; the valley is not.</p>
    </Shell>
  );
}

export function CasaGalleryView({ reality }: { reality: CasaViewId }) {
  const t = CASA_VIEW_THEMES[reality];
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Shell reality={reality} view="gallery" title="Gallery" kicker={`${t.roomLabel} · THE ROOM`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8, marginTop: 20 }}>
        {casaGallery.map((img, i) => (
          <button key={img.src} type="button" onClick={() => setOpen(i)} style={{ border: `1px solid ${t.line}`, padding: 0, background: "none", cursor: "zoom-in" }} aria-label={`Open photo: ${img.alt}`}>
            <img src={img.src} alt={img.alt} loading="lazy" decoding="async" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
          </button>
        ))}
      </div>
      {open !== null ? (
        <div className="lightbox" role="dialog" aria-label="Image">
          <button type="button" className="ghost" onClick={() => setOpen(null)} style={{ position: "absolute", top: 16, right: 16 }}>
            Close
          </button>
          <img src={casaGallery[open].src} alt={casaGallery[open].alt} />
        </div>
      ) : null}
    </Shell>
  );
}

export function CasaContactView({ reality }: { reality: CasaViewId }) {
  const t = CASA_VIEW_THEMES[reality];
  return (
    <Shell reality={reality} view="contact" title="Contact" kicker={`${t.roomLabel} · FIND US`}>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 20 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: t.muted }}>ADDRESS</p>
          <p style={{ fontSize: "1.2rem" }}>{casa.address}</p>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: t.muted, marginTop: 20 }}>WRITE / CALL</p>
          <p style={{ fontSize: "1.2rem" }}>{casa.phone}<br />{casa.email}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: t.muted }}>HOURS</p>
          {casa.hours.map((h) => (
            <p key={h.day} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${t.line}`, padding: "8px 0", margin: 0 }}>
              <span>{h.day}</span><span>{h.time}</span>
            </p>
          ))}
        </div>
      </div>
      <p style={{ marginTop: 28 }}>
        <Link href={`/worlds/casa/${reality}/reservations`} style={{ background: t.accent, color: t.bg, padding: "12px 20px", fontWeight: 700, fontSize: 12, letterSpacing: "0.15em" }}>
          BOOK THIS ROOM →
        </Link>
      </p>
    </Shell>
  );
}

export function CasaBookingForm({ reality }: { reality: CasaViewId }) {
  const t = CASA_VIEW_THEMES[reality];
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.date || !data.time || !data.party) {
      setStatus("err");
      setMessage("Name, email, date, time, and party size, please.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone, date: data.date, time: data.time, party: Number(data.party), notes: `${data.notes ?? ""} [room: ${reality}]` }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setMessage(`Held in the ${reality} room. We'll confirm by email.`);
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Could not hold the table. Try again.");
    }
  }
  return (
    <form onSubmit={onSubmit} style={{ marginTop: 24 }}>
      <label className="field"><span>Name</span><input name="name" autoComplete="name" required /></label>
      <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      <label className="field"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
      <div className="grid-2">
        <label className="field"><span>Date</span><input name="date" type="date" required /></label>
        <label className="field"><span>Time</span><select name="time" required defaultValue="19:00">{casa.times.map((x) => <option key={x}>{x}</option>)}</select></label>
      </div>
      <label className="field"><span>Party</span><select name="party" required defaultValue="2">{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
      <label className="field"><span>Notes</span><textarea name="notes" placeholder="Allergies, celebration, a dislike of coriander." /></label>
      <button className="btn" type="submit" disabled={status === "sending"} style={{ background: t.accent, borderColor: t.accent, color: t.bg }}>
        {status === "sending" ? "Holding…" : "Hold the table"}
      </button>
      {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
    </form>
  );
}

export function CasaReservationsView({ reality }: { reality: CasaViewId }) {
  const t = CASA_VIEW_THEMES[reality];
  return (
    <Shell reality={reality} view="reservations" title="Reserve" kicker={`${t.roomLabel} · A TABLE`}>
      <p style={{ color: t.muted }}>We sit 36 across the house. Tell us the room and the night; the fire does the rest.</p>
      <CasaBookingForm reality={reality} />
    </Shell>
  );
}
