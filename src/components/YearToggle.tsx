"use client"
import { useState, useRef, useLayoutEffect } from "react";

type YearToggleProps = {
    years: number[];
    value?: number;
    onChange?: (year: number) => void;
}

export default function YearToggle({ years, value, onChange }: YearToggleProps) {
    const [internal, setInternal] = useState(years[0]);
    const selected = value ?? internal;
    const [underline, setUnderline] = useState({left: 0, width: 0})
    const containerRef = useRef<HTMLDivElement | null>(null)
    const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({})

    function setYear(y: number) {
        onChange?.(y);
        if (value === undefined) {
            setInternal(y);
        }
    }
    useLayoutEffect(() => {
        const container = containerRef.current
        const btn = btnRefs.current[selected]
        if (!container || !btn) {
            return
        }
        const cRect = container.getBoundingClientRect()
        const bRect = btn.getBoundingClientRect();

        setUnderline({
            left: bRect.left - cRect.left,
            width: bRect.width,
        });
    }, [selected, years])
    return (
        <div 
            ref={containerRef}
            className="relative flex items-center justify-center gap-[155px] mb-[131px]"
        >
            {/* sliding underline */}
            <span
                className="absolute bottom-[-10px] h-[3px] bg-current transition-all duration-300 ease-out"
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
              "hover:cursor-pointer",
              "font-serif font-bold text-[64px] leading-[42px] tracking-normal",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
              // keep spacing consistent; underline is separate now
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