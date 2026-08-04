import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Funnel } from "@/components/stakeholders/Funnel";
import { AddStakeholderDialog } from "@/components/stakeholders/AddStakeholderDialog";
import { StagePopup } from "@/components/stakeholders/StagePopup";
import { StakeholderDetail } from "@/components/stakeholders/StakeholderDetail";
import { MoveStageDialog } from "@/components/stakeholders/MoveStageDialog";
import { historyQuery, stakeholdersQuery } from "@/lib/stakeholders";
import { exportWorkbook } from "@/lib/export-excel";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Stakeholder Documentation & Tracking System" },
      {
        name: "description",
        content:
          "Stakeholder Flow is a shared web app for tracking partner relationships through a 5-stage funnel.",
      },
      { property: "og:title", content: "Stakeholder Documentation & Tracking System" },
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
  const navigate = useNavigate();
  const { session, loading: authLoading } = useSession();
  const authed = Boolean(session);

  useEffect(() => {
    if (!authLoading && !session) void navigate({ to: "/auth" });
  }, [authLoading, session, navigate]);

  const { data: stakeholders = [], isLoading } = useQuery({
    ...stakeholdersQuery,
    enabled: authed,
  });
  const { data: history = [] } = useQuery({ ...historyQuery, enabled: authed });

  const [addOpen, setAddOpen] = useState(false);
  const [stageId, setStageId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [moveTo, setMoveTo] = useState<string | null>(null);

  const detail = useMemo(
    () => stakeholders.find((s) => s.id === detailId) ?? null,
    [stakeholders, detailId],
  );

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Stakeholder Documentation &amp; Tracking System
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              A shared pipeline — everyone sees and edits the same records.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              onClick={async () => {
                await supabase.auth.signOut();
                void navigate({ to: "/auth" });
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pipeline
          </h2>
          <span className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${stakeholders.length} total`}
          </span>
        </div>

        <Funnel stakeholders={stakeholders} onSelectStage={setStageId} />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Click any stage to view, search and filter the stakeholders inside it.
        </p>
      </section>

      <AddStakeholderDialog open={addOpen} onOpenChange={setAddOpen} />

      {stageId && !detail && (
        <StagePopup
          stageId={stageId}
          stakeholders={stakeholders}
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
