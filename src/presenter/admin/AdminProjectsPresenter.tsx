"use client";

import { useEffect, useState } from "react";
import AdminProjectsView, { Project } from "@/view/admin/AdminProjectsView";
import { useTranslations } from "next-intl";

export default function AdminProjectsPresenter() {
  const t = useTranslations("AdminProjects.project");
  
  const [nextProjects, setNextProjects] = useState<Project[]>([]);
  const [previousProjects, setPreviousProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/auth/project");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();

        if (data.projects) {
          // Filtrer les projets actifs (draft ou published)
          const next = data.projects.filter(
            (p: Project) => p.status === "draft" || p.status === "published"
          );
          // Filtrer les projets passés (archived)
          const previous = data.projects.filter(
            (p: Project) => p.status === "archived"
          );

          setNextProjects(next);
          setPreviousProjects(previous);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center p-12 text-xl font-medium text-muted-foreground">
        Loading projects...
      </div>
    );
  }

  return <AdminProjectsView nextProjects={nextProjects} previousProjects={previousProjects} />;
}
