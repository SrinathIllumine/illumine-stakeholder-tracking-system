-- Restrict sign-up/sign-in to an explicit allowlist of team email addresses.
-- Applies regardless of sign-in method (password or Google OAuth), since
-- every method inserts a row into auth.users on first login.

CREATE OR REPLACE FUNCTION public.enforce_email_allowlist()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT (lower(NEW.email) = ANY (ARRAY['suby0sri@gmail.com', 'vsrinathsalem@gmail.com'])) THEN
    RAISE EXCEPTION 'Sign-up is restricted to invited team members only.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS enforce_email_allowlist_trigger ON auth.users;
CREATE TRIGGER enforce_email_allowlist_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_email_allowlist();

-- Defense in depth: even for an account that already exists under a
-- different email, deny it data access at the RLS layer too, so the same
-- shared content stays visible to (and only to) the allowlisted logins.
CREATE OR REPLACE FUNCTION public.is_allowed_user()
RETURNS BOOLEAN AS $$
  SELECT lower(coalesce((auth.jwt() ->> 'email'), '')) = ANY (
    ARRAY['suby0sri@gmail.com', 'vsrinathsalem@gmail.com']
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Signed-in users can read stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Signed-in users can add stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Signed-in users can edit stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Signed-in users can remove stakeholders" ON public.stakeholders;

CREATE POLICY "Allowlisted users can read stakeholders"
  ON public.stakeholders FOR SELECT TO authenticated
  USING (public.is_allowed_user());

CREATE POLICY "Allowlisted users can add stakeholders"
  ON public.stakeholders FOR INSERT TO authenticated
  WITH CHECK (public.is_allowed_user());

CREATE POLICY "Allowlisted users can edit stakeholders"
  ON public.stakeholders FOR UPDATE TO authenticated
  USING (public.is_allowed_user())
  WITH CHECK (public.is_allowed_user());

CREATE POLICY "Allowlisted users can remove stakeholders"
  ON public.stakeholders FOR DELETE TO authenticated
  USING (public.is_allowed_user());

DROP POLICY IF EXISTS "Signed-in users can read stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Signed-in users can add stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Signed-in users can edit stage history" ON public.stage_history;
DROP POLICY IF EXISTS "Signed-in users can remove stage history" ON public.stage_history;

CREATE POLICY "Allowlisted users can read stage history"
  ON public.stage_history FOR SELECT TO authenticated
  USING (public.is_allowed_user());

CREATE POLICY "Allowlisted users can add stage history"
  ON public.stage_history FOR INSERT TO authenticated
  WITH CHECK (public.is_allowed_user());

CREATE POLICY "Allowlisted users can edit stage history"
  ON public.stage_history FOR UPDATE TO authenticated
  USING (public.is_allowed_user())
  WITH CHECK (public.is_allowed_user());

CREATE POLICY "Allowlisted users can remove stage history"
  ON public.stage_history FOR DELETE TO authenticated
  USING (public.is_allowed_user());
