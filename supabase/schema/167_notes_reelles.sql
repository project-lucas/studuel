-- =============================================================================
-- Studuel — Migration 167 : notes réelles de l'élève (onglet Moi)
-- L'élève saisit les notes obtenues à ses vrais contrôles (matière, note /X,
-- coefficient, date). La carte « Mes notes » de Moi en tire la moyenne par
-- trimestre et l'évolution — le pont entre l'app et la réalité scolaire.
-- Logique pure côté app : lib/notes.ts (trimestres, moyennes pondérées).
--
-- Sécurité : RLS « chacun ses lignes » (modèle 027_debrief.sql). Pas d'enjeu
-- d'économie (aucune pièce/XP créditée à la saisie) → écriture directe par la
-- table, pas besoin de RPC atomique (les lignes sont indépendantes, aucun
-- read-modify-write concurrent).
--
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.school_grades (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,              -- slug de la matière (ex. 'maths')
  label       TEXT,                       -- intitulé libre (« Contrôle ch. 3 »)
  score       NUMERIC(5, 2) NOT NULL CHECK (score >= 0),
  out_of      NUMERIC(5, 2) NOT NULL DEFAULT 20 CHECK (out_of > 0 AND out_of <= 100),
  coefficient NUMERIC(4, 2) NOT NULL DEFAULT 1 CHECK (coefficient > 0 AND coefficient <= 10),
  date        DATE NOT NULL,              -- jour du contrôle (clé UTC)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (score <= out_of)
);

CREATE INDEX IF NOT EXISTS school_grades_user_date_idx
  ON public.school_grades (user_id, date DESC);

-- -----------------------------------------------------------------------------
-- RLS — chacun ne voit et ne modifie que ses notes
-- -----------------------------------------------------------------------------
ALTER TABLE public.school_grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "school_grades_all_own" ON public.school_grades;
CREATE POLICY "school_grades_all_own" ON public.school_grades
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
