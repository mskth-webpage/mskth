"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import PublicEventCard from "@/components/PublicEventCard";
import CurrentMonthBadge from "@/components/CurrentMonthBadge";
import TicketCardSkeleton from "@/components/admin/skeletons/TicketCardSkeleton";
import type { AdminEvent } from "@/types/adminEvent";

const CARD_WIDTH = 340;
const CARD_GAP = 24;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const DESKTOP_TRACK_WIDTH = CARD_WIDTH * 3 + CARD_GAP * 2;

type Props = {
  events: AdminEvent[];
  isLoading: boolean;
};

function getMillisecondsUntilNextMonth(date: Date) {
  const nextMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1, 0, 0, 0, 0,
  );

  return nextMonth.getTime() - date.getTime();
}

/**
 * Public home-page upcoming events section.
 * Displays only events from the current month and updates automatically
 * when the calendar changes to the next month.
 */
export default function UpcomingEventsView({
  events,
  isLoading,
}: Props) {
  const t = useTranslations("HomePage.events");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const currentMonthEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.start_at);

        return (
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .sort(
        (firstEvent, secondEvent) =>
          new Date(firstEvent.start_at).getTime() -
          new Date(secondEvent.start_at).getTime(),
      );
  }, [events, currentDate]);

  const updateScrollButtons = () => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maximumScroll =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;

    setCanScrollLeft(scrollContainer.scrollLeft > 1);
    setCanScrollRight(scrollContainer.scrollLeft < maximumScroll - 1);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleMonthUpdate = () => {
      const now = new Date();

      timeoutId = setTimeout(() => {
        setCurrentDate(new Date());
        scheduleMonthUpdate();
      }, getMillisecondsUntilNextMonth(now) + 1000);
    };

    scheduleMonthUpdate();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    scrollContainer?.scrollTo({
      left: 0,
      behavior: "auto",
    });

    const animationFrameId = requestAnimationFrame(updateScrollButtons);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentMonthEvents]);

  useEffect(() => {
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -CARD_STEP : CARD_STEP,
      behavior: "smooth",
    });
  };

  const shouldCenterDesktopCards = currentMonthEvents.length <= 3;

  return (
    <section className="relative w-full bg-upcomingevent-section pb-36 pt-20 text-neutral-black">
      <div className="mx-auto w-full max-w-[1220px] px-6 sm:px-8">
        <div className="mb-14 flex flex-col items-center gap-4 text-center">
          <h2 className="font-serif text-4xl font-semibold text-neutral-black">
            {t("title")}
          </h2>

          <CurrentMonthBadge date={currentDate} />
        </div>

        <div
          className="relative mx-auto w-full lg:w-[1068px]"
          style={{ maxWidth: DESKTOP_TRACK_WIDTH }}
        >
          {isLoading ? (
            <div className="overflow-hidden">
              <div className="flex gap-6 lg:justify-center">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="shrink-0">
                    <TicketCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          ) : currentMonthEvents.length === 0 ? (
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
                className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:pointer-events-none disabled:opacity-0 sm:left-1 lg:-left-14 lg:translate-x-0"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>

              {/* Visible viewport */}
              <div className="w-full overflow-hidden">
                {/* Scrollable event track */}
                <div
                  ref={scrollRef}
                  onScroll={updateScrollButtons}
                  className={`flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    shouldCenterDesktopCards ? "lg:justify-center" : ""
                  }`}
                >
                  {currentMonthEvents.map((event) => (
                    <div
                      key={event.id}
                      className="w-[340px] shrink-0 snap-start"
                    >
                      <PublicEventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right arrow */}
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll events right"
                className="absolute right-0 top-1/2 z-20 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:pointer-events-none disabled:opacity-0 sm:right-1 lg:-right-14 lg:translate-x-0"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </>
          )}
        </div>
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