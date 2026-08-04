import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ARCHETYPES, INDUSTRIES, STAGES, stageColor, stageLabel } from "@/lib/stages";
import {
  updateStakeholder,
  type Stakeholder,
  type StageHistoryEntry,
} from "@/lib/stakeholders";
import { MultiSelect } from "./MultiSelect";
import { ChipInput } from "./ChipInput";
import { Chip } from "./Chips";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function StakeholderDetail({
  stakeholder,
  history,
  onClose,
  onRequestMove,
}: {
  stakeholder: Stakeholder | null;
  history: StageHistoryEntry[];
  onClose: () => void;
  onRequestMove: (toStage: string) => void;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Stakeholder | null>(stakeholder);
  const [comments, setComments] = useState(stakeholder?.comments ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(stakeholder);
    setComments(stakeholder?.comments ?? "");
    setEditing(false);
  }, [stakeholder]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["stakeholders"] });

  const saveProfile = useMutation({
    mutationFn: async (next: Stakeholder) =>
      updateStakeholder(next.id, {
        name: next.name.trim(),
        about: next.about,
        linkedin_url: next.linkedin_url,
        industries: next.industries,
        companies: next.companies,
        archetype: next.archetype,
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Profile saved");
      setEditing(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const autosaveComments = (value: string) => {
    setComments(value);
    if (!stakeholder) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await updateStakeholder(stakeholder.id, { comments: value });
        invalidate();
      } catch (error) {
        toast.error((error as Error).message);
      }
    }, 600);
  };

  if (!stakeholder || !draft) return null;

  const entries = history
    .filter((h) => h.stakeholder_id === stakeholder.id)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{stakeholder.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: stageColor(stakeholder.current_stage) }}
            >
              {stageLabel(stakeholder.current_stage)}
            </span>
            <span>Added {formatDate(stakeholder.created_at)}</span>
          </DialogDescription>
        </DialogHeader>

        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Profile</h3>
            {!editing && (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>About</Label>
                <Textarea
                  rows={3}
                  value={draft.about}
                  onChange={(e) => setDraft({ ...draft, about: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>LinkedIn profile</Label>
                <Input
                  value={draft.linkedin_url}
                  onChange={(e) => setDraft({ ...draft, linkedin_url: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Industries</Label>
                <MultiSelect
                  options={INDUSTRIES}
                  value={draft.industries}
                  onChange={(industries) => setDraft({ ...draft, industries })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Companies</Label>
                <ChipInput
                  value={draft.companies}
                  onChange={(companies) => setDraft({ ...draft, companies })}
                  placeholder="Type a company and press Enter"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Partner archetype</Label>
                <Select
                  value={draft.archetype}
                  onValueChange={(archetype) => setDraft({ ...draft, archetype })}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select archetype" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARCHETYPES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => saveProfile.mutate(draft)}
                  disabled={saveProfile.isPending}
                >
                  Save changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDraft(stakeholder);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              {stakeholder.about && (
                <p className="text-muted-foreground">{stakeholder.about}</p>
              )}
              {stakeholder.linkedin_url && (
                <a
                  href={stakeholder.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4"
                >
                  LinkedIn profile <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {stakeholder.archetype && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Archetype:</span>{" "}
                  {stakeholder.archetype}
                </p>
              )}
              {stakeholder.industries.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {stakeholder.industries.map((i) => (
                    <Chip key={i}>{i}</Chip>
                  ))}
                </div>
              )}
              {stakeholder.companies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {stakeholder.companies.map((c) => (
                    <Chip key={c} tone="outline">
                      {c}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="space-y-1.5 rounded-xl border border-border bg-card p-4">
          <Label htmlFor="comments">Any comments on the stakeholder</Label>
          <Textarea
            id="comments"
            rows={4}
            value={comments}
            onChange={(e) => autosaveComments(e.target.value)}
            placeholder="Saves automatically as you type"
          />
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Move to stage</h3>
          <div className="flex flex-wrap gap-2">
            {STAGES.filter((s) => s.id !== stakeholder.current_stage).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onRequestMove(s.id)}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: s.color }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Stage history</h3>
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No stage changes yet — still at {stageLabel(stakeholder.current_stage)}.
            </p>
          ) : (
            <ol className="space-y-3">
              {entries.map((entry) => (
                <li key={entry.id} className="border-l-2 border-border pl-3">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span
                      className="rounded-full px-2 py-0.5 font-medium text-white"
                      style={{ backgroundColor: stageColor(entry.from_stage) }}
                    >
                      {stageLabel(entry.from_stage)}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span
                      className="rounded-full px-2 py-0.5 font-medium text-white"
                      style={{ backgroundColor: stageColor(entry.to_stage) }}
                    >
                      {stageLabel(entry.to_stage)}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(entry.created_at)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
