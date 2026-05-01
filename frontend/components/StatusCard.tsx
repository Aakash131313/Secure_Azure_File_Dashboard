import type { StatusTone } from "@/types";

type StatusCardProps = {
  title: string;
  message: string;
  tone?: StatusTone;
};

const toneStyles = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-rose-200 bg-rose-50 text-rose-900",
};

export function StatusCard({ title, message, tone = "info" }: StatusCardProps) {
  return (
    <section className={`rounded-lg border p-4 ${toneStyles[tone]}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-sm leading-6">{message}</p>
    </section>
  );
}
