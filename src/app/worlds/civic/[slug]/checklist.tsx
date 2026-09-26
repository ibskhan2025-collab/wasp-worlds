"use client";

import { useEffect, useState } from "react";
import { loadJson, saveJson } from "@/lib/storage";

export function Checklist({ slug, steps }: { slug: string; steps: { t: string; b: string }[] }) {
  const key = `wasp-v11-civic-done-${slug}`;
  const [done, setDone] = useState<number[]>([]);

  // Hydrate persisted checklist after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(loadJson<number[]>(key, []));
  }, [key]);
  useEffect(() => {
    saveJson(key, done);
  }, [key, done]);

  function toggle(i: number) {
    setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  }

  return (
    <div style={{ marginTop: 24 }}>
      <p className="kicker" aria-live="polite">{done.length} of {steps.length} done</p>
      {steps.map((s, i) => (
        <div key={s.t} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, padding: "16px 0", borderTop: "1px solid var(--line)" }}>
          <input
            type="checkbox"
            checked={done.includes(i)}
            onChange={() => toggle(i)}
            aria-label={`Mark done: ${s.t}`}
            style={{ width: 22, height: 22, marginTop: 2 }}
          />
          <div style={{ opacity: done.includes(i) ? 0.55 : 1 }}>
            <strong>Step {i + 1} · {s.t}</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.55 }}>{s.b}</p>
          </div>
        </div>
      ))}
      {done.length === steps.length ? <p><strong>Done.</strong> That&apos;s the whole process — no hidden step five.</p> : null}
    </div>
  );
}
