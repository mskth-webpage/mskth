"use client";

import { useTranslations } from 'next-intl';


export default function NewsletterSubscriptionView() {
    const t = useTranslations("HomePage");
  return (
    <section className="relative w-full bg-background">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:py-20">
            <h2 className="text-center font-serif text-[26px] font-semibold uppercase tracking-wide text-foreground sm:text-[32px]">
            {t("newsletter.title")}
            </h2>
            <div className="mx-auto mt-6 flex w-full max-w-[520px] items-stretch overflow-hidden rounded-sm border border-border shadow-[0_6px_18px_rgba(15,63,116,0.08)]">
            <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="h-11 w-full border-0 bg-(--blue-soft-1) px-4 text-[12px] text-foreground placeholder:text-foreground focus:outline-none"
                aria-label={t("newsletter.aria")}
            />
            <button
                type="button"
                className="h-11 border-l border-border bg-(--blue-soft-2) px-5 text-[11px] font-semibold uppercase tracking-wide text-foreground"
            >
                {t("newsletter.button")}
            </button>
            </div>
            <p className="mt-3 text-center text-[12px] text-foreground">
            {t("newsletter.helper")}
            </p>
        </div>
    </section>
  )
}
