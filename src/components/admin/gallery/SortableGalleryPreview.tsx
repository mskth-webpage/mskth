"use client";

import Image from "next/image";
import { GripVertical, Images, Video, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";

type PreviewItem = {
  id: string;
  file: File;
  url: string;
};

type Props = {
  preview: PreviewItem;
  onRemove: (id: string) => void;
};

export default function SortableGalleryPreview({
  preview,
  onRemove,
}: Props) {
  const t = useTranslations("AdminGallery");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: preview.id,
  });

  const isVideo = preview.file.type.startsWith("video/");

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`relative overflow-hidden rounded-xl border border-border bg-muted ${
        isDragging ? "z-20 opacity-70 shadow-xl" : ""
      }`}
    >
      <div className="relative aspect-square">
        {isVideo ? (
          <video
            src={preview.url}
            muted
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={preview.url}
            alt={preview.file.name}
            fill
            sizes="200px"
            className="object-cover"
            unoptimized
          />
        )}

        <button
          type="button"
          aria-label={t("removeSelectedMedia")}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(preview.id);
          }}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-transform hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label={t("dragToReorder")}
          onPointerDown={(event) => event.stopPropagation()}
          className="absolute bottom-2 left-2 z-10 flex h-8 w-8 cursor-grab touch-none items-center justify-center rounded-lg bg-background/90 text-foreground shadow-md active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase text-foreground">
          {isVideo ? (
            <Video className="h-3 w-3" />
          ) : (
            <Images className="h-3 w-3" />
          )}

          {isVideo ? t("video") : t("image")}
        </div>
      </div>
    </div>
  );
}