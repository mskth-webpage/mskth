"use client";

import AdminProjectsView, { Project } from "@/view/admin/AdminProjectsView";
import { useTranslations } from "next-intl";

export default function AdminProjectsPresenter() {
  const t = useTranslations("AdminProjects.project");

  // Dummy data based on the MVP requirements
  const nextProjects: Project[] = [
    {
      id: "1",
      title: t("name"),
      description: t("description"),
      group_label: t("groupLabel"),
      members: t("members"),
      status: "draft"
    },
    {
      id: "2",
      title: t("name"),
      description: t("description"),
      group_label: t("groupLabel"),
      members: t("members"),
      status: "draft"
    },
    {
      id: "3",
      title: t("name"),
      description: t("description"),
      group_label: t("groupLabel"),
      members: t("members"),
      status: "draft"
    },
  ];

  const previousProjects: Project[] = [
    {
      id: "4",
      title: t("name"),
      description: t("description"),
      group_label: t("groupLabel"),
      members: t("members"),
      status: "archived"
    },
    {
      id: "5",
      title: t("name"),
      description: t("description"),
      group_label: t("groupLabel"),
      members: t("members"),
      status: "archived"
    },
    {
      id: "6",
      title: t("name"),
      description: t("description"),
      group_label: t("groupLabel"),
      members: t("members"),
      status: "archived"
    },
  ];

  return <AdminProjectsView nextProjects={nextProjects} previousProjects={previousProjects} />;
}
