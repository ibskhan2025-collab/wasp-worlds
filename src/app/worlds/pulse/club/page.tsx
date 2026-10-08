import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { PulseNav } from "@/components/worlds/pulse-realities";
import Pulse from "@/rb54w/Pulse";

export const metadata: Metadata = {
  title: "PULSE Club — a club reality by WASP",
  description: "Dark, beat-synced, lights on the tempo. An alternate reality of PULSE, a demo music / culture world by WASP.",
};

export default function PulseClub54Page() {
  return (
    <>
      <WorldExit id="pulse" label="Room 12 · PULSE/CLUB" />
      <PulseNav current="club" />
      <Pulse reality="club" />
    </>
  );
}
