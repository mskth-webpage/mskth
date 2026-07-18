"use client";

import { Users } from "lucide-react";
import ContentCard from "@/components/admin/ContentCard";
import type { Project } from "@/view/admin/project/AdminProjectsView";
import Link from "next/link";
import { useLocale } from "next-intl";

type Props = { project: Project };

/**
 * Public-facing project card.
 * Displays the project image, title, description, and group members.
 * Opens the dedicated project page in a new tab.
 */
export default function PublicProjectCard({ project }: Props) {
  const locale = useLocale();

  const meta = [
    { 
      icon: <Users className="h-3 w-3 shrink-0" />, 
      label: project.group_label
    },
  ];

  return (
    <Link 
      href={`/${locale}/projects/${project.id}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block w-full max-w-[340px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-[2rem]"
    >
      <ContentCard
        className="w-full h-full cursor-pointer transition-transform hover:scale-[1.02]"
        header={{
          type: "image",
          src: project.image_url || null,
          alt: project.title,
        }}
        title={project.title}
        description={project.description || undefined}
        meta={meta}
      />
    </Link>
  );
}
