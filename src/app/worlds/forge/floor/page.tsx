import type { Metadata } from "next";
import { ForgeFloor } from "@/components/worlds/forge-realities";

export const metadata: Metadata = {
  title: "FORGE floor - work orders",
  description: "The factory mid-shift. A reality by WASP.",
};

export default function Page() { return <ForgeFloor />; }
