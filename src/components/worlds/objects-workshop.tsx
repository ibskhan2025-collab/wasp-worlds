"use client";

import Link from "next/link";
import { WorldNavLink } from "@/components/wasp/world-wipe";
import { useState } from "react";
import { WorldExit } from "@/components/wasp/world-exit";
import { WorldProof } from "@/components/worlds/world-proof";
import { WORKSHOP_MAKERS, WORKSHOP_OBJS, type WorkshopObj } from "@/data/objects-workshop";
import { media } from "@/lib/media";
import { money, useCart } from "@/lib/use-cart";
import Shelf, { Viewer } from "@/components/worlds/objects-lathe";

const CAT_IMAGE: Record<string, string> = {
  Ceramics: media.objects.vases,
  Wood: media.objects.woodChair,
  Glass: media.objects.lamp,
  Metal: media.objects.bowl,
};

function wsAdd(cart: ReturnType<typeof useCart>, o: WorkshopObj) {
  cart.add({ id: `workshop-${o.id}`, name: o.name, price: o.price, qty: 1, image: CAT_IMAGE[o.cat] ?? media.objects.vases });
}

function WorkshopBuy({ o, label }: { o: WorkshopObj; label?: string }) {
  const cart = useCart("objects");
  const [msg, setMsg] = useState("");
  return (
    <span>
      <button
        type="button"
        onClick={() => {
          wsAdd(cart, o);
          setMsg(`Added ${o.name}.`);
        }}
        style={{ textDecoration: "underline" }}
      >
        {label ?? "add"}
      </button>
      <span role="status" style={{ marginLeft: 8, fontSize: "0.85rem" }}>{msg}</span>
    </span>
  );
}

