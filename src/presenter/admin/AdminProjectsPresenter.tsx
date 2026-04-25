"use client";

import AdminProjectsView, { Project } from "@/view/admin/AdminProjectsView";
import { useTranslations } from "next-intl";

export default function AdminProjectsPresenter() {
  const t = useTranslations("AdminProjects.project");

  // Dummy data based on the MVP requirements
  const nextProjects: Project[] = [
    {
      id: "1",
      name: t("name"),
      description: t("description"),
      project_group_label: t("groupLabel"),
      project_members: t("members"),
    },
    {
      id: "2",
      name: t("name"),
      description: t("description"),
      project_group_label: t("groupLabel"),
      project_members: t("members"),
    },
    {
      id: "3",
      name: t("name"),
      description: t("description"),
      project_group_label: t("groupLabel"),
      project_members: t("members"),
    },
  ];

  const previousProjects: Project[] = [
    {
      id: "4",
      name: t("name"),
      description: t("description"),
      project_group_label: t("groupLabel"),
      project_members: t("members"),
    },
    {
      id: "5",
      name: t("name"),
      description: t("description"),
      project_group_label: t("groupLabel"),
      project_members: t("members"),
    },
    {
      id: "6",
      name: t("name"),
      description: t("description"),
      project_group_label: t("groupLabel"),
      project_members: t("members"),
    },
  ];

  return <AdminProjectsView nextProjects={nextProjects} previousProjects={previousProjects} />;
}
