"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { loadJson, saveJson } from "@/lib/storage";

type Blip = { id: number; x: number; y: number; r: number; vx: number; vy: number; band: number; life: number };

const BANDS = ["#e8b86d", "#d98a4a", "#f2d7a1"];

export default function SignalPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const blips = useRef<Blip[]>([]);
  const raf = useRef<number>(0);
  const idRef = useRef(1);
  const [mode, setMode] = useState<"start" | "play" | "paused" | "end">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(45);
  const [diff, setDiff] = useState<"Calm" | "Sharp" | "Brutal">("Sharp");
  const [bests, setBests] = useState<Record<string, number>>({ Calm: 0, Sharp: 0, Brutal: 0 });
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const modeRef = useRef(mode);
  const lastSecRef = useRef(-1);
  const elapsedRef = useRef(0);
  const best = bests[diff] ?? 0;

  // Hydrate persisted prefs after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiff(loadJson<"Calm" | "Sharp" | "Brutal">("wasp-signal-diff", "Sharp"));
    const legacy = Number(window.localStorage.getItem("wasp-signal-best") ?? 0);
    const saved = loadJson<Record<string, number>>("wasp-signal-bests", {});
    setBests({
      Calm: saved.Calm ?? 0,
      Sharp: saved.Sharp ?? (Number.isFinite(legacy) ? legacy : 0),
      Brutal: saved.Brutal ?? 0,
    });
  }, []);
  useEffect(() => {
    saveJson("wasp-signal-diff", diff);
  }, [diff]);
  useEffect(() => {
    saveJson("wasp-signal-bests", bests);
  }, [bests]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const spawn = useCallback((size: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = diff === "Calm" ? 0.55 : diff === "Sharp" ? 0.9 : 1.25;
    const cx = size / 2;
    const x = cx + Math.cos(angle) * (size * 0.46);
    const y = cx + Math.sin(angle) * (size * 0.46);
    blips.current.push({
      id: idRef.current++,
      x,
      y,
      r: 10 + Math.random() * 6,
      vx: ((cx - x) / size) * speed * 6,
      vy: ((cx - y) / size) * speed * 6,
      band: Math.floor(Math.random() * 3),
      life: 1,
    });
  }, [diff]);

  useEffect(() => {
    if (mode !== "play") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let last = performance.now();
    let acc = 0;
    let elapsed = elapsedRef.current;

    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      acc += dt;
      elapsed += dt;
      const size = canvas.width;
      const cx = size / 2;
      const spawnEvery = diff === "Calm" ? 900 : diff === "Sharp" ? 620 : 420;
      if (acc > spawnEvery) {
        spawn(size);
        acc = 0;
      }
      ctx.clearRect(0, 0, size, size);      ctx.strokeStyle = "#e8b86d33";
      ctx.beginPath();
      ctx.arc(cx, cx, size * 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cx, size * 0.22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#e8b86d";
      ctx.beginPath();
      ctx.arc(cx, cx, 6, 0, Math.PI * 2);
      ctx.fill();

      const remain: Blip[] = [];
      for (const b of blips.current) {
        b.x += b.vx;
        b.y += b.vy;
        const dx = b.x - cx;
        const dy = b.y - cy(cx);
        const dist = Math.hypot(dx, dy);
        ctx.fillStyle = BANDS[b.band];
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        if (dist < 16) {
          livesRef.current -= 1;
          setLives(livesRef.current);
          if (livesRef.current <= 0) {
            endGame();
            return;
          }
        } else remain.push(b);
      }
      blips.current = remain;
      if (elapsed > 45000) {
        endGame();
        return;
      }
      elapsedRef.current = elapsed;
      const sec = Math.max(0, 45 - Math.floor(elapsed / 1000));
      if (sec !== lastSecRef.current) {
        lastSecRef.current = sec;
        setTime(sec);
      }
      raf.current = requestAnimationFrame(loop);
    };

    function cy(n: number) {
      return n;
    }

    function endGame() {
      cancelAnimationFrame(raf.current);
      elapsedRef.current = 0;
      setMode("end");
      const s = scoreRef.current;
      setBests((b) => ({ ...b, [diff]: Math.max(b[diff] ?? 0, s) }));
    }

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [mode, diff, spawn]);

  function start() {
    blips.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    lastSecRef.current = -1;
    elapsedRef.current = 0;
    setScore(0);
    setLives(3);
    setTime(45);
    setMode("play");
  }

  function togglePause() {
    if (modeRef.current === "play") setMode("paused");
    else if (modeRef.current === "paused") setMode("play");
  }

  function intercept(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas || modeRef.current !== "play") return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    let hit = -1;
    blips.current.forEach((b, i) => {
      if (Math.hypot(b.x - x, b.y - y) < b.r + 14) hit = i;
    });
    if (hit >= 0) {
      blips.current.splice(hit, 1);
      scoreRef.current += 10 + (diff === "Brutal" ? 8 : diff === "Sharp" ? 4 : 0);
      setScore(scoreRef.current);
    }
  }

  return (
    <div className="signal-root">
      <WorldExit id="signal" label="Room 05 · SIGNAL" />
      <div className="signal-stage">
        <p className="kicker">Intercept</p>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", margin: "6px 0 8px" }}>SIGNAL</h1>
        {mode === "start" ? (
          <div>
            <p>Blips fall toward the core. Click them before they arrive. Forty-five seconds. Three lives.</p>
            <p className="kicker" style={{ margin: "16px 0 8px" }}>Difficulty</p>
            {(["Calm", "Sharp", "Brutal"] as const).map((d) => (
              <button key={d} className={diff === d ? "chip-on" : "chip"} type="button" onClick={() => setDiff(d)}>
                {d} · {bests[d] ?? 0}
              </button>
            ))}
            <div style={{ marginTop: 24 }}>
              <button className="btn" type="button" onClick={start}>
                Begin intercept
              </button>
            </div>
            <p className="kicker" style={{ marginTop: 16 }}>Best on {diff}: {best}</p>
          </div>
        ) : null}
        {mode === "play" || mode === "paused" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, letterSpacing: "0.16em" }}>
              <span>SCORE {score}</span>
              <span>TIME {time}</span>
              <span>LINE {lives}</span>
              <button className="ghost" type="button" onClick={togglePause}>
                {mode === "play" ? "Pause" : "Resume"}
              </button>
            </div>
            <div className="signal-canvas-wrap">
              <canvas
                ref={canvasRef}
                width={640}
                height={640}
                style={{ width: "100%", height: "100%" }}
                onPointerDown={(e) => intercept(e.clientX, e.clientY)}
              />
              {mode === "paused" ? (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(7,8,10,0.72)" }}>
                  <div style={{ textAlign: "center" }}>
                    <p className="kicker">Held</p>
                    <button className="btn" type="button" onClick={togglePause}>Resume</button>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
        {mode === "end" ? (
          <div>
            <h2>Signal lost.</h2>
            <p>Score {score}. Best on {diff}: {Math.max(best, score)}.</p>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn" type="button" onClick={start}>
                Again
              </button>
              <button className="btn ghost" type="button" onClick={() => setMode("start")}>
                Change difficulty
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
