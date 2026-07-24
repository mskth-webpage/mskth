"use client";

import { useTranslations } from "next-intl";

export default function HomePageView() {
  const t = useTranslations("Hero-section");

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-4 sm:px-10 sm:pb-24 lg:px-[62px] lg:pb-32 lg:pt-14">
        <div className="flex max-w-[900px] flex-col">
          <div className="w-full">
            <h1 className="font-sans text-[40px] font-bold leading-[0.98] tracking-[-0.0425em] text-foreground sm:text-[52px] lg:text-[64px]">
              {t("title")}
            </h1>

            <h2 className="mt-6 font-sans text-[40px] font-bold leading-[0.98] tracking-[-0.0425em] text-foreground sm:mt-8 sm:text-[52px] lg:mt-[35px] lg:text-[64px]">
              {t("subtitle")}
            </h2>
          </div>

          <p className="mt-8 max-w-[643px] font-sans text-[18px] font-normal leading-8 text-foreground sm:text-[21px] sm:leading-9 lg:mt-[35px] lg:text-[24px] lg:leading-[40px]">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}