"use client";

import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/types/adminCalendar";

type Props = {
  event: CalendarEvent;
  isDeletingId: number | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/** Confirmation dialog for permanently deleting a calendar event. Disables actions while deletion is in flight. */
export default function DeleteEventDialog({ event, isDeletingId, onOpenChange, onConfirm }: Props) {
  const t = useTranslations("AdminCalendar");
  const isDeleting = isDeletingId === event.id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground">{t("deleteTitle")}</h3>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("deleteDescription", { title: event.title })}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {t("deleteCancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("deleteConfirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
