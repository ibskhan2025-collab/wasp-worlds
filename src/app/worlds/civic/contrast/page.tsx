import type { Metadata } from "next";
import { CivicContrast } from "@/components/worlds/civic-realities";

export const metadata: Metadata = {
  title: "CIVIC contrast - nothing mistakable",
  description: "Nothing mistakable. A reality by WASP.",
};

export default function Page() { return <CivicContrast />; }
