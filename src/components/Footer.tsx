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
    <footer className="w-full mt-20">
      <div className="w-full bg-footer-gradient pt-12 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          
          {/* LEFT COLUMN — QUICK LINKS */}
          <div className="text-left">
            <h3 className="text-5xl md:text-4xl font-serif font-semibold tracking-wide mb-8 uppercase">
              {t("quick-links")}
            </h3>

            <div className="grid grid-cols-2 gap-6 text-base">
              <ul className="space-y-3">
                <li className="hover:text-primary">
                  <Link href="/events">{t("links.link2")}</Link>
                </li>
                <li className="hover:text-primary">
                  <Link href="/aboutus">{t("links.link3")}</Link>
                </li>
                <li className="hover:text-primary">
                  <Link href="/faq">{t("links.link5")}</Link>
                </li>
              </ul>

              <ul className="space-y-3">
                <li className="hover:text-primary">
                  <Link href="/collaboration">{t("policies.link1")}</Link>
                </li>
                <li className="hover:text-primary">
                  <Link href="/prayer-times">{t("policies.link4")}</Link>
                </li>
                <li className="hover:text-primary">
                  <Link href="/mosques">{t("policies.link2")}</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN — STAY CONNECTED */}
          <div className="text-center md:text-right">
            <h3 className="text-3xl md:text-3xl font-serif font-semibold tracking-wide mb-6 uppercase">
              {t("message")}
            </h3>

            <div className="space-y-4 text-base">
              <p>
                <Link
                  href="mailto:muslimstudentskth@gmail.com"
                  target="_blank"
                  className="underline hover:text-primary"
                >
                  muslimstudentskth@gmail.com
                </Link>
              </p>

              <div className="flex justify-center md:justify-end gap-4 mt-2">
                <SocialLinks showTitle={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
