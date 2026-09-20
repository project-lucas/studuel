-- =============================================================================
-- 374 — TENIR LA CHARGE : vitrines en cache, fin de course en une transaction,
--       Realtime par clé primaire, index en double retirés.
--
-- Le 19/09/2026, Lucas : « il y a une vraie latence entre les onglets […] elle
-- doit pouvoir accueillir des milliers d'utilisateurs chaque jour, avoir un PvP
-- qui ne plante pas ». Le code déployé avant cette migration marche SANS elle
-- (chaque lecture a son repli) ; elle rend le tout plus rapide et plus sûr.
--
-- A. LES VITRINES EN ANON. Le catalogue des badges et les objets de profil sont
--    les mêmes pour tous : le serveur les met en cache (lib/vitrines-server)
--    avec un client SANS session — il lui faut la lecture anon, comme le
--    catalogue des cours depuis la 026. Aucune donnée personnelle : titres,
--    icônes, prix. Ce que chaque élève POSSÈDE (user_badges, user_avatar_items)
--    reste strictement à lui.
--
-- B. LA FIN D'UNE COURSE EN UNE TRANSACTION (`duel_course_enregistrer`).
--    Avant : huit appels séparés (activité, clan ×2, couronnes ×2, trophées,
--    bilan V/D, trace), chacun sa connexion et son commit, qui pouvaient réussir
--    à moitié — et rien n'empêchait de payer deux fois la même course.
--    Maintenant : UN appel, tout ou rien, et une course porte son identifiant
--    (`challenge_sessions.course_id`, unique) : un renvoi (réseau coupé,
--    réponse perdue) rend le résultat déjà enregistré au lieu de repayer.
--    Chaque versement reste isolé (sous-transaction) : un clan absent ne fait
--    pas perdre les trophées.
--
-- C. LA TRACE D'UN RIVAL NE CHANGE PLUS SOUS LES PIEDS. Une trace est réécrite
--    à chaque course de son auteur : s'il en rejouait une PENDANT la mienne, le
--    serveur jugeait ma course contre SA NOUVELLE trace. La ligne garde
--    désormais la trace précédente (`steps_precedents`, `precedent_le`), et
--    `duel_replay_get` / `duel_replay_opponents` rendent l'instant de chacune :
--    le serveur rejoue celle que j'ai vraiment courue (lib/duel/opponent-server).
--    Le vivier ne décompresse plus chaque trace pour la compter
--    (`jsonb_array_length`) : l'écriture garantit déjà 3 à 50 pas.
--
-- D. REALTIME PAR CLÉ PRIMAIRE. Les policies de la 178 comparaient
--    `'duel-' || d.id::text = realtime.topic()` : une expression sur la colonne,
--    donc un parcours COMPLET de `live_duels` (et de `coop_sessions`, les deux
--    policies étant évaluées) à chaque connexion à un canal privé, sur des
--    tables qui ne font que grandir. Elles comparent maintenant `d.id` à l'uuid
--    extrait du topic : un accès par la clé primaire.
--    Et `live_duels` / `coop_sessions` quittent la publication `supabase_realtime`
--    : l'app n'écoute aucun `postgres_changes` (duel et coop passent par
--    broadcast), chaque écriture y était décodée pour rien.
--
-- E. LES INDEX. Retirés, parce qu'en double (chaque écriture les payait) :
--    les quatre `(user_id, created_at)` de la 206 — ceux de 003/007/009/011,
--    `(user_id, created_at DESC)`, servent déjà dans les deux sens —, le second
--    `quizzes(lesson_id)` de la 325 et `game_trophies(user_id)`, couvert par la
--    clé primaire. Ajoutés : `friendships(addressee_id)` (les demandes reçues
--    et la policy « mes amitiés » parcouraient toute la table),
--    `test_sessions(quiz_id)` et `lesson_completions(lesson_id)` (sans eux,
--    chaque quiz ou leçon supprimé par une mise à jour de contenu parcourait
--    toute la table pour son ON DELETE).
--
-- PRÉREQUIS : 011, 019, 046, 080, 178, 204, 207, 238, 351, 368, 371. Idempotent.
-- À exécuter dans le SQL Editor de Supabase, en une fois.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- A. Les vitrines, lisibles en anon
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "badges_select_anon" ON public.badges;
CREATE POLICY "badges_select_anon" ON public.badges
  FOR SELECT TO anon USING (true);
