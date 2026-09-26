"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useWasp } from "@/context/wasp-context";
import { track } from "@/lib/track";
import type { BuilderState } from "@/lib/types";

const TYPES = ["Website", "Ecommerce", "Product", "Redesign", "Campaign", "Experience"];
const GOALS = ["Sell", "Book", "Launch", "Explain", "Trust", "Leads", "Replace old site"];
const AMBITIONS = ["Sharp + fast", "Standard", "Flagship"];
const BUDGETS = ["< $2k", "$2–5k", "$5–15k", "$15k+", "Not sure yet"];

const TYPE_WORLDS: Record<string, { href: string; name: string }[]> = {
  Website: [{ href: "/worlds/casa", name: "CASA" }, { href: "/worlds/archive", name: "ARCHIVE" }],
  Ecommerce: [{ href: "/worlds/noir", name: "NOIR" }, { href: "/worlds/objects", name: "OBJECTS" }],
  Product: [{ href: "/worlds/orbit", name: "ORBIT" }, { href: "/worlds/forge", name: "FORGE" }],
  Redesign: [{ href: "/worlds/vector", name: "VECTOR" }, { href: "/worlds/casa", name: "CASA" }],
  Campaign: [{ href: "/worlds/motion", name: "MOTION" }, { href: "/worlds/pulse", name: "PULSE" }],
  Experience: [{ href: "/worlds/signal", name: "SIGNAL" }, { href: "/worlds/void", name: "VOID" }],
};

const TYPE_CAPS: Record<string, string> = {
  Website: "Website design, development, editorial system",
  Ecommerce: "Ecommerce, product storytelling, conversion",
  Product: "Product / UI, creative technology, web development",
  Redesign: "Audit, IA rewrite, visual reset, migration",
  Campaign: "Interactive campaign, motion, launch sequence",
  Experience: "Creative technology, interactive build, experiment",
};

function dossier(b: BuilderState) {
  return `PROJECT DOSSIER — WASP

MAKING: ${b.type || "—"}
GOAL: ${b.goal || "—"}
AUDIENCE: ${b.audience || "—"}
EXISTS: ${b.existing || "—"}
AMBITION: ${b.ambition || "—"}
BUDGET: ${b.budget || "—"}
TIMELINE: ${b.timeline || "—"}

FUNCTIONALITY (inferred): ${infer(b)}
CAPABILITIES: ${TYPE_CAPS[b.type] ?? "To be scoped on the call"}`;
}

function infer(b: BuilderState) {
  const t = `${b.type} ${b.goal} ${b.existing}`.toLowerCase();
  const bits = [];
  if (/ecommerce|shop|store|szzle|sell/.test(t)) bits.push("catalogue", "product pages", "cart", "checkout");
  if (/book|reserv/.test(t)) bits.push("booking flow", "availability");
  if (/product|saas|dashboard|app/.test(t)) bits.push("product UI", "states", "settings");
  if (/campaign|launch/.test(t)) bits.push("scroll sequence", "announcement mechanics");
  if (!bits.length) bits.push("custom pages", "enquiry");
  return bits.join(", ");
}

