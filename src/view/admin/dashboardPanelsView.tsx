"use client";

import dynamic from "next/dynamic";

import type { EventPreview } from "@/types/adminDashboard";

const DashboardCalendarView = dynamic(
  () => import("@/view/admin/dashboardCalendarView"),
  { loading: () => <CalendarSkeleton /> },
);

const DashboardEventsView = dynamic(
  () => import("@/view/admin/dashboardEventsView"),
  { loading: () => <PanelSkeleton /> },
);

type Props = {
  upcoming: EventPreview[];
  previous: EventPreview[];
  isLoading: boolean;
};

function PanelSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-xl border border-border bg-muted" />
  );
}

function CalendarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-7 w-44 rounded-md bg-muted" />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col justify-between bg-muted p-8 lg:w-56 lg:shrink-0">
            <div>
              <div className="h-3 w-16 rounded bg-muted-foreground/20" />
              <div className="mt-4 h-20 w-24 rounded bg-muted-foreground/20" />
            </div>
            <div className="mt-10 space-y-2">
              <div className="h-5 w-28 rounded bg-muted-foreground/20" />
              <div className="h-4 w-36 rounded bg-muted-foreground/20" />
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 rounded bg-muted" />
                <div className="h-5 w-12 rounded bg-muted" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-7 w-7 rounded-md bg-muted" />
                <div className="h-7 w-7 rounded-md bg-muted" />
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="h-4 rounded bg-muted" />
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
              {Array.from({ length: 35 }).map((_, index) => (
                <div key={index} className="flex items-center justify-center py-1">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPanelsView({
  upcoming,
  previous,
  isLoading,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {isLoading ? <CalendarSkeleton /> : <DashboardCalendarView />}
      <DashboardEventsView
        upcoming={upcoming}
        previous={previous}
        isLoading={isLoading}
      />
    </div>
  );
}
