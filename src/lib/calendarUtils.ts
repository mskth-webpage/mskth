import type { ViewMode } from "@/types/adminCalendar";

/**
 * Fetches a JSON response from the given URL.
 * Intended as an SWR fetcher for calendar API endpoints.
 */
export const calendarFetcher = (url: string) =>
  fetch(url).then((r) => r.json());

/**
 * Advances (or rewinds) a calendar date by one unit for the given view.
 * - year: ±1 year
 * - month: ±1 month
 * - week: ±7 days
 * - day: ±1 day
 */
export function advanceCalendarDate(date: Date, view: ViewMode, offset: number): Date {
  const next = new Date(date);
  if (view === "year") next.setFullYear(date.getFullYear() + offset);
  else if (view === "month") next.setMonth(date.getMonth() + offset);
  else if (view === "week") next.setDate(date.getDate() + offset * 7);
  else next.setDate(date.getDate() + offset);
  return next;
}

/**
 * Builds the SWR cache key / API query string for the calendar endpoint
 * based on the current date and view mode.
 */
export function buildCalendarSwrKey(date: Date, view: ViewMode): string {
  const { from, to } = getCalendarRange(date, view);
  return `/api/admin/calendar?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
}

/**
 * Returns the ISO date range (from/to) that covers the given view period.
 * - year: Jan 1 – Dec 31
 * - month: first – last day of the month
 * - week: Monday 00:00 – Sunday 23:59
 * - day: 00:00 – 23:59 of the given date
 */
export function getCalendarRange(
  date: Date,
  view: ViewMode,
): { from: string; to: string } {
  const y = date.getFullYear();
  const m = date.getMonth();

  if (view === "year") {
    return {
      from: new Date(y, 0, 1).toISOString(),
      to: new Date(y, 11, 31, 23, 59, 59).toISOString(),
    };
  }
  if (view === "month") {
    return {
      from: new Date(y, m, 1).toISOString(),
      to: new Date(y, m + 1, 0, 23, 59, 59).toISOString(),
    };
  }
  if (view === "week") {
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { from: monday.toISOString(), to: sunday.toISOString() };
  }

  // day
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { from: start.toISOString(), to: end.toISOString() };
}

/**
 * Builds a human-readable date range label for the calendar header.
 * - year: "2026"
 * - month: "May 2026"
 * - week: "May 4 – May 10, 2026"
 * - day: "Saturday, May 9, 2026"
 */
export function buildCalendarLabel(
  date: Date,
  view: ViewMode,
  locale: string,
): string {
  const y = date.getFullYear();

  if (view === "year") return String(y);
  if (view === "month")
    return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
  if (view === "week") {
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${monday.toLocaleDateString(locale, { month: "short", day: "numeric" })} – ${sunday.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })}`;
  }

  return date.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
