-- =============================================================================
-- Studuel — Migration 103 : CONTENU Latin 5e (cours + carte mentale + quiz)
-- Remplit les 3 chapitres de Latin 5e (initiation, année 1) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons de Latin 5e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Premiers pas : les déclinaisons', $md$# Premiers pas : les déclinaisons

## Ce que tu vas comprendre
En français, c'est **la place** du mot dans la phrase qui indique sa fonction. En latin, c'est **la terminaison** du mot qui change ! Faire varier la fin d'un mot selon sa fonction s'appelle **décliner**. Ce chapitre t'apprend la notion de **cas** et la **1re déclinaison**.

## 1. Une langue à terminaisons
En latin, on peut changer l'ordre des mots sans changer le sens : ce qui compte, c'est la **désinence** (la terminaison) de chaque mot.

- *Puella rosam amat.* → La jeune fille aime la rose.
- *Rosam puella amat.* → La jeune fille aime la rose (même sens !).

Le mot **puella** (« la jeune fille ») reste le sujet, et **rosam** (« la rose ») reste le complément, quel que soit l'ordre.

## 2. La notion de cas
Un **cas** est la forme que prend un mot selon sa **fonction** dans la phrase. Il y a cinq cas principaux :

- **Nominatif** : c'est le **sujet**. *Rosa* pulchra est → **La rose** est belle.
- **Accusatif** : c'est le **COD**. Video *rosam* → Je vois **la rose**.
- **Génitif** : le **complément du nom** (idée de « de »). Color *rosae* → La couleur **de la rose**.
- **Datif** : le **COI** (idée de « à, pour »).
- **Ablatif** : les **compléments circonstanciels** (idée de « avec, par, dans »).

## 3. La 1re déclinaison (les mots en -a)
De nombreux noms féminins se terminent par **-a** au nominatif singulier, comme **rosa, rosae** (la rose). Voici comment on les décline :

| Cas | Singulier | Pluriel |
|---|---|---|
| Nominatif | ros**a** | ros**ae** |
| Accusatif | ros**am** | ros**as** |
| Génitif | ros**ae** | ros**arum** |
| Datif | ros**ae** | ros**is** |
| Ablatif | ros**a** | ros**is** |

## 4. Le radical et le dictionnaire
Dans un dictionnaire, un nom est donné avec son **nominatif**, son **génitif** et son **genre** : *rosa, ae, f.* (féminin). Le **radical** (ros-) s'obtient en enlevant la terminaison **-ae** du génitif : on lui ajoute ensuite les terminaisons du tableau.

## L'essentiel à retenir
- En latin, la **terminaison** (et non la place) indique la fonction du mot : c'est la **déclinaison**.
- Les cinq cas : **nominatif** (sujet), **accusatif** (COD), **génitif** (de), **datif** (à/pour), **ablatif** (avec/par).
- La **1re déclinaison** regroupe les mots féminins en **-a** (rosa, rosae).
- Le **génitif** sert à trouver le **radical** et à reconnaître la déclinaison.$md$),

    ('La vie quotidienne à Rome', $md$# La vie quotidienne à Rome

## Ce que tu vas comprendre
Comment vivaient les Romains il y a deux mille ans ? Ce chapitre te fait découvrir leur **maison**, leur **famille**, leurs **repas**, leurs **vêtements** et le **déroulement d'une journée** dans la Rome antique.

## 1. La maison : la domus
La riche famille romaine habite une **domus** (une grande maison). On y trouve :
- l'**atrium** : la pièce centrale, avec une ouverture dans le toit (le *compluvium*) et un bassin au sol (l'*impluvium*) qui recueille l'eau de pluie ;
- le **tablinum** (le bureau du maître) et le **triclinium** (la salle à manger).

Le peuple, lui, s'entasse souvent dans de grands immeubles appelés **insulae**.

## 2. La famille romaine
La famille est dirigée par le **pater familias**, le père, chef tout-puissant : il a autorité sur sa femme, ses enfants et ses **esclaves** (*servi*). La mère, la **mater familias**, dirige la maison et l'éducation des jeunes enfants. Les esclaves accomplissent la plupart des tâches de la maison.

## 3. Les repas
Les Romains font trois repas :
- le **ientaculum** : le petit-déjeuner, léger, au lever ;
- le **prandium** : un déjeuner rapide vers midi ;
- la **cena** : le grand repas du soir, le plus important.

Lors des banquets, les convives **s'allongent** sur des lits de table autour d'une table basse, dans le triclinium. Au menu : pain, légumes, olives, poisson, viande, et le fameux **garum** (une sauce de poisson).

