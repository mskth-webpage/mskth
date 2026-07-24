"use client";
import { useTranslations } from "next-intl";
import AboutHeader from "@/components/AboutHeader";
import OurStorySection from "@/components/OurStorySection";
import TeamMemberCard from "@/components/TeamMemberCard";
import PublicProjectCard from "@/components/PublicProjectCard";
import ProjectGroupCard from "@/components/admin/projectgroup/ProjectGroupCard";
import type {PublicBoardMember} from '@/types/adminBoardMembers';
import type { Project } from "@/view/admin/project/AdminProjectsView";
import type { PublicProjectGroup } from "@/types/projectGroups";

type Props = {
  boardMembers: PublicBoardMember[];
  isLoadingBoard: boolean;
  boardError?: Error;
  projectGroups: PublicProjectGroup[];
  isLoadingProjectGroups: boolean;
  projects: Project[];
  isLoadingProjects: boolean;
};

export default function AboutUsView({ boardMembers, isLoadingBoard, boardError, projectGroups, isLoadingProjectGroups, projects, isLoadingProjects }: Props) {
  const t = useTranslations("AboutUs");
  const teamT = useTranslations("AboutUs.team");
  const projectT = useTranslations("AboutUs.projects");
  const projectGroupsT = useTranslations("AboutUs.projectGroups");
  return (
    <>
      <main className="mx-auto max-w-[980px] px-5 pb-12 pt-4 sm:px-8 lg:pb-16 lg:pt-6">
        <AboutHeader title={t("title")} description={t("description")} />
      </main>
      <OurStorySection/>

      {/* Team section */}

      <section className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-foreground">
          {teamT("heading")}
        </h2>

          {isLoadingBoard ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"> 
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-xl bg-muted"/>
              ))}
            </div>
          ) : boardError ? (
          <p className="text-center text-muted-foreground">{teamT('error')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {boardMembers.map((member) => (
                <TeamMemberCard
                  key={member.id} 
                  name={member.name}
                  role={member.role}
                  email={member.email}
                  imageUrl={member.image_url ?? undefined}
                /> ))}
            </div>
          )}
      </section>

      {/* Project Groups section */}

      <section className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-foreground">
          {projectGroupsT("heading")}
        </h2>

          {isLoadingProjectGroups ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 justify-items-center"> 
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-72 w-full max-w-[280px] animate-pulse rounded-xl bg-muted"/>
              ))}
            </div>
          ) : projectGroups.length === 0 ? (
            <p className="text-center text-muted-foreground">{projectT('empty')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {projectGroups.map((group) => (
                <ProjectGroupCard
                  key={group.id} 
                  name={group.name}
                  description={group.description}
                  contact_email={group.contact_email}
                  imageUrl={group.image_url ?? undefined}
                  isAdmin={false}
                /> ))}
            </div>
          )}
      </section>

      {/* Project section */}

      <section className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-foreground">
          {projectT("heading")}
        </h2>
        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">{projectT("empty")}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {projects.map((project) => (
              <PublicProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
