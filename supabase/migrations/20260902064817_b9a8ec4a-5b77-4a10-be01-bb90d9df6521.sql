DROP TRIGGER IF EXISTS enforce_email_allowlist_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.enforce_email_allowlist();
DROP FUNCTION IF EXISTS public.is_allowed_user();

DROP POLICY IF EXISTS "Allowlisted users can read stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Allowlisted users can add stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Allowlisted users can edit stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Allowlisted users can remove stakeholders" ON public.stakeholders;

DROP POLICY IF EXISTS "Allowlisted users can read stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Allowlisted users can add stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Allowlisted users can edit stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Allowlisted users can remove stage history" ON public.stage_history;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stakeholders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stage_history TO anon, authenticated;

CREATE POLICY "Public can read stakeholders"
  ON public.stakeholders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can add stakeholders"
  ON public.stakeholders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can edit stakeholders"
  ON public.stakeholders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can remove stakeholders"
  ON public.stakeholders FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Public can read stage history"
  ON public.stage_history FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can add stage history"
  ON public.stage_history FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can edit stage history"
  ON public.stage_history FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can remove stage history"
  ON public.stage_history FOR DELETE TO anon, authenticated USING (true);