'use client';

import EventsView from '@/view/EventsView';
import useSWR from 'swr';
import type { AdminEvent } from '@/types/adminEvent';

const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  });

export default function EventsPresenter() {
  const { data: events = [], isLoading } = useSWR<AdminEvent[]>('/api/events', fetcher);
  const { data: previousEvents = [], isLoading: isLoadingPrevious } =
    useSWR<AdminEvent[]>('/api/events/previous', fetcher);

  return (
    <EventsView
      events={events}
      isLoading={isLoading}
      previousEvents={previousEvents}
      isLoadingPrevious={isLoadingPrevious}
    />
  );
}