export default function StartPage() {
  const wasp = useWasp();
  const b = wasp.builder;
  const [sent, setSent] = useState("");
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => dossier(b), [b]);
  const step = Math.min(b.step, 6);
  const worlds = TYPE_WORLDS[b.type] ?? [];

  function setField(key: keyof BuilderState, value: string | number) {
    wasp.patch({ builder: { ...b, [key]: value } });
  }
  function next() {
    if (step === 5) track("brief_started", {});
    setField("step", step + 1);
  }

  async function send() {
    if (!b.email.includes("@") || !b.name) {
      setSent("Name and email so this has somewhere to go.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: b.name,
        email: b.email,
        company: b.company,
        making: b.type,
        needs: b.goal,
        idea: `Audience: ${b.audience}. Exists: ${b.existing}`,
        budget: `${b.budget} / ${b.timeline}`,
        matters: b.ambition,
        brief: text,
        source: "builder",
      }),
    });
    setSent(res.ok
      ? "Received and stored. We reply within one working day — see below for exactly what happens next."
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

  function chips(options: string[], value: string, key: keyof BuilderState) {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((o) => (
          <button key={o} type="button" className={value === o ? "chip-on" : "chip"} onClick={() => setField(key, o)}>
            {o}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="studio-page">
      <p className="kicker">Project builder</p>
      <h1 className="display">Tell us what to make.</h1>
      <p className="lede">Six questions. About four minutes. A dossier you can keep either way.</p>
      <div className="grid-2" style={{ marginTop: 28 }}>
        <div>
          {step < 6 ? (
            <>
              <p className="kicker">0{step + 1} / 06</p>
              {step === 0 ? (<><h2 style={q}>What are we making?</h2>{chips(TYPES, b.type, "type")}</>) : null}
              {step === 1 ? (<><h2 style={q}>What is it trying to accomplish?</h2>{chips(GOALS, b.goal, "goal")}</>) : null}
              {step === 2 ? (<><h2 style={q}>Who is it for?</h2><textarea value={b.audience} onChange={(e) => setField("audience", e.target.value)} placeholder="Be specific: who, and what do they want at 11pm?" style={ta} /></>) : null}
              {step === 3 ? (<><h2 style={q}>What exists already?</h2><textarea value={b.existing} onChange={(e) => setField("existing", e.target.value)} placeholder="A site, a brand, a spreadsheet, nothing — all fine answers." style={ta} /></>) : null}
              {step === 4 ? (<><h2 style={q}>What level of ambition?</h2>{chips(AMBITIONS, b.ambition, "ambition")}</>) : null}
              {step === 5 ? (<>
                <h2 style={q}>Budget and timeline?</h2>
                {chips(BUDGETS, b.budget, "budget")}
                <textarea value={b.timeline} onChange={(e) => setField("timeline", e.target.value)} placeholder="Any hard date? Launch, season, event?" style={{ ...ta, minHeight: 70, marginTop: 12 }} />
              </>) : null}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {step > 0 ? (
                  <button className="btn ghost" type="button" onClick={() => setField("step", step - 1)}>
                    Back
                  </button>
                ) : null}
                <button className="btn" type="button" onClick={next}>
                  {step === 5 ? "Build the dossier" : "Next"}
                </button>
              </div>
              <p className="kicker" style={{ marginTop: 12 }}>
                {["type", "goal", "audience", "existing", "ambition", "budget"][step]} · answered: {
                  [b.type, b.goal, b.audience, b.existing, b.ambition, b.budget || b.timeline].filter(Boolean).length
                }/6
              </p>
            </>
          ) : (
            <>
              <h2>Send this to WASP</h2>
              <label className="field"><span>Name</span><input value={b.name} onChange={(e) => setField("name", e.target.value)} /></label>
              <label className="field"><span>Email</span><input value={b.email} onChange={(e) => setField("email", e.target.value)} type="email" /></label>
              <label className="field"><span>Company</span><input value={b.company} onChange={(e) => setField("company", e.target.value)} /></label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn" type="button" onClick={send}>Send project to WASP</button>
                <button className="btn ghost" type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); }}>
                  {copied ? "Copied" : "Copy dossier"}
                </button>
                <button className="btn ghost" type="button" onClick={download}>Download</button>
                <button className="btn ghost" type="button" onClick={() => setField("step", 0)}>Edit answers</button>
              </div>
              {sent ? <p style={{ marginTop: 12 }}>{sent}</p> : null}
              <hr className="rule" />
              <p className="kicker">What happens next</p>
              <p><strong>1.</strong> We reply within one working day — even if it&apos;s a no.</p>
              <p><strong>2.</strong> A 30-minute call: what happens if this fails, who can say yes.</p>
              <p><strong>3.</strong> A written proposal: scope as verbs, price as a sequence. You can argue with it.</p>
              <p style={{ marginTop: 16 }}>
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
        <div>
          <pre className="panel" style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: 13 }}>{text}</pre>
          {worlds.length && step >= 6 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <span className="kicker">See it working:</span>
              {worlds.map((w) => <Link key={w.href} className="ghost" href={w.href}>{w.name} →</Link>)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const q = { fontFamily: "var(--font-display)", fontSize: "2rem" } as const;
const ta = { width: "100%", minHeight: 140, background: "transparent", border: "1px solid var(--line)", padding: 12 } as const;
