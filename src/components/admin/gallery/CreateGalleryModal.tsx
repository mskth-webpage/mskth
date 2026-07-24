"use client";

import {
  ChangeEvent,
  DragEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckCircle2,
  ImagePlus,
  Plus,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import SortableGalleryPreview from "@/components/admin/gallery/SortableGalleryPreview";

type Props = {
  defaultYear?: number;
  isUploading: boolean;
  onUpload: (
    files: File[],
    year: number,
  ) => Promise<void>;
  onCancel: () => void;
};

type PreviewItem = {
  id: string;
  file: File;
  url: string;
};

function createPreview(file: File): PreviewItem {
  return {
    id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    url: URL.createObjectURL(file),
  };
}

function isSupportedMediaFile(file: File) {
  return (
    file.type.startsWith("image/") ||
    file.type.startsWith("video/")
  );
}

export default function CreateGalleryModal({
  defaultYear = new Date().getFullYear(),
  isUploading,
  onUpload,
  onCancel,
}: Props) {
  const t = useTranslations("AdminGallery");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [year, setYear] = useState(defaultYear);
  const [previews, setPreviews] =
    useState<PreviewItem[]>([]);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [uploadedCount, setUploadedCount] =
    useState<number | null>(null);

  const [isDraggingFiles, setIsDraggingFiles] =
    useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const files = useMemo(
    () => previews.map((preview) => preview.file),
    [previews],
  );

  const revokePreviewUrls = (
    previewItems: PreviewItem[],
  ) => {
    previewItems.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });
  };

  const appendFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) {
      return;
    }

    const validFiles = selectedFiles.filter(
      isSupportedMediaFile,
    );

    if (validFiles.length !== selectedFiles.length) {
      setErrorMessage(
        t("unsupportedFiles"),
      );
    } else {
      setErrorMessage(null);
    }

    if (validFiles.length === 0) {
      return;
    }

    setUploadedCount(null);

    setPreviews((current) => [
      ...current,
      ...validFiles.map(createPreview),
    ]);
  };

  const handleFilesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    appendFiles(
      Array.from(event.target.files ?? []),
    );

    event.target.value = "";
  };

  const handleDrop = (
    event: DragEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setIsDraggingFiles(false);

    if (isUploading) {
      return;
    }

    appendFiles(
      Array.from(event.dataTransfer.files),
    );
  };

  const removePreview = (id: string) => {
    setPreviews((current) => {
      const item = current.find(
        (preview) => preview.id === id,
      );

      if (item) {
        URL.revokeObjectURL(item.url);
      }

      return current.filter(
        (preview) => preview.id !== id,
      );
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setPreviews((current) => {
      const oldIndex = current.findIndex(
        (item) => item.id === active.id,
      );

      const newIndex = current.findIndex(
        (item) => item.id === over.id,
      );

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      return arrayMove(
        current,
        oldIndex,
        newIndex,
      );
    });
  };

  const handleSave = async () => {
    if (
      files.length === 0 ||
      !year ||
      isUploading
    ) {
      return;
    }

    setErrorMessage(null);

    const numberOfFiles = files.length;

    try {
      await onUpload(files, year);

      revokePreviewUrls(previews);
      setPreviews([]);
      setUploadedCount(numberOfFiles);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("uploadFailed"),
      );
    }
  };

  const handleAddMore = () => {
    setUploadedCount(null);
    setErrorMessage(null);

    requestAnimationFrame(() => {
      fileInputRef.current?.click();
    });
  };

  const handleClose = () => {
    if (isUploading) {
      return;
    }

    revokePreviewUrls(previews);
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-muted-foreground/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="gallery-modal-title"
              className="text-lg font-semibold text-foreground"
            >
              {t("createTitle")}
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("mediaLabel")}
            </p>
          </div>

          <button
            type="button"
            aria-label={t("cancel")}
            onClick={handleClose}
            disabled={isUploading}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {uploadedCount !== null ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {t("uploadSuccessTitle")}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("uploadSuccessDescription", {
                  count: uploadedCount,
                  year,
                })}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddMore}
                className="mt-6 gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("addMore")}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="gallery-year"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  {t("yearLabel")}
                </label>

                <input
                  id="gallery-year"
                  type="number"
                  min={1900}
                  max={2200}
                  value={year}
                  disabled={isUploading}
                  onChange={(event) =>
                    setYear(
                      Number(event.target.value),
                    )
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  disabled={isUploading}
                  className="hidden"
                  onChange={handleFilesChange}
                />

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDraggingFiles(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDraggingFiles(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();

                    if (
                      event.currentTarget ===
                      event.target
                    ) {
                      setIsDraggingFiles(false);
                    }
                  }}
                  onDrop={handleDrop}
                  className={`flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    isDraggingFiles
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <ImagePlus className="h-8 w-8" />

                  <div>
                    <p className="text-sm font-medium">
                      {isDraggingFiles
                        ? t("dropMedia")
                        : t("uploadMedia")}
                    </p>

                    <p className="mt-1 text-xs opacity-70">
                      JPG, PNG, WEBP, GIF, MP4,
                      MOV och WEBM
                    </p>
                  </div>
                </button>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              {previews.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {t("selectedFiles", {
                        count: previews.length,
                      })}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {t("dragToReorder")}
                    </p>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={
                      closestCenter
                    }
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={previews.map(
                        (preview) => preview.id,
                      )}
                      strategy={
                        rectSortingStrategy
                      }
                    >
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {previews.map(
                          (preview) => (
                            <SortableGalleryPreview
                              key={preview.id}
                              preview={preview}
                              onRemove={
                                removePreview
                              }
                            />
                          ),
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-5 py-4">
          {uploadedCount !== null ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMore}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("addMore")}
              </Button>

              <Button
                type="button"
                onClick={handleClose}
              >
                {t("done")}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleSave}
                disabled={
                  isUploading ||
                  files.length === 0 ||
                  !year
                }
              >
                {isUploading
                  ? t("saving")
                  : `${t("save")} (${files.length})`}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
              >
                {t("cancel")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}