"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { destinations } from "@/data/atlas";
import { loadJson, saveJson } from "@/lib/storage";
import { track } from "@/lib/track";
import { money } from "@/lib/use-cart";

const PLAN_KEY = "wasp-v11-atlas-plan";

export function Itinerary() {
  const [plan, setPlan] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [month, setMonth] = useState("Flexible");

  // Hydrate persisted plan after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(loadJson<string[]>(PLAN_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(PLAN_KEY, plan);
  }, [plan]);

  const routes = useMemo(() => plan.map((s) => destinations.find((d) => d.slug === s)).filter((d) => d !== undefined), [plan]);
  const days = routes.reduce((n, d) => n + d.days, 0);
  const total = routes.reduce((n, d) => n + d.price, 0) * travelers;

  function move(i: number, dir: -1 | 1) {
    setPlan((p) => {
      const next = [...p];
      const j = i + dir;
      if (j < 0 || j >= next.length) return p;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function send() {
    if (!name.trim() || !email.includes("@")) {
      setDone("A name and a valid email, so the valley can reply.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email,
        brief: `ATLAS itinerary (${travelers} traveler${travelers === 1 ? "" : "s"}, ${month}): ${routes.map((d) => d.name).join(" → ")} (${days} days)`,
        source: "atlas",
      }),
    });
    if (res.ok) {
      setPlan([]);
      track("inquiry_submitted", { source: "atlas" });
      setDone("Sent. The valley replies within two days — in character.");
    } else setDone("Could not send. Try again.");
  }

  return (
    <div className="arc-root">
      <WorldExit id="atlas" label="Room 10 · ATLAS" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/atlas" className="kicker">← All routes</Link>
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 4.6rem)", margin: "8px 0" }}>Itinerary</h1>
        {routes.length === 0 ? (
          <p>Empty. <Link href="/worlds/atlas">Walk the routes</Link> and add stops.</p>
        ) : (
          <>
            {routes.map((d, i) => (
              <div key={d.slug} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 12, padding: "14px 0", borderTop: "1px solid var(--line)", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>0{i + 1}</span>
                <div>
                  <Link href={`/worlds/atlas/${d.slug}`}><strong>{d.name}</strong></Link>
                  <div className="kicker">{d.days} days · {money(d.price)}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" className="ghost" aria-label={`Move ${d.name} up`} onClick={() => move(i, -1)}>↑</button>
                  <button type="button" className="ghost" aria-label={`Move ${d.name} down`} onClick={() => move(i, 1)}>↓</button>
                  <button type="button" className="ghost" onClick={() => setPlan((p) => p.filter((x) => x !== d.slug))}>Remove</button>
                </div>
              </div>
            ))}
            <p style={{ marginTop: 16 }}><strong>{days} days · {money(total)}</strong> for {travelers} traveler{travelers === 1 ? "" : "s"} in {month.toLowerCase()}</p>
            <div className="grid-2" style={{ marginTop: 8 }}>
              <div className="field">
                <span>Travelers</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button type="button" className="ghost" aria-label="Fewer travelers" onClick={() => setTravelers((n) => Math.max(1, n - 1))}>−</button>
                  <span aria-live="polite">{travelers}</span>
                  <button type="button" className="ghost" aria-label="More travelers" onClick={() => setTravelers((n) => Math.min(12, n + 1))}>+</button>
                </div>
              </div>
              <label className="field"><span>Month</span>
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                  {["Flexible", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid-2" style={{ marginTop: 16 }}>
              <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
              <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
            </div>
            <button className="btn" type="button" onClick={send}>Request this route</button>
          </>
        )}
        {done ? <p style={{ marginTop: 16 }}>{done}</p> : null}
      </div>
    </div>
  );
}
