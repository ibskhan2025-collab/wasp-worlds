import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReality } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";
import { getRenderer } from "@/components/worlds/registry";

/**
 * Generic reality router: /worlds/noir/brutalist etc.
 * Static routes (collection, shop, ...) always win over this segment.
 * Only declared realities with a registered renderer resolve —
 * everything else is a 404, never a silent classic.
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string; reality: string }> }): Promise<Metadata> {
  const { id: world, reality } = await params;
  const meta = WORLDS.find((w) => w.id === world);
  const real = getReality(world as never, reality);
  if (!meta || !real || !getRenderer(world, reality)) return { title: "Reality not found — WASP" };
  return {
    title: `${meta.name} ${real.label} — a ${reality} reality by WASP`,
    description: `${real.note}. An alternate reality of ${meta.name}, a demo ${meta.kind.toLowerCase()} world by WASP.`,
  };
}

export default async function RealityPage({ params }: { params: Promise<{ id: string; reality: string }> }) {
  const { id: world, reality } = await params;
  const meta = WORLDS.find((w) => w.id === world);
  const Renderer = meta ? getRenderer(world, reality) : null;
  if (!meta || !getReality(world as never, reality) || !Renderer) return notFound();
  return <Renderer />;
}
