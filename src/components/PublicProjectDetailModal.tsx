"use client";

import { X, Users } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/view/admin/project/AdminProjectsView";

type Props = {
  project: Project;
  onClose: () => void;
};

const MSKTH_LOGO = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/images/MSkth.png`;

export default function PublicProjectDetailModal({ project, onClose }: Props) {
  const isDefault = !project.image_url || project.image_url.includes("MSkth.png");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 w-full shrink-0 bg-muted">
          <Image
            src={isDefault ? MSKTH_LOGO : project.image_url!}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={isDefault ? "object-contain p-6 opacity-40" : "object-cover"}
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/80 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm">
              <Users className="h-3 w-3 shrink-0" />
              {project.group_label}
            </span>
          </div>

          <h2 className="mb-2 font-serif text-3xl font-semibold text-foreground">
            {project.title}
          </h2>

          <p className="text-sm font-medium text-muted-foreground mb-6">
            {project.description}
          </p>

          {project.content && (
            <div className="mt-6 pt-6 border-t border-border text-foreground/90 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
              {project.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
