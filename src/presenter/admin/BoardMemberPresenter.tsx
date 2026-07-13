"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import useSWR, { mutate } from "swr";
import AdminBoardView from "@/view/admin/adminBoardView";
import type {
  AdminBoardMember,
  BoardMemberFormInput,
} from "@/types/adminBoardMembers";

const SWR_KEY = "/api/admin/boardmembers";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export default function BoardMemberPresenter() {
  const { data, isLoading } = useSWR<AdminBoardMember[]>(
    SWR_KEY, fetcher, {revalidateOnFocus: false,});

  const dbMembers = data ?? [];
  const storageKey = useMemo(() => "admin-boardmembers-draft", []);

  const [members, setMembers] = useState<AdminBoardMember[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [isPublishing, startTransition] = useTransition();

  useEffect(() => {
    if (isLoading) return;

    const draft = localStorage.getItem(storageKey);

    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setMembers(parsed);
        setHasDraft(true);
        return;
      } catch {
        localStorage.removeItem(storageKey);
      }
    }

    setMembers(dbMembers);
    setHasDraft(false);

  }, [dbMembers, isLoading, storageKey]);

  function saveDraft(updated: AdminBoardMember[]) {
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setMembers(updated);
    setHasDraft(true);
  }

  function normalizeOrder(list: AdminBoardMember[]) {
    return list.map((member, index) => ({...member, display_order: index + 1,}));
  }

  function moveMember(
    list: AdminBoardMember[],
    id: AdminBoardMember["id"],
    newPosition: number
  ) {
    const sorted = [...list].sort((a, b) => a.display_order - b.display_order);
    const oldIndex = sorted.findIndex((m) => m.id === id);
    if (oldIndex === -1) return sorted;

    const [member] = sorted.splice(oldIndex, 1);
    sorted.splice(newPosition - 1, 0, member);
    return normalizeOrder(sorted);
  }

  function handleCreate(input: BoardMemberFormInput) {
    const newMember: AdminBoardMember = {
      id: `temp-${crypto.randomUUID()}`,
      ...input,
    };
    saveDraft(normalizeOrder([...members, newMember,]));
  }

  function handleEdit(
    id: AdminBoardMember["id"],
    input: BoardMemberFormInput
  ) {
    const updated = members.map((member) =>
      member.id === id ? {...member, ...input,} : member
    );
    saveDraft(moveMember(updated, id, input.display_order));
  }

  function handleDelete(id: AdminBoardMember["id"]) {
    saveDraft(normalizeOrder(members.filter((member) => member.id !== id)));
  }

  async function handlePublish() {
    startTransition(async () => {
      const res = await fetch(SWR_KEY, {
        method: "PUT",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({members,}), 
      });

      if (!res.ok) {throw new Error("Failed to publish");}

      localStorage.removeItem(storageKey);
      setHasDraft(false);
      await mutate(SWR_KEY);
    });
  }

  async function handleCancelChanges() {
    localStorage.removeItem(storageKey);
    setHasDraft(false);
    await mutate(SWR_KEY);
  }

  return (
    <AdminBoardView
      boardMembers={members}
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