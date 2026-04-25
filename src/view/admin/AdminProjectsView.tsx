"use client";

import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { useTranslations } from "next-intl";

export type Project = {
  id: string;
  name: string;
  description: string;
  project_group_label: string;
  project_members: string;
  imageUrl?: string;
};

type Props = {
  nextProjects: Project[];
  previousProjects: Project[];
};

export default function AdminProjectsView({ nextProjects, previousProjects }: Props) {
  const t = useTranslations("AdminProjects");

  return (
    <section className="w-full p-6 sm:p-8 lg:p-12 lg:pt-10 max-w-[1200px] mx-auto">
      {/* Create next project section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-6">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-wide">
          {t("title")}
        </h2>
        <Button
          variant="outline"
          className="rounded-xl px-4 py-2 text-sm font-medium border-blue-400 text-foreground hover:bg-blue-50 transition-colors shadow-sm"
        >
          {t("addNew")}
        </Button>
      </div>

      <div className="bg-[#759EBE] rounded-xl p-8 mb-6">
        <div className="flex flex-wrap gap-10 md:gap-14 justify-center sm:justify-start">
          {nextProjects.map((project) => (
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
      </div>

      <div className="flex justify-between mb-16">
        <Button
          variant="outline"
          className="rounded-xl px-8 py-2 text-foreground border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {t("save")}
        </Button>
        <Button
          variant="outline"
          className="rounded-xl px-8 py-2 text-foreground border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {t("publish")}
        </Button>
      </div>

      {/* Create previous project section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-6">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-wide">
          {t("titlePrevious")}
        </h2>
      </div>

      <div className="bg-[#759EBE] rounded-xl p-8 mb-6">
        <div className="flex flex-wrap gap-10 md:gap-14 justify-center sm:justify-start">
          {previousProjects.map((project) => (
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
      </div>

      <div className="flex justify-between mb-16">
        <Button
          variant="outline"
          className="rounded-xl px-8 py-2 text-foreground border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {t("save")}
        </Button>
        <Button
          variant="outline"
          className="rounded-xl px-8 py-2 text-foreground border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {t("publish")}
        </Button>
      </div>
    </section>
  );
}
