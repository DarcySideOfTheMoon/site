import { ImageResponse } from "next/og";
import { getAllPosts, getPost, postTypeLabels } from "@/lib/content";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? site.name;
  const kind = post ? postTypeLabels[post.type] : "Journal";

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
        <div style={{ fontSize: 26, letterSpacing: 6, color: "#FF3D7F", textTransform: "uppercase" }}>{kind}</div>
        <div style={{ fontSize: title.length > 60 ? 70 : 88, lineHeight: 1, fontWeight: 800, textTransform: "uppercase" }}>
          {title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              height: 10,
              width: 320,
              borderRadius: 5,
              background: "linear-gradient(90deg, #FF3D7F, #8C6BFF, #39B7FF, #FFB020)",
            }}
          />
          <div style={{ fontSize: 28, color: "#9C9892" }}>{site.name}</div>
        </div>
      </div>
    ),
    size
  );
}
