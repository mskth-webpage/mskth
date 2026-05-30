"use client";

import { useTranslations } from "next-intl";
import EventList from "@/components/admin/EventList";
import type { EventPreview } from "@/types/adminDashboard";

type Props = {
  upcoming: EventPreview[];
  previous: EventPreview[];
  isLoading: boolean;
};

export default function DashboardEventsView({ upcoming, previous, isLoading }: Props) {
  const t = useTranslations("AdminDashboard");

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-blue-200/70 bg-card shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_4px_16px_rgba(59,130,246,0.1)]">
      <div className="px-5 py-5">
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