GRANT SELECT ON public.badges TO anon;

DROP POLICY IF EXISTS "avatar_items_select_anon" ON public.avatar_items;
CREATE POLICY "avatar_items_select_anon" ON public.avatar_items
  FOR SELECT TO anon USING (true);
GRANT SELECT ON public.avatar_items TO anon;


-- -----------------------------------------------------------------------------
-- B. Une course = un identifiant, et son résultat gardé pour les renvois
-- -----------------------------------------------------------------------------

ALTER TABLE public.challenge_sessions ADD COLUMN IF NOT EXISTS course_id UUID;
ALTER TABLE public.challenge_sessions ADD COLUMN IF NOT EXISTS resultat JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS challenge_sessions_course_idx
  ON public.challenge_sessions (course_id)
  WHERE course_id IS NOT NULL;


-- -----------------------------------------------------------------------------
-- C. La trace précédente d'un rival
-- -----------------------------------------------------------------------------

ALTER TABLE public.duel_replays ADD COLUMN IF NOT EXISTS steps_precedents JSONB;
ALTER TABLE public.duel_replays ADD COLUMN IF NOT EXISTS precedent_le TIMESTAMPTZ;

-- Même signature, même contrôle qu'en 351 ; la réécriture garde l'ancienne trace.
CREATE OR REPLACE FUNCTION public.duel_save_replay(
  p_subject_slug TEXT,
  p_score INTEGER,
  p_won BOOLEAN,
  p_steps JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id UUID;
  v_trophies INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF p_subject_slug IS NULL OR length(p_subject_slug) = 0 THEN RETURN NULL; END IF;
  IF p_steps IS NULL OR jsonb_typeof(p_steps) <> 'array' THEN RETURN NULL; END IF;
  IF jsonb_array_length(p_steps) < 3 OR jsonb_array_length(p_steps) > 50 THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(sum(trophies), 0)::int INTO v_trophies
    FROM public.game_trophies
   WHERE user_id = v_user AND subject_slug = p_subject_slug;

  INSERT INTO public.duel_replays (user_id, subject_slug, trophies, score, won, steps)
  VALUES (v_user, left(p_subject_slug, 64), COALESCE(v_trophies, 0),
          GREATEST(0, LEAST(COALESCE(p_score, 0), 100000)),
          COALESCE(p_won, false), p_steps)
  ON CONFLICT (user_id, subject_slug) DO UPDATE
    SET trophies = EXCLUDED.trophies,
        score = EXCLUDED.score,
        won = EXCLUDED.won,
        -- Les membres de droite lisent la ligne AVANT mise à jour.
        steps_precedents = duel_replays.steps,
        precedent_le = duel_replays.created_at,
        steps = EXCLUDED.steps,
        created_at = now()
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.duel_save_replay(TEXT, INTEGER, BOOLEAN, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.duel_save_replay(TEXT, INTEGER, BOOLEAN, JSONB) TO authenticated;

-- Le type de retour change : il faut recréer la fonction.
DROP FUNCTION IF EXISTS public.duel_replay_get(UUID);
CREATE FUNCTION public.duel_replay_get(p_id UUID)
RETURNS TABLE (
  steps            JSONB,
  trophies         INTEGER,
  created_at       TIMESTAMPTZ,
  steps_precedents JSONB,
  precedent_le     TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT grade_level FROM public.profiles WHERE id = auth.uid()
  )
  SELECT r.steps, r.trophies, r.created_at, r.steps_precedents, r.precedent_le
  FROM public.duel_replays r
  JOIN public.profiles p ON p.id = r.user_id
  JOIN moi ON moi.grade_level IS NOT DISTINCT FROM p.grade_level
  WHERE r.id = p_id
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.duel_replay_get(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.duel_replay_get(UUID) TO authenticated;

DROP FUNCTION IF EXISTS public.duel_replay_opponents(TEXT, INTEGER);
CREATE FUNCTION public.duel_replay_opponents(
  p_subject_slug TEXT,
  p_limit INTEGER DEFAULT 40
)
RETURNS TABLE (
  replay_id  UUID,
  user_id    UUID,
  name       TEXT,
  avatar     JSONB,
  trophies   INTEGER,
  score      INTEGER,
  steps      JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT grade_level FROM public.profiles WHERE id = auth.uid()
  )
  SELECT
    r.id,
    r.user_id,
    COALESCE(NULLIF(split_part(p.full_name, ' ', 1), ''), 'Un élève') AS name,
    COALESCE(p.avatar, '{}'::jsonb) AS avatar,
    r.trophies,
    r.score,
    r.steps,
    r.created_at
  FROM public.duel_replays r
  JOIN public.profiles p ON p.id = r.user_id
  JOIN moi ON moi.grade_level IS NOT DISTINCT FROM p.grade_level
  WHERE r.subject_slug = p_subject_slug
    AND r.user_id <> auth.uid()
  ORDER BY r.created_at DESC
  LIMIT GREATEST(1, LEAST(p_limit, 200));
$$;

REVOKE ALL ON FUNCTION public.duel_replay_opponents(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.duel_replay_opponents(TEXT, INTEGER) TO authenticated;


-- -----------------------------------------------------------------------------
-- B (suite). La fin d'une course, en une transaction
-- -----------------------------------------------------------------------------
-- Les montants et les plafonds restent ceux des fonctions appelées (wallet_touch
-- 368, clan_week_contribute 204, season_add_crowns 207, apply_game_trophies 371,
-- record_duel_result 174, duel_save_replay ci-dessus) : cette fonction ne fait
-- que les enchaîner, une fois par course.
--
-- `p_verifie` : le serveur a refabriqué le rival. Sans lui, la course compte pour
-- l'activité (clan, couronnes « partie jouée ») mais ni trophées, ni bilan, ni
-- trace. `p_won` n'est vrai que sur une victoire vérifiée.
CREATE OR REPLACE FUNCTION public.duel_course_enregistrer(
  p_course_id    UUID,
  p_subject_slug TEXT,
  p_game_id      TEXT,
  p_score        INTEGER,
  p_correct      INTEGER,
  p_answered     INTEGER,
  p_verifie      BOOLEAN,
  p_won          BOOLEAN,
  p_steps        JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user       UUID := auth.uid();
  v_session    UUID;
  v_existant   JSONB;
  v_award      JSONB;
  v_clan_play  INTEGER := 0;
  v_clan_win   INTEGER := 0;
  v_crown_play INTEGER := 0;
  v_crown_win  INTEGER := 0;
  v_trophees   JSONB;
  v_trophees_ok BOOLEAN := false;
  v_replay     UUID;
  v_resultat   JSONB;
  v_won        BOOLEAN := COALESCE(p_won, false) AND COALESCE(p_verifie, false);
BEGIN
  IF v_user IS NULL OR p_course_id IS NULL THEN RETURN NULL; END IF;
  IF p_subject_slug IS NULL OR length(p_subject_slug) = 0 THEN RETURN NULL; END IF;

  -- La preuve d'activité, et le verrou d'idempotence : une course, une ligne.
  INSERT INTO public.challenge_sessions (user_id, score, total, xp, course_id)
  VALUES (
    v_user,
    LEAST(GREATEST(COALESCE(p_correct, 0), 0), 50),
    LEAST(GREATEST(COALESCE(p_answered, 0), 0), 50),
    0,
    p_course_id
  )
  ON CONFLICT (course_id) WHERE course_id IS NOT NULL DO NOTHING
  RETURNING id INTO v_session;

  IF v_session IS NULL THEN
    -- Déjà comptée : on rend ce qui avait été versé, sans rien repayer.
    SELECT resultat INTO v_existant
      FROM public.challenge_sessions
     WHERE course_id = p_course_id AND user_id = v_user;
    RETURN jsonb_build_object('deja_compte', true, 'resultat', v_existant);
  END IF;

  -- Chaque versement dans sa sous-transaction : l'échec de l'un (migration
  -- absente, plafond, clan introuvable) n'emporte pas les autres.
  BEGIN
    v_award := public.wallet_touch();
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'duel_course_enregistrer / wallet_touch : %', SQLERRM;
  END;

  BEGIN
    v_clan_play := COALESCE(public.clan_week_contribute('duel_play'), 0);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'duel_course_enregistrer / clan duel_play : %', SQLERRM;
  END;

  BEGIN
    v_crown_play := COALESCE(public.season_add_crowns('duel_play'), 0);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'duel_course_enregistrer / couronnes duel_play : %', SQLERRM;
  END;

  IF v_won THEN
    BEGIN
      v_clan_win := COALESCE(public.clan_week_contribute('duel_win'), 0);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'duel_course_enregistrer / clan duel_win : %', SQLERRM;
    END;
    BEGIN
      v_crown_win := COALESCE(public.season_add_crowns('duel_win'), 0);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'duel_course_enregistrer / couronnes duel_win : %', SQLERRM;
    END;
  END IF;

  IF COALESCE(p_verifie, false) THEN
    BEGIN
      v_trophees := public.apply_game_trophies(
        p_subject_slug,
        COALESCE(NULLIF(p_game_id, ''), 'programme'),
        v_won,
        GREATEST(0, COALESCE(p_score, 0))
      );
      v_trophees_ok := true;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'duel_course_enregistrer / trophées : %', SQLERRM;
    END;

    BEGIN
      PERFORM public.record_duel_result(v_won);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'duel_course_enregistrer / bilan : %', SQLERRM;
    END;

    IF p_steps IS NOT NULL AND jsonb_typeof(p_steps) = 'array'
       AND jsonb_array_length(p_steps) BETWEEN 3 AND 50 THEN
      BEGIN
        v_replay := public.duel_save_replay(p_subject_slug, p_score, v_won, p_steps);
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'duel_course_enregistrer / trace : %', SQLERRM;
      END;
    END IF;
  END IF;

  v_resultat := jsonb_build_object(
    'award', v_award,
    'clan_points', v_clan_play + v_clan_win,
    'couronnes', v_crown_play + v_crown_win,
    'trophees', v_trophees,
    -- Appel réussi mais sans résultat : la borne des 60 parties par heure.
    'trophees_pause', (COALESCE(p_verifie, false) AND v_trophees_ok AND v_trophees IS NULL),
    'replay', v_replay IS NOT NULL
  );

  UPDATE public.challenge_sessions SET resultat = v_resultat WHERE id = v_session;

  RETURN jsonb_build_object('deja_compte', false, 'resultat', v_resultat);
END;
$$;

REVOKE ALL ON FUNCTION public.duel_course_enregistrer(
  UUID, TEXT, TEXT, INTEGER, INTEGER, INTEGER, BOOLEAN, BOOLEAN, JSONB
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.duel_course_enregistrer(
  UUID, TEXT, TEXT, INTEGER, INTEGER, INTEGER, BOOLEAN, BOOLEAN, JSONB
) TO authenticated;


-- -----------------------------------------------------------------------------
-- D. Realtime : l'accès aux canaux privés par la clé primaire
-- -----------------------------------------------------------------------------

-- L'uuid d'un topic « <préfixe><uuid> », ou NULL si le topic n'a pas cette forme.
CREATE OR REPLACE FUNCTION public.realtime_topic_uuid(p_topic TEXT, p_prefix TEXT)
RETURNS UUID
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN left(p_topic, length(p_prefix)) = p_prefix
     AND substr(p_topic, length(p_prefix) + 1)
         ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN substr(p_topic, length(p_prefix) + 1)::uuid
  END;
$$;

GRANT EXECUTE ON FUNCTION public.realtime_topic_uuid(TEXT, TEXT) TO authenticated;

DROP POLICY IF EXISTS "duel_live_realtime_read" ON realtime.messages;
CREATE POLICY "duel_live_realtime_read" ON realtime.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.live_duels d
      WHERE d.id = public.realtime_topic_uuid(realtime.topic(), 'duel-')
        AND (SELECT auth.uid()) IN (d.host_id, d.guest_id)
    )
  );

DROP POLICY IF EXISTS "duel_live_realtime_write" ON realtime.messages;
CREATE POLICY "duel_live_realtime_write" ON realtime.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.live_duels d
      WHERE d.id = public.realtime_topic_uuid(realtime.topic(), 'duel-')
        AND (SELECT auth.uid()) IN (d.host_id, d.guest_id)
    )
  );

DROP POLICY IF EXISTS "coop_realtime_read" ON realtime.messages;
CREATE POLICY "coop_realtime_read" ON realtime.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.coop_sessions s
      WHERE s.id = public.realtime_topic_uuid(realtime.topic(), 'coop-')
        AND (SELECT auth.uid()) IN (s.host_id, s.guest_id)
    )
  );

