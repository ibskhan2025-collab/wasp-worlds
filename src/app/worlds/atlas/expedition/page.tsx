import type { Metadata } from "next";
import { AtlasExpedition } from "@/components/worlds/atlas-realities";

export const metadata: Metadata = {
  title: "ATLAS expedition - night navigation",
  description: "Night routes, large photography, slow travel. A reality by WASP.",
};

export default function Page() { return <AtlasExpedition />; }
