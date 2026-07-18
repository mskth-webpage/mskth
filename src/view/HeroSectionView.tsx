"use client";

import { useTranslations } from "next-intl";

export default function HomePageView() {
  const t = useTranslations("Hero-section");

  return (
    <section className="relative mt-24 overflow-hidden sm:mt-32 lg:mt-[167px]">
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-[62px]">
        <div className="flex flex-col">
          <div className="w-full lg:w-fit">
            <h1 className="font-[Nanum_Myeongjo] text-[40px] font-bold leading-[0.95] tracking-[-0.0425em] text-foreground sm:text-[52px] lg:text-[64px]">
              {t("title")}
            </h1>

            <h2 className="mt-6 font-[Nanum_Myeongjo] text-[40px] font-bold leading-[0.95] tracking-[-0.0425em] text-foreground sm:mt-8 sm:text-[52px] lg:mt-[35px] lg:text-[64px]">
              {t("subtitle")}
            </h2>
          </div>

          <p className="mt-8 max-w-[643px] font-[Nanum_Myeongjo] text-[18px] font-normal leading-8 text-foreground sm:text-[21px] sm:leading-9 lg:mt-[35px] lg:text-[24px] lg:leading-[40px]">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}