## 4. Les vêtements
- La **tunica** (tunique) est le vêtement de base, porté par tous.
- Par-dessus, le citoyen romain drape la **toga** (la toge), longue pièce de laine blanche : c'est le signe qu'on est **citoyen romain**.
- Les femmes portent la **stola**, une longue robe.

## 5. La journée d'un Romain
Le Romain se lève **tôt**, salue ses protecteurs le matin (la *salutatio*), travaille ou s'occupe des affaires publiques au **forum**, déjeune légèrement, puis se rend souvent aux **thermes** (les bains publics) l'après-midi, avant la **cena** du soir.

## L'essentiel à retenir
- La riche famille habite la **domus** (atrium, triclinium…) ; le peuple, dans les **insulae**.
- Le **pater familias** est le chef tout-puissant de la famille romaine.
- Trois repas : *ientaculum*, *prandium* et surtout la **cena** (le soir), pris **allongé**.
- Le vêtement du citoyen est la **toge** (*toga*) ; la tunique (*tunica*) est portée par tous.$md$),

    ('La fondation de Rome', $md$# La fondation de Rome

## Ce que tu vas comprendre
Comment la ville de Rome a-t-elle commencé ? Les Romains racontaient une **légende** célèbre, celle de Romulus et Remus. Ce chapitre te fait découvrir ce récit, sa date fondatrice, et la différence entre **mythe** et **histoire**.

## 1. Deux jumeaux abandonnés
Selon la légende, **Romulus** et **Remus** (*Romulus et Remus*) sont des **frères jumeaux**, fils du dieu de la guerre **Mars** (*Mars*) et de la princesse Rhéa Silvia. Un roi jaloux ordonne de les abandonner sur le **Tibre**, le fleuve de Rome, dans un panier.

## 2. La louve
Le panier échoue sur une rive. Là, une **louve** (*lupa*) recueille les deux bébés et les **allaite**, avant qu'un berger ne les élève. La louve allaitant les jumeaux est devenue le **symbole de Rome**.

## 3. La fondation, en 753 av. J.-C.
Devenus adultes, les jumeaux décident de **fonder une ville** à l'endroit où ils avaient été sauvés. Mais ils se disputent pour savoir qui régnera : **Romulus tue son frère Remus** et devient le **premier roi**. Il donne son nom à la ville : **Rome** (*Roma*). La tradition fixe cette fondation à l'année **753 avant Jésus-Christ**.

## 4. Mythe ou histoire ?
Cette histoire est un **mythe** (une **légende**), pas un fait prouvé : la louve, le dieu Mars, les jumeaux relèvent du récit merveilleux. Les archéologues, eux, montrent que Rome est née peu à peu du regroupement de villages sur des **collines** au bord du Tibre. Le mythe servait à donner à Rome une origine **glorieuse** et **divine**.

## L'essentiel à retenir
- La légende : **Romulus et Remus**, jumeaux fils de **Mars**, abandonnés sur le **Tibre**.
- Une **louve** (*lupa*) les allaite : c'est le symbole de Rome.
- **Romulus** tue Remus, fonde **Rome** et en devient le premier roi, en **753 av. J.-C.**
- C'est un **mythe** : la ville est en réalité née du regroupement de villages ; le récit donne à Rome une origine divine.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'latin'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Premiers pas : les déclinaisons', $json${
      "centre": "Les déclinaisons",
      "branches": [
        { "titre": "Une langue à terminaisons", "enfants": ["La fin du mot = sa fonction", "L'ordre des mots est libre", "Décliner = changer la terminaison"] },
        { "titre": "Les cas", "enfants": ["Nominatif = sujet", "Accusatif = COD", "Génitif (de), Datif (à), Ablatif (avec)"] },
        { "titre": "1re déclinaison (-a)", "enfants": ["rosa, rosae (la rose)", "Noms féminins en -a", "rosa / rosam / rosae…"] },
        { "titre": "Radical et dictionnaire", "enfants": ["rosa, ae, f.", "Radical = génitif sans -ae", "Le génitif donne la déclinaison"] }
      ]
    }$json$),
    ('La vie quotidienne à Rome', $json${
      "centre": "La vie quotidienne à Rome",
      "branches": [
        { "titre": "La maison", "enfants": ["La domus (riches)", "Atrium, triclinium", "Insulae (le peuple)"] },
        { "titre": "La famille", "enfants": ["Pater familias = chef", "Mater familias", "Les esclaves (servi)"] },
        { "titre": "Les repas", "enfants": ["ientaculum, prandium", "La cena (le soir)", "On mange allongé"] },
        { "titre": "Vêtements et journée", "enfants": ["Toga = citoyen", "Tunica pour tous", "Forum puis thermes"] }
      ]
    }$json$),
    ('La fondation de Rome', $json${
      "centre": "La fondation de Rome",
      "branches": [
        { "titre": "Les jumeaux", "enfants": ["Romulus et Remus", "Fils du dieu Mars", "Abandonnés sur le Tibre"] },
        { "titre": "La louve", "enfants": ["Une lupa les allaite", "Élevés par un berger", "Symbole de Rome"] },
        { "titre": "753 av. J.-C.", "enfants": ["Romulus tue Remus", "Fonde Rome (Roma)", "Premier roi"] },
        { "titre": "Mythe ou histoire ?", "enfants": ["Récit légendaire", "En vrai : villages sur les collines", "Origine glorieuse et divine"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'latin'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ce bloc ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Latin', '5e', v.chapter, true, l.id
FROM (VALUES
  ('10319999-0000-4000-8000-000000000001'::uuid, 'Premiers pas : les déclinaisons'),
  ('10319999-0000-4000-8000-000000000002'::uuid, 'La vie quotidienne à Rome'),
  ('10319999-0000-4000-8000-000000000003'::uuid, 'La fondation de Rome')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'latin'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
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
  -- Chapitre 1 — Premiers pas : les déclinaisons
  ('10310000-0000-4000-8000-000000000104'::uuid, 'Premiers pas : les déclinaisons',
   'En latin, que signifie « décliner » un mot ?', 'mcq',
   '["Changer sa terminaison selon sa fonction", "Le prononcer plus fort", "Le placer en début de phrase", "Le traduire en français"]', 0,
   'Décliner, c''est faire varier la terminaison (désinence) d''un mot selon sa fonction dans la phrase.', 4),
  ('10310000-0000-4000-8000-000000000105'::uuid, 'Premiers pas : les déclinaisons',
   'À quel cas met-on le sujet d''une phrase latine ?', 'mcq',
   '["Le nominatif", "L''accusatif", "Le génitif", "L''ablatif"]', 0,
   'Le sujet se met au nominatif : « Rosa pulchra est » → la rose est belle.', 5),
  ('10310000-0000-4000-8000-000000000106'::uuid, 'Premiers pas : les déclinaisons',
   'Dans « Video rosam » (je vois la rose), à quel cas est « rosam » ?', 'mcq',
   '["L''accusatif (COD)", "Le nominatif (sujet)", "Le datif (COI)", "Le génitif (de)"]', 0,
   '« Rosam » est le complément d''objet direct : le COD se met à l''accusatif.', 6),
  ('10310000-0000-4000-8000-000000000107'::uuid, 'Premiers pas : les déclinaisons',
   'En latin, c''est la place du mot dans la phrase qui indique toujours sa fonction, comme en français.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : en latin, c''est la terminaison (la déclinaison) qui indique la fonction, pas la place du mot.', 7),
  ('10310000-0000-4000-8000-000000000108'::uuid, 'Premiers pas : les déclinaisons',
   'Quelle est la terminaison du génitif singulier de « rosa » ?', 'mcq',
   '["-ae (rosae)", "-am (rosam)", "-arum (rosarum)", "-is (rosis)"]', 0,
   'Au génitif singulier, rosa devient « rosae ». Le génitif sert aussi à trouver le radical.', 8),
  ('10310000-0000-4000-8000-000000000109'::uuid, 'Premiers pas : les déclinaisons',
   'Un nom de la 1re déclinaison se termine par quoi au nominatif singulier ?', 'mcq',
   '["-a", "-us", "-um", "-em"]', 0,
   'Les noms de la 1re déclinaison (souvent féminins) se terminent en -a : rosa, puella…', 9),
  ('10310000-0000-4000-8000-000000000110'::uuid, 'Premiers pas : les déclinaisons',
   'Le génitif exprime le complément du nom (idée de « de »).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : « color rosae » = la couleur de la rose. Le génitif traduit l''idée de « de ».', 10),

  -- Chapitre 2 — La vie quotidienne à Rome
  ('10310000-0000-4000-8000-000000000204'::uuid, 'La vie quotidienne à Rome',
   'Comment appelle-t-on la grande maison d''une riche famille romaine ?', 'mcq',
   '["La domus", "L''insula", "Le forum", "Les thermes"]', 0,
   'La domus est la grande maison des familles aisées ; le peuple vivait dans les insulae.', 4),
  ('10310000-0000-4000-8000-000000000205'::uuid, 'La vie quotidienne à Rome',
   'Quel vêtement, longue pièce de laine drapée, était le signe du citoyen romain ?', 'mcq',
   '["La toge (toga)", "La tunique (tunica)", "La stola", "Le péplum"]', 0,
   'La toge (toga) était portée par-dessus la tunique : c''était le vêtement du citoyen romain.', 5),
  ('10310000-0000-4000-8000-000000000206'::uuid, 'La vie quotidienne à Rome',
   'Le « pater familias » est le chef tout-puissant de la famille romaine.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le pater familias avait autorité sur sa femme, ses enfants et ses esclaves.', 6),
  ('10310000-0000-4000-8000-000000000207'::uuid, 'La vie quotidienne à Rome',
   'Comment s''appelle le grand repas du soir, le plus important chez les Romains ?', 'mcq',
   '["La cena", "Le ientaculum", "Le prandium", "Le garum"]', 0,
   'La cena est le repas principal, pris le soir. Le ientaculum est le petit-déjeuner, le prandium le déjeuner.', 7),
  ('10310000-0000-4000-8000-000000000208'::uuid, 'La vie quotidienne à Rome',
   'Qu''est-ce que l''atrium dans la domus ?', 'mcq',
   '["La pièce centrale, ouverte sur le toit", "La cuisine", "La chambre des esclaves", "Le jardin de derrière"]', 0,
   'L''atrium est la pièce centrale ; son ouverture dans le toit (compluvium) laisse tomber l''eau dans un bassin (impluvium).', 8),
  ('10310000-0000-4000-8000-000000000209'::uuid, 'La vie quotidienne à Rome',
   'Lors des banquets, les Romains mangeaient assis sur des chaises, comme nous.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : lors des banquets, les convives étaient allongés sur des lits de table dans le triclinium.', 9),
  ('10310000-0000-4000-8000-000000000210'::uuid, 'La vie quotidienne à Rome',
   'Où les Romains se rendaient-ils souvent l''après-midi pour se laver et se détendre ?', 'mcq',
   '["Aux thermes", "Au forum", "Dans l''atrium", "À la curie"]', 0,
   'Les thermes étaient les bains publics : on s''y lavait et on s''y retrouvait entre amis.', 10),

  -- Chapitre 3 — La fondation de Rome
  ('10310000-0000-4000-8000-000000000304'::uuid, 'La fondation de Rome',
   'Selon la légende, qui a fondé la ville de Rome ?', 'mcq',
   '["Romulus", "Remus", "Mars", "Jules César"]', 0,
   'C''est Romulus qui fonde Rome et lui donne son nom, après avoir tué son frère Remus.', 4),
  ('10310000-0000-4000-8000-000000000305'::uuid, 'La fondation de Rome',
   'Quel animal a recueilli et allaité Romulus et Remus, selon la légende ?', 'mcq',
   '["Une louve (lupa)", "Une chèvre", "Un aigle", "Une ourse"]', 0,
   'Une louve (lupa) allaite les jumeaux : elle est devenue le symbole de Rome.', 5),
  ('10310000-0000-4000-8000-000000000306'::uuid, 'La fondation de Rome',
   'En quelle année la tradition situe-t-elle la fondation de Rome ?', 'mcq',
   '["753 av. J.-C.", "753 apr. J.-C.", "476 av. J.-C.", "1000 av. J.-C."]', 0,
   'La tradition romaine fixe la fondation de Rome à l''année 753 avant Jésus-Christ.', 6),
  ('10310000-0000-4000-8000-000000000307'::uuid, 'La fondation de Rome',
   'Romulus et Remus étaient des frères jumeaux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la légende raconte que Romulus et Remus étaient jumeaux, fils du dieu Mars.', 7),
  ('10310000-0000-4000-8000-000000000308'::uuid, 'La fondation de Rome',
   'Comment Romulus est-il devenu le seul roi de Rome ?', 'mcq',
   '["En tuant son frère Remus", "En gagnant une élection", "En épousant une reine", "En battant les Grecs"]', 0,
   'Les jumeaux se disputent : Romulus tue Remus et devient le premier roi de Rome.', 8),
  ('10310000-0000-4000-8000-000000000309'::uuid, 'La fondation de Rome',
   'L''histoire de la louve et des jumeaux est un fait historique prouvé par les archéologues.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : c''est un mythe. En réalité, Rome est née peu à peu du regroupement de villages sur des collines.', 9),
  ('10310000-0000-4000-8000-000000000310'::uuid, 'La fondation de Rome',
   'De quel dieu Romulus et Remus étaient-ils les fils, selon la légende ?', 'mcq',
   '["Mars, le dieu de la guerre", "Jupiter, le roi des dieux", "Neptune, le dieu de la mer", "Apollon, le dieu du soleil"]', 0,
   'Selon la légende, les jumeaux étaient les fils de Mars, le dieu de la guerre.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'latin'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
