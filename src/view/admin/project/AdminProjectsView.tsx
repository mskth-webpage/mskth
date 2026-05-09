"use client";

import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { useTranslations } from "next-intl";
import AdminModal from "@/components/admin/AdminModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  description: string;
  group_label: string;
  members: string;
  image_url?: string;
  status: "draft" | "published" | "archived";
};

type Props = {
  nextProjects: Project[];
  previousProjects: Project[];
  onAddProject: (project: Omit<Project, "id">, imageFile: File | null) => void;
  onUpdateProject?: (project: Project, imageFile: File | null) => void;
  onDeleteProject?: (id: string) => void;
  onSave: (target: "next" | "previous") => void;
  onPublish: (target: "next" | "previous") => void;
};

export default function AdminProjectsView({ nextProjects, previousProjects, onAddProject, onUpdateProject, onDeleteProject, onSave, onPublish }: Props) {
  const t = useTranslations("AdminProjects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupLabel, setGroupLabel] = useState("");
  const [members, setMembers] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [statusTarget, setStatusTarget] = useState<"draft" | "archived" | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGroupLabel("");
    setMembers("");
    setImageFile(null);
    setEditingProject(null);
  };

  const handleOpenModal = (targetStatus: "draft" | "archived") => {
    setStatusTarget(targetStatus);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setGroupLabel(project.group_label);
    setMembers(project.members);
    setImageFile(null);
    setStatusTarget(project.status as "draft" | "archived" | "published");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusTarget) return;

    if (editingProject && onUpdateProject) {
      onUpdateProject(
        {
          ...editingProject,
          title,
          description,
          group_label: groupLabel,
          members,
          status: statusTarget,
        },
        imageFile
      );
    } else {
      onAddProject(
        {
          title,
          description,
          group_label: groupLabel,
          members,
          status: statusTarget,
        },
        imageFile
      );
    }
    setIsModalOpen(false);
  };

  return (
    <section className="w-full p-6 sm:p-8 lg:p-12 lg:pt-10 max-w-[1200px] mx-auto">
      {/* Create next project section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-6">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-wide">
          {t("title")}
        </h2>
        <Button
          variant="outline"
          onClick={() => handleOpenModal("draft")}
          className="rounded-xl px-4 py-2 text-sm font-medium border-[#1e325c] text-[#1e325c] hover:bg-[#6d9bc0]/10 transition-colors shadow-sm"
        >
          {t("addNew")}
        </Button>
      </div>

      <div className="bg-[#6d9bc0] rounded-xl p-8 mb-6 min-h-[150px] flex items-center">
        <div className="flex flex-wrap gap-10 md:gap-14 justify-center sm:justify-start w-full">
          {nextProjects.length > 0 ? (
            nextProjects.map((project) => (
              <div key={project.id} className="relative group">
                <ProjectCard
                  name={project.title}
                  description={project.description}
                  project_group_label={project.group_label}
                  project_members={project.members}
                  imageUrl={project.image_url}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e325c]/80 p-1.5 rounded-lg backdrop-blur-sm">
                  <button onClick={() => handleEditProject(project)} className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteProject && onDeleteProject(project.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-md transition-colors" title="Delete">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/80 italic w-full text-center">{t("noProjects")}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mb-16">
        <Button
          onClick={() => onSave("next")}
          variant="outline"
          className="rounded-xl px-8 py-2 text-[#1e325c] border-[#1e325c] hover:bg-[#6d9bc0]/10 transition-colors"
        >
          {t("save")}
        </Button>
        <Button
          onClick={() => onPublish("next")}
          variant="outline"
          className="rounded-xl px-8 py-2 text-[#1e325c] border-[#1e325c] hover:bg-[#6d9bc0]/10 transition-colors"
        >
          {t("publish")}
        </Button>
      </div>

      {/* Create previous project section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-6">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-wide">
          {t("titlePrevious")}
        </h2>
        <Button
          variant="outline"
          onClick={() => handleOpenModal("archived")}
          className="rounded-xl px-4 py-2 text-sm font-medium border-[#1e325c] text-[#1e325c] hover:bg-[#6d9bc0]/10 transition-colors shadow-sm"
        >
          {t("addNew")}
        </Button>
      </div>

      <div className="bg-[#6d9bc0] rounded-xl p-8 mb-6 min-h-[150px] flex items-center">
        <div className="flex flex-wrap gap-10 md:gap-14 justify-center sm:justify-start w-full">
          {previousProjects.length > 0 ? (
            previousProjects.map((project) => (
              <div key={project.id} className="relative group">
                <ProjectCard
                  name={project.title}
                  description={project.description}
                  project_group_label={project.group_label}
                  project_members={project.members}
                  imageUrl={project.image_url}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e325c]/80 p-1.5 rounded-lg backdrop-blur-sm">
                  <button onClick={() => handleEditProject(project)} className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteProject && onDeleteProject(project.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-md transition-colors" title="Delete">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/80 italic w-full text-center">{t("noProjects")}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mb-16">
        <Button
          onClick={() => onSave("previous")}
          variant="outline"
          className="rounded-xl px-8 py-2 text-[#1e325c] border-[#1e325c] hover:bg-[#6d9bc0]/10 transition-colors"
        >
          {t("save")}
        </Button>
        <Button
          onClick={() => onPublish("previous")}
          variant="outline"
          className="rounded-xl px-8 py-2 text-[#1e325c] border-[#1e325c] hover:bg-[#6d9bc0]/10 transition-colors"
        >
          {t("publish")}
        </Button>
      </div>

      <AdminModal
        title={editingProject ? "Edit Project" : t("addNew")}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("project.name")}</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#1e325c] border-none text-white focus-visible:ring-1 focus-visible:ring-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("project.description")}</Label>
            <Input
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1e325c] border-none text-white focus-visible:ring-1 focus-visible:ring-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="groupLabel">{t("project.groupLabel")}</Label>
            <Input
              id="groupLabel"
              required
              value={groupLabel}
              onChange={(e) => setGroupLabel(e.target.value)}
              className="bg-[#1e325c] border-none text-white focus-visible:ring-1 focus-visible:ring-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="members">{t("project.members")}</Label>
            <Input
              id="members"
              required
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="bg-[#1e325c] border-none text-white focus-visible:ring-1 focus-visible:ring-white"
            />
          </div>
          <div className="space-y-2 pt-2">
            <Label htmlFor="image">Image (Optionnel)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="bg-[#1e325c] border-none text-white file:text-white file:font-semibold focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-none hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6d9bc0] text-white hover:bg-[#6d9bc0]/80"
            >
              {editingProject ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </section>
  );
}
