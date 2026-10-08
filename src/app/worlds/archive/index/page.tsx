import type { Metadata } from "next";
import Archive from "@/rb15w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Index — a index reality by WASP",
  description: "Plain monospaced catalogue for searching and scanning. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchiveIndexPage() {
  return <Archive reality="index" />;
}
