import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import { Mdx } from "@/components/Mdx";
import { site, socialHref, socialLabels, type SocialKey } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const keys = (Object.keys(site.links) as SocialKey[]).filter((k) => site.links[k]);

  return (
    <div className="container">
      <header className="page-head">
        <div className="label">About</div>
        <h1 className="display">
          Design, code,
          <br />
          and the reasoning
        </h1>
      </header>

      <div style={{ maxWidth: 760, padding: "56px 0 96px" }}>
        <Mdx source={getPageContent("about")} />

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 40 }}>
          <a className="btn btn-primary" href={site.resume}>
            Download résumé ↓
          </a>
          {keys.map((k) => (
            <a key={k} className="btn" href={socialHref(k)} rel="me noopener" target={k === "email" ? undefined : "_blank"}>
              {socialLabels[k]}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
