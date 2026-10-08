"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/rb54l/media";
import { Img } from "@/rb54l/ui";
import { useSubmit, emailOk } from "@/rb54l/kit";
type XP = { reality: string; world?: unknown };

// All releases, artists and dates are fictional.
const RELEASES = [
  { id: "p01", artist: "Harbour Static", title: "Low Tide Signals", bpm: 122, root: 45, p: media.pulse.room, tracks: [["Undertow", "4:12", [0, 3, 7, 10]], ["Salt Glass", "5:01", [0, 5, 7, 12]], ["Night Ferry", "3:48", [0, 3, 5, 10]]] as const },
  { id: "p02", artist: "Mira Kent", title: "Paper Suns", bpm: 96, root: 50, p: media.pulse.stage, tracks: [["Paper Suns", "3:30", [0, 4, 7, 11]], ["Tin Roof", "4:05", [0, 2, 7, 9]]] as const },
  { id: "p03", artist: "DELTA DELTA", title: "Pressure EP", bpm: 138, root: 40, p: media.pulse.stadium, tracks: [["Pressure", "6:20", [0, 0, 7, 3]], ["Hold", "5:44", [0, 7, 10, 12]], ["Release", "7:02", [0, 3, 10, 7]]] as const },
];
const SHOWS = [["s1", "Lisbon", "Musicbox", 14], ["s2", "Berlin", "Panke", 21], ["s3", "Istanbul", "Salon İKSV", 30], ["s4", "London", "Corsica Studios", 38]] as const;

function nextDrop() { const d = new Date(); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7)); d.setHours(0, 0, 0, 0); return d; }

export default function Pulse({ reality }: XP) {
  const club = reality === "club";
  const [playing, setPlaying] = useState<string | null>(null);
  const [vol, setVol] = useState(0.5);
  const [beat, setBeat] = useState(0);
  const ac = useRef<AudioContext | null>(null); const gain = useRef<GainNode | null>(null); const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [left, setLeft] = useState("");
  const drop = useRef(nextDrop());

  useEffect(() => {
    const t = setInterval(() => { const ms = drop.current.getTime() - Date.now(); const d = Math.floor(ms / 864e5), h = Math.floor((ms / 36e5) % 24), m = Math.floor((ms / 6e4) % 60), s = Math.floor((ms / 1e3) % 60); setLeft(`${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`); }, 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (gain.current) gain.current.gain.value = vol * 0.25; }, [vol]);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); ac.current?.close(); }, []);

  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; setPlaying(null); };
  const play = (rid: string, ti: number) => {
    const key = `${rid}:${ti}`; if (playing === key) return stop();
    stop();
    const r = RELEASES.find((x) => x.id === rid)!; const notes = r.tracks[ti][2];
    ac.current ??= new AudioContext(); const ctx = ac.current; ctx.resume();
    if (!gain.current) { gain.current = ctx.createGain(); gain.current.connect(ctx.destination); }
    gain.current.gain.value = vol * 0.25;
    const step = 60 / r.bpm / 2; let i = 0; let next = ctx.currentTime + 0.05;
    const tick = () => {
      while (next < ctx.currentTime + 0.12) {
        const n = notes[i % notes.length]; const f = 440 * Math.pow(2, (r.root + n + (i % 8 >= 4 ? 12 : 0) - 69) / 12);
        const o = ctx.createOscillator(), g = ctx.createGain(), flt = ctx.createBiquadFilter(); o.type = "sawtooth"; o.frequency.value = f; flt.type = "lowpass"; flt.frequency.value = 900 + (i % 4) * 300;
        g.gain.setValueAtTime(0.0001, next); g.gain.exponentialRampToValueAtTime(0.5, next + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, next + step * 0.9);
        o.connect(flt).connect(g).connect(gain.current!); o.start(next); o.stop(next + step);
        if (i % 2 === 0) { const k = ctx.createOscillator(), kg = ctx.createGain(); k.frequency.setValueAtTime(140, next); k.frequency.exponentialRampToValueAtTime(40, next + 0.12); kg.gain.setValueAtTime(0.9, next); kg.gain.exponentialRampToValueAtTime(0.0001, next + 0.15); k.connect(kg).connect(gain.current!); k.start(next); k.stop(next + 0.16); const at = (next - ctx.currentTime) * 1000; setTimeout(() => setBeat((b) => b + 1), at); }
        next += step; i++;
      }
    };
    tick(); timer.current = setInterval(tick, 25); setPlaying(key);
  };

  const bg = club ? "#07060a" : "#ff2e2e"; const fg = club ? "#f5f5f5" : "#0a0a0a";
  const pulse = club && playing ? (beat % 2 ? 1 : 0) : 0;
  return (
    <div style={{ background: bg, color: fg, fontFamily: "'Archivo Black', sans-serif" }} className="relative overflow-hidden pb-12">
      {club && <div aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-100" style={{ opacity: pulse ? 0.35 : 0.08, background: "radial-gradient(60% 50% at 50% 0%, #ff2e8a, transparent 70%)" }} />}
      <div className="relative flex flex-wrap items-end justify-between gap-4 px-5 pt-8 md:px-10">
        <div><p className="mono opacity-70">Next release · Harbour Static — “Low Tide Signals”</p><p className="text-[13vw] leading-none tracking-tighter md:text-[8vw]" style={{ transform: `scale(${1 + pulse * 0.015})` }} aria-live="off">{left || "—"}</p></div>
        <div className="mono flex items-center gap-3"><span>Volume</span><input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(+e.target.value)} aria-label="Preview volume" className="accent-black" />{playing && <button onClick={stop} className="border border-current px-2 py-1">■ Stop</button>}</div>
      </div>
      <p className="mono relative px-5 pt-2 opacity-70 md:px-10">Previews are synthesised live with Web Audio — no files, and nothing plays until you press.</p>

      <div className="relative mt-8 grid gap-px md:grid-cols-3" style={{ background: fg + "22" }}>
        {RELEASES.map((r) => (
          <article key={r.id} style={{ background: bg }} className="p-5">
            <div className="relative"><Img p={r.p} className={`aspect-square ${club ? "" : "grayscale contrast-150 mix-blend-multiply"}`} caption />
              <span className="absolute left-2 top-2 bg-black px-2 py-1 text-xs text-white">{r.bpm} BPM</span></div>
            <p className="mt-3 text-sm uppercase">{r.artist}</p><h3 className="text-3xl uppercase leading-none">{r.title}</h3>
            <ol className="mono mt-3">{r.tracks.map((t, i) => { const on = playing === `${r.id}:${i}`; return (
              <li key={t[0]}><button onClick={() => play(r.id, i)} aria-pressed={on} className="flex w-full items-center justify-between border-t py-2 text-left" style={{ borderColor: fg + "33" }} data-cursor={on ? "STOP" : "PLAY"}>
                <span>{on ? "■" : "▶"} {String(i + 1).padStart(2, "0")} {t[0]}</span><span className="opacity-60">{t[1]}</span></button></li>); })}</ol>
          </article>
        ))}
      </div>
      <Tour fg={fg} bg={bg} />
    </div>
  );
}

