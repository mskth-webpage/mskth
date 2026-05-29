"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const scallopStyle: React.CSSProperties = {
  WebkitMaskImage: `radial-gradient(circle at 10px 0, transparent 9px, black 10px)`,
  WebkitMaskSize: "20px 100%",
  WebkitMaskRepeat: "repeat-x",
  WebkitMaskPosition: "top",
  maskImage: `radial-gradient(circle at 10px 0, transparent 9px, black 10px)`,
  maskSize: "20px 100%",
  maskRepeat: "repeat-x",
  maskPosition: "top",
};

type DateHeader = {
  type: "date";
  date: Date;
  statusLabel: string;
  statusVariant: "success" | "warning";
  secondaryBadge?: { label: string; className: string };
};

type ImageHeader = {
  type: "image";
  src: string | null;
  alt: string;
};

export type MetaItem = {
  icon: React.ReactNode;
  label: string;
};

type Props = {
  header?: DateHeader | ImageHeader;
  title: string;
  description?: string;
  meta?: MetaItem[];
  extra?: React.ReactNode;
  actions?: React.ReactNode;
  scallop?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
};

export default function ContentCard({
  header,
  title,
  description,
  meta,
  extra,
  actions,
  scallop = false,
  onClick,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex w-72 flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-shadow hover:shadow-lg",
        onClick && "cursor-pointer",
        className,
      )}
      style={scallop ? scallopStyle : undefined}
      onClick={onClick}
    >
      {header?.type === "date" && (
        <div className="flex items-center justify-between bg-primary/10 px-4 py-3">
          <div className="text-center leading-none">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">
              {header.date.toLocaleDateString("en", { month: "short" })}
            </p>
            <p className="text-2xl font-bold text-primary">{header.date.getDate()}</p>
            <p className="text-[10px] font-medium text-primary/60">{header.date.getFullYear()}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                header.statusVariant === "success"
                  ? "bg-success text-success-foreground"
                  : "bg-warning text-warning-foreground",
              )}
            >
              {header.statusLabel}
            </span>
            {header.secondaryBadge && (
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", header.secondaryBadge.className)}>
                {header.secondaryBadge.label}
              </span>
            )}
          </div>
        </div>
      )}

      {header?.type === "image" && (
        <div className="relative h-40 w-full bg-muted">
          {header.src ? (
            <Image src={header.src} alt={header.alt} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-muted-foreground/10" />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 px-4 py-3">
        <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground">{title}</p>
        {description && (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
        {meta && meta.length > 0 && (
          <div className="mt-auto space-y-1 pt-2">
            {meta.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {item.icon}
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        )}
        {extra && <div className="pt-2">{extra}</div>}
      </div>

      {actions && (
        <>
          <div className="mx-4 border-t border-dashed border-border" />
          <div
            className="flex items-center justify-between gap-2 px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        </>
      )}
    </div>
  );
}
