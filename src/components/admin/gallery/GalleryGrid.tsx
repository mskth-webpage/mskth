"use client";

import { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import GalleryMediaCard from "@/components/admin/gallery/GalleryMediaCard";
import type { GalleryMediaItem } from "@/types/adminGallery";

type Props = {
  items: GalleryMediaItem[];
  isSavingOrder: boolean;
  isDeletingId: number | null;
  onReorder: (items: GalleryMediaItem[]) => Promise<void>;
  onDelete: (item: GalleryMediaItem) => void;
};

export default function GalleryGrid({
  items,
  isSavingOrder,
  isDeletingId,
  onReorder,
  onDelete,
}: Props) {
  const [orderedItems, setOrderedItems] =
    useState<GalleryMediaItem[]>(items);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || isSavingOrder) {
      return;
    }

    const oldIndex = orderedItems.findIndex(
      (item) => item.id === active.id,
    );

    const newIndex = orderedItems.findIndex(
      (item) => item.id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nextItems = arrayMove(
      orderedItems,
      oldIndex,
      newIndex,
    );

    setOrderedItems(nextItems);

    try {
      await onReorder(nextItems);
    } catch {
      setOrderedItems(items);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedItems.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {orderedItems.map((item) => (
            <GalleryMediaCard
              key={item.id}
              item={item}
              isDeleting={isDeletingId === item.id}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}