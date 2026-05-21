"use client";

import { useEffect, useState, useCallback } from "react";
import AdminProjectsView, {
  Project,
} from "@/view/admin/project/AdminProjectsView";
import { createClient } from "@/utils/supabase/client";

export default function AdminProjectsPresenter() {

  const [nextProjects, setNextProjects] = useState<Project[]>([]);
  const [previousProjects, setPreviousProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/project");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();

      if (data.projects) {
        // Filtrer les projets actifs (draft ou published)
        const next = data.projects.filter(
          (p: Project) => p.status === "draft" || p.status === "published",
        );
        // Filtrer les projets passés (archived)
        const previous = data.projects.filter(
          (p: Project) => p.status === "archived",
        );

        setNextProjects(next);
        setPreviousProjects(previous);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = async (
    projectData: Omit<Project, "id">,
    file: File | null,
  ) => {
    setIsLoading(true);
    try {
      let publicImageUrl = projectData.image_url;
      const supabase = createClient();

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(`projects/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(`projects/${fileName}`);
          
        publicImageUrl = data.publicUrl;
      }

      const newProject = {
        title: projectData.title,
        description: projectData.description,
        group_label: projectData.group_label,
        members: projectData.members,
        status: projectData.status,
        image_url: publicImageUrl,
      };

      const response = await fetch("/api/auth/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: [newProject] }),
      });

      if (!response.ok) throw new Error("Failed to add project");

      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (project: Project, file: File | null) => {

    setIsLoading(true);
    try {
      let publicImageUrl = project.image_url;
      const supabase = createClient();

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(`projects/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(`projects/${fileName}`);
          
        publicImageUrl = data.publicUrl;
      }

      const updatedProject = {
        id: project.id,
        title: project.title,
        description: project.description,
        group_label: project.group_label,
        members: project.members,
        status: project.status,
        image_url: publicImageUrl,
      };

      const response = await fetch("/api/auth/project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: updatedProject }),
      });

      if (!response.ok) throw new Error("Failed to update project");

      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string | number) => {

    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/project?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center p-12 text-xl font-medium text-muted-foreground">
        Loading projects...
      </div>
    );
  }

  return (
    <AdminProjectsView
      nextProjects={nextProjects}
      previousProjects={previousProjects}
      onAddProject={handleAddProject}
      onUpdateProject={handleUpdateProject}
      onDeleteProject={handleDeleteProject}
    />
  );
}
