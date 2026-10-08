import type { Metadata } from "next";
import { CasaStoryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Oceanic story — how the dining room flooded",
  description: "What if the dining room sank twelve fathoms and kept serving?",
};

export default function Page() { return <CasaStoryView reality="oceanic" />; }
