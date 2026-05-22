"use client";

import { useCallback, useState } from "react";
import useSWR, { mutate } from "swr";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import AdminCalendarView from "@/view/admin/adminCalendarView";
import type { CalendarEvent, ViewMode } from "@/types/adminCalendar";
import {
  calendarFetcher,
  buildCalendarLabel,
  advanceCalendarDate,
  buildCalendarSwrKey,
} from "@/lib/calendarUtils";

/** Fetches calendar events for the active view range and wires all user interactions to the view. */
export default function CalendarPresenter() {
  const locale = useLocale();
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<ViewMode>("month");
  const [contextMenu, setContextMenu] = useState<{
    event: CalendarEvent;
    position: { x: number; y: number };
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const swrKey = buildCalendarSwrKey(currentDate, view);

  const { data: events = [], isLoading } = useSWR<CalendarEvent[]>(swrKey, calendarFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  const handleChangeDate = useCallback(
    (offset: number) => {
      setCurrentDate((prev) => advanceCalendarDate(prev, view, offset));
    },
    [view],
  );

  const handleContextMenuAction = useCallback(
    (action: "show" | "edit" | "delete") => {
      if (!contextMenu) return;
      const { event } = contextMenu;
      setContextMenu(null);
      if (action === "delete") {
        setEventToDelete(event);
      } else if (action === "edit") {
        router.push(`/admin/event/${event.id}/edit` as never);
      } else {
        setSelectedEvent(event);
      }
    },
    [contextMenu],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!eventToDelete) return;
    setIsDeletingId(eventToDelete.id);
    try {
      await fetch(`/api/admin/calendar?id=${eventToDelete.id}`, { method: "DELETE" });
      await mutate(swrKey);
      setEventToDelete(null);
    } finally {
      setIsDeletingId(null);
    }
  }, [eventToDelete, swrKey]);

  return (
    <AdminCalendarView
      currentDate={currentDate}
      view={view}
      events={events}
      dateRangeLabel={buildCalendarLabel(currentDate, view, locale)}
      onChangeDate={handleChangeDate}
      onSetView={setView}
      onSetToday={() => setCurrentDate(new Date())}
      onAddEvent={() => router.push("/admin/event")}
      onSlotSelect={setCurrentDate}
      onEventContextMenu={(event, position) => setContextMenu({ event, position })}
      contextMenu={contextMenu}
      onCloseContextMenu={() => setContextMenu(null)}
      onContextMenuAction={handleContextMenuAction}
      selectedEvent={selectedEvent}
      onCloseDetail={() => setSelectedEvent(null)}
      onEditFromDetail={() => {
        if (selectedEvent) router.push(`/admin/event/${selectedEvent.id}/edit` as never);
        setSelectedEvent(null);
      }}
      onDeleteFromDetail={() => {
        if (selectedEvent) setEventToDelete(selectedEvent);
        setSelectedEvent(null);
      }}
      eventToDelete={eventToDelete}
      isDeletingId={isDeletingId}
      onDeleteDialogOpenChange={(open) => {
        if (!open) setEventToDelete(null);
      }}
      onConfirmDelete={handleConfirmDelete}
      isLoading={isLoading}
    />
  );
}
