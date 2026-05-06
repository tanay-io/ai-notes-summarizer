type GenerationType = "summary" | "flashcards" | "key_points";

type TypeBadgeProps = {
  type: GenerationType | string;
  className?: string;
};

const badgeMap: Record<string, { label: string; classes: string }> = {
  summary: {
    label: "SUM",
    classes: "bg-[#F5E4C8] text-[#C97C2A]",
  },
  flashcards: {
    label: "FCK",
    classes: "bg-[#E3EDFC] text-[#2A6BC9]",
  },
  key_points: {
    label: "KEY",
    classes: "bg-[#E6F3E6] text-[#3A7A3A]",
  },
};

export function TypeBadge({ type, className = "" }: TypeBadgeProps) {
  const key = String(type).toLowerCase();
  const item = badgeMap[key] ?? {
    label: "GEN",
    classes: "bg-[#F2EDE6] text-[#7A756A]",
  };

  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-[4px] font-mono text-[11px] font-semibold tracking-[0.08em] ${item.classes} ${className}`}
    >
      {item.label}
    </span>
  );
}
