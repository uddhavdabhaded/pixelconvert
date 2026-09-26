import { ImageResponse } from "next/og";

export const alt = "PixelConvert — convert, crop, and optimize images in the browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#10141c",
          color: "white",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 1 }}>PIXELCONVERT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            Convert, crop, and optimize images in the browser
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#c5d0e6" }}>
            JPG, PNG, and WEBP. No upload required.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
