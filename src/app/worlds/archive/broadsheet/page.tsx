import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { ArchiveNav } from "@/components/worlds/archive-realities";
import Archive from "@/rb15w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Broadsheet — a broadsheet reality by WASP",
  description: "Columns, rules, dense front page. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchiveBroadsheetPage() {
  return (
    <>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/BROADSHEET" />
      <ArchiveNav current="broadsheet" />
      <Archive reality="broadsheet" />
    </>
  );
}
