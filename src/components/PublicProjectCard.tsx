"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import ContentCard from "@/components/admin/ContentCard";
import PublicProjectDetailModal from "@/components/PublicProjectDetailModal";
import type { Project } from "@/view/admin/project/AdminProjectsView";

type Props = { project: Project };

/**
 * Public-facing project card.
 * Displays the project image, title, description, and group members.
 */
export default function PublicProjectCard({ project }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const meta = [
    { 
      icon: <Users className="h-3 w-3 shrink-0" />, 
      label: project.group_label
    },
  ];

  return (
    <>
      <ContentCard
        className="w-full max-w-[340px] cursor-pointer transition-transform hover:scale-[1.02]"
      header={{
        type: "image",
        src: project.image_url || null,
        alt: project.title,
      }}
      title={project.title}
      description={project.description || undefined}
      meta={meta}
      onClick={() => setIsOpen(true)}
    />
    {isOpen && (
      <PublicProjectDetailModal project={project} onClose={() => setIsOpen(false)} />
    )}
    </>
  );
}
