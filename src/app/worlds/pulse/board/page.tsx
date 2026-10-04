import type { Metadata } from "next";
import { PulseBoard } from "@/components/worlds/pulse-realities";

export const metadata: Metadata = {
  title: "PULSE board - the tour, departing",
  description: "The tour, departing. A reality by WASP.",
};

export default function Page() { return <PulseBoard />; }
