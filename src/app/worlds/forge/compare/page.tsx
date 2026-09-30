import type { Metadata } from "next";
import { ForgeCompare } from "@/components/worlds/forge-realities";

export const metadata: Metadata = {
  title: "FORGE compare - head to head",
  description: "Side-by-side specs, differences lit. A reality by WASP.",
};

export default function Page() { return <ForgeCompare />; }
