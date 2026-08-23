/**
 * @jsxImportSource react
 *
 * Pinned so this component can be rendered in a unit test: the Playwright
 * runner compiles JSX to its own element format unless a file names React
 * explicitly. Matches tsconfig's `react-jsx`, so it is a no-op for Next.
 */
import type { ProjectStats as Stats } from "@/content/projects/enrichment";

type ProjectStatsProps = {
  stats: Stats | null;
  variant: "tile" | "case";
};

/**
 * The one place enrichment (ADR 0004) is rendered. Live GitHub stats are
 * deliberately dressed in the chrome's electric lime rather than the
 * project's own palette — they are the site talking about the project, not
 * part of the project's identity.
 *
 * `stats: null` renders nothing: a project with no remote, or a build where
 * GitHub was unreachable, simply shows its curated content.
 */
export default function ProjectStats({ stats, variant }: ProjectStatsProps) {
  if (!stats) return null;

  const languages = stats.languages.slice(0, variant === "tile" ? 3 : 4);
  const commits = `${formatCount(stats.commitCount)} commit${stats.commitCount === 1 ? "" : "s"}`;
  const lastPush = (
    <time dateTime={stats.lastPushedAt}>{formatPushDate(stats.lastPushedAt)}</time>
  );

  if (variant === "tile") {
    return (
      <p className="enrichment enrichment--tile">
        <span className="enrichment__figure">{commits}</span>
        <span className="enrichment__figure">Last active {lastPush}</span>
        {languages.map((language) => (
          <span className="enrichment__chip" key={language.name}>
            {language.name}
          </span>
        ))}
      </p>
    );
  }

  return (
    <section className="enrichment enrichment--case" aria-labelledby="case-live">
      <h2 id="case-live">Live from GitHub</h2>
      <dl className="enrichment__figures">
        <div>
          <dt>Commits</dt>
          <dd>{formatCount(stats.commitCount)}</dd>
        </div>
        <div>
          <dt>Last active</dt>
          <dd>{lastPush}</dd>
        </div>
      </dl>
      {languages.length > 0 ? (
        <ul className="enrichment__chips">
          {languages.map((language) => (
            <li className="enrichment__chip" key={language.name}>
              {language.name}
              <span className="enrichment__share">
                {formatShare(language.share)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="enrichment__note">Read from the GitHub API at build time.</p>
    </section>
  );
}

/**
 * Pinned to en-GB and UTC: the date is baked into static HTML at build time,
 * so it must not depend on which machine or region ran the build.
 */
const PUSH_DATE = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatPushDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : PUSH_DATE.format(date);
}

/** Grouped the same way on every machine — the digits are baked into static HTML. */
function formatCount(count: number): string {
  return count.toLocaleString("en-GB");
}

function formatShare(share: number): string {
  const percent = Math.round(share * 100);
  return percent < 1 ? "<1%" : `${percent}%`;
}
