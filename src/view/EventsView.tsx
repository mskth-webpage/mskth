"use client";

import EventsHeader from "@/components/EventsHeader";
import PreviousEvent from "@/components/PreviousEvent";
import UpcomingEventsView from "@/view/UpcomingEventsView";
import { useTranslations } from "next-intl";
import type { AdminEvent } from "@/types/adminEvent";

type Props = {
  events: AdminEvent[];
  isLoading: boolean;
  previousEvents: AdminEvent[];
  isLoadingPrevious: boolean;
};

export default function EventsView({
  events,
  isLoading,
  previousEvents,
  isLoadingPrevious,
}: Props) {
  const t = useTranslations("Events");

  return (
    <main className="overflow-hidden">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <EventsHeader
          title={t("title")}
          description={t("description")}
        />
      </div>
      <UpcomingEventsView events={events} isLoading={isLoading} />
      <PreviousEvent events={previousEvents} isLoading={isLoadingPrevious} />
    </main>
  );
}