export function ObjectsWorkshop() {
  return (
    <div style={{ background: "#f0e9dc", color: "#2a2118", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/WORKSHOP" />
      <ObjectsNav current="workshop" />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em" }}>START WITH THE MAKER, THEN THE OBJECT</p>
        <h1 style={{ fontSize: "clamp(2.8rem, 9vw, 6rem)", fontWeight: 400, margin: "8px 0" }}>Meet the hands.</h1>
        <p style={{ fontStyle: "italic", color: "#6b5a44" }}>Four workshops, ten pieces. Every piece below adds to the same bag as the shop.</p>
        {WORKSHOP_MAKERS.map((m, i) => {
          const mine = WORKSHOP_OBJS.filter((o) => o.maker === m.id);
          return (
            <section key={m.id} style={{ marginTop: 40, background: i % 2 ? "#e2d5bd" : "transparent", padding: i % 2 ? 24 : 0 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#6b5a44", margin: 0 }}>
                0{i + 1} · {m.craft} · {m.place}
              </p>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 400, margin: "8px 0" }}>{m.name}</h2>
              <p style={{ maxWidth: "62ch", lineHeight: 1.6 }}>{m.story}</p>
              <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, margin: "20px 0 0", padding: 0 }}>
                {mine.map((o) => (
                  <li key={o.id} style={{ border: "1px solid rgba(42,33,24,0.3)", padding: 16, background: "#faf7f0" }}>
                    <p style={{ fontSize: "1.2rem", margin: "0 0 4px" }}>{o.name}</p>
                    <p style={{ fontSize: "0.85rem", color: "#6b5a44", margin: "0 0 8px" }}>{o.desc}</p>
                    <p style={{ margin: 0 }}>
                      {money(o.price)} · <WorkshopBuy o={o} />
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <p style={{ marginTop: 32 }}>
          <Link href="/worlds/objects/cart" style={{ background: "#2a2118", color: "#f0e9dc", padding: "12px 24px", fontSize: 12, letterSpacing: "0.15em" }}>
            OPEN THE BAG →
          </Link>
        </p>
      </div>
      <WorldProof
        proves="Provenance converts: hands first, objects second — same till throughout."
        relatedHref="/worlds/noir"
        relatedName="NOIR"
      />
    </div>
  );
}

export function ObjectsInspect() {
  const [sel, setSel] = useState<string | null>(null);
  const cart = useCart("objects");
  const [msg, setMsg] = useState("");
  const selObj = WORKSHOP_OBJS.find((x) => x.id === sel) ?? null;
  const maker = (id: string) => WORKSHOP_MAKERS.find((m) => m.id === id)!;
  return (
    <div style={{ background: "#e8e0d2", color: "#2a2118", minHeight: "100dvh", fontFamily: "Georgia, serif" }}>
      <WorldExit id="objects" label="Room 06 · OBJECTS/INSPECT" />
      <ObjectsNav current="inspect" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
        <div style={{ height: "62vh", minHeight: 380 }}>
          <Shelf items={WORKSHOP_OBJS} sel={sel} onSel={setSel} />
        </div>
        <aside style={{ padding: 20, maxWidth: 720 }} aria-label="Selected object">
          <p style={{ fontSize: 11, letterSpacing: "0.2em", color: "#6b5a44", margin: 0 }}>DRAG TO LOOK AROUND · TAP AN OBJECT</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {WORKSHOP_OBJS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={sel === o.id}
                onClick={() => setSel(o.id)}
                style={{
                  border: "1px solid #2a2118",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 12,
                  background: sel === o.id ? "#2a2118" : "transparent",
                  color: sel === o.id ? "#f0e9dc" : "#2a2118",
                }}
              >
                {o.name}
              </button>
            ))}
          </div>
          {selObj ? (
            <div style={{ marginTop: 24, display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div style={{ height: 300 }}>
                <Viewer o={selObj} />
              </div>
              <div>
                <h2 style={{ fontSize: "2rem", fontWeight: 400, margin: 0 }}>{selObj.name}</h2>
                <p style={{ fontSize: "0.9rem", color: "#6b5a44" }}>
                  {maker(selObj.maker).name} · {selObj.cat}
                </p>
                <p>{selObj.desc}</p>
                <p style={{ fontSize: "1.6rem" }}>{money(selObj.price)}</p>
                <button
                  type="button"
                  onClick={() => {
                    wsAdd(cart, selObj);
                    setMsg(`Added ${selObj.name} to the bag.`);
                  }}
                  style={{ background: "#2a2118", color: "#f0e9dc", padding: "12px 24px", fontWeight: 700, border: 0 }}
                >
                  Add to bag
                </button>
                <p role="status" style={{ fontSize: "0.9rem" }}>{msg}</p>
                <p style={{ fontSize: "0.8rem", color: "#6b5a44" }}>
                  Each object is turned on a lathe from the same profile curve as its 3D view. Delivery 3–5 days; free over $150. 30-day returns.
                </p>
              </div>
            </div>
          ) : (
            <p style={{ color: "#6b5a44" }}>Each object is turned on a lathe from the same profile curve used above. Select one to bring it to the front.</p>
          )}
        </aside>
      </div>
      <WorldProof
        proves="Inspection as interface: profile curves you can spin before you spend."
        relatedHref="/worlds/forge"
        relatedName="FORGE"
      />
    </div>
  );
}

export function ObjectsNav({ current }: { current: string }) {
  return (
    <nav aria-label="OBJECTS realities" style={{ display: "flex", gap: 2, alignItems: "center", background: "#141210", color: "#efeae2", borderBottom: "1px solid rgba(239,234,226,0.2)", padding: "0 12px", overflowX: "auto" }}>
      <Link href="/worlds/objects" style={{ padding: "12px 8px", letterSpacing: "0.2em", fontSize: 12, fontWeight: 800 }}>
        OBJECTS◌
      </Link>
      {[
        ["classic", "Bone", "/worlds/objects"],
        ["workshop", "Workshop", "/worlds/objects/workshop"],
        ["inspect", "3D Shelf", "/worlds/objects/inspect"],
      ].map(([id, label, href]) => (
        <WorldNavLink
          world="objects"
          label={label}
          key={id}
          href={href}
          aria-current={current === id ? "page" : undefined}
          style={{
            padding: "12px 12px",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: current === id ? "#141210" : "#efeae2",
            background: current === id ? "#e2c08d" : "transparent",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </WorldNavLink>
      ))}
      <Link href="/worlds/objects/cart" style={{ marginLeft: "auto", padding: "12px 8px", fontSize: 12 }}>
        Cart →
      </Link>
    </nav>
  );
}
