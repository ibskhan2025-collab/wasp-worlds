"use client";
import { useEffect, useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Field, isEmail, post } from "@/rb15l/ui";

type Slot = { time: string; left: number };
export type Booking = { code: string; name: string; date: string; time: string; party: number; table?: string };

const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export type Skin = { input: string; btn: string; ghost?: string; label?: string; card: string; muted: string };

export default function Reserve({ skin, table, onClearTable }: { skin: Skin; table?: string; onClearTable?: () => void }) {
  const [f, setF] = useState({ name: "", email: "", date: "", time: "", party: "2", note: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Booking | null>(null);
  const [books, setBooks] = usePersist<Booking[]>("casa-bookings", []);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date) || f.date < today()) return setSlots(null);
    let live = true;
    fetch(`/api/reservations?date=${f.date}`).then((r) => r.json()).then((d) => live && setSlots(d.slots ?? null)).catch(() => live && setSlots(null));
    return () => { live = false; };
  }, [f.date, done]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Please give us a name to hold the table under.";
    if (!isEmail(f.email)) x.email = "That email doesn't look right.";
    if (!f.date || f.date < today()) x.date = "Choose today or a future date.";
    if (!f.time) x.time = "Choose a time.";
    const p = Number(f.party);
    if (!(p >= 1 && p <= 12)) x.party = "Parties of 1 to 12.";
    setErr(x);
    if (Object.keys(x).length) return;
    setBusy(true);
    const r = await post("/api/reservations", { ...f, party: p, table });
    setBusy(false);
    if (r.ok && r.data.code) {
      const b: Booking = { code: String(r.data.code), name: f.name, date: f.date, time: f.time, party: p, table };
      setBooks((prev) => [b, ...prev].slice(0, 10));
      setDone(b);
      setF({ name: "", email: "", date: "", time: "", party: "2", note: "" });
    } else if (r.data.errors) setErr(r.data.errors as Record<string, string>);
    else setErr({ form: "Could not reach the booking service. Nothing was saved — please try again." });
  };

  if (done)
    return (
      <div className={skin.card + " p-6"} role="status">
        <p className="text-2xl font-bold">Table held. See you {done.date} at {done.time}.</p>
        <p className="mt-2">Reference <b>{done.code}</b> · {done.party} {done.party === 1 ? "guest" : "guests"}{done.table ? ` · ${done.table}` : ""}. Saved to our book and to this device.</p>
        <p className={"mt-2 text-sm " + skin.muted}>CASA is a fictional restaurant — this booking is stored for demonstration only.</p>
        <button onClick={() => setDone(null)} className={(skin.ghost ?? skin.btn) + " mt-4 px-4 py-2"}>Make another</button>
      </div>
    );

  return (
    <div>
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2" aria-label="Reserve a table">
        {table && (
          <p className="sm:col-span-2 text-sm">Requested: <b>{table}</b> {onClearTable && <button type="button" onClick={onClearTable} className="ml-2 underline">clear</button>}</p>
        )}
        <Field label="Name" name="name" value={f.name} onChange={set("name")} error={err.name} autoComplete="name" inputClass={skin.input} />
        <Field label="Email" name="email" type="email" value={f.email} onChange={set("email")} error={err.email} autoComplete="email" inputClass={skin.input} />
        <Field label="Date" name="date" type="date" min={today()} value={f.date} onChange={set("date")} error={err.date} inputClass={skin.input} />
        <div>
          <label htmlFor="f-party" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">Party size</label>
          <select id="f-party" value={f.party} onChange={set("party")} className={"w-full border bg-transparent px-3 py-2.5 text-[15px] " + skin.input}>
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1} className="text-black">{i + 1}</option>)}
          </select>
          {err.party && <p role="alert" className="mt-1 text-xs font-medium text-red-500">{err.party}</p>}
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">Time {!slots && <span className="normal-case tracking-normal">(choose a date to see availability)</span>}</legend>
          <div className="flex flex-wrap gap-2">
            {(slots ?? ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((time) => ({ time, left: 99 }))).map((s) => {
              const full = s.left < Number(f.party);
              return (
                <label key={s.time} className={"cursor-pointer border px-3 py-2 text-sm has-[:focus-visible]:ring-2 " + (f.time === s.time ? skin.btn : skin.input) + (full ? " cursor-not-allowed line-through opacity-40" : "")}>
                  <input type="radio" name="time" value={s.time} disabled={full} checked={f.time === s.time} onChange={set("time")} className="sr-only" />
                  {s.time}{slots && !full && s.left < 12 ? <span className="ml-1 text-[10px] opacity-70">{s.left} left</span> : null}
                </label>
              );
            })}
          </div>
          {err.time && <p role="alert" className="mt-1 text-xs font-medium text-red-500">{err.time}</p>}
        </fieldset>
        <Field className="sm:col-span-2" label="Anything we should know? (optional)" name="note" value={f.note} onChange={set("note")} maxLength={300} hint="Allergies, occasions, high chairs." inputClass={skin.input} />
        {err.form && <p role="alert" className="sm:col-span-2 text-sm font-medium text-red-500">{err.form}</p>}
        <div className="sm:col-span-2"><button disabled={busy} className={skin.btn + " px-6 py-3 font-semibold disabled:opacity-50"}>{busy ? "Checking the book…" : "Reserve table"}</button></div>
      </form>
      {books.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] opacity-70">Your bookings on this device</h3>
          <ul className="mt-2 space-y-1 text-sm">{books.map((b) => <li key={b.code}><b>{b.code}</b> — {b.date} {b.time}, {b.party} guests{b.table ? `, ${b.table}` : ""}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
