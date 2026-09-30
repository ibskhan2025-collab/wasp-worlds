import type { Metadata } from "next";
import { PulseOceanic } from "@/components/worlds/pulse-realities";

export const metadata: Metadata = {
  title: "PULSE submerged - deep blue",
  description: "Recorded at depth. A reality by WASP.",
};

export default function Page() { return <PulseOceanic />; }
