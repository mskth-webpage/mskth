/** Skeleton placeholder matching the shape of TicketCard / ContentCard with a date header. */
export default function TicketCardSkeleton() {
  return (
    <div className="flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl bg-card shadow-md">
      {/* Date header band */}
      <div className="flex items-center justify-between bg-primary/10 px-4 py-3">
        <div className="space-y-1">
          <div className="h-2.5 w-8 animate-pulse rounded bg-primary/20" />
          <div className="h-6 w-6 animate-pulse rounded bg-primary/20" />
          <div className="h-2.5 w-8 animate-pulse rounded bg-primary/20" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-5 w-20 animate-pulse rounded-full bg-primary/20" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-primary/20" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-56 animate-pulse rounded bg-muted" />
        <div className="h-3 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-auto space-y-1.5 pt-2">
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Footer */}
      <div className="mx-4 border-t border-dashed border-border" />
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
