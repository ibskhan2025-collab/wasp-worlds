import type { Metadata } from "next";
import { CasaContactView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Brutalist contact — write/find",
  description: "Address in caps. Closed Mondays.",
};

export default function Page() { return <CasaContactView reality="brutalist" />; }
