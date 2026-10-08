import type { Metadata } from "next";
import { WorldExit } from "@/components/wasp/world-exit";
import { ArchiveNav } from "@/components/worlds/archive-realities";
import Archive from "@/rb54w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Reader — a reader reality by WASP",
  description: "One column, big type, nothing else. For actually reading. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchiveReader54Page() {
  return (
    <>
      <WorldExit id="archive" label="Room 07 · ARCHIVE/READER" />
      <ArchiveNav current="reader" />
      <Archive reality="reader" />
    </>
  );
}
