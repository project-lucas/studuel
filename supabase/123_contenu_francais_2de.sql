-- =============================================================================
-- Studuel — Migration 123 : CONTENU Français 2de (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Français 2de (programme officiel, objets d'étude) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant).
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons (Français 2de), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le roman et le récit', $md$# Le roman et le récit

## Ce que tu vas comprendre
Le roman raconte une histoire fictive en prose. Du XVIIIe au XXIe siècle, il devient le genre majeur : il peint des personnages, invente des mondes et interroge le réel. Ce chapitre te donne les outils pour analyser un récit : le personnage, la narration et les grands mouvements.

## 1. Le personnage de roman
Le **personnage** est une construction de mots. On l'analyse par son **portrait** (physique, moral), son **statut social** et son **évolution** au fil de l'intrigue. Le héros peut être exemplaire, ordinaire, ou même « antihéros ».

*Exemple : Julien Sorel, dans « Le Rouge et le Noir » de Stendhal, est un héros ambitieux issu du peuple.*

## 2. La narration et le point de vue
Le **narrateur** est la voix qui raconte (à ne pas confondre avec l'auteur).
- Narrateur **externe** (à la 3e personne) ou **interne** (« je »).
- Les **points de vue (focalisations)** : **omniscient** (le narrateur sait tout), **interne** (on suit un personnage), **externe** (on observe du dehors).

## 3. Le rythme du récit
Le récit joue avec le temps : **sommaire** (on accélère), **scène** (dialogue en temps réel), **ellipse** (on saute une période), **pause** (description). L'**ordre** peut être bousculé par des **retours en arrière** (analepses) ou des **anticipations** (prolepses).

## 4. Réalisme et naturalisme
Au XIXe siècle, deux mouvements veulent peindre le réel :
- Le **réalisme** (Balzac, Flaubert) donne l'illusion du vrai : décors précis, détails du quotidien.
- Le **naturalisme** (Zola) va plus loin : il applique une méthode quasi scientifique, étudie l'influence du milieu et de l'hérédité.

## 5. Les fonctions de la description
La **description** ne fait pas qu'orner : elle **ancre** le récit dans un décor, **révèle** un personnage (par son cadre de vie) et crée une **atmosphère**.

## L'essentiel à retenir
- Le **personnage** est fait de mots : portrait, statut, évolution.
- Distinguer **auteur** et **narrateur** ; repérer le **point de vue** (omniscient, interne, externe).
- Le récit accélère (**sommaire, ellipse**) ou ralentit (**scène, pause**).
- **Réalisme** = illusion du vrai ; **naturalisme** = méthode scientifique, milieu et hérédité.$md$),

    ('La poésie du Moyen Âge au XVIIIe', $md$# La poésie du Moyen Âge au XVIIIe

## Ce que tu vas comprendre
La poésie travaille la langue pour créer musique, images et émotion. Du Moyen Âge au XVIIIe siècle, elle se fixe des formes et des règles. Ce chapitre t'apprend la versification, les formes fixes et le lyrisme.

## 1. La versification
Le **vers** se compte en **syllabes**. Les mètres les plus courants :
- **alexandrin** (12 syllabes), **décasyllabe** (10), **octosyllabe** (8).
- Le **e** muet compte s'il n'est pas suivi d'une voyelle ; la **diérèse** compte deux syllabes là où on n'en dirait qu'une.

## 2. La rime
La **rime** est le retour d'un même son en fin de vers. On classe les rimes par disposition :
- **plates** (AABB), **croisées** (ABAB), **embrassées** (ABBA).
On parle de rime **riche**, **suffisante** ou **pauvre** selon le nombre de sons communs.

## 3. Les formes fixes
Certaines formes imposent une structure :
- Le **sonnet** : 14 vers (2 quatrains + 2 tercets), forme reine de la Renaissance.
- La **ballade**, le **rondeau** (Moyen Âge), l'**ode** et la **fable** (XVIIe).

*Exemple : les sonnets de Ronsard (« Mignonne, allons voir si la rose… ») célèbrent l'amour et le temps qui passe.*

## 4. Le lyrisme
La poésie **lyrique** exprime les sentiments personnels (amour, douleur, joie, fuite du temps). Elle emploie la **1re personne**, l'apostrophe et l'exclamation. Le thème du **carpe diem** (« cueille le jour ») invite à profiter de l'instant.

## 5. Les images poétiques
La poésie crée des images : **comparaison** (avec « comme »), **métaphore** (sans outil de comparaison), **personnification** (donner vie à une chose). Ces figures rendent le texte plus suggestif.

## L'essentiel à retenir
- Le vers se compte en **syllabes** : alexandrin (12), décasyllabe (10), octosyllabe (8).
- Rimes **plates** (AABB), **croisées** (ABAB), **embrassées** (ABBA).
- Le **sonnet** = 14 vers (2 quatrains + 2 tercets).
- Le **lyrisme** exprime les sentiments ; **métaphore** et **comparaison** créent les images.$md$),

    ('Le théâtre du XVIIe au XXIe', $md$# Le théâtre du XVIIe au XXIe

## Ce que tu vas comprendre
Le théâtre est un texte écrit pour être **joué**. Du XVIIe au XXIe siècle, il oscille entre rire et larmes, respect des règles et liberté. Ce chapitre t'apprend à distinguer les genres, à lire les registres et à penser la mise en scène.

## 1. Le texte théâtral
Le texte se compose de **répliques** (ce que disent les personnages) et de **didascalies** (indications de jeu, en italique). Une longue réplique adressée à d'autres est une **tirade** ; seul en scène, le personnage prononce un **monologue**. L'**aparté** est dit à part, entendu du public seul.

## 2. Tragédie et comédie classiques
Au XVIIe siècle, le **classicisme** impose la **règle des trois unités** (action, lieu, temps).
- La **tragédie** (Corneille, Racine) met en scène des héros nobles écrasés par le destin ; elle vise à susciter terreur et pitié.
- La **comédie** (Molière) fait rire pour corriger les mœurs : « castigat ridendo mores ».

## 3. Les registres
Le **registre** est la tonalité produite :
- **tragique** (fatalité, mort), **comique** (rire), **pathétique** (émotion, pitié), **satirique** (critique moqueuse). Le comique se décline en gestes, mots, situations et caractères.

## 4. Du drame au théâtre moderne
Au XIXe, le **drame romantique** (Hugo) mêle les genres et brise les unités. Au XXe, le **théâtre de l'absurde** (Ionesco, Beckett) rompt avec l'intrigue traditionnelle pour dire le non-sens du monde.

## 5. La mise en scène
Un même texte donne mille spectacles : le **metteur en scène** choisit décor, costumes, lumières, jeu des acteurs. La **double énonciation** fait qu'un personnage parle à un autre tout en s'adressant au public.

## L'essentiel à retenir
- **Répliques** + **didascalies** ; tirade, monologue, aparté.
- Classicisme = **règle des trois unités** (action, lieu, temps).
- **Tragédie** : héros nobles, destin ; **comédie** : rire pour corriger les mœurs.
- Registres : tragique, comique, pathétique, satirique ; la **mise en scène** interprète le texte.$md$),

    ('La littérature d''idées et la presse', $md$# La littérature d'idées et la presse

## Ce que tu vas comprendre
La littérature d'idées cherche à convaincre, persuader ou faire réfléchir. De l'humanisme aux Lumières jusqu'à la presse d'aujourd'hui, elle défend des valeurs et dénonce des abus. Ce chapitre t'apprend les outils de l'argumentation.

## 1. Convaincre, persuader, délibérer
Argumenter, c'est défendre une **thèse** à l'aide d'**arguments** et d'**exemples**.
- **Convaincre** s'adresse à la raison (logique, preuves).
- **Persuader** touche les émotions (registre pathétique, images).
- **Délibérer**, c'est peser le pour et le contre avant de trancher.

## 2. L'argumentation directe et indirecte
- **Directe** : l'auteur défend ouvertement son idée (essai, discours, article).
- **Indirecte** : l'idée passe par une fiction (fable, conte philosophique, apologue).

*Exemple : dans « Candide », Voltaire critique l'optimisme et la guerre à travers un conte.*

## 3. Humanisme et Lumières
- L'**humanisme** (XVIe : Rabelais, Montaigne) place l'homme et le savoir au centre, prône la tolérance et l'esprit critique.
- Les **Lumières** (XVIIIe : Voltaire, Rousseau, Diderot) combattent l'ignorance, l'intolérance et l'injustice ; l'**Encyclopédie** diffuse les connaissances.

## 4. L'essai et les formes brèves
L'**essai** (Montaigne) réfléchit librement sur un sujet. D'autres formes servent l'idée : la **maxime**, la **lettre**, le **pamphlet** (texte violent) et le **dialogue** philosophique.

## 5. La presse et l'information
La **presse** informe et prend position : l'**éditorial** défend un point de vue, la **tribune** donne la parole à un invité. Il faut distinguer les **faits** (vérifiables) des **opinions**, et rester vigilant face aux sources.

## L'essentiel à retenir
- **Convaincre** (raison), **persuader** (émotion), **délibérer** (peser le pour et le contre).
- Argumentation **directe** (essai, discours) ou **indirecte** (fable, conte philosophique).
- **Humanisme** = l'homme et le savoir ; **Lumières** = combat contre l'ignorance et l'injustice.
- Dans la presse, distinguer les **faits** des **opinions**.$md$),

    ('Méthode du commentaire', $md$# Méthode du commentaire

## Ce que tu vas comprendre
Le **commentaire de texte** est une analyse organisée qui explique comment un texte produit du sens et de l'effet. Ce chapitre te donne la méthode complète : lire, repérer les procédés, bâtir un plan, rédiger.

## 1. Lire et situer le texte
Avant d'écrire, on lit plusieurs fois. On repère le **genre**, l'**objet d'étude**, le **thème** et l'**enjeu** du passage. On formule une **problématique** : la question à laquelle le commentaire répond.

## 2. Repérer les procédés
Un commentaire s'appuie sur des **procédés d'écriture** précis (pas un simple résumé) :
- **figures de style** : métaphore, comparaison, personnification, hyperbole, antithèse ;
- **lexique** (champs lexicaux), **temps verbaux**, **rythme** et **ponctuation**, **sonorités** (allitérations, assonances).

## 3. De l'observation à l'interprétation
Chaque procédé doit être **interprété** : on ne se contente pas de nommer, on dit **quel effet** il produit et **ce qu'il apporte** au sens.

*Exemple : une accumulation d'adjectifs sombres crée une atmosphère angoissante et souligne le désespoir du personnage.*

## 4. Construire le plan
Le commentaire s'organise en **deux ou trois axes** (grandes parties), chacun répondant à la problématique. Chaque axe se divise en **sous-parties** appuyées sur des **citations** courtes et commentées. On évite le plan « ligne à ligne ».

## 5. Rédiger : introduction, développement, conclusion
- **Introduction** : présentation, situation, problématique, annonce du plan.
- **Développement** : axes reliés par des **transitions**, citations analysées.
- **Conclusion** : bilan des axes puis **ouverture** vers une autre œuvre ou question.

## L'essentiel à retenir
- Poser une **problématique** avant de rédiger.
- S'appuyer sur des **procédés d'écriture**, pas sur un résumé.
- Toujours **interpréter** : nommer le procédé ET son effet.
- Plan en **axes** avec citations ; introduction, développement (transitions), conclusion (ouverture).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le roman et le récit', $json${
      "centre": "Le roman et le récit",
      "branches": [
        { "titre": "Le personnage", "enfants": ["Portrait physique et moral", "Statut social, évolution", "Héros ou antihéros"] },
        { "titre": "La narration", "enfants": ["Narrateur ≠ auteur", "1re ou 3e personne", "Points de vue : omniscient, interne, externe"] },
        { "titre": "Le rythme du récit", "enfants": ["Sommaire, scène, ellipse, pause", "Analepse (retour en arrière)", "Prolepse (anticipation)"] },
        { "titre": "Réalisme et naturalisme", "enfants": ["Réalisme : illusion du vrai", "Naturalisme : méthode scientifique", "Milieu et hérédité (Zola)"] }
      ]
    }$json$),
    ('La poésie du Moyen Âge au XVIIIe', $json${
      "centre": "La poésie du Moyen Âge au XVIIIe",
      "branches": [
        { "titre": "Versification", "enfants": ["Alexandrin (12), décasyllabe (10)", "Octosyllabe (8 syllabes)", "e muet, diérèse"] },
        { "titre": "Les rimes", "enfants": ["Plates AABB", "Croisées ABAB", "Embrassées ABBA"] },
        { "titre": "Formes fixes", "enfants": ["Sonnet : 14 vers", "2 quatrains + 2 tercets", "Ballade, rondeau, ode, fable"] },
        { "titre": "Lyrisme et images", "enfants": ["Expression des sentiments", "Carpe diem", "Métaphore, comparaison, personnification"] }
      ]
    }$json$),
    ('Le théâtre du XVIIe au XXIe', $json${
      "centre": "Le théâtre du XVIIe au XXIe",
      "branches": [
        { "titre": "Le texte théâtral", "enfants": ["Répliques et didascalies", "Tirade, monologue, aparté", "Double énonciation"] },
        { "titre": "Genres classiques", "enfants": ["Règle des trois unités", "Tragédie : destin (Racine)", "Comédie : rire (Molière)"] },
        { "titre": "Les registres", "enfants": ["Tragique, pathétique", "Comique, satirique", "Formes du comique"] },
        { "titre": "Théâtre et mise en scène", "enfants": ["Drame romantique (Hugo)", "Absurde (Ionesco, Beckett)", "Décor, lumières, jeu"] }
      ]
    }$json$),
    ('La littérature d''idées et la presse', $json${
      "centre": "La littérature d'idées et la presse",
      "branches": [
        { "titre": "Argumenter", "enfants": ["Convaincre : la raison", "Persuader : les émotions", "Délibérer : le pour et le contre"] },
        { "titre": "Directe / indirecte", "enfants": ["Directe : essai, discours", "Indirecte : fable, conte", "Candide de Voltaire"] },
        { "titre": "Humanisme et Lumières", "enfants": ["Humanisme : l'homme, le savoir", "Lumières : contre l'injustice", "L'Encyclopédie"] },
        { "titre": "La presse", "enfants": ["Éditorial, tribune", "Faits vs opinions", "Vérifier les sources"] }
      ]
    }$json$),
    ('Méthode du commentaire', $json${
      "centre": "Méthode du commentaire",
      "branches": [
        { "titre": "Lire et situer", "enfants": ["Genre, thème, enjeu", "Formuler une problématique", "Plusieurs lectures"] },
        { "titre": "Repérer les procédés", "enfants": ["Figures de style", "Lexique, temps, rythme", "Sonorités"] },
        { "titre": "Interpréter", "enfants": ["Nommer le procédé", "Dire son effet", "Pas de simple résumé"] },
        { "titre": "Construire et rédiger", "enfants": ["Axes et sous-parties", "Citations commentées", "Intro, développement, conclusion"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'francais'
 WHERE c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ce bloc ne fait rien si un quiz existe déjà — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Français', '2de', v.chapter, true, l.id
FROM (VALUES
  ('12319999-0000-4000-8000-000000000001'::uuid, 'Le roman et le récit'),
  ('12319999-0000-4000-8000-000000000002'::uuid, 'La poésie du Moyen Âge au XVIIIe'),
  ('12319999-0000-4000-8000-000000000003'::uuid, 'Le théâtre du XVIIe au XXIe'),
  ('12319999-0000-4000-8000-000000000004'::uuid, 'La littérature d''idées et la presse'),
  ('12319999-0000-4000-8000-000000000005'::uuid, 'Méthode du commentaire')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
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
  -- Chapitre 1 — Le roman et le récit
  ('12310000-0000-4000-8000-000000000104'::uuid, 'Le roman et le récit',
   'Dans un récit, qui est la voix qui raconte l''histoire ?', 'mcq',
   '["Le narrateur", "L''auteur", "Le personnage principal", "Le lecteur"]', 0,
   'Le narrateur est la voix qui raconte ; il ne se confond pas avec l''auteur, personne réelle.', 4),
  ('12310000-0000-4000-8000-000000000105'::uuid, 'Le roman et le récit',
   'Quel point de vue permet au narrateur de tout savoir, y compris les pensées des personnages ?', 'mcq',
   '["Le point de vue omniscient", "Le point de vue externe", "Le point de vue interne", "Le point de vue neutre"]', 0,
   'Le point de vue omniscient donne au narrateur une connaissance totale des faits et des pensées.', 5),
  ('12310000-0000-4000-8000-000000000106'::uuid, 'Le roman et le récit',
   'Le naturalisme applique au roman une méthode d''inspiration scientifique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le naturalisme (Zola) étudie l''influence du milieu et de l''hérédité à la manière d''une expérience.', 6),
  ('12310000-0000-4000-8000-000000000107'::uuid, 'Le roman et le récit',
   'Comment appelle-t-on un retour en arrière dans la chronologie du récit ?', 'mcq',
   '["Une analepse", "Une prolepse", "Une ellipse", "Une pause"]', 0,
   'L''analepse est un retour en arrière ; la prolepse est une anticipation.', 7),
  ('12310000-0000-4000-8000-000000000108'::uuid, 'Le roman et le récit',
   'Quel procédé consiste à passer sous silence une période du récit ?', 'mcq',
   '["L''ellipse", "La scène", "Le sommaire", "La description"]', 0,
   'L''ellipse saute une période de l''histoire ; le sommaire, lui, la résume rapidement.', 8),
  ('12310000-0000-4000-8000-000000000109'::uuid, 'Le roman et le récit',
   'Le réalisme cherche à donner au lecteur l''illusion du vrai.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le réalisme multiplie décors précis et détails du quotidien pour imiter la réalité.', 9),
  ('12310000-0000-4000-8000-000000000110'::uuid, 'Le roman et le récit',
   'Dans un récit à la première personne, quel pronom emploie le narrateur ?', 'mcq',
   '["Je", "Il", "Nous", "On"]', 0,
   'Le narrateur interne raconte à la première personne : « je ».', 10),

  -- Chapitre 2 — La poésie du Moyen Âge au XVIIIe
  ('12310000-0000-4000-8000-000000000204'::uuid, 'La poésie du Moyen Âge au XVIIIe',
   'Combien de syllabes compte un alexandrin ?', 'mcq',
   '["12", "10", "8", "14"]', 0,
   'L''alexandrin est un vers de 12 syllabes ; le décasyllabe en a 10, l''octosyllabe 8.', 4),
  ('12310000-0000-4000-8000-000000000205'::uuid, 'La poésie du Moyen Âge au XVIIIe',
   'Comment nomme-t-on des rimes disposées selon le schéma ABAB ?', 'mcq',
   '["Rimes croisées", "Rimes plates", "Rimes embrassées", "Rimes riches"]', 0,
   'Le schéma ABAB correspond aux rimes croisées ; AABB = plates, ABBA = embrassées.', 5),
  ('12310000-0000-4000-8000-000000000206'::uuid, 'La poésie du Moyen Âge au XVIIIe',
   'Un sonnet est composé de 14 vers.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le sonnet compte 14 vers, répartis en deux quatrains et deux tercets.', 6),
  ('12310000-0000-4000-8000-000000000207'::uuid, 'La poésie du Moyen Âge au XVIIIe',
   'Quelle figure rapproche deux éléments à l''aide du mot « comme » ?', 'mcq',
   '["La comparaison", "La métaphore", "La personnification", "L''hyperbole"]', 0,
   'La comparaison utilise un outil comme « comme » ; la métaphore, elle, s''en passe.', 7),
  ('12310000-0000-4000-8000-000000000208'::uuid, 'La poésie du Moyen Âge au XVIIIe',
   'Que désigne le thème du « carpe diem » en poésie ?', 'mcq',
   '["Profiter de l''instant présent", "Craindre la mort", "Louer un roi", "Décrire un paysage"]', 0,
   '« Carpe diem » signifie « cueille le jour » : il invite à profiter du moment présent.', 8),
  ('12310000-0000-4000-8000-000000000209'::uuid, 'La poésie du Moyen Âge au XVIIIe',
   'La poésie lyrique exprime avant tout les sentiments personnels du poète.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le lyrisme exprime les émotions (amour, douleur, joie), souvent à la première personne.', 9),
  ('12310000-0000-4000-8000-000000000210'::uuid, 'La poésie du Moyen Âge au XVIIIe',
   'Combien de syllabes compte un octosyllabe ?', 'mcq',
   '["8", "10", "12", "6"]', 0,
   'L''octosyllabe est un vers de 8 syllabes.', 10),

  -- Chapitre 3 — Le théâtre du XVIIe au XXIe
  ('12310000-0000-4000-8000-000000000304'::uuid, 'Le théâtre du XVIIe au XXIe',
   'Comment nomme-t-on les indications de mise en scène dans un texte de théâtre ?', 'mcq',
   '["Les didascalies", "Les répliques", "Les tirades", "Les strophes"]', 0,
   'Les didascalies sont les indications de jeu et de décor, souvent en italique.', 4),
  ('12310000-0000-4000-8000-000000000305'::uuid, 'Le théâtre du XVIIe au XXIe',
   'La règle classique des trois unités concerne l''action, le lieu et le temps.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le théâtre classique respecte les unités d''action, de lieu et de temps.', 5),
  ('12310000-0000-4000-8000-000000000306'::uuid, 'Le théâtre du XVIIe au XXIe',
   'Quel dramaturge du XVIIe siècle est célèbre pour ses comédies ?', 'mcq',
   '["Molière", "Racine", "Corneille", "Hugo"]', 0,
   'Molière est le grand auteur de comédies du XVIIe siècle ; Racine et Corneille écrivent des tragédies.', 6),
  ('12310000-0000-4000-8000-000000000307'::uuid, 'Le théâtre du XVIIe au XXIe',
   'Comment appelle-t-on le discours d''un personnage seul en scène ?', 'mcq',
   '["Un monologue", "une tirade", "Un aparté", "Un dialogue"]', 0,
   'Le monologue est prononcé par un personnage seul ; la tirade est une longue réplique adressée à d''autres.', 7),
  ('12310000-0000-4000-8000-000000000308'::uuid, 'Le théâtre du XVIIe au XXIe',
   'Quel registre est lié à la fatalité et à la mort des héros ?', 'mcq',
   '["Le registre tragique", "Le registre comique", "Le registre satirique", "Le registre lyrique"]', 0,
   'Le registre tragique met en jeu le destin, la fatalité et la mort.', 8),
  ('12310000-0000-4000-8000-000000000309'::uuid, 'Le théâtre du XVIIe au XXIe',
   'Le théâtre de l''absurde du XXe siècle respecte fidèlement les règles classiques.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le théâtre de l''absurde (Ionesco, Beckett) rompt avec l''intrigue et les règles traditionnelles.', 9),
  ('12310000-0000-4000-8000-000000000310'::uuid, 'Le théâtre du XVIIe au XXIe',
   'Qui décide du décor, des costumes et du jeu des acteurs lors d''un spectacle ?', 'mcq',
   '["Le metteur en scène", "L''auteur", "Le spectateur", "Le narrateur"]', 0,
   'Le metteur en scène interprète le texte en choisissant décor, costumes, lumières et jeu.', 10),

  -- Chapitre 4 — La littérature d'idées et la presse
  ('12310000-0000-4000-8000-000000000404'::uuid, 'La littérature d''idées et la presse',
   'Quel verbe désigne le fait de s''adresser à la raison par des preuves ?', 'mcq',
   '["Convaincre", "Persuader", "Délibérer", "Décrire"]', 0,
   'Convaincre s''adresse à la raison (logique, preuves) ; persuader touche les émotions.', 4),
  ('12310000-0000-4000-8000-000000000405'::uuid, 'La littérature d''idées et la presse',
   'Le conte philosophique « Candide » est une argumentation indirecte.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : Voltaire y défend ses idées à travers une fiction, c''est une argumentation indirecte.', 5),
  ('12310000-0000-4000-8000-000000000406'::uuid, 'La littérature d''idées et la presse',
   'À quel siècle se rattache le mouvement des Lumières ?', 'mcq',
   '["Le XVIIIe siècle", "Le XVIe siècle", "Le XVIIe siècle", "Le XIXe siècle"]', 0,
   'Les Lumières (Voltaire, Rousseau, Diderot) sont un mouvement du XVIIIe siècle.', 6),
  ('12310000-0000-4000-8000-000000000407'::uuid, 'La littérature d''idées et la presse',
   'Quel écrivain humaniste est l''auteur des « Essais » ?', 'mcq',
   '["Montaigne", "Zola", "Racine", "Ronsard"]', 0,
   'Montaigne, penseur humaniste du XVIe siècle, est l''auteur des « Essais ».', 7),
  ('12310000-0000-4000-8000-000000000408'::uuid, 'La littérature d''idées et la presse',
   'Dans la presse, un éditorial défend un point de vue.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : l''éditorial exprime la position de la rédaction ou de son auteur sur un sujet.', 8),
  ('12310000-0000-4000-8000-000000000409'::uuid, 'La littérature d''idées et la presse',
   'Que faut-il distinguer avec soin quand on lit un article de presse ?', 'mcq',
   '["Les faits et les opinions", "Les titres et les images", "Les mots et les phrases", "Le papier et l''écran"]', 0,
   'Il faut distinguer les faits (vérifiables) des opinions (points de vue) et vérifier les sources.', 9),
  ('12310000-0000-4000-8000-000000000410'::uuid, 'La littérature d''idées et la presse',
   'Quel mouvement du XVIe siècle place l''homme et le savoir au centre ?', 'mcq',
   '["L''humanisme", "Le naturalisme", "Le classicisme", "Le romantisme"]', 0,
   'L''humanisme (Rabelais, Montaigne) place l''homme, le savoir et la tolérance au centre.', 10),

  -- Chapitre 5 — Méthode du commentaire
  ('12310000-0000-4000-8000-000000000504'::uuid, 'Méthode du commentaire',
   'Comment nomme-t-on la question centrale à laquelle répond le commentaire ?', 'mcq',
   '["La problématique", "La conclusion", "Le résumé", "La citation"]', 0,
   'La problématique est la question directrice à laquelle tout le commentaire répond.', 4),
  ('12310000-0000-4000-8000-000000000505'::uuid, 'Méthode du commentaire',
   'Un bon commentaire se contente de résumer le texte.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le commentaire analyse les procédés d''écriture et leurs effets, il ne résume pas.', 5),
  ('12310000-0000-4000-8000-000000000506'::uuid, 'Méthode du commentaire',
   'Que faut-il faire après avoir repéré un procédé d''écriture ?', 'mcq',
   '["Interpréter son effet", "Passer au suivant", "Le recopier sans plus", "L''ignorer"]', 0,
   'Il faut interpréter le procédé : dire quel effet il produit et ce qu''il apporte au sens.', 6),
  ('12310000-0000-4000-8000-000000000507'::uuid, 'Méthode du commentaire',
   'Comment appelle-t-on les grandes parties qui structurent le commentaire ?', 'mcq',
   '["Les axes", "Les vers", "Les strophes", "Les répliques"]', 0,
   'Le commentaire s''organise en deux ou trois axes, chacun répondant à la problématique.', 7),
  ('12310000-0000-4000-8000-000000000508'::uuid, 'Méthode du commentaire',
   'Une métaphore est une figure de style que l''on peut repérer dans un texte.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la métaphore est une figure de style, l''un des procédés à analyser dans un commentaire.', 8),
  ('12310000-0000-4000-8000-000000000509'::uuid, 'Méthode du commentaire',
   'Par quoi se termine idéalement la conclusion d''un commentaire ?', 'mcq',
   '["Une ouverture", "Une citation nouvelle", "Une problématique", "Un titre"]', 0,
   'La conclusion fait le bilan des axes puis propose une ouverture vers une autre œuvre ou question.', 9),
  ('12310000-0000-4000-8000-000000000510'::uuid, 'Méthode du commentaire',
   'Que relie-t-on entre les grandes parties d''un développement ?', 'mcq',
   '["Des transitions", "Des rimes", "Des didascalies", "Des exemples"]', 0,
   'Des transitions relient les axes du développement pour assurer la cohérence du propos.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
