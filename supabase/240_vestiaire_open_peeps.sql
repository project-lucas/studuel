-- =============================================================================
-- Studuel — Migration 240 : le vestiaire passe à Open Peeps
--
-- POURQUOI. Le moteur de rendu des avatars était « avataaars » (DiceBear) :
-- 22 coiffures, aucune texture de cheveux, pas de voile, pas de turban, pas de
-- tresses. Un élève sur deux ne pouvait pas se reconnaître dans son propre
-- avatar. Le moteur devient « open-peeps » (Pablo Stanley, CC0) : 47 têtes,
-- 18 expressions entières, 8 paires de lunettes, 12 barbes.
--
-- CE QUE FAIT CETTE MIGRATION, ET RIEN D'AUTRE : elle réécrit les `asset_key`
-- (et les noms) du catalogue `avatar_items`, et en ajoute de nouveaux. Les
-- **ids ne changent pas** : un élève qui avait acheté `coif-locks` possède
-- toujours `coif-locks` (user_avatar_items est intacte), seul son rendu change.
-- Aucune table, aucune policy, aucune RPC n'est touchée.
--
-- CE QUI CHANGE POUR L'ÉLÈVE, ET QU'IL FAUT ASSUMER :
--   • sa coiffure et la couleur de son haut repartent du défaut (les valeurs
--     d'avataaars n'ont pas d'équivalent chez Open Peeps) ; sa PEAU traverse,
--     les palettes ayant été alignées hex pour hex côté application ;
--   • la catégorie `outfit` ne porte plus une coupe de vêtement mais une
--     COULEUR de haut : Open Peeps n'a qu'une silhouette. La variété a déménagé
--     dans les coiffures, qui passent de 6 à 30 articles ;
--   • la catégorie `hair_color` DISPARAÎT du vestiaire. Open Peeps peint les
--     cheveux à l'encre noire : dans son SVG, la chevelure et les contours du
--     visage sont un seul tracé `fill="#000"`, on ne peut pas teindre l'une
--     sans repeindre les autres. Ses sept articles deviennent des coiffures de
--     même prix (voir plus bas). Aucune ligne n'est supprimée, aucune contrainte
--     n'est modifiée : c'est l'application qui cesse de lire cette catégorie
--     (`AVATAR_ITEM_CATEGORIES`, lib/avatar-studio.ts).
--
-- RÈGLE TENUE ICI : le voile, le turban, les tresses, les locks courts, l'afro
-- et le crâne rasé sont GRATUITS. Ce ne sont pas des cosmétiques, ce sont des
-- têtes ; les faire payer reviendrait à faire payer le droit de se ressembler.
-- Ce qui se vend, ce sont les coupes de style (mohawk, pompadour, chignons
-- doubles) et les couvre-chefs.
--
-- PRÉREQUIS : 189 (avatar_items, user_avatar_items, RPC). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

INSERT INTO public.avatar_items
  (id, category, name, asset_key, price, unlock_condition, rarity, sort) VALUES
  -- ---------------------------------------------------------------- peau (8)
  ('peau-claire',    'body_skin', 'Claire',    'ffdbb4', NULL, NULL, 'common', 0),
  ('peau-douce',     'body_skin', 'Douce',     'edb98a', NULL, NULL, 'common', 1),
  ('peau-doree',     'body_skin', 'Dorée',     'd08b5b', NULL, NULL, 'common', 2),
  ('peau-noisette',  'body_skin', 'Noisette',  '8d5524', NULL, NULL, 'common', 3),
  ('peau-ambree',    'body_skin', 'Ambrée',    'ae5d29', NULL, NULL, 'common', 4),
  ('peau-cacao',     'body_skin', 'Cacao',     '694d3d', NULL, NULL, 'common', 5),
  ('peau-profonde',  'body_skin', 'Profonde',  '614335', NULL, NULL, 'common', 6),
  ('peau-solaire',   'body_skin', 'Solaire',   'f8d25c',  110, NULL, 'rare',   7),

  -- ------------------------------------------------------------ coiffure (30)
  -- Gratuites : toutes les têtes par lesquelles un élève se reconnaît.
  ('coif-classique', 'hair_style', 'Coupe courte',      'short1',        NULL, NULL, 'common', 0),
  ('coif-court-2',   'hair_style', 'Courte en arrière', 'short3',        NULL, NULL, 'common', 1),
  ('coif-degrade',   'hair_style', 'Dégradé',           'shaved1',       NULL, NULL, 'common', 2),
  ('coif-rase',      'hair_style', 'Crâne rasé',        'noHair1',       NULL, NULL, 'common', 3),
  ('coif-frange',    'hair_style', 'Frange',            'mediumBangs',   NULL, NULL, 'common', 4),
  ('coif-carre',     'hair_style', 'Carré',             'bangs',         NULL, NULL, 'common', 5),
  ('coif-long',      'hair_style', 'Cheveux longs',     'long',          NULL, NULL, 'common', 6),
  ('coif-bouclee',   'hair_style', 'Bouclée',           'longCurly',     NULL, NULL, 'common', 7),
  ('coif-afro',      'hair_style', 'Afro',              'afro',          NULL, NULL, 'common', 8),
  ('coif-tresses',   'hair_style', 'Tresses collées',   'cornrows',      NULL, NULL, 'common', 9),
  ('coif-twists',    'hair_style', 'Twists',            'twists',        NULL, NULL, 'common', 10),
  ('coif-chignon',   'hair_style', 'Chignon',           'bun',           NULL, NULL, 'common', 11),
  ('coif-voile',     'hair_style', 'Voile',             'hijab',         NULL, NULL, 'common', 12),
  ('coif-turban',    'hair_style', 'Turban',            'turban',        NULL, NULL, 'common', 13),
  -- Achetables : les coupes de style.
  ('coif-couettes',  'hair_style', 'Macarons',          'buns',            90, NULL, 'common', 14),
  ('coif-pompadour', 'hair_style', 'Banane',            'pomp',           150, NULL, 'common', 15),
  ('coif-locks',     'hair_style', 'Locks',             'dreads1',        200, NULL, 'rare',   16),
  ('coif-locks-longs','hair_style','Locks longs',       'dreads2',        260, NULL, 'rare',   17),
  ('coif-longafro',  'hair_style', 'Afro long',         'longAfro',       220, NULL, 'rare',   18),
  ('coif-mohawk',    'hair_style', 'Crête',             'mohawk',         240, NULL, 'rare',   19),
  -- Verrouillées : gagnées, pas achetées.
  ('coif-bonnet',    'hair_style', 'Bonnet cosy',       'hatBeanie',     NULL,
     '{"type":"streak","value":7}', 'rare', 20),
  ('coif-bantu',     'hair_style', 'Bantu knots',       'bantuKnots',    NULL,
     '{"type":"questions","value":100}', 'rare', 21),
  ('coif-casquette', 'hair_style', 'Casquette',         'hatHip',        NULL,
     '{"type":"level","value":5}', 'legendary', 22),

  -- ------------------------- les anciennes couleurs de cheveux, RECONVERTIES (7)
  -- Open Peeps dessine la chevelure à l'encre noire et ne sait pas la teindre
  -- (cf. l'en-tête de lib/avatar.ts). Vendre « Roux flamboyant » 150 pièces
  -- reviendrait à vendre une teinte invisible. Ces sept articles CHANGENT DONC
  -- DE CATÉGORIE pour devenir des coiffures, à prix et condition identiques :
  -- l'élève qui avait payé le roux garde un article de même valeur, et son id
  -- ne bouge pas — `user_avatar_items` n'est jamais touchée.
  ('chev-brun',      'hair_style', 'Mi-longue',        'medium1',       NULL, NULL, 'common', 23),
  ('chev-chatain',   'hair_style', 'Courte ondulée',   'short2',        NULL, NULL, 'common', 24),
  ('chev-noisette',  'hair_style', 'Rasé sur les côtés','shaved2',      NULL, NULL, 'common', 25),
  ('chev-blond',     'hair_style', 'Flat top',         'flatTop',       NULL, NULL, 'common', 26),
  ('chev-sable',     'hair_style', 'Frange rideau',    'mediumBangs2',    80, NULL, 'common', 27),
  ('chev-roux',      'hair_style', 'Long à frange',    'longBangs',      150, NULL, 'rare',   28),
  ('chev-platine',   'hair_style', 'Flat top long',    'flatTopLong',   NULL,
     '{"type":"level","value":5}', 'rare', 29),

  -- ------------------------------------------------- couleur du haut (11)
  -- L'`asset_key` est désormais un hex : Open Peeps n'a qu'une silhouette de
  -- vêtement, c'est sa couleur qui se collectionne.
  ('tenue-tshirt-violet', 'outfit', 'Haut violet',   '7c4dff', NULL, NULL, 'common', 0),
  ('tenue-hoodie-bleu',   'outfit', 'Haut bleu',     '5199e4', NULL, NULL, 'common', 1),
  ('tenue-hoodie-corail', 'outfit', 'Haut corail',   'e78276', NULL, NULL, 'common', 2),
  ('tenue-tshirt-menthe', 'outfit', 'Haut menthe',   'a7ffc4', NULL, NULL, 'common', 3),
  ('tenue-gris',          'outfit', 'Haut gris clair','e6e6e6', NULL, NULL, 'common', 4),
  ('tenue-salopette',     'outfit', 'Haut océan',    '25557c',   50, NULL, 'common', 5),
  ('tenue-abricot',       'outfit', 'Haut abricot',  'ffcf77',   90, NULL, 'common', 6),
  ('tenue-tee-solaire',   'outfit', 'Haut solaire',  'fdea6b',  120, NULL, 'common', 7),
  ('tenue-lagon',         'outfit', 'Haut lagon',    '9ddadb',  160, NULL, 'common', 8),
  ('tenue-blazer',        'outfit', 'Haut de nuit',  '262e33',  250, NULL, 'rare',   9),
  ('tenue-hoodie-studuel','outfit', 'Haut fuchsia',  'e279c7', NULL,
     '{"type":"streak","value":14}', 'legendary', 10),

  -- ---------------------------------------------------------- équipement (5)
  -- Couche maison (SVG de components/avatar/vestiaire-assets.tsx) : inchangée.
  ('equip-ballon',   'equipment', 'Ballon de basket',   'ballon-basket',  NULL, NULL, 'common', 0),
  ('equip-livre',    'equipment', 'Livre de poche',     'livre',          NULL, NULL, 'common', 1),
  ('equip-lunettes', 'equipment', 'Lunettes de soleil', 'lunettes-soleil',  80, NULL, 'common', 2),
  ('equip-casque',   'equipment', 'Casque audio',       'casque-audio',    220, NULL, 'rare',   3),
  ('equip-sac',      'equipment', 'Sac à dos',          'sac-a-dos',      NULL,
     '{"type":"questions","value":100}', 'rare', 4),

  -- ------------------------------------------------------------ bannière (5)
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

-- Note : aucune ligne n'est supprimée. Un item retiré du catalogue applicatif
-- serait de toute façon ignoré côté app (`normalizeCatalog` écarte tout
-- asset_key que le moteur ne sait pas rendre) — mais le supprimer ici
-- effacerait par cascade les achats des élèves. On ne rembourse pas en
-- effaçant.
