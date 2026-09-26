"use client";

import { useMemo, useState } from "react";
import { useWasp } from "@/context/wasp-context";
import { track } from "@/lib/track";
import type { BuilderState } from "@/lib/types";

const STEPS = [
  { key: "making" as const, n: "01", q: "WHAT ARE WE MAKING?" },
  { key: "needs" as const, n: "02", q: "WHAT DOES IT NEED TO DO?" },
  { key: "feel" as const, n: "03", q: "WHAT SHOULD IT FEEL LIKE?" },
  { key: "idea" as const, n: "04", q: "WHAT'S THE IDEA?" },
  { key: "budget" as const, n: "05", q: "WHAT'S THE BUDGET?" },
  { key: "matters" as const, n: "06", q: "WHAT MATTERS MOST?" },
];

function dossier(b: BuilderState) {
  return `PROJECT DOSSIER

PROJECT:
${b.making || "—"}

GOAL:
${b.needs || "—"}

DIRECTION:
${b.feel || "—"}

THE IDEA:
${b.idea || "—"}

WHAT MATTERS:
${b.matters || "—"}

BUDGET:
${b.budget || "—"}

FUNCTIONALITY (inferred):
${infer(b)}

MOTION:
${/cinema|slow|film/i.test(b.feel) ? "Cinematic" : /play|weird|glitch/i.test(b.feel) ? "Alive" : "Restrained"}`;
}

function infer(b: BuilderState) {
  const t = `${b.making} ${b.needs}`.toLowerCase();
  const bits = [];
  if (/shop|store|cart|product/.test(t)) bits.push("ecommerce", "product pages", "cart", "checkout");
  if (/book|reserv/.test(t)) bits.push("booking");
  if (/app|dash|saas|product ui/.test(t)) bits.push("product UI", "states", "settings");
  if (/cms|edit|blog|journal/.test(t)) bits.push("CMS");
  if (!bits.length) bits.push("custom pages", "enquiry");
  return bits.join(", ");
}

export default function StartPage() {
  const wasp = useWasp();
  const b = wasp.builder;
  const [sent, setSent] = useState("");
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => dossier(b), [b]);
  const step = Math.min(b.step, STEPS.length);
  const current = STEPS[Math.min(step, STEPS.length - 1)];

  function setField(key: keyof BuilderState, value: string | number) {
    wasp.patch({ builder: { ...b, [key]: value } });
  }

  async function send() {
    if (!b.email.includes("@") || !b.name) {
      setSent("Name and email so this has somewhere to go.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, brief: text, source: "builder" }),
    });
    setSent(res.ok
      ? "Received. This is stored on WASP's side. If email/CRM is not connected yet, you still have a copyable brief."
      : "Could not store. Copy the brief and write to us.");
    if (res.ok) track("inquiry_submitted", { source: "builder" });
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "wasp-brief.txt";
    a.click();
  }

  return (
    <div className="studio-page">
      <p className="kicker">Project builder</p>
      <h1 className="display">Tell us what to make.</h1>
      <div className="grid-2" style={{ marginTop: 28 }}>
        <div>
          {step < STEPS.length ? (
            <>
              <p className="kicker">{current.n} / 06</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>{current.q}</h2>
              <textarea
                value={String(b[current.key])}
                onChange={(e) => setField(current.key, e.target.value)}
                style={{ width: "100%", minHeight: 140, background: "transparent", border: "1px solid var(--line)", padding: 12 }}
              />
              {current.key === "feel" ? (
                <p style={{ marginTop: 10 }}>
                  <span className="kicker">Your exhibition vibe: {wasp.feel} · {wasp.motion} motion </span>
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => setField("feel", `${wasp.feel} feel, ${wasp.motion} motion`)}
                  >
                    Use it
                  </button>
                </p>
              ) : null}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {step > 0 ? (
                  <button className="btn ghost" type="button" onClick={() => setField("step", step - 1)}>
                    Back
                  </button>
                ) : null}
                <button className="btn" type="button" onClick={() => {
                  if (step === STEPS.length - 1) track("brief_started", {});
                  setField("step", step + 1);
                }}>
                  {step === STEPS.length - 1 ? "Build the brief" : "Next"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Send this to WASP</h2>
              <label className="field"><span>Name</span><input value={b.name} onChange={(e) => setField("name", e.target.value)} /></label>
              <label className="field"><span>Email</span><input value={b.email} onChange={(e) => setField("email", e.target.value)} type="email" /></label>
              <label className="field"><span>Company</span><input value={b.company} onChange={(e) => setField("company", e.target.value)} /></label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn" type="button" onClick={send}>Send this to WASP</button>
                <button className="btn ghost" type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); }}>
                  {copied ? "Copied" : "Copy brief"}
                </button>
                <button className="btn ghost" type="button" onClick={download}>Download</button>
                <button className="btn ghost" type="button" onClick={() => setField("step", 0)}>Edit answers</button>
              </div>
              {sent ? <p style={{ marginTop: 12 }}>{sent}</p> : null}
              <p style={{ marginTop: 20 }}>
                Prefer email? <a href="mailto:hello@wasp.studio">hello@wasp.studio</a>{" "}
                <button
                  className="ghost"
                  type="button"
                  onClick={() => { navigator.clipboard.writeText("hello@wasp.studio"); setCopied(true); }}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </p>
            </>
          )}
        </div>
        <pre className="panel" style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: 13 }}>{text}</pre>
      </div>
    </div>
  );
}
