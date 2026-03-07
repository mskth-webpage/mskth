import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: subscriptions } = await supabase.from("subscriptions").select();

  console.log(subscriptions);
  return (
    <ul>
      {subscriptions?.map((subscription) => (
        <li key={subscription.id}>{subscription.username}</li>
      ))}
    </ul>
  );
}
