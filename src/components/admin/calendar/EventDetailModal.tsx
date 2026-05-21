"use client";

import Image from "next/image";
import { X, MapPin, Clock, Users } from "lucide-react";

const MSKTH_LOGO = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/images/MSkth.png`;
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/types/adminCalendar";

type Props = {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function isValidUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatDateTime(iso: string, locale: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    time: d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

export default function EventDetailModal({ event, onClose, onEdit, onDelete }: Props) {
  const t = useTranslations("AdminCalendar");
  const locale = useLocale();

  const start = formatDateTime(event.start_at, locale);
  const end = event.end_at ? formatDateTime(event.end_at, locale) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thumbnail */}
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={isValidUrl(event.image_url) ? event.image_url : MSKTH_LOGO}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={isValidUrl(event.image_url) ? "object-cover" : "object-contain p-6 opacity-40"}
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>
          {event.status && (
            <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-primary-foreground">
              {event.status}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground">{event.title}</h2>

          <div className="mt-4 space-y-3">
            {/* Date & time */}
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-medium text-foreground">{start.date}</p>
                <p className="text-muted-foreground">
                  {start.time}
                  {end && ` – ${end.time}`}
                  {end && end.date !== start.date && ` (${end.date})`}
                </p>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-foreground">{event.location}</p>
              </div>
            )}

            {/* Participants */}
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">{event.joined_count}</span>{" "}
                {t("detailParticipants")}
              </p>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-2 rounded-lg bg-muted/50 p-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              {t("contextMenuDelete")}
            </Button>
            <Button size="sm" onClick={onEdit}>
              {t("contextMenuEdit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
