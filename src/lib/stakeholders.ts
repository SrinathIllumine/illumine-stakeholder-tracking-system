import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_STAGE } from "./stages";

export interface Stakeholder {
  id: string;
  name: string;
  about: string;
  linkedin_url: string;
  industries: string[];
  companies: string[];
  archetype: string;
  current_stage: string;
  comments: string;
  created_at: string;
  updated_at: string;
}

export interface StageHistoryEntry {
  id: string;
  stakeholder_id: string;
  from_stage: string;
  to_stage: string;
  note: string;
  created_at: string;
}

export const stakeholdersQuery = queryOptions({
  queryKey: ["stakeholders"],
  queryFn: async (): Promise<Stakeholder[]> => {
    const { data, error } = await supabase
      .from("stakeholders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Stakeholder[];
  },
});

export const historyQuery = queryOptions({
  queryKey: ["stage_history"],
  queryFn: async (): Promise<StageHistoryEntry[]> => {
    const { data, error } = await supabase
      .from("stage_history")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as StageHistoryEntry[];
  },
});

export interface StakeholderInput {
  name: string;
  about: string;
  linkedin_url: string;
  industries: string[];
  companies: string[];
  archetype: string;
}

export async function createStakeholder(input: StakeholderInput) {
  const { data, error } = await supabase
    .from("stakeholders")
    .insert({ ...input, current_stage: DEFAULT_STAGE })
    .select()
    .single();
  if (error) throw error;
  return data as Stakeholder;
}

export async function updateStakeholder(
  id: string,
  patch: Partial<StakeholderInput> & { comments?: string },
) {
  const { error } = await supabase.from("stakeholders").update(patch).eq("id", id);
  if (error) throw error;
}

export async function moveStakeholder(args: {
  id: string;
  from: string;
  to: string;
  note: string;
}) {
  const { error } = await supabase
    .from("stakeholders")
    .update({ current_stage: args.to })
    .eq("id", args.id);
  if (error) throw error;

  const { error: historyError } = await supabase.from("stage_history").insert({
    stakeholder_id: args.id,
    from_stage: args.from,
    to_stage: args.to,
    note: args.note,
  });
  if (historyError) throw historyError;
}

export async function deleteStakeholder(id: string) {
  const { error } = await supabase.from("stakeholders").delete().eq("id", id);
  if (error) throw error;
}
