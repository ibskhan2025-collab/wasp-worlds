"use client";

import { useEffect, useMemo, useState } from "react";
import { contentIdeas, PIPELINE, seedProjects, type OsProject, type PipelineStatus } from "@/data/os";
import { sops } from "@/data/studio";
import { loadJson, OS_KEY, saveJson } from "@/lib/storage";

const VIEWS = ["Leads", "Pipeline", "Record", "SOPs", "Content", "Sales", "Documents", "Settings"] as const;
type View = (typeof VIEWS)[number];

export default function OsPage() {
  const [view, setView] = useState<View>("Pipeline");
  const [projects, setProjects] = useState<OsProject[]>(seedProjects);
  const [active, setActive] = useState("os1");
  const [sopQ, setSopQ] = useState("");
  const [ideas, setIdeas] = useState(contentIdeas);
  const [idea, setIdea] = useState("");
  const [note, setNote] = useState("");

  // Hydrate persisted OS state after mount (avoids SSR mismatch).
  useEffect(() => {
    const saved = loadJson(OS_KEY, { projects: seedProjects, ideas: contentIdeas });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(saved.projects);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdeas(saved.ideas);
  }, []);
  useEffect(() => {
    saveJson(OS_KEY, { projects, ideas });
  }, [projects, ideas]);

  const rec = projects.find((p) => p.id === active) ?? projects[0];
  const sopsF = sops.filter((s) => `${s.title} ${s.group}`.toLowerCase().includes(sopQ.toLowerCase()));

  function move(id: string, status: PipelineStatus) {
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function patch(partial: Partial<OsProject>) {
    setProjects((ps) => ps.map((p) => (p.id === rec.id ? { ...p, ...partial } : p)));
  }

  const offer = useMemo(() => {
    if (!rec) return "";
    return `OFFER
Client: ${rec.client}
Project: ${rec.project}
Scope: ${rec.scope}
Timeline: ${rec.timeline}
Budget band: ${rec.budget}
Status: ${rec.status}

This is a working draft inside WASP OS, not a contract.`;
  }, [rec]);

  return (
    <div className="os-page" style={{ padding: 0 }}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)" }}>
        <p className="kicker">How the studio works · live demonstration</p>
        <h1 className="display" style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}>The studio as a loop.</h1>
        <p style={{ maxWidth: "60ch", fontSize: "1.1rem" }}>
          Why should you care? Because this is the actual machinery your project would run on:
          pipeline, records, SOPs, content, sales, documents — the same loop, with your project in it.
          Click around. It&apos;s all operable, and it all persists in this browser.
        </p>
      </div>
      <div className="os-shell">
        <aside className="os-side">
          {VIEWS.map((v) => (
            <button key={v} className={view === v ? "on" : ""} type="button" onClick={() => setView(v)}>
              {v}
            </button>
          ))}
        </aside>
        <main style={{ padding: 18 }}>
          {view === "Leads" || view === "Pipeline" ? (
            <div className="kanban">
              {PIPELINE.map((col) => (
                <div key={col} className="kanban-col">
                  <div className="kicker">{col}</div>
                  {projects.filter((p) => p.status === col).map((p) => (
                    <button key={p.id} className="kanban-card" type="button" onClick={() => { setActive(p.id); setView("Record"); }} style={{ width: "100%", textAlign: "left" }}>
                      <strong>{p.project}</strong>
                      <div className="kicker">{p.company}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : null}

          {view === "Record" && rec ? (
            <div className="grid-2">
              <div>
                <h2>{rec.project}</h2>
                <p>{rec.client} · {rec.company}</p>
                <label className="field"><span>Status</span>
                  <select value={rec.status} onChange={(e) => move(rec.id, e.target.value as PipelineStatus)}>
                    {PIPELINE.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label className="field"><span>Budget band</span><input value={rec.budget} onChange={(e) => patch({ budget: e.target.value })} /></label>
                <label className="field"><span>Scope</span><textarea value={rec.scope} onChange={(e) => patch({ scope: e.target.value })} /></label>
                <label className="field"><span>Timeline</span><input value={rec.timeline} onChange={(e) => patch({ timeline: e.target.value })} /></label>
                <label className="field"><span>Payment</span>
                  <select value={rec.payment} onChange={(e) => patch({ payment: e.target.value as OsProject["payment"] })}>
                    <option>Unpaid</option><option>Deposit</option><option>Scheduled</option><option>Paid</option>
                  </select>
                </label>
                <label className="field"><span>Onboarding</span>
                  <select value={rec.onboarding} onChange={(e) => patch({ onboarding: e.target.value as OsProject["onboarding"] })}>
                    <option>Not started</option><option>In progress</option><option>Complete</option>
                  </select>
                </label>
                <label className="field"><span>Notes</span><textarea value={rec.notes} onChange={(e) => patch({ notes: e.target.value })} /></label>
              </div>
              <div>
                <p className="kicker">Tasks</p>
                {rec.tasks.map((t) => (
                  <label key={t.id} style={{ display: "block", margin: "8px 0" }}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) =>
                        patch({ tasks: rec.tasks.map((x) => (x.id === t.id ? { ...x, done: e.target.checked } : x)) })
                      }
                    />{" "}
                    {t.title}
                  </label>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="New task" />
                  <button className="ghost" type="button" onClick={() => {
                    if (!note) return;
                    patch({ tasks: [...rec.tasks, { id: `t${Date.now()}`, title: note, done: false }] });
                    setNote("");
                  }}>Add</button>
                </div>
              </div>
            </div>
          ) : null}

          {view === "SOPs" ? (
            <div>
              <input value={sopQ} onChange={(e) => setSopQ(e.target.value)} placeholder="Search SOPs" aria-label="Search SOPs" style={{ width: "100%", background: "transparent", border: "1px solid var(--line)", padding: 10, marginBottom: 16 }} />
              {sopsF.map((s) => (
                <details key={s.id} className="panel" style={{ marginBottom: 10 }}>
                  <summary>{s.title} · {s.group} · {s.minutes}m</summary>
                  <ol>{s.steps.map((st) => <li key={st}>{st}</li>)}</ol>
                </details>
              ))}
            </div>
          ) : null}

          {view === "Content" ? (
            <div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Capture an idea" style={{ flex: 1, background: "transparent", border: "1px solid var(--line)", padding: 10 }} />
                <button className="btn" type="button" onClick={() => {
                  if (!idea) return;
                  setIdeas([{ id: `ci${Date.now()}`, title: idea, pillar: "Build in public", status: "Idea" }, ...ideas]);
                  setIdea("");
                }}>Add</button>
              </div>
              {ideas.map((i) => (
                <div key={i.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                  <span>{i.title}</span>
                  <span className="kicker">{i.pillar}</span>
                  <select value={i.status} onChange={(e) => setIdeas(ideas.map((x) => x.id === i.id ? { ...x, status: e.target.value } : x))}>
                    <option>Idea</option><option>Draft</option><option>Published</option>
                  </select>
                </div>
              ))}
            </div>
          ) : null}

          {view === "Sales" ? (
            <div className="grid-2">
              <div className="panel">
                <p className="kicker">Consultation checklist</p>
                {["What happens if this fails", "Who can say yes", "Budget spoken out loud", "Timeline with a real date", "Existing site's actual job"].map((x) => (
                  <label key={x} style={{ display: "block" }}><input type="checkbox" /> {x}</label>
                ))}
              </div>
              <pre className="panel" style={{ whiteSpace: "pre-wrap" }}>{offer}</pre>
            </div>
          ) : null}

          {view === "Documents" ? (
            <div className="grid-2">
              {[
                ["Welcome package", "How we work, who to write, where files live."],
                ["Proposal", "Problem, scope, sequence, cost. Draft in Sales."],
                ["Agreement", "Placeholder — not legal advice, not a contract."],
                ["Invoice", "Placeholder for a payment record."],
                ["Onboarding questionnaire", "Access, voice, the ugly spreadsheet."],
                ["Content checklist", "Every page's job, marked red if missing."],
              ].map(([t, d]) => (
                <div key={t} className="panel">
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          ) : null}

          {view === "Settings" ? (
            <div className="panel">
              <p>Demonstration OS. Pipeline state lives in this browser. Sample records are labelled as not real clients.</p>
              <button className="btn ghost" type="button" onClick={() => { setProjects(seedProjects); setIdeas(contentIdeas); }}>
                Reset demo data
              </button>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
