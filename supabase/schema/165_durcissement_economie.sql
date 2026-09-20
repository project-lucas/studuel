-- =============================================================================
-- Studuel — Migration 165 : durcissement de l'économie (revue sécurité du
-- 2026-07-17). Trois trous « le client choisit sa récompense » fermés, sur le
-- modèle 088 (signatures inchangées, paramètre dangereux neutralisé) :
--
-- 1. claim_weekly_trophy (020) — CRITIQUE. La fonction créditait p_coins
--    (borné à 150) pour N'IMPORTE QUEL p_item_id inédit : en boucle avec des
--    item_id inventés, pièces illimitées + cartes exclusives sans victoire.
--    Désormais : l'id du trophée de LA semaine est recalculé en SQL (même
--    rotation déterministe que lib/bosses.ts) et les pièces sont le montant
--    fixe du barème (80) — les deux paramètres ne sont plus que vérifiés.
--
-- 2. open_chest (018) — le tirage restait côté client : un appel direct avec
--    {kind:'coins',amount:500} garantissait le plafond au lieu du tirage, et
--    {kind:'sticker',item_id:'trophee-…'} débloquait un trophée de boss sans
--    le battre. Désormais : pièces plafonnées au jackpot réel du catalogue
--    (150), item_id au format catalogue et jamais 'trophee-%' (réservés à
--    claim_weekly_trophy).
--
-- 3. challenge_sessions (011) — aucune contrainte de valeur : un INSERT
--    direct (la policy ne vérifie que user_id) pouvait poser xp=999999999.
--    CHECK NOT VALID (les lignes existantes ne sont pas re-validées) borné
--    large au-dessus du barème réel (max légitime ≈ 670 XP).
--
-- PRÉREQUIS : 011, 018, 020. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------------- claim_weekly_trophy
-- ⚠️ La rotation ci-dessous est le MIROIR de lib/bosses.ts (ALL_BOSSES +
-- weeklyBoss) : si la liste des boss change côté app, cette fonction doit
-- être re-migrée à l'identique.
CREATE OR REPLACE FUNCTION public.claim_weekly_trophy(p_item_id TEXT, p_coins INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  -- Ordre exact de ALL_BOSSES (lib/bosses.ts) : catalogue puis Nox.
  v_ids   TEXT[] := ARRAY[
    'delta','grammatork','imperator','chronos','bigben','eltoro','plasma',
    'mitochondrix','bugzilla','mecatron','krach','sphinx','nova','nox'
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

-- ------------------------------------------------------------------ open_chest
CREATE OR REPLACE FUNCTION public.open_chest(p_reward JSONB)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_item TEXT;
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  INSERT INTO public.chest_opens (user_id, date, reward)
  VALUES (v_user, (now() AT TIME ZONE 'utc')::date, p_reward)
  ON CONFLICT (user_id, date) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF;

  IF p_reward->>'kind' = 'coins' THEN
    -- Plafond = jackpot réel du catalogue (lib/tresor.ts : 10/25/60/150).
    UPDATE public.profiles
       SET coins = coins + GREATEST(0, LEAST((p_reward->>'amount')::int, 150))
     WHERE id = v_user;
  ELSIF p_reward->>'kind' = 'sticker' AND p_reward ? 'item_id' THEN
    v_item := p_reward->>'item_id';
    -- Format catalogue uniquement, et JAMAIS un trophée de boss ('trophee-%',
    -- réservés à claim_weekly_trophy).
    IF v_item ~ '^[a-z0-9][a-z0-9-]{0,63}$' AND v_item NOT LIKE 'trophee-%' THEN
      INSERT INTO public.collection_unlocks (user_id, item_id)
      VALUES (v_user, v_item)
      ON CONFLICT (user_id, item_id) DO NOTHING;
    END IF;
  END IF;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.open_chest(JSONB) TO authenticated;

-- ------------------------------------------------- challenge_sessions : CHECK
-- Défense en profondeur : la Server Action borne déjà, mais la policy INSERT
-- ne vérifie que user_id — un INSERT direct pouvait tout poser. NOT VALID :
-- seules les nouvelles lignes sont contraintes (pas de re-scan de l'existant).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'challenge_sessions_bounds_check'
      AND conrelid = 'public.challenge_sessions'::regclass
  ) THEN
    ALTER TABLE public.challenge_sessions
      ADD CONSTRAINT challenge_sessions_bounds_check
      CHECK (
        score >= 0 AND total >= 0 AND total <= 50 AND score <= total
        AND xp >= 0 AND xp <= 1000
      ) NOT VALID;
  END IF;
END $$;
