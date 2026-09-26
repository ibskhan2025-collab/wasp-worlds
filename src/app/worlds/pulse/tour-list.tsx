"use client";

import { useEffect, useState } from "react";
import { shows } from "@/data/pulse";
import { loadJson, saveJson } from "@/lib/storage";

const RSVP_KEY = "wasp-v11-pulse-rsvp";

export function TourList() {
  const [going, setGoing] = useState<string[]>([]);

  // Hydrate persisted RSVPs after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoing(loadJson<string[]>(RSVP_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(RSVP_KEY, going);
  }, [going]);

  function toggle(id: string) {
    setGoing((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  }

  return (
    <div>
      {shows.map((s) => (
        <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "16px 0", borderTop: "1px solid #ffffff22", alignItems: "center" }}>
          <div>
            <strong style={{ fontSize: "1.3rem" }}>{s.city}</strong>
            <div style={{ color: "#ffffffaa" }}>{s.venue} · {s.date} · {s.status}</div>
          </div>
          {s.status === "Sold out" ? (
            <span className="kicker" style={{ color: "#e23a3a" }}>Gone</span>
          ) : (
            <button
              type="button"
              className={going.includes(s.id) ? "chip-on" : "chip"}
              aria-pressed={going.includes(s.id)}
              onClick={() => toggle(s.id)}
            >
              {going.includes(s.id) ? "✓ Going" : "I'm going"}
            </button>
          )}
        </div>
      ))}
      {going.length ? <p className="kicker" style={{ marginTop: 12, color: "#e23a3a" }}>{going.length} night{going.length === 1 ? "" : "s"} claimed. See you down front.</p> : null}
    </div>
  );
}
