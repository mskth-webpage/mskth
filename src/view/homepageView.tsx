"use client";

import Logo from "@/components/Logo";

export default function HomePageView() {
  return (
    <section className="w-full">
      <div className="max-w-6xl pl-16 pr-6 pt-20 pb-32">

        {/* HEADLINE */}
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-[var(--blue-brand)] leading-tight">
          Welcome to MSKTH
        </h1>

        <h1 className="text-5xl md:text-6xl font-serif font-bold mt-2 leading-tight">
          Your Community Awaits
        </h1>

        {/* SUBTEXT */}
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          At MSKTH, we foster a sense of brotherhood and spiritual growth among
          students. Join us for engaging events and valuable support tailored to
          your journey.
        </p>
      </div>
    </section>
  );
}
