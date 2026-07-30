-- =============================================================================
-- Studuel — Migration 213 : « La Traque » — une DÉFAITE ne referme plus la
-- fenêtre d'une heure.
--
-- Ce que la 212 faisait (et qui était faux) : `traque_defaite` remettait
-- `debusque_at` à NULL et la jauge à 50. Autrement dit, la promesse affichée
-- à l'élève — « il disparaît dans 1 h » — était en réalité « tu as UN essai ».
-- Perdre effaçait le gardien, la moitié du travail de traque, et l'appel au
-- combat. C'est exactement le contraire de ce qu'on veut : une heure, autant
-- de tentatives qu'on veut, et on progresse à chaque essai (le combat rejoue
-- les chapitres qu'on vient de réviser).
--
-- Ce que fait la 213 :
--   • `traque_defaite` ne touche plus NI la fenêtre NI les points. Elle
--     compte les tentatives (`boss_gauges.attempts`) — de quoi dire « 3e
--     essai » à l'écran et équilibrer plus tard.
--   • La retombée à 50 reste, mais au SEUL endroit qui la justifie : la
--     fenêtre laissée passer (déjà géré par `traque_credit` à la lecture
--     suivante et par `traque_victoire` hors délai).
--   • `attempts` repart à zéro à chaque nouveau débusquage et à la victoire.
--
-- MIROIR de lib/traque.ts (TraqueGauge.attempts).
--
-- PRÉREQUIS : 212 exécutée.
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

-- --- Le compteur de tentatives ----------------------------------------------

