"use client";

import Logo from "./Logo";
import { Button } from "./ui/button";
import { Link, usePathname } from "../i18n/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import LocaleSwitcher from "./LocaleSwitcher";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full bg-background z-40">
      <div className="mx-auto max-w-[1800px] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* LINKS */}
        <nav className="flex-1 flex justify-center">
          <div className="bg-background/95 backdrop-blur-md border rounded-full px-8 sm:px-16 lg:px-24 py-2 flex gap-6 sm:gap-8 lg:gap-12 shadow-sm">
            <Button asChild variant="ghost" className={pathname === "/events" ? "font-semibold" : ""}>
              <Link href="/events">{t("events")}</Link>
            </Button>

            <Button asChild variant="ghost" className={pathname === "/collaboration" ? "font-semibold" : ""}>
              <Link href="/collaboration">{t("collaboration")}</Link>
            </Button>

            <Button asChild variant="ghost" className={pathname === "/about" ? "font-semibold" : ""}>
              <Link href="/about">{t("aboutus")}</Link>
            </Button>
          </div>
        </nav>

        {/* ACTIONS */}
        <div className="flex-shrink-0 flex items-center gap-2 ml-4">
          <Button 
            asChild 
            variant="ghost" 
            className="rounded-full bg-color-mskth-blue hover:bg-color-mskth-blue/90 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] transition-all duration-200"
          >
            <Link href="/join">{t("join")}</Link>
          </Button>

          {/* Dark mode toggle with lantern icons */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-10 h-10 flex-shrink-0"
          >
            {theme === "dark" ? (
              <Image
                src="/lightmode.png"
                width={28}
                height={28}
                alt="Switch to light mode"
                className="object-contain"
              />
            ) : (
              <Image
                src="/darkmode.png"
                width={28}
                height={28}
                alt="Switch to dark mode"
                className="object-contain"
              />
            )}
          </Button>

          {/* Locale switcher */}
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}