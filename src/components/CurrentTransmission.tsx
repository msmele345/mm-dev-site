import { currentTransmission } from "@/content/current-transmission";
import { listPosts } from "@/lib/posts";

export default function CurrentTransmission() {
  const { updatedOn, nowBuilding, nextExperiment } = currentTransmission;
  const emptyBlog = listPosts().length === 0;
  const updatedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  }).formatToParts(new Date(`${updatedOn}T00:00:00Z`))
    .map(({ type, value }) => type === "month" ? value.slice(0, 3) : value)
    .join("").toUpperCase();

  return (
    <section className="transmission" aria-labelledby="transmission-title">
      <div className="transmission__inner">
        <header className="transmission__header">
          <h2 id="transmission-title">Current Transmission</h2>
          <p>UPDATED · <time dateTime={updatedOn}>{updatedDate}</time></p>
        </header>
        <div className="transmission__signals">
          <article className="transmission__signal" aria-labelledby="building-title">
            <p className="transmission__label">Now Building</p>
            <h3 id="building-title">
              <a className="transmission__link" href={nowBuilding.destination}>{nowBuilding.headline}</a>
            </h3>
            <p className="transmission__copy">{nowBuilding.supportingText}</p>
            <p className="transmission__footer">Repository <span aria-hidden="true">↗</span></p>
          </article>
          {/* Populated Latest Dispatch is the next ticket; never claim a real blog is empty. */}
          {emptyBlog ? (
            <article className="transmission__signal" aria-labelledby="dispatch-title">
              <p className="transmission__label">Latest Dispatch</p>
              <h3 id="dispatch-title">FIRST DISPATCH PENDING</h3>
              <p className="transmission__copy">Field notes are being prepared.</p>
              <p className="transmission__footer">OFF AIR</p>
            </article>
          ) : null}
          <article className="transmission__signal" aria-labelledby="experiment-title">
            <p className="transmission__label">Next Experiment</p>
            <h3 id="experiment-title">{nextExperiment.headline}</h3>
            <p className="transmission__copy">{nextExperiment.supportingText}</p>
            <p className="transmission__footer">IN CONCEPT</p>
          </article>
        </div>
      </div>
    </section>
  );
}
