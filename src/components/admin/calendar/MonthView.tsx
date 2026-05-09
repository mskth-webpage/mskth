"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/adminCalendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  date: Date;
  events: CalendarEvent[];
  onSlotSelect: (date: Date) => void;
  onEventContextMenu?: (event: CalendarEvent, position: { x: number; y: number }) => void;
};

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const grid: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= last.getDate(); d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

const isWeekend = (colIndex: number) => colIndex === 5 || colIndex === 6;

export default function MonthView({ date, events, onSlotSelect, onEventContextMenu }: Props) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const k = dayKey(new Date(event.start_at));
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(event);
    }
    return map;
  }, [events]);

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <div>
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b-2 border-blue-100 bg-gradient-to-b from-primary/10 to-primary/5">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={cn(
              "py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider",
              isWeekend(i) ? "text-primary/50" : "text-primary/70",
              i > 0 && "border-l border-blue-100/80",
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {grid.map((day, i) => {
          const col = i % 7;

          if (!day) {
            return (
              <div
                key={`empty-${i}`}
                className={cn(
                  "min-h-[130px] border-b border-r border-slate-200",
                  isWeekend(col) ? "bg-slate-50/70" : "bg-slate-50/30",
                )}
              />
            );
          }

          const k = dayKey(day);
          const dayEvents = eventsByDay.get(k) ?? [];
          const MAX = 3;
          const overflow = dayEvents.length - MAX;
          const todayCell = isToday(day);

          return (
            <div
              key={k}
              onClick={() => onSlotSelect(day)}
              className={cn(
                "group min-h-[130px] border-b border-r border-slate-200 p-2 cursor-pointer transition-colors",
                todayCell ? "bg-primary/5" : "bg-white hover:bg-blue-50/50",
              )}
            >
              {/* Day number */}
              <div className="mb-1.5 flex justify-end">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    todayCell
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-slate-500 group-hover:bg-primary/10 group-hover:text-primary",
                  )}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, MAX).map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventContextMenu?.(event, { x: e.clientX, y: e.clientY });
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onEventContextMenu?.(event, { x: e.clientX, y: e.clientY });
                    }}
                    className="w-full truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                  >
                    {new Date(event.start_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    {event.title}
                  </button>
                ))}
                {overflow > 0 && (
                  <p className="px-1.5 text-[11px] font-medium text-muted-foreground">
                    +{overflow} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
