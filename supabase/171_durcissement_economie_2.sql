-- =============================================================================
-- Studuel — Migration 171 : durcissement de l'économie, 2e passe.
--
-- La 165 avait fermé 3 trous « le client choisit sa récompense » (claim_weekly_
-- trophy, open_chest, challenge_sessions). Un balayage complet des RPC qui
-- CRÉDITENT une ressource (pièces / trophées / temps) en révèle 4 autres. Toutes
-- sont appelables EN DIRECT par un client authentifié (le serveur n'a que la clé
-- anon), donc le montant/résultat doit être autoritaire côté SQL — pas un
-- plafond lâche supérieur à la valeur légitime, pas un résultat non borné.
--
-- 1. claim_revanche_bonus (021) — plafond 100 alors que le bonus légitime est
--    40 (REVANCHE_CLEAR_COINS). Un appel direct `{p_coins:100}` créditait 100
--    au lieu de 40 (1×/jour). → montant FIXE 40, p_coins ignoré (modèle 165).
--
-- 2. claim_debrief_reward (081) — plafond 100 alors que la récompense légitime
--    est 10 (DEBRIEF_REWARD_COINS). → montant FIXE 10, p_coins ignoré.
--
-- 3. add_work_time (084) — plafond 3600 s PAR APPEL mais AUCUN plafond
--    journalier ni anti-rejeu : des appels répétés gonflaient work_seconds /
--    work_daily sans limite (classement communauté + tableau parents faussés).
--    → plafond journalier 8 h (28800 s) ; profiles.work_seconds crédité du delta
--    réellement appliqué pour rester cohérent avec le journal du jour.
--
-- 4. apply_ranked_match (079) — CRITIQUE. Le barème Elo est bien recalculé en
--    SQL, mais `p_won` vient du client et RIEN ne borne la fréquence d'appel :
--    `{p_won:true, p_opponent_trophies:me+150}` en boucle = farming ILLIMITÉ de
--    trophées (+ best_trophies, affiché aux amis). Faute d'une preuve de match
--    non falsifiable (chantier séparé : jeton de match serveur + refonte du flux
--    /defi/jouer, à faire avec QA), on BORNE ici le rythme via le journal
--    ranked_matches : au-delà de 30 crédits/heure (un BO3 dure plusieurs
--    minutes), on refuse. Transforme « illimité » en « borné et lent ».
--
-- ⚠️ Les montants figés ci-dessous (40, 10) sont des MIROIRS de lib/srs.ts et
--    lib/debrief.ts : les changer côté app exige une migration miroir.
--
-- PRÉREQUIS : 021, 081, 084, 079. Idempotent (CREATE OR REPLACE, signatures
-- inchangées). À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- ------------------------------------------------------- claim_revanche_bonus
-- Reproduction fidèle de la 021 + montant FIXE (p_coins ignoré). Gardes
-- conservées : Revanche réellement vide + une seule fois par jour UTC.
CREATE OR REPLACE FUNCTION public.claim_revanche_bonus(p_coins INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  -- Garde-fou serveur : le bonus ne se réclame que Revanche réellement vide.
  IF EXISTS (
    SELECT 1 FROM public.review_items
    WHERE user_id = v_user AND in_revanche
  ) THEN RETURN false; END IF;

  INSERT INTO public.revanche_clears (user_id, date)
  VALUES (v_user, (now() AT TIME ZONE 'utc')::date)
  ON CONFLICT (user_id, date) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF; -- déjà réclamé aujourd'hui

  -- Montant FIXE du barème (REVANCHE_CLEAR_COINS = 40, lib/srs.ts) — p_coins
  -- n'est plus qu'un vestige de signature, ignoré.
  UPDATE public.profiles
     SET coins = coins + 40
   WHERE id = v_user;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_revanche_bonus(INT) TO authenticated;

-- -------------------------------------------------------- claim_debrief_reward
-- Reproduction fidèle de la 081 + montant FIXE (p_coins ignoré). Garde d'unicité
-- par jour conservée (PK debrief_rewards).
CREATE OR REPLACE FUNCTION public.claim_debrief_reward(p_coins INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  -- Montant FIXE du barème (DEBRIEF_REWARD_COINS = 10, lib/debrief.ts).
  v_coins INT  := 10;
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  INSERT INTO public.debrief_rewards (user_id, date, coins)
  VALUES (v_user, (now() AT TIME ZONE 'utc')::date, v_coins)
  ON CONFLICT (user_id, date) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF;

  UPDATE public.profiles
     SET coins = coins + v_coins
   WHERE id = v_user;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_debrief_reward(INT) TO authenticated;

-- --------------------------------------------------------------- add_work_time
-- Reproduction de la 084 + PLAFOND JOURNALIER 8 h. On ne crédite (journal +
-- cumul global) que la fraction qui reste sous le plafond du jour, pour que
-- profiles.work_seconds reste cohérent avec work_daily.
CREATE OR REPLACE FUNCTION public.add_work_time(p_seconds INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID    := auth.uid();
  v_add     INTEGER := GREATEST(0, LEAST(p_seconds, 3600)); -- plafond par appel
  v_day     DATE    := (now() AT TIME ZONE 'utc')::date;
  v_cur     INTEGER;
  v_applied INTEGER;
BEGIN
  IF v_user IS NULL OR v_add = 0 THEN RETURN; END IF;

  -- Temps déjà compté aujourd'hui (verrou de ligne pour un cumul cohérent).
  SELECT seconds INTO v_cur
    FROM public.work_daily
   WHERE user_id = v_user AND day = v_day
   FOR UPDATE;
  v_cur := COALESCE(v_cur, 0);

  -- Delta réellement applicable sous le plafond de 8 h/jour (28800 s).
  v_applied := LEAST(v_cur + v_add, 28800) - v_cur;
  IF v_applied <= 0 THEN RETURN; END IF; -- plafond du jour déjà atteint

  INSERT INTO public.work_daily (user_id, day, seconds)
  VALUES (v_user, v_day, v_applied)
  ON CONFLICT (user_id, day)
  DO UPDATE SET seconds = public.work_daily.seconds + v_applied;

  UPDATE public.profiles
     SET work_seconds = work_seconds + v_applied
   WHERE id = v_user;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_work_time(INTEGER) TO authenticated;

-- ------------------------------------------------------------ apply_ranked_match
-- Reproduction fidèle de la 079 (barème Elo serveur, adversaire borné ±150,
-- delta clampé) + BORNE DE RYTHME anti-farming : refuse au-delà de 30 crédits
-- classés dans l'heure glissante (un BO3 dure plusieurs minutes ; un rythme
-- supérieur trahit un appel direct en boucle). Le journal ranked_matches sert
-- de compteur (index user_id, created_at DESC déjà présent).
-- NB : ce n'est qu'une BORNE. Le correctif complet (rendre `p_won` infalsifiable
-- via un jeton de match émis côté serveur au lancement du duel) exige une
-- refonte du flux /defi/jouer + QA — chantier séparé signalé à Lucas.
CREATE OR REPLACE FUNCTION public.apply_ranked_match(
  p_won BOOLEAN,
  p_opponent_trophies INTEGER,
  p_opponent_label TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_before   INTEGER;
  v_best     INTEGER;
  v_opp      INTEGER;
  v_expected DOUBLE PRECISION;
  v_raw      DOUBLE PRECISION;
  v_delta    INTEGER;
  v_after    INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- Borne de rythme : au-delà de 30 matchs classés dans l'heure, on refuse.
  IF (SELECT count(*) FROM public.ranked_matches
        WHERE user_id = v_user
          AND created_at >= now() - INTERVAL '1 hour') >= 30 THEN
    RETURN NULL;
  END IF;

  SELECT trophies, best_trophies INTO v_before, v_best
    FROM public.profiles WHERE id = v_user FOR UPDATE;
  IF v_before IS NULL THEN RETURN NULL; END IF;

  -- Adversaire borné à ±150 du joueur (matchmaking équitable, anti-triche).
  v_opp := GREATEST(v_before - 150,
             LEAST(v_before + 150, COALESCE(p_opponent_trophies, v_before)));

  v_expected := 1.0 / (1.0 + power(10.0, (v_opp - v_before) / 400.0));
  v_raw := 40.0 * ((CASE WHEN p_won THEN 1 ELSE 0 END) - v_expected);

  IF p_won THEN
    v_delta := GREATEST(12, LEAST(40, round(v_raw)::int));
  ELSE
    v_delta := LEAST(-6, GREATEST(-30, round(v_raw)::int));
  END IF;

  v_after := GREATEST(0, v_before + v_delta);
  v_best  := GREATEST(v_best, v_after);

  UPDATE public.profiles
     SET trophies = v_after, best_trophies = v_best
   WHERE id = v_user;

  INSERT INTO public.ranked_matches (user_id, won, delta, trophies, opponent)
  VALUES (v_user, p_won, v_delta, v_after, left(p_opponent_label, 80));

  RETURN jsonb_build_object(
    'before', v_before,
    'after', v_after,
    'delta', v_delta,
    'best', v_best
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.apply_ranked_match(BOOLEAN, INTEGER, TEXT) TO authenticated;
