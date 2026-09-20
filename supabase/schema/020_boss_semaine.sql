-- =============================================================================
-- Scolaria — Migration 020 : boss de la semaine (événement hebdomadaire).
-- Battre le boss de la semaine débloque une carte de collection exclusive
-- (trophée) et verse quelques pièces. L'identité du boss et l'id du trophée
-- sont calculés côté serveur (app/defi/actions.ts, rotation déterministe) —
-- jamais pris du client. collection_unlocks n'a pas de policy INSERT : le
-- déblocage passe par cette fonction SECURITY DEFINER, comme open_chest().
-- La PK (user_id, item_id) garantit un seul versement par trophée : le boss
-- change chaque semaine, donc une seule récompense par semaine.
-- PRÉREQUIS : 018 exécutée. Idempotent.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.claim_weekly_trophy(p_item_id TEXT, p_coins INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL OR p_item_id IS NULL OR p_item_id = '' THEN
    RETURN false;
  END IF;

  INSERT INTO public.collection_unlocks (user_id, item_id)
  VALUES (v_user, p_item_id)
  ON CONFLICT (user_id, item_id) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF; -- trophée déjà réclamé

  UPDATE public.profiles
     SET coins = coins + GREATEST(0, LEAST(p_coins, 150))
   WHERE id = v_user;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_weekly_trophy(TEXT, INT) TO authenticated;
