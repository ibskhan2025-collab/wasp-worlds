import type { Metadata } from "next";
import { ArchiveBroadsheet } from "@/components/worlds/archive-realities";

export const metadata: Metadata = {
  title: "ARCHIVE broadsheet - set in columns",
  description: "Set in columns, read slow. A reality by WASP.",
};

export default function Page() { return <ArchiveBroadsheet />; }
