"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            <Accordion
              type="multiple"
              defaultValue={[...bulletKeys]}
              className="w-full space-y-6"
            >
              {bulletKeys.map((key) => (
                <AccordionItem key={key} value={key} className="border-0">
                  <AccordionTrigger className="py-0 hover:no-underline focus-visible:ring-0 [&>svg]:hidden">
                    <div className="flex items-start gap-3 text-left">
                      <span
                        aria-hidden
                        className="mt-0.5 text-[24px] font-semibold text-foreground"
                      >
                        &gt;
                      </span>
                      <p className="text-[14px] font-semibold text-foreground sm:text-[15px]">
                        {t(`${key}.title`)}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-7 pt-1">
                    <p className="text-[14px] leading-[1.85] text-foreground sm:text-[15px]">
                      {t(`${key}.text`)}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-10 mx-auto max-w-[1043px] text-center">
          <p className="font-brandSerif text-[16px] leading-[1.6] text-foreground sm:text-[20px] sm:leading-[1.6] lg:text-[28px] lg:leading-[1.4]">
            {t("contactIntro")}{" "}
            <span className="font-semibold text-primary">
              {t("contactHighlight")}
            </span>{" "}
            {t("contactOutro")}
          </p>
          <a
            className="mt-2 inline-block font-brandSerif text-[16px] font-semibold leading-[1.6] text-foreground underline decoration-[1.75px] underline-offset-4 sm:text-[20px] sm:leading-[1.6] lg:text-[24px] lg:leading-[1.4]"
            href={`mailto:${t("email")}`}
          >
            {t("email")}
          </a>
        </div>
      </div>
    </section>
  );
}
