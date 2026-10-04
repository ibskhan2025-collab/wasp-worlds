import type { Metadata } from "next";
import { ForgeInspect } from "@/components/worlds/forge-realities";

export const metadata: Metadata = {
  title: "FORGE inspect - one part on the bench",
  description: "One part on the bench. A reality by WASP.",
};

export default function Page() { return <ForgeInspect />; }
