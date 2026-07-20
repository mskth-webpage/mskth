"use client";

import { LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "../i18n/navigation";
import SocialLinks from "./SocialLinks";

/**
 * Footer component that displays quick links, contact information,
 * social media links, and discreet board access.
 */
export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-14 w-full md:mt-20">
      <div className="w-full bg-footer-gradient py-10 md:py-14 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-10 px-6 sm:px-8 md:grid-cols-2 md:gap-12 lg:px-12 xl:px-16">
          {/* Left column */}
          <div className="text-left">
            <h3 className="mb-5 font-serif text-xl font-semibold uppercase tracking-wide sm:text-2xl md:mb-7 md:text-3xl lg:text-[34px]">
              {t("quick-links")}
            </h3>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2 sm:text-base md:gap-x-10">
              <ul className="space-y-2.5 md:space-y-3">
                <li className="transition-colors hover:text-primary">
                  <Link href="/events">{t("links.link2")}</Link>
                </li>

                <li className="transition-colors hover:text-primary">
                  <Link href="/aboutus">{t("links.link3")}</Link>
                </li>

                <li className="transition-colors hover:text-primary">
                  <Link href="/faq">{t("links.link5")}</Link>
                </li>
              </ul>

              <ul className="space-y-2.5 md:space-y-3">
                <li className="transition-colors hover:text-primary">
                  <Link href="/collaboration">{t("policies.link1")}</Link>
                </li>

                <li className="transition-colors hover:text-primary">
                  <Link href="/prayer-times">{t("policies.link4")}</Link>
                </li>

                <li className="transition-colors hover:text-primary">
                  <Link href="/mosques">{t("policies.link2")}</Link>
                </li>
              </ul>
            </div>

            {/* Board access */}
            <div className="mt-8 border-t border-foreground/25 pt-5">
              <Link
                href="/admin/login"
                className="group inline-flex items-center gap-2.5 font-sans text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-primary sm:text-base"
              >
                <LockKeyhole
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-foreground/70 transition-colors duration-200 group-hover:text-foreground"
                />

                <span className="relative">
                  {t("boardLogin")}

                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-200 group-hover:w-full"
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="text-left md:text-right">
            <h3 className="mb-5 font-serif text-xl font-semibold uppercase tracking-wide sm:text-2xl md:mb-7 md:text-3xl lg:text-[34px]">
              {t("message")}
            </h3>

            <div className="space-y-4 text-sm sm:text-base">
              <p>
                <a
                  href="mailto:muslimstudentskth@gmail.com"
                  className="underline transition-colors hover:text-primary"
                >
                  muslimstudentskth@gmail.com
                </a>
              </p>

              <div className="mt-3 flex justify-start gap-4 md:justify-end">
                <SocialLinks showTitle={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
