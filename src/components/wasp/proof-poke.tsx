"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { answerPalette } from "@/components/wasp/command-palette";
import { pexels } from "@/lib/media";

const TABS = ["Design", "Software", "3D", "AI", "Data", "Motion"] as const;

const LINKS: Record<(typeof TABS)[number], [string, string]> = {
  Design: ["/lab", "Open the type workshop"],
  Software: ["/worlds/orbit", "Explore the product (ORBIT)"],
  "3D": ["/worlds/nest/3d", "Enter the WebGL room (NEST)"],
  AI: ["/matrix", "Or press ⌘K anywhere"],
  Data: ["/worlds/vector/chart", "Read the numbers (VECTOR)"],
  Motion: ["/worlds/motion/timing", "Open the motion system"],
};

function MiniType() {
  const [ratio, setRatio] = useState(1.333);
  const [base, setBase] = useState(16);
  const lines = ["The room after the decision", "Hierarchy is a choice", "What you made large", "Everything else steps back", "Body text should just be readable."];
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, fontSize: "0.9rem", marginBottom: 16 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Scale ratio {ratio.toFixed(3)}
          <input type="range" min={1.067} max={1.618} step={0.001} value={ratio} onChange={(e) => setRatio(Number(e.target.value))} aria-label="Scale ratio" />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Base {base}px
          <input type="range" min={12} max={22} value={base} onChange={(e) => setBase(Number(e.target.value))} aria-label="Base size" />
        </label>
      </div>
      {[4, 3, 2, 1, 0].map((s) => (
        <p key={s} style={{ fontSize: base * Math.pow(ratio, s), lineHeight: 1.1, margin: "4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          <span style={{ display: "inline-block", width: 64, fontSize: 12, color: "var(--muted)" }}>{Math.round(base * Math.pow(ratio, s))}px</span>
          {lines[4 - s]}
        </p>
      ))}
    </div>
  );
}

function MiniCrud() {
  const [items, setItems] = useState([{ n: "Harbour Bakery", v: 49 }, { n: "Kiln & Co", v: 290 }]);
  const [n, setN] = useState("");
  const mrr = items.reduce((a, b) => a + b.v, 0);
  return (
    <div>
      <form style={{ display: "flex", gap: 8 }} onSubmit={(e) => { e.preventDefault(); if (n.trim()) { setItems([...items, { n: n.trim(), v: 49 }]); setN(""); } }}>
        <input value={n} onChange={(e) => setN(e.target.value)} placeholder="Add a customer" aria-label="Customer name" style={{ flex: 1, border: "1px solid var(--line)", background: "transparent", color: "var(--fg)", padding: "8px 12px" }} />
        <button className="btn" style={{ paddingTop: 8, paddingBottom: 8 }}>Add</button>
      </form>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>MRR (derived): €{mrr} · {items.length} customers</p>
      <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0 }}>
        {items.map((it, i) => (
          <li key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
            <span>{it.n}</span>
            <span style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setItems(items.map((x, j) => (j === i ? { ...x, v: x.v === 49 ? 290 : x.v === 290 ? 1200 : 49 } : x)))} style={{ background: "none", border: 0, color: "var(--fg)", fontSize: 12 }}>
                €{it.v} ↻
              </button>
              <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} style={{ background: "none", border: 0, color: "var(--danger)", fontSize: 12 }}>
                delete
              </button>
            </span>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p style={{ padding: "16px 0" }}>Empty. Good empty states tell you what to do next — add one above.</p>}
    </div>
  );
}

const CUBE_FACES = [
  "rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)",
];
const CUBE_IMGS = [pexels(6536617, 300), pexels(8858906, 300), pexels(30761844, 300), pexels(3394250, 300), pexels(25664673, 300), pexels(15122643, 300)];

