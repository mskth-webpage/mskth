"use client";

import Image from "next/image";
import {
  GripVertical,
  Play,
  Trash2,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import type { GalleryMediaItem } from "@/types/adminGallery";

type Props = {
  item: GalleryMediaItem;
  isDeleting: boolean;
  onDelete: (
    item: GalleryMediaItem,
  ) => void;
};

export default function GalleryMediaCard({
  item,
  isDeleting,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const accessibleLabel =
    item.alt_text ??
    (item.media_type === "video"
      ? "Gallery video"
      : "Gallery image");

  return (
    <div
      ref={setNodeRef}
      style={{
        transform:
          CSS.Transform.toString(
            transform,
          ),
        transition,
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        isDragging &&
          "z-20 opacity-70 shadow-xl",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {item.media_type ===
        "image" ? (
          <Image
            src={item.media_url}
            alt={accessibleLabel}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <>
            {item.thumbnail_url ? (
              <Image
                src={
                  item.thumbnail_url
                }
                alt={accessibleLabel}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <video
                src={item.media_url}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-md">
                <Play className="ml-0.5 h-5 w-5 text-foreground" />
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          disabled={isDeleting}
          aria-label="Delete gallery media"
          onPointerDown={(event) =>
            event.stopPropagation()
          }
          onClick={(event) => {
            event.stopPropagation();
            onDelete(item);
          }}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-destructive shadow-md backdrop-blur-sm transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Drag to reorder"
          className="absolute bottom-2 left-2 z-10 flex h-9 w-9 cursor-grab touch-none items-center justify-center rounded-lg bg-background/90 text-foreground shadow-md backdrop-blur-sm active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground shadow-sm">
          {item.media_type}
        </span>
      </div>
    </div>
  );
}