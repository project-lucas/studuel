-- =============================================================================
-- Studuel — Migration 081 : récompense du débrief du jour (onglet Moi)
-- Quand l'élève a terminé son débrief du jour (chaque habitude référencée a une
-- issue « rechute »/« victoire »), il gagne des pièces — une seule fois par jour.
-- Comme pour le coffre (018), le solde profiles.coins n'est PAS dans le GRANT
-- par colonnes : seul claim_debrief_reward() (SECURITY DEFINER) peut le créditer,
-- et uniquement pour soi (auth.uid()), un crédit borné, une seule fois par jour.
-- PRÉREQUIS : 018 (profiles.coins), 027 (débrief). Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- DEBRIEF_REWARDS — une ligne par jour où la récompense a été réclamée.
-- Sert de garde d'idempotence (PK user_id+date) : pas de double crédit.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.debrief_rewards (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  coins      INT  NOT NULL CHECK (coins >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, date)
);

ALTER TABLE public.debrief_rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "debrief_rewards_select_own" ON public.debrief_rewards;
CREATE POLICY "debrief_rewards_select_own" ON public.debrief_rewards
  FOR SELECT USING (auth.uid() = user_id);
-- Pas de policy INSERT : l'écriture passe par claim_debrief_reward() (definer).

-- -----------------------------------------------------------------------------
-- Réclamation de la récompense du jour. Le montant est validé/borné côté
-- serveur (action) et re-borné ici. La fonction garantit :
--   - une seule récompense par jour UTC (PK user_id+date) ;
--   - un crédit borné (jamais plus de 100 pièces d'un coup).
-- Renvoie true si la récompense vient d'être créditée, false si déjà prise.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_debrief_reward(p_coins INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_coins INT  := GREATEST(0, LEAST(COALESCE(p_coins, 0), 100));
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
