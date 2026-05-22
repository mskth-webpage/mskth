import TicketCardSkeleton from "@/components/admin/skeletons/TicketCardSkeleton";

function CircleSkeleton() {
  return <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />;
}

/** Full-page skeleton matching the shape of AdminUpcomingEventsView. */
export default function UpcomingEventsSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Month circles row */}
      <div className="flex flex-wrap gap-4 border-b border-border p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CircleSkeleton key={i} />
        ))}
      </div>

      {/* Card row */}
      <div className="bg-muted/30 p-6">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
