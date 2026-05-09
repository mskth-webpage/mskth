"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import AdminUpcomingEventsView from "@/view/admin/adminUpcomingEventsView";
import PublishConfirmDialog from "@/components/admin/event/PublishConfirmDialog";
import type { AdminEvent, CreateEventInput } from "@/types/adminEvent";
import { groupByMonth } from "@/lib/eventUtils";

const today = new Date().toISOString().slice(0, 10);
const SWR_KEY = `/api/admin/event?from=${today}`;
const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

/** Fetches all events, groups them by month, and wires create and publish actions to the view. */
export default function EventPresenter() {
  const { data: events = [], isLoading } = useSWR<AdminEvent[]>(SWR_KEY, fetcher, {
    revalidateOnFocus: false,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [pendingPublishId, setPendingPublishId] = useState<number | null>(null);
  const [pendingUnpublishId, setPendingUnpublishId] = useState<number | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const eventsByMonth = useMemo(() => groupByMonth(events), [events]);

  const handleSave = useCallback(async (input: CreateEventInput) => {
    await fetch(SWR_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    await mutate(SWR_KEY);
    setIsCreating(false);
  }, []);

  const handlePublishClick = useCallback((id: number) => {
    const event = events.find((e) => e.id === id);
    if (event?.status === "published") {
      setPendingUnpublishId(id);
    } else {
      setPendingPublishId(id);
    }
  }, [events]);

  const toggleStatus = useCallback(async (id: number, status: "published" | "draft") => {
    await fetch(SWR_KEY, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await mutate(SWR_KEY);
  }, []);

  const handleConfirmPublish = useCallback(async () => {
    if (!pendingPublishId) return;
    await toggleStatus(pendingPublishId, "published");
    setPendingPublishId(null);
  }, [pendingPublishId, toggleStatus]);

  const handleUpdate = useCallback(async (id: number, input: CreateEventInput) => {
    await fetch(SWR_KEY, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: input.title,
        description: input.description,
        start_at: input.start_at,
        end_at: input.end_at,
        image_url: input.image_url ?? null,
        location: input.location ?? null,
        max_participants: input.max_participants ?? null,
        audience: input.audience ?? null,
      }),
    });
    await mutate(SWR_KEY);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    setIsDeletingId(id);
    await fetch(`${SWR_KEY.split("?")[0]}?id=${id}`, { method: "DELETE" });
    await mutate(SWR_KEY);
    setIsDeletingId(null);
  }, []);

  return (
    <>
      <AdminUpcomingEventsView
        eventsByMonth={eventsByMonth}
        isCreating={isCreating}
        onAddNew={() => setIsCreating(true)}
        onSave={handleSave}
        onCancelCreate={() => setIsCreating(false)}
        onPublish={handlePublishClick}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isDeletingId={isDeletingId}
        isLoading={isLoading}
      />
      {pendingPublishId && (
        <PublishConfirmDialog
          variant="publish"
          onConfirm={handleConfirmPublish}
          onCancel={() => setPendingPublishId(null)}
        />
      )}
      {pendingUnpublishId && (
        <PublishConfirmDialog
          variant="unpublish"
          onConfirm={async () => { await toggleStatus(pendingUnpublishId, "draft"); setPendingUnpublishId(null); }}
          onCancel={() => setPendingUnpublishId(null)}
        />
      )}
    </>
  );
}
