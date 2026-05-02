export default function EventPreviewCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3.5">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="mx-6 h-4 w-10 animate-pulse rounded bg-muted" />
      <div className="space-y-1 text-right">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="h-4 w-6 animate-pulse rounded bg-muted ml-auto" />
      </div>
    </div>
  );
}
