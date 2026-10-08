import type { Metadata } from "next";
import Archive from "@/rb15w/Archive";

export const metadata: Metadata = {
  title: "ARCHIVE Broadsheet — a broadsheet reality by WASP",
  description: "Columns, rules, dense front page. An alternate reality of ARCHIVE, a demo media / publishing world by WASP.",
};

export default function ArchiveBroadsheetPage() {
  return <Archive reality="broadsheet" />;
}
