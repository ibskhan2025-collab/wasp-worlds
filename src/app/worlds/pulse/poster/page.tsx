import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { PulseNav } from "@/components/worlds/pulse-realities";
import Pulse from "@/rb54w/Pulse";

export const metadata: Metadata = {
  title: "PULSE Poster — a poster reality by WASP",
  description: "Loud Swiss gig-poster typography. An alternate reality of PULSE, a demo music / culture world by WASP.",
};

export default function PulsePoster54Page() {
  return (
    <>
      <WorldExit id="pulse" label="Room 12 · PULSE/POSTER" />
      <PulseNav current="poster" />
      <Pulse reality="poster" />
    </>
  );
}
