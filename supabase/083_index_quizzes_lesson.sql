-- =============================================================================
-- Studuel — Migration 083 : index de perf sur quizzes.lesson_id
-- Le hub de leçon lit LE quiz d'une leçon en .maybeSingle()
-- (app/reviser/.../[lesson]/page.tsx, .../cours/page.tsx, app/admin/...) :
-- c'est l'une des lectures les plus fréquentes de l'app (chaque ouverture de
-- leçon). La colonne quizzes.lesson_id (ajoutée en 008) n'avait AUCUN index
-- → chaque lecture faisait un seqscan de la table quizzes.
--
-- Note : les autres prédicats chauds du hub sont déjà couverts et n'ont donc
-- pas besoin d'index ici —
--   • lesson_completions(user_id, lesson_id) : UNIQUE(user_id, lesson_id) (009)
--   • lesson_activities(user_id, lesson_id)  : préfixe de UNIQUE(user_id,
--                                              lesson_id, activity) (025)
--   • chapters(subject_id)                   : chapters_subject_level_idx (008)
--   • habits(user_id, catalog_id)            : UNIQUE(user_id, catalog_id) (010)
--
-- PRÉREQUIS : 008_reviser.sql exécuté (colonne quizzes.lesson_id). Idempotent.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE INDEX IF NOT EXISTS quizzes_lesson_id_idx
  ON public.quizzes (lesson_id);
