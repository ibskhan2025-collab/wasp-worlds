"use client";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Field, isEmail, post } from "@/rb15l/ui";

type Guide = { id: string; title: string; summary: string; time: string; steps: string[]; list: string[]; sources: [string, string][] };
const GUIDES: Guide[] = [
  { id: "bins", title: "Report a missed bin collection", summary: "Tell us if your bin was put out on time but not emptied.", time: "3 minutes", steps: ["Check your collection day on the calendar and that the bin was out by 6am.", "Leave the bin out. We will return within two working days.", "Report it below if it has not been emptied after that."], list: ["Bin was out before 6am", "Bin is our standard issue (not a private bin)", "Two working days have passed", "I have my address and postcode ready"], sources: [["Waste Collection Charter, section 4 (fictional)", "HBC-WCC-04"], ["Missed Collections Policy 2025 (fictional)", "HBC-POL-118"]] },
  { id: "parking", title: "Apply for a residents' parking permit", summary: "Permits are for one vehicle per adult at an address in a controlled zone.", time: "10 minutes", steps: ["Check that your street is in a controlled parking zone.", "Gather proof of address and your vehicle registration document (V5C).", "Apply and pay the annual fee. Most permits arrive within 10 days."], list: ["I live in a controlled parking zone", "I have proof of address dated in the last 3 months", "I have my V5C logbook", "The vehicle is registered to my address"], sources: [["Traffic Management Order 2022, Schedule 2 (fictional)", "HBC-TMO-22"], ["Parking Permit Fees 2026 (fictional)", "HBC-FEE-09"]] },
  { id: "ctax", title: "Query or pay your Council Tax", summary: "Set up a payment, change an instalment date or challenge your band.", time: "5 minutes", steps: ["Have your 10-digit account number from your bill.", "Choose to pay, set up Direct Debit or ask to change the date.", "If you think your band is wrong, ask for a review in writing."], list: ["I have my account number", "I know my payment date preference", "I have checked for discounts (single person, student)"], sources: [["Local Government Finance Act guidance (fictional)", "HBC-LGF-7"], ["Council Tax Band Review Procedure (fictional)", "HBC-CTR-2"]] },
  { id: "pothole", title: "Report a pothole or street fault", summary: "Potholes deeper than 40mm are fixed within five working days.", time: "2 minutes", steps: ["Note the exact location: street name and nearest house number.", "Describe the size and whether it is a hazard to cyclists or pedestrians.", "We will inspect within 24 hours if it is marked urgent."], list: ["I know the street and nearest house number", "I can describe how big it is", "Nobody is in immediate danger (if they are, call 999)"], sources: [["Highway Inspection Manual, chapter 3 (fictional)", "HBC-HIM-03"]] },
  { id: "housing", title: "Get help with housing", summary: "If you are at risk of losing your home, contact us as early as you can.", time: "15 minutes", steps: ["Gather your tenancy agreement and any notice you have received.", "Tell us your household and income. We will call within two working days.", "We will agree a plan with you, including emergency accommodation if needed."], list: ["I have my tenancy agreement or notice", "I have ID for everyone in my household", "I have a phone number where I can be reached"], sources: [["Housing Options Service Standard (fictional)", "HBC-HOS-1"], ["Homelessness Prevention Policy (fictional)", "HBC-HPP-5"]] },
  { id: "support", title: "Check eligibility for Council Tax Support", summary: "A reduction for people on low incomes. It is worth checking even if you work.", time: "8 minutes", steps: ["Total up your household income and savings.", "Use the eligibility check to see a likely reduction.", "Apply with proof of income. Support can be backdated up to 3 months."], list: ["I know my household income", "I know my savings total", "I have a recent payslip or benefits letter"], sources: [["Council Tax Support Scheme 2026 (fictional)", "HBC-CTS-26"]] },
];
const TREE: Record<string, { q: string; o: [string, string][] }> = {
  root: { q: "What do you need help with?", o: [["My bins or recycling", "bins"], ["Parking or roads", "roads"], ["Council Tax or money", "money"], ["Housing", "housing"]] },
  bins: { q: "What is the problem with your bin?", o: [["It was not emptied", "=bins"], ["I need a new or bigger bin", "=bins"]] },
  roads: { q: "What is it about?", o: [["I need a parking permit", "=parking"], ["There is a hole or fault in the road", "=pothole"]] },
  money: { q: "What would you like to do?", o: [["Pay or query my bill", "=ctax"], ["I am on a low income and need support", "=support"]] },
  housing: { q: "Which describes you best?", o: [["I may lose my home", "=housing"], ["I want to know about support with costs", "=support"]] },
};
const CATS = ["Missed bin", "Pothole or road fault", "Fly-tipping", "Street light out", "Graffiti", "Noise"];
const STAGES = ["Received", "Assigned to a team", "In progress", "Resolved"];
type Report = { ref: string; cat: string; where: string; at: number };
const stageOf = (r: Report) => { const s = (Date.now() - r.at) / 1000; return s > 90 ? 3 : s > 30 ? 2 : s > 10 ? 1 : 0; };

