"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";

import AdminGalleryView from "@/view/admin/adminGalleryView";
import type {
  CreateGalleryMediaInput,
  GalleryMediaItem,
  GalleryMediaStatus,
  GalleryYearGroup,
} from "@/types/adminGallery";

const GALLERY_SWR_KEY = "/api/admin/gallery";
const GALLERY_PUBLISH_URL =
  "/api/admin/gallery/publish";

const fetcher = async (
  url: string,
): Promise<GalleryMediaItem[]> => {
  const response = await fetch(url);

  const result = (await response
    .json()
    .catch(() => null)) as
    | GalleryMediaItem[]
    | { error?: string }
    | null;

  if (!response.ok) {
    const errorMessage =
      result &&
      !Array.isArray(result) &&
      result.error
        ? result.error
        : `Failed to fetch gallery media: HTTP ${response.status}`;

    throw new Error(errorMessage);
  }

  if (!Array.isArray(result)) {
    throw new Error(
      "Gallery API returned invalid data",
    );
  }

  return result;
};

function groupMediaByYear(
  media: GalleryMediaItem[],
): GalleryYearGroup[] {
  const groups = new Map<
    number,
    GalleryMediaItem[]
  >();

  for (const item of media) {
    const currentItems =
      groups.get(item.year) ?? [];

    currentItems.push(item);
    groups.set(item.year, currentItems);
  }

  return Array.from(groups.entries())
    .map(([year, items]) => ({
      year,
      media: [...items].sort(
        (firstItem, secondItem) =>
          firstItem.display_order -
          secondItem.display_order,
      ),
    }))
    .sort(
      (firstGroup, secondGroup) =>
        secondGroup.year - firstGroup.year,
    );
}

function getMediaType(
  file: File,
): "image" | "video" {
  return file.type.startsWith("video/")
    ? "video"
    : "image";
}

async function uploadGalleryFile(
  file: File,
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", "gallery");

  const response = await fetch(
    "/api/admin/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const result = (await response
    .json()
    .catch(() => null)) as {
    url?: string;
    error?: string;
  } | null;

  if (!response.ok || !result?.url) {
    throw new Error(
      result?.error ??
        "Failed to upload gallery file",
    );
  }

  return result.url;
}

