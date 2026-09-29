import type { Metadata } from "next";
import { ArchiveTyper } from "@/components/worlds/archive-realities";

export const metadata: Metadata = {
  title: "ARCHIVE typer - manuscript",
  description: "Hammered out at 2am. A reality by WASP.",
};

export default function Page() { return <ArchiveTyper />; }
