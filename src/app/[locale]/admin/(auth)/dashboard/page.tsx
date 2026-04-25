import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import { routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "AdminDashboard" });

  async function logout() {
    "use server";

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    await supabase.auth.signOut();
    redirect(`/${locale}/admin/login`);
  }

  return (
    <section className="flex min-h-full w-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl border-border/80 py-0 shadow-lg">
        <CardHeader className="px-6 pt-6">
          <CardAction>
            <form action={logout}>
              <Button type="submit" variant="outline" className="rounded-full">
                {t("logout")}
              </Button>
            </form>
          </CardAction>
          <CardTitle className="font-serif text-3xl tracking-tight sm:text-4xl">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-base leading-7">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            {t("hint")}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}