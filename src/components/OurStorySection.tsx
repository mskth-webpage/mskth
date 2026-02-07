"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function OurStorySection() {
  const t = useTranslations("AboutUs.ourStory");

  return (
    <section className="relative bg-blue-brand text-background pt-24 pb-40 overflow-hidden">
      {/* Desktop decorative images */}
      <Image
        src="/lightone.svg"
        alt=""
        aria-hidden
        width={160}
        height={160}
        className="
          absolute 
          left-4 top-8 
          opacity-80
          hidden md:block
          sm:left-10 sm:top-12
          md:left-20 md:top-16
        "
      />

      <Image
        src="/lightone.svg"
        alt=""
        aria-hidden
        width={160}
        height={160}
        className="
          absolute 
          right-4 bottom-28
          opacity-80
          hidden md:block
          sm:right-10 sm:bottom-32
          md:right-24 md:bottom-40
        "
      />

      {/* Content */}
      <div className="relative mx-auto max-w-[1100px] px-6">
        {/* Mobile top image */}
        <div className="mb-6 block md:hidden">
          <Image
            src="/lightone.svg"
            alt=""
            aria-hidden
            width={110}
            height={110}
            className="opacity-80"
          />
        </div>

        {/* Intro */}
        <p className="mx-auto mb-10 max-w-3xl font-serif text-[22px] leading-snug sm:text-[26px] md:text-[28px]">
          {t("intro")}
        </p>

        <p className="mx-auto mb-20 max-w-3xl font-serif text-base sm:text-lg leading-relaxed text-background/80">
          {t("mission")}
        </p>

        {/* Our story */}
        <h2 className="mx-auto mb-6 max-w-3xl font-serif text-3xl sm:text-4xl">
          {t("heading")}
        </h2>

        <p className="mx-auto max-w-3xl font-serif text-base sm:text-lg leading-relaxed text-background/80">
          {t("story")}
        </p>

        {/* Mobile bottom image */}
        <div className="mt-10 flex justify-end md:hidden">
          <Image
            src="/lightone.svg"
            alt=""
            aria-hidden
            width={110}
            height={110}
            className="opacity-80"
          />
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="block h-[140px] w-full"
        >
          <path
            className="fill-background"
            d="M0,160 
               C240,220 480,260 720,240 
               C960,220 1200,140 1440,180 
               L1440,320 L0,320 Z"
          />
        </svg>
      </div>
    </section>
  );
}
