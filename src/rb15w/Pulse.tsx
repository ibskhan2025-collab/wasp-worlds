"use client";
import "@fontsource/anton";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePersist, useReducedMotion } from "@/rb15l/hooks";
import { Plate, rng, type PlateKind } from "@/rb15l/plate";
import { Dialog, Field, isEmail, money, post } from "@/rb15l/ui";

type Rel = { id: string; title: string; artist: string; date: string; fmt: string; hue: number; seed: number; kind: PlateKind; bpm: number; minor: boolean; blurb: string; tracks: [string, string][] };
const RELS: Rel[] = [
  { id: "r1", title: "Night Shift Hymns", artist: "Mara Quell", date: "2025-11-07", fmt: "LP", hue: 280, seed: 3, kind: "rings", bpm: 92, minor: true, blurb: "Eight slow songs recorded between midnight and five in a converted bus depot.", tracks: [["Depot Lights", "4:12"], ["Last Tram Out", "3:48"], ["Soft Hours", "5:21"], ["Night Shift", "4:05"], ["Amber", "3:33"], ["Nobody's Home Yet", "4:47"], ["Empty Platform", "2:58"], ["Hymn for the Late Bus", "6:10"]] },
  { id: "r2", title: "Concrete Garden", artist: "FLORA//MACHINE", date: "2026-02-20", fmt: "EP", hue: 120, seed: 8, kind: "grid", bpm: 128, minor: false, blurb: "Four club-ready tracks built from field recordings of a greenhouse in winter.", tracks: [["Seedbed", "5:40"], ["Photosynthesis", "6:12"], ["Root System", "5:58"], ["Canopy (Dub)", "7:04"]] },
  { id: "r3", title: "Salt Ceremony", artist: "Iko Drum Ensemble", date: "2026-04-03", fmt: "LP", hue: 30, seed: 12, kind: "wave", bpm: 104, minor: true, blurb: "Percussion, tape loops and a single borrowed organ. Recorded live to two-inch.", tracks: [["Opening Salt", "3:22"], ["The Long Count", "6:45"], ["Tide Table", "4:30"], ["Borrowed Organ", "5:12"], ["Closing Salt", "3:58"]] },
  { id: "r4", title: "Low Orbit", artist: "Vesna K", date: "2026-05-15", fmt: "12\"", hue: 200, seed: 15, kind: "rings", bpm: 120, minor: true, blurb: "Melancholy techno for the train home. Two sides, no filler.", tracks: [["Low Orbit", "7:10"], ["Signal Loss", "6:32"], ["Re-entry", "8:01"]] },
  { id: "r5", title: "Paper Weather", artist: "The Quiet Electrics", date: "2026-06-26", fmt: "LP", hue: 340, seed: 19, kind: "wave", bpm: 88, minor: false, blurb: "Bedroom pop stretched over a big stereo. Warm, wobbly, honest.", tracks: [["Forecast", "3:05"], ["Umbrella Song", "3:41"], ["Paper Weather", "4:12"], ["Damp", "2:50"], ["Clearing", "3:59"], ["Sun Through Newsprint", "4:28"]] },
  { id: "r6", title: "Afterglow Tapes Vol. 1", artist: "Various Artists", date: "2026-09-18", fmt: "Comp.", hue: 60, seed: 23, kind: "grid", bpm: 112, minor: false, blurb: "Twelve unreleased tracks from the people who keep the label going. Out soon.", tracks: [["Opening (Aisha N.)", "3:30"], ["Sunroom", "4:05"], ["Fourth Floor", "3:44"], ["Halftime", "5:02"]] },
];
const SHOWS = [
  { id: "s1", date: "2026-10-03", city: "MANCHESTER", venue: "THE DEPOT", price: 22, status: "on sale" },
  { id: "s2", date: "2026-10-09", city: "LONDON", venue: "EARTH HACKNEY", price: 28, status: "sold out" },
  { id: "s3", date: "2026-10-16", city: "BRISTOL", venue: "THEKLA", price: 20, status: "few left" },
  { id: "s4", date: "2026-10-23", city: "GLASGOW", venue: "SWG3", price: 24, status: "on sale" },
  { id: "s5", date: "2026-11-06", city: "BERLIN", venue: "TRESOR", price: 30, status: "on sale" },
  { id: "s6", date: "2026-11-13", city: "LISBON", venue: "LUX FRAGIL", price: 26, status: "sold out" },
];
const secs = (t: string) => { const [m, s] = t.split(":").map(Number); return m * 60 + s; };
const fmtRun = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const an = { fontFamily: "Anton, sans-serif" };
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();

