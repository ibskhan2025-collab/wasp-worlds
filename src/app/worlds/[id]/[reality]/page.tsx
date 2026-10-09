import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createElement, type ComponentType } from "react";
import { getReality } from "@/lib/realities";
import { WORLDS } from "@/lib/worlds";
import { getRenderer } from "@/components/worlds/registry";
import { WorldExit } from "@/components/wasp/world-exit";
import { UnderHood } from "@/components/worlds/under-hood";
import { CasaNav } from "@/components/worlds/casa-realities";
import { NoirNav } from "@/components/worlds/noir-showroom";
import { OrbitNav } from "@/components/worlds/orbit-realities";
import { StillNav } from "@/components/worlds/still-hall";
import { SignalNav } from "@/components/worlds/signal-realities";
import { ObjectsNav } from "@/components/worlds/objects-workshop";
import { ArchiveNav } from "@/components/worlds/archive-realities";
import { MotionNav } from "@/components/worlds/motion-realities";
import { VoidNav } from "@/components/worlds/void-shader";
import { AtlasNav } from "@/components/worlds/atlas-realities";
import { ForgeNav } from "@/components/worlds/forge-realities";
import { PulseNav } from "@/components/worlds/pulse-realities";
import { CivicNav } from "@/components/worlds/civic-realities";
import { NestNav } from "@/components/worlds/nest-realities";
import { VectorNav } from "@/components/worlds/vector-realities";

const NAVS: Record<string, ComponentType<{ current: string }>> = {
  casa: CasaNav,
  noir: NoirNav,
  orbit: OrbitNav,
  still: StillNav,
  signal: SignalNav,
  objects: ObjectsNav,
  archive: ArchiveNav,
  motion: MotionNav,
  void: VoidNav,
  atlas: AtlasNav,
  forge: ForgeNav,
  pulse: PulseNav,
  civic: CivicNav,
  nest: NestNav,
  vector: VectorNav,
};

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
  const Nav = NAVS[world];
  return (
    <>
      {Nav ? (
        <>
          <WorldExit id={world as never} label={`Room ${meta.room} · ${meta.name}/${reality.toUpperCase()}`} />
          <Nav current={reality} />
        </>
      ) : null}
      {createElement(Renderer)}
      <UnderHood world={world as never} />
    </>
  );
}
