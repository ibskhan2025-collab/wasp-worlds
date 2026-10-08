import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { ArchiveNav } from "@/components/worlds/archive-realities";
import Archive from "@/rb15w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Journal — a journal reality by WASP",
  description: "Single-column reading. Progress, bookmarks, calm. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchiveJournalPage() {
  return (
    <>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/JOURNAL" />
      <ArchiveNav current="journal" />
      <Archive reality="journal" />
    </>
  );
}
