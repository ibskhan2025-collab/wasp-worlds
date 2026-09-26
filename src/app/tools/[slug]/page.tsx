"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { TOOLS, contrastRatio, conversionItems, estimateScope, fitScore } from "@/lib/tools";

export default function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return <p style={{ padding: 24 }}>No such instrument.</p>;
  return (
    <div className="tool-page">
      <Link href="/tools" className="kicker">← Tools</Link>
      <h1 className="display" style={{ marginTop: 12 }}>{tool.name}</h1>
      <p className="lede">{tool.blurb}</p>
      <hr className="rule" />
      {slug === "audit" ? <Audit /> : null}
      {slug === "cost" ? <Cost /> : null}
      {slug === "fit" ? <Fit /> : null}
      {slug === "scope" ? <Scope /> : null}
      {slug === "brief" ? <Brief /> : null}
      {slug === "critique" ? <Critique /> : null}
      {slug === "a11y" ? <A11y /> : null}
      {slug === "ideas" ? <Ideas /> : null}
      {slug === "redesign" ? <Redesign /> : null}
      {slug === "conversion" ? <Conversion /> : null}
    </div>
  );
}

function Audit() {
  const [url, setUrl] = useState("");
  const [out, setOut] = useState("");
  const [fetched, setFetched] = useState<Record<string, string> | null>(null);
  async function run() {
    setOut("Trying to fetch…");
    setFetched(null);
    try {
      const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (!data.fetched) {
        setOut(data.reason ?? "Could not fetch. Use the checklist against what you see.");
        return;
      }
      setFetched(data);
      setOut("Fetched what the server could see. This is not a full audit.");
    } catch {
      setOut("Could not reach the audit endpoint.");
    }
  }
  return (
    <div>
      <label className="field">
        <span>URL</span>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
      </label>
      <button className="btn" type="button" onClick={run}>Attempt fetch</button>
      <p style={{ marginTop: 12 }}>{out}</p>
      {fetched ? (
        <div className="panel" style={{ marginTop: 16 }}>
          {Object.entries(fetched).map(([k, v]) => (
            <p key={k}><strong>{k}:</strong> {String(v)}</p>
          ))}
        </div>
      ) : null}
      <h2 style={{ marginTop: 32 }}>Human checklist</h2>
      <p>Even with a fetch, look with your eyes:</p>
      <ul>
        {["First impression in 5 seconds", "Mobile: can a thumb do the job", "Navigation names real places", "Hierarchy: one primary idea", "Conversion path", "Performance feel", "Accessibility basics", "SEO: title and one h1", "Content that sounds like a person"].map((x) => (
          <li key={x}><label><input type="checkbox" /> {x}</label></li>
        ))}
      </ul>
    </div>
  );
}

function Cost() {
  const [type, setType] = useState("business");
  const [pages, setPages] = useState(8);
  const [ecommerce, setEcommerce] = useState(false);
  const [cms, setCms] = useState(true);
  const [custom, setCustom] = useState(true);
  const [motion, setMotion] = useState("subtle");
  const [integrations, setIntegrations] = useState(1);
  const [complexity, setComplexity] = useState("mid");
  const result = estimateScope({ type, pages, ecommerce, cms, custom, motion, integrations, complexity });
  return (
    <div className="grid-2">
      <div>
        <label className="field"><span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="business">Business site</option>
            <option value="store">Store</option>
            <option value="app">App / product</option>
            <option value="portfolio">Portfolio</option>
          </select>
        </label>
        <label className="field"><span>Pages {pages}</span>
          <input type="range" min={3} max={40} value={pages} onChange={(e) => setPages(Number(e.target.value))} />
        </label>
        <label><input type="checkbox" checked={ecommerce} onChange={(e) => setEcommerce(e.target.checked)} /> Ecommerce</label>
        <label style={{ display: "block" }}><input type="checkbox" checked={cms} onChange={(e) => setCms(e.target.checked)} /> CMS</label>
        <label style={{ display: "block" }}><input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} /> Custom design</label>
        <label className="field"><span>Motion</span>
          <select value={motion} onChange={(e) => setMotion(e.target.value)}>
            <option value="subtle">Subtle</option>
            <option value="cinematic">Cinematic</option>
            <option value="chaotic">Chaotic</option>
          </select>
        </label>
        <label className="field"><span>Integrations {integrations}</span>
          <input type="range" min={0} max={8} value={integrations} onChange={(e) => setIntegrations(Number(e.target.value))} />
        </label>
        <label className="field"><span>Complexity</span>
          <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div className="panel">
        <p className="kicker">Estimated effort</p>
        <p style={{ fontSize: "2.4rem" }}>{result.weeksLow} – {result.weeksHigh} weeks</p>
        <p>{result.note}</p>
      </div>
    </div>
  );
}

