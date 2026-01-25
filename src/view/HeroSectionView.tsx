"use client";

import { useTranslations } from "next-intl";

export default function HomePageView() {
  const t = useTranslations("Hero-section");

  return (
    <section className="relative overflow-hidden">
     <div className="max-w-6xl pl-18 pr-6 pt-2 pb-2">
        <div className="py-12 sm:py-16 lg:py-10">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-blue-brand leading-tight">
              {t("title")}
            </h1>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mt-2 leading-tight">
              {t("subtitle")}
            </h1>
          </div>
          <p className="mt-4 max-w-[520px] text-[14px] leading-[1.8] text-muted-foreground sm:text-[15px]">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
