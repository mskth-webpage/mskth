"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";

import GalleryView from "@/view/GalleryView";
import type {
  GalleryMediaItem,
  GalleryYearGroup,
} from "@/types/adminGallery";

const GALLERY_API_URL = "/api/gallery";

async function fetchGallery(
  url: string,
): Promise<GalleryMediaItem[]> {
  const response = await fetch(url);

  const result = (await response
    .json()
    .catch(() => null)) as
    | GalleryMediaItem[]
    | {
        error?: string;
      }
    | null;

  if (!response.ok) {
    const errorMessage =
      result &&
      !Array.isArray(result) &&
      result.error
        ? result.error
        : "Failed to load gallery";

    throw new Error(errorMessage);
  }

  if (!Array.isArray(result)) {
    throw new Error(
      "Gallery API returned invalid data",
    );
  }

  return result;
}

function groupMediaByYear(
  media: GalleryMediaItem[],
): GalleryYearGroup[] {
  const groups = new Map<
    number,
    GalleryMediaItem[]
  >();

  for (const item of media) {
    const currentGroup =
      groups.get(item.year) ?? [];

    currentGroup.push(item);
    groups.set(item.year, currentGroup);
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
        secondGroup.year -
        firstGroup.year,
    );
}

export default function GalleryPresenter() {
  const {
    data: media = [],
    error,
    isLoading,
  } = useSWR<GalleryMediaItem[]>(
    GALLERY_API_URL,
    fetchGallery,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );

  const [
    selectedYear,
    setSelectedYear,
  ] = useState<number | null>(null);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState<number | null>(null);

  const groups = useMemo(
    () => groupMediaByYear(media),
    [media],
  );

  const selectedItems = useMemo(() => {
    if (selectedYear === null) {
      return [];
    }

    return (
      groups.find(
        (group) =>
          group.year === selectedYear,
      )?.media ?? []
    );
  }, [groups, selectedYear]);

  useEffect(() => {
    if (groups.length === 0) {
      setSelectedYear(null);
      return;
    }

    const selectedYearExists =
      groups.some(
        (group) =>
          group.year === selectedYear,
      );

    if (!selectedYearExists) {
      setSelectedYear(
        groups[0].year,
      );
    }
  }, [groups, selectedYear]);

  const handleSelectYear = (
    year: number,
  ) => {
    if (year === selectedYear) {
      return;
    }

    setActiveIndex(null);
    setSelectedYear(year);
  };

  const handleOpenItem = (
    index: number,
  ) => {
    if (
      index < 0 ||
      index >= selectedItems.length
    ) {
      return;
    }

    setActiveIndex(index);
  };

  const handleChangeLightboxIndex = (
    index: number,
  ) => {
    if (
      index < 0 ||
      index >= selectedItems.length
    ) {
      return;
    }

    setActiveIndex(index);
  };

  return (
    <GalleryView
      groups={groups}
      selectedYear={selectedYear}
      selectedItems={selectedItems}
      activeIndex={activeIndex}
      isLoading={isLoading}
      errorMessage={
        error instanceof Error
          ? error.message
          : null
      }
      onSelectYear={
        handleSelectYear
      }
      onOpenItem={handleOpenItem}
      onCloseLightbox={() =>
        setActiveIndex(null)
      }
      onChangeLightboxIndex={
        handleChangeLightboxIndex
      }
    />
  );
}