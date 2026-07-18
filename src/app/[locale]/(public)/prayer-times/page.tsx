import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PrayerTimesPresenter from "@/presenter/PrayerTimesPresenter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrayerTimes.meta");
  return { title: `${t("title")} | MSKTH`, description: t("description") };
}

export default function PrayerTimesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  return <PrayerTimesPresenter searchParams={searchParams} />;
}
