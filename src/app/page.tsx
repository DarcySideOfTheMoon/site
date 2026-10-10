import Link from "next/link";
import { getAllPosts, getAllProjects, formatDate, postTypeLabels } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";
import { Marquee } from "@/components/Marquee";

export const revalidate = 3600; // lets scheduled posts appear without a redeploy

const steps = [
  { n: "01", color: "var(--pink)", title: "Discover & validate", body: "Real research loops, AI-assisted synthesis, still grounded in users." },
  { n: "02", color: "var(--violet)", title: "Prototype in hours", body: "Working software, not comps, deployed the same day." },
  { n: "03", color: "var(--blue)", title: "Build for real", body: "Schemas, auth, access policies: production concerns from day one." },
  { n: "04", color: "var(--amber)", title: "Document everything", body: "Every trade-off, narrated and captioned, so the thinking is visible." },
];

export default function Home() {
  const projects = getAllProjects();
  const latest = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="hero grain">
        <div className="container">
          <div className="eyebrow reveal">Senior product designer · Remote</div>
          <h1 className="display reveal" style={{ animationDelay: "60ms" }}>
            Design systems
            <br />
            that ship themselves
          </h1>
          <p className="reveal" style={{ animationDelay: "120ms" }}>
            I&apos;m Darcy, a product designer who prototypes, builds, and documents with AI-native tooling.
            Every build ships with a working prototype, a walkthrough video, and the reasoning behind each decision.
          </p>
          <div className="spectrum reveal" style={{ animationDelay: "180ms" }} aria-hidden="true" />
          <div className="hero__cta reveal" style={{ animationDelay: "240ms" }}>
            <Link href="/#work" className="btn btn-primary">
              View the work
            </Link>
            <Link href="/journal" className="btn">
              Read the journal
            </Link>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="section" id="work">
        <div className="container">
          <div className="section__head">
            <h2 className="display">The builds</h2>
            <span className="label">{projects.length} projects · Vercel + Supabase</span>
          </div>
          <div className="grid-3">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2 className="display">How I work with AI stacks</h2>
          </div>
          <div className="grid-4 how">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="how__num" style={{ color: s.color }}>
                  {s.n}
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__head">
              <h2 className="display">Latest from the journal</h2>
              <Link href="/journal" className="link-arrow">
                All posts →
              </Link>
            </div>
            <div className="post-list" style={{ marginTop: 0 }}>
              {latest.map((p) => (
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
          </div>
        </section>
      )}
    </>
  );
}
