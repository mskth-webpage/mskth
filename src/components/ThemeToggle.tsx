import Image from "next/image";
import { useRef, useState, PointerEvent } from "react";

const DRAG_THRESHOLD = 18;
const MAX_DRAG = 30;


type ThemeToggleProps = {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  ariaLabel?: string;
};

export default function ThemeToggleButton({ theme, setTheme, ariaLabel }: ThemeToggleProps) {
  const startYRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const didDragToggleRef = useRef(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startYRef.current = event.clientY;
    didDragToggleRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (startYRef.current === null) return;
    const delta = event.clientY - startYRef.current;

    if (delta <= 0) {
      setOffset(0);
      return;
    }

    setOffset(Math.min(delta, MAX_DRAG));

    if (delta >= DRAG_THRESHOLD && !didDragToggleRef.current) {
      didDragToggleRef.current = true;
      toggleTheme();
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    startYRef.current = null;
    setOffset(0);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleClick = () => {
    if (didDragToggleRef.current) {
      didDragToggleRef.current = false;
      return;
    }
    toggleTheme();
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? "Toggle dark mode"}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className="relative w-12 h-12 shrink-0 touch-none select-none flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{
        transform: `translateY(${offset}px)`,
        transition: isDragging ? "none" : "transform 150ms ease-out",
        touchAction: "none",
      }}
    >
      {theme === "dark" ? (
        <Image
          src="/lightmode.png"
          width={28}
          height={28}
          alt="Switch to light mode"
          draggable={false}
          className="w-27 h-27 object-contain"
        />
      ) : (
        <Image
          src="/darkmode.png"
          width={28}
          height={28}
          alt="Switch to dark mode"
          draggable={false}
          className="w-27 h-27 object-contain"
        />
      )}
    </button>
  );
}