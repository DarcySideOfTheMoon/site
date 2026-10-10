"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { PostMeta, PostType } from "@/lib/content";

type SortKey = "newest" | "oldest" | "longest";

const typeOptions: { value: "all" | PostType; label: string }[] = [
  { value: "all", label: "All posts" },
  { value: "case-study", label: "Case study" },
  { value: "build-log", label: "Build log" },
  { value: "ai-stack", label: "AI stack" },
];

const typeLabel: Record<PostType, string> = {
  "case-study": "Case study",
  "build-log": "Build log",
  "ai-stack": "AI stack",
};

function fmt(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function JournalBrowser({
  posts,
  projects,
}: {
  posts: PostMeta[];
  projects: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // All filter state lives in the URL, so a filtered view is shareable:
  //   /journal?type=ai-stack&project=uxrvision&topic=supabase&q=rls&sort=oldest
  const type = (params.get("type") ?? "all") as "all" | PostType;
  const project = params.get("project") ?? "";
  const topic = params.get("topic") ?? "";
  const sort = (params.get("sort") ?? "newest") as SortKey;
  const [q, setQ] = useState(params.get("q") ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all" && !(key === "sort" && value === "newest")) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const allTopics = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = posts.filter((p) => {
      if (type !== "all" && p.type !== type) return false;
      if (project && p.project !== project) return false;
      if (topic && !p.tags.includes(topic)) return false;
      if (needle) {
        const hay = `${p.title} ${p.dek} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "longest") return b.readingMinutes - a.readingMinutes;
      if (sort === "oldest") return a.date < b.date ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });
  }, [posts, type, project, topic, q, sort]);

  const filtersActive = type !== "all" || !!project || !!topic || !!q.trim();
  const featured = !filtersActive && sort === "newest" ? filtered.find((p) => p.featured) : undefined;
  const rest = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;

  function clearAll() {
    setQ("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <>
      <div className="filters" role="search">
        <div className="filters__row">
          <div className="filter-pills" role="group" aria-label="Filter by type">
            {typeOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                className="pill"
                aria-pressed={type === o.value}
                onClick={() => setParam("type", o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="controls">
            <label className="field">
              <span className="visually-hidden">Search posts</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="var(--ink-dim)" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="var(--ink-dim)" strokeWidth="2" />
              </svg>
              <input
                type="search"
                placeholder="Search posts…"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setParam("q", e.target.value.trim());
                }}
              />
            </label>

            {projects.length > 0 && (
              <label className="field">
                <span className="label">Project</span>
                <select value={project} onChange={(e) => setParam("project", e.target.value)}>
                  <option value="">All</option>
                  {projects.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="field">
              <span className="label">Sort</span>
              <select value={sort} onChange={(e) => setParam("sort", e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="longest">Longest read</option>
              </select>
            </label>
          </div>
        </div>

        {allTopics.length > 0 && (
          <div className="filter-pills" role="group" aria-label="Filter by topic">
            <span className="label" style={{ alignSelf: "center", marginRight: 4 }}>
              Topics
            </span>
            {allTopics.map((t) => (
              <button
                key={t}
                type="button"
                className="pill pill--small"
                aria-pressed={topic === t}
                onClick={() => setParam("topic", topic === t ? "" : t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="result-count" role="status" style={{ margin: "20px 0 0" }}>
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        {filtersActive && (
          <>
            {" · "}
            <button
              type="button"
              onClick={clearAll}
              style={{
                background: "none",
                border: 0,
                padding: 0,
                color: "var(--blue)",
                font: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              clear filters
            </button>
          </>
        )}
      </p>

      {featured && (
        <Link href={`/journal/${featured.slug}`} className="featured">
          <div className="featured__art" aria-hidden="true">
            <span className="spectrum" />
          </div>
          <div className="featured__body">
            <div className="card__chips" style={{ alignItems: "center" }}>
              <span className="pill-solid">Featured</span>
              <span className="label" style={{ fontSize: 11, letterSpacing: "0.05em" }}>
                {typeLabel[featured.type]} · {featured.readingMinutes} min read
              </span>
            </div>
            <h2 className="display">{featured.title}</h2>
            <p>{featured.dek}</p>
            <span className="label" style={{ fontSize: 11 }}>
              {fmt(featured.date)}
            </span>
          </div>
        </Link>
      )}

      {rest.length > 0 ? (
        <div className="post-list">
          {rest.map((p) => (
            <Link key={p.slug} href={`/journal/${p.slug}`} className="post-row">
              <div className="meta meta--date">{fmt(p.date).toUpperCase()}</div>
              <div>
                <h3>{p.title}</h3>
                <p>{p.dek}</p>
              </div>
              <span className="chip">{typeLabel[p.type]}</span>
              <div className="meta meta--right">{p.readingMinutes} min</div>
            </Link>
          ))}
        </div>
      ) : (
        !featured && (
          <div className="empty">
            <div className="display">{filtersActive ? "Nothing matches" : "First posts landing soon"}</div>
            <p>{filtersActive ? "Try a different search or clear the filters." : "Check back shortly, or subscribe via RSS."}</p>
          </div>
        )
      )}
    </>
  );
}
