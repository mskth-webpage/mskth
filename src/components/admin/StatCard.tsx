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
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className={`mb-4 inline-flex rounded-lg p-2.5 ${iconBgClassName}`}>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
      <p className="mt-1.5 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
