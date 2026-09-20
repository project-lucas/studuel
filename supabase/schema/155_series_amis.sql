-- =============================================================================
-- Studuel — Migration 155 : SÉRIES DES AMIS (compétition sur le streak)
-- Pour ajouter de la compétition, on montre à l'élève la série (jours consécutifs
-- d'activité) de chacun de ses amis, comme on montre déjà leurs trophées.
--   - current_streak(uuid)  : calcule la série d'un élève côté serveur, miroir
--     exact de computeStreak (lib/streak.ts) — clémence « façon Duolingo » : la
--     série d'hier tient encore si rien aujourd'hui. INTERNE : jamais exposée au
--     client (REVOKE PUBLIC), sinon on pourrait sonder la série de n'importe qui.
--   - friends_streaks()     : la série de mes amis acceptés (id + série), pour le
--     mini-classement des séries. SECURITY DEFINER : la RLS de l'activité reste
--     « soi uniquement », cette fonction n'expose QUE (friend_id, streak).
--   - my_streak()           : ma propre série (pour me situer dans ce classement
--     sans refaire les 4 selects d'activité côté page).
--
-- La série se lit de l'activité réelle, agrégée sur les 4 mêmes tables que l'app
-- (test_sessions, study_sessions, lesson_completions, challenge_sessions), au
-- jour UTC — identique à app/moi/page.tsx.
--
-- PRÉREQUIS : 003 (test_sessions), 007 (study_sessions), 009 (lesson_completions),
-- 011 (challenge_sessions), 019 (friendships). Idempotent.
-- =============================================================================

-- ------------------------------------------------- série d'un élève (interne)
-- Jours UTC distincts avec activité, puis marche arrière depuis l'ancre (=
-- aujourd'hui si actif, sinon hier ; sinon 0). Le COUNT des jours consécutifs
-- atteints est la série. Termine toujours : chaque pas exige le jour précédent
-- dans l'ensemble fini `days` et décroît strictement.
CREATE OR REPLACE FUNCTION public.current_streak(p_user UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE
  days AS (
    SELECT DISTINCT ((created_at AT TIME ZONE 'UTC')::date) AS d
    FROM (
      SELECT created_at FROM public.test_sessions      WHERE user_id = p_user
      UNION ALL
      SELECT created_at FROM public.study_sessions     WHERE user_id = p_user
      UNION ALL
      SELECT created_at FROM public.lesson_completions WHERE user_id = p_user
      UNION ALL
      SELECT created_at FROM public.challenge_sessions WHERE user_id = p_user
    ) a
  ),
  anchor AS (
    SELECT CASE
      WHEN EXISTS (SELECT 1 FROM days WHERE d = (now() AT TIME ZONE 'UTC')::date)
        THEN (now() AT TIME ZONE 'UTC')::date
      WHEN EXISTS (SELECT 1 FROM days WHERE d = ((now() AT TIME ZONE 'UTC')::date - 1))
        THEN ((now() AT TIME ZONE 'UTC')::date - 1)
      ELSE NULL
    END AS a
  ),
  walk AS (
    SELECT a AS d FROM anchor WHERE a IS NOT NULL
    UNION ALL
    SELECT w.d - 1
    FROM walk w
    WHERE EXISTS (SELECT 1 FROM days WHERE days.d = w.d - 1)
  )
  SELECT COUNT(*)::int FROM walk;
$$;

-- Interne uniquement : jamais appelable directement par le client (sinon on
-- pourrait passer n'importe quel uuid et sonder la série d'autrui). Les
-- fonctions ci-dessous (DEFINER) l'appellent dans le contexte du propriétaire.
REVOKE ALL ON FUNCTION public.current_streak(UUID) FROM PUBLIC;

-- --------------------------------------------------- séries des amis
-- La série de chaque ami accepté (id + jours), pour le mini-classement des
-- séries de l'onglet Amis. Même garde-fou que friends_trophies : DEFINER, et on
-- n'expose que le strict minimum.
CREATE OR REPLACE FUNCTION public.friends_streaks()
RETURNS TABLE (
  friend_id UUID,
  streak    INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    public.current_streak(p.id)
  FROM public.friendships f
  JOIN public.profiles p
    ON p.id = CASE WHEN f.requester_id = auth.uid()
                   THEN f.addressee_id ELSE f.requester_id END
  WHERE f.status = 'accepted'
    AND auth.uid() IN (f.requester_id, f.addressee_id);
$$;

GRANT EXECUTE ON FUNCTION public.friends_streaks() TO authenticated;

-- ---------------------------------------------------------- ma série
-- Ma propre série, pour me placer dans le classement des séries sans refaire les
-- 4 requêtes d'activité côté page.
CREATE OR REPLACE FUNCTION public.my_streak()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_streak(auth.uid());
$$;

GRANT EXECUTE ON FUNCTION public.my_streak() TO authenticated;
