"use client";

import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types/adminCalendar";

const PX_PER_HOUR = 60;
const PX_PER_SLOT = PX_PER_HOUR / 2;
const START_HOUR = 5;
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

function eventPos(event: CalendarEvent): { top: number; height: number } | null {
  const start = new Date(event.start_at);
  const startMin = start.getHours() * 60 + start.getMinutes();
  const endMin = event.end_at
    ? new Date(event.end_at).getHours() * 60 + new Date(event.end_at).getMinutes()
    : startMin + 60;

  if (endMin <= START_MIN) return null;

  const ppm = PX_PER_HOUR / 60;
  const top = Math.max(startMin - START_MIN, 0) * ppm;
  const bottom = Math.min(endMin - START_MIN, SLOTS.length * 30) * ppm;
  return { top, height: Math.max(bottom - top, 26) };
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function DayView({ date, events, onSlotSelect, onEventContextMenu }: Props) {
  const now = useNow();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const nowTop = (() => {
    const min = now.getHours() * 60 + now.getMinutes();
    if (min <= START_MIN) return null;
    return (min - START_MIN) * (PX_PER_HOUR / 60);
  })();

  const dayEvents = useMemo(
    () =>
      events.filter((e) => {
        const d = new Date(e.start_at);
        return (
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
        );
      }),
    [date, events],
  );

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 720 }}>
      {/* Header */}
      <div className="sticky top-0 z-10 grid grid-cols-[4rem_1fr] border-b-2 border-blue-100 bg-gradient-to-b from-primary/10 to-primary/5">
        <div />
        <div className="border-l border-border px-4 py-3">
          <p className="text-xs uppercase text-muted-foreground">
            {date.toLocaleDateString("en", { weekday: "long" })}
          </p>
          <p className="text-2xl font-bold text-foreground">{date.getDate()}</p>
        </div>
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-[4rem_1fr]" style={{ height: TOTAL_H }}>
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

        {/* Events column */}
        <div
          className="relative cursor-pointer border-l border-border"
          onClick={() => onSlotSelect(date)}
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

          {/* Current time indicator */}
          {isToday && nowTop !== null && (
            <div
              className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
              style={{ top: nowTop }}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
              <span className="h-px flex-1 bg-red-500" />
            </div>
          )}

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
                className="absolute left-2 right-2 overflow-hidden rounded-lg border border-primary/30 bg-primary/15 px-3 text-left hover:bg-primary/25 transition-colors"
                style={{ top: pos.top, height: pos.height }}
              >
                <p className="truncate text-sm font-semibold text-primary">{event.title}</p>
                {pos.height >= 30 && (
                  <p className="truncate text-xs text-primary/70">
                    {new Date(event.start_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
                    {event.end_at && ` – ${new Date(event.end_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`}
                  </p>
                )}
                {pos.height >= 50 && event.location && (
                  <p className="truncate text-xs text-primary/60">{event.location}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
