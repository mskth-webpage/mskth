"use client";

import { useTranslations } from "next-intl";
import AboutHeader from "@/components/AboutHeader";

export default function AboutUsView() {
  const t = useTranslations("AboutUs");

  return (
    <main className="mx-auto max-w-[980px] px-5 pb-20 pt-10 sm:px-8 lg:pb-28 lg:pt-16">
      <h1 className="font-serif text-[28px] font-semibold uppercase tracking-wide text-foreground sm:text-[32px] lg:text-[36px]">
        {t("title")}
      </h1>
      <AboutHeader
        title={t("title")}
        description={t("description")}
      />
    </main>
  );
}

