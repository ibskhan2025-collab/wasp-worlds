import type { Metadata } from "next";
import { ArchiveStacks } from "@/components/worlds/archive-realities";

export const metadata: Metadata = {
  title: "ARCHIVE stacks - closed shelves",
  description: "Every issue shelved by section. A reality by WASP.",
};

export default function Page() { return <ArchiveStacks />; }
