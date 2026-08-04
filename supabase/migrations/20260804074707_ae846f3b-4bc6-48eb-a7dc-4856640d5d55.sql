-- Remove fully-public policies
DROP POLICY IF EXISTS "Shared workspace can add stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Shared workspace can edit stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Shared workspace can read stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Shared workspace can remove stakeholders" ON public.stakeholders;

DROP POLICY IF EXISTS "Shared workspace can add stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Shared workspace can edit stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Shared workspace can read stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Shared workspace can remove stage history" ON public.stage_history;

-- Revoke anonymous access at the privilege level too
REVOKE ALL ON public.stakeholders FROM anon;
REVOKE ALL ON public.stage_history FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stakeholders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stage_history TO authenticated;
GRANT ALL ON public.stakeholders TO service_role;
GRANT ALL ON public.stage_history TO service_role;

-- Signed-in team members only
CREATE POLICY "Signed-in users can read stakeholders"
  ON public.stakeholders FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Signed-in users can add stakeholders"
  ON public.stakeholders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Signed-in users can edit stakeholders"
  ON public.stakeholders FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Signed-in users can remove stakeholders"
  ON public.stakeholders FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Signed-in users can read stage history"
  ON public.stage_history FOR SELECT TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Signed-in users can add stage history"
  ON public.stage_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Signed-in users can edit stage history"
  ON public.stage_history FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Signed-in users can remove stage history"
  ON public.stage_history FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);