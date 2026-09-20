-- =============================================================================
-- Studuel — Migration 174 : BILAN VICTOIRES / DÉFAITES des duels 1v1
--
-- Les trophées (079) situent l'élève au classement — mais un match classé fait
-- MONTER OU DESCENDRE ce total, et seul le classé y touche. Il manquait un
-- compteur simple et toujours positif : combien de duels ai-je gagnés / perdus ?
-- C'est un flex personnel, décorrélé du classement.
--
--   - profiles.wins / profiles.losses : bilan cumulé, jamais négatif ;
--   - duel_wins_daily : journal des PIÈCES de victoire versées par jour (UTC),
--     pour plafonner la « monnaie de victoire » sans casser l'économie ;
--   - record_duel_result(p_won) : point d'entrée UNIQUE et autoritaire, appelé
--     par la fin de CHAQUE duel (salons de l'Espace Jeux, fantômes d'amis,
--     entraînement, ET match classé — en plus de apply_ranked_match qui, lui,
--     bouge les trophées). Incrémente V ou D et, sur victoire, crédite au plus
--     WIN_COINS (5) pièces, plafonné à WIN_COINS_DAILY_CAP (50) pièces/jour.
--
-- Barème MIROIR EXACT de lib/defi/duel-record.ts (WIN_COINS=5, cap=50). Le
-- montant crédité est figé côté serveur : un appel direct ne peut pas s'injecter
-- de pièces au-delà du plafond du jour. Le compteur V/D, lui, n'est pas borné —
-- il n'ouvre droit à AUCUN trophée ni place au classement, donc le gonfler ne
-- trompe que soi-même (choix assumé : garder la fonction simple et sans friction).
--
-- PRÉREQUIS : 001 (profiles), 018 (profiles.coins). Idempotent.
-- =============================================================================

-- ------------------------------------------------------------------ colonnes
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wins   INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS losses INTEGER NOT NULL DEFAULT 0;

-- Garde-fou : jamais de bilan négatif.
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_winloss_nonneg;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_winloss_nonneg
  CHECK (wins >= 0 AND losses >= 0);

-- ---------------------------------------------------------- journal quotidien
-- Pièces de victoire versées par élève et par jour (UTC), pour le plafond.
-- Même forme que work_daily (084) : bucket par date UTC, écrit uniquement par
-- record_duel_result.
CREATE TABLE IF NOT EXISTS public.duel_wins_daily (
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  day     DATE NOT NULL,
  coins   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

CREATE INDEX IF NOT EXISTS duel_wins_daily_user_day_idx
  ON public.duel_wins_daily (user_id, day DESC);

ALTER TABLE public.duel_wins_daily ENABLE ROW LEVEL SECURITY;

-- L'élève lit son propre journal ; aucune policy d'écriture (seule la RPC écrit).
DROP POLICY IF EXISTS "duel_wins_daily_select_own" ON public.duel_wins_daily;
CREATE POLICY "duel_wins_daily_select_own" ON public.duel_wins_daily
  FOR SELECT USING (auth.uid() = user_id);

-- ----------------------------------------------------------- application
-- Enregistre l'issue d'un duel : incrémente V ou D, et sur victoire crédite la
-- monnaie de victoire dans la limite du plafond journalier. Renvoie le nouveau
-- bilan + les pièces effectivement versées (pour l'affichage). Tout est recalculé
-- ici : le client ne fournit QUE l'issue (won).
CREATE OR REPLACE FUNCTION public.record_duel_result(p_won BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_today   DATE := (now() AT TIME ZONE 'utc')::date;
  v_already INTEGER;
  v_grant   INTEGER := 0;
  v_wins    INTEGER;
  v_losses  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  IF p_won THEN
    -- Pièces déjà gagnées aujourd'hui → reliquat du plafond → montant net.
    SELECT COALESCE(coins, 0) INTO v_already
      FROM public.duel_wins_daily
     WHERE user_id = v_user AND day = v_today;
    v_already := COALESCE(v_already, 0);
    v_grant := GREATEST(0, LEAST(5, 50 - v_already));  -- WIN_COINS=5, cap=50

    UPDATE public.profiles
       SET wins  = wins + 1,
           coins = coins + v_grant
     WHERE id = v_user
    RETURNING wins, losses INTO v_wins, v_losses;

    IF v_grant > 0 THEN
      INSERT INTO public.duel_wins_daily (user_id, day, coins)
      VALUES (v_user, v_today, v_grant)
      ON CONFLICT (user_id, day)
      DO UPDATE SET coins = public.duel_wins_daily.coins + EXCLUDED.coins;
    END IF;
  ELSE
    UPDATE public.profiles
       SET losses = losses + 1
     WHERE id = v_user
    RETURNING wins, losses INTO v_wins, v_losses;
  END IF;

  IF v_wins IS NULL THEN RETURN NULL; END IF;  -- profil introuvable

  RETURN jsonb_build_object(
    'wins', v_wins,
    'losses', v_losses,
    'coins_awarded', v_grant
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_duel_result(BOOLEAN) TO authenticated;
