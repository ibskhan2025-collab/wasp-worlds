"use client";
import { useEffect, useRef, type ReactNode, type InputHTMLAttributes } from "react";

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");
export const money = (n: number) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export async function post(url: string, body: unknown) {
  try {
    const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, data };
  } catch {
    return { ok: false, status: 0, data: {} as Record<string, unknown> };
  }
}

export function download(name: string, text: string, mime = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function Dialog({ open, onClose, label, children, className = "", z = 90 }: { open: boolean; onClose: () => void; label: string; children: ReactNode; className?: string; z?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const focusables = () => Array.from(el?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close.current();
      }
      if (e.key === "Tab") {
        const n = focusables();
        if (!n.length) return;
        const a = n[0];
        const b = n[n.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const o = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = o;
      prev?.focus();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6" style={{ zIndex: z }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={label} className={"relative max-h-[92vh] w-full overflow-auto " + className}>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, error, hint, className = "", inputClass = "", ...p }: { label: string; error?: string; hint?: string; className?: string; inputClass?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = "f-" + (p.name ?? label).replace(/\W/g, "");
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
        {label}
      </label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? id + "-e" : hint ? id + "-h" : undefined} className={"w-full border bg-transparent px-3 py-2.5 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-current " + inputClass} {...p} />
      {hint && !error && (
        <p id={id + "-h"} className="mt-1 text-xs opacity-60">
          {hint}
        </p>
      )}
      {error && (
        <p id={id + "-e"} role="alert" className="mt-1 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function Magnetic({ children, className = "", strength = 0.3 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className={"inline-block transition-transform duration-200 ease-out " + className}
      onPointerMove={(e) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || e.pointerType === "touch") return;
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </span>
  );
}
