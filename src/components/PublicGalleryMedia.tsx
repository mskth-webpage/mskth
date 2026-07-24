"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Maximize2,
  Play,
} from "lucide-react";

import type { GalleryMediaItem } from "@/types/adminGallery";

type Props = {
  item: GalleryMediaItem;
  index: number;
  priority?: boolean;
  onOpen: () => void;
};

const mediaVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function PublicGalleryMedia({
  item,
  priority = false,
  onOpen,
}: Props) {
  const accessibleLabel =
    item.alt_text ??
    (item.media_type === "video"
      ? "Open gallery video"
      : "Open gallery image");

  return (
    <motion.button
      type="button"
      variants={mediaVariants}
      onClick={onOpen}
      aria-label={accessibleLabel}
      className="group relative aspect-square w-full overflow-hidden bg-muted focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
    >
      {item.media_type === "image" ? (
        <Image
          src={item.media_url}
          alt={item.alt_text ?? "Gallery image"}
          fill
          priority={priority}
          sizes="
            (max-width: 640px) 33vw,
            (max-width: 1024px) 33vw,
            380px
          "
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : item.thumbnail_url ? (
        <Image
          src={item.thumbnail_url}
          alt={item.alt_text ?? "Gallery video"}
          fill
          priority={priority}
          sizes="
            (max-width: 640px) 33vw,
            (max-width: 1024px) 33vw,
            380px
          "
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <video
          src={item.media_url}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      )}

      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
        <div className="flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-black/45 text-white shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-100 sm:h-12 sm:w-12">
          {item.media_type === "video" ? (
            <Play className="ml-0.5 h-5 w-5 fill-current sm:h-6 sm:w-6" />
          ) : (
            <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </div>
      </div>

      {item.media_type === "video" && (
        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white shadow-sm backdrop-blur-sm sm:right-3 sm:top-3 sm:h-8 sm:w-8">
          <Play className="ml-0.5 h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
        </div>
      )}
    </motion.button>
  );
}