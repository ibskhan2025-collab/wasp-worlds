import { ImageResponse } from "next/og";
import { WORLDS } from "@/lib/worlds";

const ACCENT: Record<string, string> = {
  casa: "#9a3b2f",
  noir: "#c41e3a",
  orbit: "#b24a2e",
  still: "#8a8580",
  signal: "#e8b86d",
  objects: "#2c4a3e",
  archive: "#d9cbb3",
  motion: "#ffffff",
  void: "#f4f1ea",
  atlas: "#c98a3d",
  forge: "#d9682e",
  pulse: "#e23a3a",
  civic: "#2e6bd8",
  nest: "#7a8b6f",
  vector: "#3ddc84",
};

export const ogSize = { width: 1200, height: 630 };
export const ogType = "image/png";

export function worldOg(id: string) {
  const w = WORLDS.find((x) => x.id === id)!;
  const accent = ACCENT[id] ?? "#f4f1ea";
  return new ImageResponse(
    (<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#070707", color: "#f4f1ea", padding: 72, fontFamily: "Arial, sans-serif" }}><div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><div style={{ width: 18, height: 18, borderRadius: 9, background: accent }} /><div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#8a8580", marginLeft: 16 }}><span>ROOM {w.room} · WASP STUDY</span></div></div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: 120, fontWeight: 900, letterSpacing: -3, lineHeight: 1 }}><span>{w.name}</span></div><div style={{ display: "flex", fontSize: 32, color: accent, marginTop: 20 }}><span>{w.kind}</span></div><div style={{ display: "flex", fontSize: 30, color: "#b8b2a8", lineHeight: 1.35, marginTop: 12 }}><span>{w.line}</span></div></div><div style={{ display: "flex", fontSize: 24, color: "#8a8580" }}><span>WASP — websites are too small a word.</span></div></div>),
    { ...ogSize },
  );
}
