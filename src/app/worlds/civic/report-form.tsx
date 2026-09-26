"use client";

import { useEffect, useState } from "react";
import { loadJson, saveJson } from "@/lib/storage";

type Report = { id: string; what: string; where: string; when: string };

const REPORT_KEY = "wasp-v11-civic-reports";

export function ReportForm() {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [msg, setMsg] = useState("");

  // Hydrate persisted reports after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReports(loadJson<Report[]>(REPORT_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(REPORT_KEY, reports);
  }, [reports]);

  function send() {
    if (what.trim().length < 8) {
      setMsg("Give us one full sentence — what, and where it hurts.");
      return;
    }
    if (where.trim().length < 3) {
      setMsg("A street or landmark, so the crew can find it.");
      return;
    }
    setReports((r) => [
      { id: `r${Date.now()}`, what: what.trim().slice(0, 300), where: where.trim().slice(0, 120), when: new Date().toLocaleDateString() },
      ...r,
    ].slice(0, 20));
    setWhat("");
    setWhere("");
    setMsg("Logged. Reference saved in this browser — the crew responds within 48 hours in the real world.");
  }

  return (
    <section style={{ padding: "8px 20px 80px", maxWidth: 640 }} aria-label="Report a street issue">
      <h2 style={{ fontSize: "2rem", letterSpacing: "-0.03em" }}>Something broken on your street?</h2>
      <label className="field"><span>What&apos;s wrong</span><textarea value={what} onChange={(e) => setWhat(e.target.value)} placeholder="The streetlight outside number 12 has been out for a week." /></label>
      <label className="field"><span>Where</span><input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Street or landmark" /></label>
      <button className="btn" type="button" onClick={send}>Log the issue</button>
      {msg ? <p style={{ marginTop: 12 }}>{msg}</p> : null}
      {reports.length ? (
        <div style={{ marginTop: 24 }}>
          <p className="kicker">Your reports (this browser)</p>
          {reports.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: "1px solid var(--line)" }}>
              <span><strong>{r.what}</strong><br /><span className="kicker">{r.where} · {r.when}</span></span>
              <button type="button" className="ghost" onClick={() => setReports((list) => list.filter((x) => x.id !== r.id))}>Withdraw</button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
