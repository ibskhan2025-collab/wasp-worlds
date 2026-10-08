import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { ArchiveNav } from "@/components/worlds/archive-realities";
import Archive from "@/rb15w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Index — a index reality by WASP",
  description: "Plain monospaced catalogue for searching and scanning. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchiveIndexPage() {
  return (
    <>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/INDEX" />
      <ArchiveNav current="index" />
      <Archive reality="index" />
    </>
  );
}
