export default function CalendarSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col lg:flex-row">
        {/* Today spotlight */}
        <div className="flex flex-col justify-between bg-muted p-8 lg:w-56 lg:shrink-0">
          <div className="space-y-2">
            <div className="h-3 w-10 animate-pulse rounded bg-muted-foreground/20" />
            <div className="h-20 w-16 animate-pulse rounded-md bg-muted-foreground/20" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-20 animate-pulse rounded bg-muted-foreground/20" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted-foreground/20" />
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="flex gap-1">
              <div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
              <div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
          <div className="mb-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-8 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
