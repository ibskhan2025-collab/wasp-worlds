"use client";

import { useEffect, useState } from "react";

function fmt(ms: number) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}

export function Countdown({ date, tracks, total }: { date: string; tracks: number; total: string }) {
  const [left, setLeft] = useState<string | null>(() => {
    const ms = new Date(date).getTime() - Date.now();
    return ms <= 0 ? null : fmt(ms);
  });
  useEffect(() => {
    const target = new Date(date).getTime();
    const tick = () => {
      const ms = target - Date.now();
      setLeft(ms <= 0 ? null : fmt(ms));
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, [date]);
  if (left === null) {
    return <p className="kicker" style={{ color: "#3ddc84" }}>Out now · {tracks} tracks · {total}</p>;
  }
  return <p style={{ fontFamily: "var(--font-poster)", fontSize: "2rem", color: "#e23a3a", margin: "12px 0" }} aria-live="off">{left}</p>;
}
