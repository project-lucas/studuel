-- =============================================================================
-- Studuel — Migration 204 : « Clan hebdo »
--
-- La semaine de clan, du lundi au dimanche : chaque élève contribue au score de
-- SON école (les écoles = clans, migration 159), le classement se clôt dimanche
-- soir, et la récompense dépend du rang du clan ET de la contribution
-- personnelle. C'est le système de rétention à 30 jours du jeu : on ne revient
-- pas pour soi, on revient parce que le clan compte les points.
--
-- MIROIR EXACT de lib/clan-week.ts (barème, plafond, paliers de récompense).
-- Toute modification du barème doit être faite DES DEUX CÔTÉS.
--
-- Sécurité : RLS en lecture sur ses propres contributions ; toutes les écritures
-- passent par des RPC SECURITY DEFINER. Le barème vit CÔTÉ SERVEUR (le client
-- envoie un nom d'événement, jamais un nombre de points) et la contribution est
-- plafonnée à 300 points/jour — l'abus maximal reste donc du même ordre qu'une
-- journée de jeu intense légitime.
--
-- Semaine = clé UTC du LUNDI (convention projet : la semaine commence lundi).
--
-- PRÉREQUIS : schema.sql (profiles), 159_ecoles_clans.sql (schools,
-- profiles.college_school_id / lycee_school_id), 183 (profiles.gems).
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

-- --- Tables ------------------------------------------------------------------

-- Une ligne par élève et par semaine. `school_id` est figé AU MOMENT de la
-- première contribution de la semaine : changer d'école le jeudi ne déplace pas
-- rétroactivement les points déjà marqués pour l'ancienne.
CREATE TABLE IF NOT EXISTS public.clan_week_contributions (
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  week_key    DATE NOT NULL,                    -- le LUNDI de la semaine (UTC)
  school_id   UUID REFERENCES public.schools (id) ON DELETE SET NULL,
  points      INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  day_key     DATE,                             -- jour de la dernière contribution
  day_points  INTEGER NOT NULL DEFAULT 0,       -- points versés CE jour (plafond)
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, week_key)
);

CREATE INDEX IF NOT EXISTS clan_week_school_idx
  ON public.clan_week_contributions (week_key, school_id)
  WHERE school_id IS NOT NULL;

-- Coffres de fin de semaine déjà réclamés. La PK interdit structurellement le
-- double versement — pas de garde applicative à maintenir.
CREATE TABLE IF NOT EXISTS public.clan_week_claims (
  user_id    UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  week_key   DATE NOT NULL,
  tier       TEXT NOT NULL,
  gems       INTEGER NOT NULL DEFAULT 0,
  xp         INTEGER NOT NULL DEFAULT 0,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, week_key)
);

-- --- RLS : lecture de ses propres lignes uniquement --------------------------
-- (Le classement du clan passe par la RPC ci-dessous, SECURITY DEFINER : elle
--  agrège sans exposer les lignes des autres élèves.)

ALTER TABLE public.clan_week_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_week_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clan_week_select_own ON public.clan_week_contributions;
CREATE POLICY clan_week_select_own ON public.clan_week_contributions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS clan_week_claims_select_own ON public.clan_week_claims;
CREATE POLICY clan_week_claims_select_own ON public.clan_week_claims
  FOR SELECT USING (auth.uid() = user_id);

-- --- Helpers -----------------------------------------------------------------

-- Le lundi de la semaine contenant une date (UTC). date_trunc('week') d'ISO
-- renvoie déjà le lundi : c'est exactement la convention du projet.
CREATE OR REPLACE FUNCTION public.clan_week_key(p_day DATE)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$ SELECT (date_trunc('week', p_day::timestamp))::date $$;

-- L'école ACTIVE de l'élève : celle de son cycle courant, dérivée de sa classe
-- (miroir de lib/clan.schoolLevelForGrade — lycée = 2de/1re/Tle).
CREATE OR REPLACE FUNCTION public.clan_active_school(p_user UUID)
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_grade  TEXT;
  v_school UUID;
BEGIN
  SELECT grade,
         CASE WHEN grade IN ('2de', '1re', 'Tle')
              THEN lycee_school_id ELSE college_school_id END
    INTO v_grade, v_school
    FROM public.profiles WHERE id = p_user;
  RETURN v_school;
END;
$$;

