"use client";

import { Users, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Project } from "@/view/admin/project/AdminProjectsView";

const MSKTH_LOGO = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/images/MSkth.png`;

type Props = {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProjectDetailModal({ project, onClose, onEdit, onDelete }: Props) {
  const t = useTranslations("AdminUpcomingEvents");
  const isPublished = project.status === "published";

  const isDefault = !project.image_url || project.image_url.includes("MSkth.png");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={isDefault ? MSKTH_LOGO : project.image_url!}
            alt={project.title}
            fill
            className={isDefault ? "object-contain p-6 opacity-40" : "object-cover"}
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{project.title}</h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                <span>{project.group_label}: {project.members}</span>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {isPublished ? t("statusPublished") : t("statusDraft")}
            </span>
          </div>

          {project.description && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">
                {project.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
          <Button variant="outline" onClick={onEdit}>
            {t("edit")}
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
