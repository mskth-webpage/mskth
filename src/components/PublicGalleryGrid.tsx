"use client";

import { motion } from "framer-motion";

import PublicGalleryMedia from "@/components/PublicGalleryMedia";
import type { GalleryMediaItem } from "@/types/adminGallery";

type Props = {
  items: GalleryMediaItem[];
  selectedYear: number | null;
  onOpenItem: (index: number) => void;
};

const gridVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.16,
    },
  },
};

export default function PublicGalleryGrid({
  items,
  selectedYear,
  onOpenItem,
}: Props) {
  return (
    <motion.div
      key={selectedYear}
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-3 gap-[2px] sm:gap-1"
    >
      {items.map((item, index) => (
        <PublicGalleryMedia
          key={item.id}
          item={item}
          priority={index < 6}
          index={index}
          onOpen={() => onOpenItem(index)}
        />
      ))}
    </motion.div>
  );
}