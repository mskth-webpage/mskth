import type { PrayerTimesData, PrayerTimesResponse } from "@/types/prayerTimes";

const STOCKHOLM_MOSQUE = { latitude: 59.3326, longitude: 18.0649 };

/** Returns today's calendar date in Stockholm as YYYY-MM-DD. */
export function stockholmDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Returns a valid ISO date or falls back to today's date in Stockholm. */
export function validDate(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : stockholmDate();
}

/** Moves an ISO calendar date by the requested number of days. */
export function shiftDate(date: string, days: number) {
  const shifted = new Date(`${date}T12:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

/** Fetches a cached daily timetable using Stockholm Mosque's published calculation profile. */
export async function fetchPrayerTimes(date: string): Promise<PrayerTimesData | null> {
  const apiDate = date.split("-").reverse().join("-");
  const params = new URLSearchParams({
    latitude: String(STOCKHOLM_MOSQUE.latitude),
    longitude: String(STOCKHOLM_MOSQUE.longitude),
    // Stockholm Mosque publishes Muslim Pro's Stockholm timetable. Its 12°
    // high-latitude profile and local minute corrections are reproduced here.
    method: "12",
    tune: "0,-6,-7,5,4,8,0,-1,0",
  });

  try {
    const response = await fetch(`https://api.aladhan.com/v1/timings/${apiDate}?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const result = (await response.json()) as PrayerTimesResponse;
    return result.code === 200 ? result.data : null;
  } catch {
    return null;
  }
}
