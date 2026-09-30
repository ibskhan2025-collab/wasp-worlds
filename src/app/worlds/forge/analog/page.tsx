import type { Metadata } from "next";
import { ForgeAnalog } from "@/components/worlds/forge-realities";

export const metadata: Metadata = {
  title: "FORGE microfiche - archive scan",
  description: "Specs on film, verified. A reality by WASP.",
};

export default function Page() { return <ForgeAnalog />; }
