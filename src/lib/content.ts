import fs from "node:fs";
import path from "node:path";
import { load as loadYaml } from "js-yaml";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content");

/* ---------- types ---------- */

export type PostType = "case-study" | "build-log" | "ai-stack";

export const postTypeLabels: Record<PostType, string> = {
  "case-study": "Case study",
  "build-log": "Build log",
  "ai-stack": "AI stack",
};

export interface Specs {
  synopsis: string;
  built: string;
  timeToShip: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tools: string[];
}

export interface PostMeta {
  slug: string;
  title: string;
  dek: string;
  date: string; // YYYY-MM-DD
  type: PostType;
  tags: string[];
  project: string | null; // a project slug, or null
  vendor: "vercel" | "supabase" | null;
  day: number | null;
  featured: boolean;
  draft: boolean;
  readingMinutes: number;
  specs: Specs | null;
  videoUrl: string | null;
  prototypeUrl: string | null;
}

export interface Post extends PostMeta {
  content: string;
}

export type Accent = "pink" | "violet" | "blue";

export interface ProjectMeta {
  slug: string;
  title: string;
  kind: string; // "Hosted product", "Open source", "Community"
  order: number;
  summary: string;
  stack: string[];
  walkthroughStyle: string; // "Clean demo", "Nat Geo narration"...
  status: "planned" | "building" | "live";
  accent: Accent;
  url: string | null; // the live product URL
  repoUrl: string | null; // omit for private repos
  prototypeUrl: string | null; // embedded on the project page
  videoUrl: string | null; // embedded on the project page
}

export interface Project extends ProjectMeta {
  content: string;
}

/* ---------- helpers ---------- */

/** Splits `---` YAML frontmatter from the Markdown body. */
function matter(raw: string): { data: Record<string, unknown>; content: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {}, content: raw };
  const parsed = loadYaml(m[1]);
  const data = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  return { data, content: m[2] };
}

function listFiles(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
}

function toIsoDate(value: unknown): string {
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "1970-01-01";
  return d.toISOString().slice(0, 10);
}

function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * In production a post shows only if it is not a draft AND its date has
 * arrived. That is what makes "write now, publish later" work: set a future
 * date and the post appears on the first rebuild/revalidation after it.
 * In `next dev` everything shows, so you can preview drafts and scheduled posts.
 */
function isVisible(meta: { draft: boolean; date: string }): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  if (meta.draft) return false;
  const today = new Date().toISOString().slice(0, 10);
  return meta.date <= today;
}

/* ---------- journal ---------- */

function parsePost(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "journal", file), "utf8");
  const { data, content } = matter(raw);

  const specsRaw = data.specs as Partial<Specs> | undefined;
  const specs: Specs | null = specsRaw
    ? {
        synopsis: specsRaw.synopsis ?? "",
        built: specsRaw.built ?? "",
        timeToShip: specsRaw.timeToShip ?? "",
        difficulty: (Math.min(5, Math.max(1, Number(specsRaw.difficulty) || 1)) as Specs["difficulty"]),
        tools: Array.isArray(specsRaw.tools) ? specsRaw.tools.map(String) : [],
      }
    : null;

  return {
    slug,
    title: String(data.title ?? slug),
    dek: String(data.dek ?? ""),
    date: toIsoDate(data.date),
    type: (data.type as PostType) ?? "build-log",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    project: str(data.project),
    vendor: data.vendor === "vercel" || data.vendor === "supabase" ? data.vendor : null,
    day: typeof data.day === "number" ? data.day : null,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    readingMinutes: readingMinutes(content),
    specs,
    videoUrl: str(data.videoUrl),
    prototypeUrl: str(data.prototypeUrl),
    content,
  };
}

export function getAllPosts(): Post[] {
  return listFiles("journal")
    .map(parsePost)
    .filter(isVisible)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function toPostMeta(post: Post): PostMeta {
  // strip the body so it is not shipped to the client
  const { content: _content, ...meta } = post;
  void _content;
  return meta;
}

export function getAdjacentPosts(slug: string): { newer: Post | null; older: Post | null } {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return { newer: posts[i - 1] ?? null, older: posts[i + 1] ?? null };
}

/* ---------- projects ---------- */

function parseProject(file: string): Project {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "projects", file), "utf8");
  const { data, content } = matter(raw);
  const accent = data.accent === "violet" || data.accent === "blue" ? data.accent : "pink";
  const status = data.status === "live" || data.status === "planned" ? data.status : "building";

  return {
    slug,
    title: String(data.title ?? slug),
    kind: String(data.kind ?? "Project"),
    order: Number(data.order ?? 99),
    summary: String(data.summary ?? ""),
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    walkthroughStyle: String(data.walkthroughStyle ?? ""),
    status,
    accent,
    url: str(data.url),
    repoUrl: str(data.repoUrl),
    prototypeUrl: str(data.prototypeUrl),
    videoUrl: str(data.videoUrl),
    content,
  };
}

export function getAllProjects(): Project[] {
  return listFiles("projects")
    .map(parseProject)
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | null {
  return getAllProjects().find((p) => p.slug === slug) ?? null;
}

/* ---------- pages ---------- */

export function getPageContent(name: string): string {
  const file = path.join(CONTENT_DIR, "pages", `${name}.mdx`);
  if (!fs.existsSync(file)) return "";
  return matter(fs.readFileSync(file, "utf8")).content;
}

/* ---------- misc ---------- */

export function getHeadings(source: string): { id: string; text: string }[] {
  const slugger = new GithubSlugger();
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  const out: { id: string; text: string }[] = [];
  for (const line of withoutCode.split("\n")) {
    const m = /^##\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const text = m[1].replace(/[`*_[\]]/g, "").replace(/\(.*?\)/g, "").trim();
    out.push({ id: slugger.slug(text), text });
  }
  return out;
}

export function formatDate(iso: string, style: "short" | "long" = "short"): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: style === "short" ? "short" : "long",
    day: "2-digit",
    year: "numeric",
  });
}
