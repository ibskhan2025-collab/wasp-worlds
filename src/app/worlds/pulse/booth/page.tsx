import type { Metadata } from "next";
import { PulseBooth } from "@/components/worlds/pulse-realities";

export const metadata: Metadata = {
  title: "PULSE booth - two decks",
  description: "The catalogue as crates. A reality by WASP.",
};

export default function Page() { return <PulseBooth />; }
