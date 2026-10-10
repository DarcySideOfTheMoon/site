import Link from "next/link";
import type { Specs } from "@/lib/content";

const difficultyWords = ["", "Starter", "Easy", "Intermediate", "Advanced", "Expert"];

export function BuildSpecs({
  specs,
  project,
}: {
  specs: Specs;
  project?: { slug: string; title: string } | null;
}) {
  return (
    <section className="specs" aria-label="Build specs">
      <div className="specs__head">
        <div className="label" style={{ fontSize: 11, letterSpacing: "0.18em" }}>
          Build specs
        </div>
        {project && (
          <Link href={`/work/${project.slug}`} className="link-arrow">
            {project.title} →
          </Link>
        )}
      </div>

      <p className="specs__synopsis">
        <strong>Synopsis.</strong> {specs.synopsis}
      </p>

      <div className="specs__grid">
        <div className="specs__cell">
          <div className="label">What was built</div>
          <div>{specs.built}</div>
        </div>
        <div className="specs__cell">
          <div className="label">Time to ship</div>
          <div>{specs.timeToShip}</div>
        </div>
        <div className="specs__cell">
          <div className="label">Difficulty</div>
          <div className="difficulty">
            <div className="difficulty__bars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= specs.difficulty ? "on" : ""} />
              ))}
            </div>
            <span className="difficulty__word">
              {difficultyWords[specs.difficulty]} ({specs.difficulty}/5)
            </span>
          </div>
        </div>
      </div>

      {specs.tools.length > 0 && (
        <div className="specs__tools">
          <div className="label" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
            Tools used
          </div>
          <div className="card__chips">
            {specs.tools.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
