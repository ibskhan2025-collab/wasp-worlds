"use client";

import { FormEvent, useEffect, useState } from "react";
import { casa } from "@/data/casa";
import { loadJson, saveJson } from "@/lib/storage";
import { track } from "@/lib/track";

type Booking = { id: string; date: string; time: string; party: number };

const BOOK_KEY = "wasp-v11-casa-bookings";

export default function ReservationsPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Hydrate persisted bookings after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookings(loadJson<Booking[]>(BOOK_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(BOOK_KEY, bookings);
  }, [bookings]);

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
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        party: Number(data.party),
        notes: data.notes,
      };
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fail");
      track("reservation_submitted", { source: "casa" });
      setBookings((b) => [
        { id: `b${Date.now()}`, date: String(data.date), time: String(data.time), party: Number(data.party) },
        ...b,
      ].slice(0, 20));
      setStatus("ok");
      setMessage("Held. We'll confirm by email. This is a study restaurant — treat it as a working reservation, not a table in the real valley.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Could not hold the table. Try again.");
    }
  }

  return (
    <div style={{ padding: "32px 22px 80px", maxWidth: 720, margin: "0 auto" }}>
      <p className="kicker">A night</p>
      <h1 style={{ fontFamily: "var(--font-lux)", fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 500 }}>
        Reservations
      </h1>
      <p style={{ fontSize: "1.15rem", maxWidth: "38ch" }}>
        We sit 36. If you are late we will still feed you, but the fire does not wait politely.
      </p>
      <form onSubmit={onSubmit} style={{ marginTop: 32 }}>
        <label className="field">
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <div className="grid-2">
          <label className="field">
            <span>Date</span>
            <input name="date" type="date" required />
          </label>
          <label className="field">
            <span>Time</span>
            <select name="time" required defaultValue="19:00">
              {casa.times.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>Party</span>
          <select name="party" required defaultValue="2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Notes</span>
          <textarea name="notes" placeholder="Allergies, celebration, a dislike of coriander." />
        </label>
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Holding…" : "Hold the table"}
        </button>
        {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}
      </form>
      {bookings.length ? (
        <div style={{ marginTop: 40 }}>
          <p className="kicker">My tables (this browser)</p>
          {bookings.map((b) => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
              <span>{b.date} · {b.time} · party of {b.party}</span>
              <button type="button" className="ghost" onClick={() => setBookings((list) => list.filter((x) => x.id !== b.id))}>
                Release
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
