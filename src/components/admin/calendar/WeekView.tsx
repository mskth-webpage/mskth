"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/adminCalendar";

const PX_PER_HOUR = 60;
const PX_PER_SLOT = PX_PER_HOUR / 2; // 30px per 30-min slot
const START_HOUR = 5; // grid starts at 05:00
const START_MIN = START_HOUR * 60;

// Slots from 05:00 to 23:30 — absolute slot indices 10..47
const SLOTS = Array.from({ length: 48 - START_HOUR * 2 }, (_, i) => {
  const abs = i + START_HOUR * 2;
  return {
    index: i,
    isHour: abs % 2 === 0,
    label: `${String(Math.floor(abs / 2)).padStart(2, "0")}:${abs % 2 === 0 ? "00" : "30"}`,
  };
});

const TOTAL_H = SLOTS.length * PX_PER_SLOT;

type Props = {
  date: Date;
  events: CalendarEvent[];
  onSlotSelect: (date: Date) => void;
  onEventContextMenu?: (event: CalendarEvent, position: { x: number; y: number }) => void;
};

function getWeekDays(date: Date): Date[] {
  const offset = (date.getDay() + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - offset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function eventPos(event: CalendarEvent): { top: number; height: number } | null {
  const start = new Date(event.start_at);
  const startMin = start.getHours() * 60 + start.getMinutes();
  const endMin = event.end_at
    ? new Date(event.end_at).getHours() * 60 + new Date(event.end_at).getMinutes()
    : startMin + 60;

  // Event ends before grid start — hide it
  if (endMin <= START_MIN) return null;

  const ppm = PX_PER_HOUR / 60;
  const top = Math.max(startMin - START_MIN, 0) * ppm;
  const bottom = Math.min(endMin - START_MIN, SLOTS.length * 30) * ppm;
  return { top, height: Math.max(bottom - top, 22) };
}

export default function WeekView({ date, events, onSlotSelect, onEventContextMenu }: Props) {
  const weekDays = useMemo(() => getWeekDays(date), [date]);
  const today = new Date();

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
    <div className="overflow-y-auto" style={{ maxHeight: 600 }}>
      {/* Header */}
      <div className="sticky top-0 z-10 grid grid-cols-[4rem_repeat(7,1fr)] border-b-2 border-blue-100 bg-gradient-to-b from-primary/10 to-primary/5">
        <div />
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "border-l border-border py-2 text-center",
              isToday(day) && "bg-primary/5",
            )}
          >
            <p className="text-[11px] font-semibold uppercase text-primary/70">
              {day.toLocaleDateString("en", { weekday: "short" })}
            </p>
            <span
              className={cn(
                "mx-auto mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground",
              )}
            >
              {day.getDate()}
            </span>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[4rem_repeat(7,1fr)]" style={{ height: TOTAL_H }}>
        {/* Time labels */}
        <div className="relative">
          {SLOTS.map((slot) => (
            <div
              key={slot.index}
              className="absolute right-2 flex justify-end"
              style={{
                top: slot.index === 0 ? 2 : slot.index * PX_PER_SLOT - (slot.isHour ? 8 : 6),
              }}
            >
              <span className={cn(
                "tabular-nums leading-none",
                slot.isHour
                  ? "text-[10px] font-semibold text-foreground/70"
                  : "text-[9px] font-medium text-muted-foreground/50",
              )}>
                {slot.label}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day) => {
          const k = dayKey(day);
          const dayEvents = eventsByDay.get(k) ?? [];

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "relative cursor-pointer border-l border-border",
                isToday(day) && "bg-primary/5",
              )}
              onClick={() => onSlotSelect(day)}
            >
              {SLOTS.map((slot) => (
                <div
                  key={slot.index}
                  className={cn(
                    "absolute w-full border-t",
                    slot.isHour ? "border-border/50" : "border-border/20",
                  )}
                  style={{ top: slot.index * PX_PER_SLOT }}
                />
              ))}

              {dayEvents.map((event) => {
                const pos = eventPos(event);
                if (!pos) return null;
                return (
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
                    className="absolute left-0.5 right-0.5 overflow-hidden rounded border border-primary/30 bg-primary/15 px-1 text-left hover:bg-primary/25 transition-colors"
                    style={{ top: pos.top, height: pos.height }}
                  >
                    <p className="truncate text-[10px] font-semibold text-primary">{event.title}</p>
                    {pos.height >= 26 && (
                      <p className="truncate text-[9px] text-primary/70">
                        {new Date(event.start_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                        {event.end_at && ` – ${new Date(event.end_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`}
                      </p>
                    )}
                    {pos.height >= 44 && event.location && (
                      <p className="truncate text-[9px] text-primary/60">{event.location}</p>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
