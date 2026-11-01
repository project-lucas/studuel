-- =============================================================================
-- 604 — LA MANCHE INACHEVÉE, GARDÉE EN BASE (28/10/2026, effet Zeigarnik)
--
-- Lucas : « dis-moi comment implémenter l'effet Zeigarnik », puis « lance tous
-- les points proposés ». Une manche de quiz quittée au milieu est gardée dans
-- le navigateur (lib/quiz-brouillon, lib/quiz-brouillon-local) ; cette table
-- la RECOPIE pour la retrouver sur un autre appareil : la carte « Tu t'étais
-- arrêté là » de Réviser et la proposition « Reprendre à la question 7 » à
-- l'ouverture du quiz.
--
--   · `quiz_brouillons` : UNE ligne par (élève, quiz) — la manche en cours,
--     telle que lib/quiz-brouillon la décrit (`etat`, JSONB validé par
--     `parserBrouillon` à l'écriture comme à la lecture), et son heure.
--   · Le brouillon ne vaut RIEN côté récompenses : le serveur juge la manche à
--     la fin (`recordTestSession`), jamais depuis cette table. Un élève qui y
--     écrit n'importe quoi ne se donne rien — il ne gêne que lui.
--   · L'élève lit, écrit et efface SES lignes seulement (RLS). Écrites par la
--     route POST /api/quiz/brouillon quand l'élève quitte l'écran du quiz
--     (onglet caché, retour), effacées à la fin de la manche, au temps écoulé
--     et à « Recommencer ».
--   · ON DELETE CASCADE des deux côtés : un compte supprimé (596) ou un quiz
--     retiré emporte ses manches.
--   · Au-delà d'un jour, une manche n'est plus proposée (lib/quiz-brouillon,
--     BROUILLON_DUREE_MS) ; la route fait le ménage des lignes de l'élève de
--     plus de deux jours à chaque écriture.
--
-- Idempotente. À EXÉCUTER À LA MAIN dans le SQL Editor, après la 603.
--
-- TANT QU'ELLE N'EST PAS EXÉCUTÉE, l'app fonctionne : la manche est gardée
-- dans le navigateur seul (la route répond 503 sans bruit, les lectures
-- rendent « aucune manche »). On ne perd que la reprise d'un appareil à
-- l'autre.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.quiz_brouillons (
  user_id    UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  quiz_id    UUID        NOT NULL REFERENCES public.quizzes (id) ON DELETE CASCADE,
  etat       JSONB       NOT NULL CHECK (
               jsonb_typeof(etat) = 'object'
               AND pg_column_size(etat) <= 8192
             ),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, quiz_id)
);

-- La carte de Réviser lit LA plus récente de l'élève.
CREATE INDEX IF NOT EXISTS quiz_brouillons_user_recent
  ON public.quiz_brouillons (user_id, updated_at DESC);

ALTER TABLE public.quiz_brouillons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_brouillons_lecture_soi" ON public.quiz_brouillons;
CREATE POLICY "quiz_brouillons_lecture_soi" ON public.quiz_brouillons
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "quiz_brouillons_ajout_soi" ON public.quiz_brouillons;
CREATE POLICY "quiz_brouillons_ajout_soi" ON public.quiz_brouillons
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "quiz_brouillons_maj_soi" ON public.quiz_brouillons;
CREATE POLICY "quiz_brouillons_maj_soi" ON public.quiz_brouillons
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "quiz_brouillons_effacement_soi" ON public.quiz_brouillons;
CREATE POLICY "quiz_brouillons_effacement_soi" ON public.quiz_brouillons
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON TABLE public.quiz_brouillons FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.quiz_brouillons TO authenticated;

-- Contrôle après exécution :
--   select count(*) from pg_policies where tablename = 'quiz_brouillons';  → 4
