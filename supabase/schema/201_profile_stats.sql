-- Scolaria - Migration 201 : RPC profile_stats() - stats du profil de jeu
-- Source SQL unique des stats affichees dans la modale de profil (onglet Defi).
-- Recalcule tout cote serveur a partir des tables autoritatives ; renvoie un
-- objet JSONB (client Supabase non type).
-- Sources : current_streak (155/170), user_wallet (192), profiles (079/174/014),
-- test_sessions -> quizzes.subject (003).
-- Idempotente (CREATE OR REPLACE). A EXECUTER A LA MAIN apres la 200.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.

CREATE OR REPLACE FUNCTION public.profile_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user          UUID := auth.uid();
  v_wins          INT;
  v_losses        INT;
  v_trophies      INT;
  v_best_trophies INT;
  v_work_seconds  BIGINT;
  v_streak        INT;
  v_best_streak   INT;
  v_xp            INT;
  v_level         INT;
  v_quiz_count    BIGINT;
  v_subjects      JSONB;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Identité compétitive + temps, en une lecture.
  SELECT COALESCE(wins, 0), COALESCE(losses, 0),
         COALESCE(trophies, 0), COALESCE(best_trophies, 0),
         COALESCE(work_seconds, 0)
  INTO v_wins, v_losses, v_trophies, v_best_trophies, v_work_seconds
  FROM public.profiles WHERE id = v_user;

  -- Série courante : même source que partout ailleurs.
  v_streak := COALESCE(public.current_streak(v_user), 0);

  -- Record de série : gap-and-islands sur l'union des jours d'activité
  -- (test/study/lesson/challenge), au jour UTC. GREATEST avec la série courante.
  SELECT COALESCE(MAX(cnt), 0) INTO v_best_streak
  FROM (
    SELECT COUNT(*) AS cnt
    FROM (
      SELECT d, d - (ROW_NUMBER() OVER (ORDER BY d))::int AS g
      FROM (
        SELECT DISTINCT (created_at AT TIME ZONE 'UTC')::date AS d
        FROM (
          SELECT created_at FROM public.test_sessions      WHERE user_id = v_user
          UNION ALL SELECT created_at FROM public.study_sessions     WHERE user_id = v_user
          UNION ALL SELECT created_at FROM public.lesson_completions WHERE user_id = v_user
          UNION ALL SELECT created_at FROM public.challenge_sessions WHERE user_id = v_user
        ) a
      ) days
    ) grp
    GROUP BY g
  ) s;
  v_best_streak := GREATEST(v_best_streak, v_streak);

  -- XP / niveau : le portefeuille est la vérité (rétro-remplit l'XP legacy).
  PERFORM public.wallet_ensure(v_user);
  SELECT COALESCE(xp, 0), COALESCE(level, 1)
  INTO v_xp, v_level
  FROM public.user_wallet WHERE user_id = v_user;

  -- Parties « jouées » de quiz/défi (pour un compteur secondaire éventuel).
  SELECT COUNT(*) INTO v_quiz_count FROM public.test_sessions WHERE user_id = v_user;
  v_quiz_count := v_quiz_count
    + (SELECT COUNT(*) FROM public.challenge_sessions WHERE user_id = v_user);

  -- Matières jouées (sessions de test par matière) → {matière: nombre}.
  SELECT COALESCE(jsonb_object_agg(subject, n), '{}'::jsonb) INTO v_subjects
  FROM (
    SELECT q.subject AS subject, COUNT(*) AS n
    FROM public.test_sessions t
    JOIN public.quizzes q ON q.id = t.quiz_id
    WHERE t.user_id = v_user AND q.subject IS NOT NULL
    GROUP BY q.subject
  ) sub;

  RETURN jsonb_build_object(
    'games_played',  v_wins + v_losses,
    'wins',          v_wins,
    'losses',        v_losses,
    'current_streak', v_streak,
    'best_streak',   v_best_streak,
    'total_xp',      v_xp,
    'level',         v_level,
    'trophies',      v_trophies,
    'best_trophies', GREATEST(v_best_trophies, v_trophies),
    'study_minutes', v_work_seconds / 60,
    'quiz_count',    v_quiz_count,
    'subject_counts', COALESCE(v_subjects, '{}'::jsonb)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.profile_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.profile_stats() TO authenticated;
