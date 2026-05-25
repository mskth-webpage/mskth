"use client";

import { Users, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ContentCard from "@/components/admin/ContentCard";
import type { Project } from "@/view/admin/project/AdminProjectsView";

type Props = {
  project: Project;
  onPublishToggle: (project: Project) => void;
  onCardClick: (project: Project, pos: { x: number; y: number }) => void;
};

export default function AdminProjectCard({ project, onPublishToggle, onCardClick }: Props) {
  const t = useTranslations("AdminProjects");
  const isPublished = project.status === "published";
  const isArchived = project.status === "archived";

  const meta = [
    { 
      icon: <Users className="h-3 w-3 shrink-0" />, 
      label: `${project.group_label}: ${project.members}` 
    },
  ];

  return (
    <ContentCard
      header={{
        type: "image",
        src: project.image_url || null,
        alt: project.title,
        statusLabel: isArchived ? t("statusArchived") : isPublished ? t("statusPublished") : t("statusDraft"),
        statusVariant: isArchived ? "muted" : isPublished ? "success" : "warning",
      }}
      title={project.title}
      description={project.description || undefined}
      meta={meta}
      onClick={(e) => onCardClick(project, { x: e.clientX, y: e.clientY })}
      actions={
        <>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={(e) => onCardClick(project, { x: e.clientX, y: e.clientY })}
          >
            <MoreVertical className="h-3 w-3" />
            {t("options")}
          </Button>
          <Button
            size="sm"
            variant={isPublished ? "outline" : "default"}
            className="rounded-full text-xs"
            onClick={() => onPublishToggle(project)}
          >
            {isPublished ? t("unpublishAction") : t("publishAction")}
          </Button>
        </>
      }
    />
  );
}