-- --- RPC : contribuer au clan ------------------------------------------------
-- Le client envoie un NOM d'événement, jamais un nombre : le barème est ici.
-- MIROIR de lib/clan-week.CLAN_POINTS + DAILY_CONTRIBUTION_CAP.
-- Renvoie les points RÉELLEMENT crédités (0 si plafond atteint, ou sans école).
CREATE OR REPLACE FUNCTION public.clan_week_contribute(p_event TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_week   DATE;
  v_school UUID;
  v_base   INTEGER;
  v_done   INTEGER := 0;
  v_gain   INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN 0; END IF;

  v_base := CASE p_event
    WHEN 'duel_win'     THEN 30
    WHEN 'duel_play'    THEN 10
    WHEN 'session_prepa' THEN 25
    WHEN 'revision'     THEN 15
    WHEN 'quest_day'    THEN 50
    ELSE 0
  END;
  IF v_base = 0 THEN RETURN 0; END IF;

  v_week := public.clan_week_key(v_today);
  v_school := public.clan_active_school(v_user);
  -- Sans école, l'élève joue quand même : il ne contribue simplement à rien.
  IF v_school IS NULL THEN RETURN 0; END IF;

  -- Plafond quotidien : un élève ne doit pas porter son clan à lui seul.
  SELECT CASE WHEN day_key = v_today THEN day_points ELSE 0 END
    INTO v_done
    FROM public.clan_week_contributions
   WHERE user_id = v_user AND week_key = v_week;

  v_gain := LEAST(v_base, GREATEST(0, 300 - COALESCE(v_done, 0)));
  IF v_gain = 0 THEN RETURN 0; END IF;

  INSERT INTO public.clan_week_contributions
    (user_id, week_key, school_id, points, day_key, day_points, updated_at)
  VALUES (v_user, v_week, v_school, v_gain, v_today, v_gain, now())
  ON CONFLICT (user_id, week_key) DO UPDATE
    SET points = public.clan_week_contributions.points + v_gain,
        -- Le compteur du plafond repart à zéro au changement de jour.
        day_points = CASE
          WHEN public.clan_week_contributions.day_key = v_today
          THEN public.clan_week_contributions.day_points + v_gain
          ELSE v_gain END,
        day_key = v_today,
        -- L'école reste celle de la première contribution de la semaine.
        school_id = COALESCE(public.clan_week_contributions.school_id, v_school),
        updated_at = now();

  RETURN v_gain;
END;
$$;

REVOKE ALL ON FUNCTION public.clan_week_contribute(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.clan_week_contribute(TEXT) TO authenticated;

-- --- RPC : le tableau de la semaine ------------------------------------------
-- Forme JSONB miroir de lib/clan-week.normalizeClanWeekBoard :
--   { week_key, my_clan: {school_id, school_name, points, members, rank},
--     my_points, top_members: [{id, name, points}],
--     entries: [{school_id, school_name, points, members, rank}], total }
-- p_week NULL = la semaine en cours.
CREATE OR REPLACE FUNCTION public.clan_week_board(p_week DATE DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_week   DATE;
  v_school UUID;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  v_week := public.clan_week_key(COALESCE(p_week, (now() AT TIME ZONE 'utc')::date));

  SELECT school_id INTO v_school
    FROM public.clan_week_contributions
   WHERE user_id = v_user AND week_key = v_week;
  -- Pas encore contribué cette semaine : on affiche quand même SON clan.
  IF v_school IS NULL THEN v_school := public.clan_active_school(v_user); END IF;

  RETURN (
    WITH clans AS (
      SELECT c.school_id,
             COALESCE(s.name, 'École')     AS school_name,
             SUM(c.points)::int            AS points,
             COUNT(*)::int                 AS members,
             ROW_NUMBER() OVER (ORDER BY SUM(c.points) DESC, c.school_id) AS rank
        FROM public.clan_week_contributions c
        LEFT JOIN public.schools s ON s.id = c.school_id
       WHERE c.week_key = v_week AND c.school_id IS NOT NULL
       GROUP BY c.school_id, s.name
    ),
    mates AS (
      SELECT c.user_id AS id,
             split_part(COALESCE(p.full_name, 'Élève'), ' ', 1) AS name,
             c.points
        FROM public.clan_week_contributions c
        JOIN public.profiles p ON p.id = c.user_id
       WHERE c.week_key = v_week AND c.school_id = v_school
       ORDER BY c.points DESC, c.user_id
       LIMIT 10
    )
    SELECT jsonb_build_object(
      'week_key', v_week,
      'total', (SELECT count(*) FROM clans),
      'my_points', COALESCE((
        SELECT points FROM public.clan_week_contributions
         WHERE user_id = v_user AND week_key = v_week), 0),
      'my_clan', (
        SELECT jsonb_build_object(
                 'school_id', school_id, 'school_name', school_name,
                 'points', points, 'members', members, 'rank', rank)
          FROM clans WHERE school_id = v_school),
      'top_members', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name, 'points', points))
          FROM mates), '[]'::jsonb),
      'entries', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'school_id', school_id, 'school_name', school_name,
                 'points', points, 'members', members, 'rank', rank))
          FROM (SELECT * FROM clans ORDER BY rank LIMIT 50) t), '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.clan_week_board(DATE) TO authenticated;

