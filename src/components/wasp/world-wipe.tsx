"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import type { WorldId } from "@/lib/types";

/**
 * One transition per world. Every reality change in every bespoke nav
 * (and the shared RealityShell) plays its world's wipe: same durations
 * the shell always used, styled per world. Skipped under reduced motion.
 */
export const WORLD_WIPE_MS: Record<WorldId, number> = {
  casa: 620,
  noir: 480,
  orbit: 520,
  still: 700,
  signal: 450,
  objects: 600,
  archive: 560,
  motion: 540,
  void: 580,
  atlas: 620,
  forge: 480,
  pulse: 500,
  civic: 200,
  nest: 750,
  vector: 420,
};

export function WipeOverlay({ world, label }: { world: WorldId; label: string }) {
  return (
    <div className={`reality-wipe reality-wipe--${world}`} aria-hidden>
      <span>{label}</span>
    </div>
  );
}

type WipeEvent = CustomEvent<{ world: WorldId; href: string; label: string }>;

/** Full-screen host: mount once (site chrome). Listens for wipe requests. */
export function WorldWipeHost() {
  const router = useRouter();
  const [active, setActive] = useState<{ world: WorldId; label: string } | null>(null);
  useEffect(() => {
    let timer = 0;
    const onWipe = (e: Event) => {
      const { world, href, label } = (e as WipeEvent).detail;
      if (active) return;
      setActive({ world, label });
      timer = window.setTimeout(() => {
        router.push(href);
        window.setTimeout(() => setActive(null), 120);
      }, WORLD_WIPE_MS[world] ?? 560);
    };
    window.addEventListener("wasp:wipe", onWipe);
    return () => {
      window.removeEventListener("wasp:wipe", onWipe);
      window.clearTimeout(timer);
    };
  }, [router, active]);
  if (!active) return null;
  return <WipeOverlay world={active.world} label={active.label} />;
}

export function goWithWipe(world: WorldId, href: string, label: string) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    window.location.assign(href);
    return;
  }
  window.dispatchEvent(new CustomEvent("wasp:wipe", { detail: { world, href, label } }));
}

type WorldNavLinkProps = LinkProps & {
  world: WorldId;
  label?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** Drop-in Link replacement: plays the world's wipe, then navigates. */
export function WorldNavLink({ world, label, href, onClick, children, ...rest }: WorldNavLinkProps) {
  const target = typeof href === "string" ? href : href.toString();
  const text = label ?? (typeof children === "string" ? children : "Enter");
  function handle(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.(e);
    goWithWipe(world, target, text);
  }
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
