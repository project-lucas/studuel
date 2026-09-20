-- =============================================================================
-- Scolaria — Migration 024 : récompense de connexion journalière.
-- Chaque premier passage de la journée (UTC) crédite des pièces : 10 le
-- premier jour, +5 par jour consécutif, plafonné à 50. La série retombe à 1
-- si un jour est manqué. Le crédit passe UNIQUEMENT par la fonction
-- SECURITY DEFINER ci-dessous (profiles.coins n'est pas modifiable en direct,
-- cf. 018_tresor.sql). PRÉREQUIS : 018 exécutée. Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.login_rewards (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  date       DATE NOT NULL,             -- clé jour UTC (convention du projet)
  coins      INT  NOT NULL CHECK (coins >= 0),
  streak     INT  NOT NULL DEFAULT 1 CHECK (streak >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, date)
);

ALTER TABLE public.login_rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "login_rewards_select_own" ON public.login_rewards;
CREATE POLICY "login_rewards_select_own" ON public.login_rewards
  FOR SELECT USING (auth.uid() = user_id);
-- Pas de policy INSERT : l'écriture passe par claim_login_reward() (definer).

-- -----------------------------------------------------------------------------
-- Réclame la récompense du jour. Tout est calculé côté SQL (rien ne vient du
-- client) : série = celle d'hier + 1, montant = 10 + 5 par jour de série,
-- plafonné à 50. La PK user_id+date garantit un seul crédit par jour.
-- Renvoie {"claimed":true,"coins":N,"streak":N} ou {"claimed":false}.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_login_reward()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_prev   INT;
  v_streak INT;
  v_coins  INT;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('claimed', false);
  END IF;

  SELECT streak INTO v_prev
    FROM public.login_rewards
   WHERE user_id = v_user AND date = v_today - 1;

  v_streak := COALESCE(v_prev, 0) + 1;
  v_coins  := LEAST(10 + (v_streak - 1) * 5, 50);

  INSERT INTO public.login_rewards (user_id, date, coins, streak)
  VALUES (v_user, v_today, v_coins, v_streak)
  ON CONFLICT (user_id, date) DO NOTHING;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('claimed', false);
  END IF;

  UPDATE public.profiles
     SET coins = coins + v_coins
   WHERE id = v_user;

  RETURN jsonb_build_object('claimed', true, 'coins', v_coins, 'streak', v_streak);
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_login_reward() TO authenticated;
