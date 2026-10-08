import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { PulseNav } from "@/components/worlds/pulse-realities";
import Pulse from "@/rb15w/Pulse";

export const metadata: Metadata = {
  title: "PULSE Sound — a sound reality by WASP",
  description: "Generative audio per release, with a live analyser. An alternate reality of PULSE, a demo music / culture world by WASP.",
};

export default function PulseSoundPage() {
  return (
    <>
      <WorldExit id="pulse" label="Room 12 · PULSE/SOUND" />
      <PulseNav current="sound" />
      <Pulse reality="sound" />
    </>
  );
}
