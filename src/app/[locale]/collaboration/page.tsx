import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CollaborationPresenter from "@/presenter/CollaborationPresenter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Collaboration.meta");
  return {
    title: `${t("title")} | MSKTH`,
    description: t("description"),
  };
}

export default function CollaborationPage() {
  return (
    <CollaborationPresenter />
  );
}
