import Link from "next/link";
import type { ReactNode } from "react";
import { currentTransmission } from "@/content/current-transmission";
import { formatCalendarDate } from "@/lib/calendar-date";
import { listPosts } from "@/lib/posts";

type TransmissionSignalProps = {
  titleId: string;
  label: string;
  headline: string;
  supportingText: string;
  footer: ReactNode;
  destination?: string;
};

function TransmissionSignal({ titleId, label, headline, supportingText, footer, destination }: TransmissionSignalProps) {
  return (
    <article className="transmission__signal" aria-labelledby={titleId}>
      <p className="transmission__label">{label}</p>
      <h3 id={titleId}>
        {destination ? (
          destination.startsWith("/") ? (
            <Link className="transmission__link" href={destination}>{headline}</Link>
          ) : (
            <a className="transmission__link" href={destination}>{headline}</a>
          )
        ) : headline}
      </h3>
      <p className="transmission__copy">{supportingText}</p>
      <p className="transmission__footer">{footer}</p>
    </article>
  );
}

export default function CurrentTransmission() {
  const { updatedOn, nowBuilding, nextExperiment } = currentTransmission;
  const latestPost = listPosts()[0];

  return (
    <section className="transmission" aria-labelledby="transmission-title">
      <div className="transmission__inner">
        <header className="transmission__header">
          <h2 id="transmission-title">Current Transmission</h2>
          <p>UPDATED · <time dateTime={updatedOn}>{formatCalendarDate(updatedOn)}</time></p>
        </header>
        <div className="transmission__signals">
          <TransmissionSignal
            titleId="building-title"
            label="Now Building"
            {...nowBuilding}
            footer={<>Repository <span aria-hidden="true">↗</span></>}
          />
          <TransmissionSignal
            titleId="dispatch-title"
            label="Latest Dispatch"
            headline={latestPost?.title ?? "FIRST DISPATCH PENDING"}
            supportingText={latestPost?.summary ?? "Field notes are being prepared."}
            destination={latestPost ? `/blog/${latestPost.slug}` : undefined}
            footer={latestPost ? <time dateTime={latestPost.date}>{formatCalendarDate(latestPost.date)}</time> : "OFF AIR"}
          />
          <TransmissionSignal
            titleId="experiment-title"
            label="Next Experiment"
            {...nextExperiment}
            footer="IN CONCEPT"
          />
        </div>
      </div>
    </section>
  );
}
