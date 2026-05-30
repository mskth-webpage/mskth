"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function LocaleSwitcher() {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Home");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  if (!mounted) {
    return <div className="h-9 w-[90px]" aria-hidden="true" />;
  }

  return (
    <Select onValueChange={handleChange} defaultValue={locale}>
      <SelectTrigger className="w-[90px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-none overflow-hidden">
        <SelectItem value="en">🇬🇧 {t("en")}</SelectItem>
        <SelectItem value="sv">🇸🇪 {t("sv")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
