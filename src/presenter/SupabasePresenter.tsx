import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import SupabaseView from "@/view/SupabaseView";

export default async function SupabasePresenter() {
  async function addSubscription(formData: FormData) {
    "use server";

    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    if (!username || !email) return;

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { error } = await supabase
      .from("subscriptions")
      .insert({ username, email });

    if (error) {
      console.error("Failed to add subscription:", error.message);
      return;
    }

    revalidatePath("/(.*)/supabase", "page");
  }

  async function deleteSubscription(id: number) {
    "use server";

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete subscription:", error.message);
      return;
    }

    revalidatePath("/(.*)/supabase", "page");
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: subscriptions } = await supabase.from("subscriptions").select();

  return (
    <SupabaseView
      subscriptions={subscriptions}
      onAddSubscription={addSubscription}
      onDeleteSubscription={deleteSubscription}
    />
  );
}
