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
        <h2 className="mb-10 font-serif text-3xl font-semibold text-foreground">
          {teamT("heading")}
        </h2>

        {/* 4x3 grid on medium/large screens, 2x5 on mobile and 3x4 on small screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center">
        
        <TeamMemberCard
          name={teamT("president.name")}
          role={teamT("president.role")}
          email={teamT("president.email")}
        />

        <TeamMemberCard
          name={teamT("vice_president.name")}
          role={teamT("vice_president.role")}
          email={teamT("vice_president.email")}
        />

        <TeamMemberCard
          name={teamT("business.name")}
          role={teamT("business.role")}
          email={teamT("business.email")}
        />

        <TeamMemberCard
          name={teamT("secretary.name")}
          role={teamT("secretary.role")}
          email={teamT("secretary.email")}
        />

        <TeamMemberCard
          name={teamT("events_sister.name")}
          role={teamT("events_sister.role")}
          email={teamT("events_sister.email")}
        />

        <TeamMemberCard
          name={teamT("events_brother.name")}
          role={teamT("events_brother.role")}
          email={teamT("events_brother.email")}
        />

        <TeamMemberCard
          name={teamT("treasurer.name")}
          role={teamT("treasurer.role")}
          email={teamT("treasurer.email")}
        />

        <TeamMemberCard
          name={teamT("pr.name")}
          role={teamT("pr.role")}
          email={teamT("pr.email")}
        />

        <TeamMemberCard
          name={teamT("media.name")}
          role={teamT("media.role")}
          email={teamT("media.email")}
        />

        <TeamMemberCard
          name={teamT("it.name")}
          role={teamT("it.role")}
          email={teamT("it.email")}
        />
        </div>
      </section>
    </>
  );
}
