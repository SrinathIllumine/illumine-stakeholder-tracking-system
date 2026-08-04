import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { stageColor, stageLabel } from "@/lib/stages";
import { moveStakeholder, type Stakeholder } from "@/lib/stakeholders";

export function MoveStageDialog({
  stakeholder,
  toStage,
  onClose,
}: {
  stakeholder: Stakeholder | null;
  toStage: string | null;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();
  const open = Boolean(stakeholder && toStage);

  useEffect(() => {
    if (open) setNote("");
  }, [open]);

  const mutation = useMutation({
    mutationFn: moveStakeholder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders"] });
      queryClient.invalidateQueries({ queryKey: ["stage_history"] });
      toast.success("Stage updated");
      onClose();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!stakeholder || !toStage) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move {stakeholder.name}?</DialogTitle>
          <DialogDescription>
            Confirm this stage change. It is saved for everyone using this pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-secondary/60 p-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: stageColor(stakeholder.current_stage) }}
          >
            {stageLabel(stakeholder.current_stage)}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span
            className="rounded-full px-3 py-1 text-xs font-medium text-white"
            style={{ backgroundColor: stageColor(toStage) }}
          >
            {stageLabel(toStage)}
          </span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="stage-note">Notes on what happened at this stage</Label>
          <Textarea
            id="stage-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate({
                id: stakeholder.id,
                from: stakeholder.current_stage,
                to: toStage,
                note: note.trim(),
              })
            }
          >
            {mutation.isPending ? "Moving…" : "Confirm move"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
