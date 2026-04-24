"use client";

import AdminProjectsView, { Project } from "@/view/admin/AdminProjectsView";

export default function AdminProjectsPresenter() {
  // Dummy data based on the MVP requirements
  const dummyProjects: Project[] = [
    {
      id: "1",
      name: "Project Name",
      description: "Projects lead by",
      project_group_label: "MSKTH Board",
      project_members: "Members and active members",
    },
    {
      id: "2",
      name: "Project Name",
      description: "Projects lead by",
      project_group_label: "MSKTH Board",
      project_members: "Members and active members",
    },
    {
      id: "3",
      name: "Project Name",
      description: "Projects lead by",
      project_group_label: "MSKTH Board",
      project_members: "Members and active members",
    },
    {
      id: "4",
      name: "Project Name",
      description: "Projects lead by",
      project_group_label: "MSKTH Board",
      project_members: "Members and active members",
    },
    {
      id: "5",
      name: "Project Name",
      description: "Projects lead by",
      project_group_label: "MSKTH Board",
      project_members: "Members and active members",
    },
  ];

  return <AdminProjectsView projects={dummyProjects} />;
}