function Fit() {
  const fields = ["Project clarity", "Budget realism", "Timeline sanity", "Communication", "Decision-maker access", "Importance", "Scope clarity"];
  const [vals, setVals] = useState<Record<string, number>>(Object.fromEntries(fields.map((f) => [f, 3])));
  const score = fitScore(vals);
  return (
    <div className="grid-2">
      <div>
        {fields.map((f) => (
          <label key={f} className="field">
            <span>{f} · {vals[f]}</span>
            <input type="range" min={1} max={5} value={vals[f]} onChange={(e) => setVals({ ...vals, [f]: Number(e.target.value) })} />
          </label>
        ))}
      </div>
      <div className="panel">
        <p className="kicker">Profile</p>
        <p style={{ fontSize: "2rem" }}>{score.label}</p>
        <p>Average {score.avg} / 5. This is a conversation starter, not a verdict, and not a promise we will take the work.</p>
      </div>
    </div>
  );
}

function Scope() {
  const [pages, setPages] = useState<string[]>(["Home", "About", "Work", "Contact"]);
  const [features, setFeatures] = useState<string[]>(["Forms"]);
  const [depth, setDepth] = useState("Directed");
  const [motion, setMotion] = useState("Subtle");
  const [cms, setCms] = useState(false);
  const [ecom, setEcom] = useState(false);
  const [support, setSupport] = useState("Launch only");
  const allPages = ["Home", "About", "Work", "Services", "Journal", "Contact", "Legal"];
  const allFeat = ["Forms", "CMS", "Ecommerce", "Booking", "Search", "Localization", "Auth"];
  function tog(list: string[], set: (v: string[]) => void, item: string) {
    set(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }
  const text = `SCOPE
Pages: ${pages.join(", ") || "—"}
Features: ${features.join(", ") || "—"}
Design depth: ${depth}
Motion: ${motion}
CMS: ${cms ? "yes" : "no"}
Ecommerce: ${ecom ? "yes" : "no"}
Support: ${support}

Tradeoff: more of one usually means less of another, or more time.`;
  return (
    <div className="grid-2">
      <div>
        <p className="kicker">Pages</p>
        {allPages.map((p) => (
          <label key={p} style={{ display: "block" }}><input type="checkbox" checked={pages.includes(p)} onChange={() => tog(pages, setPages, p)} /> {p}</label>
        ))}
        <p className="kicker" style={{ marginTop: 16 }}>Features</p>
        {allFeat.map((p) => (
          <label key={p} style={{ display: "block" }}><input type="checkbox" checked={features.includes(p)} onChange={() => tog(features, setFeatures, p)} /> {p}</label>
        ))}
        <label className="field"><span>Design depth</span>
          <select value={depth} onChange={(e) => setDepth(e.target.value)}>
            <option>Directed</option><option>System</option><option>Bespoke everywhere</option>
          </select>
        </label>
        <label className="field"><span>Motion</span>
          <select value={motion} onChange={(e) => setMotion(e.target.value)}>
            <option>Subtle</option><option>Cinematic</option><option>Chaotic</option>
          </select>
        </label>
        <label><input type="checkbox" checked={cms} onChange={(e) => setCms(e.target.checked)} /> CMS</label>
        <label style={{ display: "block" }}><input type="checkbox" checked={ecom} onChange={(e) => setEcom(e.target.checked)} /> Ecommerce</label>
        <label className="field"><span>Support</span>
          <select value={support} onChange={(e) => setSupport(e.target.value)}>
            <option>Launch only</option><option>90 days</option><option>Ongoing</option>
          </select>
        </label>
      </div>
      <pre className="panel" style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
}

function Brief() {
  const [b, setB] = useState({ biz: "", audience: "", job: "", feel: "", must: "", not: "" });
  const text = `WEBSITE BRIEF
Business: ${b.biz || "—"}
Audience: ${b.audience || "—"}
Job of the site: ${b.job || "—"}
Feeling: ${b.feel || "—"}
Must include: ${b.must || "—"}
Must not: ${b.not || "—"}`;
  return (
    <div className="grid-2">
      <div>
        {(["biz", "audience", "job", "feel", "must", "not"] as const).map((k) => (
          <label key={k} className="field">
            <span>{k}</span>
            <textarea value={b[k]} onChange={(e) => setB({ ...b, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <pre className="panel" style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
}

function Critique() {
  const [h, setH] = useState("");
  const [sub, setSub] = useState("");
  const [cta, setCta] = useState("");
  const [notes, setNotes] = useState("");
  const points = useMemo(() => {
    const p: string[] = [];
    if (!h) p.push("No headline. The page has not decided what it is.");
    else if (h.length > 90) p.push("Headline is long. It may be several ideas pretending to be one.");
    else p.push("Headline exists. Check it still sounds like a person.");
    if (!sub) p.push("No supporting line. The visitor has to invent the rest.");
    if (!cta) p.push("No CTA. Looking is not a conversion path.");
    else if (!/book|start|buy|see|get|reserve|talk|write|shop/i.test(cta)) p.push("CTA might not be a verb the visitor can do.");
    if (/we craft|elevate|synergy|digital experiences/i.test(`${h} ${sub}`)) p.push("Generic agency language detected. Burn it.");
    if (notes.toLowerCase().includes("above the fold")) p.push("If you need the phrase 'above the fold' to explain it, the hierarchy isn't working.");
    return p;
  }, [h, sub, cta, notes]);
  return (
    <div className="grid-2">
      <div>
        <label className="field"><span>Headline</span><input value={h} onChange={(e) => setH(e.target.value)} /></label>
        <label className="field"><span>Sub</span><textarea value={sub} onChange={(e) => setSub(e.target.value)} /></label>
        <label className="field"><span>CTA</span><input value={cta} onChange={(e) => setCta(e.target.value)} /></label>
        <label className="field"><span>What else is on the homepage?</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      </div>
      <ul>{points.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
}

function A11y() {
  const [fg, setFg] = useState("#f4f1ea");
  const [bg, setBg] = useState("#070707");
  const ratio = contrastRatio(fg, bg);
  return (
    <div>
      <p>This checks contrast between two colours you enter, plus a reminder list. It is not a WCAG certification and not legal advice.</p>
      <div className="grid-2">
        <label className="field"><span>Foreground</span><input value={fg} onChange={(e) => setFg(e.target.value)} /></label>
        <label className="field"><span>Background</span><input value={bg} onChange={(e) => setBg(e.target.value)} /></label>
      </div>
      <div className="panel" style={{ background: bg, color: fg, margin: "16px 0" }}>Sample text on this pairing.</div>
      <p>Contrast {ratio.toFixed(2)} : 1. Body text usually wants 4.5:1. Large text 3:1. This is a heuristic.</p>
      <ul>
        {["Buttons are buttons, links are links", "Focus is visible", "Images that matter have alt", "Headings skip no levels", "Motion can be quiet", "Labels exist on inputs"].map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

function Ideas() {
  const [biz, setBiz] = useState("a ceramics studio");
  const [aud, setAud] = useState("people who already care about objects");
  const [feel, setFeel] = useState("quiet");
  const [obj, setObj] = useState("sell without shouting");
  const ideas = [
    `A catalogue that behaves like a contact sheet. ${biz} for ${aud}. Feeling: ${feel}. Job: ${obj}.`,
    `Open on a single object, full viewport. No nav until they move. Then the shop.`,
    `Journal + till. Essays on making, then a cart that already knows the last thing they touched.`,
    `A booking or enquiry that starts with a material, not a form: clay, oak, film, type.`,
  ];
  return (
    <div>
      <label className="field"><span>Business</span><input value={biz} onChange={(e) => setBiz(e.target.value)} /></label>
      <label className="field"><span>Audience</span><input value={aud} onChange={(e) => setAud(e.target.value)} /></label>
      <label className="field"><span>Feeling</span><input value={feel} onChange={(e) => setFeel(e.target.value)} /></label>
      <label className="field"><span>Objective</span><input value={obj} onChange={(e) => setObj(e.target.value)} /></label>
      <ol>{ideas.map((i) => <li key={i}>{i}</li>)}</ol>
    </div>
  );
}

function Redesign() {
  const [exist, setExist] = useState("");
  const lines = exist
    ? [
        `Strategic direction: say what ${exist.slice(0, 40)} is for in one sentence, then delete the rest of the hero.`,
        "Structure: fewer pages, clearer jobs. Merge anything that repeats the homepage.",
        "Visual: pick a constraint (type, colour, or image) and obey it.",
        "Interaction: one thing the old site couldn't do. Make that the reason to redesign.",
        "Conversion: put the verb where the eye already is.",
      ]
    : ["Describe the existing site or business first."];
  return (
    <div>
      <label className="field"><span>Existing site / business</span><textarea value={exist} onChange={(e) => setExist(e.target.value)} /></label>
      <ul>{lines.map((l) => <li key={l}>{l}</li>)}</ul>
    </div>
  );
}

function Conversion() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const done = conversionItems.filter((i) => on[i.id]).length;
  return (
    <div>
      <p>{done} / {conversionItems.length} considered.</p>
      {conversionItems.map((i) => (
        <label key={i.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
          <input type="checkbox" checked={!!on[i.id]} onChange={(e) => setOn({ ...on, [i.id]: e.target.checked })} />
          <span><span className="kicker">{i.g}</span><br />{i.t}</span>
        </label>
      ))}
    </div>
  );
}
