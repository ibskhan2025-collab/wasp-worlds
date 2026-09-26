import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorldExit } from "@/components/wasp/world-exit";
import { nestRooms } from "@/data/nest";
import { RoomView } from "./room-view";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = nestRooms.find((x) => x.slug === slug);
  return r ? { title: `${r.name} — NEST`, description: r.desc } : { title: "Room not found — NEST" };
}

export default async function NestRoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = nestRooms.find((x) => x.slug === slug);
  if (!room) return notFound();
  return (
    <div className="obj-root">
      <WorldExit id="nest" label="Room 14 · NEST" />
      <RoomView slug={room.slug} />
    </div>
  );
}
