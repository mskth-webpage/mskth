"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof PRAYERS)[number];

type Props = {
  date: string;
  timings: Record<PrayerName, string>;
  nextDayFajr: string;
  labels: Record<PrayerName, string> & {
    nextPrayer: string;
    tomorrow: string;
    hourShort: string;
    minuteShort: string;
    secondShort: string;
  };
};

function stockholmTimeToDate(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.replace(/\s*\(.+\)$/, "").split(":").map(Number);
  const desiredUtc = Date.UTC(year, month - 1, day, hour, minute);
  const guess = new Date(desiredUtc);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(guess);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const observedUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
  );
  return new Date(desiredUtc + (desiredUtc - observedUtc));
}

function tomorrow(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

/** Live countdown to the next prayer in Stockholm, switching to tomorrow's Fajr after Isha. */
export default function NextPrayerCountdown({ date, timings, nextDayFajr, labels }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const next = (() => {
    if (!now) return null;
    for (const prayer of PRAYERS) {
      const at = stockholmTimeToDate(date, timings[prayer]);
      if (at.getTime() > now.getTime()) return { prayer, at, isTomorrow: false };
    }
    return {
      prayer: "Fajr" as const,
      at: stockholmTimeToDate(tomorrow(date), nextDayFajr),
      isTomorrow: true,
    };
  })();

  if (!next || !now) return <div className="mt-7 h-[76px] animate-pulse rounded-2xl bg-muted" />;

  const remainingSeconds = Math.max(0, Math.ceil((next.at.getTime() - now.getTime()) / 1_000));
  const remainingMinutes = Math.ceil(remainingSeconds / 60);
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  const countdown = remainingSeconds < 3_600
    ? `${Math.floor(remainingSeconds / 60)} ${labels.minuteShort} ${remainingSeconds % 60} ${labels.secondShort}`
    : `${hours} ${labels.hourShort} ${minutes} ${labels.minuteShort}`;

  return (
    <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Timer className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{labels.nextPrayer}</p>
          <p className="mt-0.5 font-serif text-xl font-semibold">
            {labels[next.prayer]}{next.isTomorrow ? ` · ${labels.tomorrow}` : ""}
          </p>
        </div>
      </div>
      <p className="shrink-0 text-xl font-semibold tabular-nums text-primary sm:text-2xl" aria-live="polite">
        {countdown}
      </p>
    </div>
  );
}
