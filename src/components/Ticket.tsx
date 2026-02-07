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
      <div className="relative inset-x-0 top-0 px-8 text-center flex flex-col items-center h-full">
        <h3 className="pt-[140px] text-5xl font-serif font-semibold text-foreground">
          {title}
        </h3>

        <p className="mt-8 font-serif text-lg text-foreground/80">
          {description}
        </p>

        <button
          onClick={onBuy}
          className="mt-auto mb-[140px] rounded-full border border-foreground/30 px-8 py-2 text-sm uppercase tracking-wide font-medium text-foreground hover:bg-foreground/5 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
}