function MiniCube() {
  const [r, setR] = useState({ x: -20, y: 30 });
  const d = useRef<{ x: number; y: number } | null>(null);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", justifyContent: "space-around" }}>
      <div
        style={{ width: 224, height: 224, perspective: 700, touchAction: "none" }}
        onPointerDown={(e) => { d.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture?.(e.pointerId); }}
        onPointerMove={(e) => {
          const prev = d.current;
          if (!prev) return;
          setR((p) => ({ x: p.x - (e.clientY - prev.y) * 0.5, y: p.y + (e.clientX - prev.x) * 0.5 }));
          d.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => { d.current = null; }}
        role="application"
        aria-label="Draggable CSS 3D cube"
      >
        <div style={{ position: "relative", width: 128, height: 128, margin: "40px auto 0", transformStyle: "preserve-3d", transform: `rotateX(${r.x}deg) rotateY(${r.y}deg)` }}>
          {CUBE_FACES.map((tf, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={CUBE_IMGS[i]} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: 128, height: 128, objectFit: "cover", border: "1px solid var(--line)", transform: `${tf} translateZ(64px)` }} />
          ))}
        </div>
      </div>
      <p style={{ maxWidth: 300, color: "var(--muted)", fontSize: "0.95rem" }}>
        Drag to rotate. Pure CSS 3D — the lightweight kind. The WebGL rooms load only when you open them.
      </p>
    </div>
  );
}

function MiniAsk() {
  const [q, setQ] = useState("Show me something technically difficult");
  const a = useMemo(() => answerPalette(q), [q]);
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask the site a question" style={{ width: "100%", border: "1px solid var(--line)", background: "transparent", color: "var(--fg)", padding: "12px", fontSize: "1.05rem" }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {["I need a restaurant website", "Show me 3D", "Something weird", "I don't know what I need"].map((s) => (
          <button key={s} type="button" onClick={() => setQ(s)} style={{ border: "1px solid var(--line)", background: "transparent", color: "var(--fg)", padding: "4px 10px", fontSize: 12 }}>
            {s}
          </button>
        ))}
      </div>
      <p style={{ fontSize: "1.1rem", marginTop: 16 }}>{a.say}</p>
      <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0 }}>
        {a.picks.map((p) => (
          <li key={p.href} style={{ margin: "4px 0" }}>
            <Link href={p.href} style={{ textDecoration: "underline" }}>→ {p.title}</Link>
            <span style={{ color: "var(--muted)" }}> — {p.sub}</span>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 16 }}>Answered by keyword rules over this site&apos;s index. It can&apos;t invent a project.</p>
    </div>
  );
}

