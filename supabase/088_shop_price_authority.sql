-- =============================================================================
-- Studuel — Migration 088 : prix de boutique autoritatif côté serveur
--
-- FAILLE corrigée : buy_shop_item(p_item_id, p_price) (018) débitait EXACTEMENT
-- le p_price reçu du client. La fonction étant GRANT EXECUTE à authenticated,
-- n'importe quel élève connecté pouvait l'appeler DIRECTEMENT (console, il a la
-- clé anon + sa session) avec p_price = 0 et s'offrir n'importe quel article
-- gratuitement (`coins - 0 WHERE coins >= 0` réussit toujours). Le commentaire
-- « prix validé par l'action » ne protégeait rien : l'action serveur est
-- contournable, la RPC ne l'est pas.
--
-- Correctif : on stocke les prix dans une table shop_prices (miroir de
-- lib/tresor.ts) et buy_shop_item lit le prix EN BASE. p_price est désormais
-- IGNORÉ (paramètre gardé pour compat : l'action continue de le passer sans
-- effet, donc AUCUN changement de code applicatif et aucune fenêtre de casse —
-- l'ancienne prod tourne toujours, la nouvelle enferme le prix).
--
-- PRÉREQUIS : 018_tresor.sql. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Pense à re-seeder ici si tu changes un prix dans SHOP_CATALOG (lib/tresor.ts).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.shop_prices (
  item_id TEXT PRIMARY KEY,
  price   INT  NOT NULL CHECK (price >= 0)
);

-- Aucune policy : la table n'est lue que par buy_shop_item (SECURITY DEFINER).
-- Le catalogue affiché vit toujours dans l'app (lib/tresor.ts) ; cette table ne
-- sert QU'À l'autorité du prix au débit.
ALTER TABLE public.shop_prices ENABLE ROW LEVEL SECURITY;

-- Seed idempotent, aligné sur SHOP_CATALOG (lib/tresor.ts).
INSERT INTO public.shop_prices (item_id, price) VALUES
  ('freeze',             120),
  ('double',             200),
  ('flame-blue',          90),
  ('theme-nuit',         150),
  ('avatar-astro',       110),
  ('flame-rainbow',      300),
  ('compagnon-chapeau',  130),
  ('compagnon-lunettes', 100),
  ('compagnon-echarpe',   80)
ON CONFLICT (item_id) DO UPDATE SET price = EXCLUDED.price;

-- Redéfinition : le prix vient de shop_prices, jamais du paramètre. Article hors
-- catalogue → achat refusé. Le reste est inchangé (un achat unique par article,
-- jamais de solde négatif).
CREATE OR REPLACE FUNCTION public.buy_shop_item(p_item_id TEXT, p_price INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_price INT;
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  -- Prix autoritatif (p_price ignoré — volontairement, cf. en-tête).
  SELECT price INTO v_price FROM public.shop_prices WHERE item_id = p_item_id;
  IF v_price IS NULL THEN RETURN false; END IF;

  IF EXISTS (
    SELECT 1 FROM public.shop_purchases
    WHERE user_id = v_user AND item_id = p_item_id
  ) THEN RETURN false; END IF;

  UPDATE public.profiles
     SET coins = coins - v_price
   WHERE id = v_user AND coins >= v_price;
  IF NOT FOUND THEN RETURN false; END IF;

  INSERT INTO public.shop_purchases (user_id, item_id, price)
  VALUES (v_user, p_item_id, v_price);
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.buy_shop_item(TEXT, INT) TO authenticated;
