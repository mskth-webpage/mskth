import React from "react";

type TicketProps = {
  title: string;
  description: string;
};

export default function Ticket({ title, description }: TicketProps) {
  return (
    <article className="relative h-[560px] w-full max-w-[320px]">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-(--blue-soft-2)" />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-no-repeat bg-contain bg-center"
        style={{ backgroundImage: "url('/ticket.svg')" }}
      />

      {/* Content */}
      <div className="relative inset-x-0 top-0 px-8 text-center">
        <h3 className="pt-[140px] text-5xl font-serif font-semibold text-black dark:text-black">
          {" "}
          {title}
        </h3>

        <p className="mt-8 font-serif text-lg text-black/80 dark:text-black/80">
          {description}
        </p>
      </div>
    </article>
  )
}
