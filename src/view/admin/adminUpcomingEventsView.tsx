"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import MonthGroup from "@/components/admin/event/MonthGroup";
import TicketCard from "@/components/admin/event/TicketCard";
import UpcomingEventsSkeleton from "@/components/admin/skeletons/UpcomingEventsSkeleton";
import CreateEventModal from "@/components/admin/event/CreateEventModal";
import CalendarContextMenu from "@/components/admin/calendar/CalendarContextMenu";
import EventDetailModal from "@/components/admin/calendar/EventDetailModal";
import DeleteEventDialog from "@/components/admin/calendar/DeleteEventDialog";
import type { AdminEvent, CreateEventInput } from "@/types/adminEvent";
import type { CalendarEvent } from "@/types/adminCalendar";

const CARD_STEP = 304; // w-72 (288) + gap-4 (16)

type Props = {
  eventsByMonth: { month: string; events: AdminEvent[] }[];
  isCreating: boolean;
  onAddNew: () => void;
  onSave: (input: CreateEventInput) => Promise<void>;
  onCancelCreate: () => void;
  onPublish: (id: number) => void;
  onUpdate: (id: number, input: CreateEventInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isDeletingId: number | null;
  isLoading: boolean;
};

export default function AdminUpcomingEventsView({
  eventsByMonth,
  isCreating,
  onAddNew,
  onSave,
  onCancelCreate,
  onPublish,
  onUpdate,
  onDelete,
  isDeletingId,
  isLoading,
}: Props) {
  const t = useTranslations("AdminUpcomingEvents");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    eventsByMonth[0]?.month ?? null,
  );

  useEffect(() => {
    if (!selectedMonth && eventsByMonth.length > 0)
      setSelectedMonth(eventsByMonth[0].month);
  }, [eventsByMonth]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ event: AdminEvent; pos: { x: number; y: number } } | null>(null);
  const [detailEvent, setDetailEvent] = useState<AdminEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<AdminEvent | null>(null);

  const openEdit = (event: AdminEvent) => setEditingEvent(event);

  const handleCardClick = (event: AdminEvent, pos: { x: number; y: number }) => {
    setContextMenu({ event, pos });
  };

  const handleContextAction = (action: "show" | "edit" | "delete") => {
    if (!contextMenu) return;
    const { event } = contextMenu;
    setContextMenu(null);
    if (action === "show") setDetailEvent(event);
    else if (action === "edit") openEdit(event);
    else setDeleteEvent(event);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEvent) return;
    await onDelete(deleteEvent.id);
    setDeleteEvent(null);
  };

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
  };

  const selectedEvents =
    eventsByMonth.find((g) => g.month === selectedMonth)?.events ?? [];

  useEffect(() => { updateScrollButtons(); }, [selectedEvents]);

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
        <Button onClick={onAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addNew")}
        </Button>
      </div>

      {isLoading ? (
        <UpcomingEventsSkeleton />
      ) : eventsByMonth.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          {/* Month circles row */}
          <div className="flex flex-wrap gap-4 border-b border-border p-6">
            {eventsByMonth.map(({ month, events }) => (
              <MonthGroup
                key={month}
                month={month}
                eventCount={events.length}
                selected={selectedMonth === month}
                onClick={() => {
                  setSelectedMonth(month);
                  setTimeout(() => {
                    updateScrollButtons();
                    scrollRef.current?.scrollTo({ left: 0 });
                  }, 0);
                }}
              />
            ))}
          </div>

          {/* Scrollable events row */}
          <div className="bg-muted/30 p-6">
            {selectedEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("empty")}</p>
            ) : (
              <div className="relative">
                {/* Left arrow */}
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </button>

                {/* Cards track */}
                <div
                  ref={scrollRef}
                  onScroll={updateScrollButtons}
                  onLoad={updateScrollButtons}
                  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                >
                  {selectedEvents.map((event) => (
                    <div key={event.id} className="snap-start shrink-0">
                      <TicketCard
                        event={event}
                        onPublish={onPublish}
                        onEdit={openEdit}
                        onCardClick={handleCardClick}
                      />
                    </div>
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
                >
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {isCreating && <CreateEventModal onSave={onSave} onCancel={onCancelCreate} />}

      {editingEvent && (
        <CreateEventModal
          initialValues={editingEvent}
          onSave={(input) => onUpdate(editingEvent.id, input)}
          onCancel={() => setEditingEvent(null)}
        />
      )}

      {contextMenu && (
        <CalendarContextMenu
          event={contextMenu.event as CalendarEvent}
          position={contextMenu.pos}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      {detailEvent && (
        <EventDetailModal
          event={detailEvent as CalendarEvent}
          onClose={() => setDetailEvent(null)}
          onEdit={() => { setDetailEvent(null); openEdit(detailEvent); }}
          onDelete={() => { setDetailEvent(null); setDeleteEvent(detailEvent); }}
        />
      )}

      {deleteEvent && (
        <DeleteEventDialog
          event={deleteEvent as CalendarEvent}
          isDeletingId={isDeletingId}
          onOpenChange={(open) => { if (!open) setDeleteEvent(null); }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