export default function Civic({ reality }: { reality: string }) {
  const hc = reality === "contrast", plain = reality === "plain";
  const [size, setSize] = usePersist("civic-size", 1);
  const [checks, setChecks] = usePersist<Record<string, number[]>>("civic-checks", {});
  const [reports, setReports] = usePersist<Report[]>("civic-reports", []);
  const [path, setPath] = useState<string[]>(["root"]); const [found, setFound] = useState<string | null>(null);
  const [gid, setGid] = useState<string | null>(null); const [, tick] = useState(0);
  const [f, setF] = useState({ cat: CATS[0], where: "", desc: "", name: "", email: "" }); const [fe, setFe] = useState<Record<string, string>>({}); const [made, setMade] = useState<Report | null>(null);
  const [tq, setTq] = useState(""); const [tr, setTr] = useState<Report | null | "none">(null);
  const [live, setLive] = useState(""); const qRef = useRef<HTMLElement>(null);
  useEffect(() => { const i = setInterval(() => tick((n) => n + 1), 5000); return () => clearInterval(i); }, []);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } qRef.current?.focus(); }, [path, found]);

  const guide = GUIDES.find((g) => g.id === gid);
  const node = TREE[path[path.length - 1]];
  const pick = (t: string) => { if (t.startsWith("=")) { setFound(t.slice(1)); setLive("Question answered. A guide has been found."); } else { setPath([...path, t]); setLive(""); } };
  const done = (g: Guide) => (checks[g.id] ?? []).length;
  const toggle = (g: Guide, i: number) => setChecks((c) => { const cur = c[g.id] ?? []; return { ...c, [g.id]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] }; });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {};
    if (f.where.trim().length < 5) x.where = "Tell us where it is: a street name and nearest house number."; if (f.desc.trim().length < 20) x.desc = "Please describe the problem in at least 20 characters."; if (f.name.trim().length < 2) x.name = "Enter your name."; if (!isEmail(f.email)) x.email = "Enter an email address in the format name@example.com.";
    setFe(x); if (Object.keys(x).length) { setLive(`There ${Object.keys(x).length === 1 ? "is 1 problem" : `are ${Object.keys(x).length} problems`} with the form.`); return; }
    const ref = "HBC-26-" + Math.random().toString(36).slice(2, 7).toUpperCase(); const r: Report = { ref, cat: f.cat, where: f.where, at: Date.now() };
    await post("/api/enquiries", { kind: "issue", name: f.name, email: f.email, payload: { ref, cat: f.cat, where: f.where, desc: f.desc, fictional: true } });
    setReports((p) => [r, ...p].slice(0, 10)); setMade(r); setLive(`Report sent. Your reference is ${ref}.`); setF({ cat: CATS[0], where: "", desc: "", name: "", email: "" });
  };
  const track = (e: React.FormEvent) => { e.preventDefault(); const r = reports.find((x) => x.ref.toLowerCase() === tq.trim().toLowerCase()); setTr(r ?? "none"); setLive(r ? `Report found. Status: ${STAGES[stageOf(r)]}.` : "No report found with that reference on this device."); };

  const T = hc ? { root: "bg-black text-[#ffeb3b]", card: "border-4 border-[#ffeb3b] p-5", btn: "bg-[#ffeb3b] text-black border-4 border-[#ffeb3b] font-bold", ghost: "border-4 border-[#ffeb3b]", link: "underline decoration-4", inp: "border-4 border-[#ffeb3b] text-[#ffeb3b]", muted: "text-[#ffeb3b]", acc: "#ffeb3b" }
    : plain ? { root: "bg-white text-black", card: "border-t border-black pt-4", btn: "border border-black px-3 py-2 underline", ghost: "border border-black", link: "underline", inp: "border border-black", muted: "text-black", acc: "#000" }
    : { root: "bg-white text-[#0b0c0c]", card: "border border-[#b1b4b6] bg-[#f8f8f8] p-5", btn: "bg-[#00703c] text-white shadow-[0_2px_0_#002d18] font-bold", ghost: "border-2 border-[#0b0c0c]", link: "text-[#1d70b8] underline", inp: "border-2 border-[#0b0c0c]", muted: "text-[#505a5f]", acc: "#1d70b8" };
  const bpad = hc ? "px-5 py-3" : "px-4 py-2.5";

  return (
    <div className={`${T.root} min-h-screen`} style={{ fontFamily: plain ? "ui-monospace, monospace" : "'Atkinson Hyperlegible', sans-serif", fontSize: `${size * (hc ? 1.3 : 1.06)}rem`, lineHeight: 1.55 }}>
      <a href="#civic-main" className="absolute left-2 top-2 z-10 -translate-y-20 bg-[#ffdd00] px-3 py-2 font-bold text-black focus:translate-y-0">Skip to main content</a>
      <header className={"px-4 py-3 sm:px-10 " + (plain ? "border-b border-black" : hc ? "border-b-4 border-[#ffeb3b]" : "bg-[#0b0c0c] text-white")}>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3"><p className="text-xl font-bold">Harrowgate Borough Council <span className="text-sm font-normal">(fictional)</span></p>
          <div className="flex items-center gap-2 text-sm" role="group" aria-label="Text size"><span>Text size</span>{([["A−", -0.1], ["A", 0], ["A+", 0.1]] as [string, number][]).map(([l, d]) => <button key={l} onClick={() => setSize(d === 0 ? 1 : Math.max(0.85, Math.min(1.5, size + d)))} aria-label={d === 0 ? "Reset text size" : d < 0 ? "Smaller text" : "Larger text"} className="min-h-10 min-w-10 border border-current px-2 font-bold">{l}</button>)}</div></div>
      </header>
      <p className={"px-4 py-2 text-center text-sm font-bold " + (plain ? "border-b border-black" : "bg-[#ffdd00] text-black")}>This is a fictional service built as a design study. It is not a real council and nothing here is official advice.</p>
      <div id="civic-main" className="mx-auto max-w-4xl px-4 py-8 sm:px-10">
        <p className="sr-only" role="status" aria-live="polite">{live}</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Council services, in plain language</h1>
        <p className={"mt-3 max-w-2xl " + T.muted}>Find the right guide in a few questions, work through a checklist, report a problem and follow it until it is fixed.</p>
        <nav aria-label="On this page" className="mt-5"><ul className="flex flex-wrap gap-x-5 gap-y-2"><li><a className={T.link} href="#finder">Find an answer</a></li><li><a className={T.link} href="#guides">Guides</a></li><li><a className={T.link} href="#report">Report a problem</a></li><li><a className={T.link} href="#track">Track a report</a></li></ul></nav>

        <section id="finder" className={"mt-12 " + T.card} aria-labelledby="f-h"><h2 id="f-h" className="text-3xl font-bold">Find an answer</h2>
          {found ? (<div className="mt-4"><h3 ref={qRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} className="text-xl font-bold outline-offset-4">We found a guide for you</h3><p className="mt-1"><button className={T.link} onClick={() => { setGid(found); document.getElementById("guides")?.scrollIntoView(); }}>{GUIDES.find((g) => g.id === found)!.title}</button></p><button onClick={() => { setPath(["root"]); setFound(null); }} className={`${T.ghost} ${bpad} mt-4`}>Start again</button></div>)
            : (<fieldset className="mt-4"><legend ref={qRef as React.RefObject<HTMLLegendElement>} tabIndex={-1} className="text-xl font-bold outline-offset-4">{node.q} <span className={"text-sm font-normal " + T.muted}>(question {path.length})</span></legend><div className="mt-3 grid gap-2">{node.o.map(([l, t]) => <button key={l} onClick={() => pick(t)} className={`${T.ghost} ${bpad} text-left`}>{l}</button>)}</div>{path.length > 1 && <button onClick={() => setPath(path.slice(0, -1))} className={T.link + " mt-4"}>← Back</button>}</fieldset>)}
        </section>

        <section id="guides" className="mt-12" aria-labelledby="g-h"><h2 id="g-h" className="text-3xl font-bold">Guides</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">{GUIDES.map((g) => <li key={g.id} className={T.card}><h3 className="text-xl font-bold"><button aria-expanded={gid === g.id} aria-controls={`g-${g.id}`} onClick={() => setGid(gid === g.id ? null : g.id)} className={T.link + " text-left"}>{g.title}</button></h3><p className={"mt-1 text-sm " + T.muted}>{g.summary} · {g.time}</p><p className="mt-1 text-sm" aria-label={`${done(g)} of ${g.list.length} checklist items done`}>Checklist: {done(g)}/{g.list.length}</p></li>)}</ul>
          {guide && <article id={`g-${guide.id}`} className={T.card + " mt-4"} aria-labelledby="gd-h"><h3 id="gd-h" className="text-2xl font-bold">{guide.title}</h3><p className={T.muted}>About {guide.time}</p>
            <h4 className="mt-4 text-lg font-bold">What to do</h4><ol className="mt-1 list-decimal space-y-1 pl-6">{guide.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <fieldset className="mt-4"><legend className="text-lg font-bold">Before you start ({done(guide)} of {guide.list.length} done)</legend><div className="mt-2 space-y-2">{guide.list.map((c, i) => <label key={c} className="flex cursor-pointer items-start gap-3"><input type="checkbox" className="mt-1.5 h-6 w-6 shrink-0" style={{ accentColor: T.acc }} checked={(checks[guide.id] ?? []).includes(i)} onChange={() => toggle(guide, i)} />{c}</label>)}</div><p className={"mt-2 text-sm " + T.muted}>Your progress is saved on this device.</p></fieldset>
            <h4 className="mt-4 text-lg font-bold">Sources</h4><ul className="mt-1 list-disc pl-6 text-sm">{guide.sources.map(([l, r]) => <li key={r}>{l} — ref <code>{r}</code></li>)}</ul></article>}
        </section>

        <section id="report" className={"mt-12 " + T.card} aria-labelledby="r-h"><h2 id="r-h" className="text-3xl font-bold">Report a problem</h2>
          {made ? <div role="status" className="mt-4"><h3 className="text-xl font-bold">Report sent</h3><p>Your reference number is <b className="text-2xl">{made.ref}</b>. Keep it: you can track it below.</p><button onClick={() => setMade(null)} className={`${T.ghost} ${bpad} mt-3`}>Report another</button></div> : (
            <form onSubmit={submit} noValidate className="mt-4 grid gap-4">
              {Object.keys(fe).length > 0 && <div role="alert" className={"p-4 " + (hc ? "border-4 border-red-400" : "border-4 border-[#d4351c]")}><h3 className="font-bold">There is a problem</h3><ul className="mt-1 list-disc pl-5">{Object.entries(fe).map(([k, m]) => <li key={k}><a className={T.link} href={`#f-${k === "where" ? "where" : k === "desc" ? "desc" : k === "name" ? "rname" : "remail"}`}>{m}</a></li>)}</ul></div>}
              <label className="block font-bold">What kind of problem is it?<select value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })} className={`${T.inp} mt-1 block w-full bg-transparent px-3 py-2.5 font-normal`}>{CATS.map((c) => <option key={c} className="text-black">{c}</option>)}</select></label>
              <Field label="Where is it?" name="where" hint="Street name and the nearest house number." value={f.where} onChange={(e) => setF({ ...f, where: e.target.value })} error={fe.where} inputClass={T.inp} />
              <Field label="Describe the problem" name="desc" hint="At least 20 characters." value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} error={fe.desc} inputClass={T.inp} />
              <Field label="Your name" name="rname" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={fe.name} autoComplete="name" inputClass={T.inp} />
              <Field label="Email address" name="remail" type="email" hint="We will only use this to send updates on this report." value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={fe.email} autoComplete="email" inputClass={T.inp} />
              <div><button className={`${T.btn} ${bpad}`}>Send report</button></div></form>)}
        </section>

        <section id="track" className={"mt-12 " + T.card} aria-labelledby="t-h"><h2 id="t-h" className="text-3xl font-bold">Track a report</h2>
          <form onSubmit={track} className="mt-4 flex flex-wrap items-end gap-3"><div className="min-w-[220px] flex-1"><Field label="Reference number" name="tref" placeholder="HBC-26-XXXXX" value={tq} onChange={(e) => setTq(e.target.value)} inputClass={T.inp} /></div><button className={`${T.btn} ${bpad}`}>Track</button></form>
          {reports.length > 0 && <p className={"mt-2 text-sm " + T.muted}>Reports made on this device: {reports.map((r) => r.ref).join(", ")}</p>}
          {tr === "none" && <p role="status" className="mt-4 font-bold">We could not find that reference. Tracking only works for reports created on this device in this demonstration.</p>}
          {tr && tr !== "none" && <div className="mt-5"><h3 className="text-xl font-bold">{tr.cat} — {tr.where}</h3><ol className="mt-3 space-y-2">{STAGES.map((s, i) => <li key={s} className={i <= stageOf(tr) ? "font-bold" : "opacity-60"}>{i <= stageOf(tr) ? "✓" : "○"} {s}{i === stageOf(tr) ? " — current status" : ""}</li>)}</ol><p className={"mt-3 text-sm " + T.muted}>Demonstration timing: a report moves through each stage in about 10, 30 and 90 seconds.</p></div>}
        </section>
      </div>
      <footer className={"px-4 py-8 text-center text-sm " + (plain ? "border-t border-black" : "")}>Harrowgate Borough Council is fictional. Accessibility statement: built to WCAG 2.2 AA; keyboard, screen-reader and high-contrast tested.</footer>
    </div>
  );
}

