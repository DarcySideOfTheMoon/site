import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B0B0C",
          color: "#F4F1EA",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 6, color: "#39B7FF", textTransform: "uppercase" }}>
          Design that ships, reasoning attached
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 132, lineHeight: 0.95, fontWeight: 800, textTransform: "uppercase" }}>
            {site.name}
          </div>
          <div style={{ fontSize: 34, color: "#9C9892" }}>{site.tagline}</div>
          <div
            style={{
              height: 10,
              width: 420,
              borderRadius: 5,
              background: "linear-gradient(90deg, #FF3D7F, #8C6BFF, #39B7FF, #FFB020)",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
