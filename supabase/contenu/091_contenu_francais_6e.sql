-- =============================================================================
-- Studuel — Migration 091 : CONTENU Français 6e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Français 6e (programme cycle 3, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
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
    ('Le conte merveilleux', $md$# Le conte merveilleux

## Ce que tu vas comprendre
Le **conte merveilleux** est un récit court qui se passe dans un monde imaginaire, où le surnaturel semble tout à fait normal. Ce chapitre t'apprend à reconnaître ce genre, son vocabulaire et sa construction.

## 1. Qu'est-ce qu'un conte merveilleux ?
Un conte merveilleux est une histoire **inventée**, transmise souvent à l'oral avant d'être écrite. On y trouve des **fées**, des **ogres**, des **animaux qui parlent**, des objets magiques. Le **merveilleux**, c'est justement ce surnaturel accepté sans étonnement.

*Exemples célèbres : « Cendrillon », « Le Petit Poucet », « La Belle au bois dormant » de Charles Perrault.*

## 2. Les personnages types
- Le **héros** ou l'**héroïne**, souvent jeune, pauvre ou malmené au départ.
- l'**adjuvant** : celui qui **aide** le héros (une fée, un animal reconnaissant).
- l'**opposant** : celui qui lui **nuit** (l'ogre, la marâtre, la sorcière).

## 3. La structure du conte (le schéma narratif)
Un conte suit presque toujours cinq étapes :
1. la **situation initiale** (« Il était une fois… ») ;
2. l'**élément perturbateur** qui lance l'aventure ;
3. les **péripéties** (les épreuves du héros) ;
4. l'**élément de résolution** ;
5. la **situation finale** (« Ils vécurent heureux… »).

## 4. Le temps du récit
Le conte est raconté au **passé** : l'**imparfait** pour les descriptions et le décor, le **passé simple** pour les actions.

*Exemple : « La forêt **était** sombre (imparfait) quand le loup **surgit** (passé simple). »*

## 5. La morale
Beaucoup de contes contiennent une **morale** : une leçon sur la vie (la ruse, le courage, la patience sont récompensés).

## L'essentiel à retenir
- Le conte merveilleux mêle le réel et le **surnaturel** accepté comme normal.
- Personnages types : **héros**, **adjuvant** (aide), **opposant** (nuit).
- Il suit le **schéma narratif** en 5 étapes (situation initiale → situation finale).
- On y emploie l'**imparfait** (décor) et le **passé simple** (actions).$md$),

    ('Récits d''aventures', $md$# Les récits d'aventures

## Ce que tu vas comprendre
Le **récit d'aventures** raconte les péripéties d'un héros confronté au danger, à l'inconnu, au voyage. Ce chapitre t'apprend à en repérer les ingrédients et le vocabulaire d'analyse.

## 1. Qu'est-ce qu'un récit d'aventures ?
C'est un récit qui met en scène un **héros** lancé dans une **quête** ou un **voyage** semé d'obstacles. Contrairement au conte, l'aventure se déroule le plus souvent dans un monde **réaliste** (îles, mers, jungles), même si tout est inventé.

*Exemples : « L'Île au trésor » de Stevenson, « Robinson Crusoé » de Defoe, « Le Tour du monde en 80 jours » de Jules Verne.*

## 2. Les ingrédients de l'aventure
- un **héros** courageux, curieux, débrouillard ;
- un **but** à atteindre (un trésor, une terre, un retour) ;
- des **obstacles** : tempêtes, ennemis, pièges ;
- un **cadre** exotique ou dangereux (la mer, la forêt, la montagne).

## 3. Le suspense et le rythme
L'auteur crée du **suspense** pour tenir le lecteur en haleine : phrases courtes dans l'action, **rebondissements**, dangers soudains. Le rythme s'accélère dans les moments d'action.

## 4. Le narrateur et le point de vue
Le récit peut être mené à la **première personne** (« je »), quand le héros raconte lui-même, ou à la **troisième personne** (« il ») par un narrateur extérieur.

*Exemple : « **Je** grimpai à l'échelle » (1re personne) ou « **Il** grimpa à l'échelle » (3e personne). »*

## 5. La description au service de l'action
Les **descriptions** de paysages ou de personnages plantent le décor et renforcent les émotions (peur, admiration, mystère). Elles utilisent des **adjectifs** et des comparaisons.

## L'essentiel à retenir
- Le récit d'aventures suit un **héros** en **quête** dans un cadre souvent réaliste mais dangereux.
- Ses ingrédients : un **but**, des **obstacles**, un **cadre** exotique.
- Le **suspense** et les **rebondissements** tiennent le lecteur en haleine.
- Le narrateur raconte à la **1re** (« je ») ou à la **3e** personne (« il »).$md$),

    ('Poésie : jeux de langage', $md$# Poésie : jeux de langage

## Ce que tu vas comprendre
La **poésie** joue avec les **sons**, les **images** et la **disposition** des mots pour créer des émotions. Ce chapitre te donne le vocabulaire pour lire et apprécier un poème.

## 1. Le vers et la strophe
Un poème est écrit en **vers** (des lignes) regroupés en **strophes** (des paragraphes de vers). Une strophe de 2 vers est un **distique**, de 3 un **tercet**, de 4 un **quatrain**.

## 2. Les rimes
La **rime** est la répétition d'un même son à la **fin** des vers.
- **rimes suivies** (AABB) ;
- **rimes croisées** (ABAB) ;
- **rimes embrassées** (ABBA).

*Exemple : « lune / brune » et « ciel / miel » : les sons de fin se répondent.*

## 3. Le rythme et les syllabes
On compte les **syllabes** d'un vers. Un vers de 8 syllabes est un **octosyllabe**, de 10 un **décasyllabe**, de 12 un **alexandrin**.

## 4. Les images poétiques
Le poète crée des **images** :
- la **comparaison** rapproche deux éléments avec un mot outil (comme, tel, pareil à) : « fort **comme** un lion » ;
- la **métaphore** rapproche sans mot outil : « une pluie de diamants » (pour la rosée).

## 5. Les jeux de sons
La poésie joue avec les sonorités : l'**allitération** répète des **consonnes** (« Pour qui sont ces serpents qui sifflent… »), l'**assonance** répète des **voyelles**.

## L'essentiel à retenir
- Un poème s'écrit en **vers** groupés en **strophes** (quatrain = 4 vers).
- Les **rimes** (suivies, croisées, embrassées) répètent un son en fin de vers.
- On compte les **syllabes** : octosyllabe (8), alexandrin (12).
- Les **images** (comparaison **avec** mot outil, métaphore **sans**) et les jeux de sons (allitération, assonance) créent l'émotion.$md$),

    ('Le groupe nominal et ses accords', $md$# Le groupe nominal et ses accords

## Ce que tu vas comprendre
Le **groupe nominal** (GN) est un ensemble de mots organisés autour d'un **nom**. Ce chapitre t'apprend à le repérer et à réaliser les **accords** sans erreur.

## 1. Le noyau du groupe nominal
Le mot principal du GN est le **nom noyau**. Autour de lui gravitent d'autres mots.

*Exemple : dans « le **chat** noir du voisin », le noyau est **chat**.*

## 2. Les composants du GN
- le **déterminant** (le, un, mon, ce, trois…) : il précède le nom ;
- l'**adjectif qualificatif** (noir, grand, joli…) : il précise le nom ;
- le **complément du nom** (« du voisin ») : introduit par une préposition (de, à, en…).

## 3. La chaîne des accords
Dans le GN, le **déterminant** et l'**adjectif** s'accordent en **genre** (masculin/féminin) et en **nombre** (singulier/pluriel) avec le nom noyau.

*Exemple : « une petite maison » → « des petit**es** maison**s** » (féminin pluriel).*

## 4. Le genre et le nombre
- Le **féminin** se marque souvent par un **-e** : un ami → une ami**e**.
- Le **pluriel** se marque souvent par un **-s** (ou **-x**) : un chat → des chat**s** ; un cheval → des chevau**x**.

## 5. Les pièges d'accord
Attention : l'adjectif s'accorde avec **le nom qu'il qualifie**, même s'il en est éloigné.

*Exemple : « Les fleurs du jardin sont **belles** » (belles s'accorde avec fleurs, pas avec jardin).*

## L'essentiel à retenir
- Le **groupe nominal** est organisé autour d'un **nom noyau**.
- Il se compose d'un **déterminant**, souvent d'**adjectifs** et parfois d'un **complément du nom**.
- Déterminant et adjectif s'**accordent** en **genre** et en **nombre** avec le nom.
- L'adjectif s'accorde avec le nom qu'il qualifie, même éloigné.$md$),

    ('Conjugaison : présent et imparfait', $md$# Conjugaison : présent et imparfait

## Ce que tu vas comprendre
Le **présent** et l'**imparfait** sont deux temps de l'indicatif très utilisés. Ce chapitre t'apprend à les conjuguer et à savoir quand les employer.

## 1. Le présent de l'indicatif
Le présent exprime une action qui se passe **au moment où l'on parle**, une **habitude** ou une **vérité générale**.

*Exemples : « Je **mange** » (maintenant), « Il **part** tous les matins » (habitude), « L'eau **bout** à 100 °C » (vérité générale).*

Terminaisons courantes :
- 1er groupe (chanter) : -e, -es, -e, -ons, -ez, -ent → « je chant**e** ».
- 2e groupe (finir) : -is, -is, -it, -issons, -issez, -issent → « je fin**is** ».
- 3e groupe : terminaisons variables (je **prends**, je **vais**, je **fais**).

## 2. L'imparfait de l'indicatif
L'imparfait exprime une action **passée** qui **dure**, une **habitude** dans le passé, ou une **description**.

*Exemples : « Il **pleuvait** » (décor), « Chaque été, nous **allions** à la mer » (habitude passée).*

Terminaisons, **les mêmes pour tous les verbes** :
**-ais, -ais, -ait, -ions, -iez, -aient**.
*Exemple : « je chant**ais**, nous chant**ions**, ils chant**aient** ».*

## 3. Présent ou imparfait ?
- **Présent** : ce qui se passe maintenant ou ce qui est toujours vrai.
- **Imparfait** : ce qui se passait avant, un décor, une habitude passée.

## 4. Les verbes fréquents à connaître
- **être** : présent « je suis », imparfait « j'étais ».
- **avoir** : présent « j'ai », imparfait « j'avais ».
- **aller** : présent « je vais », imparfait « j'allais ».

## L'essentiel à retenir
- Le **présent** dit ce qui se passe maintenant, une habitude ou une vérité générale.
- l'**imparfait** dit ce qui durait, une habitude passée ou une description.
- l'imparfait a **les mêmes terminaisons pour tous** : -ais, -ais, -ait, -ions, -iez, -aient.
- Connaître par cœur **être** (suis/étais) et **avoir** (ai/avais).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le conte merveilleux', $json${
      "centre": "Le conte merveilleux",
      "branches": [
        { "titre": "Le genre", "enfants": ["Récit imaginaire, oral puis écrit", "Le surnaturel accepté comme normal", "Fées, ogres, objets magiques"] },
        { "titre": "Les personnages", "enfants": ["Le héros (jeune, malmené)", "l'adjuvant qui aide", "l'opposant qui nuit"] },
        { "titre": "La structure", "enfants": ["Situation initiale (Il était une fois)", "Élément perturbateur, péripéties", "Résolution, situation finale"] },
        { "titre": "Langue et sens", "enfants": ["Imparfait pour le décor", "Passé simple pour les actions", "Une morale à la fin"] }
      ]
    }$json$),
    ('Récits d''aventures', $json${
      "centre": "Les récits d'aventures",
      "branches": [
        { "titre": "Le genre", "enfants": ["Un héros en quête ou en voyage", "Un monde souvent réaliste", "Île au trésor, Jules Verne"] },
        { "titre": "Les ingrédients", "enfants": ["Un but à atteindre", "Des obstacles (tempêtes, ennemis)", "Un cadre exotique, dangereux"] },
        { "titre": "Tenir en haleine", "enfants": ["Le suspense", "Les rebondissements", "Rythme rapide dans l'action"] },
        { "titre": "Le narrateur", "enfants": ["1re personne (je)", "3e personne (il)", "Descriptions au service de l'action"] }
      ]
    }$json$),
    ('Poésie : jeux de langage', $json${
      "centre": "Poésie : jeux de langage",
      "branches": [
        { "titre": "La forme", "enfants": ["Le vers (une ligne)", "La strophe (quatrain = 4 vers)", "Distique, tercet, quatrain"] },
        { "titre": "Les rimes", "enfants": ["Suivies (AABB)", "Croisées (ABAB)", "Embrassées (ABBA)"] },
        { "titre": "Le rythme", "enfants": ["On compte les syllabes", "Octosyllabe (8)", "Alexandrin (12)"] },
        { "titre": "Les images et sons", "enfants": ["Comparaison (avec comme)", "Métaphore (sans mot outil)", "Allitération, assonance"] }
      ]
    }$json$),
    ('Le groupe nominal et ses accords', $json${
      "centre": "Le groupe nominal",
      "branches": [
        { "titre": "Le noyau", "enfants": ["Le nom principal", "Les autres mots gravitent autour", "chat dans le chat noir"] },
        { "titre": "Les composants", "enfants": ["Le déterminant (le, un, ce)", "l'adjectif qualificatif", "Le complément du nom (du voisin)"] },
        { "titre": "Les accords", "enfants": ["En genre (masc./fém.)", "En nombre (sing./pluriel)", "Déterminant et adjectif s'accordent"] },
        { "titre": "Les marques et pièges", "enfants": ["Féminin souvent -e", "Pluriel souvent -s ou -x", "l'adjectif suit le nom qu'il qualifie"] }
      ]
    }$json$),
    ('Conjugaison : présent et imparfait', $json${
      "centre": "Présent et imparfait",
      "branches": [
        { "titre": "Le présent", "enfants": ["Action au moment où l'on parle", "Habitude, vérité générale", "1er groupe : -e, -es, -e…"] },
        { "titre": "l'imparfait", "enfants": ["Action passée qui dure", "Habitude passée, description", "Mêmes terminaisons pour tous"] },
        { "titre": "Terminaisons imparfait", "enfants": ["-ais, -ais, -ait", "-ions, -iez, -aient", "je chantais, ils chantaient"] },
        { "titre": "Verbes clés", "enfants": ["être : suis / étais", "avoir : ai / avais", "aller : vais / allais"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'francais'
 WHERE c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 030/033-036 ont déjà créé les quiz 6e ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Français', '6e', v.chapter, true, l.id
FROM (VALUES
  ('09119999-0000-4000-8000-000000000001'::uuid, 'Le conte merveilleux'),
  ('09119999-0000-4000-8000-000000000002'::uuid, 'Récits d''aventures'),
  ('09119999-0000-4000-8000-000000000003'::uuid, 'Poésie : jeux de langage'),
  ('09119999-0000-4000-8000-000000000004'::uuid, 'Le groupe nominal et ses accords'),
  ('09119999-0000-4000-8000-000000000005'::uuid, 'Conjugaison : présent et imparfait')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'francais'
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
  -- Chapitre 1 — Le conte merveilleux
  ('09110000-0000-4000-8000-000000000104'::uuid, 'Le conte merveilleux',
   'Dans un conte, comment appelle-t-on le personnage qui aide le héros ?', 'mcq',
   '["l''adjuvant", "l''opposant", "le narrateur", "le témoin"]', 0,
   'l''adjuvant aide le héros ; l''opposant, lui, cherche à lui nuire.', 4),
  ('09110000-0000-4000-8000-000000000105'::uuid, 'Le conte merveilleux',
   'Par quelle étape commence le schéma narratif d''un conte ?', 'mcq',
   '["La situation initiale", "Les péripéties", "l''élément de résolution", "La situation finale"]', 0,
   'Le conte s''ouvre sur la situation initiale (souvent « Il était une fois… »).', 5),
  ('09110000-0000-4000-8000-000000000106'::uuid, 'Le conte merveilleux',
   'Dans un conte, quel temps sert surtout à décrire le décor ?', 'mcq',
   '["l''imparfait", "Le passé simple", "Le futur", "l''impératif"]', 0,
   'l''imparfait sert au décor et aux descriptions ; le passé simple aux actions.', 6),
  ('09110000-0000-4000-8000-000000000107'::uuid, 'Le conte merveilleux',
   'Dans un conte merveilleux, le surnaturel étonne toujours les personnages.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le propre du merveilleux est que le surnaturel est accepté comme normal.', 7),
  ('09110000-0000-4000-8000-000000000108'::uuid, 'Le conte merveilleux',
   'Lequel de ces contes a été écrit par Charles Perrault ?', 'mcq',
   '["Le Petit Poucet", "L''Île au trésor", "Le Tour du monde en 80 jours", "Robinson Crusoé"]', 0,
   '« Le Petit Poucet » est un conte de Perrault ; les autres sont des récits d''aventures.', 8),
  ('09110000-0000-4000-8000-000000000109'::uuid, 'Le conte merveilleux',
   'Qu''est-ce que l''élément perturbateur dans un conte ?', 'mcq',
   '["Ce qui déclenche l''aventure", "La fin heureuse", "La description du héros", "La morale"]', 0,
   'l''élément perturbateur rompt l''équilibre initial et lance l''histoire.', 9),
  ('09110000-0000-4000-8000-000000000110'::uuid, 'Le conte merveilleux',
   'Beaucoup de contes se terminent par une leçon de vie appelée : ', 'mcq',
   '["une morale", "une rime", "une strophe", "une métaphore"]', 0,
   'La morale est la leçon que le conte veut transmettre.', 10),

  -- Chapitre 2 — Récits d'aventures
  ('09110000-0000-4000-8000-000000000204'::uuid, 'Récits d''aventures',
   'Qu''est-ce qui caractérise le mieux un récit d''aventures ?', 'mcq',
   '["Un héros lancé dans une quête pleine d''obstacles", "Un poème en vers", "Une liste de règles de grammaire", "Un dialogue de théâtre"]', 0,
   'Le récit d''aventures suit un héros en quête, confronté à des obstacles.', 4),
  ('09110000-0000-4000-8000-000000000205'::uuid, 'Récits d''aventures',
   'Quel procédé l''auteur utilise-t-il pour tenir le lecteur en haleine ?', 'mcq',
   '["Le suspense", "La rime", "l''accord du participe", "La strophe"]', 0,
   'Le suspense (et les rebondissements) maintient l''attention du lecteur.', 5),
  ('09110000-0000-4000-8000-000000000206'::uuid, 'Récits d''aventures',
   'Un récit d''aventures se déroule toujours dans un monde magique de fées.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''aventure se situe le plus souvent dans un monde réaliste (mers, îles, jungles).', 6),
  ('09110000-0000-4000-8000-000000000207'::uuid, 'Récits d''aventures',
   'Dans la phrase « Je grimpai à l''échelle », le récit est mené à la : ', 'mcq',
   '["1re personne", "3e personne", "2e personne", "aucune personne"]', 0,
   'Le « je » indique un récit à la première personne.', 7),
  ('09110000-0000-4000-8000-000000000208'::uuid, 'Récits d''aventures',
   'Lequel de ces romans est un récit d''aventures ?', 'mcq',
   '["L''Île au trésor", "Cendrillon", "La Belle au bois dormant", "Le Petit Poucet"]', 0,
   '« L''Île au trésor » de Stevenson est un récit d''aventures ; les autres sont des contes.', 8),
  ('09110000-0000-4000-8000-000000000209'::uuid, 'Récits d''aventures',
   'À quoi servent surtout les descriptions dans un récit d''aventures ?', 'mcq',
   '["Planter le décor et renforcer les émotions", "Conjuguer les verbes", "Compter les syllabes", "Trouver les rimes"]', 0,
   'Les descriptions installent le cadre et intensifient les émotions du lecteur.', 9),
  ('09110000-0000-4000-8000-000000000210'::uuid, 'Récits d''aventures',
   'Dans « Il grimpa à l''échelle », qui raconte l''histoire ?', 'mcq',
   '["Un narrateur extérieur (3e personne)", "Le héros lui-même (je)", "Le lecteur", "Le dialogue"]', 0,
   'Le pronom « il » signale un narrateur extérieur, à la 3e personne.', 10),

  -- Chapitre 3 — Poésie : jeux de langage
  ('09110000-0000-4000-8000-000000000304'::uuid, 'Poésie : jeux de langage',
   'Comment appelle-t-on une strophe de quatre vers ?', 'mcq',
   '["Un quatrain", "Un tercet", "Un distique", "Un alexandrin"]', 0,
   'Quatre vers forment un quatrain ; trois un tercet, deux un distique.', 4),
  ('09110000-0000-4000-8000-000000000305'::uuid, 'Poésie : jeux de langage',
   'Un vers de douze syllabes s''appelle : ', 'mcq',
   '["Un alexandrin", "Un octosyllabe", "Un décasyllabe", "Un quatrain"]', 0,
   'Douze syllabes = alexandrin ; huit = octosyllabe, dix = décasyllabe.', 5),
  ('09110000-0000-4000-8000-000000000306'::uuid, 'Poésie : jeux de langage',
   'Dans « fort comme un lion », de quelle image s''agit-il ?', 'mcq',
   '["Une comparaison", "Une métaphore", "Une allitération", "Une rime"]', 0,
   'Le mot outil « comme » signale une comparaison ; sans mot outil, ce serait une métaphore.', 6),
  ('09110000-0000-4000-8000-000000000307'::uuid, 'Poésie : jeux de langage',
   'Une métaphore utilise un mot outil comme « comme » ou « tel ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la métaphore rapproche deux éléments SANS mot outil (contrairement à la comparaison).', 7),
  ('09110000-0000-4000-8000-000000000308'::uuid, 'Poésie : jeux de langage',
   'La répétition d''un même son de consonne s''appelle : ', 'mcq',
   '["Une allitération", "Une assonance", "Une strophe", "Un tercet"]', 0,
   'l''allitération répète des consonnes ; l''assonance répète des voyelles.', 8),
  ('09110000-0000-4000-8000-000000000309'::uuid, 'Poésie : jeux de langage',
   'Des rimes disposées ABAB sont dites : ', 'mcq',
   '["Croisées", "Suivies", "Embrassées", "Plates"]', 0,
   'ABAB = rimes croisées ; AABB = suivies ; ABBA = embrassées.', 9),
  ('09110000-0000-4000-8000-000000000310'::uuid, 'Poésie : jeux de langage',
   'Sur quoi porte la rime dans un poème ?', 'mcq',
   '["Le son à la fin des vers", "Le début des vers", "Le nombre de strophes", "Le titre du poème"]', 0,
   'La rime est la répétition d''un même son à la fin des vers.', 10),

  -- Chapitre 4 — Le groupe nominal et ses accords
  ('09110000-0000-4000-8000-000000000404'::uuid, 'Le groupe nominal et ses accords',
   'Dans le groupe nominal « le chat noir du voisin », quel est le nom noyau ?', 'mcq',
   '["chat", "le", "noir", "voisin"]', 0,
   'Le nom noyau est « chat » ; les autres mots gravitent autour de lui.', 4),
  ('09110000-0000-4000-8000-000000000405'::uuid, 'Le groupe nominal et ses accords',
   'Dans « une petite maison », quel mot est le déterminant ?', 'mcq',
   '["une", "petite", "maison", "aucun"]', 0,
   '« une » est le déterminant ; « petite » est un adjectif et « maison » le nom.', 5),
  ('09110000-0000-4000-8000-000000000406'::uuid, 'Le groupe nominal et ses accords',
   'Dans le groupe nominal, l''adjectif s''accorde en genre et en nombre avec le nom.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : déterminant et adjectif s''accordent avec le nom noyau.', 6),
  ('09110000-0000-4000-8000-000000000407'::uuid, 'Le groupe nominal et ses accords',
   'Quel est le pluriel correct de « un cheval » ?', 'mcq',
   '["des chevaux", "des chevals", "des chevaus", "des cheval"]', 0,
   'Beaucoup de noms en -al font leur pluriel en -aux : un cheval → des chevaux.', 7),
  ('09110000-0000-4000-8000-000000000408'::uuid, 'Le groupe nominal et ses accords',
   'Dans « les fleurs du jardin sont belles », avec quel mot s''accorde « belles » ?', 'mcq',
   '["fleurs", "jardin", "les", "sont"]', 0,
   '« belles » s''accorde avec « fleurs » (fém. pluriel), pas avec « jardin ».', 8),
  ('09110000-0000-4000-8000-000000000409'::uuid, 'Le groupe nominal et ses accords',
   'Comment nomme-t-on un groupe comme « du voisin » qui complète le nom ?', 'mcq',
   '["Un complément du nom", "Un déterminant", "Un adjectif", "Un verbe"]', 0,
   '« du voisin » est un complément du nom, introduit par une préposition.', 9),
  ('09110000-0000-4000-8000-000000000410'::uuid, 'Le groupe nominal et ses accords',
   'Quelle marque indique le plus souvent le féminin d''un nom ou d''un adjectif ?', 'mcq',
   '["Un -e final", "Un -s final", "Un -x final", "Un accent"]', 0,
   'Le féminin se marque souvent par l''ajout d''un -e : un ami → une amie.', 10),

  -- Chapitre 5 — Conjugaison : présent et imparfait
  ('09110000-0000-4000-8000-000000000504'::uuid, 'Conjugaison : présent et imparfait',
   'Quelles sont les terminaisons de l''imparfait, communes à tous les verbes ?', 'mcq',
   '["-ais, -ais, -ait, -ions, -iez, -aient", "-e, -es, -e, -ons, -ez, -ent", "-ai, -as, -a, -âmes, -âtes, -èrent", "-rai, -ras, -ra, -rons, -rez, -ront"]', 0,
   'l''imparfait a les mêmes terminaisons pour tous : -ais, -ais, -ait, -ions, -iez, -aient.', 4),
  ('09110000-0000-4000-8000-000000000505'::uuid, 'Conjugaison : présent et imparfait',
   'Quelle phrase exprime une habitude passée (imparfait) ?', 'mcq',
   '["Chaque été, nous allions à la mer", "Je mange une pomme maintenant", "Demain, je partirai", "Ferme la porte !"]', 0,
   '« nous allions » (imparfait) exprime une habitude dans le passé.', 5),
  ('09110000-0000-4000-8000-000000000506'::uuid, 'Conjugaison : présent et imparfait',
   'Quelle est la forme correcte du verbe « être » à l''imparfait (1re personne) ?', 'mcq',
   '["j''étais", "je suis", "je serai", "je fus"]', 0,
   'Être à l''imparfait : j''étais (au présent, c''est « je suis »).', 6),
  ('09110000-0000-4000-8000-000000000507'::uuid, 'Conjugaison : présent et imparfait',
   'La phrase « L''eau bout à 100 °C » est au présent de vérité générale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le présent sert ici à exprimer une vérité toujours valable.', 7),
  ('09110000-0000-4000-8000-000000000508'::uuid, 'Conjugaison : présent et imparfait',
   'À quel temps est le verbe dans « Il pleuvait quand je suis sorti » ?', 'mcq',
   '["l''imparfait", "Le présent", "Le futur", "Le passé simple"]', 0,
   '« pleuvait » est à l''imparfait : il décrit une action qui durait dans le passé.', 8),
  ('09110000-0000-4000-8000-000000000509'::uuid, 'Conjugaison : présent et imparfait',
   'Quelle est la terminaison des verbes du 1er groupe à « nous » au présent ?', 'mcq',
   '["-ons", "-ez", "-ent", "-es"]', 0,
   'Au présent, « nous » prend la terminaison -ons : nous chantons.', 9),
  ('09110000-0000-4000-8000-000000000510'::uuid, 'Conjugaison : présent et imparfait',
   'Quelle est la forme correcte du verbe « avoir » au présent (1re personne) ?', 'mcq',
   '["j''ai", "j''avais", "j''aurai", "j''eus"]', 0,
   'Avoir au présent : j''ai (à l''imparfait, c''est « j''avais »).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
