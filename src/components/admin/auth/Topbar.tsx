"use client";

import { Globe, Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/admin/auth/LogoutButton";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "next-themes";
import ThemeToggleButton from "@/components/ThemeToggle";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import clsx from "clsx";

type AppTopbarProps = {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
};

/**
 * AppTopbar component — renders the fixed top navigation bar for the schools dashboard.
 */
export default function AppTopbar({ onMenuToggle, isSidebarOpen = true }: AppTopbarProps) {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const tHome = useTranslations("Home");
  const tTopbar = useTranslations("AdminTopbar");
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("User");
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) return;

      const metadata = user.user_metadata ?? {};
      const metadataName =
        metadata.full_name ??
        metadata.name ??
        metadata.display_name ??
        null;

      setDisplayName(metadataName || user.email || "User");
      setEmail(user.email ?? null);
      setAvatarUrl(metadata.avatar_url ?? null);
    };

    void loadUser();
  }, []);

  const initials = useMemo(() => {
    const source = displayName || email || "U";
    return source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [displayName, email]);

  const handleLocaleChange = (newLocale: "en" | "sv") => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-3 transition-[left] duration-300 ease-in-out sm:px-5 md:px-6",
        isSidebarOpen ? "lg:left-64" : "lg:left-20",
      )}
    >
      {/* Left: Logo + Menu */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onMenuToggle}
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex h-12 items-center overflow-hidden lg:hidden [&_img]:w-14 [&_img]:sm:w-16">
          <Logo variant="admin" />
        </div>
      </div>

      {/* Right: user menu */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 rounded-full px-3">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="max-w-40 truncate text-sm font-medium">{displayName}</div>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="max-h-[70vh] w-72 overflow-y-auto rounded-xl border border-border/80 bg-card/95 p-2 shadow-xl backdrop-blur"
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 rounded-lg p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold tracking-tight">
                    {displayName}
                  </p>
                  {email && (
                    <p className="truncate text-xs leading-tight text-muted-foreground">
                      {email}
                    </p>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-3 px-2 pb-2 pt-1">
              <div className="space-y-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/90">
                  <Globe className="mr-1 inline h-3.5 w-3.5" />
                  {tTopbar("language")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={locale === "en" ? "default" : "outline"}
                    onClick={() => handleLocaleChange("en")}
                    className="h-8 justify-center rounded-md text-xs"
                  >
                    🇬🇧 {tHome("en")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={locale === "sv" ? "default" : "outline"}
                    onClick={() => handleLocaleChange("sv")}
                    className="h-8 justify-center rounded-md text-xs"
                  >
                    🇸🇪 {tHome("sv")}
                  </Button>
                </div>
              </div>

              <div className="flex min-h-14 items-center justify-between rounded-lg border border-border/80 bg-muted/40 px-3 py-8">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium tracking-tight text-foreground">
                    {tTopbar("appearanceTitle")}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {tTopbar("appearanceDescription")}
                  </p>
                </div>
                <ThemeToggleButton
                  theme={theme}
                  setTheme={setTheme}
                  ariaLabel={
                    theme === "dark"
                      ? tTopbar("switchToLightMode")
                      : tTopbar("switchToDarkMode")
                  }
                />
              </div>

              <LogoutButton asSidebarItem className="mb-0 mt-1" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
