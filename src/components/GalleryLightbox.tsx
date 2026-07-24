"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  X,
} from "lucide-react";

import type { GalleryMediaItem } from "@/types/adminGallery";

type Props = {
  items: GalleryMediaItem[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
};

export default function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onChangeIndex,
}: Props) {
  const thumbnailContainerRef =
    useRef<HTMLDivElement>(null);

  const isOpen =
    activeIndex !== null &&
    activeIndex >= 0 &&
    activeIndex < items.length;

  const activeItem =
    isOpen && activeIndex !== null
      ? items[activeIndex]
      : null;

  const showPrevious = useCallback(() => {
    if (
      activeIndex === null ||
      items.length === 0
    ) {
      return;
    }

    onChangeIndex(
      activeIndex === 0
        ? items.length - 1
        : activeIndex - 1,
    );
  }, [
    activeIndex,
    items.length,
    onChangeIndex,
  ]);

  const showNext = useCallback(() => {
    if (
      activeIndex === null ||
      items.length === 0
    ) {
      return;
    }

    onChangeIndex(
      activeIndex === items.length - 1
        ? 0
        : activeIndex + 1,
    );
  }, [
    activeIndex,
    items.length,
    onChangeIndex,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    onClose,
    showNext,
    showPrevious,
  ]);

  useEffect(() => {
    if (
      activeIndex === null ||
      !thumbnailContainerRef.current
    ) {
      return;
    }

    const activeThumbnail =
      thumbnailContainerRef.current.children[
        activeIndex
      ] as HTMLElement | undefined;

    activeThumbnail?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {isOpen &&
        activeItem &&
        activeIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Gallery viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.22,
            }}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md"
            onClick={onClose}
          >
            <div className="relative flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
              <p className="text-sm font-medium text-white/65">
                {activeIndex + 1}
                <span className="mx-2 text-white/25">
                  /
                </span>
                {items.length}
              </p>

              <button
                type="button"
                aria-label="Close gallery"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous media"
                    onClick={(event) => {
                      event.stopPropagation();
                      showPrevious();
                    }}
                    className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/15 sm:left-6 sm:h-12 sm:w-12"
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </button>

                  <button
                    type="button"
                    aria-label="Next media"
                    onClick={(event) => {
                      event.stopPropagation();
                      showNext();
                    }}
                    className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/15 sm:right-6 sm:h-12 sm:w-12"
                  >
                    <ChevronRight className="h-7 w-7" />
                  </button>
                </>
              )}

              <div
                className="flex h-full items-center justify-center px-4 sm:px-20"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  <motion.div
                    key={activeItem.id}
                    initial={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.22,
                    }}
                    className="relative flex h-full max-h-[calc(100dvh-12rem)] w-full max-w-6xl items-center justify-center"
                  >
                    {activeItem.media_type ===
                    "image" ? (
                      <Image
                        src={
                          activeItem.media_url
                        }
                        alt={
                          activeItem.alt_text ??
                          "Gallery image"
                        }
                        fill
                        priority
                        sizes="100vw"
                        className="object-contain"
                      />
                    ) : (
                      <video
                        key={activeItem.id}
                        src={
                          activeItem.media_url
                        }
                        poster={
                          activeItem.thumbnail_url ??
                          undefined
                        }
                        controls
                        autoPlay
                        playsInline
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {items.length > 1 && (
              <div className="shrink-0 border-t border-white/10 bg-black/50 px-3 py-3 backdrop-blur-lg sm:px-6">
                <div
                  ref={thumbnailContainerRef}
                  className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1"
                >
                  {items.map((item, index) => {
                    const selected =
                      index === activeIndex;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onChangeIndex(index);
                        }}
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md transition-all duration-200 sm:h-16 sm:w-16 mt-3 ${
                          selected
                            ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                            : "opacity-45 hover:opacity-85"
                        }`}
                      >
                        {item.media_type ===
                        "image" ? (
                          <Image
                            src={item.media_url}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : item.thumbnail_url ? (
                          <Image
                            src={
                              item.thumbnail_url
                            }
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <video
                            src={item.media_url}
                            muted
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        )}

                        {item.media_type ===
                          "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                            <Play className="h-4 w-4 fill-current" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
    </AnimatePresence>
  );
}