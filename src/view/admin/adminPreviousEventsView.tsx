"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import YearGroup from "@/components/admin/event/YearGroup";
import MonthGroup from "@/components/admin/event/MonthGroup";
import PreviousEventsSkeleton from "@/components/admin/skeletons/PreviousEventsSkeleton";
import TicketCard from "@/components/admin/event/TicketCard";
import CreateEventModal from "@/components/admin/event/CreateEventModal";
import CalendarContextMenu from "@/components/admin/calendar/CalendarContextMenu";
import EventDetailModal from "@/components/admin/calendar/EventDetailModal";
import DeleteEventDialog from "@/components/admin/calendar/DeleteEventDialog";
import type { AdminEvent, CreateEventInput } from "@/types/adminEvent";
import type { CalendarEvent } from "@/types/adminCalendar";

const CARD_STEP = 304;

type MonthBucket = { key: string; label: string; events: AdminEvent[] };

function getMonthBuckets(events: AdminEvent[]): MonthBucket[] {
  const map = new Map<string, AdminEvent[]>();
  for (const event of events) {
    const key = new Date(event.start_at).toLocaleDateString("en", {
      month: "long",
      year: "numeric",
    });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(event);
  }
  return Array.from(map.entries())
    .map(([key, events]) => ({ key, label: key.split(" ")[0], events }))
    .sort((a, b) => new Date(b.events[0].start_at).getTime() - new Date(a.events[0].start_at).getTime());
}

type Props = {
  eventsByYear: { year: number; events: AdminEvent[] }[];
  isLoading: boolean;
  isCreating: boolean;
  onAddNew: () => void;
  onSave: (input: CreateEventInput) => Promise<void>;
  onCancelCreate: () => void;
  onPublish: (id: number) => void;
  onUpdate: (id: number, input: CreateEventInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isDeletingId: number | null;
};

export default function AdminPreviousEventsView({
  eventsByYear,
  isLoading,
  isCreating,
  onAddNew,
  onSave,
  onCancelCreate,
  onPublish,
  onUpdate,
  onDelete,
  isDeletingId,
}: Props) {
  const t = useTranslations("AdminPreviousEvents");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [selectedYear, setSelectedYear] = useState<number | null>(eventsByYear[0]?.year ?? null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const yearEvents = eventsByYear.find((g) => g.year === selectedYear)?.events ?? [];
  const monthBuckets = getMonthBuckets(yearEvents);

  useEffect(() => {
    if (!selectedYear && eventsByYear.length > 0) setSelectedYear(eventsByYear[0].year);
  }, [eventsByYear]);

  useEffect(() => {
    setSelectedMonth(monthBuckets[0]?.key ?? null);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [selectedYear]);

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

  const selectedEvents = monthBuckets.find((b) => b.key === selectedMonth)?.events ?? [];

  useEffect(() => { updateScrollButtons(); }, [selectedEvents]);

  return (
    <div className="px-6 pb-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
        <Button onClick={onAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addNew")}
        </Button>
      </div>

      {isLoading ? (
        <PreviousEventsSkeleton />
      ) : eventsByYear.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-border text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          {/* Year circles */}
          <div className="flex flex-wrap gap-4 border-b border-border p-6">
            {eventsByYear.map(({ year, events }) => (
              <YearGroup
                key={year}
                year={year}
                eventCount={events.length}
                selected={selectedYear === year}
                onClick={() => setSelectedYear(year)}
              />
            ))}
          </div>

          {/* Month circles */}
          <div className="flex flex-wrap gap-4 border-b border-border bg-muted/10 px-6 py-4">
            {monthBuckets.map(({ key, label, events }) => (
              <MonthGroup
                key={key}
                month={label}
                eventCount={events.length}
                selected={selectedMonth === key}
                onClick={() => {
                  setSelectedMonth(key);
                  setTimeout(() => {
                    updateScrollButtons();
                    scrollRef.current?.scrollTo({ left: 0 });
                  }, 0);
                }}
              />
            ))}
          </div>

          {/* Scrollable event cards */}
          <div className="bg-muted/30 p-6">
            {selectedEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("empty")}</p>
            ) : (
              <div className="relative">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </button>

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

      {isCreating && (
        <CreateEventModal onSave={onSave} onCancel={onCancelCreate} defaultType="previous" />
      )}

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
