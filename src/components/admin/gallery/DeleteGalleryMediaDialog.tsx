"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { GalleryMediaItem } from "@/types/adminGallery";

type Props = {
  item: GalleryMediaItem;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteGalleryMediaDialog({
  item,
  isDeleting,
  onCancel,
  onConfirm,
}: Props) {
  const t = useTranslations(
    "AdminGallery",
  );

  const mediaLabel =
    item.alt_text ??
    (item.media_type === "video"
      ? t("videoLabel")
      : t("imageLabel"));

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-muted-foreground/50 p-4 backdrop-blur-sm"
      onClick={
        isDeleting ? undefined : onCancel
      }
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-gallery-title"
        aria-describedby="delete-gallery-description"
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <h2
          id="delete-gallery-title"
          className="text-lg font-semibold text-foreground"
        >
          {t("deleteTitle")}
        </h2>

        <p
          id="delete-gallery-description"
          className="mt-2 text-sm leading-relaxed text-muted-foreground"
        >
          {t("deleteDescription")}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            {t("deleteCancel")}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? t("saving")
              : t("deleteConfirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}