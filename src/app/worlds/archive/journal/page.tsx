import type { Metadata } from "next";
import Archive from "@/rb15w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Journal — a journal reality by WASP",
  description: "Single-column reading. Progress, bookmarks, calm. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchiveJournalPage() {
  return <Archive reality="journal" />;
}
