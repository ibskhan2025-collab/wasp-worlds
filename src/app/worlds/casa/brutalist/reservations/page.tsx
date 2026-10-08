import type { Metadata } from "next";
import { CasaReservationsView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Brutalist reservations — names, dates, parties",
  description: "Nothing else. Book.",
};

export default function Page() { return <CasaReservationsView reality="brutalist" />; }
