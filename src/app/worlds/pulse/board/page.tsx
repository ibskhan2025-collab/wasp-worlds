import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { PulseNav } from "@/components/worlds/pulse-realities";
import Pulse from "@/rb15w/Pulse";

export const metadata: Metadata = {
  title: "PULSE Departures — a board reality by WASP",
  description: "Tour dates as a split-flap board. An alternate reality of PULSE, a demo music / culture world by WASP.",
};

export default function PulseDeparturesPage() {
  return (
    <>
      <WorldExit id="pulse" label="Room 12 · PULSE/BOARD" />
      <PulseNav current="board" />
      <Pulse reality="board" />
    </>
  );
}
