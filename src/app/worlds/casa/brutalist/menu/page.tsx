import type { Metadata } from "next";
import { CasaMenuView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Brutalist menu — the ledger by CASA",
  description: "Twelve dishes. One grill. Read it like a ledger.",
};

export default function Page() { return <CasaMenuView reality="brutalist" />; }
