-- =============================================================================
-- Scolaria — Migration 025 : structure des cours (template dupliquable)
-- Chaque leçon devient un hub à 4 supports : Cours, Révision (fiche),
-- Studygram (visuel) et Quiz. L'anneau d'avancement de la leçon se remplit
-- à mesure que l'élève consulte les supports et améliore son score au quiz.
-- PRÉREQUIS : 008_reviser.sql et 009_lesson_completions.sql exécutés. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LESSONS — contenus des supports Révision et Studygram
--    (le Cours vit déjà dans lessons.content, le Quiz dans quizzes.lesson_id)
-- -----------------------------------------------------------------------------
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS revision_sheet TEXT;   -- fiche de révision (markdown maison)
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS studygram_url TEXT;    -- visuel « studygram » (image)

-- -----------------------------------------------------------------------------
-- 2. LESSON_ACTIVITIES — supports consultés par l'élève
--    Le Cours garde sa table historique (lesson_completions, plancher 30 %) ;
--    ici on trace la lecture de la fiche de révision et du studygram.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_activities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  lesson_id  UUID NOT NULL REFERENCES public.lessons (id) ON DELETE CASCADE,
  activity   TEXT NOT NULL CHECK (activity IN ('revision', 'studygram')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id, activity)
);
CREATE INDEX IF NOT EXISTS lesson_activities_user_idx
  ON public.lesson_activities (user_id, created_at DESC);

ALTER TABLE public.lesson_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lesson_activities_select_own" ON public.lesson_activities;
CREATE POLICY "lesson_activities_select_own" ON public.lesson_activities
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "lesson_activities_insert_own" ON public.lesson_activities;
CREATE POLICY "lesson_activities_insert_own" ON public.lesson_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. SEED — fiche de révision d'exemple sur la leçon 1 de chaque chapitre,
--    pour que la tuile « Révision » du template soit visible dès maintenant.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
SET revision_sheet =
  '# L''essentiel à retenir' || E'\n\n' ||
  '- Relis le cours une fois, puis résume chaque partie en une phrase.' || E'\n' ||
  '- Note les définitions et formules clés sur une fiche.' || E'\n' ||
  '- Vérifie-toi avec le quiz : vise au moins 8/10.' || E'\n\n' ||
  '> La fiche détaillée de cette leçon arrive bientôt.'
WHERE l.position = 1 AND l.revision_sheet IS NULL;
