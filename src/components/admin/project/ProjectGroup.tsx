"use client";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle: string;
  projectCount: number;
  selected: boolean;
  onClick: () => void;
};

/** Clickable circle used to select which project group to display. */
export default function ProjectGroup({ title, subtitle, projectCount, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 shadow-md transition-all duration-200",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-primary/30"
          : "border-primary/30 bg-card text-primary hover:border-primary hover:shadow-primary/20",
      )}
    >
      <span className="text-sm font-bold leading-none">{title}</span>
      <span className="mt-0.5 text-xs font-medium opacity-70">{subtitle}</span>
      <span className="mt-1 text-[10px] opacity-60">
        {projectCount} {projectCount === 1 ? "project" : "projects"}
      </span>
    </button>
  );
}
