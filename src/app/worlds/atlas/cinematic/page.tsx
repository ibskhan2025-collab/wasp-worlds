import type { Metadata } from "next";
import { AtlasCinema } from "@/components/worlds/atlas-realities";

export const metadata: Metadata = {
  title: "ATLAS cinema - large and slow",
  description: "Six routes at 2.39 to 1. A reality by WASP.",
};

export default function Page() { return <AtlasCinema />; }
