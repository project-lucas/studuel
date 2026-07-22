-- =============================================================================
-- Studuel — Migration 189 : vestiaire d'avatar (catalogue, achats, déblocages)
--
-- L'écran /moi/avatar (« vestiaire ») présente TOUT le catalogue, y compris les
-- items verrouillés avec leur condition : le catalogue est la roadmap de
-- motivation. Un item est soit gratuit d'office (price NULL et
-- unlock_condition NULL), soit achetable (price), soit verrouillé par
-- accomplissement (unlock_condition — la condition prime sur le prix).
--
-- Sécurité (leçons de 088) :
--   - le PRIX est lu EN BASE par purchase_avatar_item, jamais reçu du client ;
--   - les CONDITIONS sont évaluées EN BASE par claim_avatar_unlocks (série via
--     current_streak (155/170), niveau via work_seconds, questions via
--     test_sessions) — le client ne peut pas s'auto-débloquer un item ;
--   - user_avatar_items n'a AUCUNE policy d'écriture : seules les deux RPC
--     SECURITY DEFINER insèrent.
--
-- L'asset_key mappe vers le moteur de rendu de l'app (DiceBear, lib/avatar.ts)
-- ou vers les couches maison (équipement, bannière) — miroir de
-- lib/avatar-studio.ts, qui ignore toute ligne invalide.
--
-- PRÉREQUIS : schema.sql (profiles), 014 (work_seconds), 018 (coins),
--             155/170 (current_streak). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ---------------------------------------------------------------- catalogue
CREATE TABLE IF NOT EXISTS public.avatar_items (
  id               TEXT PRIMARY KEY,
  category         TEXT NOT NULL CHECK (category IN
                     ('body_skin','hair_style','hair_color','outfit','equipment','banner')),
  name             TEXT NOT NULL,
  asset_key        TEXT NOT NULL,
  price            INT CHECK (price >= 0),          -- NULL = pas à vendre
  unlock_condition JSONB,                           -- ex: {"type":"streak","value":7}
  rarity           TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN
                     ('common','rare','legendary')),
  sort             INT NOT NULL DEFAULT 0
);

ALTER TABLE public.avatar_items ENABLE ROW LEVEL SECURITY;

