"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import useSWR, { mutate } from "swr";
import AdminProjectGroupView from "@/view/admin/AdminProjectGroupView";
import type {
  AdminProjectGroup,
  ProjectGroupModalInput,
} from "@/types/projectGroups";

const SWR_KEY = "/api/admin/project_groups";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export default function ProjectGroupPresenter() {
  const { data, isLoading } = useSWR<AdminProjectGroup[]>(
    SWR_KEY, fetcher, {revalidateOnFocus: false,});

  const dbGroups = data ?? [];
  const storageKey = useMemo(() => "admin-projectgroups-draft", []);

  const [groups, setGroups] = useState<AdminProjectGroup[]>([]);
  const groupCount = groups.length;
  
  const [hasDraft, setHasDraft] = useState(false);
  const [isPublishing, startTransition] = useTransition();

  useEffect(() => {
    if (isLoading) return;

    const draft = localStorage.getItem(storageKey);

    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setGroups(parsed);
        setHasDraft(true);
        return;
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    setGroups(dbGroups);
    setHasDraft(false);

  }, [dbGroups, isLoading, storageKey]);

  function saveDraft(updated: AdminProjectGroup[]) {
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setGroups(updated);
    setHasDraft(true);
  }

  function normalizeOrder(list: AdminProjectGroup[]) {
    return list.map((g, index) => ({...g, display_order: index + 1,}));
  }

  function moveGroup(
    list: AdminProjectGroup[],
    id: AdminProjectGroup["id"],
    newPosition: number
  ) {
    const sorted = [...list].sort((a, b) => a.display_order - b.display_order);
    const oldIndex = sorted.findIndex((m) => m.id === id);
    if (oldIndex === -1) return sorted;

    const [group] = sorted.splice(oldIndex, 1);
    sorted.splice(newPosition - 1, 0, group);
    return normalizeOrder(sorted);
  }

  function handleCreate(input: ProjectGroupModalInput) {
    const newGroup: AdminProjectGroup = {
      id: `temp-${crypto.randomUUID()}`,
      ...input,
    };
    
    const updatedGroupList = [...groups, newGroup];
    saveDraft(moveGroup(updatedGroupList, newGroup.id, input.display_order));
  }

  function handleEdit(
    id: AdminProjectGroup["id"],
    input: ProjectGroupModalInput
  ) {
    const updated = groups.map((g) =>
      g.id === id ? {...g, ...input,} : g
    );
    saveDraft(moveGroup(updated, id, input.display_order));
  }

  function handleDelete(id: AdminProjectGroup["id"]) {
    saveDraft(normalizeOrder(groups.filter((g) => g.id !== id)));
  }

  async function handlePublish() {
    startTransition(async () => {
      const res = await fetch(SWR_KEY, {
        method: "PUT",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({projectGroups: groups,}), 
      });

      if (!res.ok) {throw new Error("Failed to publish");}

      localStorage.removeItem(storageKey);
      setHasDraft(false);
      await mutate(SWR_KEY);
    });
  }

  async function handleCancelChanges() {
    localStorage.removeItem(storageKey);
    setGroups(dbGroups);
    setHasDraft(false);
    await mutate(SWR_KEY);
  }

  return (
    <AdminProjectGroupView
      projectGroups={groups}
      groupCount={groupCount}
      isLoading={isLoading}
      isPublishing={isPublishing}
      hasDraft={hasDraft}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancelChanges={handleCancelChanges}
      onPublish={handlePublish}
    />
  );
}
