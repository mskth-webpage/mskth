"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Link, usePathname } from "../i18n/navigation";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeToggleButton from "./ThemeToggle";
import { Button } from "./ui/button";

const mobileMenuLinkClasses =
  "block rounded-md px-1 py-1 text-foreground hover:bg-transparent hover:text-foreground focus-visible:outline-none focus-visible:ring-0 transition-none";

const noHoverButton =
  "hover:bg-transparent hover:text-inherit active:bg-transparent focus-visible:ring-0 transition-none";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40 w-full bg-background">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo */}
        <div className="shrink-0 justify-self-start">
          <Logo />
        </div>

        {/* Desktop navigation */}
        <nav className="pointer-events-none fixed left-1/2 top-5 z-50 hidden -translate-x-1/2 md:flex">
          <div className="pointer-events-auto mt-2 flex items-center gap-1 rounded-full bg-white/30 px-5 py-2.5 backdrop-blur-sm backdrop-saturate-150 dark:border-white/10 dark:bg-black/20 lg:gap-2 lg:px-7">
            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} h-10 rounded-full px-4 text-base ${
                pathname === "/events" ? "font-semibold" : ""
              }`}
            >
              <Link href="/events">{t("events")}</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} h-10 rounded-full px-4 text-base ${
                pathname === "/collaboration" ? "font-semibold" : ""
              }`}
            >
              <Link href="/collaboration">{t("collaboration")}</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} h-10 rounded-full px-4 text-base ${
                pathname === "/aboutus" ? "font-semibold" : ""
              }`}
            >
              <Link href="/aboutus">{t("aboutus")}</Link>
            </Button>
          </div>
        </nav>

        <div className="hidden md:block" />

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 justify-self-end md:flex lg:gap-3">
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-full border-color-mskth-blue px-5 text-sm font-medium uppercase tracking-wide text-color-mskth-blue transition-all duration-200 hover:-translate-y-0.5 hover:border-color-mskth-blue hover:bg-color-mskth-blue hover:text-black hover:shadow-md active:translate-y-0 lg:px-6"
          >
            <Link href="/join">{t("join")}</Link>
          </Button>

          <LocaleSwitcher />

          <ThemeToggleButton theme={theme} setTheme={setTheme} />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="col-start-3 flex items-center justify-self-end md:hidden"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="space-y-5 border-t bg-background px-5 py-5 md:hidden">
          <nav className="flex flex-col space-y-3 text-base">
            <Link
              className={mobileMenuLinkClasses}
              href="/events"
              onClick={() => setOpen(false)}
            >
              {t("events")}
            </Link>

            <Link
              className={mobileMenuLinkClasses}
              href="/collaboration"
              onClick={() => setOpen(false)}
            >
              {t("collaboration")}
            </Link>

            <Link
              className={mobileMenuLinkClasses}
              href="/aboutus"
              onClick={() => setOpen(false)}
            >
              {t("aboutus")}
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-3 border-t pt-4">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-color-mskth-blue px-6 text-sm font-medium uppercase tracking-wide text-color-mskth-blue transition-all duration-200 hover:bg-color-mskth-blue/10"
            >
              <Link href="/join" onClick={() => setOpen(false)}>
                {t("join")}
              </Link>
            </Button>

            <LocaleSwitcher />

            <ThemeToggleButton
              theme={theme}
              setTheme={setTheme}
              ariaLabel={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            />
          </div>
        </div>
      )}
    </header>
  );
}