-- Catalogue entier lisible par tout élève connecté (les verrouillés inclus :
-- ils s'affichent grisés avec leur condition).
DROP POLICY IF EXISTS "avatar_items_select" ON public.avatar_items;
CREATE POLICY "avatar_items_select" ON public.avatar_items
  FOR SELECT TO authenticated USING (true);

-- ---------------------------------------------------------------- possession
CREATE TABLE IF NOT EXISTS public.user_avatar_items (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id     TEXT NOT NULL REFERENCES public.avatar_items(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

ALTER TABLE public.user_avatar_items ENABLE ROW LEVEL SECURITY;

-- Lecture : chacun ses items. AUCUNE policy INSERT/UPDATE/DELETE — l'écriture
-- passe exclusivement par les RPC SECURITY DEFINER ci-dessous.
DROP POLICY IF EXISTS "user_avatar_items_select" ON public.user_avatar_items;
CREATE POLICY "user_avatar_items_select" ON public.user_avatar_items
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ---------------------------------------------------------------- achat
-- Prix autoritatif en base. Refuse : item inconnu, non à vendre (gratuit ou
-- verrouillé), déjà possédé, solde insuffisant. Débit + possession atomiques.
CREATE OR REPLACE FUNCTION public.purchase_avatar_item(p_item_id TEXT)
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

  SELECT price INTO v_price
  FROM public.avatar_items
  WHERE id = p_item_id AND price IS NOT NULL AND unlock_condition IS NULL;
  IF v_price IS NULL THEN RETURN false; END IF;

  IF EXISTS (
    SELECT 1 FROM public.user_avatar_items
    WHERE user_id = v_user AND item_id = p_item_id
  ) THEN RETURN false; END IF;

  UPDATE public.profiles
     SET coins = coins - v_price
   WHERE id = v_user AND coins >= v_price;
  IF NOT FOUND THEN RETURN false; END IF;

  INSERT INTO public.user_avatar_items (user_id, item_id)
  VALUES (v_user, p_item_id);
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.purchase_avatar_item(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purchase_avatar_item(TEXT) TO authenticated;

-- ---------------------------------------------------------------- déblocages
-- Appelée à l'ouverture du vestiaire : évalue chaque condition contre les
-- données réelles et crédite les items mérités. Renvoie les ids réclamés
-- (vide si rien de neuf). Pas de temps réel en V1 : ce passage suffit.
--
-- Niveau : miroir des paliers d'heures de lib/work-level.ts (niveau = nombre
-- de paliers atteints). Pense à re-seeder ici si les TIERS changent côté app.
-- Questions : somme des questions vues en session de quiz (test_sessions.total).
CREATE OR REPLACE FUNCTION public.claim_avatar_unlocks()
RETURNS SETOF TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user      UUID := auth.uid();
  v_streak    INT;
  v_level     INT;
  v_questions BIGINT;
  v_tiers     INT[] := ARRAY[0, 1, 3, 6, 12, 25, 50, 100, 250, 500, 1000]; -- heures
  v_hours     NUMERIC;
BEGIN
  IF v_user IS NULL THEN RETURN; END IF;

  v_streak := COALESCE(public.current_streak(v_user), 0);

  SELECT COALESCE(work_seconds, 0) / 3600.0 INTO v_hours
  FROM public.profiles WHERE id = v_user;
  v_hours := COALESCE(v_hours, 0);
  SELECT COUNT(*) INTO v_level FROM unnest(v_tiers) AS t(h) WHERE v_hours >= h;

  SELECT COALESCE(SUM(total), 0) INTO v_questions
  FROM public.test_sessions WHERE user_id = v_user;

  RETURN QUERY
  INSERT INTO public.user_avatar_items (user_id, item_id)
  SELECT v_user, i.id
  FROM public.avatar_items i
  WHERE i.unlock_condition IS NOT NULL
    AND CASE i.unlock_condition->>'type'
          WHEN 'streak'    THEN v_streak    >= (i.unlock_condition->>'value')::INT
          WHEN 'level'     THEN v_level     >= (i.unlock_condition->>'value')::INT
          WHEN 'questions' THEN v_questions >= (i.unlock_condition->>'value')::INT
          ELSE false
        END
  ON CONFLICT (user_id, item_id) DO NOTHING
  RETURNING item_id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_avatar_unlocks() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_avatar_unlocks() TO authenticated;

-- ---------------------------------------------------------------- seed V1
-- ~35 items : ~57 % gratuits (base généreuse), ~29 % achetables (50→300),
-- ~14 % verrouillés. asset_key : hex/valeurs DiceBear (lib/avatar.ts) ou slugs
-- maison (EQUIPMENT_KEYS / BANNER_KEYS).
INSERT INTO public.avatar_items
  (id, category, name, asset_key, price, unlock_condition, rarity, sort) VALUES
  -- Corps — peau (6) : 5 gratuites + 1 achetable.
  ('peau-douce',     'body_skin', 'Douce',     'edb98a', NULL, NULL, 'common', 0),
  ('peau-claire',    'body_skin', 'Claire',    'ffdbb4', NULL, NULL, 'common', 1),
  ('peau-doree',     'body_skin', 'Dorée',     'd08b5b', NULL, NULL, 'common', 2),
  ('peau-ambree',    'body_skin', 'Ambrée',    'ae5d29', NULL, NULL, 'common', 3),
  ('peau-profonde',  'body_skin', 'Profonde',  '614335', NULL, NULL, 'common', 4),
  ('peau-solaire',   'body_skin', 'Solaire',   'f8d25c',  110, NULL, 'rare',   5),
  -- Corps — coiffure (6) : 4 gratuites, 1 achetable, 1 verrouillée.
  ('coif-classique', 'hair_style', 'Classique', 'shortFlat',    NULL, NULL, 'common', 0),
  ('coif-bouclee',   'hair_style', 'Bouclée',   'shortCurly',   NULL, NULL, 'common', 1),
  ('coif-carre',     'hair_style', 'Carré',     'bob',          NULL, NULL, 'common', 2),
  ('coif-chignon',   'hair_style', 'Chignon',   'bun',          NULL, NULL, 'common', 3),
  ('coif-locks',     'hair_style', 'Locks',     'dreads01',      200, NULL, 'rare',   4),
  ('coif-bonnet',    'hair_style', 'Bonnet cosy', 'winterHat02', NULL,
     '{"type":"streak","value":7}', 'rare', 5),
  -- Corps — couleur de cheveux (5) : 3 gratuites, 1 achetable, 1 verrouillée.
  ('chev-brun',      'hair_color', 'Brun nuit',   '2c1b18', NULL, NULL, 'common', 0),
  ('chev-chatain',   'hair_color', 'Châtain',     '4a312c', NULL, NULL, 'common', 1),
  ('chev-blond',     'hair_color', 'Blond doré',  'b58143', NULL, NULL, 'common', 2),
  ('chev-roux',      'hair_color', 'Roux flamboyant', 'c93305', 150, NULL, 'rare', 3),
  ('chev-platine',   'hair_color', 'Platine',     'e8e1e1', NULL,
     '{"type":"level","value":5}', 'rare', 4),
  -- Tenue (8) : 4 gratuites, 3 achetables, 1 verrouillée.
  ('tenue-tshirt-violet', 'outfit', 'T-shirt violet',    'shirtCrewNeck|7c4dff', NULL, NULL, 'common', 0),
  ('tenue-hoodie-bleu',   'outfit', 'Hoodie bleu',       'hoodie|5199e4',        NULL, NULL, 'common', 1),
  ('tenue-hoodie-corail', 'outfit', 'Hoodie corail',     'hoodie|ff5c5c',        NULL, NULL, 'common', 2),
  ('tenue-tshirt-menthe', 'outfit', 'T-shirt menthe',    'shirtVNeck|a7ffc4',    NULL, NULL, 'common', 3),
  ('tenue-salopette',     'outfit', 'Salopette océan',   'overall|25557c',         50, NULL, 'common', 4),
  ('tenue-tee-solaire',   'outfit', 'Tee graphique solaire', 'graphicShirt|ffdf6b', 120, NULL, 'common', 5),
  ('tenue-blazer',        'outfit', 'Blazer de nuit',    'blazerAndShirt|262e33',  250, NULL, 'rare',   6),
  ('tenue-hoodie-studuel','outfit', 'Hoodie Studuel',    'hoodie|7c4dff',        NULL,
     '{"type":"streak","value":14}', 'legendary', 7),
  -- Équipement (5) : 2 gratuits, 2 achetables, 1 verrouillé.
  ('equip-ballon',   'equipment', 'Ballon de basket',   'ballon-basket',  NULL, NULL, 'common', 0),
  ('equip-livre',    'equipment', 'Livre de poche',     'livre',          NULL, NULL, 'common', 1),
  ('equip-lunettes', 'equipment', 'Lunettes de soleil', 'lunettes-soleil',  80, NULL, 'common', 2),
  ('equip-casque',   'equipment', 'Casque audio',       'casque-audio',    220, NULL, 'rare',   3),
  ('equip-sac',      'equipment', 'Sac à dos',          'sac-a-dos',      NULL,
     '{"type":"questions","value":100}', 'rare', 4),
  -- Bannière (5) : 2 gratuites, 2 achetables, 1 verrouillée.
  ('ban-lavande',    'banner', 'Pastel lavande',    'uni-lavande',    NULL, NULL, 'common', 0),
  ('ban-biblio',     'banner', 'Bibliothèque',      'bibliotheque',   NULL, NULL, 'common', 1),
  ('ban-basket',     'banner', 'Terrain de basket', 'terrain-basket',  150, NULL, 'common', 2),
  ('ban-etoiles',    'banner', 'Ciel étoilé',       'ciel-etoile',     300, NULL, 'rare',   3),
  ('ban-neon',       'banner', 'Néon',              'neon',           NULL,
     '{"type":"level","value":8}', 'legendary', 4)
ON CONFLICT (id) DO UPDATE SET
  category         = EXCLUDED.category,
  name             = EXCLUDED.name,
  asset_key        = EXCLUDED.asset_key,
  price            = EXCLUDED.price,
  unlock_condition = EXCLUDED.unlock_condition,
  rarity           = EXCLUDED.rarity,
  sort             = EXCLUDED.sort;
