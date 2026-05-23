"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import AdminUpcomingEventsView from "@/view/admin/adminUpcomingEventsView";
import AdminPreviousEventsView from "@/view/admin/adminPreviousEventsView";
import PublishConfirmDialog from "@/components/admin/event/PublishConfirmDialog";
import type { AdminEvent, CreateEventInput } from "@/types/adminEvent";
import { groupByMonth, groupByYear } from "@/lib/eventUtils";

const today = new Date().toISOString().slice(0, 10);
const SWR_KEY = `/api/admin/event?from=${today}`;
const PREVIOUS_SWR_KEY = "/api/admin/event/previous";
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

  const { data: previousEvents = [], isLoading: isPreviousLoading } = useSWR<AdminEvent[]>(
    PREVIOUS_SWR_KEY,
    fetcher,
    { revalidateOnFocus: false },
  );

  const eventsByYear = useMemo(() => groupByYear(previousEvents), [previousEvents]);

  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingPrevious, setIsCreatingPrevious] = useState(false);
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
    await Promise.all([mutate(SWR_KEY), mutate(PREVIOUS_SWR_KEY)]);
    setIsCreating(false);
  }, []);

  const handleSavePrevious = useCallback(async (input: CreateEventInput) => {
    await fetch(SWR_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    await Promise.all([mutate(SWR_KEY), mutate(PREVIOUS_SWR_KEY)]);
    setIsCreatingPrevious(false);
  }, []);

  const handlePublishClick = useCallback((id: number) => {
    const event = [...events, ...previousEvents].find((e) => e.id === id);
    if (event?.status === "published") {
      setPendingUnpublishId(id);
    } else {
      setPendingPublishId(id);
    }
  }, [events, previousEvents]);

  const toggleStatus = useCallback(async (id: number, status: "published" | "draft") => {
    await fetch(SWR_KEY, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await Promise.all([mutate(SWR_KEY), mutate(PREVIOUS_SWR_KEY)]);
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
        registration_closes_at: input.registration_closes_at ?? null,
        image_url: input.image_url ?? null,
        location: input.location ?? null,
        max_participants: input.max_participants ?? null,
        audience: input.audience ?? null,
        language: input.language ?? null,
      }),
    });
    await Promise.all([mutate(SWR_KEY), mutate(PREVIOUS_SWR_KEY)]);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    setIsDeletingId(id);
    await fetch(`${SWR_KEY.split("?")[0]}?id=${id}`, { method: "DELETE" });
    await Promise.all([mutate(SWR_KEY), mutate(PREVIOUS_SWR_KEY)]);
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
      <AdminPreviousEventsView
        eventsByYear={eventsByYear}
        isLoading={isPreviousLoading}
        isCreating={isCreatingPrevious}
        onAddNew={() => setIsCreatingPrevious(true)}
        onSave={handleSavePrevious}
        onCancelCreate={() => setIsCreatingPrevious(false)}
        onPublish={handlePublishClick}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isDeletingId={isDeletingId}
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
