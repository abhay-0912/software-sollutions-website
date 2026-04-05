import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abaay Tech";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          color: "white",
          background:
            "radial-gradient(circle at 20% 20%, #1f3f90 0%, #0D0F1A 45%), linear-gradient(120deg, #0D0F1A 0%, #161c34 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.9 }}>abaay.tech</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, maxWidth: 980 }}>
            Custom Web Apps, ERP & Automation
          </div>
          <div style={{ fontSize: 32, color: "#bad2ff" }}>Building tomorrow&apos;s software, today.</div>
        </div>
      </div>
    ),
    size,
  );
}