-- --- RPC : réclamer le coffre d'une semaine TERMINÉE --------------------------
-- MIROIR de lib/clan-week.clanWeekReward (paliers) et MIN_POINTS_TO_CLAIM.
-- Refuse une semaine encore en cours : on ne récompense pas un classement
-- provisoire. Renvoie { claimed, tier, gems, xp }.
CREATE OR REPLACE FUNCTION public.clan_week_claim(p_week DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_week     DATE;
  v_school   UUID;
  v_mine     INTEGER;
  v_rank     INTEGER;
  v_tier     TEXT;
  v_gems     INTEGER := 0;
  v_xp       INTEGER := 0;
  v_none     JSONB := jsonb_build_object('claimed', FALSE, 'tier', 'aucune',
                                         'gems', 0, 'xp', 0);
BEGIN
  IF v_user IS NULL OR p_week IS NULL THEN RETURN v_none; END IF;
  v_week := public.clan_week_key(p_week);

  -- La semaine doit être close (son lundi est antérieur à celui d'aujourd'hui).
  IF v_week >= public.clan_week_key(v_today) THEN RETURN v_none; END IF;

  SELECT points, school_id INTO v_mine, v_school
    FROM public.clan_week_contributions
   WHERE user_id = v_user AND week_key = v_week;

  -- Contribution personnelle minimale : on ne récolte pas le travail des autres.
  IF v_mine IS NULL OR v_mine < 50 OR v_school IS NULL THEN RETURN v_none; END IF;

  SELECT rank INTO v_rank FROM (
    SELECT school_id,
           ROW_NUMBER() OVER (ORDER BY SUM(points) DESC, school_id) AS rank
      FROM public.clan_week_contributions
     WHERE week_key = v_week AND school_id IS NOT NULL
     GROUP BY school_id
  ) t WHERE school_id = v_school;
  IF v_rank IS NULL THEN RETURN v_none; END IF;

  IF    v_rank = 1  THEN v_tier := 'or';            v_gems := 150; v_xp := 300;
  ELSIF v_rank <= 3 THEN v_tier := 'argent';        v_gems := 90;  v_xp := 200;
  ELSIF v_rank <= 10 THEN v_tier := 'bronze';       v_gems := 50;  v_xp := 120;
  ELSE                   v_tier := 'participation'; v_gems := 20;  v_xp := 60;
  END IF;

  -- La PK fait le verrou : une deuxième réclamation ne fait rien.
  INSERT INTO public.clan_week_claims (user_id, week_key, tier, gems, xp)
  VALUES (v_user, v_week, v_tier, v_gems, v_xp)
  ON CONFLICT (user_id, week_key) DO NOTHING;
  IF NOT FOUND THEN RETURN v_none; END IF;

  UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gems WHERE id = v_user;
  -- L'XP annoncée est VERSÉE (wallet 192) — sinon l'écran promet un montant que
  -- le portefeuille ne voit jamais. Le verrou PK ci-dessus garantit un seul
  -- versement par semaine ; la clé le redouble côté xp_events.
  PERFORM public.wallet_grant_xp(v_user, 'clan_week', v_week::text, v_xp);

  RETURN jsonb_build_object('claimed', TRUE, 'tier', v_tier,
                            'gems', v_gems, 'xp', v_xp);
END;
$$;

REVOKE ALL ON FUNCTION public.clan_week_claim(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.clan_week_claim(DATE) TO authenticated;

-- --- Vérifications (à lancer après la migration, connecté en tant qu'élève) ---
--   select public.clan_week_contribute('duel_win');   → 30 (puis 0 au plafond)
--   select public.clan_week_board();                  → JSONB avec my_clan
--   select public.clan_week_claim(current_date);      → claimed=false (en cours)
