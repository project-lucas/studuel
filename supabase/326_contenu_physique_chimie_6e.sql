-- =============================================================================
-- Studuel — Migration 326 : PHYSIQUE-CHIMIE 6e — LE PROGRAMME COMPLET (10 fiches)
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.
--    Source : scripts/contenu/*.mjs
--    Regénérer : node scripts/seed-contenu.mjs --num 326 --modules physique-chimie-6e
--
-- CONSTAT : la physique-chimie de 6e n'avait que DEUX fiches, héritées du premier
-- jeu de données de l'app (« États et changements d'état », « Sources et formes
-- d'énergie »). C'était la matière la plus pauvre de l'application, dans la classe
-- qui accueille les nouveaux collégiens. Un élève qui révisait les mélanges, la
-- trajectoire, la vitesse, les conversions d'énergie ou la transmission d'un signal
-- ne trouvait RIEN. Cette migration installe les 10 fiches du programme, rangées
-- sous les 4 chapitres de la maquette, et retire les 2 fiches génériques.
-- LE CONTENU EST ÉCRIT, PAS IMPORTÉ du cycle 4 : la 6e appartient au CYCLE 3, dont
-- le programme de sciences n'a ni le même découpage ni le même niveau d'exigence.
--
-- Cette migration apporte : 10 chapitres, 10 leçons,
-- 10 quiz et 80 questions, sur 1 matière.
--
-- CHOIX ASSUMÉS :
--  · tous les quiz sont `is_free = true`. Aucun compte ne peut aujourd’hui
--    passer `tier1` (aucun paiement n’existe), donc un quiz payant serait un
--    quiz INVISIBLE pour 100 % des élèves — le contraire du but ;
--  · chaque cours porte des sections `##`, ce qui rend sa carte mentale
--    dérivable (cf. lib/mind-map-auto) : aucune tuile ne promet dans le vide.
--
-- Idempotent : les UUID sont dérivés du contenu (SHA-1), donc stables ; les
-- INSERT sont tous gardés par ON CONFLICT DO NOTHING. Rejouable sans risque.
--
-- PRÉREQUIS : 002, 008, 191, 193 exécutées (les matières doivent exister).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 0. Ménage ----------------------------------------------------------------
-- [physique-chimie] La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
-- [physique-chimie] module range ses 10 fiches sous 4 chapitres, et l'INSERT écrit la colonne. Elle
-- [physique-chimie] est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
-- [physique-chimie] la 234 soit passée en production — sans cette reprise, la migration échouerait
-- [physique-chimie] sur "column chapters.theme does not exist", les 2 anciens chapitres déjà
-- [physique-chimie] supprimés et les 10 neufs pas encore posés : une matière vide.
-- [physique-chimie] Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
-- [physique-chimie] Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
-- [physique-chimie] chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- [physique-chimie] Les 2 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.
-- [physique-chimie] 
-- [physique-chimie] LE REPÈRE EST theme IS NULL, PAS LE TITRE. Le critère « pas de chapitre de
-- [physique-chimie] programme » vise exactement les deux lignes voulues : elles datent de la 008,
-- [physique-chimie] bien avant la colonne theme, tandis que les 10 fiches neuves en portent une dès
-- [physique-chimie] l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
-- [physique-chimie] sur elles, ni au premier passage ni au rejeu.
-- [physique-chimie] Le filtre level = '6e' est indispensable : la physique-chimie existe sur sept
-- [physique-chimie] niveaux, et la 5e comme la 4e et la 3e ont leurs propres migrations.
-- [physique-chimie] L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
-- [physique-chimie] étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis les
-- [physique-chimie] chapitres, dont les leçons partent en cascade.
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '6e'
   AND c.theme IS NULL;

-- 1. Chapitres -------------------------------------------------------------
-- Jointure sur le SLUG (et non le nom) : c’est la clé stable de `subjects`.
INSERT INTO public.chapters (id, subject_id, level, title, position, theme)
SELECT v.id, s.id, v.level, v.title, v.position, v.theme
  FROM (VALUES
    ('0b0d579c-326a-57ff-a214-05f4f1be73dd'::uuid, 'physique-chimie', '6e', 'La matière', 1, 'Décrire les états et la constitution de la matière à l’échelle macroscopique'),
    ('5a33fa8b-f075-5ef8-9867-08b15f235f26'::uuid, 'physique-chimie', '6e', 'Les propriétés de la matière', 2, 'Décrire les états et la constitution de la matière à l’échelle macroscopique'),
    ('15fea229-b517-5dd4-b5f9-8f88c667ec32'::uuid, 'physique-chimie', '6e', 'Les mélanges', 3, 'Décrire les états et la constitution de la matière à l’échelle macroscopique'),
    ('01deaec9-dee1-5717-be7c-2f4efeb815ed'::uuid, 'physique-chimie', '6e', 'La trajectoire et la vitesse moyenne', 4, 'Observer et décrire les différents types de mouvements'),
    ('ce083d23-a734-5ce4-9ca6-ab41f187a0ad'::uuid, 'physique-chimie', '6e', 'Les variations de vitesse', 5, 'Observer et décrire les différents types de mouvements'),
    ('2b1bbb82-48de-501e-a86f-cf631a7d4adb'::uuid, 'physique-chimie', '6e', 'Les différentes formes d’énergie', 6, 'Identifier différentes sources d’énergie et connaître quelques conversions'),
    ('98cc7d1d-fd6a-5e8d-b7b6-ce6fca9d58cb'::uuid, 'physique-chimie', '6e', 'Les conversions d’énergie', 7, 'Identifier différentes sources d’énergie et connaître quelques conversions'),
    ('9ea53d6d-ae8f-5d85-9f06-fd87faae0cad'::uuid, 'physique-chimie', '6e', 'L’énergie, une production diverse et une consommation à réduire', 8, 'Identifier différentes sources d’énergie et connaître quelques conversions'),
    ('75790460-e7f4-5cfc-a29a-91ef157d89b1'::uuid, 'physique-chimie', '6e', 'Les signaux', 9, 'Identifier un signal et une information'),
    ('0ab6cde9-a094-513d-82a0-3abb3beebed8'::uuid, 'physique-chimie', '6e', 'Transmettre l’information', 10, 'Identifier un signal et une information')
  ) AS v(id, slug, level, title, position, theme)
  JOIN public.subjects s ON s.slug = v.slug
-- ON CONFLICT NU : `chapters` porte aussi UNIQUE(subject_id, level, title).
ON CONFLICT DO NOTHING;

-- 1 bis. Axes du programme -------------------------------------------------
-- `chapters.theme` (migration 234) : l’intitulé du programme officiel qui
-- coiffe le chapitre. La page matière s’en sert pour grouper au lieu
-- d’aligner 28 lignes à plat. UPDATE et non INSERT : le chapitre peut déjà
-- exister (l’INSERT précédent l’aurait alors ignoré).
UPDATE public.chapters c SET theme = v.theme
  FROM (VALUES
    ('0b0d579c-326a-57ff-a214-05f4f1be73dd'::uuid, 'Décrire les états et la constitution de la matière à l’échelle macroscopique'),
    ('5a33fa8b-f075-5ef8-9867-08b15f235f26'::uuid, 'Décrire les états et la constitution de la matière à l’échelle macroscopique'),
    ('15fea229-b517-5dd4-b5f9-8f88c667ec32'::uuid, 'Décrire les états et la constitution de la matière à l’échelle macroscopique'),
    ('01deaec9-dee1-5717-be7c-2f4efeb815ed'::uuid, 'Observer et décrire les différents types de mouvements'),
    ('ce083d23-a734-5ce4-9ca6-ab41f187a0ad'::uuid, 'Observer et décrire les différents types de mouvements'),
    ('2b1bbb82-48de-501e-a86f-cf631a7d4adb'::uuid, 'Identifier différentes sources d’énergie et connaître quelques conversions'),
    ('98cc7d1d-fd6a-5e8d-b7b6-ce6fca9d58cb'::uuid, 'Identifier différentes sources d’énergie et connaître quelques conversions'),
    ('9ea53d6d-ae8f-5d85-9f06-fd87faae0cad'::uuid, 'Identifier différentes sources d’énergie et connaître quelques conversions'),
    ('75790460-e7f4-5cfc-a29a-91ef157d89b1'::uuid, 'Identifier un signal et une information'),
    ('0ab6cde9-a094-513d-82a0-3abb3beebed8'::uuid, 'Identifier un signal et une information')
  ) AS v(id, theme)
 WHERE c.id = v.id AND c.theme IS DISTINCT FROM v.theme;

-- 2. Leçons ----------------------------------------------------------------
INSERT INTO public.lessons (id, chapter_id, title, content, position) VALUES
  ('c1122d97-2a0e-565a-8038-584c33b2dbdb', '0b0d579c-326a-57ff-a214-05f4f1be73dd', 'Trois états, une seule matière', E'Tout ce qui nous entoure est fait de matière : elle occupe de la place et possède une masse. Elle se présente sous trois états.\n\n## Les trois états\n| L’état | Sa forme | Son volume | Exemple |\n| **Solide** | **Propre** | **Propre** | Un glaçon garde sa forme dans n’importe quel récipient |\n| **Liquide** | **Aucune** | **Propre** | L’eau prend la forme du verre ; sa surface libre reste **horizontale** |\n| **Gaz** | **Aucune** | **Aucun** | Il occupe **tout** l’espace disponible |\n\n## Les changements d’état\n| Le passage | Son nom |\n| Solide → liquide | **Fusion** |\n| Liquide → solide | **Solidification** |\n| Liquide → gaz | **Vaporisation** |\n| Gaz → liquide | **Liquéfaction** |\n| Solide → gaz **directement** | **Sublimation** |\n\n~ Solidification ← Solide → Fusion → Liquide → Vaporisation → Gaz\n\n## La température ne bouge pas pendant le changement\n= L’eau pure fond à 0 °C · L’eau pure bout à 100 °C\n\n!> Pendant qu’un glaçon fond, la température reste **bloquée à 0 °C** tant qu’il reste de la glace. Chauffer plus fort ne la fait pas monter : l’énergie sert à faire fondre.\n\n> Un changement d’état ne change **pas la matière** : la glace, l’eau liquide et la vapeur sont toutes de l’eau.\n\n## La masse se conserve, le volume non\n| La grandeur | Ce qu’elle devient |\n| La **masse** | 100 g de glace donnent **100 g** d’eau |\n| Le **volume** | Il **change** : la glace occupe **plus** de place |\n\n!> C’est pourquoi une bouteille pleine peut **éclater** au congélateur.\n\n## Solide compact, solide divisé\n| Le solide | Son comportement |\n| **Compact** | Un caillou : un seul bloc |\n| **Divisé** | Le sable, la farine : ils s’écoulent comme un liquide, mais **chaque grain garde sa forme** |', 1),
  ('5ec5a671-b2ae-5ae0-98a5-a658c2c23ed5', '5a33fa8b-f075-5ef8-9867-08b15f235f26', 'Mesurer pour reconnaître', E'Pour décrire un échantillon de matière, on mesure des grandeurs. Chacune a son instrument et son unité.\n\n## Les trois grandeurs\n| La grandeur | Son instrument | Son unité |\n| La **masse** | La **balance** | Le **kilogramme (kg)** |\n| Le **volume** | L’**éprouvette graduée** | Le **litre (L)** |\n| La **température** | Le **thermomètre** | Le **degré Celsius (°C)** |\n\n## La masse\n= 1 kg = 1 000 g · 1 g = 1 000 mg\n\n!> La masse ne dépend **pas du lieu** : un objet de 2 kg a la même masse sur la Lune.\n\n## Le volume\n= 1 L = 1 000 mL · 1 mL = 1 cm³\n\n~ Poser l’éprouvette à plat → se placer à hauteur de la graduation → lire au BAS du ménisque\n\n## Reconnaître un corps pur\nChaque matière a des **températures de changement d’état** qui lui sont propres : l’eau pure fond à 0 °C, l’alcool bien plus bas.\n\n> Mesurer ces températures permet donc d’**identifier** une substance. C’est une carte d’identité.\n\n## L’air a une masse\n~ Peser un ballon dégonflé → le gonfler → le repeser → il est PLUS LOURD\n\n= Un litre d’air pèse environ 1,2 g\n\n> Invisible ne veut pas dire immatériel.\n\n## Trois mots à ne pas confondre\n| Le mot | Ce qu’il désigne | Son unité |\n| La **masse** | La quantité de matière | Le kg |\n| Le **volume** | La place occupée | Le L |\n| Le **poids** | L’attraction de la Terre | Ce n’est **pas** la masse |', 1),
  ('1cdb43cf-284f-5bca-9ed9-c8e05b2ae9d4', '15fea229-b517-5dd4-b5f9-8f88c667ec32', 'Ce qui se mélange, ce qui se sépare', E'Un corps pur ne contient qu’une seule substance. Un mélange en contient plusieurs — et il y a deux façons de mélanger.\n\n## Deux familles de mélanges\n| Le mélange | Ce qu’on voit | Exemples |\n| **Homogène** | On ne distingue **pas** les constituants, même à la loupe | Eau + sel, eau + sirop, l’air |\n| **Hétérogène** | On distingue au moins deux constituants | Eau + huile, eau + sable, jus d’orange avec pulpe |\n\n## La dissolution\n~ Le soluté (le sel) + le solvant (l’eau) → la solution\n\n!> Le sel qui « disparaît » ne s’évapore pas : il se **dissout**. La masse le prouve.\n\n= 100 g d’eau + 5 g de sel = 105 g de solution\n\n## La saturation\nAu-delà d’une certaine quantité, le solvant ne peut plus rien dissoudre : la solution est **saturée**, et le surplus reste au fond.\n\n## Séparer les constituants\n| La technique | Ce qu’elle fait | Ce qu’on obtient |\n| La **décantation** | On laisse reposer, le plus lourd tombe, on transvase doucement | Deux couches séparées |\n| La **filtration** | Un filtre retient les particules solides | Le liquide qui passe est le **filtrat** |\n| L’**évaporation** | On chauffe pour faire partir le solvant | On récupère le **soluté** — c’est le sel des marais salants |\n\n!> **La filtration ne sépare PAS un mélange homogène.** De l’eau salée filtrée reste salée : le sel est dissous, pas en morceaux.\n\n## L’air est un mélange\n= 78 % de diazote · 21 % de dioxygène · 1 % d’autres gaz\n\nC’est un mélange **homogène** de gaz.', 1),
  ('9ddfa02a-0ad1-5739-9115-57de74b1b943', '01deaec9-dee1-5717-be7c-2f4efeb815ed', 'Décrire un mouvement, c’est d’abord choisir d’où on regarde', E'Dire « la voiture bouge » sans dire par rapport à quoi, c’est une phrase incomplète.\n\n## Le mouvement dépend du point de vue\nUn passager assis dans un train est **immobile par rapport au train**, et **en mouvement par rapport au quai**.\n\n= Le référentiel : l’objet par rapport auquel on décrit le mouvement\n\n!> Il faut **toujours** le préciser. Sans référentiel, la question « est-ce que ça bouge ? » n’a pas de réponse.\n\n## La trajectoire\nLa **trajectoire** est la ligne décrite par un point de l’objet au cours du temps.\n\n| La trajectoire | Sa forme | Exemple |\n| **Rectiligne** | Une ligne droite | Une bille sur une table lisse |\n| **Circulaire** | Un cercle | Une nacelle de grande roue, la valve d’une roue de vélo |\n| **Curviligne** | Une courbe quelconque | Un ballon lancé |\n\n## La vitesse moyenne\n= v = d ÷ t\n\n= 30 km en 2 h → v = 30 ÷ 2 = 15 km/h\n\n## Les unités, et le piège\n!> La distance et la durée doivent être dans les **mêmes unités** que la vitesse demandée : pour des **m/s**, il faut des **mètres** et des **secondes**.\n\n= Pour passer de km/h à m/s : diviser par 3,6 · 36 km/h = 10 m/s\n\n## Les deux autres formules\n| On cherche | La formule |\n| La **distance** | d = v × t |\n| La **durée** | t = d ÷ v |\n\n## Moyenne ne veut pas dire constante\n!> Une vitesse moyenne de 15 km/h ne dit **pas** que le cycliste roulait à 15 km/h à chaque instant : il a pu s’arrêter, puis accélérer.', 1),
  ('07bbd76c-8a2e-585e-ba20-f8f7e13a005d', 'ce083d23-a734-5ce4-9ca6-ab41f187a0ad', 'Uniforme, accéléré, ralenti', E'Décrire un mouvement demande deux choses : la forme du chemin, et l’évolution de la vitesse.\n\n## Les trois cas\n| Le mouvement | Sa vitesse | Exemple |\n| **Uniforme** | Elle ne **change pas** | Un escalator, un tapis roulant |\n| **Accéléré** | Elle **augmente** | Une bille qui dévale une pente, une voiture qui démarre |\n| **Ralenti** (décéléré) | Elle **diminue** | Un vélo qui freine, une balle lancée vers le haut |\n\n## Deux mots pour deux choses\n!> **Trajectoire** et **vitesse** sont indépendantes. Un mouvement peut être **circulaire uniforme** (une nacelle de grande roue) ou **rectiligne accéléré** (une voiture qui démarre tout droit).\n\nLe **rectiligne uniforme** est le cas le plus simple : chemin droit **et** vitesse constante.\n\n## Lire une chronophotographie\nUne **chronophotographie** prend des photos à intervalles de temps **réguliers**.\n\n| Les écarts entre positions | Le mouvement est… |\n| **Égaux** | **Uniforme** |\n| Ils **s’agrandissent** | **Accéléré** |\n| Ils **se resserrent** | **Ralenti** |\n\n~ Photos à intervalles réguliers → mesurer les écarts → lire le mouvement\n\n> C’est l’**espacement** qui parle, parce que la durée entre deux images est toujours la même.\n\n## Pourquoi ça compte\nLa **distance de freinage** d’un véhicule augmente très vite avec la vitesse.\n\n!> Un mouvement ralenti **ne s’arrête pas instantanément**. C’est exactement la raison pour laquelle on ne traverse pas devant une voiture qui freine.', 1),
  ('e16a07f7-55de-51e9-b876-2879b483e929', '2b1bbb82-48de-501e-a86f-cf631a7d4adb', 'L’énergie, ce qui permet d’agir', E'Posséder de l’énergie, c’est pouvoir mettre en mouvement, chauffer, éclairer ou déformer.\n\n## Les principales formes\n| La forme | À quoi elle est liée |\n| **Cinétique** | Le **mouvement** — elle augmente avec la masse, et **beaucoup** avec la vitesse |\n| **De position** | La **hauteur** : l’eau d’un barrage |\n| **Thermique** | La **température** |\n| **Électrique** | Ce qui circule dans les fils |\n| **Lumineuse** | Transportée par la lumière |\n| **Chimique** | Stockée dans les aliments, le bois, l’essence, une pile |\n| **Nucléaire** | Le noyau des atomes |\n\n## Les sources d’énergie\n| La famille | Sa définition | Ses membres |\n| **Renouvelables** | Elles se reconstituent à l’échelle humaine | Soleil, vent, eau, biomasse, géothermie |\n| **Non renouvelables** | Leurs réserves s’épuisent | Charbon, pétrole, gaz naturel (les **fossiles**), uranium |\n\n## L’unité\n= L’énergie se mesure en joules (J)\n\nPour l’électricité domestique, on utilise le **kilowattheure (kWh)** — celui qui figure sur les factures.\n\n> Le **Soleil** est la source d’origine de presque toutes les autres : le vent, la pluie, les plantes et même le pétrole en descendent.\n\n## Une chaîne d’énergie\n~ Source → convertisseur → utilisation\n\n~ Pile (chimique) → ampoule → lumière et chaleur', 1),
  ('2a8645f4-58f4-54b5-b2af-7b0e329d0685', '98cc7d1d-fd6a-5e8d-b7b6-ce6fca9d58cb', 'L’énergie ne se perd pas, elle change de forme', E'L’énergie ne se crée pas et ne disparaît pas. Elle change de forme — et une partie s’échappe toujours en chaleur.\n\n## Le principe\n= La conservation de l’énergie : elle se convertit, ou se transfère, mais ne se perd jamais\n\n## Les convertisseurs\n| Le convertisseur | De quoi | Vers quoi |\n| Une **pile** | Chimique | Électrique |\n| Une **lampe** | Électrique | Lumineuse (et thermique) |\n| Un **moteur électrique** | Électrique | Cinétique |\n| Un **panneau solaire** | Lumineuse | Électrique |\n| Une **éolienne** | Cinétique (du vent) | Électrique |\n| Un **barrage** | De position | Cinétique, puis électrique |\n\n## Les pertes\n!> **Aucune conversion n’est parfaite** : une partie de l’énergie part toujours en **chaleur**, souvent inutile.\n\n~ Ampoule à filament : 5 % en lumière → 95 % en chaleur → remplacée par la LED\n\nC’est pourquoi une ampoule à filament brûlait les doigts.\n\n> L’énergie « perdue » n’est pas détruite : elle est **dispersée** sous une forme qu’on ne peut plus utiliser.\n\n## Le rendement\nLe **rendement** compare l’énergie **utile** à l’énergie **consommée**. Plus il est élevé, moins on gaspille.\n\n## Économiser l’énergie\n~ Isoler un logement → éteindre les veilles → préférer les transports en commun → choisir des appareils à bon rendement\n\nChaque geste réduit la quantité d’énergie à produire.', 1),
  ('a76e654a-8dfd-5ad6-a9ea-61aa78f3ea2a', '9ea53d6d-ae8f-5d85-9f06-fd87faae0cad', 'Produire de l’électricité, et en consommer moins', E'La plupart des centrales fonctionnent sur le même principe. Ce qui change, c’est ce qui fait tourner la turbine.\n\n## Le principe commun\n~ Quelque chose fait tourner une TURBINE → la turbine entraîne un ALTERNATEUR → l’alternateur produit l’électricité\n\n## Ce qui fait tourner la turbine\n| La centrale | Ce qui entraîne la turbine |\n| **Thermique à flamme** | De la vapeur, produite en brûlant charbon, gaz ou fioul |\n| **Nucléaire** | De la vapeur, chauffée par la **fission** de l’uranium |\n| **Hydraulique** | L’eau d’un **barrage** |\n| **Éolienne** | Le **vent** |\n\n!> Le **photovoltaïque** est l’**exception** : le panneau produit l’électricité **directement**, sans turbine ni alternateur.\n\n## Les impacts\n| La source | Son inconvénient principal |\n| **Thermique à flamme** | Elle rejette du **dioxyde de carbone**, principal gaz à effet de serre |\n| **Nucléaire** | Presque pas de CO₂, mais des **déchets radioactifs** à stocker très longtemps |\n| **Renouvelables** | Peu d’impact en fonctionnement, mais elles dépendent de la **météo** et occupent de l’espace |\n\n## Le mix énergétique\n> Aucune source ne convient à tout : on **combine** plusieurs moyens de production. C’est le **mix énergétique** d’un pays.\n\n## Réduire sa consommation\n1. **Isoler** les bâtiments — c’est le premier poste de consommation ;\n2. éteindre les **veilles** des appareils ;\n3. lire l’**étiquette énergie** avant d’acheter ;\n4. privilégier le train, le vélo et la marche.\n\n> La meilleure énergie est celle qu’on ne consomme pas.', 1),
  ('f43f4663-69ee-53a7-b0a7-8129e59aa0b0', '75790460-e7f4-5cfc-a29a-91ef157d89b1', 'Lumière et son : deux façons de transporter un message', E'La lumière traverse le vide, le son non. Toute la différence entre voir et entendre tient là.\n\n## Le signal lumineux\nLa lumière se propage en **ligne droite** dans un milieu transparent et homogène.\n\n| La source | Ce qu’elle fait | Exemples |\n| **Primaire** | Elle **produit** sa propre lumière | Le Soleil, une lampe, une flamme |\n| **Diffusante** | Elle **renvoie** la lumière reçue | La Lune, un mur, ce cahier |\n\n!> On voit un objet quand la lumière qu’il émet ou diffuse **entre dans notre œil**. La Lune n’éclaire pas : elle renvoie.\n\n= Vitesse de la lumière : environ 300 000 km/s\n\n## L’ombre\n| L’ombre | Où elle est |\n| L’**ombre propre** | La face non éclairée de l’objet |\n| L’**ombre portée** | Sur le sol ou l’écran |\n\nC’est la **propagation rectiligne** qui l’explique.\n\n## Le signal sonore\nLe son est produit par un objet qui **vibre**. Il se propage dans l’air, mais aussi dans l’eau et les solides.\n\n!> **Le son ne se propage PAS dans le vide** : il lui faut un milieu matériel. La lumière, elle, traverse le vide — c’est pourquoi on voit le Soleil sans entendre les explosions qui s’y produisent.\n\n= Vitesse du son dans l’air : environ 340 m/s\n\nSoit près d’un million de fois moins que la lumière.\n\n> C’est pourquoi on **voit l’éclair avant d’entendre le tonnerre**.\n\n## Le danger du bruit\n!> Un son trop fort ou trop long **détruit** les cellules de l’oreille interne, et **elles ne se régénèrent pas**. La perte est **définitive**.', 1),
  ('5f53352e-040d-5073-8ede-797c4aaf80f8', '0ab6cde9-a094-513d-82a0-3abb3beebed8', 'De la fumée au fil de verre', E'Émetteur, canal, récepteur : toute transmission suit le même schéma, du signal de fumée à la fibre optique.\n\n## La chaîne de transmission\n~ Émetteur (il code) → canal (il transporte) → récepteur (il décode)\n\n## Une longue histoire\n~ Signaux de fumée → tambours → pigeons voyageurs → sémaphores → télégraphe → téléphone → radio → satellites → fibre optique\n\nChaque progrès a augmenté la **vitesse**, la **distance** et la **quantité** d’information transmise.\n\n## Les supports d’aujourd’hui\n| Le support | Sous quelle forme voyage l’information |\n| Le **câble électrique** | Un **courant** |\n| Les **ondes** — radio, wifi, téléphonie | Elles se propagent dans l’air et le vide, **sans fil** |\n| La **fibre optique** | De la **lumière**, dans un fil de verre très fin |\n\n> La fibre est le support le plus rapide, et celui qui transporte le plus de données.\n\n## Le signal numérique\n= Le binaire : deux états seulement, 0 et 1\n\n~ Un texte, une image, un son → convertis en 0 et 1 → transmis → reconvertis à l’arrivée\n\n| L’unité | Ses multiples |\n| L’**octet** (o) | **ko**, **Mo**, **Go** |\n\n> Une photo, une chanson et un message ne diffèrent, pour le réseau, que par le **nombre** de 0 et de 1.\n\n## Le stockage\nDisque dur, clé USB, carte mémoire, ou serveur distant — le « cloud ».\n\n!> Le « cloud » n’est pas un nuage : c’est l’**ordinateur de quelqu’un d’autre**.\n\n## Un usage responsable\n!> Une information transmise peut être **copiée**, **conservée** et **rediffusée** sans qu’on le sache. Ce qu’on publie **échappe vite à son auteur**.', 1)
ON CONFLICT DO NOTHING;

-- 3. Quiz ------------------------------------------------------------------
-- Double garde : ON CONFLICT (id) protège du rejeu, et le NOT EXISTS protège
-- la leçon d’un SECOND quiz venu d’ailleurs — le hub de leçon lit son quiz en
-- .maybeSingle(), deux quiz feraient lever « multiple rows » à de vrais élèves.
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.id, v.title, v.subject, v.grade_level, v.chapter, true, l.id
  FROM (VALUES
    ('de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Quiz — Trois états, une seule matière', 'Physique-Chimie', '6e', 'La matière', 'c1122d97-2a0e-565a-8038-584c33b2dbdb'::uuid),
    ('a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'Quiz — Mesurer pour reconnaître', 'Physique-Chimie', '6e', 'Les propriétés de la matière', '5ec5a671-b2ae-5ae0-98a5-a658c2c23ed5'::uuid),
    ('4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'Quiz — Ce qui se mélange, ce qui se sépare', 'Physique-Chimie', '6e', 'Les mélanges', '1cdb43cf-284f-5bca-9ed9-c8e05b2ae9d4'::uuid),
    ('13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Quiz — Décrire un mouvement, c’est d’abord choisir d’où on regarde', 'Physique-Chimie', '6e', 'La trajectoire et la vitesse moyenne', '9ddfa02a-0ad1-5739-9115-57de74b1b943'::uuid),
    ('ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Quiz — Uniforme, accéléré, ralenti', 'Physique-Chimie', '6e', 'Les variations de vitesse', '07bbd76c-8a2e-585e-ba20-f8f7e13a005d'::uuid),
    ('84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Quiz — L’énergie, ce qui permet d’agir', 'Physique-Chimie', '6e', 'Les différentes formes d’énergie', 'e16a07f7-55de-51e9-b876-2879b483e929'::uuid),
    ('a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Quiz — L’énergie ne se perd pas, elle change de forme', 'Physique-Chimie', '6e', 'Les conversions d’énergie', '2a8645f4-58f4-54b5-b2af-7b0e329d0685'::uuid),
    ('801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Quiz — Produire de l’électricité, et en consommer moins', 'Physique-Chimie', '6e', 'L’énergie, une production diverse et une consommation à réduire', 'a76e654a-8dfd-5ad6-a9ea-61aa78f3ea2a'::uuid),
    ('00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Quiz — Lumière et son : deux façons de transporter un message', 'Physique-Chimie', '6e', 'Les signaux', 'f43f4663-69ee-53a7-b0a7-8129e59aa0b0'::uuid),
    ('16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Quiz — De la fumée au fil de verre', 'Physique-Chimie', '6e', 'Transmettre l’information', '5f53352e-040d-5073-8ede-797c4aaf80f8'::uuid)
  ) AS v(id, title, subject, grade_level, chapter, lesson_id)
  JOIN public.lessons l ON l.id = v.lesson_id
 WHERE NOT EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- 4. Questions -------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT v.id, v.quiz_id, v.question, v.kind, v.options, v.correct_index, v.explanation, v.position
  FROM (VALUES
    ('42cc09f5-c44c-598e-af88-afd0e9434edb'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Quel état a un volume propre mais pas de forme propre ?', 'mcq', '["Le liquide","Le solide","Le gaz","Aucun"]'::jsonb, 0, 'Un liquide prend la forme de son récipient.', 1),
    ('50f0f662-6b1e-58d0-b11d-f86181801b62'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Comment s’appelle le passage de l’état solide à l’état liquide ?', 'mcq', '["La fusion","La solidification","La vaporisation","La liquéfaction"]'::jsonb, 0, 'Le sens inverse est la solidification.', 2),
    ('e79e4ea5-6a02-5ebe-b1c1-38863996f0de'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Comment s’appelle le passage de l’état gazeux à l’état liquide ?', 'mcq', '["La liquéfaction","La vaporisation","La sublimation","La fusion"]'::jsonb, 0, 'C’est ce qui se passe sur une vitre froide.', 3),
    ('6d4ad298-bad1-5662-a035-45cfc1d10fed'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'À quelle température l’eau pure bout-elle sous la pression normale ?', 'mcq', '["100 °C","0 °C","50 °C","212 °C"]'::jsonb, 0, 'Et elle fond à 0 °C.', 4),
    ('bb05f5a0-24fc-5fed-ace6-cc3918a7a006'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Que devient la température pendant qu’un glaçon fond ?', 'mcq', '["Elle reste bloquée à 0 °C","Elle monte régulièrement","Elle descend","Elle monte puis descend"]'::jsonb, 0, 'Elle ne repart qu’une fois toute la glace fondue.', 5),
    ('aaf4ee5d-145b-506a-925b-6eb1375799f7'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Si 100 g de glace fondent, quelle masse d’eau obtient-on ?', 'mcq', '["100 g","Moins de 100 g","Plus de 100 g","On ne peut pas savoir"]'::jsonb, 0, 'La masse se conserve lors d’un changement d’état.', 6),
    ('06e1c846-4b68-5bd1-81bc-83b992853277'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Pourquoi une bouteille pleine d’eau peut-elle éclater au congélateur ?', 'mcq', '["La glace occupe un volume plus grand que l’eau liquide","La masse de l’eau augmente","Le froid fragilise le plastique seul","L’eau se transforme en gaz"]'::jsonb, 0, 'La masse ne change pas, mais le volume augmente.', 7),
    ('0b337b13-a8e0-53e3-8d81-24ec79b0cc71'::uuid, 'de77aa41-900f-5de8-aeee-96503cd57290'::uuid, 'Le sable est un solide divisé.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Chaque grain garde sa forme, mais l’ensemble s’écoule.', 8),
    ('813cc612-45d5-54f4-823d-748ca1d9e69e'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'Avec quel instrument mesure-t-on une masse ?', 'mcq', '["Une balance","Une éprouvette graduée","Un thermomètre","Un chronomètre"]'::jsonb, 0, 'Le résultat s’exprime en kg ou en g.', 1),
    ('aa040352-be3f-59c7-8894-0b6190d9b3a9'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'À combien de millilitres correspond 1 litre ?', 'mcq', '["1 000 mL","100 mL","10 mL","10 000 mL"]'::jsonb, 0, 'Et 1 mL vaut 1 cm³.', 2),
    ('f6d259ef-b116-5c77-b41a-b3b36680d38f'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'À quoi correspond 1 mL ?', 'mcq', '["1 cm³","1 dm³","1 m³","1 g"]'::jsonb, 0, 'C’est l’équivalence à retenir entre volume et capacité.', 3),
    ('52f6afe6-749c-5551-a42e-d1c1e62bb727'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'Où lit-on le niveau dans une éprouvette graduée ?', 'mcq', '["Au bas du ménisque, l’œil à la hauteur de la graduation","Au sommet du ménisque","Au milieu du liquide","Peu importe"]'::jsonb, 0, 'Une lecture de biais fausse la mesure.', 4),
    ('ed628047-069a-5ba3-b4ab-512a13447719'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'Quelle est l’unité de la température ?', 'mcq', '["Le degré Celsius","Le gramme","Le litre","Le newton"]'::jsonb, 0, 'Elle se mesure au thermomètre.', 5),
    ('784249e1-a638-5f3d-bb88-d0671eb21994'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'Combien pèse environ un litre d’air ?', 'mcq', '["1,2 g","1,2 kg","12 g","0 g, l’air n’a pas de masse"]'::jsonb, 0, 'On le montre en pesant un ballon gonflé puis dégonflé.', 6),
    ('7e943ba3-b61c-52fa-9d11-071b614765e8'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'Comment peut-on identifier une substance pure ?', 'mcq', '["Par ses températures de changement d’état","Par sa couleur seulement","Par son volume","Par sa forme"]'::jsonb, 0, 'L’eau pure fond à 0 °C et bout à 100 °C.', 7),
    ('1ce20df6-9138-5880-95cd-321bb08fe454'::uuid, 'a2f21aff-a29b-5b12-b31b-92ceb1684a9c'::uuid, 'La masse d’un objet change si on l’emporte sur la Lune.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'C’est le poids qui change, pas la masse.', 8),
    ('1da0ef49-0556-5bda-9533-507d24203098'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'Comment appelle-t-on un mélange dont on ne distingue pas les constituants ?', 'mcq', '["Homogène","Hétérogène","Pur","Saturé"]'::jsonb, 0, 'L’eau salée en est un exemple.', 1),
    ('ce39dfc2-7b63-5db7-a66d-e1321f07e1f1'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'Le mélange eau + huile est…', 'mcq', '["hétérogène","homogène","un corps pur","une solution"]'::jsonb, 0, 'On distingue nettement deux couches.', 2),
    ('03e6ada4-ae78-59dd-aac1-b7bd54561a4c'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'Dans l’eau salée, comment appelle-t-on le sel ?', 'mcq', '["Le soluté","Le solvant","Le filtrat","La solution"]'::jsonb, 0, 'L’eau est le solvant.', 3),
    ('499c990c-ae4b-53d9-90c5-232034886702'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'On dissout 5 g de sel dans 100 g d’eau. Quelle est la masse de la solution ?', 'mcq', '["105 g","100 g","95 g","Cela dépend de la température"]'::jsonb, 0, 'La masse se conserve lors d’une dissolution.', 4),
    ('e94421c3-83da-5afa-a3de-07f4d27d77ab'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'Que signifie « solution saturée » ?', 'mcq', '["Le solvant ne peut plus rien dissoudre","La solution est colorée","Le mélange est hétérogène","Le soluté s’est évaporé"]'::jsonb, 0, 'Le surplus reste au fond du récipient.', 5),
    ('e3fb1bc8-5433-51a7-89d2-d0fedfb55efd'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'Quelle technique sépare l’eau et le sable ?', 'mcq', '["La filtration","L’évaporation seule","La dissolution","Rien ne les sépare"]'::jsonb, 0, 'La décantation fonctionne aussi.', 6),
    ('ade54a3c-54ca-5435-b9cf-59221e2ab6f0'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'Quel gaz est le plus abondant dans l’air ?', 'mcq', '["Le diazote, environ 78 %","Le dioxygène, environ 78 %","Le dioxyde de carbone","La vapeur d’eau"]'::jsonb, 0, 'Le dioxygène représente environ 21 %.', 7),
    ('25c90014-82dd-564c-b856-6ef88c4a0e42'::uuid, '4ce3e396-2447-5ef1-aa68-72c6adf6f919'::uuid, 'La filtration permet de séparer l’eau et le sel dissous.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Il faut évaporer l’eau : un mélange homogène ne se filtre pas.', 8),
    ('78503ee7-afda-522e-ba5b-867100327cef'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Que faut-il préciser pour décrire un mouvement ?', 'mcq', '["Le référentiel, c’est-à-dire par rapport à quoi on l’observe","La couleur de l’objet","La masse de l’objet","Rien de particulier"]'::jsonb, 0, 'Un passager est immobile dans le train, en mouvement pour le quai.', 1),
    ('9174e4ee-9f69-5fa8-8d99-35cf690854f8'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Quelle est la trajectoire d’une nacelle de grande roue ?', 'mcq', '["Circulaire","Rectiligne","Curviligne quelconque","Elle n’en a pas"]'::jsonb, 0, 'Elle décrit un cercle.', 2),
    ('d944c682-078d-5f0e-b5a7-7460e14969c5'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Quelle formule donne la vitesse moyenne ?', 'mcq', '["v = d ÷ t","v = d × t","v = t ÷ d","v = d + t"]'::jsonb, 0, 'On divise la distance par la durée.', 3),
    ('44c4cbe8-8c93-59b5-b5f7-5f4cf610ca91'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Un cycliste parcourt 30 km en 2 h. Quelle est sa vitesse moyenne ?', 'mcq', '["15 km/h","60 km/h","30 km/h","2 km/h"]'::jsonb, 0, '30 ÷ 2 = 15.', 4),
    ('7d0653e9-ba65-5b47-84bd-0b6014311129'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Combien font 36 km/h en m/s ?', 'mcq', '["10 m/s","36 m/s","100 m/s","3,6 m/s"]'::jsonb, 0, 'On divise par 3,6 pour passer des km/h aux m/s.', 5),
    ('f5c6e18b-2549-50a6-a055-d5824d41a3cb'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Quelle formule donne la distance parcourue ?', 'mcq', '["d = v × t","d = v ÷ t","d = t ÷ v","d = v + t"]'::jsonb, 0, 'Elle se déduit de v = d ÷ t.', 6),
    ('e0bbf360-b1cb-5751-b661-82f03b197335'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Une trajectoire en ligne droite est dite…', 'mcq', '["rectiligne","circulaire","curviligne","uniforme"]'::jsonb, 0, 'Le mot décrit la forme, pas la vitesse.', 7),
    ('ce33ee79-dc5c-522d-ae32-3cae34f02aa1'::uuid, '13f783e8-7438-5f3d-95da-6a5c8f390758'::uuid, 'Une vitesse moyenne de 15 km/h signifie que l’objet allait à 15 km/h à chaque instant.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'La moyenne masque les arrêts et les accélérations.', 8),
    ('0a5ad658-07de-58fa-a43c-acb793e3d074'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Comment appelle-t-on un mouvement dont la vitesse ne change pas ?', 'mcq', '["Uniforme","Accéléré","Ralenti","Rectiligne"]'::jsonb, 0, 'Le mot « rectiligne » décrit la trajectoire, pas la vitesse.', 1),
    ('52fdee7c-ae04-5b28-9902-49dfa9f0bd6a'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Une bille qui dévale une pente a un mouvement…', 'mcq', '["accéléré","uniforme","ralenti","circulaire"]'::jsonb, 0, 'Sa vitesse augmente.', 2),
    ('9c482c16-252e-528d-a1e4-83b9181de241'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Sur une chronophotographie, que signifient des écarts qui s’agrandissent ?', 'mcq', '["Le mouvement est accéléré","Le mouvement est uniforme","Le mouvement est ralenti","L’objet est immobile"]'::jsonb, 0, 'La durée entre deux images est toujours la même.', 3),
    ('b825a2e9-73fd-59c8-950f-0a6bc35f8260'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Sur une chronophotographie, que signifient des écarts égaux ?', 'mcq', '["Le mouvement est uniforme","Le mouvement est accéléré","Le mouvement est ralenti","La trajectoire est circulaire"]'::jsonb, 0, 'La vitesse ne change pas.', 4),
    ('1835ad6e-dde7-5bd8-8301-cff209b41721'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Qu’est-ce qu’une chronophotographie ?', 'mcq', '["Une série de photos prises à intervalles de temps réguliers","Une photo prise très vite","Un film au ralenti","Un graphique de vitesse"]'::jsonb, 0, 'C’est la régularité de l’intervalle qui permet la lecture.', 5),
    ('4537e987-bbfa-556d-bab7-4e0288e996d0'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Un mouvement peut-il être circulaire et uniforme à la fois ?', 'mcq', '["Oui : la trajectoire et la vitesse sont deux choses différentes","Non, circulaire implique accéléré","Non, uniforme implique rectiligne","Seulement pour un satellite"]'::jsonb, 0, 'Une nacelle de grande roue en est un exemple.', 6),
    ('e24cf5d4-ab64-5059-9399-787a93d30b62'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, 'Un vélo qui freine a un mouvement…', 'mcq', '["ralenti","uniforme","accéléré","immobile"]'::jsonb, 0, 'Sa vitesse diminue.', 7),
    ('83f4147f-76e4-5259-b4aa-d1677b0c595c'::uuid, 'ad75fd8a-f06d-5fc0-8b2e-015bf4cfe8bf'::uuid, '« Rectiligne » et « uniforme » disent la même chose.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'L’un décrit la trajectoire, l’autre la vitesse.', 8),
    ('b38eb88f-8bea-57a5-bfd4-acf87029397b'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Quelle forme d’énergie possède un objet en mouvement ?', 'mcq', '["L’énergie cinétique","L’énergie de position","L’énergie chimique","L’énergie thermique"]'::jsonb, 0, 'Elle augmente avec la masse et la vitesse.', 1),
    ('9a66e2d1-6030-51d7-8582-ba7240fb8020'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Quelle énergie est stockée dans les aliments et l’essence ?', 'mcq', '["L’énergie chimique","L’énergie cinétique","L’énergie lumineuse","L’énergie nucléaire"]'::jsonb, 0, 'Une pile en stocke également.', 2),
    ('56a71f0e-a1f3-54e8-a292-0bfa4c9d67e1'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Quelle est l’unité de l’énergie ?', 'mcq', '["Le joule","Le watt","Le newton","Le degré Celsius"]'::jsonb, 0, 'Le kilowattheure sert pour l’électricité domestique.', 3),
    ('376050ed-9767-56fc-bfb7-997db28d3814'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Laquelle de ces sources est renouvelable ?', 'mcq', '["Le vent","Le charbon","Le pétrole","L’uranium"]'::jsonb, 0, 'Elle se reconstitue à l’échelle humaine.', 4),
    ('8d43e8e0-cb8e-5f7b-bc19-0c63c2d566a6'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Comment appelle-t-on le charbon, le pétrole et le gaz naturel ?', 'mcq', '["Des énergies fossiles","Des énergies renouvelables","Des énergies nucléaires","Des convertisseurs"]'::jsonb, 0, 'Leurs réserves s’épuisent.', 5),
    ('94279826-648c-5e8e-90d6-21a75a14f499'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Quelle énergie possède l’eau retenue en haut d’un barrage ?', 'mcq', '["L’énergie de position","L’énergie cinétique","L’énergie chimique","L’énergie électrique"]'::jsonb, 0, 'Elle se convertit en énergie cinétique lors de la chute.', 6),
    ('d887f128-015a-550f-9c67-4736204d2457'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Comment représente-t-on une chaîne d’énergie ?', 'mcq', '["Source → convertisseur → utilisation","Utilisation → source","Par un cercle fermé","Par un tableau de mesures"]'::jsonb, 0, 'Les flèches indiquent le sens des conversions.', 7),
    ('9f227c49-54fc-52cb-8e32-57cd5ff3e406'::uuid, '84b73b26-175f-5085-9ba8-3b0848d43601'::uuid, 'Le Soleil est à l’origine de la plupart des autres sources d’énergie.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Le vent, la pluie, les plantes et le pétrole en descendent.', 8),
    ('681a12a5-e504-5b9f-a8d4-d751a4bcf479'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Que devient l’énergie lors d’une conversion ?', 'mcq', '["Elle change de forme sans disparaître","Elle est détruite","Elle est créée","Elle reste identique"]'::jsonb, 0, 'C’est le principe de conservation de l’énergie.', 1),
    ('5606439c-40a8-5136-bd63-cae38f0d5fb3'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Quelle conversion réalise un panneau solaire ?', 'mcq', '["Lumineuse → électrique","Électrique → lumineuse","Chimique → électrique","Cinétique → électrique"]'::jsonb, 0, 'L’éolienne, elle, convertit du cinétique en électrique.', 2),
    ('1c57b135-e023-5ea0-8bc0-0f90517221b8'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Quelle conversion réalise une pile ?', 'mcq', '["Chimique → électrique","Électrique → chimique","Lumineuse → électrique","Thermique → électrique"]'::jsonb, 0, 'L’énergie est stockée sous forme chimique.', 3),
    ('7b581282-f2f0-553f-9802-b4529e55b35a'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Sous quelle forme part l’énergie « perdue » d’un appareil ?', 'mcq', '["La chaleur","La lumière","Le son uniquement","Elle disparaît"]'::jsonb, 0, 'Elle est dispersée, pas détruite.', 4),
    ('118d29f3-3910-5cfb-8f85-c705a6aa49da'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Que compare le rendement d’un appareil ?', 'mcq', '["L’énergie utile à l’énergie consommée","La puissance au prix","La masse au volume","La durée à la distance"]'::jsonb, 0, 'Plus il est élevé, moins on gaspille.', 5),
    ('2cf3f3ad-5796-5b59-8284-05891deb64ac'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Quelle conversion réalise une éolienne ?', 'mcq', '["Cinétique → électrique","Électrique → cinétique","Lumineuse → électrique","Chimique → cinétique"]'::jsonb, 0, 'Elle capte l’énergie du vent en mouvement.', 6),
    ('e85bacd7-f4ab-5800-80c2-75d33993fb9a'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Pourquoi une ampoule à filament chauffait-elle autant ?', 'mcq', '["Elle convertissait environ 95 % de l’électricité en chaleur","Elle consommait peu","Elle n’avait pas de convertisseur","Elle produisait trop de lumière"]'::jsonb, 0, 'La LED a un bien meilleur rendement.', 7),
    ('70a561a9-08ce-5dcd-b0fc-b39f00b38a1a'::uuid, 'a4b4d6a6-a0ab-5282-bbb6-aba25d3c6cdb'::uuid, 'Une conversion d’énergie peut être parfaite, sans aucune perte.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Une part se disperse toujours en chaleur.', 8),
    ('fe6862f0-cf80-53a9-b34e-98b5e3bb244f'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Quel élément produit l’électricité dans la plupart des centrales ?', 'mcq', '["L’alternateur, entraîné par une turbine","La chaudière","Le condenseur","Le transformateur"]'::jsonb, 0, 'Seul le photovoltaïque s’en passe.', 1),
    ('28ed39de-e772-5194-a16f-dff8f6682c52'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Quelle centrale produit l’électricité sans turbine ?', 'mcq', '["La centrale photovoltaïque","La centrale nucléaire","La centrale hydraulique","L’éolienne"]'::jsonb, 0, 'Le panneau convertit directement la lumière.', 2),
    ('fd0096f2-9070-59e6-a1d1-2ffcadc2265d'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Quel gaz les centrales thermiques à flamme rejettent-elles principalement ?', 'mcq', '["Le dioxyde de carbone","Le dioxygène","Le diazote","L’hélium"]'::jsonb, 0, 'C’est le principal gaz à effet de serre.', 3),
    ('de48d85a-49e5-5231-a4a5-59fc3588e0bf'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Quel est le principal inconvénient du nucléaire ?', 'mcq', '["Les déchets radioactifs à stocker très longtemps","Les rejets massifs de CO₂","Sa dépendance à la météo","Son faible rendement"]'::jsonb, 0, 'Il émet en revanche très peu de gaz à effet de serre.', 4),
    ('519806a7-2e8b-529d-b880-cf6708dfe18b'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Qu’appelle-t-on le mix énergétique d’un pays ?', 'mcq', '["La combinaison de ses différents moyens de production","Sa consommation totale","Son rendement moyen","Le prix de son électricité"]'::jsonb, 0, 'Aucune source ne convient à tous les usages.', 5),
    ('7672e39d-fd1e-5b8d-ad55-e81ea1d32900'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Qu’est-ce qui fait tourner la turbine d’une centrale hydraulique ?', 'mcq', '["L’eau retenue par le barrage","La vapeur","Le vent","Le Soleil"]'::jsonb, 0, 'L’énergie de position se convertit en énergie cinétique.', 6),
    ('8dc6d5cb-6b44-5ae6-810f-a42c665209fb'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Quel est le premier poste d’économie d’énergie dans un logement ?', 'mcq', '["L’isolation","L’éclairage","La télévision","Le réfrigérateur"]'::jsonb, 0, 'Le chauffage domine la consommation domestique.', 7),
    ('5bc2ac48-7478-509c-a2ff-ca0e67cd212f'::uuid, '801d1fa7-56a4-5608-ba9a-b624367734d5'::uuid, 'Les énergies renouvelables produisent de l’électricité de façon parfaitement régulière.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Le vent et le soleil dépendent de la météo.', 8),
    ('8f7556b5-e8eb-5f03-8fd3-3814d97b90dd'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Comment la lumière se propage-t-elle dans un milieu transparent et homogène ?', 'mcq', '["En ligne droite","En cercle","En zigzag","Elle ne se propage pas"]'::jsonb, 0, 'C’est ce qui explique les ombres.', 1),
    ('2716133f-2c40-5d09-858f-84323bef2679'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Laquelle est une source primaire de lumière ?', 'mcq', '["Une lampe allumée","La Lune","Un mur blanc","Un miroir"]'::jsonb, 0, 'Les autres ne font que diffuser la lumière reçue.', 2),
    ('7e842a3f-ce15-598b-8d5f-4f6557fd3077'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Quelle est la vitesse de la lumière ?', 'mcq', '["Environ 300 000 km/s","Environ 340 m/s","Environ 3 000 km/s","Environ 30 km/s"]'::jsonb, 0, 'C’est la plus grande vitesse connue.', 3),
    ('318e3dff-d16b-54ab-8c06-3f56cf44991a'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Quelle est la vitesse du son dans l’air ?', 'mcq', '["Environ 340 m/s","Environ 300 000 km/s","Environ 34 m/s","Environ 3 400 m/s"]'::jsonb, 0, 'Bien plus lente que la lumière.', 4),
    ('ec46e2c7-b113-5871-8a99-94641f8bf2c4'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Le son peut-il se propager dans le vide ?', 'mcq', '["Non, il lui faut un milieu matériel","Oui, comme la lumière","Oui, mais plus lentement","Seulement s’il est très fort"]'::jsonb, 0, 'La lumière, elle, traverse le vide.', 5),
    ('249715c2-4ad0-5425-b065-f84694c99586'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Pourquoi voit-on l’éclair avant d’entendre le tonnerre ?', 'mcq', '["La lumière va bien plus vite que le son","L’éclair se produit avant le tonnerre","Le son part dans une autre direction","L’œil réagit plus vite que l’oreille"]'::jsonb, 0, '300 000 km/s contre 340 m/s.', 6),
    ('83128102-9e39-59f7-bb4c-dda83a20500a'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Comment un son est-il produit ?', 'mcq', '["Par un objet qui vibre","Par un objet qui chauffe","Par un objet qui brille","Par un objet immobile"]'::jsonb, 0, 'La vibration se transmet au milieu.', 7),
    ('96c0de86-5896-5d58-bd66-a0ef9cf27415'::uuid, '00fed437-28b6-5ca3-b403-4d0f9dc6e38a'::uuid, 'Les cellules de l’oreille interne détruites par le bruit repoussent avec le temps.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'La perte auditive est définitive.', 8),
    ('8ca53146-f7f2-5a9f-92be-dbb721d46538'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Quel est le schéma d’une transmission d’information ?', 'mcq', '["Émetteur → canal → récepteur","Récepteur → émetteur","Canal → émetteur → canal","Source → turbine → alternateur"]'::jsonb, 0, 'L’émetteur code, le récepteur décode.', 1),
    ('d36894c3-e892-535a-81aa-24ca204c4a6e'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Sous quelle forme l’information circule-t-elle dans une fibre optique ?', 'mcq', '["Sous forme de lumière","Sous forme de courant électrique","Sous forme de son","Sous forme de chaleur"]'::jsonb, 0, 'Dans un fil de verre très fin.', 2),
    ('09db030a-d7bb-5c15-ba54-cb9ef1c62944'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Quels sont les deux états du langage binaire ?', 'mcq', '["0 et 1","A et B","+ et −","Oui et non uniquement"]'::jsonb, 0, 'Toute information y est convertie.', 3),
    ('b2e91d5b-983a-50b1-973c-50b4709f4f36'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Quelle est l’unité de quantité d’information ?', 'mcq', '["L’octet","Le joule","Le hertz","Le mètre"]'::jsonb, 0, 'Avec ses multiples : ko, Mo, Go.', 4),
    ('4af4a845-b967-55c4-b5ad-0d9f810b2de4'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Quel support transporte le plus de données le plus vite ?', 'mcq', '["La fibre optique","Le câble électrique","Les ondes radio","Le pigeon voyageur"]'::jsonb, 0, 'L’information y voyage sous forme de lumière.', 5),
    ('afaa785c-0105-5722-883a-469521981dc4'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Que se passe-t-il avant qu’un son soit transmis sur un réseau ?', 'mcq', '["Il est converti en une suite de 0 et de 1","Il est amplifié seulement","Il est transformé en chaleur","Rien, il circule tel quel"]'::jsonb, 0, 'Il est reconverti à l’arrivée.', 6),
    ('0709a94f-2403-5588-a88e-05e8ae8179a6'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Qu’est-ce que le « cloud » ?', 'mcq', '["Des serveurs distants, c’est-à-dire les ordinateurs de quelqu’un d’autre","Une mémoire dans les nuages","Un type de câble","Un logiciel de compression"]'::jsonb, 0, 'Les données y sont stockées hors de chez soi.', 7),
    ('a37eda68-3296-5751-8f00-ab30152f30b4'::uuid, '16f4646c-3de9-50a8-aae8-12f478add2b9'::uuid, 'Une information publiée en ligne reste sous le contrôle de son auteur.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Elle peut être copiée, conservée et rediffusée à son insu.', 8)
  ) AS v(id, quiz_id, question, kind, options, correct_index, explanation, position)
-- Le quiz doit exister : si le NOT EXISTS ci-dessus a écarté un quiz (une
-- leçon en avait déjà un), ses questions ne partent pas dans le vide.
 WHERE EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.id = v.quiz_id)
ON CONFLICT (id) DO NOTHING;

-- 5. Sonde finale ----------------------------------------------------------
DO $$
DECLARE
  n_vides integer;
  n_chap  integer;
BEGIN
  SELECT count(*) INTO n_chap FROM public.chapters c
   JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug IN ('physique-chimie');
  SELECT count(*) INTO n_vides FROM public.subjects s
   WHERE s.slug IN ('physique-chimie')
     AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.subject_id = s.id);
  IF n_vides > 0 THEN
    RAISE EXCEPTION 'Migration 326 incomplète : % matiere(s) encore sans chapitre', n_vides;
  END IF;
  RAISE NOTICE 'Migration 326 OK : % chapitres sur les matieres visees.', n_chap;
END $$;
