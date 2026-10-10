import { getAllPosts } from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getAllPosts()
    .map(
      (p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}/journal/${p.slug}</link>
      <guid>${site.url}/journal/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.dek)}</description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.name)}: Journal</title>
    <link>${site.url}/journal</link>
    <description>${esc(site.description)}</description>${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
