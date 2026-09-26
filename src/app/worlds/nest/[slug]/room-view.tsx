"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nestMaterials, nestRooms } from "@/data/nest";
import { loadJson, saveJson } from "@/lib/storage";
import { track } from "@/lib/track";

export function RoomView({ slug }: { slug: string }) {
  const room = nestRooms.find((r) => r.slug === slug);
  const [mat, setMat] = useState("plaster");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState("");

  // Hydrate persisted material after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMat(loadJson<string>(`wasp-v11-nest-mat-${slug}`, "plaster"));
  }, [slug]);
  useEffect(() => {
    saveJson(`wasp-v11-nest-mat-${slug}`, mat);
  }, [slug, mat]);

  if (!room) return <p style={{ padding: 24 }}>No such room.</p>;
  const material = nestMaterials.find((m) => m.id === mat) ?? nestMaterials[0];
  const others = nestRooms.filter((r) => r.slug !== slug);
  const notes: Record<string, { mood: string; scale: string; relation: string }> = {
    "reading-corner": { mood: "Held and low — the room drops its voice.", scale: "One body, one book, one lamp.", relation: "Off the table room, behind a half-wall." },
    "oak-table": { mood: "Convivial and loud — built for midnight.", scale: "Six chairs, one long table, no wobble.", relation: "Center of the plan; every room refers to it." },
    "linen-bedroom": { mood: "Slow and pale — designed for waking.", scale: "Low bed, one window, nothing else competing.", relation: "East end, farthest from the door." },
    "maker-niche": { mood: "Honest and even — north light, no flattery.", scale: "A bench, a stool, a day's work.", relation: "Tucked beside the bedroom, smallest room, hardest working." },
  };
  const note = notes[slug] ?? { mood: "", scale: "", relation: "" };

  async function ask() {
    if (!room) return;
    if (!name.trim() || !email.includes("@")) {
      setDone("A name and a valid email, so the practice can reply.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email,
        brief: `NEST enquiry: ${room.name} in ${material.name}.`,
        source: "nest",
      }),
    });
    if (res.ok) {
      setDone(`Noted. The practice replies about the ${room.name.toLowerCase()} within a week.`);
      track("inquiry_submitted", { source: "nest" });
    }
    else setDone("Could not send. Try again.");
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>
      <Link href="/worlds/nest" className="kicker">← The plan</Link>
      <p className="kicker" style={{ marginTop: 16 }}>{room.size} · {room.light}</p>
      <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.4rem)", margin: "8px 0", letterSpacing: "-0.04em" }}>{room.name}</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "56ch" }}>{room.desc}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }} className="grid-3">
        {[
          ["Mood", note.mood],
          ["Scale", note.scale],
          ["Relation", note.relation],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="kicker">{k}</p>
            <p style={{ margin: "4px 0 0" }}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{ background: material.hex, padding: 16, marginTop: 20, transition: "background 400ms" }}>
        <img src={room.image} alt={room.name} loading="lazy" decoding="async" style={{ width: "100%", maxHeight: 440, objectFit: "cover" }} />
        <p className="kicker" style={{ marginTop: 10, color: "#1c1a16" }}>Shown in {material.name} — {material.note}</p>
      </div>
      <p className="kicker" style={{ marginTop: 24 }}>Materials</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {nestMaterials.map((m) => (
          <button
            key={m.id}
            type="button"
            className={mat === m.id ? "chip-on" : "chip"}
            aria-pressed={mat === m.id}
            onClick={() => setMat(m.id)}
            title={m.note}
          >
            <span aria-hidden style={{ display: "inline-block", width: 12, height: 12, background: m.hex, border: "1px solid var(--line)", marginRight: 6 }} />
            {m.name}
          </button>
        ))}
      </div>
      <div className="panel" style={{ marginTop: 32 }}>
        <p className="kicker">Ask about this room</p>
        <div className="grid-2">
          <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
        </div>
        <button className="btn" type="button" onClick={ask}>Ask about the {room.name.toLowerCase()}</button>
        {done ? <p style={{ marginTop: 12 }}>{done}</p> : null}
      </div>
      <div style={{ marginTop: 32 }}>
        <p className="kicker">Other rooms</p>
        {others.map((r) => (
          <Link key={r.slug} href={`/worlds/nest/${r.slug}`} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
            <span>{r.name}</span><span className="kicker">{r.light}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
