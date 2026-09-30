import type { Metadata } from "next";
import { CivicDesk } from "@/components/worlds/civic-realities";

export const metadata: Metadata = {
  title: "CIVIC desk - what brings you in",
  description: "Triage in plain words. A reality by WASP.",
};

export default function Page() { return <CivicDesk />; }