function MiniData() {
  const base = [["Berlin", 3.76], ["Madrid", 3.33], ["Rome", 2.75], ["Paris", 2.1], ["Vienna", 1.98]] as const;
  const [sort, setSort] = useState(true);
  const [h, setH] = useState<string | null>(null);
  const d = [...base].sort((a, b) => (sort ? b[1] - a[1] : a[0].localeCompare(b[0])));
  const avg = base.reduce((a, b) => a + b[1], 0) / base.length;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>City-proper population, millions · approx, rounded</p>
        <button type="button" onClick={() => setSort(!sort)} style={{ border: "1px solid var(--line)", background: "transparent", color: "var(--fg)", padding: "4px 10px", fontSize: 12 }}>
          Sort: {sort ? "value" : "name"}
        </button>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {d.map(([c, v]) => (
          <div key={c} style={{ display: "flex", gap: 12, alignItems: "center" }} onPointerEnter={() => setH(c)} onPointerLeave={() => setH(null)}>
            <span style={{ width: 64, fontSize: "0.9rem" }}>{c}</span>
            <div style={{ position: "relative", height: 32, flex: 1, background: "rgba(127,127,127,0.12)" }}>
              <div style={{ height: "100%", width: `${(v / 4) * 100}%`, background: h === c ? "var(--fg)" : "var(--muted)", transition: "width 0.5s" }} />
              <div style={{ position: "absolute", top: 0, height: "100%", borderLeft: "2px dashed var(--danger)", left: `${(avg / 4) * 100}%` }} />
            </div>
            <span style={{ width: 110, fontSize: 12 }}>
              {v.toFixed(2)}m {h === c && <span style={{ color: "var(--muted)" }}>{v > avg ? "+" : ""}{(((v - avg) / avg) * 100).toFixed(0)}%</span>}
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>dashed = mean ({avg.toFixed(2)}m) · hover for difference from mean</p>
    </div>
  );
}

function MiniSpring() {
  const ref = useRef<HTMLDivElement | null>(null);
  const box = useRef<HTMLDivElement | null>(null);
  const tgt = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => {
    let x = 0.5;
    let y = 0.5;
    let vx = 0;
    let vy = 0;
    let raf = 0;
    const loop = () => {
      const k = 120;
      const c = 9;
      vx += ((-k * (x - tgt.current.x) - c * vx) / 60 / 60) * 60;
      vy += ((-k * (y - tgt.current.y) - c * vy) / 3600);
      x += vx / 60;
      y += vy / 60;
      if (ref.current) {
        ref.current.style.left = `${x * 100}%`;
        ref.current.style.top = `${y * 100}%`;
        ref.current.style.transform = `translate(-50%,-50%) scale(${1 + Math.min(Math.hypot(vx, vy) * 0.8, 0.6)}, ${1 - Math.min(Math.hypot(vx, vy) * 0.4, 0.3)}) rotate(${Math.atan2(vy, vx)}rad)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      ref={box}
      style={{ position: "relative", height: 300, overflow: "hidden", border: "1px dashed var(--line)", cursor: "crosshair" }}
      onPointerDown={(e) => {
        const r = box.current!.getBoundingClientRect();
        tgt.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
      }}
    >
      <div ref={ref} style={{ position: "absolute", width: 40, height: 40, borderRadius: "50%", background: "var(--fg)", left: "50%", top: "50%" }} />
      <p style={{ position: "absolute", bottom: 8, left: 8, fontSize: 12, color: "var(--muted)", margin: 0 }}>
        Click anywhere. It&apos;s a spring, not a tween — it squashes along its velocity.
      </p>
    </div>
  );
}

export function ProofPoke() {
  const [t, setT] = useState<(typeof TABS)[number]>("Design");
  return (
    <section aria-label="Proof, not adjectives" style={{ borderBottom: "1px solid var(--line)", padding: "64px var(--pad)" }}>
      <p className="kicker">Proof, not adjectives</p>
      <h2 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)", maxWidth: "20ch" }}>
        Don&apos;t take our word for it. <em>Poke it.</em>
      </h2>
      <p style={{ color: "var(--muted)", maxWidth: "52ch" }}>Six working miniatures. Each one is a small piece of something bigger on this site.</p>
      <div style={{ border: "1px solid var(--line)", marginTop: 28 }}>
        <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid var(--line)" }} role="tablist" aria-label="Capability demos">
          {TABS.map((x) => (
            <button
              key={x}
              role="tab"
              aria-selected={t === x}
              onClick={() => setT(x)}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: t === x ? "var(--fg)" : "transparent",
                color: t === x ? "var(--bg)" : "var(--fg)",
                border: 0,
                fontSize: 12,
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}
            >
              {x}
            </button>
          ))}
        </div>
        <div style={{ minHeight: 340, padding: 24 }} role="tabpanel" aria-label={t}>
          {t === "Design" && <MiniType />}
          {t === "Software" && <MiniCrud />}
          {t === "3D" && <MiniCube />}
          {t === "AI" && <MiniAsk />}
          {t === "Data" && <MiniData />}
          {t === "Motion" && <MiniSpring />}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderTop: "1px solid var(--line)", padding: "12px 24px", fontSize: 12, color: "var(--muted)" }}>
          <span>Miniature · the real one is bigger</span>
          <Link href={LINKS[t][0]} style={{ textDecoration: "underline", color: "var(--fg)" }}>{LINKS[t][1]} →</Link>
        </div>
      </div>
    </section>
  );
}
