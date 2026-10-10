import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts, getAllProjects, toPostMeta } from "@/lib/content";
import { JournalBrowser } from "@/components/JournalBrowser";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Build logs, case studies, and AI-stack notes: what I built, which tools did the work, and every trade-off along the way.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const posts = getAllPosts().map(toPostMeta);
  const projects = getAllProjects().map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <div className="container">
      <header className="page-head">
        <div className="label">Journal</div>
        <h1 className="display">
          Build logs &amp;
          <br />
          process notes
        </h1>
        <p>
          What I built, which AI stack did the work, and every trade-off along the way. Skim the specs or read the
          whole story, your call.
        </p>
      </header>

      <Suspense fallback={<p className="result-count" style={{ marginTop: 24 }}>Loading posts…</p>}>
        <JournalBrowser posts={posts} projects={projects} />
      </Suspense>

      <div style={{ height: 96 }} />
    </div>
  );
}
