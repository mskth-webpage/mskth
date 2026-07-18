"use client";

import Image from "next/image";

type EventsHeaderProps = {
  title: string;
  description: string;
};

export default function EventsHeader({ title, description }: EventsHeaderProps) {
  return (
    <section className="relative flex min-h-[360px] flex-col items-center justify-start pt-16 text-center sm:min-h-[520px] sm:pt-32 lg:min-h-[620px] lg:pt-44">
      {/* Decorations */}
      <Image
        src="/ticket-blue.svg"
        alt=""
        aria-hidden
        width={86}
        height={170}
        className="absolute left-[8%] top-[45%] z-0 h-auto w-10 -rotate-[22deg] sm:w-16 lg:left-[18%] lg:w-20"
      />

      <Image
        src="/ticket-blue.svg"
        alt=""
        aria-hidden
        width={70}
        height={138}
        className="absolute right-[8%] top-[42%] z-0 h-auto w-9 rotate-[7deg] sm:w-14 lg:right-[18%] lg:w-16"
      />

      <Image
        src="/ticket-blue.svg"
        alt=""
        aria-hidden
        width={60}
        height={118}
        className="absolute left-1/2 top-[62%] z-0 h-auto w-9 -translate-x-1/2 rotate-[13deg] sm:w-12 lg:w-14"
      />

      {/* Text */}
      <h1 className="relative z-10 font-serif text-2xl font-medium uppercase sm:text-4xl">
        {title}
      </h1>

      <p className="relative z-10 mt-2 font-serif text-xs text-foreground/70 sm:mt-4 sm:text-sm">
        {description}
      </p>
    </section>
  );
}
