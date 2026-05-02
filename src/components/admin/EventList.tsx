import { useTranslations } from "next-intl";
import EventPreviewCard from "@/components/admin/EventPreviewCard";
import type { EventPreview } from "@/types/adminDashboard";

type Props = {
  events: EventPreview[];
  isLoading: boolean;
  emptyKey: "noUpcomingEvents" | "noPreviousEvents";
};

export default function EventList({ events, isLoading, emptyKey }: Props) {
  const t = useTranslations("AdminDashboard");

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[62px] animate-pulse rounded-xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        {t(emptyKey)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventPreviewCard
          key={event.id}
          title={event.title}
          startAt={event.start_at}
          location={event.location}
          joinedCount={event.joined_count}
        />
      ))}
    </div>
  );
}
