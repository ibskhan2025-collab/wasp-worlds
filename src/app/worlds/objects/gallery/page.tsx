import type { Metadata } from "next";
import { GalleryGrid } from "./grid";

export const metadata: Metadata = {
  title: "Gallery — OBJECTS",
  description: "The work in rooms, not on white. Shot where it lives.",
};

export default function ObjectsGalleryPage() {
  return (
    <div style={{ padding: "32px 0 80px" }}>
      <header style={{ padding: "0 20px 20px" }}>
        <p className="kicker">In situ</p>
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", fontWeight: 500, margin: "6px 0" }}>Gallery</h1>
        <p style={{ maxWidth: "52ch", color: "var(--muted)" }}>Objects where they live — on sills, at tables, holding light.</p>
      </header>
      <GalleryGrid />
    </div>
  );
}
