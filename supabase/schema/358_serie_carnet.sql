-- =============================================================================
-- 358 — LA SÉRIE COMPTE LE CARNET (`jours_actifs`)
--
-- Réviser son carnet n'allumait pas la flamme. La 317 avait bien ajouté les
-- sessions de carnet à `current_streak` (la RPC des séries d'amis), mais la
-- 323, venue APRÈS, a créé `jours_actifs()` — la fonction que l'app lit pour
-- la flamme du Dashboard, la tête de « Ma semaine » et Marcel — sur les quatre
-- tables d'origine seulement. Un élève qui ne travaillait que ses cartes
-- voyait sa série s'éteindre le soir même (Lucas, 10/09/2026 : « elle doit
-- ajouter un jour à la série globale, elle compte aussi de réviser dans son
-- carnet »).
--
-- La règle ne change pas : un jour est actif dès qu'une session de carnet y a
-- COMMENCÉ (`started_at`), exactement comme dans `current_streak` (317). Le
-- calcul de la série reste en TypeScript (`computeStreak`, lib/streak.ts) ;
-- la base ne fournit que l'ensemble des jours.
--
-- LE CODE TOLÈRE SON ABSENCE : sans elle, la flamme continue de compter
-- quiz, leçons et défis, et le repli TypeScript (`lib/jours-actifs.ts`) lit
-- déjà `carnet_review_sessions` quand la RPC manque tout à fait.
--
-- PRÉREQUIS : 186 (carnet_review_sessions), 323 (jours_actifs). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.jours_actifs(p_since TIMESTAMPTZ)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(d ORDER BY d), '[]'::jsonb)
    FROM (
      SELECT DISTINCT to_char((created_at AT TIME ZONE 'utc')::date, 'YYYY-MM-DD') AS d
        FROM (
          SELECT created_at FROM public.test_sessions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
          UNION ALL
          SELECT created_at FROM public.study_sessions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
          UNION ALL
          SELECT created_at FROM public.lesson_completions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
          UNION ALL
          SELECT created_at FROM public.challenge_sessions
           WHERE user_id = (SELECT auth.uid()) AND created_at >= p_since
          UNION ALL
          -- Le carnet : une session commencée = un jour travaillé (comme 317).
          SELECT started_at AS created_at FROM public.carnet_review_sessions
           WHERE user_id = (SELECT auth.uid()) AND started_at >= p_since
        ) act
    ) jours;
$$;

GRANT EXECUTE ON FUNCTION public.jours_actifs(TIMESTAMPTZ) TO authenticated;

-- L'index (user_id, started_at DESC) existe depuis la 317 ; on le ré-affirme
-- pour une exécution à froid.
CREATE INDEX IF NOT EXISTS carnet_review_sessions_user_started_idx
  ON public.carnet_review_sessions (user_id, started_at DESC);

-- =============================================================================
-- VÉRIFIER — une session de carnet d'aujourd'hui doit sortir dans la liste.
-- =============================================================================
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   SELECT public.jours_actifs(now() - INTERVAL '400 days');
-- ROLLBACK;
