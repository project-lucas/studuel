-- =============================================================================
-- Studuel — Migration 327 : SVT 6e — LE PROGRAMME COMPLET (9 fiches)
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.
--    Source : scripts/contenu/*.mjs
--    Regénérer : node scripts/seed-contenu.mjs --num 327 --modules svt-6e
--
-- CONSTAT : les SVT de 6e n'avaient que les 5 fiches du premier jeu de données de
-- l'app — cinq titres très larges (« Le vivant et sa diversité », « Le
-- développement des êtres vivants », « Les besoins des plantes vertes »,
-- « L'origine de nos aliments », « La Terre dans le système solaire »), sans aucun
-- découpage. Un élève qui révisait la cellule, la classification, l'évolution, les
-- besoins vitaux de ses organes, la conservation des aliments ou la reproduction
-- humaine ne trouvait RIEN de précis. Cette migration installe les 9 fiches du
-- programme, rangées sous les 3 chapitres de la maquette, et retire les 5 fiches
-- génériques.
-- LE CONTENU EST ÉCRIT, PAS IMPORTÉ du cycle 4 : la 6e relève du CYCLE 3, dont le
-- programme de sciences n'a ni le même découpage ni le même niveau d'exigence.
--
-- Cette migration apporte : 9 chapitres, 9 leçons,
-- 9 quiz et 72 questions, sur 1 matière.
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
-- [svt] La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
-- [svt] module range ses 9 fiches sous 3 chapitres, et l'INSERT écrit la colonne. Elle
-- [svt] est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
-- [svt] la 234 soit passée en production — sans cette reprise, la migration échouerait
-- [svt] sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
-- [svt] supprimés et les 9 neufs pas encore posés : une matière vide.
-- [svt] Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
-- [svt] Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
-- [svt] chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- [svt] Les 5 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.
-- [svt] 
-- [svt] LE REPÈRE EST theme IS NULL, PAS LE TITRE. « Le développement des êtres vivants »
-- [svt] (ancien) et « Le développement et la reproduction des êtres vivants » (neuf) se
-- [svt] ressemblent de très près : un ménage par titre demanderait de vérifier à chaque
-- [svt] relecture qu'aucune fiche neuve ne heurte l'un des cinq anciens libellés, alors
-- [svt] que chapters porte UNIQUE(subject_id, level, title). Le critère « pas de chapitre
-- [svt] de programme » vise exactement les cinq lignes voulues : elles datent de la 008,
-- [svt] bien avant la colonne theme, tandis que les 9 fiches neuves en portent une dès
-- [svt] l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
-- [svt] sur elles, ni au premier passage ni au rejeu.
-- [svt] Le filtre level = '6e' est indispensable : les SVT existent sur sept niveaux.
-- [svt] L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
-- [svt] étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis les
-- [svt] chapitres, dont les leçons partent en cascade.
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '6e'
   AND c.theme IS NULL;

-- 1. Chapitres -------------------------------------------------------------
-- Jointure sur le SLUG (et non le nom) : c’est la clé stable de `subjects`.
INSERT INTO public.chapters (id, subject_id, level, title, position, theme)
SELECT v.id, s.id, v.level, v.title, v.position, v.theme
  FROM (VALUES
    ('b71f99c4-65f3-5068-976e-9d874d5122ad'::uuid, 'svt', '6e', 'La cellule, unité de définition de l’être vivant', 1, 'Unité et diversité des êtres vivants'),
    ('ac14a405-8cc2-51a0-8e0b-6823bfa23e5b'::uuid, 'svt', '6e', 'La classification des êtres vivants', 2, 'Unité et diversité des êtres vivants'),
    ('8cd9957e-24d3-5f58-8560-236933326f10'::uuid, 'svt', '6e', 'L’évolution des espèces', 3, 'Unité et diversité des êtres vivants'),
    ('a96e9734-6df3-535c-aa09-d18ce65f4d9b'::uuid, 'svt', '6e', 'Les aliments, une source d’éléments vitaux pour l’organisme', 4, 'Les aliments'),
    ('3c61fab7-0860-5302-af34-7442657abdab'::uuid, 'svt', '6e', 'Les besoins vitaux de nos organes', 5, 'Les aliments'),
    ('70ef7f33-c6e9-505d-aca6-a52213207f2e'::uuid, 'svt', '6e', 'Nourrir les hommes : la culture et l’élevage', 6, 'Les aliments'),
    ('97a493ed-ceed-57c3-bdcb-2455e67162c9'::uuid, 'svt', '6e', 'La production et la conservation des aliments', 7, 'Les aliments'),
    ('6798a012-7a4d-5227-a2c4-1e0a89ad556b'::uuid, 'svt', '6e', 'Le développement et la reproduction des êtres vivants', 8, 'La reproduction des êtres vivants'),
    ('c5ff4f24-ac14-508b-badc-19eb829c9e6f'::uuid, 'svt', '6e', 'Le développement et la reproduction des êtres humains', 9, 'La reproduction des êtres vivants')
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
    ('b71f99c4-65f3-5068-976e-9d874d5122ad'::uuid, 'Unité et diversité des êtres vivants'),
    ('ac14a405-8cc2-51a0-8e0b-6823bfa23e5b'::uuid, 'Unité et diversité des êtres vivants'),
    ('8cd9957e-24d3-5f58-8560-236933326f10'::uuid, 'Unité et diversité des êtres vivants'),
    ('a96e9734-6df3-535c-aa09-d18ce65f4d9b'::uuid, 'Les aliments'),
    ('3c61fab7-0860-5302-af34-7442657abdab'::uuid, 'Les aliments'),
    ('70ef7f33-c6e9-505d-aca6-a52213207f2e'::uuid, 'Les aliments'),
    ('97a493ed-ceed-57c3-bdcb-2455e67162c9'::uuid, 'Les aliments'),
    ('6798a012-7a4d-5227-a2c4-1e0a89ad556b'::uuid, 'La reproduction des êtres vivants'),
    ('c5ff4f24-ac14-508b-badc-19eb829c9e6f'::uuid, 'La reproduction des êtres vivants')
  ) AS v(id, theme)
 WHERE c.id = v.id AND c.theme IS DISTINCT FROM v.theme;

-- 2. Leçons ----------------------------------------------------------------
INSERT INTO public.lessons (id, chapter_id, title, content, position) VALUES
  ('46ac5e9c-3c78-5812-8931-7659210b58d2', 'b71f99c4-65f3-5068-976e-9d874d5122ad', 'La brique commune à tout ce qui vit', E'Tous les êtres vivants — la bactérie, le chêne, la fourmi, toi — sont faits de **cellules**. C’est le point commun de tout ce qui vit.\n\n## Qu’est-ce qu’une cellule ?\nC’est la **plus petite unité** capable de vivre. Elle est si petite qu’il faut un **microscope** pour la voir : quelques centièmes de millimètre.\n\n## Ce qu’on trouve dans toute cellule\n- une **membrane** qui la délimite et contrôle les échanges ;\n- un **cytoplasme**, milieu gélatineux où se déroulent les réactions ;\n- un **noyau**, qui contient l’information génétique et commande la cellule.\n\n## Ce que la cellule végétale a en plus\n- une **paroi** rigide, qui lui donne sa forme et soutient la plante ;\n- des **chloroplastes** verts, contenant la **chlorophylle**, où se fait la photosynthèse ;\n- une grande **vacuole** remplie de liquide.\n\n> C’est la paroi qui explique qu’une tige tienne debout et qu’une cellule végétale ait des angles droits, là où la cellule animale est arrondie.\n\n## Unicellulaire et pluricellulaire\n- **Unicellulaire** : l’être vivant tient en **une seule** cellule (bactérie, paramécie, levure).\n- **Pluricellulaire** : il en compte des milliards, organisées en tissus et en organes (l’humain en a environ 30 000 milliards).\n\n## Toute cellule vient d’une cellule\nUne cellule ne naît jamais de rien : elle provient toujours de la **division** d’une cellule précédente. C’est ainsi que l’on grandit et que les blessures cicatrisent.', 1),
  ('ffb4e608-fcc9-59ac-a850-faa9fa3c5c7c', 'ac14a405-8cc2-51a0-8e0b-6823bfa23e5b', 'Ranger le vivant par ce qu’il possède', E'## Le principe : les attributs\nOn ne classe **pas** les êtres vivants par ce qu’ils font (voler, nager) ni par leur milieu de vie, mais par les **attributs** qu’ils **possèdent** : squelette interne, vertèbres, poils, plumes, quatre membres, mamelles…\n\n> La chauve-souris vole comme l’oiseau, mais elle a des **poils** et des **mamelles** : c’est un mammifère. Le critère est ce qu’on possède, pas ce qu’on fait.\n\n## Les groupes emboîtés\nOn représente la classification par des **boîtes emboîtées** : chaque boîte porte un attribut, et tous les êtres qui la partagent y entrent. Une boîte incluse dans une autre partage tous les attributs de la plus grande.\nExemple : la boîte « vertèbres » contient la boîte « poils et mamelles » (les mammifères), qui contient la boîte « pouce opposable » (les primates).\n\n## Quelques grands groupes\n- **Vertébrés** : squelette interne et vertèbres — poissons, amphibiens, reptiles, oiseaux, mammifères.\n- **Arthropodes** : squelette **externe** et pattes articulées — insectes (6 pattes), arachnides (8 pattes), crustacés.\n- **Mollusques** : corps mou, souvent une coquille.\n\n## Espèce, genre, nom scientifique\nUne **espèce** regroupe les individus qui peuvent se reproduire entre eux et donner une descendance elle-même féconde.\nChaque espèce porte un **nom scientifique en latin**, en deux mots : *Homo sapiens*, *Canis lupus*. Ce nom est le même dans tous les pays, ce qui évite les confusions entre langues.\n\n## Un lien de parenté\nPartager des attributs, c’est partager un **ancêtre commun**. La classification ne range pas seulement : elle raconte une **histoire de famille**.', 1),
  ('b598fa85-589e-5592-a703-f6e1483dff2c', '8cd9957e-24d3-5f58-8560-236933326f10', 'Le vivant change au fil du temps', E'## Les espèces ne sont pas figées\nLes espèces **apparaissent**, se **transforment** et **disparaissent**. La vie sur Terre a environ **3,8 milliards d’années**, et l’immense majorité des espèces qui ont existé sont aujourd’hui **éteintes**.\n\n## Les fossiles, nos archives\nUn **fossile** est un reste ou une trace d’un être vivant du passé, conservé dans la roche (os, coquille, empreinte, terrier). Les fossiles prouvent que des espèces différentes des actuelles ont vécu, et permettent de les **dater** : plus la couche de roche est profonde, plus elle est ancienne.\n\n## Comment ça marche\nAu sein d’une espèce, les individus **varient** : taille, couleur, résistance au froid. Quand le milieu change, certaines variations donnent un **avantage** — ces individus survivent mieux, se reproduisent davantage et transmettent leurs caractères. Sur des milliers de générations, l’espèce **se transforme**.\n\n> Ce n’est pas l’individu qui s’adapte au cours de sa vie : c’est l’espèce qui change parce que certains individus laissent plus de descendants que d’autres.\n\n## Les crises biologiques\nCinq **extinctions de masse** ont éliminé une grande part du vivant. La plus connue, il y a **66 millions d’années**, a fait disparaître les dinosaures non-aviens et a libéré la place où les mammifères se sont diversifiés.\n\n## La biodiversité aujourd’hui\nLa **biodiversité** est la variété du vivant. Elle diminue vite sous l’effet des activités humaines : destruction des milieux, pollution, surexploitation, réchauffement. La protéger, c’est protéger les équilibres dont nous dépendons.', 1),
  ('27ff95b9-2d32-57bc-a1a4-60dfc3761b75', 'a96e9734-6df3-535c-aa09-d18ce65f4d9b', 'Ce que contient ce qu’on mange', E'Les aliments apportent des **nutriments**, dont l’organisme a besoin pour fonctionner, grandir et se réparer.\n\n## Les grandes familles de nutriments\n- **Glucides** (sucres) : le **carburant** principal. Pain, pâtes, riz, fruits.\n- **Lipides** (graisses) : réserve d’énergie et constituants des membranes. Huile, beurre, fruits secs.\n- **Protides** (protéines) : les **matériaux de construction** du corps. Viande, poisson, œufs, légumineuses.\n- **Vitamines** et **minéraux** (calcium, fer) : en très petite quantité, mais indispensables.\n- **Eau** : elle représente environ **60 %** de la masse du corps.\n- **Fibres** : elles ne nourrissent pas mais font fonctionner l’intestin.\n\n## Le rôle de la digestion\nLes aliments sont trop gros pour passer dans le sang. La **digestion** les réduit en nutriments assez petits pour traverser la paroi de l’**intestin grêle** : c’est l’**absorption intestinale**. Le sang les distribue ensuite à tous les organes.\n\n## Une alimentation équilibrée\nAucun aliment ne contient tout : il faut **varier**. Les repères sont simples — des fruits et légumes à chaque repas, des féculents à chaque repas, des protéines une à deux fois par jour, peu de produits gras, sucrés et salés, et de l’eau comme seule boisson indispensable.\n\n> Équilibré ne veut pas dire parfait à chaque repas, mais varié sur la semaine.\n\n## Les besoins varient\nUn adolescent en croissance, un sportif et une personne âgée n’ont pas les mêmes besoins. L’activité physique, l’âge et la taille les font changer.', 1),
  ('68b9999b-06f3-5c55-828c-33ec24743ef2', '3c61fab7-0860-5302-af34-7442657abdab', 'Le sang livre, les organes consomment', E'## Ce dont un organe a besoin\nPour fonctionner, tout organe a besoin en permanence de **dioxygène** et de **nutriments**. Il produit en retour des **déchets** : du **dioxyde de carbone** et de l’urée.\n\n## Le sang, le livreur\nLe **sang** circule dans les vaisseaux et assure ces échanges : il **apporte** dioxygène et nutriments, il **emporte** les déchets. Le **cœur** est la pompe qui le fait circuler sans arrêt.\n\n## D’où vient le dioxygène\nDe l’air, par la **respiration**. Il entre dans les **poumons**, passe dans le sang au niveau des **alvéoles pulmonaires** — de minuscules sacs très nombreux, dont la paroi est extrêmement fine — et le dioxyde de carbone fait le trajet inverse.\n\n## D’où viennent les nutriments\nDes aliments, par la **digestion** puis l’**absorption** dans l’intestin grêle.\n\n## Ce que devient l’énergie\nDans chaque organe, les nutriments et le dioxygène réagissent : c’est la **respiration cellulaire**. Elle libère l’**énergie** nécessaire au fonctionnement, et produit du dioxyde de carbone et de l’eau.\n\n## Pendant l’effort\nLes muscles consomment davantage. Le corps s’adapte : le **rythme cardiaque** augmente, la **respiration** s’accélère, et le sang est redistribué en priorité vers les muscles.\n\n> Un cœur qui bat plus vite pendant un effort n’est pas un cœur en difficulté : c’est un cœur qui livre plus vite.\n\n## L’élimination des déchets\nLes **reins** filtrent le sang et fabriquent l’**urine**, qui évacue l’urée. Les poumons, eux, évacuent le dioxyde de carbone.', 1),
  ('717c16fd-6375-5925-bcfe-3c304a806853', '70ef7f33-c6e9-505d-aca6-a52213207f2e', 'Produire de quoi manger', E'## Deux grandes voies\n- L’**agriculture** cultive des végétaux (céréales, légumes, fruits).\n- L’**élevage** produit des animaux et leurs produits (viande, lait, œufs).\n\n## Les besoins d’une plante cultivée\nUne plante verte a besoin de **lumière**, d’**eau**, de **dioxyde de carbone** et de **sels minéraux** puisés dans le sol par ses racines. Avec ces éléments et la lumière, elle fabrique sa propre matière : c’est la **photosynthèse**.\nUne plante est **productrice primaire** : elle ne mange pas, elle produit.\n\n## Pourquoi on amende les sols\nLes cultures **prélèvent** des sels minéraux. Sans apport, le sol s’appauvrit. On y remédie par des **engrais** (organiques comme le fumier, ou minéraux) et par la **rotation des cultures**, qui alterne les espèces pour ménager le sol.\n\n## Le coût de l’élevage\nNourrir un animal pour le manger ensuite coûte beaucoup plus de végétaux, d’eau et de surface que de manger directement des végétaux : à chaque maillon de la chaîne alimentaire, une grande partie de l’énergie est **perdue**.\n\n> C’est pourquoi un kilo de viande mobilise bien plus de ressources qu’un kilo de céréales.\n\n## Les impacts et les choix\nL’agriculture intensive produit beaucoup mais utilise engrais et **pesticides**, qui polluent l’eau et réduisent la biodiversité. L’agriculture biologique s’en passe largement, avec des rendements souvent inférieurs.\nManger local et de **saison**, limiter le **gaspillage** — un tiers de la nourriture produite est perdue — sont des leviers accessibles à chacun.', 1),
  ('ff409211-00a9-5662-a523-6db80fc7a6ec', '97a493ed-ceed-57c3-bdcb-2455e67162c9', 'Des micro-organismes utiles, des micro-organismes à arrêter', E'## Les micro-organismes qui transforment\nCertains aliments existent **grâce** aux micro-organismes. C’est la **fermentation** :\n- le **pain** lève grâce à la **levure**, qui produit du dioxyde de carbone ;\n- le **yaourt** et le **fromage** viennent de **bactéries** qui transforment le lait ;\n- le vin, la bière et la choucroute sont aussi des produits fermentés.\n\n## Les micro-organismes qui abîment\nD’autres provoquent l’**altération** des aliments et peuvent rendre malade. Ils ont besoin, pour se multiplier, de **chaleur**, d’**eau** et de **nutriments**. Toute technique de conservation consiste à leur retirer au moins l’un des trois.\n\n## Les techniques de conservation\n- **Le froid** : le **réfrigérateur** (~4 °C) ralentit leur multiplication ; le **congélateur** (−18 °C) l’arrête presque. Le froid ne **tue** pas : il met en pause.\n- **La chaleur** : la **pasteurisation** (~70 °C) en détruit une grande partie ; la **stérilisation** (>100 °C) les élimine — c’est la conserve.\n- **Le séchage** : on retire l’eau (fruits secs, pâtes).\n- **Le sel et le sucre** : ils retiennent l’eau et la rendent indisponible (jambon sec, confiture).\n- **Le vide** et la **fumaison** complètent la liste.\n\n> Le froid met en pause, la chaleur détruit. C’est pourquoi un produit décongelé ne doit jamais être recongelé : les micro-organismes ont repris leur multiplication.\n\n## Lire une étiquette\nLa **DLC** (« à consommer jusqu’au ») concerne les produits frais : elle ne se dépasse pas. La **DDM** (« à consommer de préférence avant ») signale une baisse de qualité, pas un danger.\n\n## L’hygiène\nSe laver les mains, respecter la chaîne du froid, séparer le cru et le cuit : les gestes simples évitent la plupart des intoxications alimentaires.', 1),
  ('2d349f75-cd94-5c66-8dbf-3a8898aa1a57', '6798a012-7a4d-5227-a2c4-1e0a89ad556b', 'Naître, grandir, se reproduire', E'## Deux formes de reproduction\n- **Sexuée** : elle demande **deux** cellules reproductrices, un **spermatozoïde** (mâle) et un **ovule** (femelle). Leur rencontre est la **fécondation** ; elle donne une **cellule-œuf**, première cellule du nouvel être vivant. Les descendants sont **tous différents** entre eux.\n- **Asexuée** : un seul individu suffit — bouturage d’une plante, division d’une bactérie, stolons du fraisier. Les descendants sont **identiques** au parent.\n\n> La reproduction sexuée fabrique de la diversité ; l’asexuée fabrique des copies.\n\n## Où se fait la fécondation\n- **Externe** : dans l’eau, les cellules sont libérées dans le milieu (poissons, grenouilles). Il en faut beaucoup, car peu survivent.\n- **Interne** : dans le corps de la femelle (mammifères, oiseaux, reptiles, insectes). Moins de descendants, mieux protégés.\n\n## Le développement\n- **Direct** : le jeune ressemble à l’adulte en plus petit (chat, humain, oiseau).\n- **Indirect** : le jeune, appelé **larve**, ne ressemble pas à l’adulte et se transforme par **métamorphose** (têtard → grenouille, chenille → papillon).\n\n## Chez les plantes à fleurs\nLa **fleur** porte les organes reproducteurs. Le **pollen** doit atteindre le **pistil** : c’est la **pollinisation**, assurée par le vent ou par les **insectes pollinisateurs**. Après fécondation, l’**ovaire** devient un **fruit** et l’ovule une **graine**.\nLa **dispersion** des graines (vent, animaux, eau) éloigne les jeunes plantes de la plante mère.\n\n## Peuplement et saisons\nSelon les saisons, les espèces changent de forme ou de lieu : graines, bulbes, œufs, migration, hibernation. C’est ainsi qu’un milieu se **repeuple** au printemps.', 1),
  ('2ba9ce4b-e54f-5f73-a060-f25f324233d4', 'c5ff4f24-ac14-508b-badc-19eb829c9e6f', 'La puberté et le début de la vie', E'## La puberté\nLa **puberté** est le passage de l’enfance à l’âge adulte. Elle commence en général entre **10 et 15 ans**, à un âge qui varie beaucoup d’une personne à l’autre — et cette variation est **normale**.\n\nElle se traduit par :\n- une **croissance** rapide ;\n- l’apparition des **caractères sexuels secondaires** (pilosité, mue de la voix et développement musculaire chez le garçon ; développement des seins et élargissement du bassin chez la fille) ;\n- le début du fonctionnement des **organes reproducteurs** : production de **spermatozoïdes** par les testicules, premières **règles** chez la fille, signe qu’un ovule est libéré chaque mois par les ovaires.\n\n## Le cycle et les règles\nEnviron une fois par mois, un ovaire libère un ovule : c’est l’**ovulation**. En l’absence de fécondation, la paroi de l’utérus est évacuée : ce sont les **règles**, qui durent quelques jours.\n\n## De la fécondation à la naissance\nLa **fécondation** a lieu dans une trompe. La cellule-œuf se divise et vient se fixer dans l’**utérus** : c’est la **nidation**. L’**embryon** devient **fœtus** vers la fin du deuxième mois.\nIl est relié au **placenta** par le **cordon ombilical**, qui lui apporte dioxygène et nutriments et évacue ses déchets. La **grossesse** dure environ **9 mois** et se termine par l’**accouchement**.\n\n## Contraception et protection\nLa **contraception** (préservatif, pilule…) permet d’éviter une grossesse. Le **préservatif** est le seul moyen qui protège **aussi** des infections sexuellement transmissibles.\n\n> Deux fonctions différentes, un seul objet qui remplit les deux : c’est pourquoi le préservatif a une place à part.\n\n## Respect et consentement\nLe corps de chacun lui appartient. Le **consentement** est libre, éclairé et peut être retiré à tout moment. Aucune pression, aucune moquerie sur le corps d’autrui n’est acceptable.', 1)
ON CONFLICT DO NOTHING;

-- 3. Quiz ------------------------------------------------------------------
-- Double garde : ON CONFLICT (id) protège du rejeu, et le NOT EXISTS protège
-- la leçon d’un SECOND quiz venu d’ailleurs — le hub de leçon lit son quiz en
-- .maybeSingle(), deux quiz feraient lever « multiple rows » à de vrais élèves.
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.id, v.title, v.subject, v.grade_level, v.chapter, true, l.id
  FROM (VALUES
    ('538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'Quiz — La brique commune à tout ce qui vit', 'SVT', '6e', 'La cellule, unité de définition de l’être vivant', '46ac5e9c-3c78-5812-8931-7659210b58d2'::uuid),
    ('3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'Quiz — Ranger le vivant par ce qu’il possède', 'SVT', '6e', 'La classification des êtres vivants', 'ffb4e608-fcc9-59ac-a850-faa9fa3c5c7c'::uuid),
    ('88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Quiz — Le vivant change au fil du temps', 'SVT', '6e', 'L’évolution des espèces', 'b598fa85-589e-5592-a703-f6e1483dff2c'::uuid),
    ('5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'Quiz — Ce que contient ce qu’on mange', 'SVT', '6e', 'Les aliments, une source d’éléments vitaux pour l’organisme', '27ff95b9-2d32-57bc-a1a4-60dfc3761b75'::uuid),
    ('6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Quiz — Le sang livre, les organes consomment', 'SVT', '6e', 'Les besoins vitaux de nos organes', '68b9999b-06f3-5c55-828c-33ec24743ef2'::uuid),
    ('07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Quiz — Produire de quoi manger', 'SVT', '6e', 'Nourrir les hommes : la culture et l’élevage', '717c16fd-6375-5925-bcfe-3c304a806853'::uuid),
    ('82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Quiz — Des micro-organismes utiles, des micro-organismes à arrêter', 'SVT', '6e', 'La production et la conservation des aliments', 'ff409211-00a9-5662-a523-6db80fc7a6ec'::uuid),
    ('9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Quiz — Naître, grandir, se reproduire', 'SVT', '6e', 'Le développement et la reproduction des êtres vivants', '2d349f75-cd94-5c66-8dbf-3a8898aa1a57'::uuid),
    ('b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Quiz — La puberté et le début de la vie', 'SVT', '6e', 'Le développement et la reproduction des êtres humains', '2ba9ce4b-e54f-5f73-a060-f25f324233d4'::uuid)
  ) AS v(id, title, subject, grade_level, chapter, lesson_id)
  JOIN public.lessons l ON l.id = v.lesson_id
 WHERE NOT EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- 4. Questions -------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT v.id, v.quiz_id, v.question, v.kind, v.options, v.correct_index, v.explanation, v.position
  FROM (VALUES
    ('63f15dba-4440-5032-82d1-5abc485b3b5a'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'Quel est le point commun de tous les êtres vivants ?', 'mcq', '["Ils sont constitués de cellules","Ils ont un squelette","Ils se déplacent","Ils respirent de l’air"]'::jsonb, 0, 'La cellule est la plus petite unité capable de vivre.', 1),
    ('c23b5007-53e0-5ea5-adf4-34a1a0b0dec6'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'Quel élément contient l’information génétique de la cellule ?', 'mcq', '["Le noyau","La membrane","Le cytoplasme","La vacuole"]'::jsonb, 0, 'Il commande le fonctionnement cellulaire.', 2),
    ('e92bdc5b-943b-5307-af5e-ab410c15db73'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'Quel élément est présent dans la cellule végétale mais absent de la cellule animale ?', 'mcq', '["La paroi","Le noyau","La membrane","Le cytoplasme"]'::jsonb, 0, 'Les chloroplastes et la grande vacuole aussi.', 3),
    ('91f9406c-761d-5be2-b495-8aad7aaec7bf'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'Où se trouve la chlorophylle ?', 'mcq', '["Dans les chloroplastes","Dans le noyau","Dans la paroi","Dans la vacuole"]'::jsonb, 0, 'C’est le pigment vert de la photosynthèse.', 4),
    ('99f7f247-bd0b-50ca-bf33-4939842300c5'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'Comment appelle-t-on un être vivant formé d’une seule cellule ?', 'mcq', '["Unicellulaire","Pluricellulaire","Monocellulaire végétal","Acellulaire"]'::jsonb, 0, 'La bactérie et la paramécie en sont.', 5),
    ('275c060f-9ed6-5f8e-9697-9c7a897d1637'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'Quel instrument permet d’observer une cellule ?', 'mcq', '["Le microscope","La loupe seulement","Le télescope","L’œil nu suffit"]'::jsonb, 0, 'Une cellule mesure quelques centièmes de millimètre.', 6),
    ('e8e644f1-fd2d-50cb-a38c-126f23af853a'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'D’où provient toujours une cellule ?', 'mcq', '["De la division d’une cellule précédente","Elle apparaît spontanément","Du noyau seul","De la matière minérale"]'::jsonb, 0, 'C’est ainsi qu’on grandit et qu’on cicatrise.', 7),
    ('31a73c75-dfe1-5fc9-9514-3806b78f26b7'::uuid, '538eb86a-200a-5797-ba51-248b3c23d92e'::uuid, 'La cellule animale possède une paroi rigide.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Seule la cellule végétale en a une.', 8),
    ('874747e0-1d56-552e-a374-a8680f147bd7'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'Sur quoi repose la classification des êtres vivants ?', 'mcq', '["Sur les attributs qu’ils possèdent","Sur leur milieu de vie","Sur leur mode de déplacement","Sur leur taille"]'::jsonb, 0, 'On classe par ce qu’on a, pas par ce qu’on fait.', 1),
    ('fde1b98f-50f1-5c39-bcae-90c25a9ad599'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'Pourquoi la chauve-souris n’est-elle pas un oiseau ?', 'mcq', '["Elle a des poils et des mamelles","Elle vole la nuit","Elle est trop petite","Elle n’a pas de squelette"]'::jsonb, 0, 'Voler n’est pas un attribut de classification.', 2),
    ('6791221e-e08e-52c2-a7ae-acce2bcfdaf3'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'Combien de pattes possède un insecte ?', 'mcq', '["Six","Huit","Quatre","Dix"]'::jsonb, 0, 'Les arachnides en ont huit.', 3),
    ('72a388b0-76f5-5324-b667-d169807733d9'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'Qu’est-ce qu’une espèce ?', 'mcq', '["Des individus qui se reproduisent entre eux et donnent une descendance féconde","Des individus qui vivent au même endroit","Des individus de même taille","Des individus de même couleur"]'::jsonb, 0, 'C’est le critère de la fécondité de la descendance.', 4),
    ('e97d8f46-b3c3-5e4d-bf3f-2d3fa4568011'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'En combien de mots s’écrit un nom scientifique d’espèce ?', 'mcq', '["Deux, en latin","Un seul","Trois","Cela dépend du pays"]'::jsonb, 0, 'Homo sapiens, Canis lupus.', 5),
    ('096e487d-8841-5ec5-9196-7f21f875522d'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'Que possèdent les arthropodes ?', 'mcq', '["Un squelette externe et des pattes articulées","Un squelette interne","Des vertèbres","Une coquille toujours"]'::jsonb, 0, 'Insectes, arachnides et crustacés en font partie.', 6),
    ('83a0b945-50a8-52c5-80bf-78a92a0bba67'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'Que signifie le partage d’attributs entre deux espèces ?', 'mcq', '["Elles ont un ancêtre commun","Elles vivent au même endroit","Elles ont la même taille","Elles se nourrissent pareil"]'::jsonb, 0, 'La classification raconte une histoire de parenté.', 7),
    ('fa00edff-36c8-571a-89ce-e9dcce56dbb7'::uuid, '3e0892ff-0c29-529f-baff-b955a76f608a'::uuid, 'On classe les êtres vivants d’après leur milieu de vie.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'On les classe d’après leurs attributs.', 8),
    ('de5bbbe9-84d2-5f3a-8699-bb56d105927b'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Qu’est-ce qu’un fossile ?', 'mcq', '["Un reste ou une trace d’un être vivant du passé conservé dans la roche","Une pierre de forme animale","Un animal très ancien encore vivant","Un minéral rare"]'::jsonb, 0, 'Os, coquilles, empreintes et terriers en sont.', 1),
    ('ea731099-8088-5dbe-8222-dd6329c8a09f'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Comment date-t-on relativement des couches de roche ?', 'mcq', '["Plus la couche est profonde, plus elle est ancienne","Plus elle est profonde, plus elle est récente","Par leur couleur","Par leur épaisseur seule"]'::jsonb, 0, 'Les couches se déposent les unes sur les autres.', 2),
    ('1f37224b-779c-5348-b69d-0af65715a44e'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Depuis combien de temps la vie existe-t-elle sur Terre ?', 'mcq', '["Environ 3,8 milliards d’années","Environ 66 millions d’années","Environ 300 000 ans","Environ 3,8 millions d’années"]'::jsonb, 0, 'Les dinosaures, eux, ont disparu il y a 66 millions d’années.', 3),
    ('a0bbe801-62a4-5ffa-bc43-685d829098e2'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Comment une espèce se transforme-t-elle au fil du temps ?', 'mcq', '["Les individus les mieux adaptés laissent plus de descendants","Chaque individu s’adapte durant sa vie","Toutes les espèces changent au même rythme","Le milieu modifie directement les caractères"]'::jsonb, 0, 'La transformation se joue sur des milliers de générations.', 4),
    ('eb49556f-e633-56e7-900a-090d3d1daaa4'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Quel événement a eu lieu il y a 66 millions d’années ?', 'mcq', '["Une extinction de masse, dont celle des dinosaures non-aviens","L’apparition de la vie","L’apparition de l’humain","La formation de la Terre"]'::jsonb, 0, 'Les mammifères s’y sont ensuite diversifiés.', 5),
    ('4a8db0f1-b3bb-55af-9448-5d1a38c3891d'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Qu’est-ce que la biodiversité ?', 'mcq', '["La variété du vivant","Le nombre d’animaux domestiques","La surface des forêts","La diversité des roches"]'::jsonb, 0, 'Elle diminue sous l’effet des activités humaines.', 6),
    ('5f8d7190-ca2b-59d1-b444-5dcb3166f4aa'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Que sont devenues la plupart des espèces ayant existé sur Terre ?', 'mcq', '["Elles se sont éteintes","Elles vivent encore","Elles ont fusionné","Elles se sont fossilisées vivantes"]'::jsonb, 0, 'Les espèces actuelles sont une petite part du total.', 7),
    ('ebac7847-a261-5147-9787-dde74b26c20b'::uuid, '88d7ed7d-62ae-5121-a423-2025eb4d476e'::uuid, 'Les espèces vivantes sont fixes et ne changent pas.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Elles apparaissent, se transforment et disparaissent.', 8),
    ('c451bea9-4179-5cf8-9210-2e61d5ef3129'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'Quel nutriment est le carburant principal de l’organisme ?', 'mcq', '["Les glucides","Les lipides","Les protides","Les vitamines"]'::jsonb, 0, 'Pain, pâtes et riz en apportent.', 1),
    ('9833d18c-7446-512e-b7c8-68cb51d8e656'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'Quels nutriments servent de matériaux de construction du corps ?', 'mcq', '["Les protides","Les glucides","Les lipides","Les fibres"]'::jsonb, 0, 'Viande, poisson, œufs et légumineuses en contiennent.', 2),
    ('f8592cdb-2977-5f7c-a005-98c469450c8e'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'Quelle proportion du corps humain l’eau représente-t-elle ?', 'mcq', '["Environ 60 %","Environ 20 %","Environ 90 %","Environ 40 %"]'::jsonb, 0, 'C’est le constituant le plus abondant.', 3),
    ('2b4b3cf6-3d9d-5d06-aa63-1892d76a4212'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'Où les nutriments passent-ils dans le sang ?', 'mcq', '["Dans l’intestin grêle","Dans l’estomac","Dans la bouche","Dans le gros intestin"]'::jsonb, 0, 'C’est l’absorption intestinale.', 4),
    ('dff5a16a-7f93-5924-85fc-2cd41410ef9f'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'À quoi sert la digestion ?', 'mcq', '["À réduire les aliments en nutriments assez petits pour passer dans le sang","À détruire les microbes","À produire de la chaleur","À fabriquer des vitamines"]'::jsonb, 0, 'Les aliments entiers ne peuvent pas traverser la paroi intestinale.', 5),
    ('5ea2e0dc-a13e-5aae-97c3-336c23bfcdaa'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'À quoi servent les fibres ?', 'mcq', '["À faire fonctionner l’intestin","À apporter de l’énergie","À construire les muscles","À fixer le calcium"]'::jsonb, 0, 'Elles ne sont pas des nutriments à proprement parler.', 6),
    ('ed62842a-4398-51cb-a31d-271b5d827dfa'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'Qu’apportent les vitamines et les minéraux ?', 'mcq', '["Des éléments indispensables en très petite quantité","La majeure partie de l’énergie","Les matériaux de construction","Rien d’essentiel"]'::jsonb, 0, 'Le calcium et le fer en sont des exemples.', 7),
    ('8de64d59-ad0d-5108-966c-337b5b65c67e'::uuid, '5e14a992-1248-5af6-b0ac-c3373245b41e'::uuid, 'Un seul aliment peut couvrir tous les besoins de l’organisme.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Il faut varier son alimentation.', 8),
    ('1b188667-4cc9-5950-a230-a11f7eb703ea'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'De quoi tout organe a-t-il besoin en permanence ?', 'mcq', '["De dioxygène et de nutriments","De dioxyde de carbone","D’urée","De fibres"]'::jsonb, 0, 'Le sang les lui apporte.', 1),
    ('91465121-eaab-58c8-a632-3a807d6c3d14'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Quel est le rôle du sang ?', 'mcq', '["Apporter dioxygène et nutriments, emporter les déchets","Produire l’énergie","Digérer les aliments","Filtrer l’urine"]'::jsonb, 0, 'Le cœur le met en mouvement.', 2),
    ('f3061c5a-9ffc-5c98-bd3a-4da235198b57'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Où le dioxygène passe-t-il de l’air dans le sang ?', 'mcq', '["Dans les alvéoles pulmonaires","Dans la trachée","Dans le nez","Dans le cœur"]'::jsonb, 0, 'Leur paroi est extrêmement fine.', 3),
    ('2df644b9-3428-5ba2-84de-034c7a2f7de5'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Comment appelle-t-on la réaction qui libère l’énergie dans les organes ?', 'mcq', '["La respiration cellulaire","La digestion","La photosynthèse","L’absorption"]'::jsonb, 0, 'Elle consomme nutriments et dioxygène.', 4),
    ('3adc1862-8034-5ef7-8fa0-c00bcfb518da'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Quel déchet les poumons évacuent-ils ?', 'mcq', '["Le dioxyde de carbone","L’urée","Le glucose","Le dioxygène"]'::jsonb, 0, 'Les reins évacuent l’urée dans l’urine.', 5),
    ('031b9b62-da90-5736-aa5a-108cf3a07af4'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Quel organe filtre le sang et fabrique l’urine ?', 'mcq', '["Le rein","Le foie","Le poumon","L’estomac"]'::jsonb, 0, 'Il élimine l’urée.', 6),
    ('8079db93-4f10-50c3-a599-4a41d05b2ef8'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Que se passe-t-il pendant un effort physique ?', 'mcq', '["Le rythme cardiaque et la respiration augmentent","Le cœur ralentit","La respiration s’arrête","Le sang cesse de circuler vers les muscles"]'::jsonb, 0, 'Les muscles consomment davantage.', 7),
    ('a6e72d9a-8f0c-51e2-a6fe-a37c081afd5d'::uuid, '6cba21bc-f687-54b6-b014-52ca6939685f'::uuid, 'Les organes produisent des déchets que le sang emporte.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Dioxyde de carbone et urée notamment.', 8),
    ('cf17d56f-9173-5bb7-8902-0a4a83b58cd4'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'De quoi une plante verte a-t-elle besoin pour produire sa matière ?', 'mcq', '["Lumière, eau, dioxyde de carbone et sels minéraux","De matière organique du sol","D’animaux","De dioxygène seulement"]'::jsonb, 0, 'C’est la photosynthèse.', 1),
    ('70c264e3-506a-583b-aa1a-703528d98415'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Comment qualifie-t-on une plante verte dans une chaîne alimentaire ?', 'mcq', '["Productrice primaire","Consommatrice","Décomposeuse","Prédatrice"]'::jsonb, 0, 'Elle produit sa matière au lieu de la consommer.', 2),
    ('efc27423-7616-5328-a200-a97ea61d30db'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Pourquoi apporte-t-on des engrais aux cultures ?', 'mcq', '["Parce que les cultures prélèvent les sels minéraux du sol","Pour donner de la couleur aux plantes","Pour remplacer la lumière","Pour tuer les insectes"]'::jsonb, 0, 'La rotation des cultures aide aussi.', 3),
    ('80c8ff73-ac5e-510f-a860-9e44a649887e'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Qu’est-ce que la rotation des cultures ?', 'mcq', '["Alterner les espèces cultivées pour ménager le sol","Retourner la terre chaque année","Faire tourner les machines agricoles","Changer d’exploitation"]'::jsonb, 0, 'Elle limite l’appauvrissement du sol.', 4),
    ('3f16176c-7672-593a-a847-b53a80f523ce'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Pourquoi produire de la viande coûte-t-il plus de ressources ?', 'mcq', '["Une grande partie de l’énergie est perdue à chaque maillon de la chaîne alimentaire","Les animaux sont plus lourds","La viande se conserve mal","Les élevages sont plus petits"]'::jsonb, 0, 'Il faut cultiver des végétaux pour nourrir l’animal.', 5),
    ('95a90f8e-c79f-57ea-a704-b6709b070bcd'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Quel est un inconvénient de l’agriculture intensive ?', 'mcq', '["La pollution par les engrais et les pesticides","Des rendements trop faibles","L’absence de mécanisation","Le manque de surfaces"]'::jsonb, 0, 'Elle réduit aussi la biodiversité.', 6),
    ('5363709c-0315-59f6-8dc1-26055bea7470'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Quelle part de la nourriture produite est gaspillée ?', 'mcq', '["Environ un tiers","Environ un dixième","Environ la moitié","Presque rien"]'::jsonb, 0, 'Le gaspillage est un levier majeur.', 7),
    ('b0a7bd9a-8bc0-5638-8c1e-875a07b2544b'::uuid, '07575dd6-5d9a-5dea-832c-0cf5e1f42e35'::uuid, 'Une plante verte se nourrit en absorbant de la matière organique du sol.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Elle fabrique sa propre matière par photosynthèse.', 8),
    ('6f29a495-001a-537e-9f4c-8636eabe6dc3'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Grâce à quoi le pain lève-t-il ?', 'mcq', '["À la levure, qui produit du dioxyde de carbone","Au sel","Au froid","À la cuisson seule"]'::jsonb, 0, 'C’est une fermentation.', 1),
    ('eb564eaa-5e61-56cd-892e-71956aeb1bce'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'De quoi les micro-organismes ont-ils besoin pour se multiplier ?', 'mcq', '["De chaleur, d’eau et de nutriments","De froid et de sel","De lumière","De vide"]'::jsonb, 0, 'Conserver consiste à leur retirer l’un des trois.', 2),
    ('96548b03-cf44-5294-948d-52d133452313'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Que fait le froid aux micro-organismes ?', 'mcq', '["Il ralentit ou arrête leur multiplication sans les tuer","Il les tue tous","Il les nourrit","Il n’a aucun effet"]'::jsonb, 0, 'C’est la chaleur qui les détruit.', 3),
    ('0718de84-5809-5ef7-97f7-c4ae05fcd47b'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Quelle technique élimine les micro-organismes au-delà de 100 °C ?', 'mcq', '["La stérilisation","La pasteurisation","La congélation","Le séchage"]'::jsonb, 0, 'C’est le principe de la conserve.', 4),
    ('f31adcb7-c22b-5083-8334-190498410fa9'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Comment le sel et le sucre conservent-ils les aliments ?', 'mcq', '["Ils rendent l’eau indisponible pour les micro-organismes","Ils tuent les micro-organismes par contact","Ils refroidissent l’aliment","Ils apportent des nutriments"]'::jsonb, 0, 'Jambon sec et confiture en sont des exemples.', 5),
    ('ef621c2b-f97d-5b21-8fe3-4f81694c694e'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Que signifie la DLC sur une étiquette ?', 'mcq', '["Une date à ne pas dépasser, sur les produits frais","Une simple baisse de qualité après la date","La date de fabrication","La date de livraison"]'::jsonb, 0, 'La DDM, elle, signale une baisse de qualité.', 6),
    ('766d1975-3e32-52b8-959e-75c6e94edfaa'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Quels aliments viennent d’une fermentation par des bactéries ?', 'mcq', '["Le yaourt et le fromage","Les pâtes et le riz","Les fruits secs","Les conserves"]'::jsonb, 0, 'Elles transforment le lait.', 7),
    ('f78f622b-de9a-5a27-a33f-8ed0ef36fa25'::uuid, '82791e19-a27c-59fa-827f-aea49b66f24e'::uuid, 'Un produit décongelé peut être recongelé sans risque.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Les micro-organismes ont repris leur multiplication pendant la décongélation.', 8),
    ('b59a28a4-75b6-56df-82bb-aa1c79d2d2b7'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Comment appelle-t-on la rencontre d’un spermatozoïde et d’un ovule ?', 'mcq', '["La fécondation","La pollinisation","La métamorphose","La germination"]'::jsonb, 0, 'Elle donne une cellule-œuf.', 1),
    ('8e4e9d35-979e-5cf6-b1c1-02778786cfec'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Quelle est la première cellule d’un nouvel être vivant ?', 'mcq', '["La cellule-œuf","L’ovule","Le spermatozoïde","La larve"]'::jsonb, 0, 'Elle naît de la fécondation.', 2),
    ('bb6b144f-8354-54e1-938e-f4971b44f2e2'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Que produit une reproduction asexuée ?', 'mcq', '["Des descendants identiques au parent","Des descendants tous différents","Une cellule-œuf","Une métamorphose"]'::jsonb, 0, 'Bouturage, division bactérienne, stolons.', 3),
    ('01162e67-c1b3-59f7-b3e7-bff427a834dc'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Qu’est-ce qu’un développement indirect ?', 'mcq', '["Le jeune est une larve qui se transforme par métamorphose","Le jeune ressemble à l’adulte en plus petit","Le jeune naît adulte","Il n’y a pas de jeune"]'::jsonb, 0, 'Têtard → grenouille, chenille → papillon.', 4),
    ('8deeb0cf-7e55-5235-8c8b-32975616cc72'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Qu’est-ce que la pollinisation ?', 'mcq', '["Le transport du pollen jusqu’au pistil","La formation du fruit","La germination de la graine","La dispersion des graines"]'::jsonb, 0, 'Elle est assurée par le vent ou les insectes.', 5),
    ('5514c390-6bb3-5f70-88fb-28dc1438c9b3'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Que devient l’ovaire de la fleur après la fécondation ?', 'mcq', '["Un fruit","Une graine","Une racine","Une feuille"]'::jsonb, 0, 'L’ovule, lui, devient une graine.', 6),
    ('2e7c9162-25b7-5354-8fcb-6b7e15599849'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'Pourquoi les poissons produisent-ils beaucoup de cellules reproductrices ?', 'mcq', '["La fécondation est externe et peu de descendants survivent","Ils vivent longtemps","Leurs œufs sont très gros","Ils se reproduisent une seule fois"]'::jsonb, 0, 'La fécondation interne protège mieux, avec moins de descendants.', 7),
    ('7b3495a9-bcc2-53bc-ab7f-8d8f95f6c0bc'::uuid, '9b06a4ce-a503-554b-834c-b46cc0aee56a'::uuid, 'La reproduction sexuée produit des descendants identiques entre eux.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'C’est la reproduction asexuée qui fabrique des copies.', 8),
    ('8ac2a9d3-8f8b-5cfb-99d6-f71a20b3f2f4'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Qu’est-ce que la puberté ?', 'mcq', '["Le passage de l’enfance à l’âge adulte","La naissance","La fin de la croissance","Le début de la grossesse"]'::jsonb, 0, 'Elle commence en général entre 10 et 15 ans.', 1),
    ('a1cdcdc6-2ab9-5d0d-bba3-ff031d7c2a74'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Que signale l’apparition des premières règles ?', 'mcq', '["Qu’un ovule est libéré chaque mois par les ovaires","Qu’une grossesse a commencé","Que la croissance est terminée","Qu’il y a une maladie"]'::jsonb, 0, 'C’est le début du fonctionnement des ovaires.', 2),
    ('313ab2ff-a1b4-5c3d-8a0f-7af129a033ac'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Où a lieu la fécondation chez l’être humain ?', 'mcq', '["Dans une trompe","Dans l’utérus","Dans un ovaire","Dans le placenta"]'::jsonb, 0, 'La cellule-œuf migre ensuite vers l’utérus.', 3),
    ('6fd302db-c978-5dba-bcac-4aee673ba2f9'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Comment appelle-t-on la fixation de l’embryon dans l’utérus ?', 'mcq', '["La nidation","La fécondation","L’ovulation","L’accouchement"]'::jsonb, 0, 'Elle suit les premières divisions de la cellule-œuf.', 4),
    ('463a4bbf-6b1f-5b4f-b5d5-9e5f50e20f78'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Quel est le rôle du cordon ombilical ?', 'mcq', '["Apporter dioxygène et nutriments au fœtus et évacuer ses déchets","Protéger le fœtus des chocs","Fabriquer les cellules du fœtus","Déclencher l’accouchement"]'::jsonb, 0, 'Il relie le fœtus au placenta.', 5),
    ('3a02f439-8283-5435-a2b7-c80e956fcee3'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Combien de temps dure environ une grossesse ?', 'mcq', '["9 mois","6 mois","12 mois","3 mois"]'::jsonb, 0, 'Elle se termine par l’accouchement.', 6),
    ('6f83ec21-1ba4-561c-82bf-e5500138dcdc'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'Quel moyen de contraception protège aussi des infections sexuellement transmissibles ?', 'mcq', '["Le préservatif","La pilule","Le stérilet","Aucun"]'::jsonb, 0, 'C’est ce qui lui donne une place à part.', 7),
    ('f40ef5b4-2b2a-582c-8b01-182419a1af41'::uuid, 'b03020b4-c6a1-5d5a-9122-8013d23a29d2'::uuid, 'La puberté commence exactement au même âge pour tout le monde.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'L’âge varie beaucoup, et cette variation est normale.', 8)
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
   WHERE s.slug IN ('svt');
  SELECT count(*) INTO n_vides FROM public.subjects s
   WHERE s.slug IN ('svt')
     AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.subject_id = s.id);
  IF n_vides > 0 THEN
    RAISE EXCEPTION 'Migration 327 incomplète : % matiere(s) encore sans chapitre', n_vides;
  END IF;
  RAISE NOTICE 'Migration 327 OK : % chapitres sur les matieres visees.', n_chap;
END $$;
