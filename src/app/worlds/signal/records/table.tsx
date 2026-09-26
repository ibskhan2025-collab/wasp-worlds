"use client";

import { useEffect, useState } from "react";
import { loadJson, saveJson } from "@/lib/storage";

type Row = { score: number; diff: string; when: string };

const BOARD_KEY = "wasp-v11-signal-board";

export function RecordsTable() {
  const [board, setBoard] = useState<Row[]>([]);
  const [name, setName] = useState("");

  // Hydrate persisted wall after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBoard(loadJson<Row[]>(BOARD_KEY, []));
  }, []);
  useEffect(() => {
    saveJson(BOARD_KEY, board);
  }, [board]);

  const bests = loadJson<Record<string, number>>("wasp-signal-bests", {});
  const diffs = ["Calm", "Sharp", "Brutal"];

  function claim(diff: string) {
    const tag = name.trim().slice(0, 16) || "ANON";
    const score = bests[diff] ?? 0;
    if (score <= 0) return;
    setBoard((b) => [...b, { score, diff, when: `${tag}` }].sort((a, z) => z.score - a.score).slice(0, 10));
  }

  return (
    <div>
      <table className="orbit-table" style={{ ["--line" as string]: "#e8b86d44" }}>
        <thead><tr><th>Difficulty</th><th>House best</th><th></th></tr></thead>
        <tbody>
          {diffs.map((d) => (
            <tr key={d}>
              <td>{d}</td>
              <td>{bests[d] ?? 0}</td>
              <td>
                {(bests[d] ?? 0) > 0 ? (
                  <button type="button" className="ghost" onClick={() => claim(d)}>Claim</button>
                ) : <span className="kicker">unplayed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <label className="field" style={{ marginTop: 16, maxWidth: 320 }}>
        <span>Tag for the wall</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ANON" maxLength={16} />
      </label>
      {board.length ? (
        <div style={{ marginTop: 8 }}>
          <p className="kicker">The wall</p>
          {board.map((r, i) => (
            <div key={`${r.diff}-${r.score}-${i}`} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #e8b86d44" }}>
              <span>#{i + 1} · {r.when} · {r.diff}</span>
              <strong>{r.score}</strong>
            </div>
          ))}
          <button type="button" className="ghost" style={{ marginTop: 12 }} onClick={() => setBoard([])}>Wipe the wall</button>
        </div>
      ) : (
        <p className="kicker" style={{ marginTop: 16 }}>No claims yet. Play, set a best, claim it.</p>
      )}
    </div>
  );
}
