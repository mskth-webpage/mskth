"use client";

type Props = {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

/** Styled hour + minute select replacing the native time input. */
export default function TimePicker({ value, onChange }: Props) {
  const [hh, mm] = value.split(":");

  const update = (nextHh: string, nextMm: string) => onChange(`${nextHh}:${nextMm}`);

  return (
    <div className="flex items-center gap-1 rounded border border-border bg-background px-2 py-1.5 focus-within:border-primary">
      <select
        value={hh}
        onChange={(e) => update(e.target.value, mm)}
        className="appearance-none bg-transparent text-sm outline-none"
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <span className="text-sm font-semibold text-muted-foreground">:</span>
      <select
        value={mm ?? "00"}
        onChange={(e) => update(hh, e.target.value)}
        className="appearance-none bg-transparent text-sm outline-none"
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}
