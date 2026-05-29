"use client";

type Props = {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  iconBgClassName?: string;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "text-primary",
  iconBgClassName = "bg-primary/10",
}: Props) {
  return (
    <div className="rounded-xl border border-blue-200/70 bg-card p-6 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_4px_16px_rgba(59,130,246,0.1)] transition-shadow hover:shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_4px_20px_rgba(59,130,246,0.18)]">
      <div className={`mb-4 inline-flex rounded-lg p-2.5 ${iconBgClassName}`}>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
      <p className="mt-1.5 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
