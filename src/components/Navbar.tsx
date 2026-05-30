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
      <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-10 py-3">

        {/* LOGO */}
        <div className="shrink-0">
          <Logo />
        </div>

        <nav className="hidden md:flex flex-1 justify-center">
          <div className="bg-background/95 backdrop-blur-md border rounded-full px-8 sm:px-16 lg:px-24 py-2 flex gap-6 sm:gap-8 lg:gap-12 shadow-sm">
            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} ${pathname === "/events" ? "font-semibold" : ""}`}
            >
              <Link href="/events">{t("events")}</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} ${pathname === "/collaboration" ? "font-semibold" : ""}`}
            >
              <Link href="/collaboration">{t("collaboration")}</Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className={`${noHoverButton} ${pathname === "/aboutus" ? "font-semibold" : ""}`}
            >
              <Link href="/aboutus">{t("aboutus")}</Link>
            </Button>
          </div>
        </nav>

        {/* ACTIONS (Desktop) */}
        <div className="hidden md:flex shrink-0 items-center gap-4 ml-6">
          <Button
            asChild
            variant="ghost"
            className={`${noHoverButton} rounded-full px-5`}
          >
            <Link href="/admin/login">{t("login")}</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 py-2 uppercase tracking-wide text-sm font-medium border-color-mskth-blue text-color-mskth-blue hover:bg-color-mskth-blue/10 transition-all duration-200"
          >
            <Link href="/join">{t("join")}</Link>
          </Button>

          <LocaleSwitcher />

          <ThemeToggleButton theme={theme} setTheme={setTheme} />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4">

          <div className="flex flex-col space-y-3 text-lg">
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

          <div className="pt-4 border-t flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="rounded-full px-6 uppercase tracking-wide text-sm font-medium border-color-mskth-blue text-color-mskth-blue hover:bg-color-mskth-blue/10 transition-all duration-200"
            >
              <Link href="/join">{t("join")}</Link>
            </Button>

            <LocaleSwitcher />

            <ThemeToggleButton
              theme={theme}
              setTheme={setTheme}
              ariaLabel={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            />
          </div>
        </div>
      )}
    </header>
  );
}
