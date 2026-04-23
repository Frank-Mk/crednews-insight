-- Add shareable id column to fact_checks
ALTER TABLE public.fact_checks
ADD COLUMN IF NOT EXISTS share_id uuid UNIQUE;

CREATE INDEX IF NOT EXISTS idx_fact_checks_share_id ON public.fact_checks(share_id);

-- Allow update so users can generate/revoke share link for own rows
CREATE POLICY "Users can update own fact checks"
ON public.fact_checks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow anyone (anon + authenticated) to read a fact check via its share_id
CREATE POLICY "Public can read shared fact checks"
ON public.fact_checks
FOR SELECT
TO anon, authenticated
USING (share_id IS NOT NULL);
