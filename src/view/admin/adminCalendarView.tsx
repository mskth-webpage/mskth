"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MonthView from "@/components/admin/calendar/MonthView";
import WeekView from "@/components/admin/calendar/WeekView";
import DayView from "@/components/admin/calendar/DayView";
import YearView from "@/components/admin/calendar/YearView";
import EventDetailModal from "@/components/admin/calendar/EventDetailModal";
import CalendarContextMenu from "@/components/admin/calendar/CalendarContextMenu";
import DeleteEventDialog from "@/components/admin/calendar/DeleteEventDialog";
import type { CalendarEvent, ViewMode } from "@/types/adminCalendar";

type Props = {
  currentDate: Date;
  view: ViewMode;
  events: CalendarEvent[];
  dateRangeLabel: string;
  onChangeDate: (offset: number) => void;
  onSetView: (view: ViewMode) => void;
  onSetToday: () => void;
  onAddEvent: () => void;
  onSlotSelect: (date: Date) => void;
  onEventContextMenu: (event: CalendarEvent, position: { x: number; y: number }) => void;
  contextMenu: { event: CalendarEvent; position: { x: number; y: number } } | null;
  onCloseContextMenu: () => void;
  onContextMenuAction: (action: "show" | "edit" | "delete") => void;
  selectedEvent: CalendarEvent | null;
  onCloseDetail: () => void;
  onEditFromDetail: () => void;
  onDeleteFromDetail: () => void;
  eventToDelete: CalendarEvent | null;
  isDeletingId: number | null;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  isLoading: boolean;
};

const VIEWS: ViewMode[] = ["year", "month", "week", "day"];

/** Renders the calendar shell — header, view switcher, active view panel, context menu, detail modal, and delete dialog. */
export default function AdminCalendarView({
  currentDate,
  view,
  events,
  dateRangeLabel,
  onChangeDate,
  onSetView,
  onSetToday,
  onAddEvent,
  onSlotSelect,
  onEventContextMenu,
  contextMenu,
  onCloseContextMenu,
  onContextMenuAction,
  selectedEvent,
  onCloseDetail,
  onEditFromDetail,
  onDeleteFromDetail,
  eventToDelete,
  isDeletingId,
  onDeleteDialogOpenChange,
  onConfirmDelete,
  isLoading,
}: Props) {
  const t = useTranslations("AdminCalendar");

  const VIEW_LABELS: Record<ViewMode, string> = {
    year: t("viewYear"),
    month: t("viewMonth"),
    week: t("viewWeek"),
    day: t("viewDay"),
  };

  return (
    <div className="px-4 py-6 lg:px-6 lg:py-8">
      <div className="overflow-hidden rounded-xl border border-blue-200/70 bg-background shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_4px_16px_rgba(59,130,246,0.1)] dark:bg-card">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{t("title")}</h2>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          <Button onClick={onAddEvent} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            {t("addEvent")}
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onSetToday}>
              {t("today")}
            </Button>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onChangeDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-40 text-center text-sm font-medium text-foreground">
                {dateRangeLabel}
              </span>
              <Button variant="ghost" size="icon" onClick={() => onChangeDate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* View switcher */}
          <div className="flex overflow-hidden rounded-md border border-border bg-background text-sm">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => onSetView(v)}
                className={cn(
                  "px-3 py-1.5 font-medium capitalize transition-colors duration-150",
                  view === v
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar body */}
        <div className="border-t border-border bg-background">
          {isLoading ? (
            <div className="h-96 animate-pulse bg-muted/40" />
          ) : (
            <>
              {view === "year" && (
                <YearView
                  date={currentDate}
                  events={events}
                  onSelectDate={(d) => {
                    onSlotSelect(d);
                    onSetView("day");
                  }}
                />
              )}
              {view === "month" && (
                <MonthView
                  date={currentDate}
                  events={events}
                  onSlotSelect={(d) => {
                    onSlotSelect(d);
                    onSetView("day");
                  }}
                  onEventContextMenu={onEventContextMenu}
                />
              )}
              {view === "week" && (
                <WeekView
                  date={currentDate}
                  events={events}
                  onSlotSelect={onSlotSelect}
                  onEventContextMenu={onEventContextMenu}
                />
              )}
              {view === "day" && (
                <DayView
                  date={currentDate}
                  events={events}
                  onSlotSelect={onSlotSelect}
                  onEventContextMenu={onEventContextMenu}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <CalendarContextMenu
          event={contextMenu.event}
          position={contextMenu.position}
          onClose={onCloseContextMenu}
          onAction={onContextMenuAction}
        />
      )}

      {/* Event detail modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={onCloseDetail}
          onEdit={onEditFromDetail}
          onDelete={onDeleteFromDetail}
        />
      )}

      {/* Delete confirmation dialog */}
      {eventToDelete && (
        <DeleteEventDialog
          event={eventToDelete}
          isDeletingId={isDeletingId}
          onOpenChange={onDeleteDialogOpenChange}
          onConfirm={onConfirmDelete}
        />
      )}
    </div>
  );
}