DROP POLICY IF EXISTS "coop_realtime_write" ON realtime.messages;
CREATE POLICY "coop_realtime_write" ON realtime.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.coop_sessions s
      WHERE s.id = public.realtime_topic_uuid(realtime.topic(), 'coop-')
        AND (SELECT auth.uid()) IN (s.host_id, s.guest_id)
    )
  );

-- Plus de décodage des écritures pour des abonnés qui n'existent pas.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
     WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'live_duels'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.live_duels;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
     WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'coop_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.coop_sessions;
  END IF;
END;
$$;


-- -----------------------------------------------------------------------------
-- E. Les index
-- -----------------------------------------------------------------------------
-- Pas de CONCURRENTLY : le SQL Editor exécute le script comme un seul bloc, où
-- il est refusé. Aux volumes actuels, chaque création ne verrouille la table
-- que quelques secondes.

-- Doublons : on ne retire une copie que si l'original est bien là.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'test_sessions_user_created_idx') THEN
    DROP INDEX IF EXISTS public.test_sessions_user_date_idx;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'study_sessions_user_created_idx') THEN
    DROP INDEX IF EXISTS public.study_sessions_user_date_idx;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'lesson_completions_user_idx') THEN
    DROP INDEX IF EXISTS public.lesson_completions_user_date_idx;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'challenge_sessions_user_created_idx') THEN
    DROP INDEX IF EXISTS public.challenge_sessions_user_date_idx;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'quizzes_lesson_id_idx') THEN
    DROP INDEX IF EXISTS public.quizzes_lesson_idx;
  END IF;
END;
$$;

-- La clé primaire (user_id, subject_slug, game_id) sert déjà les lectures par élève.
DROP INDEX IF EXISTS public.game_trophies_user_idx;

-- Les demandes reçues et la policy « mes amitiés » (requester_id OU addressee_id).
CREATE INDEX IF NOT EXISTS friendships_addressee_idx
  ON public.friendships (addressee_id);

-- Les ON DELETE des clés étrangères (mises à jour de contenu).
CREATE INDEX IF NOT EXISTS test_sessions_quiz_idx
  ON public.test_sessions (quiz_id);
CREATE INDEX IF NOT EXISTS lesson_completions_lesson_idx
  ON public.lesson_completions (lesson_id);


-- =============================================================================
-- VÉRIFIER (facultatif) :
--   SELECT public.realtime_topic_uuid('duel-00000000-0000-4000-8000-000000000000', 'duel-');
--   SELECT count(*) FROM pg_policies WHERE tablename IN ('badges', 'avatar_items') AND 'anon' = ANY(roles);  -- 2
--   SELECT indexname FROM pg_indexes WHERE tablename = 'challenge_sessions';
-- =============================================================================
