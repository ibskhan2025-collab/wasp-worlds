import { notFound } from "next/navigation";

// Every world id now has a bespoke route (static routes shadow this
// dynamic segment), so anything landing here is an unknown room.
export default function WorldFallback() {
  return notFound();
}
