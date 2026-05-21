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
  const t = useTranslations("AdminProjects");
  const isPublished = project.status === "published";
  const isArchived = project.status === "archived";
  const statusLabel = isArchived ? t("statusArchived") : isPublished ? t("statusPublished") : t("statusDraft");

  const isDefault = !project.image_url || project.image_url.includes("MSkth.png");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={isDefault ? MSKTH_LOGO : project.image_url!}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={isDefault ? "object-contain p-6 opacity-40" : "object-cover"}
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-primary-foreground">
            {statusLabel}
          </span>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground">{project.title}</h2>

          <div className="mt-4 space-y-3">
            {/* Members */}
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-foreground">
                <span className="font-medium">{project.group_label}:</span> {project.members}
              </p>
            </div>

            {/* Description */}
            {project.description && (
              <div className="mt-2 rounded-lg bg-muted/50 p-3">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              {t("contextMenuDelete")}
            </Button>
            <Button size="sm" onClick={onEdit}>
              {t("contextMenuEdit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
