"use client"
import { useTranslations } from "next-intl";
import Event from "./Event";
import YearToggle from "./YearToggle";

export default function PreviousEvent() {
  const t = useTranslations("Events");

  return (
    <section className="flex flex-col items-center px-4 md:px-0">
      {/* TITLE */}
      <h2 className="font-serif font-bold text-[24px] leading-[42px] tracking-[0] md:text-[64px] md:leading-[42px] md:mb-[61px]">
        {t("previous.title")}
      </h2>

      {/* DESCRIPTION */}
      <p className="font-serif font-normal text-[13px] leading-[40px] tracking-[0] mb-[11px] md:text-[40px] md:leading-[40px] md:mb-[131px]">
        {t("previous.description")}
      </p>

      {/* YEAR TOGGLE */}
       <YearToggle
         years={[2025, 2024, 2023]}
         onChange={(year) => console.log(year)}
       />

      {/* EVENT CARDS */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
        <Event
          title={t("previous.card1.name")}
          description={t("previous.card1.description")}
        />
        <Event
          title={t("previous.card2.name")}
          description={t("previous.card2.description")}
        />
        <Event
          title={t("previous.card3.name")}
          description={t("previous.card3.description")}
        />
      </div>
    </section>
  );
}