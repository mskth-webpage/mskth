"use client";

type EventsHeaderProps = {
  title: string;
  description: string;
};

export default function EventsHeader({
  title,
  description,
}: EventsHeaderProps) {
  return (
    <section className="relative mb-16 flex min-h-[460px] flex-col items-center px-6 pb-20 pt-10 text-center sm:min-h-[560px] sm:pb-24 sm:pt-16 lg:min-h-[620px] lg:pt-20">
      {/* Text */}
      <h1 className="relative z-20 font-serif text-2xl font-medium uppercase text-foreground sm:text-4xl">
        {title}
      </h1>

      <p className="relative z-20 mt-2 max-w-2xl font-serif text-xs leading-relaxed text-foreground/70 sm:mt-4 sm:text-sm">
        {description}
      </p>

      {/* Animated ticket composition */}
      <div className="ticket-scene relative mt-12 h-70 w-75 sm:mt-16 sm:h-92.5 sm:w-105 lg:h-102.5 lg:w-117.5">
        <div className="absolute left-1/2 top-[56%] h-55 w-65 -translate-x-1/2 -translate-y-1/2 sm:h-75 sm:w-90 lg:h-85 lg:w-102.5">
          {/* Organic background */}
          <div
            aria-hidden="true"
            className="ticket-blob absolute inset-0 rounded-[48%_52%_45%_55%/52%_44%_56%_48%] bg-upcomingevent-section/10"
          />

          {/* Decorative dots */}
          <span
            aria-hidden="true"
            className="ticket-dot ticket-dot-one absolute -left-[5%] bottom-[12%] h-4 w-4 rounded-full bg-upcomingevent-section sm:h-5 sm:w-5"
          />

          <span
            aria-hidden="true"
            className="ticket-dot ticket-dot-two absolute -right-[4%] bottom-[19%] h-5 w-5 rounded-full bg-upcomingevent-section/70 sm:h-7 sm:w-7"
          />

          <span
            aria-hidden="true"
            className="ticket-dot ticket-dot-three absolute right-[16%] top-[2%] h-3 w-3 rounded-full bg-upcomingevent-section sm:h-4 sm:w-4"
          />
          {/* Back-left ticket */}
          <div className="ticket ticket-back-left absolute left-1/2 top-1/2 z-10 h-[170px] w-[86px] text-[#4f9ac4] sm:h-[222px] sm:w-[112px] lg:h-[249px] lg:w-[126px]">
            <div aria-hidden="true" className="ticket-shape" />
          </div>

          {/* Back-right ticket */}
          <div className="ticket ticket-back-right absolute left-1/2 top-1/2 z-20 h-[170px] w-[86px] text-[#007bc2] sm:h-[222px] sm:w-[112px] lg:h-[249px] lg:w-[126px]">
            <div aria-hidden="true" className="ticket-shape" />
          </div>

          {/* Front ticket */}
          <div className="ticket ticket-front absolute left-1/2 top-1/2 z-30 h-[190px] w-[96px] text-upcomingevent-section drop-shadow-[0_16px_24px_rgba(7,107,173,0.2)] sm:h-[261px] sm:w-[132px] lg:h-[293px] lg:w-[148px]">
            <div aria-hidden="true" className="ticket-shape absolute inset-0" />

            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[36%] z-10 -translate-x-1/2 -translate-y-1/2 font-sans text-[13px] font-bold uppercase tracking-[0.12em] text-white sm:text-[18px] lg:text-[21px]"
            >
              Grab your tickets!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
