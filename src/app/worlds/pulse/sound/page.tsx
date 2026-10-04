import type { Metadata } from "next";
import { PulseSound } from "@/components/worlds/pulse-realities";

export const metadata: Metadata = {
  title: "PULSE sound - every release has a mix",
  description: "Every release has a mix. A reality by WASP.",
};

export default function Page() { return <PulseSound />; }
