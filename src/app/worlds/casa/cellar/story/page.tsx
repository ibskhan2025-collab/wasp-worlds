import type { Metadata } from "next";
import { CasaStoryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Cellar story — built backwards from the menu",
  description: "A dozen bins, every pour earning its plate.",
};

export default function Page() { return <CasaStoryView reality="cellar" />; }
