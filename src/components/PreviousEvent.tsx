import { useTranslations } from "next-intl";
import { useState } from "react";

export default function PreviousEvent () {
    const t = useTranslations("Events");
    return (
        <>
            <YearToggle   
                years={[2025, 2024, 2023]}
                onChange={(year) => console.log(year)}
            />
            <div className="flex justify-center gap-4">
                <Event title={"EVENTNAME"} description={""}/>
                <Event title={"EVENTNAME"} description={""}/>
                <Event title={"EVENTNAME"} description={""}/>
            </div>
        </>
    )
}

function Event({ title, description }: { title: String, description: String }) {
  return (
    <div
      className="flex h-[325px] w-[325px] items-center justify-center rounded-full bg-cover bg-center"
      style={{ backgroundImage: "url('/Checker.png')" }}
    >
    <p className="
        font-serif
        font-bold
        text-[36px]
        leading-[52px]
        tracking-normal
        underline
        decoration-solid
        underline-offset-auto
    ">
        {title}
    </p>
    </div>
  )
}

type YearToggleProps = {
    years: number[];
    value?: number;
    onChange?: (year: number) => void;
}

function YearToggle({ years, value, onChange }: YearToggleProps) {
    const [internal, setInternal] = useState(years[0]);
    const selected = value ?? internal;

    function setYear(y: number) {
        onChange?.(y);
        if (value === undefined) {
            setInternal(y);
        }
    }
    return (
        <div className="flex items-center justify-center gap-[155px] mb-[131px]">
            {years.map((y) => {
                const active = y === selected;
                return (
                    <button
                        key={y}
                        type="button"
                        onClick={() => setYear(y)}
                        className={[
                            "font-serif font-bold text-[64px] leading-[42px] tracking-normal",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
                            active ? "underline decoration-3 decoration-solid" : "no-underline",
                        ].join(" ")}
                    >
                        {y}
                    </button>
                );
            })}
        </div>
    );
}
