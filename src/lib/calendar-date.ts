const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

/** Display a validated yyyy-mm-dd calendar date without locale or timezone drift. */
export function formatCalendarDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
}
