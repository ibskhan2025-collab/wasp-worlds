import type { Metadata } from "next";
import { CasaReservationsView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Garden reservations — book among the beds",
  description: "Tables beside the planters go first.",
};

export default function Page() { return <CasaReservationsView reality="garden" />; }
