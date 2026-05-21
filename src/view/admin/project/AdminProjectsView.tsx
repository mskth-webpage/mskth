"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ProjectGroup from "@/components/admin/project/ProjectGroup";
import AdminProjectCard from "@/components/admin/project/AdminProjectCard";
import DeleteProjectDialog from "@/components/admin/project/DeleteProjectDialog";
import CreateProjectModal from "@/components/admin/project/CreateProjectModal";
import ProjectContextMenu from "@/components/admin/project/ProjectContextMenu";
import ProjectDetailModal from "@/components/admin/project/ProjectDetailModal";
import PublishConfirmDialog from "@/components/admin/event/PublishConfirmDialog";

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
  onDeleteProject?: (id: string) => Promise<void> | void;
};

const CARD_STEP = 304; // w-72 (288) + gap-4 (16)

export default function AdminProjectsView({
  nextProjects,
  previousProjects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: Props) {
  const t = useTranslations("AdminProjects");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"next" | "previous">("next");

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Modals state
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusTarget, setStatusTarget] = useState<"draft" | "archived" | "published" | null>(null);

  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [contextMenu, setContextMenu] = useState<{ project: Project; pos: { x: number; y: number } } | null>(null);

  const [pendingPublishProject, setPendingPublishProject] = useState<Project | null>(null);
  const [pendingUnpublishProject, setPendingUnpublishProject] = useState<Project | null>(null);

  const handleOpenCreateModal = (targetStatus: "draft" | "archived") => {
    setStatusTarget(targetStatus);
    setIsCreating(true);
  };

  const handleAddSubmit = (projectData: Omit<Project, "id">, imageFile: File | null) => {
    onAddProject(projectData, imageFile);
    setIsCreating(false);
  };

  const handleUpdateSubmit = (project: Project, imageFile: File | null) => {
    if (onUpdateProject) {
      onUpdateProject(project, imageFile);
    }
    setEditingProject(null);
  };

  const handlePublishToggle = (project: Project) => {
    if (project.status === "published") {
      setPendingUnpublishProject(project);
    } else {
      setPendingPublishProject(project);
    }
  };

  const executePublishToggle = (project: Project, newStatus: "draft" | "published") => {
    if (onUpdateProject) {
      onUpdateProject(
        {
          ...project,
          status: newStatus,
        },
        null
      );
    }
  };

  const handleCardClick = (project: Project, pos: { x: number; y: number }) => {
    setContextMenu({ project, pos });
  };

  const handleContextAction = (action: "show" | "edit" | "delete") => {
    if (!contextMenu) return;
    const { project } = contextMenu;
    setContextMenu(null);
    if (action === "show") setDetailProject(project);
    else if (action === "edit") setEditingProject(project);
    else setDeleteProject(project);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProject || !onDeleteProject) return;
    setIsDeletingId(deleteProject.id);
    await onDeleteProject(deleteProject.id);
    setIsDeletingId(null);
    setDeleteProject(null);
  };

  const displayedProjects = activeTab === "next" ? nextProjects : previousProjects;

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollButtons();
  }, [displayedProjects, activeTab]);

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {activeTab === "next" ? t("title") : t("titlePrevious")}
        </h1>
        <Button onClick={() => handleOpenCreateModal(activeTab === "next" ? "draft" : "archived")} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addNew")}
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {/* Project group picker */}
        <div className="flex flex-wrap gap-4 border-b border-border p-6">
          <ProjectGroup
            title="Next"
            subtitle="Projects"
            projectCount={nextProjects.length}
            selected={activeTab === "next"}
            onClick={() => {
              setActiveTab("next");
              setTimeout(() => {
                updateScrollButtons();
                scrollRef.current?.scrollTo({ left: 0 });
              }, 0);
            }}
          />
          <ProjectGroup
            title="Previous"
            subtitle="Projects"
            projectCount={previousProjects.length}
            selected={activeTab === "previous"}
            onClick={() => {
              setActiveTab("previous");
              setTimeout(() => {
                updateScrollButtons();
                scrollRef.current?.scrollTo({ left: 0 });
              }, 0);
            }}
          />
        </div>

        {/* Scrollable projects row */}
        <div className="bg-muted/30 p-6">
          {displayedProjects.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("noProjects")}</p>
          ) : (
            <div className="relative">
              {/* Left arrow */}
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>

              {/* Cards track */}
              <div
                ref={scrollRef}
                onScroll={updateScrollButtons}
                onLoad={updateScrollButtons}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
              >
                {displayedProjects.map((project) => (
                  <div key={project.id} className="snap-start shrink-0">
                    <AdminProjectCard
                      project={project}
                      onPublishToggle={handlePublishToggle}
                      onCardClick={handleCardClick}
                    />
                  </div>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronRight className="h-4 w-4 text-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isCreating && (
        <CreateProjectModal
          statusTarget={statusTarget}
          onSave={handleAddSubmit}
          onUpdate={handleUpdateSubmit}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingProject && (
        <CreateProjectModal
          initialValues={editingProject}
          onSave={handleAddSubmit}
          onUpdate={handleUpdateSubmit}
          onCancel={() => setEditingProject(null)}
        />
      )}

      {contextMenu && (
        <ProjectContextMenu
          project={contextMenu.project}
          position={contextMenu.pos}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}

      {detailProject && (
        <ProjectDetailModal
          project={detailProject}
          onClose={() => setDetailProject(null)}
          onEdit={() => { setDetailProject(null); setEditingProject(detailProject); }}
          onDelete={() => { setDetailProject(null); setDeleteProject(detailProject); }}
        />
      )}

      {deleteProject && (
        <DeleteProjectDialog
          project={deleteProject}
          isDeletingId={isDeletingId}
          onOpenChange={(open) => {
            if (!open) setDeleteProject(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {pendingPublishProject && (
        <PublishConfirmDialog
          variant="publish"
          entityType="project"
          onConfirm={() => {
            executePublishToggle(pendingPublishProject, "published");
            setPendingPublishProject(null);
          }}
          onCancel={() => setPendingPublishProject(null)}
        />
      )}

      {pendingUnpublishProject && (
        <PublishConfirmDialog
          variant="unpublish"
          entityType="project"
          onConfirm={() => {
            executePublishToggle(pendingUnpublishProject, "draft");
            setPendingUnpublishProject(null);
          }}
          onCancel={() => setPendingUnpublishProject(null)}
        />
      )}
    </div>
  );
}
