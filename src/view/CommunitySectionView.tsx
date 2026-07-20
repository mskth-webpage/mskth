"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function CommunitySectionView() {
  const t = useTranslations("HomePage.community");

  return (
    <section className="relative overflow-hidden bg-community-gradient text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24 lg:px-[62px] lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-20">
          {/* Text content */}
          <div className="relative z-10 w-full max-w-[540px]">
            <h2 className="max-w-[520px] font-serif text-[32px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[38px] lg:text-[42px]">
              {t("title")}
            </h2>

            <p className="mt-7 max-w-[510px] font-serif text-[17px] font-normal leading-[1.8] text-foreground/85 sm:text-[18px] sm:leading-[1.9] lg:mt-8 lg:text-[20px]">
              {t("text")}
            </p>

            <Link
              href="/join"
              className="group mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-primary bg-card px-7 font-serif text-[16px] font-bold text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-lg sm:min-w-[245px] lg:mt-10"
            >
              <span>{t("button")}</span>

              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* Image composition */}
          <div className="relative isolate mx-auto w-full max-w-[560px] py-10 lg:mx-0 lg:ml-auto">
            <div
              aria-hidden="true"
              className="absolute -left-5 top-2 z-0 h-[66%] w-[70%] rotate-[-7deg] rounded-[42%_58%_50%_50%/44%_40%_60%_56%] bg-primary/25 sm:-left-8"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-1 -right-5 z-0 h-[58%] w-[68%] rotate-[8deg] rounded-[58%_42%_46%_54%/55%_58%_42%_45%] bg-primary/40 sm:-right-8"
            />

            <div className="relative z-10 overflow-hidden rounded-[180px_180px_48px_48px] border border-white/40 bg-card shadow-[0_24px_70px_rgba(7,107,173,0.18)] sm:rounded-[240px_240px_56px_56px]">
              <div className="aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
                <img
                  src="/herosection.jpg"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}