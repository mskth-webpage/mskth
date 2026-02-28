"use client"
import { useTranslations } from "next-intl";
import Event from "./Event"
import YearToggle from "./YearToggle";

export default function PreviousEvent () {
    const t = useTranslations("Events");
    return (
        <>
            <YearToggle   
                years={[2025, 2024, 2023]}
                onChange={(year) => console.log(year)}
            />
            <div className="flex justify-center gap-4">
                <Event title={t("previous.name")} description={t("previous.description")}/>
                <Event title={t("previous.name")} description={t("previous.description")}/>
                <Event title={t("previous.name")} description={t("previous.description")}/>
            </div>
        </>
    )
}