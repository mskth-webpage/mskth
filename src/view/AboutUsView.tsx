"use client";

import { useTranslations } from "next-intl";
import AboutHeader from "@/components/AboutHeader";
import OurStorySection from "@/components/OurStorySection";
import TeamMemberCard from "@/components/TeamMemberCard";

export default function AboutUsView() {
  const t = useTranslations("AboutUs");
  const teamT = useTranslations("AboutUs.team");

  return (
    <>
      <main className="mx-auto max-w-[980px] px-5 pb-20 pt-10 sm:px-8 lg:pb-28 lg:pt-16">
        <h1 className="font-serif text-[28px] font-semibold uppercase tracking-wide text-foreground sm:text-[32px] lg:text-[36px]">
          {t("title")}
        </h1>

        <AboutHeader title={t("title")} description={t("description")} />
      </main>

      <OurStorySection/>

      {/* Team section */}
      <section className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8">
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-foreground">
          {teamT("heading")}
        </h2>

        {/* 4x3 grid on large screen, 3x4 on medium and 10x1 on mobile, chenge to 2x5 if too big */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />   

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />

        <TeamMemberCard
          name={teamT("member.name")}
          role={teamT("member.role")}
          email={teamT("member.email")}
        />
             
        </div>
      </section>
    </>
  );
}
