import type { Metadata } from "next";
import { ArchiveIndex } from "@/components/worlds/archive-realities";

export const metadata: Metadata = {
  title: "ARCHIVE index - every essay in a row",
  description: "Every essay in a row. A reality by WASP.",
};

export default function Page() { return <ArchiveIndex />; }
