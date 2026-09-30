import type { Metadata } from "next";
import { PulseSetlist } from "@/components/worlds/pulse-realities";

export const metadata: Metadata = {
  title: "PULSE setlist - taped to the stage",
  description: "Set order, runtimes, tour dates. A reality by WASP.",
};

export default function Page() { return <PulseSetlist />; }
