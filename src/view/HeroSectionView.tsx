"use client";

import { useTranslations } from "next-intl";

export default function HomePageView() {
  const t = useTranslations("Hero-section");

  return (
    <section className="relative overflow-hidden mt-[167px]">
      <div className="max-w-6xl px-[62px]">
        <div className="flex flex-col">
          <div className="w-fit">
            <h1 className="font-[Nanum_Myeongjo] text-[64px] leading-[0.9] tracking-[-0.0425em] font-bold text-[#1E2939]">
              {t("title")}
            </h1>
            <h2 className="mt-[35px] font-[Nanum_Myeongjo] text-[64px] leading-[0.9] tracking-[-0.0425em] font-bold text-[#1E2939] text-center">
              {t("subtitle")}
            </h2>
          </div>
          <p className="mt-[35px] max-w-[643px] font-[Nanum_Myeongjo] text-[24px] leading-[40px] font-normal text-black">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}