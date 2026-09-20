-- =============================================================================
-- Scolaria — Migration 027 : débrief d'habitudes (onglet Moi)
-- L'élève référence ses habitudes-freins (catalogue fermé dans lib/debrief.ts,
-- comme le Trésor) et raconte chaque jour ce qui s'est passé : rechute ('bad')
-- ou habitude saine tenue ('good').
-- PRÉREQUIS : schema.sql exécutée. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. DEBRIEF_HABITS — les habitudes-freins référencées par l'élève
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.debrief_habits (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  pair_id    TEXT NOT NULL,               -- id du catalogue lib/debrief.ts
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pair_id)
);

-- -----------------------------------------------------------------------------
-- 2. DEBRIEF_LOGS — le débrief du jour : une issue par paire et par jour
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.debrief_logs (
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  pair_id TEXT NOT NULL,
  date    DATE NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('bad', 'good')),
  PRIMARY KEY (user_id, pair_id, date)
);
CREATE INDEX IF NOT EXISTS debrief_logs_user_date_idx
  ON public.debrief_logs (user_id, date DESC);

-- -----------------------------------------------------------------------------
-- RLS — chacun ne voit et ne modifie que ses lignes
-- -----------------------------------------------------------------------------
ALTER TABLE public.debrief_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debrief_logs   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "debrief_habits_all_own" ON public.debrief_habits;
CREATE POLICY "debrief_habits_all_own" ON public.debrief_habits
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "debrief_logs_all_own" ON public.debrief_logs;
CREATE POLICY "debrief_logs_all_own" ON public.debrief_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
