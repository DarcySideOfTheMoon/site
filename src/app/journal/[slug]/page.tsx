import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentPosts,
  getAllPosts,
  getHeadings,
  getPost,
  getProject,
  formatDate,
  formatPacificTime,
  postTypeLabels,
} from "@/lib/content";
import { Mdx } from "@/components/Mdx";
import { BuildSpecs } from "@/components/BuildSpecs";
import { ReadingProgress } from "@/components/ReadingProgress";
import { VideoEmbed } from "@/components/Embed";
import { site } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      url: `${site.url}/journal/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const headings = getHeadings(post.content);
  const project = post.project ? getProject(post.project) : null;
  const { newer, older } = getAdjacentPosts(post.slug);

  return (
    <>
      <ReadingProgress />
      <div className="container">
        <div className="article-layout">
          <aside className="toc" aria-label="On this page">
            <div className="label" style={{ fontSize: 11, marginBottom: 6 }}>
              On this page
            </div>
            <a href="#build-specs">Build specs</a>
            {headings.map((h) => (
              <a key={h.id} href={`#${h.id}`}>
                {h.text}
              </a>
            ))}
            {(project || post.videoUrl) && <hr />}
            {project && (
              <Link href={`/work/${project.slug}`} className="toc__cta">
                → View the project
              </Link>
            )}
            {post.videoUrl && (
              <a href="#walkthrough" className="toc__cta">
                → Watch the walkthrough
              </a>
            )}
          </aside>

          <article>
            <header className="article__head">
              <div className="article__meta">
                <span className="pill-solid">{postTypeLabels[post.type]}</span>
                <span className="label" style={{ fontSize: 11, letterSpacing: "0.05em" }}>
                  <time dateTime={post.date}>{formatDate(post.date, "long")}</time>{post.time ? ` · ${formatPacificTime(post.date, post.time)}` : ""} · {post.readingMinutes} min read
                  {post.day ? ` · Day ${post.day}` : ""}
                </span>
                {post.draft && (
                  <span className="chip" style={{ color: "var(--amber)", borderColor: "var(--amber)" }}>
                    Draft (hidden in production)
                  </span>
                )}
              </div>
              <h1 className="display">{post.title}</h1>
              {post.dek && <p className="dek">{post.dek}</p>}
              <div className="card__chips">
                {post.tags.map((t) => (
                  <Link key={t} href={`/journal?topic=${encodeURIComponent(t)}`} className="chip">
                    {t}
                  </Link>
                ))}
              </div>
            </header>

            {post.specs && (
              <div id="build-specs">
                <BuildSpecs specs={post.specs} project={project ? { slug: project.slug, title: project.title } : null} />
              </div>
            )}

            {post.videoUrl && (
              <section id="walkthrough" style={{ marginBottom: 40 }}>
                <div className="stage stage--video">
                  <VideoEmbed url={post.videoUrl} title={`${post.title}: walkthrough`} />
                </div>
              </section>
            )}

            <Mdx source={post.content} />

            {project && (
              <aside className="cta-box">
                <div>
                  <h2>Want to see it running?</h2>
                  <p>Open the live prototype and watch the full walkthrough on the project page.</p>
                </div>
                <Link href={`/work/${project.slug}`} className="btn btn-primary">
                  View project
                </Link>
              </aside>
            )}

            <nav className="pager" aria-label="More posts">
              {newer ? (
                <Link href={`/journal/${newer.slug}`}>
                  <span className="label" style={{ fontSize: 11 }}>
                    ← Newer
                  </span>
                  <strong>{newer.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {older && (
                <Link href={`/journal/${older.slug}`} className="next">
                  <span className="label" style={{ fontSize: 11 }}>
                    Older →
                  </span>
                  <strong>{older.title}</strong>
                </Link>
              )}
            </nav>
          </article>
        </div>
      </div>
    </>
  );
}
