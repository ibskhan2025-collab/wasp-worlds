import type { Metadata } from "next";
import { CasaReservationsView } from "@/components/worlds/casa-views";

export const metadata: Metadata = {
  title: "Oceanic reservations — dive in",
  description: "Book a table in the flooded dining room.",
};

export default function Page() { return <CasaReservationsView reality="oceanic" />; }
