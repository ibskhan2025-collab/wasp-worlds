import type { Metadata } from "next";
import { ForgeDatasheet } from "@/components/worlds/forge-realities";

export const metadata: Metadata = {
  title: "FORGE datasheet - print spec",
  description: "Five parts, one page, zero decoration. A reality by WASP.",
};

export default function Page() { return <ForgeDatasheet />; }
