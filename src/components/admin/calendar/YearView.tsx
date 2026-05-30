"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/adminCalendar";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];

type Props = {
  date: Date;
  events: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
};

function buildMiniGrid(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startOffset = (first.getDay() + 6) % 7;
  const grid: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= lastDay; d++) grid.push(d);
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export default function YearView({ date, events, onSelectDate }: Props) {
  const year = date.getFullYear();
  const today = new Date();

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const d = new Date(event.start_at);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    return map;
  }, [events]);

  return (
    <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }, (_, monthIndex) => {
        const grid = buildMiniGrid(year, monthIndex);

        return (
          <div
            key={monthIndex}
            className="rounded-xl border border-blue-200/70 bg-card p-4 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_4px_16px_rgba(59,130,246,0.1)]"
          >
            <p className="mb-3 text-sm font-semibold text-foreground">
              {MONTH_NAMES[monthIndex]}
            </p>

            <div className="grid grid-cols-7">
              {DAY_INITIALS.map((d, i) => (
                <div
                  key={i}
                  className="py-0.5 text-center text-[9px] font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {grid.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="h-6" />;

                const key = `${year}-${monthIndex}-${day}`;
                const dayEvents = eventsByDay.get(key) ?? [];
                const hasEvent = dayEvents.length > 0;
                const isToday =
                  day === today.getDate() &&
                  monthIndex === today.getMonth() &&
                  year === today.getFullYear();

                return (
                  <div key={day} className="group relative flex justify-center">
                    <button
                      onClick={() => onSelectDate?.(new Date(year, monthIndex, day))}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : hasEvent
                            ? "ring-1 ring-primary/50 text-primary hover:bg-primary/10"
                            : "text-foreground hover:bg-muted",
                      )}
                    >
                      {day}
                    </button>

                    {hasEvent && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 hidden w-max max-w-[180px] -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 shadow-lg group-hover:block">
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <div key={event.id} className="flex items-center gap-1.5">
                              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                                {new Date(event.start_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })}
                              </span>
                              <span className="truncate text-[11px] font-medium text-foreground">
                                {event.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

