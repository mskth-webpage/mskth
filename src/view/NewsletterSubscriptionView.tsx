"use client";

import { useTranslations } from "next-intl";

type NewsletterSubscriptionViewProps = {
  addSubscription: (formData: FormData) => Promise<void>;
};

export default function NewsletterSubscriptionView({
  addSubscription,
}: NewsletterSubscriptionViewProps) {
  const t = useTranslations("HomePage");

  return (
    <section className="relative w-full bg-background">
      <div className="mx-auto max-w-300 px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="text-center font-serif text-[26px] font-semibold uppercase tracking-wide text-foreground sm:text-[32px]">
          {t("newsletter.title")}
        </h2>
        <form
          action={addSubscription}
          className="mx-auto mt-6 flex w-full max-w-130 items-stretch gap-2"
        >
          <input
            type="text"
            name="name"
            placeholder={t("newsletter.namePlaceholder")}
            className="h-11 w-full rounded-sm border border-border bg-(--blue-soft-1) px-4 text-[12px] text-foreground placeholder:text-foreground focus:outline-none"
            aria-label={t("newsletter.nameAria")}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={t("newsletter.emailPlaceholder")}
            className="h-11 w-full rounded-sm border border-border bg-(--blue-soft-1) px-4 text-[12px] text-foreground placeholder:text-foreground focus:outline-none"
            aria-label={t("newsletter.emailAria")}
            required
          />
          <button
            type="submit"
            className="h-11 rounded-sm border border-border bg-(--blue-soft-2) px-5 text-[11px] font-semibold uppercase tracking-wide text-foreground"
          >
            {t("newsletter.button")}
          </button>
        </form>
        <p className="mt-3 text-center text-[12px] text-foreground">
          {t("newsletter.helper")}
        </p>
      </div>
    </section>
  );
}
