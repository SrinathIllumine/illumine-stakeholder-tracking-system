import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { ARCHETYPES, INDUSTRIES } from "@/lib/stages";
import { createStakeholder } from "@/lib/stakeholders";
import { MultiSelect } from "./MultiSelect";
import { ChipInput } from "./ChipInput";

const empty = {
  name: "",
  about: "",
  linkedin_url: "",
  industries: [] as string[],
  companies: [] as string[],
  archetype: "",
};

export function AddStakeholderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState(empty);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createStakeholder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders"] });
      toast.success("Stakeholder added at Contacted");
      setForm(empty);
      onOpenChange(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add stakeholder</DialogTitle>
          <DialogDescription>
            New stakeholders start at the Contacted stage.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) {
              toast.error("Name is required");
              return;
            }
            mutation.mutate({ ...form, name: form.name.trim() });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              rows={3}
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkedin">LinkedIn profile</Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/…"
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Industries</Label>
            <MultiSelect
              options={INDUSTRIES}
              value={form.industries}
              onChange={(industries) => setForm({ ...form, industries })}
              placeholder="Select industries"
            />
            {form.industries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.industries.map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"
                  >
                    {i}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Companies</Label>
            <ChipInput
              value={form.companies}
              onChange={(companies) => setForm({ ...form, companies })}
              placeholder="Type a company and press Enter"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Partner archetype</Label>
            <Select
              value={form.archetype}
              onValueChange={(archetype) => setForm({ ...form, archetype })}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding…" : "Add stakeholder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
