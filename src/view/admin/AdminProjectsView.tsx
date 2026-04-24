"use client";

import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";

export type Project = {
  id: string;
  name: string;
  description: string;
  project_group_label: string;
  project_members: string;
  imageUrl?: string;
};

type Props = {
  projects: Project[];
};

export default function AdminProjectsView({ projects }: Props) {
  return (
    <section className="w-full p-6 sm:p-8 lg:p-12 lg:pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
        <h2 className="text-2xl font-serif font-medium text-foreground tracking-wide">
          Create next project
        </h2>
        <Button
          variant="outline"
          className="rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-wider border-blue-400 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
        >
          Add New
        </Button>
      </div>

      <div className="flex flex-wrap gap-10 md:gap-14 justify-center sm:justify-start">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
            project_group_label={project.project_group_label}
            project_members={project.project_members}
            imageUrl={project.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}
