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
      <div className="flex items-start gap-6 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] sm:justify-center sm:overflow-x-visible">
        <div className="shrink-0">
          <Ticket
            title={t("events.card1.title")}
            description={t("events.card1.description")}
          />
        </div>
        <div className="shrink-0">
          <Ticket
            title={t("events.card2.title")}
            description={t("events.card2.description")}
          />
        </div>
        <div className="shrink-0">
          <Ticket
            title={t("events.card3.title")}
            description={t("events.card3.description")}
          />
        </div>
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
