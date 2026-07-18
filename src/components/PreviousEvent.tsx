"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import PublicEventCard from "./PublicEventCard";
import type { AdminEvent } from "@/types/adminEvent";

type Props = {
  events: AdminEvent[];
  isLoading: boolean;
};

type MonthGroup = {
  key: string;
  label: string;
  events: AdminEvent[];
};

export default function PreviousEvent({ events, isLoading }: Props) {
  const t = useTranslations("Events");
  const locale = useLocale();
  const [requestedYear, setRequestedYear] = useState<number | null>(null);
  const [requestedMonth, setRequestedMonth] = useState<string | null>(null);

  const years = Array.from(new Set(events.map((event) => new Date(event.start_at).getFullYear())))
    .sort((a, b) => b - a);
  const selectedYear = requestedYear && years.includes(requestedYear) ? requestedYear : years[0];
  const yearEvents = events.filter((event) => new Date(event.start_at).getFullYear() === selectedYear);
  const months = yearEvents.reduce<MonthGroup[]>((groups, event) => {
    const date = new Date(event.start_at);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const existing = groups.find((group) => group.key === key);

    if (existing) existing.events.push(event);
    else groups.push({ key, label: date.toLocaleDateString(locale, { month: "long" }), events: [event] });

    return groups;
  }, []);
  const selectedMonth = requestedMonth && months.some((month) => month.key === requestedMonth)
    ? requestedMonth
    : months[0]?.key;
  const selectedEvents = months.find((month) => month.key === selectedMonth)?.events ?? [];

  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-4 pb-20 pt-5 text-center sm:px-8 sm:pb-28 sm:pt-10">
      <h2 className="font-serif text-xl font-medium uppercase sm:text-3xl lg:text-4xl">
        {t("previous.title")}
      </h2>
      <p className="mt-2 font-serif text-xs text-foreground/70 sm:mt-4 sm:text-sm">
        {t("previous.description")}
      </p>

      {isLoading ? (
        <div className="mt-12 h-80 w-full animate-pulse rounded-2xl bg-muted" />
      ) : years.length === 0 ? (
        <p className="py-20 text-sm text-muted-foreground">{t("previous.empty")}</p>
      ) : (
        <div className="mt-10 w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm sm:mt-14">
          <div className="flex flex-wrap justify-center gap-3 border-b border-border p-4 sm:justify-start sm:gap-4 sm:p-6">
            {years.map((year) => {
              const count = events.filter((event) => new Date(event.start_at).getFullYear() === year).length;
              const active = selectedYear === year;

              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => { setRequestedYear(year); setRequestedMonth(null); }}
                  className={`flex h-20 w-20 flex-col items-center justify-center rounded-full border-[3px] shadow-md transition-colors sm:h-24 sm:w-24 ${active ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 bg-card text-primary hover:border-primary"}`}
                >
                  <span className="text-base font-bold sm:text-lg">{year}</span>
                  <span className="text-[9px] opacity-65 sm:text-[10px]">{t("previous.eventCount", { count })}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-3 border-b border-border bg-muted/10 p-4 sm:justify-start sm:gap-4 sm:px-6">
            {months.map((month) => {
              const active = selectedMonth === month.key;

              return (
                <button
                  key={month.key}
                  type="button"
                  onClick={() => setRequestedMonth(month.key)}
                  className={`flex h-20 w-20 flex-col items-center justify-center rounded-full border-[3px] shadow-md transition-colors sm:h-24 sm:w-24 ${active ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 bg-card text-primary hover:border-primary"}`}
                >
                  <span className="text-xs font-bold capitalize sm:text-sm">{month.label}</span>
                  <span className="mt-1 text-[9px] opacity-65 sm:text-[10px]">{t("previous.eventCount", { count: month.events.length })}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-muted/30 p-4 sm:p-6">
            <div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {selectedEvents.map((event) => (
                <div key={event.id} className="shrink-0 snap-start">
                  <PublicEventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
