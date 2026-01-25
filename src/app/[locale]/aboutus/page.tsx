import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutUsPresenter from "@/presenter/AboutUsPresenter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AboutUs.meta");
  return {
    title: `${t("title")} | MSKTH`,
    description: t("description"),
  };
}

export default function AboutUsPage() {
  return <AboutUsPresenter />;
}
