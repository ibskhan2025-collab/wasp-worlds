import type { Metadata } from "next";
import { CasaStoryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Japanese story — half tempo",
  description: "Five courses at the speed of attention.",
};

export default function Page() { return <CasaStoryView reality="japanese" />; }
