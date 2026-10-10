import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "120px var(--gutter)", textAlign: "center" }}>
      <div className="label">404</div>
      <h1 className="display" style={{ fontSize: "clamp(64px, 12vw, 128px)", margin: "12px 0", lineHeight: 0.9 }}>
        Lost in the dark side
      </h1>
      <p style={{ color: "var(--ink-dim)", marginBottom: 32 }}>That page doesn&apos;t exist (or hasn&apos;t been published yet).</p>
      <Link href="/" className="btn btn-primary">
        Back home
      </Link>
    </div>
  );
}
