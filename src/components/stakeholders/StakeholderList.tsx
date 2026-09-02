import type { Stakeholder } from "@/lib/stakeholders";
import { StakeholderCard } from "./StakeholderCard";

export function StakeholderList({
  stakeholders,
  onOpenStakeholder,
}: {
  stakeholders: Stakeholder[];
  onOpenStakeholder: (s: Stakeholder) => void;
}) {
  if (stakeholders.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No stakeholders match this view.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {stakeholders.map((s) => (
        <StakeholderCard key={s.id} stakeholder={s} onClick={() => onOpenStakeholder(s)} />
      ))}
    </div>
  );
}
