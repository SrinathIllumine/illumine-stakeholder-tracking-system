import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ARCHETYPES, INDUSTRIES, stageColor, stageLabel } from "@/lib/stages";
import type { Stakeholder } from "@/lib/stakeholders";
import { Chip } from "./Chips";

const ALL = "__all__";

export function StagePopup({
  stageId,
  stakeholders,
  onClose,
  onOpenStakeholder,
}: {
  stageId: string | null;
  stakeholders: Stakeholder[];
  onClose: () => void;
  onOpenStakeholder: (s: Stakeholder) => void;
}) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState(ALL);
  const [archetype, setArchetype] = useState(ALL);

  const inStage = useMemo(
    () => stakeholders.filter((s) => s.current_stage === stageId),
    [stakeholders, stageId],
  );

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inStage.filter((s) => {
      if (industry !== ALL && !s.industries.includes(industry)) return false;
      if (archetype !== ALL && s.archetype !== archetype) return false;
      if (!q) return true;
      const haystack = [
        s.name,
        s.about,
        s.archetype,
        s.companies.join(" "),
        s.industries.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [inStage, search, industry, archetype]);

  if (!stageId) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: stageColor(stageId) }}
            />
            {stageLabel(stageId)}
          </DialogTitle>
          <DialogDescription>
            {inStage.length} {inStage.length === 1 ? "stakeholder" : "stakeholders"} in this
            stage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, about, industry, archetype"
              className="bg-card pl-9"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="bg-card sm:flex-1">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All industries</SelectItem>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={archetype} onValueChange={setArchetype}>
              <SelectTrigger className="bg-card sm:flex-1">
                <SelectValue placeholder="Archetype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All archetypes</SelectItem>
                {ARCHETYPES.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setIndustry(ALL);
                setArchetype(ALL);
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {results.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No stakeholders match this view.
            </p>
          )}
          {results.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpenStakeholder(s)}
              className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-input hover:bg-secondary/50"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-foreground">{s.name}</span>
                {s.archetype && (
                  <span className="text-xs text-muted-foreground">{s.archetype}</span>
                )}
              </div>
              {s.about && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.about}</p>
              )}
              {(s.industries.length > 0 || s.companies.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.industries.map((i) => (
                    <Chip key={i}>{i}</Chip>
                  ))}
                  {s.companies.map((c) => (
                    <Chip key={c} tone="outline">
                      {c}
                    </Chip>
                  ))}
                </div>
              )}
              {s.comments && (
                <p className="mt-2 line-clamp-1 text-xs italic text-muted-foreground">
                  “{s.comments}”
                </p>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
