import HeroSectionView from "@/view/HeroSectionView";
import NewsletterSubscriptionView from "@/view/NewsletterSubscriptionView";
import UpcomingEventsView from "@/view/UpcomingEventsView";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default function HomePagePresenter() {
  async function addSubscription(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    if (!name || !email) {
      return { status: "error" as const };
    }

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { error } = await supabase
      .from("subscriptions")
      .insert({ name, email });

    if (error) {
      // Postgres unique_violation error code
      if (error.code === "23505") {
        return { status: "success" as const }; // Return success to avoid data leakage
      }
      return { status: "error" as const };
    }

    return { status: "success" as const };
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
