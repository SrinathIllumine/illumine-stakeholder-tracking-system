CREATE TABLE public.stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  about TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  industries TEXT[] NOT NULL DEFAULT '{}',
  companies TEXT[] NOT NULL DEFAULT '{}',
  archetype TEXT NOT NULL DEFAULT '',
  current_stage TEXT NOT NULL DEFAULT 'contacted',
  comments TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.stage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stakeholder_id UUID NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  from_stage TEXT NOT NULL,
  to_stage TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX stage_history_stakeholder_id_idx ON public.stage_history(stakeholder_id);
CREATE INDEX stakeholders_current_stage_idx ON public.stakeholders(current_stage);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stakeholders TO anon, authenticated;
GRANT ALL ON public.stakeholders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stage_history TO anon, authenticated;
GRANT ALL ON public.stage_history TO service_role;

ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shared workspace can read stakeholders" ON public.stakeholders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Shared workspace can add stakeholders" ON public.stakeholders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Shared workspace can edit stakeholders" ON public.stakeholders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Shared workspace can remove stakeholders" ON public.stakeholders FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Shared workspace can read stage history" ON public.stage_history FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Shared workspace can add stage history" ON public.stage_history FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Shared workspace can edit stage history" ON public.stage_history FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Shared workspace can remove stage history" ON public.stage_history FOR DELETE TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_stakeholders_updated_at
BEFORE UPDATE ON public.stakeholders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();