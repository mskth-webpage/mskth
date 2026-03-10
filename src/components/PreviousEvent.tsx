"use client"
import { useTranslations } from "next-intl";
import Event from "./Event"
import YearToggle from "./YearToggle";

export default function PreviousEvent () {
    const t = useTranslations("Events");
    return (
        <div className="flex flex-col items-center ">
            <h2 className="font-serif text-[64px] leading-[42px] font-bold tracking-[0] mb-[131px]">
                {t("previous.title")}
            </h2>
            <p className="font-serif text-[40px] leading-[40px] font-normal tracking-[0] mb-[177px]">
                {t("previous.description")}
            </p>
            <YearToggle   
                years={[2025, 2024, 2023]}
                onChange={(year) => console.log(year)}
            />
            <div className="flex justify-center gap-4">
                <Event title={t("previous.card1.name")} description={t("previous.card1.description")}/>
                <Event title={t("previous.card2.name")} description={t("previous.card2.description")}/>
                <Event title={t("previous.card3.name")} description={t("previous.card3.description")}/>
            </div>
        </div>
    )
}