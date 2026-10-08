import type { Metadata } from "next";
import { CasaMenuView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Cellar menu — bins and pours by CASA",
  description: "The wine book: short on purpose, everything by the glass.",
};

export default function Page() { return <CasaMenuView reality="cellar" />; }
