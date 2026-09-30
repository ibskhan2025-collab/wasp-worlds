"use client";

import SignalPage from "@/app/worlds/signal/page";
import { WorldExit } from "@/components/wasp/world-exit";
import { RealityShell } from "@/components/worlds/reality-shell";

/**
 * SIGNAL alternates reuse the real game — the canvas reads its palette
 * from CSS variables, so each reality is the same rules in new light.
 */
export function SignalMono() {
  return (
    <div className="sig-mono">
      <WorldExit id="signal" label="Room 05 · SIGNAL/MONO" />
      <RealityShell world="signal" current="mono" basePath="/worlds/signal" />
      <SignalPage bare />
    </div>
  );
}

export function SignalPaper() {
  return (
    <div className="sig-paper">
      <WorldExit id="signal" label="Room 05 · SIGNAL/PAPER" />
      <RealityShell world="signal" current="paper" basePath="/worlds/signal" />
      <SignalPage bare />
    </div>
  );
}

export function SignalFuture() {
  return (
    <div className="sig-future">
      <WorldExit id="signal" label="Room 05 · SIGNAL/QUANTUM" />
      <RealityShell world="signal" current="future" basePath="/worlds/signal" />
      <SignalPage bare />
    </div>
  );
}