function useCountdown(target: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const d = Math.max(0, target - now); return { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
}

function Flap({ text, go }: { text: string; go: boolean }) {
  const [out, setOut] = useState(text.replace(/\S/g, " "));
  useEffect(() => {
    if (!go) { setOut(text); return; }
    const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "; let tick = 0;
    const i = setInterval(() => { tick++; setOut(text.split("").map((c, k) => (tick > 4 + k * 2 ? c : A[Math.floor(Math.random() * A.length)])).join("")); if (tick > 4 + text.length * 2) clearInterval(i); }, 50);
    return () => clearInterval(i);
  }, [text, go]);
  return <span aria-label={text}>{out.split("").map((c, i) => <span key={i} aria-hidden="true" className="mx-px inline-block w-[0.85em] bg-[#1b1b1b] py-1 text-center shadow-[inset_0_-1px_0_#000]">{c === " " ? "\u00a0" : c}</span>)}</span>;
}

function Sound({ reduced }: { reduced: boolean }) {
  const [rid, setRid] = useState("r1"); const [on, setOn] = useState(false); const [vol, setVol] = useState(0.6); const [mute, setMute] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null); const ctxR = useRef<AudioContext | null>(null); const gainR = useRef<GainNode | null>(null); const anR = useRef<AnalyserNode | null>(null); const stop = useRef<() => void>(() => {});
  const rel = RELS.find((r) => r.id === rid)!;
  useEffect(() => { if (gainR.current) gainR.current.gain.value = mute ? 0 : vol; }, [vol, mute]);
  const kill = () => { stop.current(); setOn(false); };
  useEffect(() => () => { stop.current(); ctxR.current?.close(); }, []);
  useEffect(() => { if (on) { kill(); } /* switching release stops playback */ }, [rid]); // eslint-disable-line react-hooks/exhaustive-deps
  const start = async () => {
    if (!ctxR.current) { const c = new AudioContext(); const g = c.createGain(); const a = c.createAnalyser(); a.fftSize = 256; g.connect(a); a.connect(c.destination); ctxR.current = c; gainR.current = g; anR.current = a; }
    const ctx = ctxR.current, out = gainR.current!; await ctx.resume(); gainR.current!.gain.value = mute ? 0 : vol;
    const R = rng(rel.seed * 77), step = 60 / rel.bpm / 4, scale = rel.minor ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9], root = 38 + ((rel.seed * 3) % 10);
    const f = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
    const bass = Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? scale[Math.floor(R() * 3)] : R() > 0.72 ? scale[Math.floor(R() * 5)] : -1));
    const arp = Array.from({ length: 16 }, () => (R() > 0.45 ? scale[Math.floor(R() * 5)] + 24 : -1));
    const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const tone = (type: OscillatorType, fr: number, t: number, d: number, v: number, cut = 2000) => { const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter(); o.type = type; o.frequency.value = fr; fl.type = "lowpass"; fl.frequency.value = cut; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(fl); fl.connect(g); g.connect(out); o.start(t); o.stop(t + d + 0.02); };
    const noise = (t: number, d: number, v: number, hp: number) => { const s = ctx.createBufferSource(), g = ctx.createGain(), fl = ctx.createBiquadFilter(); s.buffer = nb; fl.type = "highpass"; fl.frequency.value = hp; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); s.connect(fl); fl.connect(g); g.connect(out); s.start(t); s.stop(t + d + 0.02); };
    const kick = (t: number) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3); o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.32); };
    let next = ctx.currentTime + 0.06, i = 0;
    const timer = setInterval(() => { while (next < ctx.currentTime + 0.15) { const s = i % 16, bar = Math.floor(i / 16) % 4; if (rel.bpm > 100 ? s % 4 === 0 : s === 0 || s === 8) kick(next); if (s % 2 === 1) noise(next, 0.04, 0.12, 7000); if (s === 4 || s === 12) { noise(next, 0.14, 0.3, 1500); tone("triangle", 190, next, 0.1, 0.25); } if (bass[s] >= 0) tone("sawtooth", f(root + bass[s]), next, step * 1.8, 0.28, 500 + bar * 150); if (arp[s] >= 0) tone("square", f(root + arp[s]), next, step * 0.9, 0.06, 2600); next += step; i++; } }, 25);
    stop.current = () => clearInterval(timer); setOn(true);
  };
  useEffect(() => {
    if (!on) return; let raf = 0; const c = cv.current!, x = c.getContext("2d")!, an = anR.current!, buf = new Uint8Array(an.frequencyBinCount);
    const draw = () => { const W = c.width, H = c.height; an.getByteFrequencyData(buf); x.fillStyle = "rgba(10,10,10,.35)"; x.fillRect(0, 0, W, H); const n = 48, bw = W / n; for (let i = 0; i < n; i++) { const v = buf[i] / 255, h = (reduced ? v * 0.4 : v) * H; x.fillStyle = `hsl(${rel.hue + i * 2},90%,${50 + v * 20}%)`; x.fillRect(i * bw + 1, H - h, bw - 2, h); } raf = requestAnimationFrame(draw); };
    raf = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf);
  }, [on, rel.hue, reduced]);
  return (
    <div className="min-h-[calc(100vh-88px)] bg-[#0a0a0a] p-5 text-white sm:p-10" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <h1 className="text-[clamp(3rem,10vw,9rem)] leading-[0.9]" style={an}>SOUND</h1><p className="mt-2 max-w-xl text-sm text-white/60">Every release owns a seed. Tempo, scale and patterns are generated from it in real time with the Web Audio API — nothing is sampled, nothing autoplays.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <ul className="space-y-2" aria-label="Choose a release">{RELS.map((r) => <li key={r.id}><button aria-pressed={rid === r.id} onClick={() => setRid(r.id)} className={"flex w-full items-center gap-3 border p-2 text-left " + (rid === r.id ? "border-[#e5ff3a]" : "border-white/20")}><div className="h-14 w-14 shrink-0"><Plate seed={r.seed} kind={r.kind} hue={r.hue} label="" w={120} h={120} /></div><span className="text-sm"><b>{r.title}</b><br /><span className="text-white/50">{r.bpm} BPM · {r.minor ? "minor" : "major"}</span></span></button></li>)}</ul>
        <div><canvas ref={cv} width={900} height={320} className="w-full border border-white/20 bg-black" role="img" aria-label={on ? "Live audio spectrum" : "Audio spectrum, silent"} />
          <div className="mt-4 flex flex-wrap items-center gap-4"><button onClick={on ? kill : start} className="bg-[#e5ff3a] px-6 py-3 font-semibold text-black">{on ? "■ Stop" : "▶ Play generative mix"}</button><label className="flex items-center gap-2 text-sm">Volume<input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(+e.target.value)} style={{ accentColor: "#e5ff3a" }} /></label><button aria-pressed={mute} onClick={() => setMute(!mute)} className="border border-white/40 px-3 py-2 text-sm">{mute ? "Unmute" : "Mute"}</button></div>
          <p className="mt-3 text-sm">Now: <b>{rel.title}</b> — {rel.artist}. {on ? "Playing." : "Stopped."}</p></div>
      </div>
    </div>
  );
}

