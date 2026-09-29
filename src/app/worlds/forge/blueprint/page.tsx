import type { Metadata } from "next";
import { ForgeBlueprint } from "@/components/worlds/forge-realities";

export const metadata: Metadata = {
  title: "FORGE blueprint - reversed drawing",
  description: "Cyan-line schematics, live dimensions. A reality by WASP.",
};

export default function Page() { return <ForgeBlueprint />; }
