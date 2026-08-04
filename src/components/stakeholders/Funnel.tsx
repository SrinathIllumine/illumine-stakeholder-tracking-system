import { STAGES } from "@/lib/stages";
import type { Stakeholder } from "@/lib/stakeholders";

export function Funnel({
  stakeholders,
  onSelectStage,
}: {
  stakeholders: Stakeholder[];
  onSelectStage: (stageId: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {STAGES.map((stage, i) => {
        const count = stakeholders.filter((s) => s.current_stage === stage.id).length;
        const next = STAGES[i + 1];
        const topWidth = stage.width;
        const bottomWidth = next ? next.width : stage.width - 12;
        const inset = (topWidth - bottomWidth) / 2 / topWidth;

        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelectStage(stage.id)}
            style={{
              width: `${stage.width}%`,
              backgroundColor: stage.color,
              clipPath: `polygon(0% 0%, 100% 0%, ${100 - inset * 100}% 100%, ${inset * 100}% 100%)`,
            }}
            className="group relative min-h-[76px] w-full max-w-4xl px-6 py-5 text-white transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-[84px]"
          >
            <div className="mx-auto flex max-w-[85%] flex-col items-center justify-center gap-0.5">
              <span className="text-center text-[13px] font-semibold leading-tight sm:text-sm">
                {stage.label}
              </span>
              <span className="text-xs text-white/75">
                {count} {count === 1 ? "stakeholder" : "stakeholders"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
