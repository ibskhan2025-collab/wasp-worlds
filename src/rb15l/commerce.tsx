"use client";
import { useState } from "react";
import { usePersist } from "@/rb15l/hooks";
import { Dialog, Field, money, post, isEmail } from "@/rb15l/ui";

export type CartItem = { key: string; qty: number };
export type Line = { key: string; title: string; sub?: string; price: number; qty: number };

export function useCart(ns: string) {
  const [items, setItems] = usePersist<CartItem[]>("cart-" + ns, []);
  return {
    items,
    count: items.reduce((a, b) => a + b.qty, 0),
    add: (key: string, qty = 1) => setItems((p) => (p.some((i) => i.key === key) ? p.map((i) => (i.key === key ? { ...i, qty: Math.min(9, i.qty + qty) } : i)) : [...p, { key, qty }])),
    setQty: (key: string, qty: number) => setItems((p) => p.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(9, qty)) } : i))),
    remove: (key: string) => setItems((p) => p.filter((i) => i.key !== key)),
    clear: () => setItems([]),
  };
}

export function useWishlist(ns: string) {
  const [ids, setIds] = usePersist<string[]>("wish-" + ns, []);
  return { ids, has: (id: string) => ids.includes(id), toggle: (id: string) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])) };
}

export type Theme = { panel: string; btn: string; ghost: string; input: string; muted: string; font?: string };

const luhn = (s: string) => {
  const d = s.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(d)) return false;
  let sum = 0;
  d.split("").reverse().forEach((c, i) => {
    let n = +c;
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  });
  return sum % 10 === 0;
};

export function CartPanel({ open, onClose, ns, lines, onQty, onRemove, onClear, theme }: { open: boolean; onClose: () => void; ns: string; lines: Line[]; onQty: (k: string, q: number) => void; onRemove: (k: string) => void; onClear: () => void; theme: Theme }) {
  const [step, setStep] = useState<"cart" | "pay" | "done">("cart");
  const [f, setF] = useState({ name: "", email: "", address: "", card: "", exp: "", cvc: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [order, setOrder] = useState("");
  const [orders, setOrders] = usePersist<{ id: string; total: number; date: string; n: number }[]>("orders-" + ns, []);
  const sub = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const ship = sub === 0 || sub >= 150 ? 0 : 9;
  const total = sub + ship;
  const close = () => { onClose(); if (step === "done") setStep("cart"); };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Full name, please.";
    if (!isEmail(f.email)) x.email = "Enter a valid email.";
    if (f.address.trim().length < 8) x.address = "Delivery address is too short.";
    if (!luhn(f.card)) x.card = "Card number fails the checksum. Test number: 4242 4242 4242 4242.";
    const m = /^(\d{2})\/(\d{2})$/.exec(f.exp);
    if (!m || +m[1] < 1 || +m[1] > 12 || 2000 + +m[2] < new Date().getFullYear() || (2000 + +m[2] === new Date().getFullYear() && +m[1] < new Date().getMonth() + 1)) x.exp = "Use MM/YY, in the future.";
    if (!/^\d{3,4}$/.test(f.cvc)) x.cvc = "3 or 4 digits.";
    setErr(x);
    if (Object.keys(x).length) return;
    const id = ns.toUpperCase().slice(0, 3) + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setOrder(id);
    setOrders((p) => [{ id, total, date: new Date().toISOString(), n: lines.reduce((a, l) => a + l.qty, 0) }, ...p].slice(0, 20));
    post("/api/enquiries", { kind: "order", name: f.name, email: f.email, payload: { id, total, lines: lines.map((l) => `${l.qty}× ${l.title}`), simulated: true } });
    onClear();
    setStep("done");
  };

  return (
    <Dialog open={open} onClose={close} label="Shopping bag" className={"max-w-lg " + theme.panel}>
      <div className="p-6" style={{ fontFamily: theme.font }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{step === "cart" ? "Your bag" : step === "pay" ? "Checkout" : "Order placed"}</h2>
          <button onClick={close} className={theme.ghost + " px-3 py-1 text-sm"} aria-label="Close bag">Close</button>
        </div>
        {step === "cart" && (
          <>
            {lines.length === 0 ? <p className={"mt-6 " + theme.muted}>Your bag is empty.{orders.length > 0 && ` Last order: ${orders[0].id}.`}</p> : (
              <ul className="mt-5 divide-y divide-current/15">
                {lines.map((l) => (
                  <li key={l.key} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1"><p className="truncate font-semibold">{l.title}</p>{l.sub && <p className={"text-xs " + theme.muted}>{l.sub}</p>}<p className="text-sm">{money(l.price)}</p></div>
                    <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${l.title}`}>
                      <button className={theme.ghost + " h-9 w-9"} onClick={() => onQty(l.key, l.qty - 1)} aria-label="Decrease">−</button>
                      <span className="w-6 text-center" aria-live="polite">{l.qty}</span>
                      <button className={theme.ghost + " h-9 w-9"} onClick={() => onQty(l.key, l.qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <button className="text-xs underline" onClick={() => onRemove(l.key)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <dl className="mt-5 space-y-1 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(sub)}</dd></div>
              <div className="flex justify-between"><dt>Delivery {sub >= 150 && "(free over £150)"}</dt><dd>{ship ? money(ship) : "Free"}</dd></div>
              <div className="flex justify-between border-t border-current/20 pt-2 text-base font-bold"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
            <button disabled={!lines.length} onClick={() => setStep("pay")} className={theme.btn + " mt-5 w-full px-4 py-3 font-semibold disabled:opacity-40"}>Continue to checkout</button>
          </>
        )}
        {step === "pay" && (
          <form onSubmit={submit} noValidate className="mt-4 grid gap-3">
            <p className={"text-xs " + theme.muted}>Simulation. No payment is taken. The card number is checked locally and never stored or sent.</p>
            <Field label="Full name" name="name" value={f.name} onChange={set("name")} error={err.name} autoComplete="name" inputClass={theme.input} />
            <Field label="Email" name="email" type="email" value={f.email} onChange={set("email")} error={err.email} autoComplete="email" inputClass={theme.input} />
            <Field label="Delivery address" name="address" value={f.address} onChange={set("address")} error={err.address} autoComplete="street-address" inputClass={theme.input} />
            <Field label="Card number" name="card" inputMode="numeric" value={f.card} onChange={set("card")} error={err.card} autoComplete="off" placeholder="4242 4242 4242 4242" inputClass={theme.input} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry (MM/YY)" name="exp" value={f.exp} onChange={set("exp")} error={err.exp} placeholder="08/29" inputClass={theme.input} />
              <Field label="CVC" name="cvc" inputMode="numeric" value={f.cvc} onChange={set("cvc")} error={err.cvc} inputClass={theme.input} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep("cart")} className={theme.ghost + " px-4 py-3"}>Back</button>
              <button type="submit" className={theme.btn + " flex-1 px-4 py-3 font-semibold"}>Pay {money(total)} (simulated)</button>
            </div>
          </form>
        )}
        {step === "done" && (
          <div className="mt-5">
            <p className="text-lg">Thank you. Order <b>{order}</b> is recorded.</p>
            <p className={"mt-2 text-sm " + theme.muted}>This was a simulation: nothing was charged and nothing will ship. The order reference is saved in this browser.</p>
            <button onClick={close} className={theme.btn + " mt-5 px-5 py-3 font-semibold"}>Keep browsing</button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
