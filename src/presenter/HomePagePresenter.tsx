"use client";

import CommunitySectionView from '@/view/CommunitySectionView';
import HeroSectionView from "@/view/HeroSectionView";
import NewsletterSubscriptionView from "@/view/NewsletterSubscriptionView";
import UpcomingEventsView from "@/view/UpcomingEventsView";
import useSWR from "swr";
import type { AdminEvent } from "@/types/adminEvent";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("fetch failed");
    return r.json();
  });

export default function HomePagePresenter() {
  const { data: events = [], isLoading } = useSWR<AdminEvent[]>("/api/events", fetcher);

  async function addSubscription(
    formData: FormData,
  ): Promise<{ status: "success" | "error" }> {
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    if (!name || !email) return { status: "error" };

    const response = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) return { status: "error" };

    const result = (await response.json()) as { status?: "success" | "error" };
    return { status: result.status === "success" ? "success" : "error" };
  }

  return (
    <>
      <HeroSectionView />
      <CommunitySectionView />
      <UpcomingEventsView events={events} isLoading={isLoading} />
      <NewsletterSubscriptionView addSubscription={addSubscription} />
    </>
  );
}
