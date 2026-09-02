import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INDUSTRIES } from "@/lib/stages";
import { Funnel } from "@/components/stakeholders/Funnel";
import { AddStakeholderDialog } from "@/components/stakeholders/AddStakeholderDialog";
import { StagePopup } from "@/components/stakeholders/StagePopup";
import { SnapshotView } from "@/components/stakeholders/SnapshotView";
import { StakeholderDetail } from "@/components/stakeholders/StakeholderDetail";
import { StakeholderList } from "@/components/stakeholders/StakeholderList";
import { MoveStageDialog } from "@/components/stakeholders/MoveStageDialog";
import { historyQuery, stakeholdersQuery } from "@/lib/stakeholders";
import { exportWorkbook } from "@/lib/export-excel";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Partner Database & Tracking System" },
      {
        name: "description",
        content:
          "Stakeholder Flow is a shared web app for tracking partner relationships through a 5-stage funnel.",
      },
      { property: "og:title", content: "Partner Database & Tracking System" },
      {
        property: "og:description",
        content:
          "Stakeholder Flow is a shared web app for tracking partner relationships through a 5-stage funnel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: stakeholders = [], isLoading } = useQuery(stakeholdersQuery);
  const { data: history = [] } = useQuery(historyQuery);

  const [addOpen, setAddOpen] = useState(false);
  const [stageId, setStageId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [moveTo, setMoveTo] = useState<string | null>(null);
  const [industry, setIndustry] = useState("__all__");
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [view, setView] = useState<"default" | "funnel">("default");

  const visible = useMemo(
    () =>
      industry === "__all__"
        ? stakeholders
        : stakeholders.filter((s) => s.industries.includes(industry)),
    [stakeholders, industry],
  );

  const detail = useMemo(
    () => stakeholders.find((s) => s.id === detailId) ?? null,
    [stakeholders, detailId],
  );

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/illumine-logo.svg" alt="Illumine" className="h-10 w-auto shrink-0" />
            <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              <span className="block">Partner Database &amp; Tracking System</span>
              <span className="block">For Retail Enablement System</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setSnapshotOpen(true)}
              disabled={stakeholders.length === 0}
            >
              <Camera className="mr-1.5 h-4 w-4" /> Snapshot View
            </Button>
            <Button
              variant="outline"
              onClick={() => exportWorkbook(stakeholders, history)}
              disabled={stakeholders.length === 0}
            >
              <Download className="mr-1.5 h-4 w-4" /> Download Excel
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add stakeholder
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Tabs value={view} onValueChange={(v) => setView(v as "default" | "funnel")}>
            <TabsList>
              <TabsTrigger value="default">Default view</TabsTrigger>
              <TabsTrigger value="funnel">Funnel view</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-[240px] bg-card" aria-label="Industry">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All industries</SelectItem>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {isLoading ? "Loading…" : `${visible.length} total`}
            </span>
          </div>
        </div>

        {view === "funnel" ? (
          <>
            <Funnel stakeholders={visible} onSelectStage={setStageId} />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Click any stage to view, search and filter the stakeholders inside it.
            </p>
          </>
        ) : (
          <StakeholderList stakeholders={visible} onOpenStakeholder={(s) => setDetailId(s.id)} />
        )}
      </section>

      <AddStakeholderDialog open={addOpen} onOpenChange={setAddOpen} />

      <SnapshotView
        open={snapshotOpen}
        onOpenChange={setSnapshotOpen}
        stakeholders={stakeholders}
      />

      {stageId && !detail && (
        <StagePopup
          stageId={stageId}
          stakeholders={visible}
          onClose={() => setStageId(null)}
          onOpenStakeholder={(s) => setDetailId(s.id)}
        />
      )}

      {detail && !moveTo && (
        <StakeholderDetail
          stakeholder={detail}
          history={history}
          onClose={() => setDetailId(null)}
          onRequestMove={setMoveTo}
        />
      )}

      <MoveStageDialog
        stakeholder={moveTo ? detail : null}
        toStage={moveTo}
        onClose={() => setMoveTo(null)}
      />
    </main>
  );
}
