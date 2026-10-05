import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ROUTES } from "@/zip/evo/operator";
import { buildIndex } from "@/zip/evo/live";

export function generateStaticParams() { return [{ mode: "30" }, { mode: "deep" }]; }
export const metadata: Metadata = { title: "A route through WASP", robots: { index: false } };

export default async function Tour({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (mode !== "30" && mode !== "deep") notFound();
  const route = mode === "30" ? ROUTES.thirty : ROUTES.deep;
  const idx = buildIndex();
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 md:px-6">
      <p className="mono text-ink-2">{mode === "30" ? "I have 30 seconds" : "I have time"}</p>
      <h1 className="display mt-3 text-7xl">{mode === "30" ? "Five stops. Go." : "The long way round."}</h1>
      <ol className="mt-10 divide-y divide-ink border-y border-ink">
        {route.map((r, i) => { const e = idx.find((x) => x.href === r.href.split("#")[0]); return (
          <li key={r.href}><Link href={r.href} className="group flex items-baseline gap-6 py-5" data-cursor="GO">
            <span className="mono w-8 text-ink-2">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1"><span className="text-3xl font-semibold group-hover:underline">{e?.title ?? r.href}</span><span className="mt-1 block text-ink-2">{r.why}</span></span>
            <span className="mono">→</span></Link></li>); })}
      </ol>
      <p className="mt-8 text-ink-2">{mode === "30" ? "That's it. If one of those made you think of your own project:" : "Take it in any order. When you're done:"} <Link href="/start" className="underline">start one →</Link></p>
    </div>
  );
}
