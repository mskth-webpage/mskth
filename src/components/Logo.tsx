"use client"

import { Link } from "@/i18n/navigation"
import Image from 'next/image'
import clsx from "clsx"

type LogoProps = {
  badge?: boolean;
  className?: string;
  imageClassName?: string;
  variant?: "admin" | "public";
};

function Logo({ badge = false, className, imageClassName, variant = "public" }: LogoProps) {
  return (
    <Link
      href="/"
      className={clsx(
        "block",
        badge && "overflow-hidden rounded-full bg-background shadow-sm",
        className,
      )}
    >
      <Image
        src={variant === "admin" ? "/admin-logga.svg" : "/logga.svg"}
        width={230}
        height={210}
        alt="Mskth logo"
        priority
        className={clsx("h-auto w-20 sm:w-28", imageClassName)}
      />
    </Link>
  )
}

export default Logo
