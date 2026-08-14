import { ImageResponse } from "next/og";

export const alt =
  "LaunchBharat — India's next generation of entrepreneurs starts here.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#050d1b",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          padding: "0 96px",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.28em",
            color: "#f08a1d",
            textTransform: "uppercase",
          }}
        >
          A NATIONWIDE STARTUP &amp; INNOVATION MOVEMENT
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 148,
            fontWeight: 800,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textTransform: "uppercase",
            transform: "skewX(-8deg)",
          }}
        >
          <span style={{ color: "#ffffff" }}>LAUNCH</span>
          <span style={{ color: "#f08a1d" }}>BHARAT</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 34,
            fontWeight: 400,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          India&apos;s next generation of entrepreneurs starts here.
        </div>
        <div style={{ display: "flex", marginTop: 56 }}>
          <div style={{ width: 60, height: 6, backgroundColor: "#f08a1d" }} />
          <div style={{ width: 60, height: 6, backgroundColor: "#ffffff" }} />
          <div style={{ width: 60, height: 6, backgroundColor: "#147a46" }} />
        </div>
      </div>
    ),
    size,
  );
}
