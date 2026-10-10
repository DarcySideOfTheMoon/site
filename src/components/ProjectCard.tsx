import Link from "next/link";
import type { ProjectMeta } from "@/lib/content";
import { ClapperIcon } from "./Logo";

export function ProjectCard({ project, index }: { project: ProjectMeta; index: number }) {
  return (
    <Link href={`/work/${project.slug}`} className={`card accent-${project.accent}`}>
      <div className="card__bar accent-bg" />
      <div className="label" style={{ fontSize: 11, letterSpacing: "0.15em" }}>
        {String(index + 1).padStart(2, "0")} · {project.kind}
      </div>
      <h3 className="display">{project.title}</h3>
      <p>{project.summary}</p>
      <div className="card__chips">
        {project.stack.slice(0, 3).map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
      </div>
      {project.walkthroughStyle && (
        <div className="badge-walk accent-fg">
          <ClapperIcon />
          <span>Walkthrough: {project.walkthroughStyle}</span>
        </div>
      )}
      <span className="link-arrow">View project →</span>
    </Link>
  );
}
