import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import DashboardWelcomeView from "@/view/admin/dashboardWelcomeView";

export default async function DashboardPresenter({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });

  async function logout() {
    "use server";

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    await supabase.auth.signOut();
    redirect(`/${locale}/admin/login`);
  }

  return (
    <DashboardWelcomeView
      title={t("title")}
      description={t("description")}
      hint={t("hint")}
      logoutLabel={t("logout")}
      logout={logout}
    />
  );
}
