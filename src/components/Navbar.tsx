"use client";

import { useState } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { Link, usePathname } from "../i18n/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import LocaleSwitcher from "./LocaleSwitcher";

import { Menu, X } from "lucide-react";
import ThemeToggleButton from "./ThemeToggle";

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
    <header className="w-full bg-background z-40">
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 py-3 sm:px-6 lg:px-10">
        {/* LOGO */}
        <div className="justify-self-start shrink-0">
          <Logo />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex justify-self-center">
          <div className="flex items-center gap-2 rounded-full border bg-background/95 px-4 py-2 shadow-sm backdrop-blur-md lg:gap-3 lg:px-6">
            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} h-9 rounded-full px-3 text-sm ${
                pathname === "/events" ? "font-semibold" : ""
              }`}
            >
              <Link href="/events">{t("events")}</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} h-9 rounded-full px-3 text-sm ${
                pathname === "/collaboration" ? "font-semibold" : ""
              }`}
            >
              <Link href="/collaboration">{t("collaboration")}</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} h-9 rounded-full px-3 text-sm ${
                pathname === "/aboutus" ? "font-semibold" : ""
              }`}
            >
              <Link href="/aboutus">{t("aboutus")}</Link>
            </Button>
          </div>
        </nav>

        {/* ACTIONS DESKTOP */}
        <div className="hidden md:flex justify-self-end shrink-0 items-center gap-2 lg:gap-3">
          <Button
            asChild
            variant="ghost"
            className={`${noHoverButton} h-9 rounded-full px-3 text-sm lg:px-4`}
          >
            <Link href="/admin/login">{t("login")}</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-9 rounded-full border-color-mskth-blue px-5 text-sm font-medium uppercase tracking-wide text-color-mskth-blue transition-all duration-200 hover:bg-color-mskth-blue/10 lg:px-6"
          >
            <Link href="/join">{t("join")}</Link>
          </Button>

          <LocaleSwitcher />

          <ThemeToggleButton theme={theme} setTheme={setTheme} />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden col-start-3 justify-self-end flex items-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="md:hidden border-t bg-background px-5 py-5 space-y-5">
          <div className="flex flex-col space-y-3 text-base">
            <Link
              className={mobileMenuLinkClasses}
              href="/admin/login"
              onClick={() => setOpen(false)}
            >
              {t("login")}
            </Link>

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
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t pt-4">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-color-mskth-blue px-6 text-sm font-medium uppercase tracking-wide text-color-mskth-blue transition-all duration-200 hover:bg-color-mskth-blue/10"
            >
              <Link href="/join">{t("join")}</Link>
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