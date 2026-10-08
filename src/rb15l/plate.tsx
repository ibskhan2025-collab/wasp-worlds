"use client";
import { useEffect, useRef } from "react";

export type PlateKind = "dunes" | "peaks" | "sea" | "city" | "forest" | "ice" | "rings" | "grid" | "wave";

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Procedural imagery: every "photograph" and cover in the portfolio is generated from a seed. */
export function drawPlate(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, kind: PlateKind, hue = 30) {
  const R = rng(seed * 9973 + 11);
  const hs = (hh: number, s: number, l: number, a = 1) => `hsla(${hh},${s}%,${l}%,${a})`;
  const sky = (top: string, bot: string, to = h) => {
    const g = ctx.createLinearGradient(0, 0, 0, to);
    g.addColorStop(0, top);
    g.addColorStop(1, bot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };
  const ridge = (base: number, amp: number, freq: number, col: string, jag = 0) => {
    const ph = R() * 10;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += jag ? 6 : 4) {
      const y = base + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.3 + ph * 2) * amp * 0.4 + (jag ? (R() - 0.5) * jag : 0);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
  };
  if (kind === "dunes") {
    sky(hs(hue, 55, 72), hs(hue + 15, 70, 88));
    ctx.fillStyle = hs(hue, 90, 92, 0.9);
    ctx.beginPath();
    ctx.arc(w * (0.2 + R() * 0.6), h * 0.28, w * 0.07, 0, 7);
    ctx.fill();
    for (let i = 0; i < 6; i++) ridge(h * (0.45 + i * 0.1), 18 + i * 6, 0.006 + i * 0.002, hs(hue - i * 3, 50, 62 - i * 9));
  } else if (kind === "peaks") {
    sky(hs(hue, 30, 60), hs(hue, 30, 90));
    for (let i = 0; i < 5; i++) {
      ridge(h * (0.4 + i * 0.12), 40 - i * 4, 0.004 + i * 0.001, hs(hue + 190, 25, 70 - i * 13), 30 - i * 4);
      const g = ctx.createLinearGradient(0, h * (0.45 + i * 0.12), 0, h * (0.6 + i * 0.12));
      g.addColorStop(0, hs(hue, 20, 92, 0));
      g.addColorStop(1, hs(hue, 20, 92, 0.55));
      ctx.fillStyle = g;
      ctx.fillRect(0, h * (0.45 + i * 0.12), w, h * 0.2);
    }
  } else if (kind === "sea") {
    const hz = h * (0.5 + R() * 0.12);
    sky(hs(hue + 200, 40, 30), hs(hue, 80, 78), hz);
    ctx.fillStyle = hs(hue + 200, 40, 30);
    ctx.fillRect(0, 0, w, hz * 0.02);
    const g = ctx.createLinearGradient(0, hz, 0, h);
    g.addColorStop(0, hs(hue + 10, 60, 60));
    g.addColorStop(1, hs(hue + 210, 50, 12));
    ctx.fillStyle = g;
    ctx.fillRect(0, hz, w, h - hz);
    ctx.fillStyle = hs(hue, 95, 90, 0.9);
    ctx.beginPath();
    ctx.arc(w * 0.5, hz - 4, w * 0.06, Math.PI, 0);
    ctx.fill();
    for (let y = hz + 4; y < h; y += 5 + (y - hz) * 0.06) {
      ctx.fillStyle = hs(hue, 90, 85, Math.max(0, 0.5 - (y - hz) / h));
      const ww = w * 0.12 * R() + 10;
      ctx.fillRect(w * 0.5 - ww / 2 + (R() - 0.5) * 30, y, ww, 1.5);
    }
  } else if (kind === "city") {
    sky(hs(hue + 220, 50, 8), hs(hue + 280, 50, 24));
    for (let l = 0; l < 3; l++) {
      let x = -10;
      while (x < w) {
        const bw = 20 + R() * 50;
        const bh = h * (0.15 + R() * 0.4) * (1 - l * 0.2);
        ctx.fillStyle = hs(hue + 230, 30, 6 + l * 6);
        ctx.fillRect(x, h - bh - l * 30, bw, bh + l * 30);
        if (l < 2)
          for (let wy = h - bh - l * 30 + 8; wy < h - 8; wy += 10)
            for (let wx = x + 4; wx < x + bw - 4; wx += 8) if (R() > 0.72) { ctx.fillStyle = hs(hue + 10, 90, 70, 0.85); ctx.fillRect(wx, wy, 3, 4); }
        x += bw + R() * 4;
      }
    }
  } else if (kind === "forest") {
    sky(hs(hue + 100, 20, 70), hs(hue + 90, 20, 92));
    for (let l = 0; l < 4; l++) {
      ctx.fillStyle = hs(hue + 110, 30 - l * 4, 62 - l * 15);
      for (let x = -20; x < w + 20; x += 14 + R() * 12) {
        const th = h * (0.3 + R() * 0.25) * (1 + l * 0.12);
        const by = h * (0.62 + l * 0.11);
        ctx.beginPath();
        ctx.moveTo(x, by - th);
        ctx.lineTo(x - 14 - l * 3, by);
        ctx.lineTo(x + 14 + l * 3, by);
        ctx.fill();
      }
      const g = ctx.createLinearGradient(0, h * (0.5 + l * 0.1), 0, h * (0.75 + l * 0.1));
      g.addColorStop(0, hs(hue + 90, 20, 92, 0));
      g.addColorStop(1, hs(hue + 90, 20, 92, 0.5));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  } else if (kind === "ice") {
    sky(hs(hue + 190, 40, 88), hs(hue + 200, 50, 62));
    for (let i = 0; i < 14; i++) {
      const x = R() * w, y = h * (0.35 + R() * 0.6), s = 30 + R() * 130;
      ctx.fillStyle = hs(hue + 190 + R() * 20, 40, 50 + R() * 45, 0.9);
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x + s * 0.5, y);
      ctx.lineTo(x - s * 0.4, y + s * 0.2);
      ctx.fill();
    }
  } else if (kind === "rings") {
    sky(hs(hue, 60, 8), hs(hue + 30, 60, 18));
    const cx = w * (0.35 + R() * 0.3), cy = h * (0.35 + R() * 0.3);
    for (let i = 26; i > 0; i--) {
      ctx.strokeStyle = hs(hue + i * 6, 90, 35 + i * 2);
      ctx.lineWidth = 1 + i * 0.25;
      ctx.beginPath();
      ctx.arc(cx + i * R() * 1.5, cy + i * R() * 1.5, i * (w / 36), 0, 7);
      ctx.stroke();
    }
  } else if (kind === "grid") {
    ctx.fillStyle = hs(hue, 10, 94);
    ctx.fillRect(0, 0, w, h);
    const n = 14;
    for (let i = 0; i <= n; i++) {
      ctx.strokeStyle = hs(hue, 80, 20);
      ctx.lineWidth = 1 + R() * 2;
      ctx.beginPath();
      for (let j = 0; j <= 60; j++) {
        const t = j / 60;
        const x = (i / n) * w + Math.sin(t * 6 + seed) * 30 * Math.sin(i + seed);
        j ? ctx.lineTo(x, t * h) : ctx.moveTo(x, 0);
      }
      ctx.stroke();
    }
    ctx.fillStyle = hs(hue + 160, 90, 50);
    ctx.fillRect(w * 0.1, h * 0.72, w * 0.8, h * 0.08);
  } else {
    sky(hs(hue, 70, 12), hs(hue + 60, 80, 30));
    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = hs(hue + i * 4, 90, 60, 0.8);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y = h * 0.5 + (i - 20) * 9 + Math.sin(x * 0.02 + i * 0.3 + seed) * (30 + i) * Math.sin(x * 0.004 + seed);
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  }
  const n = Math.floor((w * h) / 30);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = R() > 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)";
    ctx.fillRect(R() * w, R() * h, 1.5, 1.5);
  }
}

export function makePlateCanvas(seed: number, kind: PlateKind, hue = 30, w = 512, h = 640) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  drawPlate(c.getContext("2d")!, w, h, seed, kind, hue);
  return c;
}

export function Plate({ seed, kind, hue = 30, label, className = "", w = 480, h = 600 }: { seed: number; kind: PlateKind; hue?: number; label: string; className?: string; w?: number; h?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (c) drawPlate(c.getContext("2d")!, w, h, seed, kind, hue);
  }, [seed, kind, hue, w, h]);
  return <canvas ref={ref} width={w} height={h} role="img" aria-label={label} className={"block h-full w-full object-cover " + className} />;
}
