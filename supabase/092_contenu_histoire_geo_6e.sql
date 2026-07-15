-- =============================================================================
-- Studuel — Migration 092 : CONTENU Histoire-Géo 6e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres d'Histoire-Géo 6e (programme cycle 3, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 086/090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 029 (mind_map), 002 (quizzes).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La longue histoire de l''humanité', $md$# La longue histoire de l'humanité

## Ce que tu vas comprendre
La Préhistoire, c'est la très longue période qui va de l'apparition des premiers êtres humains jusqu'à l'invention de l'**écriture** (vers **3300 av. J.-C.**). Ce chapitre te fait découvrir comment nos ancêtres ont vécu, puis comment la **révolution néolithique** a tout changé.

## 1. Aux origines de l'humanité
Les premiers humains apparaissent en **Afrique** il y a environ **3 millions d'années**. Peu à peu, ils se déplacent et **peuplent la Terre entière** : c'est une histoire de migrations très longues.

*Repère : *Homo sapiens* (l'espèce à laquelle nous appartenons) apparaît il y a environ 300 000 ans.*

## 2. Les hommes de la Préhistoire : chasseurs et nomades
Pendant le **Paléolithique** (l'« âge de la pierre taillée »), les humains sont :
- des **chasseurs-cueilleurs** : ils chassent, pêchent et ramassent des plantes ;
- **nomades** : ils se déplacent pour suivre le gibier ;
- des inventeurs : ils maîtrisent le **feu** et taillent des outils en **pierre**.

Ils laissent aussi de magnifiques **peintures rupestres**, comme dans la grotte de **Lascaux** (en Dordogne).

## 3. La révolution néolithique
Vers **10 000 av. J.-C.**, au Proche-Orient, une grande transformation commence : le **Néolithique** (l'« âge de la pierre polie »). Les humains :
- inventent l'**agriculture** (ils cultivent des céréales) ;
- pratiquent l'**élevage** (ils domestiquent des animaux) ;
- deviennent **sédentaires** : ils construisent des **villages** et arrêtent de se déplacer.

> **À retenir :** en produisant leur nourriture, les humains n'ont plus seulement à la chercher : c'est une véritable **révolution**.

## 4. De nouvelles inventions
La sédentarité entraîne de nombreux progrès : la **poterie**, le **tissage**, puis plus tard le travail des **métaux**. Les surplus de nourriture permettent à des populations plus nombreuses de vivre ensemble : ce sont les débuts des futures **cités**.

## L'essentiel à retenir
- La Préhistoire va des premiers humains (en Afrique) à l'invention de l'écriture (v. 3300 av. J.-C.).
- Au **Paléolithique**, les humains sont des **chasseurs-cueilleurs nomades** qui maîtrisent le feu.
- Au **Néolithique**, ils inventent l'**agriculture** et l'**élevage** et deviennent **sédentaires**.
- Cette « **révolution néolithique** » fait naître les villages et prépare les premières cités.$md$),

    ('Premiers États, premières écritures', $md$# Premiers États, premières écritures

## Ce que tu vas comprendre
Vers **3300 av. J.-C.**, dans deux grandes régions du Proche-Orient — la **Mésopotamie** et l'**Égypte** — naissent les **premières cités**, les **premiers États** et la **première écriture**. C'est le début de l'Histoire.

## 1. La Mésopotamie, « entre deux fleuves »
La **Mésopotamie** (l'actuel Irak) se situe entre deux grands fleuves, le **Tigre** et l'**Euphrate**. Leurs crues rendent la terre fertile. Là apparaissent les premières grandes **cités-États** comme **Ur** et **Uruk**, dirigées par un **roi**.

## 2. La naissance de l'écriture
Vers **3300 av. J.-C.**, les Mésopotamiens inventent l'**écriture cunéiforme** : des signes en forme de **coins** tracés dans des **tablettes d'argile** avec un roseau taillé (le calame).

*Au départ, l'écriture sert surtout à **compter** et à noter les **échanges** (combien de sacs de grain, de troupeaux…).*

## 3. L'Égypte des pharaons
Le long du **Nil**, se développe la brillante civilisation de l'**Égypte ancienne**. À sa tête, un roi tout-puissant, le **pharaon**, considéré comme un dieu vivant. Les Égyptiens écrivent avec les **hiéroglyphes**, des signes en forme de dessins.

## 4. Une société organisée et des croyances
Ces premiers États sont **hiérarchisés** : au sommet le roi, puis les prêtres et les scribes, enfin le peuple (paysans, artisans). Les Égyptiens sont **polythéistes** (ils croient en plusieurs dieux) et construisent d'immenses tombeaux pour leurs pharaons : les **pyramides** (comme à Gizeh).

> **À retenir :** l'écriture est un outil de **pouvoir** : elle permet à l'État de gérer, de compter et de garder une mémoire.

## L'essentiel à retenir
- Les premières cités et le premier État naissent en **Mésopotamie** (entre le Tigre et l'Euphrate) et en **Égypte** (le long du Nil).
- L'**écriture** apparaît vers **3300 av. J.-C.** : **cunéiforme** en Mésopotamie, **hiéroglyphes** en Égypte.
- Ces sociétés sont **hiérarchisées**, dirigées par un **roi** (le **pharaon** en Égypte).
- L'invention de l'écriture marque le **début de l'Histoire**.$md$),

    ('Rome : du mythe à l''histoire', $md$# Rome : du mythe à l'histoire

## Ce que tu vas comprendre
Rome n'a pas toujours été un immense empire. Ce chapitre distingue le **mythe** (la légende de sa fondation) et l'**histoire** (ce que montrent les traces réelles), puis explique comment Rome passe de la **République** à l'**Empire**.

## 1. Le mythe de la fondation (753 av. J.-C.)
La légende raconte que Rome fut fondée en **753 av. J.-C.** par **Romulus**, qui aurait tué son frère **Rémus**. Bébés, les jumeaux auraient été sauvés et nourris par une **louve**.

*C'est un **mythe** : une histoire racontée par les Romains pour donner un passé glorieux à leur cité. L'archéologie confirme cependant que Rome est bien née au VIIIᵉ siècle av. J.-C., sur les bords du **Tibre**.*

## 2. La République romaine
À partir de **509 av. J.-C.**, Rome devient une **République** : il n'y a plus de roi. Le pouvoir est partagé :
- des magistrats élus, les **consuls**, gouvernent pour un an ;
- le **Sénat**, assemblée de nobles, conseille et dirige ;
- le mot « République » vient du latin *res publica*, « la chose publique ».

Durant la République, Rome **conquiert** peu à peu tout le pourtour de la **mer Méditerranée**.

## 3. De la République à l'Empire
Les conquêtes rendent Rome immense mais provoquent des crises. En **27 av. J.-C.**, **Auguste** devient le **premier empereur** : c'est le début de l'**Empire romain**. L'empereur détient désormais tous les pouvoirs.

## 4. La paix romaine et la romanisation
L'Empire connaît une longue période de paix, la *Pax romana*. Partout on construit des **routes**, des **aqueducs**, des **thermes**, des **amphithéâtres**. Les peuples conquis adoptent la langue **latine** et le mode de vie romain : c'est la **romanisation**.

## L'essentiel à retenir
- La fondation de Rome (**753 av. J.-C.**, Romulus et la louve) est un **mythe**, distinct de l'**histoire** prouvée par l'archéologie.
- En **509 av. J.-C.**, Rome devient une **République** (consuls, Sénat), sans roi.
- En **27 av. J.-C.**, **Auguste** devient le **premier empereur** : début de l'**Empire**.
- La **romanisation** diffuse la langue latine et le mode de vie romain autour de la Méditerranée.$md$),

    ('Habiter une métropole', $md$# Habiter une métropole

## Ce que tu vas comprendre
Aujourd'hui, plus de la moitié des humains vivent en **ville**. Ce chapitre de géographie explique ce qu'est une **métropole**, comment on y habite, et pourquoi les métropoles des pays riches et des pays pauvres ne se ressemblent pas toujours.

## 1. Qu'est-ce qu'une métropole ?
Une **métropole** est une très grande ville qui **concentre** beaucoup d'habitants et de fonctions importantes : elle **commande** un territoire.

On y trouve :
- des **fonctions de commandement** (sièges d'entreprises, banques, pouvoir politique) ;
- de nombreux **services** (universités, hôpitaux, musées, gares, aéroports).

*Exemples : **Paris**, **Tokyo**, **New York**, **Lagos**, **Mumbai**…*

## 2. Habiter, se déplacer dans la métropole
Habiter une métropole, c'est y **loger**, y **travailler**, s'y **déplacer** et s'y **divertir**. Chaque jour, des millions de personnes font la **navette** entre leur logement et leur travail : ce sont les **migrations pendulaires**.

Pour se déplacer, on utilise les **transports en commun** (métro, bus, train, tramway) qui limitent les embouteillages et la pollution.

## 3. Une organisation en plusieurs espaces
Une métropole s'organise souvent ainsi :
- le **centre-ville** (souvent ancien, avec les commerces et les bureaux) ;
- les **quartiers d'affaires** (grandes tours, comme La Défense à Paris) ;
- la **banlieue** et la **périphérie**, où l'on trouve logements, zones commerciales et industrielles.

L'ensemble ville + banlieues forme une **aire urbaine**.

## 4. Des métropoles très différentes
Toutes les métropoles ne se ressemblent pas :
- dans les pays **riches**, quartiers modernes et transports développés dominent ;
- dans les pays **pauvres**, la croissance très rapide crée parfois des **bidonvilles** (quartiers d'habitat précaire) et des inégalités fortes.

## L'essentiel à retenir
- Une **métropole** est une grande ville qui **concentre** habitants, activités et fonctions de **commandement**.
- On y habite en logeant, travaillant et se **déplaçant** (transports en commun, migrations pendulaires).
- Elle s'organise en **centre-ville**, **quartiers d'affaires** et **banlieues** (l'ensemble = **aire urbaine**).
- Les métropoles des pays riches et des pays pauvres présentent de fortes **inégalités** (ex. bidonvilles).$md$),

    ('Habiter les littoraux', $md$# Habiter les littoraux

## Ce que tu vas comprendre
Un **littoral** est la zone de contact entre la **terre** et la **mer**. Ce sont des espaces très attractifs où les humains sont de plus en plus nombreux. Ce chapitre distingue deux grandes façons d'habiter les littoraux : **industrialo-portuaire** et **touristique**.

## 1. Le littoral, un espace convoité
Le **littoral** attire les populations : aujourd'hui, une grande partie de l'humanité vit près des côtes. On y travaille, on y échange, on s'y détend. Cette forte présence humaine s'appelle la **littoralisation**.

## 2. Le littoral industrialo-portuaire
Certains littoraux sont d'abord des lieux de **production** et d'**échanges** :
- un grand **port** accueille d'immenses **porte-conteneurs** ;
- une **zone industrialo-portuaire (ZIP)** regroupe usines, raffineries et entrepôts près de l'eau.

Ces ports relient le territoire au **commerce mondial**.

*Exemples : le port de **Shanghai** (le plus grand du monde), **Rotterdam**, **Le Havre**, **Marseille**.*

## 3. Le littoral touristique
D'autres littoraux vivent surtout du **tourisme** : on vient y profiter de la **plage**, du **soleil** et de la mer. On y construit des **hôtels**, des **ports de plaisance**, des résidences.

Le tourisme apporte de l'argent et des emplois, mais entraîne aussi une forte **urbanisation** des côtes (la « bétonisation ») et de fortes variations selon les **saisons**.

## 4. Des espaces fragiles à protéger
Habiter les littoraux crée des **risques** et des **pressions** sur la nature :
- **pollution** de l'eau et des plages, disparition d'espaces naturels ;
- risques liés à la mer (tempêtes, **montée des eaux**).

Il faut donc **aménager** et **protéger** ces espaces pour un développement plus **durable**.

## L'essentiel à retenir
- Un **littoral** est la zone de contact entre la terre et la mer ; il est très **attractif** (littoralisation).
- Le littoral **industrialo-portuaire** vit du **port** et de l'**industrie** (ZIP, porte-conteneurs, commerce mondial).
- Le littoral **touristique** vit de la **plage**, du **soleil** et des activités de loisirs.
- Ces espaces sont **fragiles** : pollution, urbanisation et risques imposent de les **protéger**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La longue histoire de l''humanité', $json${
      "centre": "La longue histoire de l'humanité",
      "branches": [
        { "titre": "Les origines", "enfants": ["Premiers humains en Afrique", "Il y a ~3 millions d'années", "Peuplement de la Terre"] },
        { "titre": "Paléolithique", "enfants": ["Chasseurs-cueilleurs", "Nomades", "Maîtrise du feu, Lascaux"] },
        { "titre": "Révolution néolithique", "enfants": ["Agriculture et élevage", "Sédentaires : villages", "Vers 10 000 av. J.-C."] },
        { "titre": "Nouvelles inventions", "enfants": ["Poterie, tissage", "Travail des métaux", "Vers les premières cités"] }
      ]
    }$json$),
    ('Premiers États, premières écritures', $json${
      "centre": "Premiers États, premières écritures",
      "branches": [
        { "titre": "Mésopotamie", "enfants": ["Entre Tigre et Euphrate", "Cités Ur et Uruk", "Dirigées par un roi"] },
        { "titre": "L'écriture", "enfants": ["Vers 3300 av. J.-C.", "Cunéiforme sur argile", "Compter et échanger"] },
        { "titre": "Égypte", "enfants": ["Le long du Nil", "Le pharaon, dieu vivant", "Hiéroglyphes, pyramides"] },
        { "titre": "Une société organisée", "enfants": ["Hiérarchisée", "Roi, prêtres, scribes, peuple", "Polythéisme"] }
      ]
    }$json$),
    ('Rome : du mythe à l''histoire', $json${
      "centre": "Rome : du mythe à l'histoire",
      "branches": [
        { "titre": "Le mythe", "enfants": ["Fondation en 753 av. J.-C.", "Romulus et Rémus", "La louve, le Tibre"] },
        { "titre": "La République", "enfants": ["Depuis 509 av. J.-C.", "Consuls et Sénat", "Conquête de la Méditerranée"] },
        { "titre": "L'Empire", "enfants": ["Auguste en 27 av. J.-C.", "Premier empereur", "Tous les pouvoirs"] },
        { "titre": "La romanisation", "enfants": ["Pax romana", "Routes, aqueducs, thermes", "Langue latine partout"] }
      ]
    }$json$),
    ('Habiter une métropole', $json${
      "centre": "Habiter une métropole",
      "branches": [
        { "titre": "Qu'est-ce qu'une métropole ?", "enfants": ["Concentre habitants et activités", "Fonctions de commandement", "Paris, Tokyo, Lagos"] },
        { "titre": "Habiter, se déplacer", "enfants": ["Loger, travailler, se divertir", "Migrations pendulaires", "Transports en commun"] },
        { "titre": "L'organisation", "enfants": ["Centre-ville", "Quartiers d'affaires", "Banlieues = aire urbaine"] },
        { "titre": "Des métropoles différentes", "enfants": ["Pays riches : modernes", "Pays pauvres : bidonvilles", "Fortes inégalités"] }
      ]
    }$json$),
    ('Habiter les littoraux', $json${
      "centre": "Habiter les littoraux",
      "branches": [
        { "titre": "Un espace convoité", "enfants": ["Contact terre et mer", "De plus en plus d'habitants", "La littoralisation"] },
        { "titre": "Industrialo-portuaire", "enfants": ["Grand port, porte-conteneurs", "Zone industrialo-portuaire (ZIP)", "Shanghai, Le Havre"] },
        { "titre": "Touristique", "enfants": ["Plage et soleil", "Hôtels, ports de plaisance", "Urbanisation saisonnière"] },
        { "titre": "Des espaces fragiles", "enfants": ["Pollution, bétonisation", "Montée des eaux", "Protéger : durable"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'histoire-geo'
 WHERE c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 030/033-036 ont déjà créé les quiz 6e ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Histoire-Géo', '6e', v.chapter, true, l.id
FROM (VALUES
  ('09219999-0000-4000-8000-000000000001'::uuid, 'La longue histoire de l''humanité'),
  ('09219999-0000-4000-8000-000000000002'::uuid, 'Premiers États, premières écritures'),
  ('09219999-0000-4000-8000-000000000003'::uuid, 'Rome : du mythe à l''histoire'),
  ('09219999-0000-4000-8000-000000000004'::uuid, 'Habiter une métropole'),
  ('09219999-0000-4000-8000-000000000005'::uuid, 'Habiter les littoraux')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3b. Questions supplémentaires (positions 4→10), attachées au quiz DE LA LEÇON
--     via la jointure leçon→quiz (donc au quiz existant, quel que soit son id).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Chapitre 1 — La longue histoire de l'humanité
  ('09210000-0000-4000-8000-000000000104'::uuid, 'La longue histoire de l''humanité',
   'Sur quel continent apparaissent les premiers êtres humains ?', 'mcq',
   '["L''Afrique", "L''Europe", "L''Asie", "L''Amérique"]', 0,
   'Les premiers humains apparaissent en Afrique il y a environ 3 millions d''années.', 4),
  ('09210000-0000-4000-8000-000000000105'::uuid, 'La longue histoire de l''humanité',
   'Comment vivaient les humains du Paléolithique ?', 'mcq',
   '["Chasseurs-cueilleurs nomades", "Agriculteurs sédentaires", "Ouvriers d''usine", "Marchands des villes"]', 0,
   'Au Paléolithique, les humains sont des chasseurs-cueilleurs qui se déplacent (nomades).', 5),
  ('09210000-0000-4000-8000-000000000106'::uuid, 'La longue histoire de l''humanité',
   'Qu''inventent les humains pendant la révolution néolithique ?', 'mcq',
   '["L''agriculture et l''élevage", "L''écriture cunéiforme", "La monnaie", "L''imprimerie"]', 0,
   'Au Néolithique, les humains inventent l''agriculture et l''élevage et deviennent sédentaires.', 6),
  ('09210000-0000-4000-8000-000000000107'::uuid, 'La longue histoire de l''humanité',
   'Au Néolithique, les humains deviennent sédentaires et construisent des villages.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La sédentarisation (vivre au même endroit, en villages) est une conséquence de l''agriculture.', 7),
  ('09210000-0000-4000-8000-000000000108'::uuid, 'La longue histoire de l''humanité',
   'La grotte de Lascaux est célèbre pour :', 'mcq',
   '["Ses peintures rupestres", "Ses pyramides", "Son amphithéâtre", "Son port"]', 0,
   'Lascaux, en Dordogne, abrite de célèbres peintures rupestres du Paléolithique.', 8),
  ('09210000-0000-4000-8000-000000000109'::uuid, 'La longue histoire de l''humanité',
   'La Préhistoire se termine avec l''invention de l''écriture.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La Préhistoire s''achève vers 3300 av. J.-C. avec l''apparition de l''écriture.', 9),
  ('09210000-0000-4000-8000-000000000110'::uuid, 'La longue histoire de l''humanité',
   'Quelle invention marque une grande maîtrise dès le Paléolithique ?', 'mcq',
   '["Le feu", "La roue à eau", "La boussole", "Le télescope"]', 0,
   'La maîtrise du feu est une conquête essentielle des humains du Paléolithique.', 10),

  -- Chapitre 2 — Premiers États, premières écritures
  ('09210000-0000-4000-8000-000000000204'::uuid, 'Premiers États, premières écritures',
   'Entre quels deux fleuves se situe la Mésopotamie ?', 'mcq',
   '["Le Tigre et l''Euphrate", "Le Nil et le Tibre", "Le Rhône et la Loire", "Le Gange et l''Indus"]', 0,
   'Mésopotamie signifie « entre deux fleuves » : le Tigre et l''Euphrate.', 4),
  ('09210000-0000-4000-8000-000000000205'::uuid, 'Premiers États, premières écritures',
   'Vers quelle date apparaît l''écriture ?', 'mcq',
   '["Vers 3300 av. J.-C.", "Vers 753 av. J.-C.", "Vers l''an 1000", "Vers 27 av. J.-C."]', 0,
   'L''écriture apparaît en Mésopotamie vers 3300 av. J.-C. : c''est le début de l''Histoire.', 5),
  ('09210000-0000-4000-8000-000000000206'::uuid, 'Premiers États, premières écritures',
   'Comment appelle-t-on l''écriture inventée en Mésopotamie ?', 'mcq',
   '["Le cunéiforme", "Les hiéroglyphes", "L''alphabet latin", "Les idéogrammes"]', 0,
   'Les Mésopotamiens écrivent en cunéiforme (signes en forme de coins) sur des tablettes d''argile.', 6),
  ('09210000-0000-4000-8000-000000000207'::uuid, 'Premiers États, premières écritures',
   'Le long de quel fleuve se développe la civilisation égyptienne ?', 'mcq',
   '["Le Nil", "L''Euphrate", "Le Tibre", "Le Rhin"]', 0,
   'L''Égypte ancienne se développe le long du Nil, dont les crues fertilisent les terres.', 7),
  ('09210000-0000-4000-8000-000000000208'::uuid, 'Premiers États, premières écritures',
   'Comment appelle-t-on le roi d''Égypte ?', 'mcq',
   '["Le pharaon", "Le consul", "L''empereur", "Le sénateur"]', 0,
   'Le pharaon dirige l''Égypte ; il est considéré comme un dieu vivant.', 8),
  ('09210000-0000-4000-8000-000000000209'::uuid, 'Premiers États, premières écritures',
   'Les Égyptiens écrivaient avec des hiéroglyphes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les hiéroglyphes sont l''écriture de l''Égypte ancienne, faite de signes en forme de dessins.', 9),
  ('09210000-0000-4000-8000-000000000210'::uuid, 'Premiers États, premières écritures',
   'À quoi servait surtout l''écriture au début ?', 'mcq',
   '["À compter et noter les échanges", "À écrire des romans", "À envoyer des lettres d''amour", "À faire de la publicité"]', 0,
   'L''écriture sert d''abord à compter (grain, troupeaux) et à noter les échanges.', 10),

  -- Chapitre 3 — Rome : du mythe à l'histoire
  ('09210000-0000-4000-8000-000000000304'::uuid, 'Rome : du mythe à l''histoire',
   'En quelle année la légende place-t-elle la fondation de Rome ?', 'mcq',
   '["753 av. J.-C.", "509 av. J.-C.", "27 av. J.-C.", "3300 av. J.-C."]', 0,
   'Selon le mythe, Rome est fondée en 753 av. J.-C. par Romulus.', 4),
  ('09210000-0000-4000-8000-000000000305'::uuid, 'Rome : du mythe à l''histoire',
   'Selon la légende, qui a fondé Rome ?', 'mcq',
   '["Romulus", "Auguste", "Jules César", "Rémus seul"]', 0,
   'La légende raconte que Romulus fonde Rome après avoir tué son frère Rémus.', 5),
  ('09210000-0000-4000-8000-000000000306'::uuid, 'Rome : du mythe à l''histoire',
   'D''après le mythe, quel animal aurait nourri Romulus et Rémus ?', 'mcq',
   '["Une louve", "Un aigle", "Un cheval", "Un taureau"]', 0,
   'Bébés, les jumeaux auraient été sauvés et nourris par une louve.', 6),
  ('09210000-0000-4000-8000-000000000307'::uuid, 'Rome : du mythe à l''histoire',
   'En 509 av. J.-C., Rome devient une République.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À partir de 509 av. J.-C., Rome n''a plus de roi : c''est la République (consuls, Sénat).', 7),
  ('09210000-0000-4000-8000-000000000308'::uuid, 'Rome : du mythe à l''histoire',
   'Sous la République, quels magistrats élus gouvernaient Rome ?', 'mcq',
   '["Les consuls", "Les pharaons", "Les empereurs", "Les scribes"]', 0,
   'Deux consuls, élus pour un an, gouvernent la République ; le Sénat les conseille.', 8),
  ('09210000-0000-4000-8000-000000000309'::uuid, 'Rome : du mythe à l''histoire',
   'Qui devient le premier empereur de Rome en 27 av. J.-C. ?', 'mcq',
   '["Auguste", "Romulus", "Rémus", "Néron"]', 0,
   'En 27 av. J.-C., Auguste devient le premier empereur : c''est le début de l''Empire.', 9),
  ('09210000-0000-4000-8000-000000000310'::uuid, 'Rome : du mythe à l''histoire',
   'Comment appelle-t-on la diffusion de la langue latine et du mode de vie romain ?', 'mcq',
   '["La romanisation", "La littoralisation", "La sédentarisation", "La colonisation grecque"]', 0,
   'La romanisation est l''adoption de la langue latine et du mode de vie romain par les peuples conquis.', 10),

  -- Chapitre 4 — Habiter une métropole
  ('09210000-0000-4000-8000-000000000404'::uuid, 'Habiter une métropole',
   'Qu''est-ce qu''une métropole ?', 'mcq',
   '["Une très grande ville qui concentre habitants et activités", "Un petit village de campagne", "Une usine isolée", "Une île déserte"]', 0,
   'Une métropole est une grande ville qui concentre habitants, activités et fonctions de commandement.', 4),
  ('09210000-0000-4000-8000-000000000405'::uuid, 'Habiter une métropole',
   'Lequel de ces exemples est une grande métropole mondiale ?', 'mcq',
   '["Tokyo", "Un hameau de montagne", "Une plage déserte", "Une ferme isolée"]', 0,
   'Tokyo, comme Paris ou New York, est une grande métropole mondiale.', 5),
  ('09210000-0000-4000-8000-000000000406'::uuid, 'Habiter une métropole',
   'Comment appelle-t-on les trajets quotidiens entre domicile et travail ?', 'mcq',
   '["Les migrations pendulaires", "Les vacances", "La romanisation", "Les crues"]', 0,
   'Les migrations pendulaires sont les allers-retours quotidiens domicile-travail.', 6),
  ('09210000-0000-4000-8000-000000000407'::uuid, 'Habiter une métropole',
   'Les transports en commun aident à limiter les embouteillages et la pollution.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Métro, bus, tramway et train permettent de déplacer beaucoup de monde en polluant moins.', 7),
  ('09210000-0000-4000-8000-000000000408'::uuid, 'Habiter une métropole',
   'Comment appelle-t-on l''ensemble formé par une ville et ses banlieues ?', 'mcq',
   '["Une aire urbaine", "Un littoral", "Une cité-État", "Un empire"]', 0,
   'L''aire urbaine regroupe la ville-centre et les communes de banlieue qui en dépendent.', 8),
  ('09210000-0000-4000-8000-000000000409'::uuid, 'Habiter une métropole',
   'Dans certaines métropoles des pays pauvres, on trouve des quartiers d''habitat très précaire appelés :', 'mcq',
   '["Des bidonvilles", "Des quartiers d''affaires", "Des ports de plaisance", "Des thermes"]', 0,
   'La croissance urbaine très rapide crée parfois des bidonvilles, marqués par de fortes inégalités.', 9),
  ('09210000-0000-4000-8000-000000000410'::uuid, 'Habiter une métropole',
   'Où trouve-t-on souvent les grandes tours de bureaux d''une métropole ?', 'mcq',
   '["Dans le quartier d''affaires", "Dans un champ", "Sur une plage", "Dans une grotte"]', 0,
   'Le quartier d''affaires (comme La Défense à Paris) regroupe les grandes tours de bureaux.', 10),

  -- Chapitre 5 — Habiter les littoraux
  ('09210000-0000-4000-8000-000000000504'::uuid, 'Habiter les littoraux',
   'Qu''est-ce qu''un littoral ?', 'mcq',
   '["La zone de contact entre la terre et la mer", "Une chaîne de montagnes", "Le centre d''un continent", "Un grand désert"]', 0,
   'Le littoral est l''espace où la terre et la mer se rencontrent.', 4),
  ('09210000-0000-4000-8000-000000000505'::uuid, 'Habiter les littoraux',
   'Comment appelle-t-on la concentration des populations près des côtes ?', 'mcq',
   '["La littoralisation", "La romanisation", "La sédentarisation", "La pollution"]', 0,
   'La littoralisation désigne l''installation croissante des humains sur les littoraux.', 5),
  ('09210000-0000-4000-8000-000000000506'::uuid, 'Habiter les littoraux',
   'Un littoral industrialo-portuaire vit surtout du tourisme balnéaire.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un littoral industrialo-portuaire vit du port et de l''industrie ; le tourisme concerne les littoraux touristiques.', 6),
  ('09210000-0000-4000-8000-000000000507'::uuid, 'Habiter les littoraux',
   'Quels navires transportent les marchandises dans un grand port ?', 'mcq',
   '["Les porte-conteneurs", "Les pédalos", "Les gondoles", "Les kayaks"]', 0,
   'Les immenses porte-conteneurs relient les ports au commerce mondial.', 7),
  ('09210000-0000-4000-8000-000000000508'::uuid, 'Habiter les littoraux',
   'Quel est le principal atout d''un littoral touristique ?', 'mcq',
   '["La plage et le soleil", "Les raffineries", "Les usines", "Les entrepôts"]', 0,
   'Le littoral touristique attire pour sa plage, son soleil et ses activités de loisirs.', 8),
  ('09210000-0000-4000-8000-000000000509'::uuid, 'Habiter les littoraux',
   'Quel est le plus grand port du monde, cité en exemple ?', 'mcq',
   '["Shanghai", "Le Havre", "Marseille", "Bordeaux"]', 0,
   'Shanghai, en Chine, est le plus grand port de commerce du monde.', 9),
  ('09210000-0000-4000-8000-000000000510'::uuid, 'Habiter les littoraux',
   'Les littoraux sont des espaces fragiles qu''il faut protéger.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Pollution, bétonisation et montée des eaux menacent les littoraux : il faut les aménager durablement.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'histoire-geo'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
