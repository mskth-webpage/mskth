"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import PublicEventCard from "@/components/PublicEventCard";
import TicketCardSkeleton from "@/components/admin/skeletons/TicketCardSkeleton";
import type { AdminEvent } from "@/types/adminEvent";

/** Card width (340px) + gap (16px) — used to step exactly one card per arrow click. */
const CARD_STEP = 356;

type Props = {
  events: AdminEvent[];
  isLoading: boolean;
};

/**
 * Horizontal scrollable upcoming-events section for the public home page.
 * Shows skeleton placeholders while loading, an empty state when no published
 * events exist, and a snapping card track with left/right navigation arrows otherwise.
 */
export default function UpcomingEventsView({ events, isLoading }: Props) {
  const t = useTranslations("HomePage.events");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => { updateScrollButtons(); }, [events]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-(--blue-soft-2) pt-20 pb-36">
      <h2 className="mb-14 text-center font-serif text-4xl font-semibold text-foreground">
        {t("title")}
      </h2>

      {/* Outer wrapper — full width with side padding for arrows */}
      <div className="relative mx-auto max-w-6xl px-12">
        {isLoading ? (
          <div className="flex justify-center gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground/70">{t("empty")}</p>
        ) : (
          <>
            {/* Left arrow */}
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            {/* Scrollable track — justify-center centers when few cards, scrolls when many */}
            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex justify-center gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            >
              {events.map((event) => (
                <div key={event.id} className="snap-start shrink-0">
                  <PublicEventCard event={event} />
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
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
          className="relative block w-full h-[60px] md:h-20 lg:h-[120px]"
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
