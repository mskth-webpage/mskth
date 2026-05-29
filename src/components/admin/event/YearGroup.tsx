"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  year: number;
  eventCount: number;
  selected: boolean;
  onClick: () => void;
};

/** Clickable year circle used to filter previous events by year. */
export default function YearGroup({ year, eventCount, selected, onClick }: Props) {
  const t = useTranslations("AdminPreviousEvents");

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
      <span className="text-lg font-bold leading-none">{year}</span>
      <span className="mt-1 text-[10px] opacity-60">{t("eventCount", { count: eventCount })}</span>
    </button>
  );
}
