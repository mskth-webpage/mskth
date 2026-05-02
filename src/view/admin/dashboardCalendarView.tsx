"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export default function DashboardCalendarView() {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();
  const today = new Date();
  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = current.getFullYear();
  const month = current.getMonth();
  const days = getCalendarDays(year, month);

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const monthLabel = current.toLocaleDateString(locale, { month: "long" });
  const dayName = today.toLocaleDateString(locale, { weekday: "long" });
  const monthYear = today.toLocaleDateString(locale, { month: "long", year: "numeric" });

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">
        {t("overviewCalendar")}
      </h2>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col lg:flex-row">

          {/* Today spotlight */}
          <div className="flex flex-col justify-between bg-primary p-8 text-primary-foreground lg:w-56 lg:shrink-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                {t("today")}
              </p>
              <p className="mt-1 text-8xl font-bold leading-none tracking-tight">
                {today.getDate()}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold capitalize">{dayName}</p>
              <p className="mt-0.5 text-sm capitalize opacity-70">{monthYear}</p>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold capitalize">{monthLabel}</span>
                <span className="text-base font-semibold text-muted-foreground">{year}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={prev}
                  className="rounded-md p-1.5 transition-colors hover:bg-muted"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="rounded-md p-1.5 transition-colors hover:bg-muted"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-1 grid grid-cols-7 text-center">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-1 text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-center">
              {days.map((day, i) => (
                <div key={i} className="flex items-center justify-center py-1">
                  {day !== null && (
                    <span
                      className={clsx(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                        isToday(day)
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "cursor-pointer text-foreground hover:bg-muted",
                      )}
                    >
                      {day}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
