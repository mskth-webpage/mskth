"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  month: string;
  eventCount: number;
  selected: boolean;
  onClick: () => void;
};

/** Clickable month circle used to select which month's events to display. */
export default function MonthGroup({ month, eventCount, selected, onClick }: Props) {
  const t = useTranslations("AdminUpcomingEvents");
  const [monthName, year] = month.split(" ");

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 shadow-md transition-all duration-200",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-primary/30"
          : "border-primary/30 bg-card text-primary hover:border-primary hover:shadow-primary/20",
      )}
    >
      <span className="text-sm font-bold leading-none">{monthName}</span>
      <span className="mt-0.5 text-xs font-medium opacity-70">{year}</span>
      <span className="mt-1 text-[10px] opacity-60">{t("eventCount", { count: eventCount })}</span>
    </button>
  );
}
