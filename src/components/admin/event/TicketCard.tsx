"use client";

import { Clock, MapPin, Pencil } from "lucide-react";
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

  const meta = [
    { icon: <Clock className="h-3 w-3 shrink-0" />, label: timeLabel },
    ...(event.location ? [{ icon: <MapPin className="h-3 w-3 shrink-0" />, label: event.location }] : []),
  ];

  return (
    <ContentCard
      header={{
        type: "date",
        date: start,
        statusLabel: isPublished ? t("statusPublished") : t("statusDraft"),
        statusVariant: isPublished ? "success" : "warning",
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
            variant="ghost"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(event)}
          >
            <Pencil className="h-3 w-3" />
            {t("edit")}
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
