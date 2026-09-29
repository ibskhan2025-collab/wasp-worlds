"use client";

import { useEffect, useState } from "react";
import { stillCollections } from "@/data/still";
import { loadJson, saveJson } from "@/lib/storage";
import { Consent } from "@/components/consent";
import { Honeypot, hpValue } from "@/components/honeypot";

type Enquiry = { id: string; alt: string; size: string };

const ENQ_KEY = "wasp-v11-still-enquiries";

export function PrintForm() {
  const [alt, setAlt] = useState("");
  const [size, setSize] = useState("50 × 70 cm");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<Enquiry[]>([]);

  // Hydrate persisted enquiries after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList(loadJson<Enquiry[]>(ENQ_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(ENQ_KEY, list);
  }, [list]);

  const options = stillCollections.flatMap((c) => c.images.map((i) => i.alt));

  async function send() {
    if (!alt || !name.trim() || !email.includes("@")) {
      setMsg("Pick a picture, plus your name and a valid email.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website: hpValue(), name, email, brief: `STILL print enquiry: "${alt}" at ${size}.`, source: "still-prints" }),
    });
    if (res.ok) {
      setList((l) => [{ id: `s${Date.now()}`, alt, size }, ...l].slice(0, 10));
      setMsg("Noted. The studio confirms availability. Editions sell out.");
    } else setMsg("Could not send. Try again.");
  }

  return (
    <div style={{ marginTop: 28 }}>
      <p className="kicker">Enquire for a wall</p>
      <label className="field"><span>Picture (describe it, or pick)</span>
        <input value={alt} onChange={(e) => setAlt(e.target.value)} list="still-pics" placeholder="e.g. Columned walkway" />
        <datalist id="still-pics">
          {options.map((o) => <option key={o} value={o} />)}
        </datalist>
      </label>
      <label className="field"><span>Size</span>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option>30 × 40 cm</option>
          <option>50 × 70 cm</option>
          <option>70 × 100 cm</option>
        </select>
      </label>
      <div className="grid-2">
        <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
      </div>
      <button className="btn" type="button" onClick={send}>Enquire</button>
      <Honeypot />
      <Consent />
      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}
      {list.length ? (
        <div style={{ marginTop: 24 }}>
          <p className="kicker">Enquiries (this browser)</p>
          {list.map((q) => (
            <div key={q.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: "1px solid var(--line)" }}>
              <span>{q.alt} · {q.size}</span>
              <button type="button" className="ghost" onClick={() => setList((l) => l.filter((x) => x.id !== q.id))}>Withdraw</button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
