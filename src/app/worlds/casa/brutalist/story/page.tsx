import type { Metadata } from "next";
import { CasaStoryView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Brutalist story — the grill is the concept",
  description: "Same kitchen, fewer words.",
};

export default function Page() { return <CasaStoryView reality="brutalist" />; }
