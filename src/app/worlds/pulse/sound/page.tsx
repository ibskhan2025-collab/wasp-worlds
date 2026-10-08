import type { Metadata } from "next";
import Pulse from "@/rb15w/Pulse";

export const metadata: Metadata = {
  title: "PULSE Sound — a sound reality by WASP",
  description: "Generative audio per release, with a live analyser. An alternate reality of PULSE, a demo music / culture world by WASP.",
};

export default function PulseSoundPage() {
  return <Pulse reality="sound" />;
}
