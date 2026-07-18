"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import PublicEventCard from "@/components/PublicEventCard";
import TicketCardSkeleton from "@/components/admin/skeletons/TicketCardSkeleton";
import type { AdminEvent } from "@/types/adminEvent";

const CARD_STEP = 356;

type Props = {
  events: AdminEvent[];
  isLoading: boolean;
};

/** Public home-page upcoming events section with horizontal scroll and live data. */
export default function UpcomingEventsView({
  events,
  isLoading,
}: Props) {
  const t = useTranslations("HomePage.events");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;

    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 1
    );
  };

  useEffect(() => {
    updateScrollButtons();
  }, [events]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -CARD_STEP : CARD_STEP,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full bg-upcomingevent-section pt-20 pb-36 text-neutral-black">
      <h2 className="mb-14 text-center font-serif text-4xl font-semibold text-neutral-black">
        {t("title")}
      </h2>

      {/* Outer wrapper */}
      <div className="relative mx-auto max-w-6xl px-12">
        {isLoading ? (
          <div className="flex justify-center gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-black/70">
            {t("empty")}
          </p>
        ) : (
          <>
            {/* Left arrow */}
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll events left"
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            {/* Scrollable track */}
            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex snap-x snap-mandatory justify-center gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {events.map((event) => (
                <div key={event.id} className="shrink-0 snap-start">
                  <PublicEventCard event={event} />
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll events right"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="relative block h-[60px] w-full md:h-20 lg:h-[120px]"
        >
          <path
            d="M0,120 C480,0 960,0 1440,120 L1440,120 L0,120 Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}