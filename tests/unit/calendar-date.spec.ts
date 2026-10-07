import { expect, test } from "@playwright/test";
import { formatCalendarDate } from "@/lib/calendar-date";

const calendarDates = [
  ["2026-01-02", "02 JAN 2026"],
  ["2026-02-02", "02 FEB 2026"],
  ["2026-03-02", "02 MAR 2026"],
  ["2026-04-02", "02 APR 2026"],
  ["2026-05-02", "02 MAY 2026"],
  ["2026-06-02", "02 JUN 2026"],
  ["2026-07-02", "02 JUL 2026"],
  ["2026-08-02", "02 AUG 2026"],
  ["2026-09-02", "02 SEP 2026"],
  ["2026-10-02", "02 OCT 2026"],
  ["2026-11-02", "02 NOV 2026"],
  ["2026-12-02", "02 DEC 2026"],
] as const;

for (const [date, formatted] of calendarDates) {
  test(`formats ${date} with a padded day and a fixed three-letter month`, () => {
    expect(formatCalendarDate(date)).toBe(formatted);
  });
}

test("keeps the authored calendar day when the runtime is behind UTC", () => {
  const previousTimezone = process.env.TZ;
  process.env.TZ = "America/Los_Angeles";

  try {
    expect(formatCalendarDate("2026-09-02")).toBe("02 SEP 2026");
  } finally {
    if (previousTimezone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = previousTimezone;
    }
  }
});
