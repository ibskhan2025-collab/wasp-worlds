import type { Metadata } from "next";
import Pulse from "@/rb15w/Pulse";

export const metadata: Metadata = {
  title: "PULSE Departures — a board reality by WASP",
  description: "Tour dates as a split-flap board. An alternate reality of PULSE, a demo music / culture world by WASP.",
};

export default function PulseDeparturesPage() {
  return <Pulse reality="board" />;
}
