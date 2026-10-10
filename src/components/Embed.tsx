/**
 * Turns a YouTube/Vimeo/Loom/Mux page URL into an embeddable one.
 * Anything else is used as-is (so an iframe-ready URL works too).
 * For a direct video file (.mp4/.webm) it returns a <video> instead.
 */
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host === "youtube.com" && u.searchParams.get("v"))
      return `https://www.youtube-nocookie.com/embed/${u.searchParams.get("v")}`;
    if (host === "vimeo.com" && /^\/\d+/.test(u.pathname))
      return `https://player.vimeo.com/video/${u.pathname.slice(1)}`;
    if (host === "loom.com" && u.pathname.startsWith("/share/"))
      return `https://www.loom.com/embed/${u.pathname.replace("/share/", "")}`;
  } catch {
    /* fall through */
  }
  return url;
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
    return (
      <video controls preload="metadata" aria-label={title}>
        <source src={url} />
      </video>
    );
  }
  return (
    <iframe
      src={toEmbedUrl(url)}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}

export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage__empty">
      <span className="spectrum" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
