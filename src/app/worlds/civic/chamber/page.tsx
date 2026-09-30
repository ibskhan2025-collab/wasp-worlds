import type { Metadata } from "next";
import { CivicChamber } from "@/components/worlds/civic-realities";

export const metadata: Metadata = {
  title: "CIVIC chamber - order of business",
  description: "Motions, departments, sources. A reality by WASP.",
};

export default function Page() { return <CivicChamber />; }
