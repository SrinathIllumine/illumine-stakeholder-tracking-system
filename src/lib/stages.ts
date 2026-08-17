export type StageId =
  | "contacted"
  | "connected"
  | "initial_interaction"
  | "discovery_workshop"
  | "closure";

export interface Stage {
  id: StageId;
  label: string;
  color: string;
  /** relative funnel width in percent */
  width: number;
}

/** Single source of truth for stage names, colors and order. */
export const STAGES: Stage[] = [
  { id: "contacted", label: "Contacted", color: "#1c2541", width: 100 },
  { id: "connected", label: "Connected", color: "#2e4374", width: 86 },
  {
    id: "initial_interaction",
    label: "Shows initial interest",
    color: "#1e6b6b",
    width: 72,
  },
  {
    id: "discovery_workshop",
    label: "Shows deep interest (discovery workshop)",
    color: "#c1503e",
    width: 58,
  },
  {
    id: "closure",
    label: "Complete formalities & ready to start (contract closure)",
    color: "#2f7d4f",
    width: 44,
  },
];

export const DEFAULT_STAGE: StageId = "contacted";

export function stageLabel(id: string): string {
  return STAGES.find((s) => s.id === id)?.label ?? id;
}

export function stageColor(id: string): string {
  return STAGES.find((s) => s.id === id)?.color ?? "#1c2541";
}

export function stageIndex(id: string): number {
  return STAGES.findIndex((s) => s.id === id);
}

/** Cumulative funnel rule: a stakeholder appears in every stage up to their current one. */
export function hasReachedStage(currentStage: string, stageId: string): boolean {
  const current = stageIndex(currentStage);
  const target = stageIndex(stageId);
  if (current < 0 || target < 0) return currentStage === stageId;
  return current >= target;
}

export const INDUSTRIES = [
  "Agriculture Inputs",
  "Automotive & Auto Ancillaries",
  "BFSI",
  "Building Materials (Cement & Paints)",
  "Chemicals",
  "Consumer Durables / Industrial",
  "Energy & Fuel",
  "Energy Storage",
  "FMCG",
  "IT Hardware",
  "Metals & Mining",
  "Pharma",
  "Retail",
  "Telecom",
  "Textiles",
] as const;

export const ARCHETYPES = [
  "Ex-BU Head / Ex-Head of Retail / M&S / Ex-GM or Ex-VP",
  "Ex-Tech Software firms selling to BHs",
  "Ex-Consulting Partner",
] as const;
