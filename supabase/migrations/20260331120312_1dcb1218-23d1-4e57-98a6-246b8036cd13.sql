
CREATE TABLE public.fact_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'text',
  overall_score INTEGER NOT NULL,
  summary TEXT,
  claims JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fact_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own fact checks"
  ON public.fact_checks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own fact checks"
  ON public.fact_checks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fact checks"
  ON public.fact_checks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
