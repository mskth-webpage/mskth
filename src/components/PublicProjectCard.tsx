"use client";

import { Users } from "lucide-react";
import ContentCard from "@/components/admin/ContentCard";
import type { Project } from "@/view/admin/project/AdminProjectsView";

type Props = { project: Project };

/**
 * Public-facing project card.
 * Displays the project image, title, description, and group members.
 */
export default function PublicProjectCard({ project }: Props) {
  const meta = [
    { 
      icon: <Users className="h-3 w-3 shrink-0" />, 
      label: `${project.group_label}: ${project.members}` 
    },
  ];

  return (
    <ContentCard
      className="w-full max-w-[340px]"
      header={{
        type: "image",
        src: project.image_url || null,
        alt: project.title,
      }}
      title={project.title}
      description={project.description || undefined}
      meta={meta}
    />
  );
}
