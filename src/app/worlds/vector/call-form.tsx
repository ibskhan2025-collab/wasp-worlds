"use client";

import { useState } from "react";
import { track } from "@/lib/track";

export function CallForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState("");

  async function send() {
    if (!name.trim() || !email.includes("@")) {
      setDone("A name and a valid email. A partner replies — a named one.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, brief: "VECTOR: book a call with a partner.", source: "vector" }),
    });
    if (res.ok) {
      setDone("Booked in spirit. A partner replies within two working days with a calendar.");
      track("inquiry_submitted", { source: "vector" });
    }
    else setDone("Could not send. Try again.");
  }

  return (
    <div className="panel" style={{ borderColor: "#ffffff2c", background: "#101410" }}>
      <p className="kicker" style={{ color: "#3ddc84" }}>Book a call</p>
      <div className="grid-2">
        <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
      </div>
      <button className="btn" type="button" onClick={send}>Talk to a partner</button>
      {done ? <p style={{ marginTop: 12 }}>{done}</p> : null}
    </div>
  );
}
