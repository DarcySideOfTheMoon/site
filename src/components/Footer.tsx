import { site, socialHref, socialLabels, type SocialKey } from "@/lib/site";

export function Footer() {
  const keys = (Object.keys(site.links) as SocialKey[]).filter((k) => site.links[k]);

  return (
    <footer className="site-footer">
      <div className="container">
        <small>
          © {new Date().getFullYear()} {site.name} · Built with Next.js &amp; MDX, hosted on Vercel
        </small>
        <nav className="social" aria-label="Elsewhere">
          <a href="/rss.xml">RSS</a>
          {keys.map((k) => (
            <a key={k} href={socialHref(k)} rel="me noopener" target={k === "email" ? undefined : "_blank"}>
              {socialLabels[k]}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
