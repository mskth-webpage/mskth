"use client";

type TicketProps = {
  title: string;
  description: string;
  buttonText?: string;
  onBuy?: () => void;
};

export default function Ticket({ title, description, buttonText = "BUY NOW", onBuy }: TicketProps) {
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
      <div className="relative inset-x-0 top-0 px-8 text-center flex flex-col items-center h-full text-(--neutral-black)">
        <h3 className="pt-[140px] text-5xl font-serif font-semibold">
          {title}
        </h3>

        <p className="mt-8 font-serif text-lg text-[color:color-mix(in oklch, var(--neutral-black) 70%, transparent)]">
          {description}
        </p>

        <button
          onClick={onBuy}
          className="mt-auto mb-[140px] rounded-full border border-(--neutral-black)/30 px-8 py-2 text-sm uppercase tracking-wide font-medium hover:bg-[color:color-mix(in oklch, var(--neutral-black) 8%, transparent)] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
}
