-- =============================================================================
-- Scolaria — Migration 018 : économie du Trésor (pièces, coffre, boutique,
-- collection). Le solde vit sur profiles.coins — VOLONTAIREMENT absent du
-- GRANT UPDATE par colonnes : seules les fonctions SECURITY DEFINER ci-dessous
-- peuvent le modifier, et uniquement pour soi (auth.uid()).
-- Le catalogue (articles, prix, cartes) reste côté application (lib/tresor.ts) ;
-- la base garantit l'intégrité : une ouverture de coffre par jour (UTC),
-- un achat unique par article, jamais de solde négatif.
-- PRÉREQUIS : 001 exécutée. Idempotent.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS coins BIGINT NOT NULL DEFAULT 0;

-- -----------------------------------------------------------------------------
-- Coffre du jour : une ligne par utilisateur et par jour (clé UTC).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chest_opens (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  reward     JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, date)
);

ALTER TABLE public.chest_opens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chest_opens_select_own" ON public.chest_opens;
CREATE POLICY "chest_opens_select_own" ON public.chest_opens
  FOR SELECT USING (auth.uid() = user_id);
-- Pas de policy INSERT : l'écriture passe par open_chest() (definer).

-- -----------------------------------------------------------------------------
-- Achats de boutique : un article ne s'achète qu'une fois.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shop_purchases (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  item_id    TEXT NOT NULL,
  price      INT  NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

ALTER TABLE public.shop_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_purchases_select_own" ON public.shop_purchases;
CREATE POLICY "shop_purchases_select_own" ON public.shop_purchases
  FOR SELECT USING (auth.uid() = user_id);
-- Pas de policy INSERT : l'écriture passe par buy_shop_item() (definer).

-- -----------------------------------------------------------------------------
-- Cartes de collection débloquées.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collection_unlocks (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  item_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

ALTER TABLE public.collection_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "collection_unlocks_select_own" ON public.collection_unlocks;
CREATE POLICY "collection_unlocks_select_own" ON public.collection_unlocks
  FOR SELECT USING (auth.uid() = user_id);
-- Pas de policy INSERT : le déblocage passe par open_chest() (definer).

-- -----------------------------------------------------------------------------
-- Ouverture du coffre du jour. Le tirage est fait côté serveur (action) et
-- passé en JSON : {"kind":"coins","amount":25,...} ou
-- {"kind":"sticker","item_id":"c5",...}. La fonction garantit :
--   - une seule ouverture par jour UTC (PK user_id+date) ;
--   - un crédit borné (jamais plus de 500 pièces d'un coup).
-- Renvoie true si le coffre a été ouvert, false s'il l'était déjà.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.open_chest(p_reward JSONB)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  INSERT INTO public.chest_opens (user_id, date, reward)
  VALUES (v_user, (now() AT TIME ZONE 'utc')::date, p_reward)
  ON CONFLICT (user_id, date) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF;

  IF p_reward->>'kind' = 'coins' THEN
    UPDATE public.profiles
       SET coins = coins + GREATEST(0, LEAST((p_reward->>'amount')::int, 500))
     WHERE id = v_user;
  ELSIF p_reward->>'kind' = 'sticker' AND p_reward ? 'item_id' THEN
    INSERT INTO public.collection_unlocks (user_id, item_id)
    VALUES (v_user, p_reward->>'item_id')
    ON CONFLICT (user_id, item_id) DO NOTHING;
  END IF;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.open_chest(JSONB) TO authenticated;

-- -----------------------------------------------------------------------------
-- Achat d'un article : débit + enregistrement, atomique. Le prix est validé
-- par l'action serveur contre le catalogue applicatif avant l'appel.
-- Renvoie true si l'achat est passé (solde suffisant, article pas déjà obtenu).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.buy_shop_item(p_item_id TEXT, p_price INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL OR p_price < 0 THEN RETURN false; END IF;
  IF EXISTS (
    SELECT 1 FROM public.shop_purchases
    WHERE user_id = v_user AND item_id = p_item_id
  ) THEN RETURN false; END IF;

  UPDATE public.profiles
     SET coins = coins - p_price
   WHERE id = v_user AND coins >= p_price;
  IF NOT FOUND THEN RETURN false; END IF;

  INSERT INTO public.shop_purchases (user_id, item_id, price)
  VALUES (v_user, p_item_id, p_price);
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.buy_shop_item(TEXT, INT) TO authenticated;
