"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ContentCard from "@/components/admin/ContentCard";
import type { AdminEvent } from "@/types/adminEvent";

/** Show the countdown only when registration closes within this window. */
const THRESHOLD_MS = 2 * 24 * 60 * 60 * 1000;

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number } | null;

/**
 * Computes remaining time until `target`.
 * Returns null when the target is in the past or further away than THRESHOLD_MS.
 */
function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0 || diff > THRESHOLD_MS) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

/**
 * Live countdown hook. Ticks every second while the ISO date string is
 * within THRESHOLD_MS. Returns null when isoString is null, expired, or too far away.
 * Uses the string as the effect dependency to avoid stale-closure / infinite-loop issues
 * that arise from passing a new Date object on every render.
 */
function useCountdown(isoString: string | null): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    isoString ? getTimeLeft(new Date(isoString)) : null,
  );

  useEffect(() => {
    if (!isoString) { setTimeLeft(null); return; }
    const target = new Date(isoString);
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [isoString]);

  return timeLeft;
}

/** Single time-unit block showing a zero-padded number above a short label. */
function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex h-9 w-10 items-center justify-center rounded-md bg-countdown-unit text-base font-bold tabular-nums text-countdown-foreground">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-countdown-muted">
        {label}
      </span>
    </div>
  );
}

/** Colon separator rendered between TimeUnit blocks. */
function Colon() {
  return (
    <span className="mb-4 text-sm font-bold text-countdown-separator">:</span>
  );
}

type Props = { event: AdminEvent };

/**
 * Public-facing event card shown on the home page.
 * Displays the event date header, audience and language badges, event details,
 * and — when registration closes within THRESHOLD_MS — a live countdown timer.
 */
export default function PublicEventCard({ event }: Props) {
  const t = useTranslations("HomePage.events");
  const start = new Date(event.start_at);
  const timeLeft = useCountdown(event.registration_closes_at ?? null);

  const timeLabel =
    start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) +
    (event.end_at
      ? ` – ${new Date(event.end_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`
      : "");

  const audienceLabel =
    event.audience === "brothers"
      ? t("audienceBrothers")
      : event.audience === "sisters"
      ? t("audienceSisters")
      : t("audienceAll");

  const audienceVariant: "success" | "warning" =
    event.audience === "sisters" ? "warning" : "success";

  const langBadge =
    event.language === "en"
      ? { label: t("langEn"), className: "bg-lang-en text-lang-en-foreground" }
      : event.language === "sv"
      ? { label: t("langSv"), className: "bg-lang-sv text-lang-sv-foreground" }
      : event.language === "both"
      ? { label: t("langBoth"), className: "bg-lang-both text-lang-both-foreground" }
      : undefined;

  const meta = [
    { icon: <Clock className="h-3 w-3 shrink-0" />, label: timeLabel },
    ...(event.location ? [{ icon: <MapPin className="h-3 w-3 shrink-0" />, label: event.location }] : []),
  ];

  return (
    <ContentCard
      className="w-[340px]"
      header={{
        type: "date",
        date: start,
        statusLabel: audienceLabel,
        statusVariant: audienceVariant,
        secondaryBadge: langBadge,
      }}
      title={event.title}
      description={event.description ?? undefined}
      meta={meta}
      extra={
        timeLeft ? (
          <div className="rounded-lg border border-countdown-border bg-countdown px-3 py-2">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-countdown-muted">
              Registration closes in
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {timeLeft.days > 0 && (
                <>
                  <TimeUnit value={timeLeft.days} label="days" />
                  <Colon />
                </>
              )}
              <TimeUnit value={timeLeft.hours} label="hrs" />
              <Colon />
              <TimeUnit value={timeLeft.minutes} label="min" />
              <Colon />
              <TimeUnit value={timeLeft.seconds} label="sec" />
            </div>
          </div>
        ) : null
      }
      scallop
      actions={
        <Link
          href="/events"
          className="w-full rounded-full border border-primary px-4 py-1.5 text-center text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          {t("viewDetails")}
        </Link>
      }
    />
  );
}
