"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { forgeProducts } from "@/data/forge";
import { loadJson, saveJson } from "@/lib/storage";
import { track } from "@/lib/track";
import { Consent } from "@/components/consent";
import { Honeypot, hpValue } from "@/components/honeypot";

const LIST_KEY = "wasp-v11-forge-list";

function Builder() {
  const search = useSearchParams();
  const [list, setList] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [done, setDone] = useState("");

  useEffect(() => {
    const slugs = loadJson<string[]>(LIST_KEY, []);
    const base: Record<string, number> = {};
    for (const s of slugs) base[s] = 100;
    const add = search.get("add");
    if (add && forgeProducts.some((p) => p.slug === add)) base[add] = base[add] ?? 100;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList(base);
  }, [search]);

  const rows = useMemo(() => Object.entries(list).map(([slug, qty]) => ({ p: forgeProducts.find((x) => x.slug === slug), qty })).filter((r) => r.p !== undefined), [list]);
  const lines = rows.length;

  async function send() {
    if (!name.trim() || !email.includes("@") || !company.trim()) {
      setDone("Name, company and a valid email — purchasing needs all three.");
      return;
    }
    if (!rows.length) {
      setDone("Pick at least one part first.");
      return;
    }
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        website: hpValue(),
        name, email, company,
        brief: `FORGE quote: ${rows.map((r) => `${r.p!.name} × ${r.qty}`).join(", ")}`,
        source: "forge",
      }),
    });
    if (res.ok) {
      saveJson(LIST_KEY, []);
      setList({});
      track("inquiry_submitted", { source: "forge" });
      setDone("Sent. A human replies within one working day, with numbers.");
    } else setDone("Could not send. Try again.");
  }

  return (
    <div className="orbit-root">
      <WorldExit id="forge" label="Room 11 · FORGE" />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 80px" }}>
        <Link href="/worlds/forge" className="kicker">← Catalogue</Link>
        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", letterSpacing: "-0.04em", margin: "8px 0" }}>Quote</h1>
        <p className="kicker">Question 1 of 3 — the parts</p>
        {rows.length === 0 ? (
          <p><Link href="/worlds/forge">Pick parts from the catalogue</Link> first.</p>
        ) : (
          rows.map(({ p, qty }) => (
            <div key={p!.slug} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "14px 0", borderTop: "1px solid var(--line)", alignItems: "center" }}>
              <div>
                <strong>{p!.name}</strong>
                <div className="kicker">{p!.tolerance} · {p!.lead}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button type="button" className="ghost" aria-label={`Fewer ${p!.name}`} onClick={() => setList((l) => ({ ...l, [p!.slug]: Math.max(10, (l[p!.slug] ?? 100) - 10) }))}>−</button>
                <span aria-live="polite">{qty}</span>
                <button type="button" className="ghost" aria-label={`More ${p!.name}`} onClick={() => setList((l) => ({ ...l, [p!.slug]: Math.min(10000, (l[p!.slug] ?? 100) + 10) }))}>+</button>
                <button type="button" className="ghost" onClick={() => setList((l) => { const n = { ...l }; delete n[p!.slug]; return n; })}>Remove</button>
              </div>
            </div>
          ))
        )}
        <p className="kicker" style={{ marginTop: 24 }}>Question 2 of 3 — who you are</p>
        <div className="grid-2">
          <label className="field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <label className="field"><span>Company</span><input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" /></label>
        </div>
        <label className="field"><span>Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
        <p className="kicker">Question 3 of 3 — press the button</p>
        <button className="btn" type="button" onClick={send}>Request quote ({lines} {lines === 1 ? "line" : "lines"})</button>
        <Honeypot />
        <Consent />
        {done ? <p style={{ marginTop: 16 }}>{done}</p> : null}
      </div>
    </div>
  );
}

export function QuoteBuilder() {
  return (
    <Suspense fallback={<p style={{ padding: 24 }}>Loading the bench…</p>}>
      <Builder />
    </Suspense>
  );
}
