import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MosquesPresenter from "@/presenter/MosquesPresenter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Mosques.meta");
  return {
    title: `${t("title")} | MSKTH`,
    description: t("description"),
  };
}

export default function MosquesPage() {
  return <MosquesPresenter />;
}
