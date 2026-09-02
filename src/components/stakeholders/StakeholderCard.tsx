import { stageColor, stageShortLabel } from "@/lib/stages";
import type { Stakeholder } from "@/lib/stakeholders";
import { Chip } from "./Chips";

/** Card used everywhere a stakeholder is listed — default view, stage popup. */
export function StakeholderCard({
  stakeholder: s,
  onClick,
}: {
  stakeholder: Stakeholder;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-input hover:bg-secondary/50"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold text-foreground">{s.name}</span>
        {s.archetype && <span className="text-xs text-muted-foreground">{s.archetype}</span>}
      </div>
      {s.about && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.about}</p>}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: stageColor(s.current_stage) }}
        >
          {stageShortLabel(s.current_stage)}
        </span>
        {s.industries.map((i) => (
          <Chip key={i}>{i}</Chip>
        ))}
        {s.companies.map((c) => (
          <Chip key={c} tone="outline">
            {c}
          </Chip>
        ))}
      </div>
      {s.comments && (
        <p className="mt-2 line-clamp-1 text-xs italic text-muted-foreground">“{s.comments}”</p>
      )}
    </button>
  );
}
