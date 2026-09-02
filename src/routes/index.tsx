import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INDUSTRIES, classifyComment } from "@/lib/stages";
import { Funnel } from "@/components/stakeholders/Funnel";
import { AddStakeholderDialog } from "@/components/stakeholders/AddStakeholderDialog";
import { StagePopup } from "@/components/stakeholders/StagePopup";
import { SnapshotView } from "@/components/stakeholders/SnapshotView";
import { StakeholderDetail } from "@/components/stakeholders/StakeholderDetail";
import { StakeholderList } from "@/components/stakeholders/StakeholderList";
import { IndustrySidebar } from "@/components/stakeholders/IndustrySidebar";
import { FILTER_ALL, PartnerFilterSelects } from "@/components/stakeholders/PartnerFilterSelects";
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
  const [archetype, setArchetype] = useState(FILTER_ALL);
  const [commentTag, setCommentTag] = useState(FILTER_ALL);
  const [latestStage, setLatestStage] = useState(FILTER_ALL);
  const [search, setSearch] = useState("");

  const visible = useMemo(
    () =>
      industry === "__all__"
        ? stakeholders
        : stakeholders.filter((s) => s.industries.includes(industry)),
    [stakeholders, industry],
  );

  const defaultViewStakeholders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return visible.filter((s) => {
      if (archetype !== FILTER_ALL && s.archetype !== archetype) return false;
      if (commentTag !== FILTER_ALL && classifyComment(s.comments) !== commentTag) return false;
      if (latestStage !== FILTER_ALL && s.current_stage !== latestStage) return false;
      if (!q) return true;
      const haystack = [s.name, s.about, s.archetype, s.companies.join(" "), s.industries.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [visible, archetype, commentTag, latestStage, search]);

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
            {view === "funnel" && (
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
            )}
            <span className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${view === "funnel" ? visible.length : defaultViewStakeholders.length} total`}
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
          <div className="flex flex-col gap-6 sm:flex-row">
            <IndustrySidebar industry={industry} onChange={setIndustry} />
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <PartnerFilterSelects
                  archetype={archetype}
                  onArchetypeChange={setArchetype}
                  commentTag={commentTag}
                  onCommentTagChange={setCommentTag}
                  latestStage={latestStage}
                  onLatestStageChange={setLatestStage}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setArchetype(FILTER_ALL);
                    setCommentTag(FILTER_ALL);
                    setLatestStage(FILTER_ALL);
                    setSearch("");
                  }}
                >
                  Clear filters
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, company, about, industry, archetype"
                  className="bg-card pl-9"
                />
              </div>
              <StakeholderList
                stakeholders={defaultViewStakeholders}
                onOpenStakeholder={(s) => setDetailId(s.id)}
              />
            </div>
          </div>
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
