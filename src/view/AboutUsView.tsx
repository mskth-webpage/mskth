"use client";
import { useTranslations } from "next-intl";
import AboutHeader from "@/components/AboutHeader";
import OurStorySection from "@/components/OurStorySection";
import TeamMemberCard from "@/components/TeamMemberCard";
import ProjectCard from "@/components/ProjectCard";
import type {PublicBoardMember} from '@/types/adminBoardMembers';

type Props = {
  boardMembers: PublicBoardMember[];
  isLoading: boolean;
  error?: Error;
}

export default function AboutUsView({ boardMembers, isLoading, error }: Props) {
  const t = useTranslations("AboutUs");
  const teamT = useTranslations("AboutUs.team");
  const projectT = useTranslations("AboutUs.projects");
  return (
    <>
      <main className="mx-auto max-w-[980px] px-5 pb-20 pt-10 sm:px-8 lg:pb-28 lg:pt-16">
        <AboutHeader title={t("title")} description={t("description")} />
      </main>
      <OurStorySection/>

      {/* Team section */}

      <section className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-foreground">
          {teamT("heading")}
        </h2>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"> 
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-xl bg-muted"/>
              ))}
            </div>
          ) : error ? (
          <p className="text-center text-muted-foreground">{teamT('error')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {boardMembers.map((member) => (
                <TeamMemberCard
                  key={member.id} 
                  name={member.name}
                  role_eng={member.role_eng}
                  role_sv={member.role_sv}
                  email={member.email}
                  imageUrl={member.image_url ?? undefined}
                  story_eng={member.story_eng ?? undefined}
                  story_sv={member.story_sv ?? undefined}
                /> ))}
            </div>
          )}
      </section>

      {/* Project section */}

      <section className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-foreground">
          {projectT("heading")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-8 justify-items-center">
          <ProjectCard
            name={projectT("project.name")}
            description={projectT("project.description")}
            project_group_label={projectT("labels.project_group")}
            project_members={projectT("project.project_members")}
          />
          <ProjectCard
            name={projectT("project.name")}
            description={projectT("project.description")}
            project_group_label={projectT("labels.project_group")}
            project_members={projectT("project.project_members")}
          />
          <ProjectCard
            name={projectT("project.name")}
            description={projectT("project.description")}
            project_group_label={projectT("labels.project_group")}
            project_members={projectT("project.project_members")}
          />
        </div>
      </section>
    </>
  );
}
