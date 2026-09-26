"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { media } from "@/lib/media";

const panels = [
  { img: media.motion.red, title: "MOVE", copy: "A campaign is not a PDF of posters.", spec: "1400ms · ease-out · full-bleed reveal" },
  { img: media.motion.leap, title: "CUT", copy: "Type as large as the street.", spec: "90ms · step · hard cut, no fade" },
  { img: media.motion.ballet, title: "HOLD", copy: "Then do nothing, on purpose.", spec: "∞ · stillness as a timed beat" },
  { img: media.motion.blur, title: "BLUR", copy: "Time is a material. Use it.", spec: "700ms · ease-in-out · motion blur" },
  { img: media.motion.fire, title: "BURN", copy: "If it doesn't change the room, it isn't motion. It's decoration.", spec: "420ms · spring · heat rise" },
  { img: media.motion.studio, title: "AGAIN", copy: "The sequence is the work.", spec: "loop · the end is the start" },
];

const EASINGS = [
  { id: "wasp", label: "WASP", fn: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { id: "ease", label: "Ease", fn: "ease" },
  { id: "inout", label: "In-out", fn: "ease-in-out" },
  { id: "snap", label: "Snap", fn: "cubic-bezier(0.8, 0, 0.2, 1)" },
  { id: "linear", label: "Linear", fn: "linear" },
];

export default function MotionPage() {
  const [p, setP] = useState(0);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? window.scrollY / max : 0);
        let cur = 0;
        refs.current.forEach((el, i) => {
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.6) cur = i;
        });
        setActive(cur);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  function jump(i: number) {
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const [easeId, setEaseId] = useState("wasp");
  const [dur, setDur] = useState(700);
  const [runs, setRuns] = useState(0);
  const ease = EASINGS.find((e) => e.id === easeId) ?? EASINGS[0];

  return (
    <div className="mot-root">
      <WorldExit id="motion" label="Room 08 · MOTION" />
      <div className="progress-bar" style={{ transform: `scaleX(${p})`, background: "#fff" }} />
      <nav aria-label="Chapters" style={{ position: "fixed", right: 14, top: "50%", translate: "0 -50%", display: "grid", gap: 8, zIndex: 5 }}>
        {panels.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => jump(i + 1)}
            aria-label={`Go to ${s.title}`}
            title={s.title}
            style={{
              width: 12, height: 12, borderRadius: "50%", border: "1px solid #fff",
              background: active === i + 1 ? "#fff" : "transparent", padding: 0,
            }}
          />
        ))}
      </nav>
      <section ref={(el) => { refs.current[0] = el; }} className="mot-panel" style={{ background: "#000" }}>
        <div>
          <p className="kicker">Campaign 01 · WASP study</p>
          <h2>DON&apos;T WATCH THE FILM.</h2>
          <p style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.12em", textAlign: "center" }}>SCROLL IT.</p>
        </div>
      </section>
      {panels.map((s, i) => (
        <section
          key={s.title}
          ref={(el) => { refs.current[i + 1] = el; }}
          className="mot-panel"
          style={{ ["--img" as string]: `url(${s.img})` }}
        >
          <div>
            <h2>{s.title}</h2>
            <p style={{ fontFamily: "var(--font-sans)", maxWidth: "28ch", margin: "12px auto 0", textAlign: "center", letterSpacing: "0.06em" }}>
              {s.copy}
            </p>
            <p className="kicker" style={{ textAlign: "center", marginTop: 12 }}>{i + 1} / {panels.length} · {s.spec}</p>
          </div>
        </section>
      ))}
      <section className="mot-panel" style={{ background: "#0b0b0b" }}>
        <div style={{ textAlign: "center", maxWidth: 640 }}>
          <p className="kicker">Timing lab — touch it</p>
          <h2>FEEL THE CURVE</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", margin: "16px 0" }}>
            {EASINGS.map((e) => (
              <button key={e.id} className={easeId === e.id ? "chip-on" : "chip"} type="button" onClick={() => setEaseId(e.id)}>
                {e.label}
              </button>
            ))}
          </div>
          <label className="kicker" style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            {dur}ms
            <input type="range" min={90} max={1400} step={10} value={dur} onChange={(e) => setDur(Number(e.target.value))} aria-label="Duration in milliseconds" />
          </label>
          <div style={{ height: 120, border: "1px solid #ffffff2c", margin: "20px 0", position: "relative", overflow: "hidden" }} aria-hidden>
            <div
              key={runs}
              className="mot-demo"
              style={{
                position: "absolute", top: 30, left: 16, width: 56, height: 56, background: "#fff",
                animation: `mot-run ${dur}ms ${ease.fn} forwards`,
              }}
            />
            <style>{`@keyframes mot-run { from { transform: translateX(0) scale(1); opacity: 0.25; } to { transform: translateX(min(440px, calc(100vw - 140px))) scale(1); opacity: 1; } } @media (prefers-reduced-motion: reduce) { .mot-demo { animation: none !important; transform: translateX(120px) !important; opacity: 1 !important; } }`}</style>
          </div>
          <p className="kicker">{ease.label} · {ease.fn} · {dur}ms</p>
          <button className="btn ghost" type="button" onClick={() => setRuns((n) => n + 1)} style={{ marginTop: 12 }}>
            Run it again
          </button>
        </div>
      </section>
      <section ref={(el) => { refs.current[panels.length + 1] = el; }} className="mot-panel" style={{ background: "#000" }}>
        <div style={{ textAlign: "center", maxWidth: 560 }}>
          <h2>CASE</h2>
          <div style={{ textAlign: "left", fontFamily: "var(--font-sans)", margin: "0 auto 24px", display: "grid", gap: 12 }}>
            <p><strong>Problem.</strong> Campaign sites that freeze into screenshots — motion as decoration, timing as an afterthought.</p>
            <p><strong>Decision.</strong> Treat scroll as editing: six timed chapters, one easing system, stillness scored like a beat.</p>
            <p><strong>Result.</strong> A sequence you can only understand by moving. The tokens below run this whole site.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            <span className="chip">subtle · 180ms</span>
            <span className="chip">standard · 420ms</span>
            <span className="chip">cinematic · 700ms</span>
            <span className="chip">wasp · cubic-bezier(0.16, 1, 0.3, 1)</span>
          </div>
          <Link className="btn ghost" href="/studio/case/casa">
            Other studies
          </Link>
        </div>
      </section>
    </div>
  );
}
