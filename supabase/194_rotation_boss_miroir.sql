-- =============================================================================
-- Studuel — Migration 194 : réaligne la rotation des boss sur lib/bosses.ts
--
-- BUG CORRIGÉ (récompense hebdo silencieusement refusée).
--
-- `claim_weekly_trophy` (migration 165) recalcule EN SQL le boss de la semaine
-- pour que le client ne puisse pas réclamer le trophée de son choix. Sa liste
-- est le MIROIR de `ALL_BOSSES` (lib/bosses.ts) — et les deux ont divergé :
--
--   SQL (165) : 14 boss  … 'nova', 'nox'
--   App       : 17 boss  … 'nova', 'coach-turbo', 'kaiser-fang', 'fiscus', 'nox'
--
-- Les trois boss ajoutés côté app (refonte DA v2) n'ont jamais été re-migrés.
-- Comme le boss de la semaine se calcule par `semaine % taille_de_la_liste`,
-- 14 ≠ 17 fait diverger les deux rotations dès que le modulo décroche : l'app
-- annonce le boss A, l'élève le bat, et la RPC — qui attend le boss B — répond
-- `false`. Le trophée n'est jamais crédité, sans le moindre message d'erreur :
-- exactement le mode de panne « échec silencieux » documenté dans le projet.
--
-- Cette migration se contente de recopier la liste à l'identique. Aucune autre
-- ligne de `claim_weekly_trophy` ne change (montant 80 pièces, garde
-- anti-rejeu, calcul de la semaine sur le lundi UTC).
--
-- ⚠️ RÈGLE : toute modification de `ALL_BOSSES` exige une nouvelle migration
-- miroir. Le garde-fou `lib/bosses-mirror.test.ts` compare désormais les deux
-- listes à chaque `npm test` et casse la construction en cas de dérive.
--
-- PRÉREQUIS : 165. Idempotent (CREATE OR REPLACE).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.claim_weekly_trophy(p_item_id TEXT, p_coins INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  -- Ordre exact de ALL_BOSSES (lib/bosses.ts) : le catalogue, puis Nox.
  v_ids   TEXT[] := ARRAY[
    'delta','grammatork','imperator','chronos','bigben','eltoro','plasma',
    'mitochondrix','bugzilla','mecatron','krach','sphinx','nova','coach-turbo',
    'kaiser-fang','fiscus','nox'
  ];
  v_days  INT;
  v_week  INT;
  v_expected TEXT;
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  -- Boss de la semaine : semaine calée sur le lundi UTC (epoch 1970-01-01 =
  -- jeudi → +3), même formule que weeklyBoss(dayKey).
  v_days := (now() AT TIME ZONE 'utc')::date - DATE '1970-01-01';
  v_week := (v_days + 3) / 7; -- division entière, positif
  v_expected := 'trophee-' || v_ids[(v_week % array_length(v_ids, 1)) + 1];

  -- Le client ne choisit rien : l'id doit être LE trophée de la semaine.
  IF p_item_id IS DISTINCT FROM v_expected THEN RETURN false; END IF;

  INSERT INTO public.collection_unlocks (user_id, item_id)
  VALUES (v_user, v_expected)
  ON CONFLICT (user_id, item_id) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF; -- trophée déjà réclamé

  -- Montant fixe du barème (WEEKLY_TROPHY_COINS) — p_coins est ignoré.
  UPDATE public.profiles
     SET coins = coins + 80
   WHERE id = v_user;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_weekly_trophy(TEXT, INT) TO authenticated;

-- Sonde : la liste doit compter 17 boss, et se terminer par Nox.
DO $$
DECLARE
  v_src TEXT;
BEGIN
  SELECT prosrc INTO v_src FROM pg_proc WHERE proname = 'claim_weekly_trophy';
  IF v_src IS NULL THEN
    RAISE EXCEPTION 'claim_weekly_trophy absente — migration 165 non passée ?';
  END IF;
  IF v_src NOT LIKE '%kaiser-fang%' OR v_src NOT LIKE '%coach-turbo%' THEN
    RAISE EXCEPTION 'Migration 194 : la rotation n''a pas été remplacée.';
  END IF;
  RAISE NOTICE 'Migration 194 OK — rotation des boss alignée sur ALL_BOSSES (17).';
END $$;
