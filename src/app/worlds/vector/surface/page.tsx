import type { Metadata } from "next";
import { VectorSurface } from "@/components/worlds/vector-realities";

export const metadata: Metadata = {
  title: "VECTOR surface - daylight briefing",
  description: "Coffee provided. A reality by WASP.",
};

export default function Page() { return <VectorSurface />; }
