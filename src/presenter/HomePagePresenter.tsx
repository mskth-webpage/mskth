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
      return;
    }

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    await supabase.from("subscriptions").insert({ name, email });
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