ALTER TABLE public.boss_gauges
  ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  ALTER TABLE public.boss_gauges
    ADD CONSTRAINT boss_gauges_attempts_check CHECK (attempts >= 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

-- --- RPC 1 (remplacée) : créditer la jauge -----------------------------------
-- Identique à la 212, à ceci près que `attempts` repart de zéro quand le boss
-- sort de sa tanière (nouvelle fenêtre = nouveau compteur d'essais) et quand
-- une fenêtre laissée passer est soldée.

CREATE OR REPLACE FUNCTION public.traque_credit(
  p_boss_id  TEXT,
  p_points   INTEGER,
  p_chapters TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := (SELECT auth.uid());
  v_boss     TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_seuil    INTEGER := public.traque_seuil();
  v_ask      INTEGER := GREATEST(0, LEAST(COALESCE(p_points, 0),
                                          public.traque_plafond_jour()));
  v_row      public.boss_gauges;
  v_day_pts  INTEGER;
  v_grant    INTEGER;
  v_points   INTEGER;
  v_attempts INTEGER;
  v_fresh    BOOLEAN := FALSE;
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.boss_gauges (user_id, boss_id, day_key)
  VALUES (v_user, v_boss, v_today)
  ON CONFLICT (user_id, boss_id) DO NOTHING;

  -- Verrou de ligne : deux onglets qui révisent en même temps ne doivent pas
  -- perdre un crédit ni débusquer deux fois.
  SELECT * INTO v_row FROM public.boss_gauges
   WHERE user_id = v_user AND boss_id = v_boss FOR UPDATE;

  v_points   := v_row.points;
  v_attempts := v_row.attempts;

  -- Fenêtre laissée passer : le boss s'est recouché, la jauge repart de la
  -- moitié. On le fait à la LECTURE suivante — pas de tâche planifiée. C'est
  -- le SEUL endroit qui solde une traque perdue : perdre un combat, non.
  IF v_row.debusque_at IS NOT NULL
     AND now() >= v_row.debusque_at + public.traque_fenetre() THEN
    v_row.debusque_at := NULL;
    v_points := public.traque_apres_defaite();
    v_attempts := 0;
  END IF;

  -- Plafond du jour : remis à zéro au changement de jour UTC.
  v_day_pts := CASE WHEN v_row.day_key = v_today THEN v_row.day_points ELSE 0 END;
  v_grant := GREATEST(0, LEAST(v_ask, public.traque_plafond_jour() - v_day_pts));

  -- Boss déjà sorti : la jauge n'avance plus (elle est pleine), mais les
  -- chapitres continuent de se nourrir — le pool du combat reste à jour. Le
  -- plafond du jour n'est pas entamé pour autant : réviser pendant la fenêtre
  -- de combat ne doit pas grignoter le budget de la prochaine traque.
  IF v_row.debusque_at IS NULL THEN
    v_points := LEAST(v_seuil, v_points + v_grant);
    IF v_points >= v_seuil THEN
      v_row.debusque_at := now();
      v_fresh := TRUE;
      v_attempts := 0;                    -- nouvelle fenêtre, nouveaux essais
    END IF;
  ELSE
    v_grant := 0;
  END IF;

  UPDATE public.boss_gauges
     SET points      = v_points,
         chapters    = public.traque_merge_chapters(chapters, p_chapters),
         debusque_at = v_row.debusque_at,
         attempts    = v_attempts,
         day_key     = v_today,
         day_points  = v_day_pts + v_grant,
         updated_at  = now()
   WHERE user_id = v_user AND boss_id = v_boss
   RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'boss_id',       v_row.boss_id,
    'points',        v_row.points,
    'percent',       LEAST(100, (v_row.points * 100) / v_seuil),
    'chapters',      v_row.chapters,
    'victories',     v_row.victories,
    'attempts',      v_row.attempts,
    'debusque_at',   v_row.debusque_at,
    'just_debusque', v_fresh
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_credit(TEXT, INTEGER, TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.traque_credit(TEXT, INTEGER, TEXT[])
  TO authenticated;

-- --- RPC 2 (remplacée) : encaisser une victoire ------------------------------
-- Identique à la 212, plus la remise à zéro du compteur d'essais quand le
-- gardien retourne dans sa tanière.

CREATE OR REPLACE FUNCTION public.traque_victoire(p_boss_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := (SELECT auth.uid());
  v_boss   TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_row    public.boss_gauges;
  v_rank   INTEGER;
  v_amount INTEGER;
  v_week   TIMESTAMPTZ;
  v_spent  INTEGER;
  v_paid   INTEGER := 0;
  v_key    TEXT;
  v_none   JSONB := jsonb_build_object('won', FALSE, 'gems', 0, 'rank', 1,
                                       'victories', 0, 'capped', FALSE);
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN v_none; END IF;

  SELECT * INTO v_row FROM public.boss_gauges
   WHERE user_id = v_user AND boss_id = v_boss FOR UPDATE;
  IF NOT FOUND OR v_row.debusque_at IS NULL THEN RETURN v_none; END IF;
  -- Fenêtre refermée : le combat n'a pas eu lieu dans les temps.
  IF now() >= v_row.debusque_at + public.traque_fenetre() THEN
    UPDATE public.boss_gauges
       SET points = public.traque_apres_defaite(), debusque_at = NULL,
           attempts = 0, updated_at = now()
     WHERE user_id = v_user AND boss_id = v_boss;
    RETURN v_none;
  END IF;

  -- Rang I → III (miroir de lib/bosses.rankFromVictories).
  v_rank := LEAST(1 + v_row.victories, 3);
  v_amount := CASE v_rank WHEN 1 THEN 10 WHEN 2 THEN 15 ELSE 20 END;
  IF v_boss = 'nox' THEN
    v_amount := 30;                                   -- Nox = un chapitre entier
  ELSIF public.traque_en_chasse(v_boss, v_today) THEN
    v_amount := v_amount * 2;                         -- boss en chasse du jour
  END IF;

  -- Plafond hebdomadaire (semaine ISO, lundi 00:00 UTC).
  v_week := date_trunc('week', now() AT TIME ZONE 'utc') AT TIME ZONE 'utc';
  SELECT COALESCE(SUM(amount), 0) INTO v_spent
    FROM public.gem_events
   WHERE user_id = v_user AND source = 'traque_win' AND created_at >= v_week;
  v_amount := GREATEST(0, LEAST(v_amount,
                                public.traque_gems_week_cap() - v_spent));

  -- Une victoire payée UNE fois par débusquage.
  IF v_amount > 0 THEN
    v_key := v_boss || ':' || to_char(v_row.debusque_at AT TIME ZONE 'utc',
                                      'YYYY-MM-DD"T"HH24:MI:SS');
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'traque_win', v_key, v_amount)
    ON CONFLICT (user_id, source, source_key) DO NOTHING;
    IF FOUND THEN
      UPDATE public.profiles SET gems = gems + v_amount WHERE id = v_user;
      v_paid := v_amount;
    END IF;
  END IF;

  -- Le boss retourne dans sa tanière, plus fort : jauge à zéro, rang +1.
  UPDATE public.boss_gauges
     SET victories = victories + 1, points = 0, debusque_at = NULL,
         attempts = 0, updated_at = now()
   WHERE user_id = v_user AND boss_id = v_boss
   RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'won',       TRUE,
    'gems',      v_paid,
    'rank',      LEAST(v_row.victories + 1, 3),
    'victories', v_row.victories,
    'capped',    v_paid = 0
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_victoire(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.traque_victoire(TEXT) TO authenticated;

-- --- RPC 3 (remplacée) : encaisser une défaite -------------------------------
-- LA correction de fond. Perdre ne referme plus rien : le gardien reste sorti
-- jusqu'à la fin de sa fenêtre, l'élève retente autant qu'il veut. On ne
-- compte que les essais — et seulement si la fenêtre court encore, pour ne pas
-- gonfler le compteur avec un combat terminé après coup.
--
-- Renvoie { open, attempts, debusque_at } — `open` dit à l'écran de fin s'il
-- peut proposer la revanche.

CREATE OR REPLACE FUNCTION public.traque_defaite(p_boss_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := (SELECT auth.uid());
  v_boss TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_row  public.boss_gauges;
  v_shut JSONB := jsonb_build_object('open', FALSE, 'attempts', 0,
                                     'debusque_at', NULL);
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN v_shut; END IF;

  UPDATE public.boss_gauges
     SET attempts = attempts + 1, updated_at = now()
   WHERE user_id = v_user AND boss_id = v_boss
     AND debusque_at IS NOT NULL
     AND now() < debusque_at + public.traque_fenetre()
   RETURNING * INTO v_row;
  IF NOT FOUND THEN RETURN v_shut; END IF;

  RETURN jsonb_build_object(
    'open',        TRUE,
    'attempts',    v_row.attempts,
    'debusque_at', v_row.debusque_at
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_defaite(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.traque_defaite(TEXT) TO authenticated;

-- =============================================================================
-- Fin de la migration 213.
-- =============================================================================
