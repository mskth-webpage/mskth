'use client';

import useSWR from "swr";
import AboutUsView from '@/view/AboutUsView';
import type { PublicBoardMember } from "@/types/adminBoardMembers";
import type { Project } from "@/view/admin/project/AdminProjectsView";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export default function AboutUsPresenter() {
  const { data: boardMembers, isLoading: isLoadingBoard, error: boardError } = useSWR<PublicBoardMember[]>(
    "/api/about_us", fetcher);
  const { data: projects = [], isLoading: isLoadingProjects } = useSWR<Project[]>("/api/projects", fetcher);

  return (
    <AboutUsView 
      boardMembers={boardMembers ?? []} 
      isLoadingBoard={isLoadingBoard}
      boardError={boardError}
      projects={projects}
      isLoadingProjects={isLoadingProjects}
    />
  );
}
