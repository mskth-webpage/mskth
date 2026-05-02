export default function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 h-10 w-10 animate-pulse rounded-lg bg-muted" />
      <div className="h-9 w-16 animate-pulse rounded-md bg-muted" />
      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-muted" />
    </div>
  );
}
