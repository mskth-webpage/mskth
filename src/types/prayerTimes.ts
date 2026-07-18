export const DISPLAYED_PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export type PrayerName = (typeof DISPLAYED_PRAYERS)[number];
export type PrayerTimings = Record<PrayerName, string>;

export type PrayerTimesData = {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: { date: string; month: { en: string }; year: string };
  };
  meta: { method: { name: string }; timezone: string };
};

export type PrayerTimesResponse = {
  code: number;
  data: PrayerTimesData;
};
