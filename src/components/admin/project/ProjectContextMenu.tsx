"use client";

import { useTranslations } from "next-intl";
import type { Project } from "@/view/admin/project/AdminProjectsView";

type Props = {
  project: Project;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: "show" | "edit" | "delete") => void;
};

/** Floating menu anchored to a click position with show, edit, and delete actions for a project. */
export default function ProjectContextMenu({ project, position, onClose, onAction }: Props) {
  const t = useTranslations("AdminCalendar"); // Using same translations for context menu actions

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div
        className="absolute min-w-[190px] overflow-hidden rounded-lg border border-border bg-popover shadow-xl"
        style={{ top: position.y, left: position.x }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-3 py-2">
          <p className="truncate text-xs font-semibold text-foreground">{project.title}</p>
          <p className="text-[11px] text-muted-foreground truncate">
            {project.group_label}
          </p>
        </div>
        <div className="py-1">
          <button
            className="block w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent"
            onClick={() => onAction("show")}
          >
            {t("contextMenuShow")}
          </button>
          <button
            className="block w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent"
            onClick={() => onAction("edit")}
          >
            {t("contextMenuEdit")}
          </button>
          <div className="my-1 border-t border-border" />
          <button
            className="block w-full px-3 py-1.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => onAction("delete")}
          >
            {t("contextMenuDelete")}
          </button>
        </div>
      </div>
    </div>
  );
}
