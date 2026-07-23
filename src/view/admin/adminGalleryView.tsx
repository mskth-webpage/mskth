"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import GalleryGrid from "@/components/admin/gallery/GalleryGrid";
import GalleryYearGroup from "@/components/admin/gallery/GalleryYearGroup";
import CreateGalleryModal from "@/components/admin/gallery/CreateGalleryModal";
import DeleteGalleryMediaDialog from "@/components/admin/gallery/DeleteGalleryMediaDialog";
import type {
  GalleryMediaItem,
  GalleryYearGroup as GalleryYearGroupType,
} from "@/types/adminGallery";

type Props = {
  mediaByYear: GalleryYearGroupType[];
  selectedYear: number | null;
  isLoading: boolean;
  errorMessage: string | null;
  isCreating: boolean;
  isUploading: boolean;
  isSavingOrder: boolean;
  isDeletingId: number | null;
  isChangingPublishStatus: boolean;

  onSelectYear: (year: number) => void;
  onAddNew: () => void;
  onCancelCreate: () => void;

  onUpload: (
    files: File[],
    year: number,
  ) => Promise<void>;

  onReorder: (
    items: GalleryMediaItem[],
  ) => Promise<void>;

  onDelete: (
    item: GalleryMediaItem,
  ) => Promise<void>;

  onTogglePublish: (
    year: number,
    shouldPublish: boolean,
  ) => Promise<void>;
};

export default function AdminGalleryView({
  mediaByYear,
  selectedYear,
  isLoading,
  errorMessage,
  isCreating,
  isUploading,
  isSavingOrder,
  isDeletingId,
  isChangingPublishStatus,
  onSelectYear,
  onAddNew,
  onCancelCreate,
  onUpload,
  onReorder,
  onDelete,
  onTogglePublish,
}: Props) {
  const t = useTranslations("AdminGallery");

  const [
    pendingDeleteItem,
    setPendingDeleteItem,
  ] =
    useState<GalleryMediaItem | null>(
      null,
    );

  const [
    publishErrorMessage,
    setPublishErrorMessage,
  ] = useState<string | null>(null);

  const selectedMedia = useMemo(
    () =>
      mediaByYear.find(
        (group) =>
          group.year === selectedYear,
      )?.media ?? [],
    [mediaByYear, selectedYear],
  );

  const selectedYearIsPublished =
    selectedMedia.length > 0 &&
    selectedMedia.every(
      (item) =>
        item.status === "published",
    );

  const handleConfirmDelete =
    async () => {
      if (!pendingDeleteItem) {
        return;
      }

      await onDelete(
        pendingDeleteItem,
      );

      setPendingDeleteItem(null);
    };

  const handleTogglePublish =
    async () => {
      if (
        selectedYear === null ||
        selectedMedia.length === 0
      ) {
        return;
      }

      setPublishErrorMessage(null);

      try {
        await onTogglePublish(
          selectedYear,
          !selectedYearIsPublished,
        );
      } catch (publishError) {
        setPublishErrorMessage(
          publishError instanceof Error
            ? publishError.message
            : t("publishFailed"),
        );
      }
    };

  return (
    <section className="px-6 pb-10 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {t("title")}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <Button
          type="button"
          onClick={onAddNew}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("addNew")}
        </Button>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : mediaByYear.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border px-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("empty")}
          </p>

          <Button
            type="button"
            onClick={onAddNew}
            variant="outline"
            className="mt-4 gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("addNew")}
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap gap-4 border-b border-border p-6">
            {mediaByYear.map(
              ({ year, media }) => (
                <GalleryYearGroup
                  key={year}
                  year={year}
                  mediaCount={
                    media.length
                  }
                  selected={
                    selectedYear === year
                  }
                  onClick={() =>
                    onSelectYear(year)
                  }
                />
              ),
            )}
          </div>

          <div className="bg-muted/20 p-6">
            <div className="mb-5 flex min-h-10 flex-wrap items-center justify-end gap-3">
              {isSavingOrder && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("reordering")}
                </p>
              )}

              {selectedYear !== null &&
                selectedMedia.length > 0 && (
                  <Button
                    type="button"
                    variant={
                      selectedYearIsPublished
                        ? "outline"
                        : "default"
                    }
                    disabled={
                      isChangingPublishStatus
                    }
                    onClick={
                      handleTogglePublish
                    }
                    className="gap-2"
                  >
                    {isChangingPublishStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : selectedYearIsPublished ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}

                    {selectedYearIsPublished
                      ? t("unpublish")
                      : t("publish")}
                  </Button>
                )}
            </div>

            {publishErrorMessage && (
              <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {publishErrorMessage}
              </div>
            )}

            {selectedMedia.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                {t("emptyYear")}
              </p>
            ) : (
              <GalleryGrid
                items={selectedMedia}
                isSavingOrder={
                  isSavingOrder
                }
                isDeletingId={
                  isDeletingId
                }
                onReorder={onReorder}
                onDelete={
                  setPendingDeleteItem
                }
              />
            )}
          </div>
        </div>
      )}

      {isCreating && (
        <CreateGalleryModal
          defaultYear={
            selectedYear ??
            new Date().getFullYear()
          }
          isUploading={isUploading}
          onUpload={onUpload}
          onCancel={onCancelCreate}
        />
      )}

      {pendingDeleteItem && (
        <DeleteGalleryMediaDialog
          item={pendingDeleteItem}
          isDeleting={
            isDeletingId ===
            pendingDeleteItem.id
          }
          onCancel={() =>
            setPendingDeleteItem(null)
          }
          onConfirm={
            handleConfirmDelete
          }
        />
      )}
    </section>
  );
}