export default function Pulse({ reality }: { reality: string }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>("r2");
  const [rsvp, setRsvp] = usePersist<string[]>("pulse-rsvp", []);
  const [show, setShow] = useState<(typeof SHOWS)[number] | null>(null);
  const [f, setF] = useState({ name: "", email: "", guests: "1" }); const [fe, setFe] = useState<Record<string, string>>({}); const [done, setDone] = useState("");
  const target = useMemo(() => { let t = new Date("2026-09-18T18:00:00Z").getTime(); while (t < Date.now()) t += 28 * 864e5; return t; }, []);
  const cd = useCountdown(target);
  const next = RELS[5];
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!show) return; const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Your name, please."; if (!isEmail(f.email)) x.email = "Enter a valid email.";
    setFe(x); if (Object.keys(x).length) return;
    const r = await post("/api/enquiries", { kind: "rsvp", name: f.name, email: f.email, payload: { show: `${show.city} ${show.date}`, guests: +f.guests, waitlist: show.status === "sold out" } });
    if (r.ok) { setRsvp((p) => [...p, show.id]); setDone(show.status === "sold out" ? `You are on the waitlist for ${show.city}.` : `Got it — ${f.guests} on the list for ${show.city}. Door list, ID required.`); } else setFe({ email: "Could not save. Try again." });
  };
  const RsvpDialog = (
    <Dialog open={!!show} onClose={() => { setShow(null); setDone(""); setFe({}); }} label={`RSVP: ${show?.city ?? ""}`} className="max-w-md bg-[#e5ff3a] text-black">
      {show && <div className="p-6" style={{ fontFamily: "'IBM Plex Mono', monospace" }}><h2 className="text-5xl" style={an}>{show.city}</h2><p className="text-sm">{fmtDate(show.date)} · {show.venue} · {money(show.price)}</p>
        {done ? <><p role="status" className="mt-4">{done}</p><button onClick={() => { setShow(null); setDone(""); }} className="mt-4 bg-black px-5 py-2 text-[#e5ff3a]">Close</button></> : <form onSubmit={submit} noValidate className="mt-4 grid gap-3"><p className="text-sm">{show.status === "sold out" ? "This show is sold out. Join the waitlist and we will email if tickets return." : "Reserve your place on the door list."}</p>
          <Field label="Name" name="rn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={fe.name} inputClass="border-black" /><Field label="Email" name="re" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={fe.email} inputClass="border-black" />
          <label className="text-[11px] font-semibold uppercase tracking-[0.14em]">Guests<select value={f.guests} onChange={(e) => setF({ ...f, guests: e.target.value })} className="mt-1 w-full border border-black bg-transparent px-3 py-2.5 text-[15px] normal-case">{[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select></label>
          <div className="flex gap-2"><button className="flex-1 bg-black px-5 py-3 font-semibold text-[#e5ff3a]">{show.status === "sold out" ? "Join waitlist" : "RSVP"}</button><button type="button" onClick={() => setShow(null)} className="border-2 border-black px-4">Cancel</button></div></form>}</div>}
    </Dialog>
  );

  if (reality === "sound") return <><Sound reduced={reduced} />{RsvpDialog}</>;

  if (reality === "board") return (
    <div className="min-h-[calc(100vh-88px)] bg-[#0b0b0b] p-4 text-[#f5c518] sm:p-10" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <h1 className="text-[clamp(2.5rem,8vw,7rem)] leading-none" style={an}>DEPARTURES</h1><p className="mb-6 text-sm text-white/50">Pulse label tour · autumn 2026 · tap a row to RSVP</p>
      <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-lg sm:text-2xl"><caption className="sr-only">Tour dates</caption><thead className="text-xs uppercase text-white/40"><tr><th className="py-2">Date</th><th>City</th><th>Venue</th><th>Status</th><th><span className="sr-only">RSVP</span></th></tr></thead>
        <tbody>{SHOWS.map((s) => <tr key={s.id} className="border-t border-white/10"><td className="py-3"><Flap text={fmtDate(s.date)} go={!reduced} /></td><td><Flap text={s.city} go={!reduced} /></td><td className="hidden sm:table-cell"><Flap text={s.venue} go={!reduced} /></td><td className={s.status === "sold out" ? "text-red-500" : s.status === "few left" ? "text-orange-400" : "text-green-400"}><Flap text={s.status.toUpperCase()} go={!reduced} /></td><td className="text-right"><button onClick={() => setShow(s)} className="border border-[#f5c518] px-3 py-1.5 text-xs text-[#f5c518] hover:bg-[#f5c518] hover:text-black">{rsvp.includes(s.id) ? "✓ On list" : s.status === "sold out" ? "Waitlist" : "RSVP"}</button></td></tr>)}</tbody></table></div>
      {RsvpDialog}
    </div>
  );

  return (
    <div className="bg-[#e5ff3a] text-black" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <div className="overflow-hidden border-b-4 border-black bg-black py-2 text-[#e5ff3a]" aria-hidden="true"><div className="wasp-marquee flex w-max gap-8 whitespace-nowrap text-sm">{Array.from({ length: 10 }).map((_, i) => <span key={i}>● NEW: {next.title} — {next.artist} ● TOUR OCT–NOV ● VINYL SHIPS FRIDAYS</span>)}</div></div>
      <section className="px-4 pt-6 sm:px-8"><h1 className="select-none text-[34vw] leading-[0.78] sm:text-[24vw]" style={an}>PULSE</h1><p className="mt-2 max-w-md pb-6 text-sm font-semibold">Independent label. Six records, one rule: if it does not make the room move, it does not go out.</p></section>
      <section className="border-y-4 border-black bg-black px-4 py-10 text-[#e5ff3a] sm:px-8" aria-labelledby="cd-h"><p id="cd-h" className="text-xs uppercase tracking-[0.3em]">Next out · {next.title} · {next.artist}</p><div className="mt-2 flex flex-wrap gap-4 sm:gap-8" role="timer" aria-live="off" aria-label={`${cd.d} days ${cd.h} hours ${cd.m} minutes until release`}>{[["DAYS", cd.d], ["HRS", cd.h], ["MIN", cd.m], ["SEC", cd.s]].map(([l, n]) => <div key={l as string}><p className="text-[18vw] leading-none tabular-nums sm:text-[10vw]" style={an}>{String(n).padStart(2, "0")}</p><p className="text-xs">{l}</p></div>)}</div></section>
      <section className="px-4 py-12 sm:px-8" aria-labelledby="rel-h"><h2 id="rel-h" className="text-[16vw] leading-none sm:text-[9vw]" style={an}>RELEASES</h2>
        <ul className="mt-6 border-t-4 border-black">{RELS.map((r) => { const total = r.tracks.reduce((a, t) => a + secs(t[1]), 0), isOpen = open === r.id; return (
          <li key={r.id} className="border-b-4 border-black"><button aria-expanded={isOpen} aria-controls={`t-${r.id}`} onClick={() => setOpen(isOpen ? null : r.id)} className="group grid w-full grid-cols-[72px_1fr_auto] items-center gap-4 py-4 text-left hover:bg-black hover:text-[#e5ff3a] sm:grid-cols-[120px_1fr_auto]"><div className="h-[72px] w-[72px] sm:h-[120px] sm:w-[120px]"><Plate seed={r.seed} kind={r.kind} hue={r.hue} label={`Cover of ${r.title}`} w={240} h={240} /></div><span><span className="block text-4xl uppercase leading-none sm:text-7xl" style={an}>{r.title}</span><span className="text-sm">{r.artist} · {r.fmt} · {new Date(r.date).getFullYear()}</span></span><span className="pr-2 text-2xl" aria-hidden="true">{isOpen ? "−" : "+"}</span></button>
            <div id={`t-${r.id}`} hidden={!isOpen} className="grid gap-6 pb-6 sm:grid-cols-[1fr_1fr]"><p className="text-lg font-semibold">{r.blurb}<br /><span className="text-sm font-normal">Runtime {fmtRun(total)} · {r.tracks.length} tracks · {r.bpm} BPM</span></p><ol className="text-sm">{r.tracks.map(([t, d], i) => <li key={t} className="flex justify-between border-b border-black/30 py-1.5"><span>{String(i + 1).padStart(2, "0")} {t}</span><span>{d}</span></li>)}</ol></div></li>); })}</ul></section>
      <section className="border-t-4 border-black bg-black px-4 py-12 text-[#e5ff3a] sm:px-8" aria-labelledby="tour-h"><h2 id="tour-h" className="text-[16vw] leading-none sm:text-[9vw]" style={an}>TOUR</h2>
        <ul className="mt-6">{SHOWS.map((s) => <li key={s.id} className={"grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-[#e5ff3a]/40 py-4 " + (s.status === "sold out" ? "opacity-70" : "")}><span className="text-3xl sm:text-5xl" style={an}>{fmtDate(s.date)}</span><span><span className="block text-2xl sm:text-4xl" style={an}>{s.city}</span><span className="text-xs">{s.venue} · {money(s.price)} · <b className={s.status === "sold out" ? "text-red-400" : ""}>{s.status.toUpperCase()}</b></span></span><button onClick={() => setShow(s)} className={"px-4 py-2 text-sm font-semibold " + (s.status === "sold out" ? "border border-[#e5ff3a]" : "bg-[#e5ff3a] text-black")}>{rsvp.includes(s.id) ? "✓ On list" : s.status === "sold out" ? "Waitlist" : "RSVP"}</button></li>)}</ul></section>
      {RsvpDialog}
    </div>
  );
}

