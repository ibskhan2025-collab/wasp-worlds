"use client";

import { useEffect, useState } from "react";
import { loadJson, saveJson } from "@/lib/storage";
import { Consent } from "@/components/consent";
import { Honeypot, hpValue } from "@/components/honeypot";

const SUB_KEY = "wasp-v11-archive-sub";

export function LettersForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [subbed, setSubbed] = useState<string | null>(null);

  // Hydrate persisted subscription after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubbed(loadJson<string | null>(SUB_KEY, null));
  }, []);

  async function subscribe() {
    if (!email.includes("@")) {
      setMsg("A valid email — the letters have to go somewhere.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website: hpValue(), name: name.trim() || "Reader", email, brief: "ARCHIVE letters subscription.", source: "archive-letters" }),
    });
    if (res.ok) {
      saveJson(SUB_KEY, email);
      setSubbed(email);
      setMsg("In. First letter with the next issue.");
    } else setMsg("Could not subscribe. Try again.");
  }

  function unsubscribe() {
    saveJson<string | null>(SUB_KEY, null);
    setSubbed(null);
    setMsg("Out. No hard feelings, no exit survey.");
  }

  if (subbed) {
    return (
      <div className="panel" style={{ marginTop: 24 }}>
        <p>Subscribed as <strong>{subbed}</strong>.</p>
        <button className="btn ghost" type="button" onClick={unsubscribe}>Unsubscribe</button>
        {msg ? <p style={{ marginTop: 8 }}>{msg}</p> : null}
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <div className="grid-2">
        <label className="field"><span>Name (optional)</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
      </div>
      <button className="btn" type="button" onClick={subscribe}>Subscribe</button>
      <Honeypot />
      <Consent />
      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}
    </div>
  );
}
