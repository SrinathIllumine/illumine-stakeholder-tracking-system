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
import {
  ARCHETYPES,
  COMMENT_TAGS,
  INDUSTRIES,
  OTHERS_COMMENT_TAG,
  STAGES,
  classifyComment,
  hasReachedStage,
  stageColor,
  stageLabel,
} from "@/lib/stages";
import type { Stakeholder } from "@/lib/stakeholders";
import { StakeholderCard } from "./StakeholderCard";

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
  const [commentTag, setCommentTag] = useState(ALL);
  const [latestStage, setLatestStage] = useState(ALL);

  const inStage = useMemo(
    () =>
      stageId ? stakeholders.filter((s) => hasReachedStage(s.current_stage, stageId)) : [],
    [stakeholders, stageId],
  );

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inStage.filter((s) => {
      if (industry !== ALL && !s.industries.includes(industry)) return false;
      if (archetype !== ALL && s.archetype !== archetype) return false;
      if (commentTag !== ALL && classifyComment(s.comments) !== commentTag) return false;
      if (latestStage !== ALL && s.current_stage !== latestStage) return false;
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
  }, [inStage, search, industry, archetype, commentTag, latestStage]);

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
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
            <Select value={commentTag} onValueChange={setCommentTag}>
              <SelectTrigger className="bg-card sm:flex-1">
                <SelectValue placeholder="Partner tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Partner tags</SelectItem>
                {COMMENT_TAGS.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
                <SelectItem value={OTHERS_COMMENT_TAG}>{OTHERS_COMMENT_TAG}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={latestStage} onValueChange={setLatestStage}>
              <SelectTrigger className="bg-card sm:flex-1">
                <SelectValue placeholder="Latest stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All latest stages</SelectItem>
                {STAGES.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.shortLabel}
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
                setCommentTag(ALL);
                setLatestStage(ALL);
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
            <StakeholderCard key={s.id} stakeholder={s} onClick={() => onOpenStakeholder(s)} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
