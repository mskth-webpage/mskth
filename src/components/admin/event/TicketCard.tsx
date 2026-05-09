"use client";

import { Clock, Globe, MapPin, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ContentCard from "@/components/admin/ContentCard";
import type { AdminEvent } from "@/types/adminEvent";

type Props = {
  event: AdminEvent;
  onPublish: (id: number) => void;
  onEdit: (event: AdminEvent) => void;
  onCardClick: (event: AdminEvent, pos: { x: number; y: number }) => void;
};

export default function TicketCard({ event, onPublish, onEdit, onCardClick }: Props) {
  const t = useTranslations("AdminUpcomingEvents");
  const isPublished = event.status === "published";
  const start = new Date(event.start_at);

  const timeLabel =
    start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) +
    (event.end_at
      ? ` – ${new Date(event.end_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`
      : "");

  const langBadge =
    event.language === "en"
      ? { label: t("langBadgeEn"), className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" }
      : event.language === "sv"
      ? { label: t("langBadgeSv"), className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" }
      : event.language === "both"
      ? { label: t("langBadgeBoth"), className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" }
      : undefined;

  const meta = [
    { icon: <Clock className="h-3 w-3 shrink-0" />, label: timeLabel },
    ...(event.location ? [{ icon: <MapPin className="h-3 w-3 shrink-0" />, label: event.location }] : []),
    ...(langBadge ? [{ icon: <Globe className="h-3 w-3 shrink-0" />, label: langBadge.label }] : []),
  ];

  return (
    <ContentCard
      header={{
        type: "date",
        date: start,
        statusLabel: isPublished ? t("statusPublished") : t("statusDraft"),
        statusVariant: isPublished ? "success" : "warning",
        secondaryBadge: langBadge,
      }}
      title={event.title}
      description={event.description ?? undefined}
      meta={meta}
      scallop
      onClick={(e) => onCardClick(event, { x: e.clientX, y: e.clientY })}
      actions={
        <>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={(e) => onCardClick(event, { x: e.clientX, y: e.clientY })}
          >
            <MoreVertical className="h-3 w-3" />
            {t("options")}
          </Button>
          <Button
            size="sm"
            variant={isPublished ? "outline" : "default"}
            className="rounded-full text-xs"
            onClick={() => onPublish(event.id)}
          >
            {isPublished ? t("unpublishAction") : t("publishAction")}
          </Button>
        </>
      }
    />
  );
}
