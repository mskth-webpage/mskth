"use client";

import dynamic from "next/dynamic";

import CalendarSkeleton from "@/components/admin/skeletons/CalendarSkeleton";
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
