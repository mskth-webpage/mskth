'use client';

import useSWR from "swr";
import AboutUsView from "@/view/AboutUsView";
import type { Project } from "@/view/admin/project/AdminProjectsView";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("fetch failed");
    return r.json();
  });

export default function AboutUsPresenter() {
  const { data: projects = [], isLoading } = useSWR<Project[]>("/api/projects", fetcher);

  return (
    <div>
      <AboutUsView projects={projects} isLoading={isLoading} />
    </div>
  );
}

