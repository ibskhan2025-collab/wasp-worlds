import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { PulseNav } from "@/components/worlds/pulse-realities";
import Pulse from "@/rb15w/Pulse";

export const metadata: Metadata = {
  title: "PULSE Label — a label reality by WASP",
  description: "Giant type, generative covers, tracklists. An alternate reality of PULSE, a demo music / culture world by WASP.",
};

export default function PulseLabelPage() {
  return (
    <>
      <WorldExit id="pulse" label="Room 12 · PULSE/LABEL" />
      <PulseNav current="label" />
      <Pulse reality="label" />
    </>
  );
}
