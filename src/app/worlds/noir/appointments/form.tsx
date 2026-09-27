"use client";

import { useEffect, useState } from "react";
import { loadJson, saveJson } from "@/lib/storage";
import { Consent } from "@/components/consent";
import { Honeypot, hpValue } from "@/components/honeypot";

type Appt = { id: string; date: string; time: string; reason: string };

const APPT_KEY = "wasp-v11-noir-appts";
const TIMES = ["11:00", "12:00", "14:00", "15:30", "17:00"];

export function AppointmentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [reason, setReason] = useState("Fitting");
  const [msg, setMsg] = useState("");
  const [appts, setAppts] = useState<Appt[]>([]);

  // Hydrate persisted appointments after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppts(loadJson<Appt[]>(APPT_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(APPT_KEY, appts);
  }, [appts]);

  async function send() {
    if (!name.trim() || !email.includes("@") || !date) {
      setMsg("Name, a valid email, and a day — the house confirms the hour.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website: hpValue(), name, email, brief: `NOIR appointment: ${reason} on ${date} at ${time}.`, source: "noir-appointments" }),
    });
    if (res.ok) {
      setAppts((a) => [{ id: `n${Date.now()}`, date, time, reason }, ...a].slice(0, 10));
      setMsg("Requested. The house confirms by email within a day.");
    } else setMsg("Could not send. Try again, or walk in.");
  }

  return (
    <div style={{ marginTop: 28 }}>
      <div className="grid-2">
        <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
        <label className="field"><span>Day</span><input value={date} onChange={(e) => setDate(e.target.value)} type="date" /></label>
        <label className="field"><span>Hour</span>
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            {TIMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <label className="field"><span>Occasion</span>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option>Fitting</option>
          <option>Wardrobe review</option>
          <option>Occasion dressing</option>
          <option>Press</option>
        </select>
      </label>
      <button className="btn" type="button" onClick={send}>Request appointment</button>
      <Honeypot />
      <Consent />
      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}
      {appts.length ? (
        <div style={{ marginTop: 32 }}>
          <p className="kicker">Requested (this browser)</p>
          {appts.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              <span>{a.reason} · {a.date} · {a.time}</span>
              <button type="button" className="ghost" onClick={() => setAppts((l) => l.filter((x) => x.id !== a.id))}>Withdraw</button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
