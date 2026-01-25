"use client";

import { useState } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { Link, usePathname } from "../i18n/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import LocaleSwitcher from "./LocaleSwitcher";
import Image from "next/image";
import { Menu, X } from "lucide-react";

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
    <header className="w-full bg-background z-40 border-b">
      <div className="mx-auto max-w-[1800px] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

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
        <div className="hidden md:flex shrink-0 items-center gap-2 ml-4">
          <Button 
            asChild 
            variant="ghost" 
            className="rounded-full bg-color-mskth-blue hover:bg-color-mskth-blue/90 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] transition-all duration-200"
          >
            <Link href="/join">{t("join")}</Link>
          </Button>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-10 h-10 shrink-0"
          >
            {theme === "dark" ? (
              <Image src="/lightmode.png" width={28} height={28} alt="Switch to light mode" />
            ) : (
              <Image src="/darkmode.png" width={28} height={28} alt="Switch to dark mode" />
            )}
          </Button>

          <LocaleSwitcher />
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
              href="/about"
              onClick={() => setOpen(false)}
            >
              {t("aboutus")}
            </Link>
          </div>

          <div className="pt-4 border-t flex items-center gap-4">
            <Button 
              asChild 
              variant="ghost"
              className="rounded-full pt-4 bg-color-mskth-blue hover:bg-color-mskth-blue/90 shadow transition-all"
            >
              <Link href="/join">{t("join")}</Link>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Image src="/lightmode.png" width={28} height={28} alt="Switch to light mode" />
              ) : (
                <Image src="/darkmode.png" width={28} height={28} alt="Switch to dark mode" />
              )}
            </Button>

            <LocaleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
