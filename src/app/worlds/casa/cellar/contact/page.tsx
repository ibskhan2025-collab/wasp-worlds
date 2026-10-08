import type { Metadata } from "next";
import { CasaContactView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Cellar contact — the corner table",
  description: "Address, hours and lines for the cellar.",
};

export default function Page() { return <CasaContactView reality="cellar" />; }