export default function GalleryPresenter() {
  const {
    data: media = [],
    error,
    isLoading,
    mutate,
  } = useSWR<GalleryMediaItem[]>(
    GALLERY_SWR_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const [selectedYear, setSelectedYear] =
    useState<number | null>(null);

  const [isCreating, setIsCreating] =
    useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  const [isSavingOrder, setIsSavingOrder] =
    useState(false);

  const [isDeletingId, setIsDeletingId] =
    useState<number | null>(null);

  const [
    isChangingPublishStatus,
    setIsChangingPublishStatus,
  ] = useState(false);

  const mediaByYear = useMemo(
    () => groupMediaByYear(media),
    [media],
  );

  useEffect(() => {
    if (mediaByYear.length === 0) {
      setSelectedYear(null);
      return;
    }

    const yearStillExists =
      mediaByYear.some(
        (group) =>
          group.year === selectedYear,
      );

    if (!yearStillExists) {
      setSelectedYear(
        mediaByYear[0].year,
      );
    }
  }, [mediaByYear, selectedYear]);

  const handleUpload = useCallback(
    async (
      files: File[],
      year: number,
    ) => {
      if (files.length === 0) {
        return;
      }

      setIsUploading(true);

      try {
        const existingYearMedia =
          media.filter(
            (item) => item.year === year,
          );

        let nextDisplayOrder =
          existingYearMedia.length > 0
            ? Math.max(
                ...existingYearMedia.map(
                  (item) =>
                    item.display_order,
                ),
              ) + 1
            : 0;

        for (const file of files) {
          const mediaType =
            getMediaType(file);

          const mediaUrl =
            await uploadGalleryFile(file);

          const input: CreateGalleryMediaInput = {
            year,
            media_type: mediaType,
            media_url: mediaUrl,
            alt_text: file.name.replace(
              /\.[^/.]+$/,
              "",
            ),
            display_order: nextDisplayOrder,
            status: "draft",
          };

          const response = await fetch(
            GALLERY_SWR_KEY,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(input),
            },
          );

          if (!response.ok) {
            const result = (await response
              .json()
              .catch(() => null)) as {
              error?: string;
            } | null;

            throw new Error(
              result?.error ??
                "Failed to save gallery media",
            );
          }

          nextDisplayOrder += 1;
        }

        await mutate();
        setSelectedYear(year);

        // Modalen stängs inte längre här.
        // Användaren kan välja Add more eller Done.
      } finally {
        setIsUploading(false);
      }
    },
    [media, mutate],
  );

  const handleDelete = useCallback(
    async (item: GalleryMediaItem) => {
      setIsDeletingId(item.id);

      try {
        const response = await fetch(
          `${GALLERY_SWR_KEY}?id=${item.id}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const result = (await response
            .json()
            .catch(() => null)) as {
            error?: string;
          } | null;

          throw new Error(
            result?.error ??
              "Failed to delete gallery media",
          );
        }

        await mutate();
      } finally {
        setIsDeletingId(null);
      }
    },
    [mutate],
  );

  const handleReorder = useCallback(
    async (
      reorderedItems: GalleryMediaItem[],
    ) => {
      if (reorderedItems.length === 0) {
        return;
      }

      setIsSavingOrder(true);

      const previousMedia = media;

      const reorderedWithPositions =
        reorderedItems.map(
          (item, index) => ({
            ...item,
            display_order: index,
          }),
        );

      const reorderedIds = new Set(
        reorderedWithPositions.map(
          (item) => item.id,
        ),
      );

      const optimisticMedia = [
        ...media.filter(
          (item) =>
            !reorderedIds.has(item.id),
        ),
        ...reorderedWithPositions,
      ];

      await mutate(
        optimisticMedia,
        false,
      );

      try {
        const response = await fetch(
          `${GALLERY_SWR_KEY}/reorder`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              items:
                reorderedWithPositions.map(
                  (item) => ({
                    id: item.id,
                    display_order:
                      item.display_order,
                  }),
                ),
            }),
          },
        );

        if (!response.ok) {
          const result = (await response
            .json()
            .catch(() => null)) as {
            error?: string;
          } | null;

          throw new Error(
            result?.error ??
              "Failed to update gallery order",
          );
        }

        await mutate();
      } catch (reorderError) {
        await mutate(
          previousMedia,
          false,
        );

        throw reorderError;
      } finally {
        setIsSavingOrder(false);
      }
    },
    [media, mutate],
  );

  const handleTogglePublish =
    useCallback(
      async (
        year: number,
        shouldPublish: boolean,
      ) => {
        const nextStatus: GalleryMediaStatus =
          shouldPublish
            ? "published"
            : "draft";

        const previousMedia = media;

        const optimisticMedia =
          media.map((item) =>
            item.year === year
              ? {
                  ...item,
                  status: nextStatus,
                }
              : item,
          );

        setIsChangingPublishStatus(true);

        await mutate(
          optimisticMedia,
          false,
        );

        try {
          const response = await fetch(
            GALLERY_PUBLISH_URL,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                year,
                status: nextStatus,
              }),
            },
          );

          const result = (await response
            .json()
            .catch(() => null)) as {
            error?: string;
          } | null;

          if (!response.ok) {
            throw new Error(
              result?.error ??
                "Failed to update gallery publication status",
            );
          }

          await mutate();
        } catch (publishError) {
          await mutate(
            previousMedia,
            false,
          );

          throw publishError;
        } finally {
          setIsChangingPublishStatus(
            false,
          );
        }
      },
      [media, mutate],
    );

  return (
    <AdminGalleryView
      mediaByYear={mediaByYear}
      selectedYear={selectedYear}
      isLoading={isLoading}
      errorMessage={
        error instanceof Error
          ? error.message
          : null
      }
      isCreating={isCreating}
      isUploading={isUploading}
      isSavingOrder={isSavingOrder}
      isDeletingId={isDeletingId}
      isChangingPublishStatus={
        isChangingPublishStatus
      }
      onSelectYear={setSelectedYear}
      onAddNew={() =>
        setIsCreating(true)
      }
      onCancelCreate={() =>
        setIsCreating(false)
      }
      onUpload={handleUpload}
      onReorder={handleReorder}
      onDelete={handleDelete}
      onTogglePublish={
        handleTogglePublish
      }
    />
  );
}