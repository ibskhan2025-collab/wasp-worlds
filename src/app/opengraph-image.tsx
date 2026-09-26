import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070707",
          color: "#f4f1ea",
          padding: 80,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#8a8580" }}>WASP · 15 WORLDS</div>
        <div style={{ fontSize: 110, fontWeight: 900, letterSpacing: -4, lineHeight: 1, display: "flex", flexDirection: "column" }}>
          <span>DON&rsquo;T LOOK.</span>
          <span>GO IN.</span>
        </div>
        <div style={{ fontSize: 30, color: "#8a8580" }}>Websites are too small a word.</div>
      </div>
    ),
    { ...size },
  );
}
