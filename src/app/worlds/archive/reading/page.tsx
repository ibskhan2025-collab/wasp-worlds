import type { Metadata } from "next";
import { ArchiveReading } from "@/components/worlds/archive-realities";

export const metadata: Metadata = {
  title: "ARCHIVE reading - the reading room",
  description: "One essay at full stamina. A reality by WASP.",
};

export default function Page() { return <ArchiveReading />; }
