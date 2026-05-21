import type { AdminEvent } from "@/types/adminEvent";

/** Groups a flat list of events into ordered month buckets keyed by "Month YYYY". */
export function groupByMonth(events: AdminEvent[]): { month: string; events: AdminEvent[] }[] {
  const map = new Map<string, AdminEvent[]>();
  for (const event of events) {
    const month = new Date(event.start_at).toLocaleDateString("en", {
      month: "long",
      year: "numeric",
    });
    if (!map.has(month)) map.set(month, []);
    map.get(month)!.push(event);
  }
  return Array.from(map.entries()).map(([month, events]) => ({ month, events }));
}
