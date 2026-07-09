"use client";

import { useTranslations } from "next-intl";
import SocialLinks from "./SocialLinks";
import { Link } from "../i18n/navigation";

/**
 * Footer component that displays quick links, contact information, and social media links.
 */
export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full mt-14 md:mt-20">
      <div className="w-full bg-footer-gradient py-10 md:py-14 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-10 px-6 sm:px-8 md:grid-cols-2 md:gap-12 lg:px-12 xl:px-16">
          {/* LEFT COLUMN — QUICK LINKS */}
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
          </div>

          {/* RIGHT COLUMN — STAY CONNECTED */}
          <div className="text-left md:text-right">
            <h3 className="mb-5 font-serif text-xl font-semibold uppercase tracking-wide sm:text-2xl md:mb-7 md:text-3xl lg:text-[34px]">
              {t("message")}
            </h3>

            <div className="space-y-4 text-sm sm:text-base">
              <p>
                <Link
                  href="mailto:muslimstudentskth@gmail.com"
                  target="_blank"
                  className="underline transition-colors hover:text-primary"
                >
                  muslimstudentskth@gmail.com
                </Link>
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