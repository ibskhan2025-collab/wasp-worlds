import type { Metadata } from "next";
import { CasaStoryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Garden story — six beds decide",
  description: "The planting plan is the menu plan.",
};

export default function Page() { return <CasaStoryView reality="garden" />; }
