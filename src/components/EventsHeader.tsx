"use client";

import Image from "next/image";

type EventsHeaderProps = {
  title: string;
  description: string;
};

export default function EventsHeader({ title, description }: EventsHeaderProps) {
  return (
    <section className="relative flex flex-col items-center justify-center py-24 text-center bg-background">
      {/* Decorations */}
      <Image
        src="/ticket-blue.svg"
        alt=""
        aria-hidden
        width={80}
        height={80}
        className="absolute left-10 top-40 -rotate-20 z-0"
      />

      <Image
        src="/ticket-blue.svg"
        alt=""
        aria-hidden
        width={70}
        height={70}
        className="absolute right-10 top-52 rotate-8 z-0"
      />

      <Image
        src="/ticket-blue.svg"
        alt=""
        aria-hidden
        width={60}
        height={60}
        className="absolute top-61 rotate-15 z-0"
      />

      {/* Text */}
      <h1 className="relative z-10 font-serif text-4xl font-semibold uppercase text-foreground">
        {title}
      </h1>

      <p className="relative z-10 mt-4 text-sm text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
