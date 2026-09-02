import { cn } from "@/lib/utils";
import { INDUSTRIES } from "@/lib/stages";

const ALL = "__all__";

function itemClass(active: boolean) {
  return cn(
    "w-full shrink-0 rounded-lg border px-3 py-2 text-left text-sm transition-colors sm:shrink",
    active
      ? "border-input bg-secondary font-medium text-foreground"
      : "border-transparent text-muted-foreground hover:border-input hover:bg-secondary/50 hover:text-foreground",
  );
}

export function IndustrySidebar({
  industry,
  onChange,
}: {
  industry: string;
  onChange: (value: string) => void;
}) {
  return (
    <nav className="flex gap-1.5 overflow-x-auto rounded-xl border border-border bg-card p-2 pb-2 sm:w-56 sm:shrink-0 sm:flex-col sm:overflow-visible sm:pb-2">
      <button type="button" className={itemClass(industry === ALL)} onClick={() => onChange(ALL)}>
        All industries
      </button>
      {INDUSTRIES.map((i) => (
        <button
          key={i}
          type="button"
          className={itemClass(industry === i)}
          onClick={() => onChange(i)}
        >
          {i}
        </button>
      ))}
    </nav>
  );
}
