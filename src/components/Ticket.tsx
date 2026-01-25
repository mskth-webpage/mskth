import React from "react"

type TicketProps = {
  title: string
  description: string
}

export default function Ticket({ title, description }: TicketProps) {

  return (
    <article className="relative h-[560px] w-full max-w-[320px]"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-no-repeat bg-size-[100%_100%]"
        style={{ backgroundImage: "url('/ticket.svg')" }}
      />

      {/* Content */}
      <div className="absolute inset-x-0 top-0 px-8 text-center">
        <h3 className="pt-[140px] text-5xl font-serif font-semibold text-neutral-black"
        >
          {title}
        </h3>

        <p className="mt-8 font-serif text-lg text-neutral-black/80">
          {description}
        </p>
      </div>
    </article>
  )
}
