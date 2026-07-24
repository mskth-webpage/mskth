"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Images,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import GalleryLightbox from "@/components/GalleryLightbox";
import PublicGalleryGrid from "@/components/PublicGalleryGrid";
import PublicGalleryYearSelector from "@/components/PublicGalleryYearSelector";
import type {
  GalleryMediaItem,
  GalleryYearGroup,
} from "@/types/adminGallery";

type Props = {
  groups: GalleryYearGroup[];
  selectedYear: number | null;
  selectedItems: GalleryMediaItem[];
  activeIndex: number | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSelectYear: (year: number) => void;
  onOpenItem: (index: number) => void;
  onCloseLightbox: () => void;
  onChangeLightboxIndex: (
    index: number,
  ) => void;
};

export default function GalleryView({
  groups,
  selectedYear,
  selectedItems,
  activeIndex,
  isLoading,
  errorMessage,
  onSelectYear,
  onOpenItem,
  onCloseLightbox,
  onChangeLightboxIndex,
}: Props) {
  const t = useTranslations("Gallery");

  return (
    <>
      <section className="mx-auto max-w-[1180px] px-5 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12">
        <div className="mb-9 text-center sm:mb-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <h2 className="font-serif text-xl font-medium uppercase sm:text-3xl lg:text-4xl">
              {t("title")}
            </h2>
            
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("description")}
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
            <p className="text-sm text-destructive">
              {errorMessage}
            </p>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 text-center">
            <Images className="mb-4 h-10 w-10 text-muted-foreground/50" />

            <h3 className="text-lg font-semibold text-foreground">
              {t("emptyTitle")}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("emptyDescription")}
            </p>
          </div>
        ) : (
          <div>
            <PublicGalleryYearSelector
              groups={groups}
              selectedYear={selectedYear}
              onSelectYear={onSelectYear}
            />

            <div className="mt-7 overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedItems.length > 0 ? (
                  <PublicGalleryGrid
                    key={selectedYear}
                    items={selectedItems}
                    selectedYear={selectedYear}
                    onOpenItem={onOpenItem}
                  />
                ) : (
                  <motion.div
                    key={`empty-${selectedYear}`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="flex min-h-[260px] items-center justify-center px-6 text-center"
                  >
                    <p className="text-sm text-muted-foreground">
                      {t("emptyYear")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </section>

      <GalleryLightbox
        items={selectedItems}
        activeIndex={activeIndex}
        onClose={onCloseLightbox}
        onChangeIndex={
          onChangeLightboxIndex
        }
      />
    </>
  );
}