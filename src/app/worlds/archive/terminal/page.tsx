import type { Metadata } from "next";
import { ArchiveTerminal } from "@/components/worlds/archive-realities";

export const metadata: Metadata = {
  title: "ARCHIVE terminal - night reading",
  description: "Green text, no distractions. A reality by WASP.",
};

export default function Page() { return <ArchiveTerminal />; }
