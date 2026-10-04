import type { Metadata } from "next";
import { AtlasGlobe } from "@/components/worlds/atlas-realities";

export const metadata: Metadata = {
  title: "ATLAS globe - the valley as a planet",
  description: "The valley as a planet. A reality by WASP.",
};

export default function Page() { return <AtlasGlobe />; }
