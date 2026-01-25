"use client";

import { useTranslations } from "next-intl";

const bulletKeys = [
  "talentedIndividuals",
  "communityEngagement",
  "monthlyEvents",
  "onlinePresence",
] as const;

export default function CollaborationView() {
  const t = useTranslations("Collaboration");

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[980px] px-5 sm:px-8 pt-10 pb-20 lg:pt-16 lg:pb-28">
        <h1 className="font-serif text-[28px] font-semibold uppercase tracking-wide text-foreground sm:text-[32px] lg:text-[36px]">
          {t("title")}
        </h1>

        <div className="mt-10 space-y-12">
          <div className="space-y-4">
            <h2 className="font-serif text-[20px] font-semibold text-foreground sm:text-[22px] lg:text-[24px]">
              {t("whoTitle")}
            </h2>
            <p className="text-[14px] leading-[1.85] text-foreground sm:text-[15px]">
              {t("whoText")}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-[20px] font-semibold text-foreground sm:text-[22px] lg:text-[24px]">
              {t("whyTitle")}
            </h2>
            <p className="text-[14px] leading-[1.85] text-foreground sm:text-[15px]">
              {t("whyIntro")}
            </p>
            <ul className="space-y-6">
              {bulletKeys.map((key) => (
                <li key={key} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1 text-[18px] font-semibold text-blue-brand"
                  >
                    &gt;
                  </span>
                  <div className="space-y-1">
                    <p className="text-[14px] font-semibold text-foreground sm:text-[15px]">
                      {t(`${key}.title`)}
                    </p>
                    <p className="text-[14px] leading-[1.85] text-foreground sm:text-[15px]">
                      {t(`${key}.text`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-[14px] leading-[1.9] text-foreground sm:text-[15px]">
          {t("contactIntro")}{" "}
          <span className="font-semibold text-blue-brand">
            {t("contactHighlight")}
          </span>{" "}
          {t("contactOutro")}{" "}
          <a
            className="font-semibold underline decoration-[1.5px] underline-offset-4"
            href={`mailto:${t("email")}`}
          >
            {t("email")}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
