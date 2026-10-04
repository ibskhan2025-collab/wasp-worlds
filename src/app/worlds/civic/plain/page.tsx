import type { Metadata } from "next";
import { CivicPlain } from "@/components/worlds/civic-realities";

export const metadata: Metadata = {
  title: "CIVIC plain - no stylesheets",
  description: "No stylesheets. A reality by WASP.",
};

export default function Page() { return <CivicPlain />; }
