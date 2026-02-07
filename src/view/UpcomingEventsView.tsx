"use client";

import { useTranslations } from "next-intl";
import Ticket from "@/components/Ticket";


export default function UpcomingEventsView() {
  const t = useTranslations("HomePage");

  return (
    <section className="relative w-full bg-(--blue-soft-2) pt-16 pb-32">
      <h2 className="text-center text-4xl font-serif font-semibold text-foreground mb-12">
        {t("events.title")}
      </h2>
      <div className="flex items-center justify-center gap-6 px-4">
        <Ticket title="TITLE 1" description="Short description for ticket 1." />
        <Ticket title="TITLE 2" description="Short description for ticket 2." />
        <Ticket title="TITLE 3" description="Short description for ticket 3." />
      </div>

      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] md:h-20 lg:h-[120px]"
        >
          <path
            d="M0,120 C480,0 960,0 1440,120 L1440,120 L0,120 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
