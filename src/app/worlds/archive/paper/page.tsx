import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { ArchiveNav } from "@/components/worlds/archive-realities";
import Archive from "@/rb54w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Paper — a paper reality by WASP",
  description: "Multi-column newspaper index, rules and small caps. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchivePaper54Page() {
  return (
    <>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/PAPER" />
      <ArchiveNav current="paper" />
      <Archive reality="broadsheet" />
    </>
  );
}
