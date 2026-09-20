-- =============================================================================
-- Studuel — Migration 187 : onglet Moi refondu — trajectoire au bac + levier
-- « Questions ».
--
-- 1. TERM_GRADES : moyennes trimestrielles saisies À LA MAIN par l'élève.
--    La carte « Ta trajectoire au bac » calcule d'abord les moyennes depuis les
--    notes réelles (school_grades, migration 167) ; cette table sert de REPLI
--    quand un trimestre n'a aucune note saisie (l'élève tape directement sa
--    moyenne du bulletin). En cas de doublon, le calcul depuis school_grades
--    gagne (lib/trajectoire-bac.ts) — pas de double source de vérité.
--    `school_year` = année civile de la rentrée (sept.) : « 2025 » couvre
--    sept. 2025 → août 2026, même convention que lib/notes.ts.
--
-- 2. HABIT_CATALOG : nouvelle habitude « Se tester en questions » (récupération
--    active) — support du levier/driver « Questions » de la hero card.
--
-- Sécurité : RLS « chacun ses lignes » (modèle 167). Pas d'enjeu d'économie
-- (aucune pièce/XP à la saisie) → écriture directe, pas de RPC.
--
-- PRÉREQUIS : schema.sql (profiles), 010_moi.sql (habit_catalog). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------- moyennes trimestrielles saisies --
CREATE TABLE IF NOT EXISTS public.term_grades (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  school_year SMALLINT NOT NULL CHECK (school_year BETWEEN 2000 AND 2100),
  term        SMALLINT NOT NULL CHECK (term BETWEEN 1 AND 3),
  average     NUMERIC(4, 2) NOT NULL CHECK (average >= 0 AND average <= 20),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, school_year, term)
);

ALTER TABLE public.term_grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "term_grades_all_own" ON public.term_grades;
CREATE POLICY "term_grades_all_own" ON public.term_grades
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.term_grades TO authenticated;

-- --------------------------------------------- habitude du levier Questions --
INSERT INTO public.habit_catalog (id, title, icon, rationale, validation_type, default_target) VALUES
  ('55555555-5555-4555-8555-555555555515', 'Se tester en questions', '🧠',
   'Se poser des questions (au lieu de relire) est la technique de mémorisation la plus efficace connue : la récupération active renforce la trace mémoire à chaque essai, même raté.',
   'manual', '{"days": [0,1,2,3,4,5,6], "time": "18:00"}')
ON CONFLICT (id) DO NOTHING;
