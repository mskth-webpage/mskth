"use client";

import type {
  CSSProperties,
  MouseEvent,
  ReactNode,
} from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
    /\/$/,
    "",
  );

const MSKTH_LOGO = supabaseUrl
  ? `${supabaseUrl}/storage/v1/object/public/images/MSkth.png`
  : "/MSkth.png";

const scallopStyle: CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(circle at 10px 0, transparent 9px, black 10px)",
  WebkitMaskSize: "20px 100%",
  WebkitMaskRepeat: "repeat-x",
  WebkitMaskPosition: "top",
  maskImage:
    "radial-gradient(circle at 10px 0, transparent 9px, black 10px)",
  maskSize: "20px 100%",
  maskRepeat: "repeat-x",
  maskPosition: "top",
};

type BadgeVariant = | "success" | "warning" | "muted";

type SecondaryBadge = {
  label: string;
  className: string;
};

type DateHeader = {
  type: "date";
  date: Date;
  imageSrc?: string | null;
  imageAlt?: string;
  statusLabel: string;
  statusVariant: BadgeVariant;
  secondaryBadge?: SecondaryBadge;
};

type ImageHeader = {
  type: "image";
  src: string | null;
  alt: string;
  statusLabel?: string;
  statusVariant?: BadgeVariant;
  secondaryBadge?: SecondaryBadge;
};

export type MetaItem = {
  icon: ReactNode;
  label: string;
};

type Props = {
  header?: DateHeader | ImageHeader;
  title: string;
  description?: string;
  meta?: MetaItem[];
  media?: ReactNode;
  extra?: ReactNode;
  actions?: ReactNode;
  scallop?: boolean;
  uniformLayout?: boolean;
  onClick?: (
    event: MouseEvent<HTMLDivElement>,
  ) => void;
  className?: string;
};

function StatusBadges({
  statusLabel,
  statusVariant,
  secondaryBadge,
  overlay = false,
}: {
  statusLabel?: string;
  statusVariant?: BadgeVariant;
  secondaryBadge?: SecondaryBadge;
  overlay?: boolean;
}) {
  if (!statusLabel) {
    return null;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
          overlay && "shadow-sm backdrop-blur-md",
          statusVariant === "success"
            ? overlay
              ? "bg-success/90 text-success-foreground"
              : "bg-success text-success-foreground"
            : statusVariant === "warning"
              ? overlay
                ? "bg-warning/90 text-warning-foreground"
                : "bg-warning text-warning-foreground"
              : overlay
                ? "border border-white/30 bg-background/85 text-foreground"
                : "border border-border/50 bg-muted text-muted-foreground",
        )}
      >
        {statusLabel}
      </span>

      {secondaryBadge && (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            overlay &&
              "shadow-sm backdrop-blur-md",
            secondaryBadge.className,
          )}
        >
          {secondaryBadge.label}
        </span>
      )}
    </div>
  );
}

function EventDate({
  date,
  overlay = false,
}: {
  date: Date;
  overlay?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-left leading-none",
        overlay &&
          "rounded-xl bg-black/45 px-3 py-2.5 text-white shadow-md backdrop-blur-md",
      )}
    >
      <p
        className={cn(
          "text-[10px] font-semibold uppercase tracking-widest",
          overlay
            ? "text-white/80"
            : "text-primary/60",
        )}
      >
        {date.toLocaleDateString("en", {
          month: "short",
        })}
      </p>

      <p
        className={cn(
          "mt-1 text-2xl font-bold",
          overlay
            ? "text-white"
            : "text-primary",
        )}
      >
        {date.getDate()}
      </p>

      <p
        className={cn(
          "mt-1 text-[10px] font-medium",
          overlay
            ? "text-white/80"
            : "text-primary/60",
        )}
      >
        {date.getFullYear()}
      </p>
    </div>
  );
}

export default function ContentCard({
  header,
  title,
  description,
  meta,
  media,
  extra,
  actions,
  scallop = false,
  uniformLayout = false,
  onClick,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex w-72 flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-shadow hover:shadow-lg",
        uniformLayout &&
          "h-full min-h-[500px]",
        onClick && "cursor-pointer",
        className,
      )}
      style={ scallop ? scallopStyle : undefined
      }
      onClick={onClick}
    >
      {header?.type === "date" && (
        <>
          {header.imageSrc ? (
            <div
              className={cn(
                "relative w-full shrink-0 overflow-hidden bg-primary/10",
                uniformLayout
                  ? "h-[180px]"
                  : "h-40",
              )}
            >
              <Image
                src={header.imageSrc}
                alt={
                  header.imageAlt ??
                  title
                }
                fill
                sizes="340px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />

              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 px-4 pb-4 pt-6">
                <EventDate
                  date={header.date}
                  overlay
                />

                <StatusBadges
                  statusLabel={
                    header.statusLabel
                  }
                  statusVariant={
                    header.statusVariant
                  }
                  secondaryBadge={
                    header.secondaryBadge
                  }
                  overlay
                />
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center justify-between bg-primary/10 px-4 py-3",
                uniformLayout &&
                  "h-[138px] shrink-0",
              )}
            >
              <EventDate
                date={header.date}
              />

              <StatusBadges
                statusLabel={
                  header.statusLabel
                }
                statusVariant={
                  header.statusVariant
                }
                secondaryBadge={
                  header.secondaryBadge
                }
              />
            </div>
          )}
        </>
      )}

      {header?.type === "image" &&
        (() => {
          const isDefaultImage =
            !header.src ||
            header.src.includes(
              "MSkth.png",
            );

          const imageSrc: string =
            isDefaultImage
              ? MSKTH_LOGO
              : (header.src ??
                MSKTH_LOGO);

          return (
            <div className="relative h-40 w-full shrink-0 bg-muted">
              <Image
                src={imageSrc}
                alt={header.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={
                  isDefaultImage
                    ? "object-contain p-4 opacity-40"
                    : "object-cover"
                }
              />

              {header.statusLabel && (
                <div className="absolute right-3 top-3">
                  <StatusBadges
                    statusLabel={
                      header.statusLabel
                    }
                    statusVariant={
                      header.statusVariant
                    }
                    secondaryBadge={
                      header.secondaryBadge
                    }
                    overlay
                  />
                </div>
              )}
            </div>
          );
        })()}

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        {media && (
          <div className="mb-3 shrink-0">
            {media}
          </div>
        )}

        <p
          className={cn(
            "break-words text-sm font-bold leading-snug text-foreground",
            uniformLayout
              ? "min-h-[2.5rem]"
              : "line-clamp-2",
          )}
        >
          {title}
        </p>

        {description && (
          <p
            className={cn(
              "mt-2 whitespace-pre-line break-words text-xs leading-relaxed text-muted-foreground",
              !uniformLayout &&
                "line-clamp-3",
            )}
          >
            {description}
          </p>
        )}

        {meta &&
          meta.length > 0 && (
            <div className="mt-3 space-y-1">
              {meta.map(
                (item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground"
                  >
                    {item.icon}

                    <span className="break-words">
                      {item.label}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}

        {extra && (
          <div className="mt-4 shrink-0">
            {extra}
          </div>
        )}

        <div
          className="flex-1"
          aria-hidden="true"
        />
      </div>

      {actions && (
        <>
          <div className="mx-4 shrink-0 border-t border-dashed border-border" />

          <div
            className="flex shrink-0 items-center justify-between gap-2 px-4 py-3"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {actions}
          </div>
        </>
      )}
    </div>
  );
}