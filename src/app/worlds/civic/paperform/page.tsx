import type { Metadata } from "next";
import { CivicPaperform } from "@/components/worlds/civic-realities";

export const metadata: Metadata = {
  title: "CIVIC counter - paper form",
  description: "Tick what applies, hand it in. A reality by WASP.",
};

export default function Page() { return <CivicPaperform />; }
