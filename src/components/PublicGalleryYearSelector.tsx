"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { GalleryYearGroup } from "@/types/adminGallery";

type Props = {
  groups: GalleryYearGroup[];
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
};

export default function PublicGalleryYearSelector({
  groups,
  selectedYear,
  onSelectYear,
}: Props) {
  return (
    <div className="flex justify-center">
      <div
        className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border/80 bg-background/80 p-1.5 shadow-sm backdrop-blur-md"
        role="tablist"
        aria-label="Gallery years"
      >
        {groups.map((group) => {
          const selected =
            group.year === selectedYear;

          return (
            <button
              key={group.year}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() =>
                onSelectYear(group.year)
              }
              className={cn(
                "relative min-w-[82px] shrink-0 rounded-full px-6 py-3 text-center text-sm font-semibold transition-colors duration-300 sm:min-w-[96px] sm:px-8 sm:text-base",
                selected
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="public-gallery-active-year"
                  className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/20"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 34,
                  }}
                />
              )}

              <span className="relative z-10">
                {group.year}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}