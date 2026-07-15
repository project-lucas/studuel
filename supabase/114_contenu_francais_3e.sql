-- =============================================================================
-- Studuel — Migration 114 : CONTENU Français 3e (+ exercices type brevet)
-- Remplit les 5 chapitres de Français 3e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les questions
--                    sont attachées au quiz DE LA LEÇON via la jointure leçon→quiz
--                    (robuste à l'id existant).
--   4. Exercices type brevet → lessons.content de « Exercices types » (position 2),
--                    2 exercices corrigés par chapitre (grammaire/réécriture,
--                    compréhension, dictée aménagée) avec « ### Correction ».
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
    ('Se raconter : l''autobiographie', $md$# Se raconter : l'autobiographie

## Ce que tu vas comprendre
Se raconter, c'est faire le récit de sa propre vie pour se souvenir, se comprendre ou se justifier. Ce chapitre t'apprend à reconnaître l'autobiographie, ses règles et ses grands auteurs.

## 1. Qu'est-ce qu'une autobiographie ?
Une **autobiographie** est le récit **rétrospectif** qu'une personne réelle fait de sa **propre existence**. Le mot vient du grec : *auto* (soi-même), *bios* (la vie), *graphein* (écrire).

*Exemple : dans **Les Confessions**, Rousseau raconte sa vie depuis l'enfance.*

## 2. Le pacte autobiographique
L'écrivain Philippe Lejeune parle de **pacte autobiographique** : l'auteur s'engage envers le lecteur à dire la **vérité** sur sa propre vie. Dans une autobiographie, **l'auteur, le narrateur et le personnage principal sont une seule et même personne**.

> **À retenir :** ce pacte distingue l'autobiographie du roman, où le narrateur est un personnage inventé.

## 3. L'emploi du « je » et le regard rétrospectif
- Le récit s'écrit à la **première personne** (« **je** »).
- L'adulte qui écrit regarde son passé : on parle de **regard rétrospectif**.
- Il y a donc deux « je » : le **je qui écrit** (aujourd'hui) et le **je qui a vécu** (autrefois).

## 4. Mémoire et souvenirs
L'autobiographie s'appuie sur la **mémoire**, qui est parfois incomplète ou déformée. Le récit d'enfance emploie souvent :
- l'**imparfait** pour les habitudes et le décor (« je jouais chaque été… ») ;
- le **passé composé** ou le **passé simple** pour les événements marquants.

## 5. Des genres voisins
- Les **Mémoires** racontent surtout la vie **publique** et les grands événements traversés.
- Le **journal intime** est écrit au **jour le jour**, sans recul.
- L'**autoportrait** décrit surtout le caractère de l'auteur.

*Grands auteurs : Rousseau (Les Confessions), Chateaubriand (Mémoires d'outre-tombe), Nathalie Sarraute (Enfance).*

## L'essentiel à retenir
- **Autobiographie** = récit rétrospectif de sa propre vie, à la 1re personne.
- **Pacte autobiographique** : auteur = narrateur = personnage ; engagement de vérité.
- Deux « je » : celui qui écrit et celui qui a vécu ; mémoire parfois incomplète.
- À distinguer des **Mémoires** (vie publique) et du **journal intime** (au jour le jour).$md$),

    ('Dénoncer les travers de la société', $md$# Dénoncer les travers de la société

## Ce que tu vas comprendre
La littérature peut servir à **critiquer** ce qui ne va pas : l'injustice, l'hypocrisie, la bêtise. Ce chapitre t'apprend les outils de la dénonciation : la satire, l'argumentation et l'apologue.

## 1. Dénoncer, c'est critiquer pour faire réfléchir
Un auteur **dénonce** un **travers** (un défaut de la société) pour pousser le lecteur à réagir. Il ne se contente pas de raconter : il cherche à **convaincre** et à **persuader**.

## 2. La satire
La **satire** critique en se **moquant**. Elle grossit les défauts pour les rendre ridicules. Son arme principale est l'**ironie** : dire le **contraire** de ce que l'on pense pour mieux critiquer.

*Exemple : faire l'éloge d'un personnage stupide pour mieux se moquer de lui.*

## 3. Argumenter : convaincre et persuader
- **Convaincre**, c'est s'adresser à la **raison** avec des **arguments** et des **exemples**.
- **Persuader**, c'est s'adresser aux **émotions** (pitié, indignation, rire).

> **À retenir :** un **argument** est une idée qui soutient une thèse ; un **exemple** est un fait précis qui illustre l'argument. Ce ne sont pas la même chose.

## 4. L'apologue et la fable
Un **apologue** est un **récit court** qui délivre une **morale** ou une leçon.
- La **fable** met souvent en scène des **animaux** pour critiquer les hommes (La Fontaine).
- Le **conte philosophique** raconte une histoire pour défendre des idées (Voltaire, *Candide*).

L'apologue est une arme **indirecte** : on fait passer une critique sans l'énoncer brutalement.

## 5. Les registres de la dénonciation
- **Ironique** : moquerie, second degré.
- **Polémique** : ton violent, attaque directe de l'adversaire.
- **Pathétique** : on cherche à émouvoir, à provoquer la pitié.

*Grands auteurs : La Fontaine (Fables), Voltaire (Candide), Victor Hugo.*

## L'essentiel à retenir
- **Dénoncer** = critiquer un travers de la société pour faire réagir le lecteur.
- **Satire** : critiquer en se moquant ; arme principale = l'**ironie**.
- **Argumenter** : convaincre (raison, arguments) et persuader (émotions).
- **Apologue** (fable, conte philosophique) : récit court à **morale**, critique indirecte.$md$),

    ('La poésie engagée', $md$# La poésie engagée

## Ce que tu vas comprendre
La poésie n'est pas seulement faite pour chanter l'amour ou la nature : elle peut aussi **combattre**. Ce chapitre t'apprend ce qu'est une poésie engagée et comment elle défend une cause.

## 1. Qu'est-ce qu'une poésie engagée ?
Une **poésie engagée** est un poème qui **défend une cause** ou **dénonce une injustice** : la guerre, l'oppression, le racisme, la misère. Le poète met son art au service d'un **combat**.

## 2. La poésie comme arme
Pendant la **Seconde Guerre mondiale** et la **Résistance**, des poèmes ont circulé pour donner de l'espoir et résister à l'occupant.

*Exemple : le poème **Liberté** de Paul Éluard, parachuté par avions pendant la guerre.*

> **À retenir :** la poésie engagée peut devenir une véritable **arme** pour résister et rassembler.

## 3. Les grands thèmes
- La **guerre** et ses horreurs (Rimbaud, *Le Dormeur du val*).
- La **résistance** et la liberté (Éluard, Aragon).
- La **révolte** contre l'injustice sociale (Victor Hugo, *Melancholia*).

## 4. Les registres et les figures
- Registre **pathétique** : émouvoir, provoquer la pitié.
- Registre **polémique** : dénoncer avec force, prendre à partie.
- Registre **épique** : grandir le combat, célébrer des héros.

Le poète utilise des **figures de style** :
- l'**anaphore** (répétition d'un mot en début de vers) pour marteler une idée ;
- la **métaphore** et la **personnification** pour frapper l'imagination ;
- l'**apostrophe** pour interpeller le lecteur ou l'adversaire.

## 5. Forme libre ou forme fixe
La poésie engagée peut employer une forme classique (sonnet, vers réguliers) **ou** le **vers libre**, sans rime ni mètre fixe, pour se rapprocher du cri ou du discours.

*Grands auteurs : Paul Éluard, Louis Aragon, Arthur Rimbaud, Victor Hugo.*

## L'essentiel à retenir
- **Poésie engagée** = poème qui défend une cause ou dénonce une injustice.
- Elle fut une **arme de la Résistance** (Éluard, *Liberté* ; Aragon).
- Thèmes : guerre, oppression, révolte sociale ; registres pathétique, polémique, épique.
- Figures fréquentes : **anaphore**, métaphore, apostrophe ; forme fixe **ou** vers libre.$md$),

    ('Le discours rapporté', $md$# Le discours rapporté

## Ce que tu vas comprendre
Quand on écrit, on peut **rapporter les paroles** de quelqu'un de plusieurs façons. Ce chapitre t'apprend à reconnaître et à transformer le discours direct, indirect et indirect libre.

## 1. Le discours direct
Le **discours direct** rapporte les paroles **exactement**, telles qu'elles ont été prononcées. On les repère à :
- des **guillemets** « … » ;
- un **verbe introducteur** (dit-il, répondit-elle) ;
- souvent les **deux-points** avant la citation.

*Exemple : Il déclara : « Je viendrai demain. »*

## 2. Le discours indirect
Le **discours indirect** rapporte les paroles **sans les citer**, dans une **subordonnée** introduite par *que*, *si*, *ce que*… Il n'y a **plus de guillemets**.

*Exemple : Il déclara **qu'il viendrait le lendemain**.*

## 3. Les transformations à connaître
En passant du direct à l'indirect, plusieurs éléments **changent** :

| Direct | Indirect |
|---|---|
| « Je viendrai **demain** » | qu'il viendrait **le lendemain** |
| « **Hier**, j'ai fini » | qu'il avait fini **la veille** |
| « **Ici**, tout va bien » | que **là**, tout allait bien |

- Les **pronoms** changent (je → il).
- Les **temps** reculent souvent (futur → conditionnel, présent → imparfait).
- Les **indicateurs de temps et de lieu** se transforment (demain → le lendemain).

## 4. Le discours indirect libre
Le **discours indirect libre** rapporte les paroles ou les pensées **sans verbe introducteur ni guillemets**. Il se fond dans le récit et rend la narration plus vivante.

*Exemple : Il regarda le ciel. Demain, enfin, il partirait.*

## 5. Rapporter une question
Au discours indirect, une **question** est introduite par un verbe comme **demander** :
- Direct : Elle demanda : « **Où vas-tu ?** »
- Indirect : Elle demanda **où il allait**. (plus de point d'interrogation)

## L'essentiel à retenir
- **Discours direct** : paroles exactes, guillemets, verbe introducteur, deux-points.
- **Discours indirect** : subordonnée (que, si), **pas de guillemets** ; pronoms et temps changent.
- Indicateurs qui bougent : **demain → le lendemain**, hier → la veille, ici → là.
- **Discours indirect libre** : ni guillemets ni verbe introducteur, fondu dans le récit.$md$),

    ('Préparer l''oral du brevet', $md$# Préparer l'oral du brevet

## Ce que tu vas comprendre
L'oral du brevet est une épreuve où tu présentes un **projet** devant un jury. Ce chapitre te donne la **méthode** pour bien préparer et réussir cette présentation.

## 1. En quoi consiste l'épreuve ?
L'oral du DNB dure environ **15 minutes** et se déroule en deux temps :
- un **exposé** individuel d'environ **5 minutes** ;
- un **entretien** d'environ **10 minutes** avec le jury.

Tu présentes un **projet** mené en classe : un **EPI**, un **parcours** (avenir, artistique, citoyen…) ou une œuvre d'**histoire des arts**.

## 2. Bien choisir et connaître son projet
- Choisis un projet que tu as **compris** et qui t'**intéresse**.
- Sache expliquer **ce que tu as fait**, **pourquoi**, et **ce que tu as appris**.
- Prépare quelques **exemples précis** (une œuvre, une étape, une difficulté surmontée).

## 3. Structurer son exposé
Un bon exposé suit un **plan clair** :
1. **Introduction** : présenter le projet et annoncer le plan.
2. **Développement** : les étapes, le travail réalisé, tes choix.
3. **Conclusion** : ce que le projet t'a apporté, un bilan personnel.

> **À retenir :** on ne **lit pas** son texte mot à mot. On s'appuie sur des **notes** et on regarde le jury.

## 4. Soigner la communication orale
Les critères d'évaluation portent aussi sur la **forme** :
- **parler distinctement**, ni trop vite ni trop bas ;
- **regarder le jury**, se tenir droit ;
- employer un **vocabulaire précis** et un **langage correct** ;
- gérer le **temps** imparti.

## 5. Réussir l'entretien
Après l'exposé, le jury **pose des questions** pour approfondir. Il faut :
- **écouter** la question en entier ;
- répondre **calmement**, en donnant des exemples ;
- reconnaître honnêtement ce qu'on ne sait pas, sans se bloquer.

## L'essentiel à retenir
- L'oral du brevet = **exposé (~5 min)** + **entretien (~10 min)** sur un projet (EPI, parcours, HDA).
- On **structure** : introduction, développement, conclusion ; on ne **lit pas** son texte.
- Communication : parler clairement, **regarder le jury**, gérer le temps, vocabulaire précis.
- À l'entretien : écouter, répondre avec des **exemples**, rester calme.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Se raconter : l''autobiographie', $json${
      "centre": "L'autobiographie",
      "branches": [
        { "titre": "Définition", "enfants": ["Récit rétrospectif de sa vie", "auto + bios + graphein", "Écrit à la 1re personne (je)"] },
        { "titre": "Pacte autobiographique", "enfants": ["Auteur = narrateur = personnage", "Engagement de vérité", "Distinct du roman"] },
        { "titre": "Mémoire et souvenirs", "enfants": ["Deux je : qui écrit / qui a vécu", "Imparfait du décor", "Passé composé des événements"] },
        { "titre": "Genres voisins", "enfants": ["Mémoires : vie publique", "Journal intime : au jour le jour", "Rousseau, Les Confessions"] }
      ]
    }$json$),
    ('Dénoncer les travers de la société', $json${
      "centre": "Dénoncer les travers",
      "branches": [
        { "titre": "Dénoncer", "enfants": ["Critiquer un défaut de société", "Faire réagir le lecteur", "Convaincre et persuader"] },
        { "titre": "La satire", "enfants": ["Critiquer en se moquant", "Arme : l'ironie", "Dire le contraire pour critiquer"] },
        { "titre": "Argumenter", "enfants": ["Argument = idée qui soutient", "Exemple = fait précis", "Convaincre (raison) / persuader (émotion)"] },
        { "titre": "L'apologue", "enfants": ["Récit court à morale", "Fable : animaux (La Fontaine)", "Conte philo : Candide (Voltaire)"] }
      ]
    }$json$),
    ('La poésie engagée', $json${
      "centre": "La poésie engagée",
      "branches": [
        { "titre": "Définition", "enfants": ["Défend une cause", "Dénonce une injustice", "L'art au service d'un combat"] },
        { "titre": "Une arme", "enfants": ["Résistance, Seconde Guerre", "Éluard, Liberté", "Donner espoir et résister"] },
        { "titre": "Thèmes", "enfants": ["La guerre (Rimbaud)", "La liberté (Aragon)", "La révolte sociale (Hugo)"] },
        { "titre": "Registres et figures", "enfants": ["Pathétique, polémique, épique", "Anaphore, métaphore", "Vers libre ou forme fixe"] }
      ]
    }$json$),
    ('Le discours rapporté', $json${
      "centre": "Le discours rapporté",
      "branches": [
        { "titre": "Discours direct", "enfants": ["Paroles exactes", "Guillemets et deux-points", "Verbe introducteur"] },
        { "titre": "Discours indirect", "enfants": ["Subordonnée (que, si)", "Plus de guillemets", "Pronoms et temps changent"] },
        { "titre": "Transformations", "enfants": ["demain → le lendemain", "hier → la veille", "ici → là"] },
        { "titre": "Indirect libre", "enfants": ["Ni guillemets ni verbe", "Fondu dans le récit", "Rend la narration vivante"] }
      ]
    }$json$),
    ('Préparer l''oral du brevet', $json${
      "centre": "L'oral du brevet",
      "branches": [
        { "titre": "L'épreuve", "enfants": ["Exposé ~5 min", "Entretien ~10 min", "Projet EPI, parcours, HDA"] },
        { "titre": "Le projet", "enfants": ["Le comprendre et l'aimer", "Quoi, pourquoi, appris", "Exemples précis"] },
        { "titre": "Structurer", "enfants": ["Introduction", "Développement", "Conclusion (bilan)"] },
        { "titre": "Communication", "enfants": ["Ne pas lire son texte", "Regarder le jury", "Parler clairement, gérer le temps"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'francais'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz ; ce bloc ne
--     fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Français', '3e', v.chapter, true, l.id
FROM (VALUES
  ('11419999-0000-4000-8000-000000000001'::uuid, 'Se raconter : l''autobiographie'),
  ('11419999-0000-4000-8000-000000000002'::uuid, 'Dénoncer les travers de la société'),
  ('11419999-0000-4000-8000-000000000003'::uuid, 'La poésie engagée'),
  ('11419999-0000-4000-8000-000000000004'::uuid, 'Le discours rapporté'),
  ('11419999-0000-4000-8000-000000000005'::uuid, 'Préparer l''oral du brevet')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
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
  -- Chapitre 1 — Se raconter : l'autobiographie
  ('11410000-0000-4000-8000-000000000104'::uuid, 'Se raconter : l''autobiographie',
   'Qu''est-ce que le pacte autobiographique ?', 'mcq',
   '["L''engagement de l''auteur à dire la vérité sur sa propre vie", "Un contrat signé avec l''éditeur", "Une règle de grammaire", "Un poème sur soi"]', 0,
   'Le pacte autobiographique est l''engagement pris par l''auteur de dire la vérité sur sa propre existence.', 4),
  ('11410000-0000-4000-8000-000000000105'::uuid, 'Se raconter : l''autobiographie',
   'À quelle personne s''écrit une autobiographie ?', 'mcq',
   '["À la première personne (je)", "À la deuxième personne (tu)", "À la troisième personne (il)", "Sans pronom personnel"]', 0,
   'L''auteur raconte sa propre vie : il emploie le « je », la première personne.', 5),
  ('11410000-0000-4000-8000-000000000106'::uuid, 'Se raconter : l''autobiographie',
   'Dans une autobiographie, l''auteur, le narrateur et le personnage principal sont la même personne.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est justement la règle du pacte autobiographique : auteur = narrateur = personnage.', 6),
  ('11410000-0000-4000-8000-000000000107'::uuid, 'Se raconter : l''autobiographie',
   'Quel auteur a écrit « Les Confessions » ?', 'mcq',
   '["Jean-Jacques Rousseau", "Molière", "Voltaire", "Victor Hugo"]', 0,
   'Rousseau est l''auteur des Confessions, œuvre autobiographique célèbre.', 7),
  ('11410000-0000-4000-8000-000000000108'::uuid, 'Se raconter : l''autobiographie',
   'Quel temps domine souvent pour décrire les habitudes et le décor de l''enfance ?', 'mcq',
   '["L''imparfait", "Le futur", "Le passé simple", "Le conditionnel"]', 0,
   'L''imparfait sert à décrire les habitudes et le décor ; les événements marquants sont au passé simple ou composé.', 8),
  ('11410000-0000-4000-8000-000000000109'::uuid, 'Se raconter : l''autobiographie',
   'Les Mémoires racontent surtout la vie intime et privée de l''auteur.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les Mémoires racontent surtout la vie publique et les grands événements traversés.', 9),
  ('11410000-0000-4000-8000-000000000110'::uuid, 'Se raconter : l''autobiographie',
   'Comment appelle-t-on un récit rétrospectif qu''une personne fait de sa propre existence ?', 'mcq',
   '["Une autobiographie", "Une biographie", "Un roman", "Une fable"]', 0,
   'Une autobiographie : « auto » (soi-même), « bios » (vie), « graphein » (écrire).', 10),

  -- Chapitre 2 — Dénoncer les travers de la société
  ('11410000-0000-4000-8000-000000000204'::uuid, 'Dénoncer les travers de la société',
   'Qu''est-ce qu''un apologue ?', 'mcq',
   '["Un récit court qui délivre une morale ou une leçon", "Un long poème d''amour", "Une pièce de théâtre tragique", "Une biographie"]', 0,
   'L''apologue est un court récit porteur d''une morale (fable, conte philosophique).', 4),
  ('11410000-0000-4000-8000-000000000205'::uuid, 'Dénoncer les travers de la société',
   'En quoi consiste la satire ?', 'mcq',
   '["Critiquer en se moquant, avec ironie", "Faire l''éloge sincère de quelqu''un", "Raconter une histoire d''amour", "Décrire un paysage"]', 0,
   'La satire critique un travers en s''en moquant ; son arme principale est l''ironie.', 5),
  ('11410000-0000-4000-8000-000000000206'::uuid, 'Dénoncer les travers de la société',
   'L''ironie consiste à dire le contraire de ce que l''on pense pour critiquer.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''ironie dit le contraire de sa pensée (souvent un faux éloge) pour mieux critiquer.', 6),
  ('11410000-0000-4000-8000-000000000207'::uuid, 'Dénoncer les travers de la société',
   'Quel genre littéraire délivre une morale en mettant souvent en scène des animaux ?', 'mcq',
   '["La fable", "Le sonnet", "La tragédie", "Le roman policier"]', 0,
   'La fable (La Fontaine) met en scène des animaux pour critiquer les hommes et délivrer une morale.', 7),
  ('11410000-0000-4000-8000-000000000208'::uuid, 'Dénoncer les travers de la société',
   'Argumenter, c''est :', 'mcq',
   '["Défendre une opinion à l''aide d''arguments et d''exemples", "Raconter sa journée", "Décrire un objet", "Réciter un poème"]', 0,
   'Argumenter, c''est soutenir une thèse avec des arguments (idées) illustrés par des exemples.', 8),
  ('11410000-0000-4000-8000-000000000209'::uuid, 'Dénoncer les travers de la société',
   'Un argument et un exemple, c''est exactement la même chose.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''argument est une idée qui soutient la thèse ; l''exemple est un fait précis qui l''illustre.', 9),
  ('11410000-0000-4000-8000-000000000210'::uuid, 'Dénoncer les travers de la société',
   'Quel auteur a écrit « Candide », conte philosophique qui dénonce les injustices ?', 'mcq',
   '["Voltaire", "Rousseau", "Rimbaud", "La Fontaine"]', 0,
   'Voltaire est l''auteur de Candide, conte philosophique qui critique son époque.', 10),

  -- Chapitre 3 — La poésie engagée
  ('11410000-0000-4000-8000-000000000304'::uuid, 'La poésie engagée',
   'Qu''est-ce qu''une poésie engagée ?', 'mcq',
   '["Une poésie qui défend une cause ou dénonce une injustice", "Une poésie qui parle uniquement d''amour", "Un poème sans aucun sens", "Une chanson à danser"]', 0,
   'La poésie engagée met l''art au service d''un combat : défendre une cause, dénoncer une injustice.', 4),
  ('11410000-0000-4000-8000-000000000305'::uuid, 'La poésie engagée',
   'De nombreux poèmes de la Résistance dénoncent avant tout :', 'mcq',
   '["La guerre et l''oppression", "La beauté des saisons", "Les jeux de l''enfance", "La gastronomie"]', 0,
   'Les poèmes de la Résistance dénoncent la guerre et l''oppression de l''occupant.', 5),
  ('11410000-0000-4000-8000-000000000306'::uuid, 'La poésie engagée',
   'La poésie engagée peut servir d''arme pour résister.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : pendant la Résistance, les poèmes ont circulé pour donner de l''espoir et résister.', 6),
  ('11410000-0000-4000-8000-000000000307'::uuid, 'La poésie engagée',
   'Paul Éluard est l''auteur du célèbre poème :', 'mcq',
   '["Liberté", "Le Corbeau et le Renard", "Le Cid", "Les Misérables"]', 0,
   '« Liberté » est le poème de Paul Éluard, diffusé pendant la Seconde Guerre mondiale.', 7),
  ('11410000-0000-4000-8000-000000000308'::uuid, 'La poésie engagée',
   'Quelle figure de style consiste à répéter un mot en début de vers ?', 'mcq',
   '["L''anaphore", "La comparaison", "La litote", "L''euphémisme"]', 0,
   'L''anaphore répète un mot en début de vers pour marteler une idée, fréquente en poésie engagée.', 8),
  ('11410000-0000-4000-8000-000000000309'::uuid, 'La poésie engagée',
   'Un poème engagé cherche seulement à distraire le lecteur, sans porter de message.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le poème engagé porte au contraire un message fort, il défend une cause.', 9),
  ('11410000-0000-4000-8000-000000000310'::uuid, 'La poésie engagée',
   'La poésie engagée peut employer le vers libre, sans rime ni mètre fixe.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : elle peut utiliser une forme fixe ou le vers libre, plus proche du cri ou du discours.', 10),

  -- Chapitre 4 — Le discours rapporté
  ('11410000-0000-4000-8000-000000000404'::uuid, 'Le discours rapporté',
   'Le discours direct rapporte les paroles :', 'mcq',
   '["Exactement, entre guillemets", "En les résumant sans guillemets", "En les inventant", "Sans jamais de verbe introducteur"]', 0,
   'Le discours direct cite les paroles exactement, entre guillemets, avec un verbe introducteur.', 4),
  ('11410000-0000-4000-8000-000000000405'::uuid, 'Le discours rapporté',
   'Quels signes introduisent le plus souvent le discours direct ?', 'mcq',
   '["Les deux-points et les guillemets", "Les parenthèses", "Les points de suspension seuls", "Le tiret de soustraction"]', 0,
   'Le discours direct est annoncé par les deux-points, puis encadré par des guillemets.', 5),
  ('11410000-0000-4000-8000-000000000406'::uuid, 'Le discours rapporté',
   'Au discours indirect, on utilise des guillemets.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : au discours indirect, les paroles passent dans une subordonnée, sans guillemets.', 6),
  ('11410000-0000-4000-8000-000000000407'::uuid, 'Le discours rapporté',
   '« Il dit qu''il viendra demain » est un discours :', 'mcq',
   '["Indirect", "Direct", "Indirect libre", "Poétique"]', 0,
   'Les paroles sont rapportées dans une subordonnée introduite par « que » : c''est du discours indirect.', 7),
  ('11410000-0000-4000-8000-000000000408'::uuid, 'Le discours rapporté',
   'Au discours indirect, « Je viendrai demain » devient souvent :', 'mcq',
   '["qu''il viendrait le lendemain", "qu''il viendra demain", "je viendrai demain", "viens demain"]', 0,
   'Le temps recule (futur → conditionnel) et l''indicateur change (demain → le lendemain).', 8),
  ('11410000-0000-4000-8000-000000000409'::uuid, 'Le discours rapporté',
   'Le discours indirect libre supprime les verbes introducteurs et les guillemets.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le discours indirect libre se fond dans le récit, sans verbe introducteur ni guillemets.', 9),
  ('11410000-0000-4000-8000-000000000410'::uuid, 'Le discours rapporté',
   'Quel verbe introducteur convient pour rapporter une question au discours indirect ?', 'mcq',
   '["demander", "affirmer", "s''écrier", "promettre"]', 0,
   'On rapporte une question avec « demander » : Elle demanda où il allait.', 10),

  -- Chapitre 5 — Préparer l'oral du brevet
  ('11410000-0000-4000-8000-000000000504'::uuid, 'Préparer l''oral du brevet',
   'Combien de temps dure environ l''oral du brevet en tout ?', 'mcq',
   '["Environ 15 minutes (exposé + entretien)", "2 minutes", "1 heure", "3 heures"]', 0,
   'L''oral du DNB dure environ 15 minutes : un exposé (~5 min) puis un entretien (~10 min).', 4),
  ('11410000-0000-4000-8000-000000000505'::uuid, 'Préparer l''oral du brevet',
   'Que présente-t-on à l''oral du brevet ?', 'mcq',
   '["Un projet mené en EPI, en parcours ou en histoire des arts", "Une dictée notée", "Un contrôle de mathématiques", "Un roman entier récité"]', 0,
   'On présente un projet : EPI, parcours (avenir, artistique, citoyen…) ou œuvre d''histoire des arts.', 5),
  ('11410000-0000-4000-8000-000000000506'::uuid, 'Préparer l''oral du brevet',
   'À l''oral, il vaut mieux lire son texte mot à mot sans regarder le jury.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : on s''appuie sur des notes et on regarde le jury ; lire mot à mot est pénalisé.', 6),
  ('11410000-0000-4000-8000-000000000507'::uuid, 'Préparer l''oral du brevet',
   'Pour bien structurer son exposé, on prévoit :', 'mcq',
   '["Une introduction, un développement et une conclusion", "Uniquement une conclusion", "Des phrases dans le désordre", "Rien de particulier"]', 0,
   'Un exposé clair suit un plan : introduction, développement, conclusion (bilan personnel).', 7),
  ('11410000-0000-4000-8000-000000000508'::uuid, 'Préparer l''oral du brevet',
   'Pendant l''entretien, le jury :', 'mcq',
   '["Pose des questions sur le projet présenté", "Reste totalement silencieux", "Corrige une dictée", "Note l''orthographe d''un texte écrit"]', 0,
   'Après l''exposé, le jury pose des questions pour approfondir le projet.', 8),
  ('11410000-0000-4000-8000-000000000509'::uuid, 'Préparer l''oral du brevet',
   'Regarder le jury et parler distinctement font partie des critères d''évaluation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la communication orale (regard, voix, vocabulaire, gestion du temps) est évaluée.', 9),
  ('11410000-0000-4000-8000-000000000510'::uuid, 'Préparer l''oral du brevet',
   'Combien de temps dure environ l''exposé individuel de l''élève ?', 'mcq',
   '["Environ 5 minutes", "30 secondes", "20 minutes", "1 heure"]', 0,
   'La partie individuelle (l''exposé) dure environ 5 minutes, avant l''entretien de ~10 minutes.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BREVET — lessons.content de « Exercices types » (position 2)
--    Même jointure que la section 1, mais sur la leçon « Exercices types ».
--    2 exercices corrigés par chapitre (grammaire/réécriture, compréhension,
--    dictée aménagée), chacun suivi de sa « ### Correction ».
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Se raconter : l''autobiographie', $md$# Exercices type brevet — L'autobiographie

Entraîne-toi comme le jour du brevet. Cache la correction, rédige, puis compare.

## Exercice 1 — Grammaire et réécriture
Voici un extrait inspiré des *Confessions* de Rousseau :

> « Je forme une entreprise qui n'eut jamais d'exemple. Je veux montrer à mes semblables un homme dans toute la vérité de la nature ; et cet homme, ce sera moi. »

1. Relève le pronom qui montre que le texte est autobiographique et justifie.
2. **Réécriture** : réécris la 2e phrase en remplaçant « Je » par « Nous » et fais toutes les transformations nécessaires.

### Correction
1. Le pronom **« Je »** (repris par « moi ») montre que l'auteur parle de **lui-même** : c'est la marque de la première personne, typique de l'autobiographie et du pacte autobiographique.
2. Réécriture : « **Nous voulons** montrer à **nos** semblables un homme dans toute la vérité de la nature ; et cet homme, ce **sera nous**. » (le verbe « veux » devient « voulons », le déterminant « mes » devient « nos »).

## Exercice 2 — Compréhension d'un court extrait
> « Longtemps, je me suis couché de bonne heure. » (Marcel Proust)

1. À quelle personne et à quel temps est écrite cette phrase ?
2. En quoi cette ouverture annonce-t-elle un récit de souvenirs ?

### Correction
1. La phrase est à la **première personne** (« je ») et au **passé composé** (« je me suis couché »), avec l'adverbe **« Longtemps »** qui installe la durée.
2. Le « je » et l'évocation d'une **habitude passée** (se coucher tôt) annoncent un **retour sur le passé** : le narrateur va faire remonter ses **souvenirs**, ce qui est caractéristique de l'écriture de soi.

## Dictée aménagée (préparation)
Prépare l'orthographe de : *rétrospectif*, *l'existence*, *les Confessions*, *un souvenir d'enfance*. Vérifie l'accord du participe passé dans « je me suis couché(e) ».$md$),

    ('Dénoncer les travers de la société', $md$# Exercices type brevet — Dénoncer les travers

Entraîne-toi comme le jour du brevet. Cache la correction, rédige, puis compare.

## Exercice 1 — Compréhension et vocabulaire
Extrait d'une fable de La Fontaine :

> « Cette leçon vaut bien un fromage, sans doute. »
> Le Corbeau, honteux et confus,
> Jura, mais un peu tard, qu'on ne l'y prendrait plus.

1. Quel travers humain est ici critiqué à travers le Corbeau ?
2. Relève le mot qui montre le sentiment du Corbeau à la fin.

### Correction
1. Le travers critiqué est la **vanité** (l'orgueil, le fait de se laisser flatter) : le Corbeau a été dupé parce qu'il aimait qu'on le complimente.
2. Le mot **« honteux »** (renforcé par « confus ») montre que le Corbeau a compris son erreur et se sent humilié. La fable délivre ainsi sa **morale**.

## Exercice 2 — Grammaire et réécriture
> « Les puissants écrasent les faibles sans jamais être punis. »

1. Cette phrase est-elle à la voix active ou passive ? Justifie.
2. **Réécriture** : mets le verbe « écrasent » au passé composé et transforme la phrase à la **voix passive**.

### Correction
1. La phrase est à la **voix active** : le sujet « Les puissants » **fait** l'action d'écraser.
2. Réécriture à la voix passive au passé composé : « **Les faibles ont été écrasés par les puissants** sans jamais que ceux-ci soient punis. » (le complément d'objet devient sujet, on ajoute l'auxiliaire « être »).

## Dictée aménagée (préparation)
Prépare l'orthographe de : *l'ironie*, *un apologue*, *la satire*, *un argument convaincant*. Attention à l'accord : « une critique **acérée** », « des travers **dénoncés** ».$md$),

    ('La poésie engagée', $md$# Exercices type brevet — La poésie engagée

Entraîne-toi comme le jour du brevet. Cache la correction, rédige, puis compare.

## Exercice 1 — Compréhension et figures de style
Extrait du poème *Liberté* de Paul Éluard :

> « Sur mes cahiers d'écolier
> Sur mon pupitre et les arbres
> [...]
> J'écris ton nom »

1. Quelle figure de style est créée par la répétition de « Sur » en début de vers ?
2. Quelle cause le poète défend-il dans ce poème ?

### Correction
1. La répétition de **« Sur »** en début de vers est une **anaphore** : elle martèle l'idée et donne un rythme insistant, comme une litanie.
2. Le poète défend la **liberté** (le poème s'intitule *Liberté*, et le « nom » écrit partout est celui de la liberté). Écrit pendant la Seconde Guerre mondiale, c'est un poème **engagé** de résistance.

## Exercice 2 — Grammaire et réécriture
> « Le soldat tombe et le monde entier pleure sa jeunesse perdue. »

1. Relève un verbe conjugué et donne son sujet.
2. **Réécriture** : réécris toute la phrase au **passé composé**.

### Correction
1. Exemple : le verbe **« tombe »** a pour sujet **« Le soldat »** (on accepte aussi « pleure » / sujet « le monde entier »).
2. Réécriture au passé composé : « Le soldat **est tombé** et le monde entier **a pleuré** sa jeunesse perdue. » (« tomber » se conjugue avec **être**, « pleurer » avec **avoir**).

## Dictée aménagée (préparation)
Prépare l'orthographe de : *une injustice*, *la Résistance*, *un poème engagé*, *l'oppression*. Attention à l'accord du participe passé avec « être » : « les soldats **sont tombés** ».$md$),

    ('Le discours rapporté', $md$# Exercices type brevet — Le discours rapporté

Entraîne-toi comme le jour du brevet. Cache la correction, rédige, puis compare.

## Exercice 1 — Transformation du discours
Transforme les phrases suivantes au discours indirect.

1. Il déclara : « Je partirai demain. »
2. Elle demanda : « Où vas-tu ? »

### Correction
1. Il déclara **qu'il partirait le lendemain**. (le futur « partirai » devient conditionnel « partirait », « demain » devient « le lendemain », « je » devient « il »).
2. Elle demanda **où il allait**. (le verbe introducteur devient « demander », on supprime le point d'interrogation et les guillemets, « vas-tu » devient « il allait »).

## Exercice 2 — Reconnaître et réécrire
> « Il regarda le ciel. Demain, enfin, il partirait. »

1. À quel type de discours rapporté appartient la 2e phrase ? Justifie.
2. **Réécriture** : transforme cette pensée en **discours direct** avec un verbe introducteur.

### Correction
1. C'est du **discours indirect libre** : la pensée du personnage est rapportée **sans guillemets ni verbe introducteur**, fondue dans le récit, ce qui la rend plus vivante.
2. Réécriture au discours direct : Il pensa : « **Demain, enfin, je partirai !** » (on ajoute un verbe introducteur « pensa », des guillemets, on repasse à « je » et au futur).

## Dictée aménagée (préparation)
Prépare la ponctuation du dialogue : deux-points, guillemets, tiret. Orthographe : *il répondit*, *elle s'écria*, *demanda-t-il*. Attention au trait d'union et au « t » de liaison dans « demanda-t-il ».$md$),

    ('Préparer l''oral du brevet', $md$# Exercices type brevet — Préparer l'oral

Entraîne-toi comme le jour du brevet. Cache la correction, rédige, puis compare.

## Exercice 1 — Construire son plan d'exposé
Tu présentes un projet d'histoire des arts sur un tableau. Voici tes notes en désordre :
*a) ce que le projet m'a appris — b) présentation du tableau et annonce du plan — c) analyse des couleurs et du sujet.*

1. Remets ces trois parties dans l'ordre d'un exposé structuré.
2. Donne à chaque partie son nom (introduction, développement, conclusion).

### Correction
1. Ordre correct : **b)** puis **c)** puis **a)**.
2. **Introduction** = b) présentation du tableau et annonce du plan ; **développement** = c) analyse des couleurs et du sujet ; **conclusion** = a) ce que le projet m'a appris (bilan personnel).

## Exercice 2 — Réagir à une question du jury
Le jury te demande : « Pourquoi as-tu choisi ce projet ? »

1. Propose une réponse construite en deux phrases (raison + exemple).
2. Cite deux critères de communication orale que tu dois respecter en répondant.

### Correction
1. Exemple de réponse : « J'ai choisi ce projet parce que le thème de la liberté me touche particulièrement. Par exemple, l'œuvre étudiée montre comment un artiste peut dénoncer une injustice. » (une **raison** suivie d'un **exemple précis**).
2. Deux critères parmi : **regarder le jury**, **parler distinctement**, employer un **vocabulaire précis**, ne pas lire ses notes mot à mot, **gérer le temps**.

## Dictée aménagée (préparation)
Prépare l'orthographe de : *un exposé*, *l'entretien*, *un projet interdisciplinaire (EPI)*, *l'histoire des arts*. Attention à l'accent : *présenter*, *développer*, *une conclusion*.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
