import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getAllProjects, getProject, formatDate, postTypeLabels } from "@/lib/content";
import { Mdx } from "@/components/Mdx";
import { Placeholder, VideoEmbed } from "@/components/Embed";
import { ClapperIcon } from "@/components/Logo";
import { site } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const statusLabel = { planned: "Planned", building: "In build", live: "Live" } as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `${site.url}/work/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const all = getAllProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all[(index + 1) % all.length];
  const related = getAllPosts().filter((p) => p.project === project.slug);

  return (
    <div className={`accent-${project.accent}`}>
      <div className="container">
        <header className="project-hero">
          <div className="label accent-fg" style={{ letterSpacing: "0.2em" }}>
            {project.kind} · Project {String(index + 1).padStart(2, "0")} / {String(all.length).padStart(2, "0")}
          </div>
          <h1 className="display">{project.title}</h1>
          <p className="lede">{project.summary}</p>

          <div className="meta-bar">
            <div>
              <div className="label">Role</div>
              <div className="v">Solo: product design + build</div>
            </div>
            <div>
              <div className="label">Stack</div>
              <div className="v">{project.stack.join(" · ")}</div>
            </div>
            {project.walkthroughStyle && (
              <div>
                <div className="label">Walkthrough</div>
                <div className="v accent-fg" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ClapperIcon /> {project.walkthroughStyle}
                </div>
              </div>
            )}
            <div>
              <div className="label">Status</div>
              <div className="v" style={{ color: project.status === "live" ? "var(--blue)" : "var(--amber)" }}>
                ● {statusLabel[project.status]}
              </div>
            </div>
          </div>

          <div className="hero__cta" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {project.url && (
              <a className="btn btn-primary" href={project.url} target="_blank" rel="noopener noreferrer">
                Open {project.url.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
            {project.repoUrl && (
              <a className="btn" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                View source on GitHub ↗
              </a>
            )}
          </div>
        </header>

        <div className="stack">
          <section aria-labelledby="proto-h">
            <div className="stage-head">
              <h2 id="proto-h" className="label">
                Live prototype
              </h2>
              {project.prototypeUrl && (
                <a className="link-arrow" href={project.prototypeUrl} target="_blank" rel="noopener noreferrer">
                  Open full screen ↗
                </a>
              )}
            </div>
            <div className="stage stage--prototype">
              {project.prototypeUrl ? (
                <iframe src={project.prototypeUrl} title={`${project.title} prototype`} loading="lazy" />
              ) : (
                <Placeholder>Prototype launches here soon.</Placeholder>
              )}
            </div>
          </section>

          <section aria-labelledby="video-h">
            <div className="stage-head">
              <h2 id="video-h" className="label">
                Walkthrough (voice-over + captions)
              </h2>
            </div>
            <div className="stage stage--video">
              {project.videoUrl ? (
                <VideoEmbed url={project.videoUrl} title={`${project.title} walkthrough`} />
              ) : (
                <Placeholder>Walkthrough video is in production.</Placeholder>
              )}
            </div>
          </section>

          {project.content.trim() && (
            <section style={{ maxWidth: 760 }}>
              <Mdx source={project.content} />
            </section>
          )}

          {related.length > 0 && (
            <section>
              <div className="stage-head">
                <h2 className="label">Journal entries for this project</h2>
              </div>
              <div className="post-list" style={{ marginTop: 0 }}>
                {related.map((p) => (
                  <Link key={p.slug} href={`/journal/${p.slug}`} className="post-row">
                    <div className="meta meta--date">{formatDate(p.date).toUpperCase()}</div>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.dek}</p>
                    </div>
                    <span className="chip">{postTypeLabels[p.type]}</span>
                    <div className="meta meta--right">{p.readingMinutes} min</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {next && next.slug !== project.slug && (
          <Link
            href={`/work/${next.slug}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              padding: "56px 0",
              borderTop: "1px solid var(--line)",
            }}
          >
            <span className="label">Next project</span>
            <span className="display" style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
              {next.title} →
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
