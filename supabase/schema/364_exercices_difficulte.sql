-- =============================================================================
-- 364 — LES EXERCICES DE CHAPITRE PAR DIFFICULTÉ (Lucas, 17/09/2026)
--
-- Chaque fiche porte désormais des sujets ÉCRITS D'AVANCE, un par niveau
-- (1 facile · 2 moyen · 3 difficile), avec leur corrigé type rangé dans
-- `contenu.corrige` (il ne part vers l'élève qu'après sa copie, cf.
-- lib/exercice.exercicePublic). L'IA ne fait plus que CORRIGER ces sujets ;
-- elle en rédige encore un neuf quand l'élève demande « Un autre sujet » ou
-- quand la fiche n'a rien au catalogue (niveaux pas encore remplis).
--
--   difficulte  1..3 ; NULL pour les sujets rédigés avant cette migration
--   origine     'catalogue' (seed relu) ou 'ia' (rédigé à la demande)
--
-- PRÉREQUIS : 360 (chapter_exercices). Idempotent. À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- Le contenu de 6e arrive par 365_exercices_6e.sql, à passer ENSUITE.
-- =============================================================================

ALTER TABLE public.chapter_exercices
  ADD COLUMN IF NOT EXISTS difficulte SMALLINT,
  ADD COLUMN IF NOT EXISTS origine    TEXT NOT NULL DEFAULT 'ia';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chapter_exercices_difficulte_check'
      AND conrelid = 'public.chapter_exercices'::regclass
  ) THEN
    ALTER TABLE public.chapter_exercices
      ADD CONSTRAINT chapter_exercices_difficulte_check
      CHECK (difficulte IS NULL OR difficulte BETWEEN 1 AND 3);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chapter_exercices_origine_check'
      AND conrelid = 'public.chapter_exercices'::regclass
  ) THEN
    ALTER TABLE public.chapter_exercices
      ADD CONSTRAINT chapter_exercices_origine_check
      CHECK (origine IN ('ia', 'catalogue'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS chapter_exercices_chapter_difficulte_idx
  ON public.chapter_exercices (chapter_id, difficulte, origine, created_at DESC);

-- Un élève ne peut ranger que des sujets RÉDIGÉS PAR L'IA à sa demande : le
-- catalogue ne s'écrit que par les seeds (rôle postgres, hors RLS).
DROP POLICY IF EXISTS "chapter_exercices_insert" ON public.chapter_exercices;
CREATE POLICY "chapter_exercices_insert" ON public.chapter_exercices
  FOR INSERT TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()) AND origine = 'ia');
