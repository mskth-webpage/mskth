"use client";

import { useTranslations } from "next-intl";
import EventList from "@/components/admin/EventList";
import type { EventPreview } from "@/app/api/admin/events/route";

type Props = {
  upcoming: EventPreview[];
  previous: EventPreview[];
  isLoading: boolean;
};

export default function DashboardEventsView({ upcoming, previous, isLoading }: Props) {
  const t = useTranslations("AdminDashboard");

  return (
    <div className="flex h-[540px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin">
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              {t("upcomingEvents")}
            </h2>
            <EventList events={upcoming} isLoading={isLoading} emptyKey="noUpcomingEvents" />
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              {t("previousEvents")}
            </h2>
            <EventList events={previous} isLoading={isLoading} emptyKey="noPreviousEvents" />
          </div>
        </div>
      </div>
    </div>
  );
}
