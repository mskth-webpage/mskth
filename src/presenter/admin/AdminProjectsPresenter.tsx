"use client";

import { useEffect, useState, useCallback } from "react";
import AdminProjectsView, {
  Project,
} from "@/view/admin/project/AdminProjectsView";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";

// Extension of Project to store the actual file so it can be uploaded during save
type PendingProject = Project & { file: File | null };

export default function AdminProjectsPresenter() {
  const t = useTranslations("AdminProjects.project");

  const [nextProjects, setNextProjects] = useState<Project[]>([]);
  const [previousProjects, setPreviousProjects] = useState<Project[]>([]);

  // Pending projects that are not yet saved to the database.
  const [pendingNextProjects, setPendingNextProjects] = useState<PendingProject[]>([]);
  const [pendingPreviousProjects, setPendingPreviousProjects] = useState<PendingProject[]>([]);

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

  // Mocks a real project ID for local usage before saving
  const generateLocalId = () =>
    `local-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddProject = (
    projectData: Omit<Project, "id">,
    file: File | null,
  ) => {
    // If there's an image, create a temporary local URL for preview
    const tempImageUrl = file ? URL.createObjectURL(file) : undefined;

    // Create the full object mapping
    const newProject: PendingProject = {
      ...projectData,
      id: generateLocalId(),
      image_url: tempImageUrl,
      status: projectData.status,
      file,
    };

    // Store in the correct pending array to be displayed immediately
    if (newProject.status === "draft" || newProject.status === "published") {
      setPendingNextProjects((prev) => [...prev, newProject]);
    } else {
      setPendingPreviousProjects((prev) => [...prev, newProject]);
    }
  };

  const handleUpdateProject = async (project: Project, file: File | null) => {
    if (String(project.id).startsWith("local-")) {
      const updatePendingList = (list: PendingProject[]) => 
        list.map((p) => (p.id === project.id ? { ...project, file: file || p.file } as PendingProject : p));
      
      setPendingNextProjects(updatePendingList);
      setPendingPreviousProjects(updatePendingList);
      return;
    }

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
    if (!confirm("Are you sure you want to delete this project?")) return;

    if (String(id).startsWith("local-")) {
      setPendingNextProjects((prev) => prev.filter(p => p.id !== id));
      setPendingPreviousProjects((prev) => prev.filter(p => p.id !== id));
      return;
    }

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

  const handleSaveChanges = async (type: "next" | "previous", action: "save" | "publish") => {
    const supabase = createClient();
    const pendingList = type === "next" ? pendingNextProjects : pendingPreviousProjects;
    
    if (pendingList.length === 0) return;

    setIsLoading(true);

    try {
      const preparedProjects = await Promise.all(
        pendingList.map(async (p) => {
          let publicImageUrl = p.image_url;

          if (p.file) {
            const fileExt = p.file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(`projects/${fileName}`, p.file, {
                cacheControl: '3600',
                upsert: false,
              });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
              .from('images')
              .getPublicUrl(`projects/${fileName}`);
              
            publicImageUrl = data.publicUrl;
          }

          // Force "draft" on Save for active section. "publish" enforces visibility.
          let finalStatus = p.status;
          if (type === "next") {
            finalStatus = action === "publish" ? "published" : "draft";
          } else {
            // For archived section, they should ideally be "archived" when saved.
            // But if published, they get visible to front-end? We'll enforce archived if saved.
            finalStatus = action === "publish" ? "published" : "archived";
          }

          return {
            title: p.title,
            description: p.description,
            group_label: p.group_label,
            members: p.members,
            status: finalStatus,
            image_url: publicImageUrl,   
          };
        })
      );

      const response = await fetch("/api/auth/project", {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({ projects: preparedProjects }),
      });

      if (!response.ok) {
         throw new Error("Failed to save projects");
      }

      // Clear pending list
      if (type === "next") setPendingNextProjects([]);
      else setPendingPreviousProjects([]);
      
      // Call the API again to refresh the IDs correctly and have real db representations
      await fetchProjects();

    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde: Vérifie que ton bucket 'images' est bien en mode public.");
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

  // Combine saved projects and un-saved pending ones directly in the view
  return (
    <AdminProjectsView
      nextProjects={[...pendingNextProjects, ...nextProjects]}
      previousProjects={[...pendingPreviousProjects, ...previousProjects]}
      onAddProject={handleAddProject}
      onUpdateProject={handleUpdateProject}
      onDeleteProject={handleDeleteProject}
      onSave={(type) => handleSaveChanges(type, "save")}
      onPublish={(type) => handleSaveChanges(type, "publish")}
    />
  );
}
