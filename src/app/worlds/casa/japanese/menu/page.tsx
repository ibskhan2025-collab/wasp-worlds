import type { Metadata } from "next";
import { CasaMenuView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Japanese menu — 品書き by CASA",
  description: "Numbered courses in kanji, quiet room.",
};

export default function Page() { return <CasaMenuView reality="japanese" />; }
