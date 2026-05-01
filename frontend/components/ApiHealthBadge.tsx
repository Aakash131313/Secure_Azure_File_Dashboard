type ApiHealthBadgeProps = {
  status: "online" | "offline" | "checking";
  label?: string;
};

const statusStyles = {
  online: "border-emerald-200 bg-emerald-50 text-emerald-700",
  offline: "border-rose-200 bg-rose-50 text-rose-700",
  checking: "border-sky-200 bg-sky-50 text-sky-700",
};

const dotStyles = {
  online: "bg-emerald-500",
  offline: "bg-rose-500",
  checking: "bg-sky-500",
};

export function ApiHealthBadge({ status, label = "API health" }: ApiHealthBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${statusStyles[status]}`}
      aria-label={`${label}: ${status}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dotStyles[status]}`} />
      <span>{label}: {status}</span>
    </div>
  );
}
