"use client";

import { useState } from "react";
import { Consent } from "@/components/consent";
import { Honeypot, hpValue } from "@/components/honeypot";

export function CommissionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [kind, setKind] = useState("Scroll campaign");
  const [msg, setMsg] = useState("");

  async function send() {
    if (!name.trim() || !email.includes("@") || !date) {
      setMsg("Name, a valid email, and the date — dates decide everything here.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website: hpValue(), name, email, brief: `MOTION commission: ${kind}, needed by ${date}.`, source: "motion-commissions" }),
    });
    if (res.ok) setMsg("Logged. If the date is possible, you hear back within two days.");
    else setMsg("Could not send. Try again.");
  }

  return (
    <div style={{ marginTop: 24, fontFamily: "var(--font-sans)" }}>
      <div className="grid-2">
        <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
        <label className="field"><span>Launch date</span><input value={date} onChange={(e) => setDate(e.target.value)} type="date" /></label>
        <label className="field"><span>Kind</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option>Scroll campaign</option>
            <option>Launch film</option>
            <option>Event visuals</option>
            <option>Interface motion</option>
          </select>
        </label>
      </div>
      <button className="btn" type="button" onClick={send} style={{ background: "#fff", color: "#000", borderColor: "#fff" }}>Check the date</button>
      <Honeypot />
      <Consent />
      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}
    </div>
  );
}
