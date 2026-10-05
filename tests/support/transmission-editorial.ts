import { currentTransmission } from "@/content/current-transmission";
import { formatPostDate, listPosts } from "@/lib/posts";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** The header's contract (UPDATED · DD MMM YYYY), stated independently of the component. */
export function updatedLabel(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `UPDATED · ${day} ${MONTHS[Number(month) - 1]} ${year}`;
}

/**
 * What the real homepage should show today: the curated record and the newest
 * catalogue post. Editorial updates and new posts change these, not the tests.
 */
export function liveTransmission() {
  const latest = listPosts()[0];
  if (!latest) throw new Error("The production ledger tests need a published post; the empty state has its own fixture.");
  return {
    ...currentTransmission,
    dispatch: { ...latest, route: `/blog/${latest.slug}`, publishedOn: formatPostDate(latest.date) },
  };
}

/** Fresh content fixtures model the public manual-record contract. */
export function validEditorial() {
  return {
    updatedOn: "2025-03-14",
    nowBuilding: {
      headline: "FIELD ATLAS",
      supportingText: "Mapping the next geography experiment.",
      destination: "https://example.com/field-atlas",
    },
    nextExperiment: {
      headline: "SAIL SKETCHES",
      supportingText: "Considering an all-ages sailing prototype.",
    },
  };
}

export function editorialWith(field: string, value: unknown): Record<string, unknown> {
  const editorial: Record<string, unknown> = validEditorial();
  const [group, child] = field.split(".");
  const record = child ? editorial[group] as Record<string, unknown> : editorial;
  const key = child ?? group;
  if (value === undefined) delete record[key];
  else record[key] = value;
  return editorial;
}