function Tour({ fg, bg }: { fg: string; bg: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<string | null>(null); const [email, setEmail] = useState("");
  const s = useSubmit("pulse-rsvp");
  useEffect(() => { fetch("/api/submit?kind=pulse-rsvp").then((r) => r.json()).then((j) => setCounts(j.counts ?? {})).catch(() => {}); }, [s.state]);
  const date = (d: number) => { const x = new Date(); x.setDate(x.getDate() + d); return x.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); };
  return (
    <section className="relative px-5 pt-14 md:px-10" aria-labelledby="tour-h">
      <h3 id="tour-h" className="text-6xl uppercase">Tour</h3>
      <ul className="mt-4">{SHOWS.map(([id, city, venue, d]) => (
        <li key={id} className="border-t py-4" style={{ borderColor: fg + "44" }}>
          <div className="flex flex-wrap items-center gap-4"><span className="mono w-20">{date(d)}</span><span className="flex-1 text-3xl uppercase">{city}</span><span className="mono opacity-70">{venue} · {counts[id] ?? 0} going</span>
            <button onClick={() => { setOpen(open === id ? null : id); s.reset(); }} className="mono px-3 py-2" style={{ background: fg, color: bg }}>RSVP</button></div>
          {open === id && (s.state === "done" ? <p className="mono mt-3">You&apos;re on the list for {city} — ref {s.ref}. (Fictional show; the RSVP is real.)</p> :
            <form noValidate className="mt-3 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); s.send({ email, show: id, city }, emailOk(email) ? {} : { email: "Add a full email address so we can send the ticket link." }); }}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" aria-label={`Email for ${city} RSVP`} aria-invalid={!!s.errors.email} className="mono flex-1 border-2 bg-transparent px-2 py-2" style={{ borderColor: fg }} autoFocus />
              <button className="mono px-3" style={{ background: fg, color: bg }}>{s.state === "sending" ? "…" : "Confirm"}</button>
            </form>)}
          {open === id && s.errors.email && <p className="mono mt-1" role="alert">{s.errors.email}</p>}
        </li>))}</ul>
    </section>
  );
}
