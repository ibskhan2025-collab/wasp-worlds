import type { Metadata } from "next";
import { Itinerary } from "./client";

export const metadata: Metadata = {
  title: "My itinerary — ATLAS",
  description: "Your route through the valley. Review it, then send it as one request.",
};

export default function ItineraryPage() {
  return <Itinerary />;
}
