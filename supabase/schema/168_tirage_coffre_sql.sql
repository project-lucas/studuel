-- =============================================================================
-- Studuel — Migration 168 : tirage du coffre du jour côté SERVEUR (SQL).
--
-- PROBLÈME (résiduel après 165). Le tirage pondéré vivait dans la Server Action
-- `openDailyChest` (app/tresor/actions.ts) : le résultat honnête pour un joueur
-- normal, MAIS le RPC `open_chest(JSONB)` est `GRANT … TO authenticated`, donc
-- un client authentifié peut l'appeler DIRECTEMENT depuis la console avec le
-- payload de son choix. La 165 plafonne le montant à 150, mais un tricheur
-- obtenait alors le JACKPOT (150) garanti chaque jour au lieu d'un tirage
-- (espérance ≈ 35). Le tirage restait donc « choisi par le client ».
--
-- CORRECTIF. Le tirage passe entièrement en SQL : `open_chest_v2()` ne prend
-- AUCUN paramètre, tire la récompense elle-même (miroir de CHEST_REWARDS), la
-- crédite de façon atomique (une ouverture par jour UTC) et RENVOIE la
-- récompense tirée (JSONB) pour que la Server Action l'affiche fidèlement. Le
-- client ne peut plus rien choisir. L'ancien `open_chest(JSONB)` (vecteur
-- d'appel direct) est SUPPRIMÉ — la Server Action prend `open_chest_v2` en
-- priorité et ne retombe sur l'ancien chemin que tant que cette migration
-- n'est pas exécutée (repli transitoire).
--
-- ⚠️ MIROIR de lib/tresor.ts : les POIDS (CHEST_REWARDS) et la liste des CARTES
--    tirables (les 8 savants non exclusifs de COLLECTION_CATALOG) sont recopiés
--    ci-dessous. Tout changement de l'un ou l'autre côté app exige une
--    migration miroir (même logique que la rotation des boss en 165).
--
-- PRÉREQUIS : 018 (chest_opens, profiles.coins, collection_unlocks), 165.
-- Idempotent. À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- ------------------------------------------------------------- open_chest_v2
CREATE OR REPLACE FUNCTION public.open_chest_v2()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_roll   INT;
  v_amount INT;     -- montant en pièces, ou NULL si la récompense est un sticker
  v_card   TEXT;    -- carte de collection tirée (stickers)
  v_reward JSONB;
  -- MIROIR de COLLECTION_CATALOG (lib/tresor.ts) : les 8 savants NON exclusifs.
  -- Les trophées de boss ('trophee-…', exclusive) ne sortent jamais d'un coffre.
  v_cards  TEXT[] := ARRAY['c1','c2','c3','c4','c5','c6','c7','c8'];
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- Tirage pondéré — MIROIR de CHEST_REWARDS (poids sur 100, même ORDRE) :
  --   coins 10:40 | coins 25:30 | coins 60:12 | sticker:10 | coins 150:5 | sticker:3
  -- Les deux stickers (« flamme » et « rare ») se résolvent tous deux en une
  -- carte de collection, exactement comme la Server Action historique.
  v_roll := floor(random() * 100)::int; -- 0..99
  IF    v_roll < 40 THEN v_amount := 10;
  ELSIF v_roll < 70 THEN v_amount := 25;
  ELSIF v_roll < 82 THEN v_amount := 60;
  ELSIF v_roll < 92 THEN v_amount := NULL;  -- sticker
  ELSIF v_roll < 97 THEN v_amount := 150;
  ELSE                   v_amount := NULL;  -- sticker
  END IF;

  -- Sticker : une carte verrouillée non exclusive tirée au hasard ; s'il n'en
  -- reste aucune, repli en +25 pièces (miroir de la Server Action).
  IF v_amount IS NULL THEN
    SELECT c INTO v_card
      FROM unnest(v_cards) AS c
     WHERE c NOT IN (
       SELECT item_id FROM public.collection_unlocks WHERE user_id = v_user
     )
     ORDER BY random()
     LIMIT 1;
    IF v_card IS NULL THEN
      v_amount := 25;
    END IF;
  END IF;

  IF v_amount IS NOT NULL THEN
    v_reward := jsonb_build_object('kind', 'coins', 'amount', v_amount);
  ELSE
    v_reward := jsonb_build_object('kind', 'sticker', 'item_id', v_card);
  END IF;

  -- Une seule ouverture par jour UTC (PK user_id + date).
  INSERT INTO public.chest_opens (user_id, date, reward)
  VALUES (v_user, (now() AT TIME ZONE 'utc')::date, v_reward)
  ON CONFLICT (user_id, date) DO NOTHING;
  IF NOT FOUND THEN RETURN NULL; END IF; -- déjà ouvert aujourd'hui

  IF v_amount IS NOT NULL THEN
    UPDATE public.profiles
       SET coins = coins + v_amount
     WHERE id = v_user;
  ELSE
    INSERT INTO public.collection_unlocks (user_id, item_id)
    VALUES (v_user, v_card)
    ON CONFLICT (user_id, item_id) DO NOTHING;
  END IF;

  RETURN v_reward;
END;
$$;

GRANT EXECUTE ON FUNCTION public.open_chest_v2() TO authenticated;

-- --------------------------------------------- suppression de l'ancien vecteur
-- `open_chest(JSONB)` acceptait un payload choisi par le client (tirage côté
-- appelant) : appelé en direct, il garantissait le jackpot 1×/jour. Une fois
-- `open_chest_v2` en place et la Server Action bascule dessus, on le retire.
DROP FUNCTION IF EXISTS public.open_chest(JSONB);
