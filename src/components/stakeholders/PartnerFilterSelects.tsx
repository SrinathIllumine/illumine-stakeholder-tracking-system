import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ARCHETYPES, COMMENT_TAGS, OTHERS_COMMENT_TAG, STAGES } from "@/lib/stages";

export const FILTER_ALL = "__all__";

/** Archetype / partner tag / latest stage selects, shared by the stage popup and the default view. */
export function PartnerFilterSelects({
  archetype,
  onArchetypeChange,
  commentTag,
  onCommentTagChange,
  latestStage,
  onLatestStageChange,
}: {
  archetype: string;
  onArchetypeChange: (value: string) => void;
  commentTag: string;
  onCommentTagChange: (value: string) => void;
  latestStage: string;
  onLatestStageChange: (value: string) => void;
}) {
  return (
    <>
      <Select value={archetype} onValueChange={onArchetypeChange}>
        <SelectTrigger className="bg-card sm:flex-1">
          <SelectValue placeholder="Archetype" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>All archetypes</SelectItem>
          {ARCHETYPES.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={commentTag} onValueChange={onCommentTagChange}>
        <SelectTrigger className="bg-card sm:flex-1">
          <SelectValue placeholder="Partner tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>Partner tags</SelectItem>
          {COMMENT_TAGS.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
          <SelectItem value={OTHERS_COMMENT_TAG}>{OTHERS_COMMENT_TAG}</SelectItem>
        </SelectContent>
      </Select>
      <Select value={latestStage} onValueChange={onLatestStageChange}>
        <SelectTrigger className="bg-card sm:flex-1">
          <SelectValue placeholder="Latest stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>All latest stages</SelectItem>
          {STAGES.map((stage) => (
            <SelectItem key={stage.id} value={stage.id}>
              {stage.shortLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
