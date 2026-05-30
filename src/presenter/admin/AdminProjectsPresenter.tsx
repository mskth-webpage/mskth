"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import AdminProjectsView, {
  Project,
} from "@/view/admin/project/AdminProjectsView";
import { createClient } from "@/utils/supabase/client";

const SWR_KEY = "/api/admin/project";
const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export default function AdminProjectsPresenter() {
  const { data, isLoading, error } = useSWR<{ projects: Project[] }>(SWR_KEY, fetcher, {
    revalidateOnFocus: false,
  });

  const nextProjects = data?.projects?.filter(
    (p) => p.status === "draft" || p.status === "published"
  ) || [];

  const previousProjects = data?.projects?.filter(
    (p) => p.status === "archived"
  ) || [];

  const [isMutating, setIsMutating] = useState(false);

  const handleAddProject = async (
    projectData: Omit<Project, "id">,
    file: File | null,
  ) => {
    setIsMutating(true);
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
      } else if (!publicImageUrl) {
        publicImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/images/MSkth.png`;
      }

      const newProject = {
        title: projectData.title,
        description: projectData.description,
        content: projectData.content,
        group_label: projectData.group_label,
        status: projectData.status,
        image_url: publicImageUrl,
      };

      const response = await fetch("/api/admin/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: [newProject] }),
      });

      if (!response.ok) throw new Error("Failed to add project");

      await mutate(SWR_KEY);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création");
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdateProject = async (project: Project, file: File | null) => {
    setIsMutating(true);
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
      } else if (!publicImageUrl) {
        publicImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/images/MSkth.png`;
      }

      const updatedProject = {
        id: project.id,
        title: project.title,
        description: project.description,
        content: project.content,
        group_label: project.group_label,
        status: project.status,
        image_url: publicImageUrl,
      };

      const response = await fetch("/api/admin/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: updatedProject }),
      });

      if (!response.ok) throw new Error("Failed to update project");

      await mutate(SWR_KEY);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteProject = async (id: string | number) => {
    setIsMutating(true);
    try {
      const response = await fetch(`/api/admin/project?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      await mutate(SWR_KEY);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    } finally {
      setIsMutating(false);
    }
  };



  return (
    <AdminProjectsView
      nextProjects={nextProjects}
      previousProjects={previousProjects}
      onAddProject={handleAddProject}
      onUpdateProject={handleUpdateProject}
      onDeleteProject={handleDeleteProject}
      isLoading={isLoading || isMutating}
    />
  );
}
