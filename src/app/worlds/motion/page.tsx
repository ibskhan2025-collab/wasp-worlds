"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { media } from "@/lib/media";

const panels = [
  { img: media.motion.red, title: "MOVE", copy: "A campaign is not a PDF of posters." },
  { img: media.motion.leap, title: "CUT", copy: "Type as large as the street." },
  { img: media.motion.ballet, title: "HOLD", copy: "Then do nothing, on purpose." },
  { img: media.motion.blur, title: "BLUR", copy: "Time is a material. Use it." },
  { img: media.motion.fire, title: "BURN", copy: "If it doesn't change the room, it isn't motion. It's decoration." },
  { img: media.motion.studio, title: "AGAIN", copy: "The sequence is the work." },
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
            <p className="kicker" style={{ textAlign: "center", marginTop: 12 }}>{i + 1} / {panels.length}</p>
          </div>
        </section>
      ))}
      <section ref={(el) => { refs.current[panels.length + 1] = el; }} className="mot-panel" style={{ background: "#000" }}>
        <div style={{ textAlign: "center" }}>
          <h2>CASE</h2>
          <p style={{ fontFamily: "var(--font-sans)", maxWidth: 420, margin: "0 auto 24px" }}>
            Problem: campaign sites that freeze into screenshots. Decision: treat scroll as editing. Result: a sequence you can only understand by moving.
          </p>
          <Link className="btn ghost" href="/studio/case/casa">
            Other studies
          </Link>
        </div>
      </section>
    </div>
  );
}
