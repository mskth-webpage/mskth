"use client";

import EventsHeader from "@/components/EventsHeader";
import { useTranslations } from "next-intl";

export default function EventsView() {
  const t = useTranslations("Events");

  return (
    <main className="mx-auto max-w-[980px] px-5 pb-20 pt-10 sm:px-8 lg:pb-28 lg:pt-16">
          <EventsHeader
        title={t("title")}
        description={t("description")}
      />
    </main>
  );
}

