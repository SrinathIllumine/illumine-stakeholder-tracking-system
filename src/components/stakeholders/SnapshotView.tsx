import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buildStageIndustryMatrix, INDUSTRIES } from "@/lib/stages";
import type { Stakeholder } from "@/lib/stakeholders";

export function SnapshotView({
  open,
  onOpenChange,
  stakeholders,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stakeholders: Stakeholder[];
}) {
  const matrix = useMemo(() => buildStageIndustryMatrix(stakeholders), [stakeholders]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Snapshot View</DialogTitle>
          <DialogDescription>
            Consolidated stakeholder count by stage and industry, as of now.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                {INDUSTRIES.map((ind) => (
                  <TableHead key={ind} className="whitespace-nowrap">
                    {ind}
                  </TableHead>
                ))}
                <TableHead className="whitespace-nowrap font-semibold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.map((row) => (
                <TableRow key={row.stageId}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {row.stageLabel}
                  </TableCell>
                  {INDUSTRIES.map((ind) => (
                    <TableCell key={ind}>{row.counts[ind]}</TableCell>
                  ))}
                  <TableCell className="font-semibold">{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
