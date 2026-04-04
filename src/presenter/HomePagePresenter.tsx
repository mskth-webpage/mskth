"use client";

import HeroSectionView from "@/view/HeroSectionView";
import NewsletterSubscriptionView from "@/view/NewsletterSubscriptionView";
import UpcomingEventsView from "@/view/UpcomingEventsView";

export default function HomePagePresenter() {
  async function addSubscription(
    formData: FormData,
  ): Promise<{ status: "success" | "error" }> {
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    if (!name || !email) {
      return { status: "error" as const };
    }

    const response = await fetch("/api/subscriptions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      return { status: "error" as const };
    }

    const result = (await response.json()) as { status?: "success" | "error" };

    return {
      status: result.status === "success" ? "success" : "error",
    };
  }

  return (
    <>
      <div>
        <HeroSectionView />
      </div>
      <UpcomingEventsView />
      <NewsletterSubscriptionView addSubscription={addSubscription} />
    </>
  );
}
