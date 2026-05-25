import TicketCardSkeleton from "@/components/admin/skeletons/TicketCardSkeleton";

function CircleSkeleton() {
  return <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />;
}

/** Full-page skeleton matching the shape of AdminPreviousEventsView. */
export default function PreviousEventsSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Year circles row */}
      <div className="flex flex-wrap gap-4 border-b border-border p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CircleSkeleton key={i} />
        ))}
      </div>

      {/* Month circles row */}
      <div className="flex flex-wrap gap-4 border-b border-border bg-muted/10 px-6 py-4">
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
