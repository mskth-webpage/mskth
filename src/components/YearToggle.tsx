"use client"
import { useState, useRef, useLayoutEffect } from "react";

type YearToggleProps = {
  years: number[];
  value?: number;
  onChange?: (year: number) => void;
};

export default function YearToggle({ years, value, onChange }: YearToggleProps) {
  const [internal, setInternal] = useState(years[0]);
  const selected = value ?? internal;
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  function setYear(y: number) {
    onChange?.(y);
    if (value === undefined) {
      setInternal(y);
    }
  }

  useLayoutEffect(() => {
    const container = containerRef.current;
    const btn = btnRefs.current[selected];
    if (!container || !btn) return;

    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();

    setUnderline({
      left: bRect.left - cRect.left,
      width: bRect.width,
    });
  }, [selected, years]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-[37px] mb-[11px] md:mb-[131px] md:gap-[155px]"
    >
      <span
        className="absolute bottom-[-6px] h-[2px] bg-current transition-all duration-300 ease-out md:bottom-[-10px] md:h-[3px]"
        style={{
          left: underline.left,
          width: underline.width,
        }}
      />

      {years.map((y) => {
        const active = y === selected;

        return (
          <button
            key={y}
            ref={(el) => {
              btnRefs.current[y] = el;
            }}
            type="button"
            onClick={() => setYear(y)}
            className={[
              "font-serif font-bold tracking-[0] hover:cursor-pointer",
              "text-[24px] leading-[42px] md:text-[64px] md:leading-[42px]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
              active ? "opacity-100" : "opacity-70 hover:opacity-100",
            ].join(" ")}
          >
            {y}
          </button>
        );
      })}
    </div>
  );
}