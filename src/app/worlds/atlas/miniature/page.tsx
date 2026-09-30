import type { Metadata } from "next";
import { AtlasMiniature } from "@/components/worlds/atlas-miniature";

export const metadata: Metadata = {
  title: "ATLAS miniature - a small world",
  description: "Six routes as a tabletop model. A reality by WASP.",
};

export default function Page() { return <AtlasMiniature />; }
