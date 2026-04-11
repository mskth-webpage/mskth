import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import EventsPresenter from "@/presenter/EventsPresenter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Events.meta");
  return {
    title: `${t("title")} | MSKTH`,
    description: t("description"),
  };
}

export default function EventsPage() {
  return <EventsPresenter />;
}
