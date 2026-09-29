import type { Metadata } from "next";
import { PulseVinyl } from "@/components/worlds/pulse-realities";

export const metadata: Metadata = {
  title: "PULSE vinyl - sleeve notes",
  description: "Side A and B, play loud. A reality by WASP.",
};

export default function Page() { return <PulseVinyl />; }
