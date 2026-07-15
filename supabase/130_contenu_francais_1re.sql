-- =============================================================================
-- Studuel — Migration 130 : CONTENU Français 1re (+ exercices type bac)
-- Remplit les 5 chapitres de Français 1re (programme, épreuves anticipées) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type BAC corrigés pas à pas par chapitre.
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
    ('La poésie du XIXe au XXIe siècle', $md$# La poésie du XIXe au XXIe siècle

## Ce que tu vas comprendre
Du romantisme aux avant-gardes, la poésie n'a cessé de se réinventer. Ce chapitre te donne les repères (mouvements, auteurs) et les outils (versification, figures de style) pour analyser un poème au bac.

## 1. Le romantisme (première moitié du XIXe)
Le romantisme place le **moi**, les **sentiments** et la **nature** au cœur du poème. Le poète exprime sa mélancolie (le « mal du siècle ») et son lyrisme. Figures majeures : **Lamartine**, **Hugo**, **Musset**, **Vigny**.

*Exemple : « Le Lac » de Lamartine chante la fuite du temps et l'amour perdu.*

## 2. Le Parnasse et le symbolisme
- Le **Parnasse** (Leconte de Lisle, Gautier) prône « l'art pour l'art » : la beauté formelle et l'impersonnalité.
- Le **symbolisme** (Baudelaire en précurseur, Verlaine, Rimbaud, Mallarmé) cherche à **suggérer** plutôt qu'à décrire, et explore les **correspondances** entre le monde sensible et l'invisible.

## 3. La modernité poétique (XXe-XXIe)
Apollinaire supprime la ponctuation (« Alcools », 1913). Le **surréalisme** (Breton, Éluard) libère l'image et l'inconscient (écriture automatique). La poésie contemporaine explore le quotidien, le **vers libre** et le poème en prose.

## 4. Vers et versification
- On compte les **syllabes** : l'**alexandrin** compte 12 syllabes, le **décasyllabe** 10, l'**octosyllabe** 8.
- La **rime** peut être **plate** (AABB), **croisée** (ABAB) ou **embrassée** (ABBA).
- Le **e** muet se prononce à l'intérieur du vers (sauf devant voyelle), mais pas en fin de vers.

## 5. Les figures de style essentielles
- **Comparaison** (avec outil : « comme ») et **métaphore** (sans outil).
- **Personnification**, **allégorie** (une idée abstraite incarnée).
- **Anaphore** (répétition en début de vers), **hyperbole** (exagération), **oxymore** (« soleil noir »).

## L'essentiel à retenir
- Trois grands moments : **romantisme** (le moi), **symbolisme** (suggérer), **modernité** (libérer le vers).
- L'**alexandrin** = 12 syllabes ; rimes plates (AABB), croisées (ABAB), embrassées (ABBA).
- La **métaphore** rapproche deux éléments sans outil de comparaison ; l'**allégorie** incarne une idée.
- On analyse un poème en liant le **fond** (thème, sentiment) et la **forme** (mètre, sonorités, images).$md$),

    ('Le roman : parcours bac', $md$# Le roman : parcours bac

## Ce que tu vas comprendre
Le roman raconte une histoire à travers des personnages. Au bac, on analyse la construction du récit, la figure du personnage et le regard que le romancier porte sur le monde.

## 1. Le personnage de roman
Le personnage est une **construction** de papier. On le caractérise par son **portrait** (physique et moral), ses **actions** et ses **paroles**. Il peut être un **héros** admirable ou un **antihéros** ordinaire, voire médiocre.

## 2. Le narrateur et le point de vue
- Le **narrateur** peut être **externe** (récit à la 3e personne) ou **interne** (« je », première personne).
- Les **focalisations** : **zéro** (narrateur omniscient qui sait tout), **interne** (on suit un personnage), **externe** (simple témoin extérieur).

## 3. Réalisme et naturalisme (XIXe)
- Le **réalisme** (Balzac, Stendhal, Flaubert) peint la société telle qu'elle est, avec précision.
- Le **naturalisme** (Zola) pousse plus loin : il adopte une démarche quasi scientifique et montre l'influence du **milieu** social et de l'**hérédité** sur les personnages.

## 4. Du romanesque au roman moderne
Le roman du XXe siècle remet en cause le personnage et l'intrigue : le **Nouveau Roman** (Robbe-Grillet, Sarraute) efface le héros traditionnel. Le récit devient parfois fragmenté, introspectif, sans intrigue nette.

## 5. Le rythme et la construction du récit
- La **scène** ralentit le temps (dialogue), le **sommaire** résume, l'**ellipse** saute une période.
- L'**incipit** (le début) et l'**excipit** (la fin) sont des passages clés à analyser.

## L'essentiel à retenir
- Le personnage est un **être de papier** : héros ou antihéros.
- **Focalisations** : zéro (omniscient), interne (un personnage), externe (témoin).
- **Réalisme** = peindre le réel ; **naturalisme** (Zola) = milieu social et hérédité.
- Le **rythme** joue sur scène, sommaire, ellipse ; **incipit** et **excipit** sont décisifs.$md$),

    ('Le théâtre : parcours bac', $md$# Le théâtre : parcours bac

## Ce que tu vas comprendre
Le théâtre est un texte destiné à être **joué**. Ce chapitre distingue les genres, explique les codes de l'écriture dramatique et rappelle que le sens naît aussi de la **représentation**.

## 1. Un double langage : texte et représentation
Une pièce comporte les **répliques** (ce que disent les personnages) et les **didascalies** (indications de jeu, de décor, de ton). Le sens complet naît sur scène : voix, gestes, mise en scène, lumière.

## 2. La tragédie
La **tragédie** (Corneille, Racine) met en scène des personnages nobles écrasés par le **destin**, la passion ou le devoir. Elle vise la **catharsis** (purification des passions par la terreur et la pitié). Le dénouement est souvent funeste.

## 3. La comédie
La **comédie** (Molière) fait rire pour **corriger les mœurs** (« castigat ridendo mores »). Elle recourt au comique de mots, de gestes, de situation et de caractère. Elle peut porter une véritable critique sociale.

## 4. Les règles classiques et leur dépassement
Le théâtre classique respecte la **règle des trois unités** (action, temps, lieu) et la **bienséance**. Au XIXe, le **drame romantique** (Hugo) brise ces règles et mêle le sublime et le grotesque. Le XXe invente le théâtre de l'**absurde** (Ionesco, Beckett).

## 5. Les formes du dialogue
- La **tirade** : une longue réplique.
- Le **monologue** : un personnage seul en scène se parle à lui-même.
- La **stichomythie** : des répliques très courtes qui s'enchaînent (tension).
- L'**aparté** : des mots destinés au seul spectateur.

## L'essentiel à retenir
- Le texte théâtral = **répliques** + **didascalies** ; il s'accomplit dans la **représentation**.
- **Tragédie** : destin, catharsis ; **comédie** : rire pour corriger les mœurs.
- Règle classique des **trois unités** ; le **drame romantique** (Hugo) la brise.
- Formes du dialogue : **tirade**, **monologue**, **stichomythie**, **aparté**.$md$),

    ('La littérature d''idées', $md$# La littérature d'idées

## Ce que tu vas comprendre
La littérature d'idées cherche à **convaincre**, **persuader** ou **délibérer**. De l'humanisme aux Lumières, les écrivains y défendent des valeurs et critiquent leur société.

## 1. Convaincre, persuader, délibérer
- **Convaincre** : s'adresser à la **raison** par des arguments et des preuves logiques.
- **Persuader** : toucher les **émotions** et la sensibilité du destinataire.
- **Délibérer** : peser le pour et le contre pour aboutir à un choix.

## 2. Argumentation directe et indirecte
- **Directe** : l'auteur expose sa thèse ouvertement (essai, pamphlet, discours).
- **Indirecte** : la thèse passe par une fiction (**apologue**, fable, conte philosophique, utopie).

*Exemple : « Candide » de Voltaire critique l'optimisme béat par le récit.*

## 3. L'humanisme (XVIe siècle)
L'**humanisme** (Montaigne, Rabelais, Érasme) place l'**homme** et le savoir antique au centre. Il défend la **tolérance**, l'éducation et l'esprit critique. Montaigne, dans les **Essais**, invente une écriture de soi.

## 4. Les Lumières (XVIIIe siècle)
Les **Lumières** (Voltaire, Rousseau, Diderot, Montesquieu) combattent l'obscurantisme au nom de la **raison**, du **progrès** et de la **liberté**. L'**Encyclopédie** diffuse les savoirs. Ils critiquent l'intolérance, l'esclavage et l'absolutisme.

## 5. Les outils de l'argumentation
- La **thèse** (l'idée défendue), l'**argument** (la raison), l'**exemple** (l'illustration).
- Le **connecteur logique** (cependant, donc, car) structure le raisonnement.
- L'**ironie** feint de dire le contraire de ce que l'on pense, pour critiquer.

## L'essentiel à retenir
- **Convaincre** (la raison), **persuader** (l'émotion), **délibérer** (le choix).
- Argumentation **directe** (essai, discours) ou **indirecte** (apologue, conte philosophique).
- **Humanisme** (XVIe) : l'homme, la tolérance ; **Lumières** (XVIIIe) : raison, progrès, liberté.
- Thèse, argument, exemple, connecteurs et **ironie** sont les outils de l'argumentation.$md$),

    ('Dissertation et oral du bac', $md$# Dissertation et oral du bac

## Ce que tu vas comprendre
Les épreuves anticipées de français comportent un **écrit** (commentaire ou dissertation) et un **oral** (explication linéaire + question de grammaire + entretien). Ce chapitre en donne la méthode.

## 1. La dissertation : analyser le sujet
La dissertation porte sur une **œuvre** et son **parcours**. On analyse le sujet, on définit les mots-clés, puis on formule une **problématique** (la question que soulève le sujet).

## 2. Le plan dialectique
Le plan le plus fréquent est **dialectique** :
- **Thèse** : on défend l'idée du sujet.
- **Antithèse** : on la nuance ou on la conteste.
- **Synthèse** : on dépasse l'opposition.
Chaque partie comporte des **arguments** appuyés sur des **exemples précis** tirés des œuvres.

## 3. Le commentaire de texte
Le **commentaire** analyse un texte de façon organisée, par **axes de lecture**. On relie toujours un **procédé** (figure, rythme, champ lexical) à un **effet** ou un sens. On rédige une introduction, un développement et une conclusion.

## 4. L'explication linéaire (oral)
À l'oral, l'**explication linéaire** suit le texte **dans l'ordre**, mouvement par mouvement. On dégage un **projet de lecture**, on explique les procédés au fil du texte, puis on conclut.

## 5. La question de grammaire et l'entretien
- La **question de grammaire** porte sur une phrase du texte : analyse d'une **proposition subordonnée**, d'une **négation** ou d'une **interrogation**.
- L'**entretien** porte sur une œuvre choisie par le candidat : il faut savoir la présenter et justifier son intérêt.

## L'essentiel à retenir
- Écrit : **commentaire** ou **dissertation** ; oral : **explication linéaire** + **grammaire** + **entretien**.
- La dissertation exige une **problématique** et souvent un **plan dialectique** (thèse / antithèse / synthèse).
- Dans un commentaire, on relie toujours un **procédé** à un **effet** de sens.
- L'explication linéaire suit le texte **dans l'ordre**, guidée par un **projet de lecture**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La poésie du XIXe au XXIe siècle', $json${
      "centre": "La poésie du XIXe au XXIe siècle",
      "branches": [
        { "titre": "Romantisme", "enfants": ["Le moi, les sentiments, la nature", "Le « mal du siècle »", "Lamartine, Hugo, Musset"] },
        { "titre": "Parnasse et symbolisme", "enfants": ["« L'art pour l'art »", "Suggérer plutôt que décrire", "Baudelaire, Verlaine, Rimbaud"] },
        { "titre": "Modernité", "enfants": ["Apollinaire : plus de ponctuation", "Surréalisme (Breton, Éluard)", "Vers libre, poème en prose"] },
        { "titre": "Outils d'analyse", "enfants": ["Alexandrin = 12 syllabes", "Rimes plates, croisées, embrassées", "Métaphore, allégorie, oxymore"] }
      ]
    }$json$),
    ('Le roman : parcours bac', $json${
      "centre": "Le roman : parcours bac",
      "branches": [
        { "titre": "Le personnage", "enfants": ["Être de papier", "Portrait, actions, paroles", "Héros ou antihéros"] },
        { "titre": "Narrateur et point de vue", "enfants": ["Externe (il) ou interne (je)", "Focalisation zéro = omniscient", "Interne / externe"] },
        { "titre": "Réalisme et naturalisme", "enfants": ["Balzac, Flaubert : peindre le réel", "Zola : milieu et hérédité", "Démarche quasi scientifique"] },
        { "titre": "Construction du récit", "enfants": ["Scène, sommaire, ellipse", "Incipit (début), excipit (fin)", "Nouveau Roman efface le héros"] }
      ]
    }$json$),
    ('Le théâtre : parcours bac', $json${
      "centre": "Le théâtre : parcours bac",
      "branches": [
        { "titre": "Texte et représentation", "enfants": ["Répliques + didascalies", "Le sens naît sur scène", "Voix, gestes, mise en scène"] },
        { "titre": "Tragédie", "enfants": ["Destin, passion, devoir", "Catharsis", "Corneille, Racine"] },
        { "titre": "Comédie", "enfants": ["Rire pour corriger les mœurs", "Comique de mots, de situation", "Molière"] },
        { "titre": "Règles et formes", "enfants": ["Trois unités (action, temps, lieu)", "Drame romantique (Hugo)", "Tirade, monologue, aparté"] }
      ]
    }$json$),
    ('La littérature d''idées', $json${
      "centre": "La littérature d'idées",
      "branches": [
        { "titre": "Trois visées", "enfants": ["Convaincre = la raison", "Persuader = l'émotion", "Délibérer = le choix"] },
        { "titre": "Directe / indirecte", "enfants": ["Directe : essai, discours", "Indirecte : apologue, conte", "Candide critique par la fiction"] },
        { "titre": "Humanisme (XVIe)", "enfants": ["L'homme au centre", "Tolérance, éducation", "Montaigne, les Essais"] },
        { "titre": "Lumières (XVIIIe)", "enfants": ["Raison, progrès, liberté", "L'Encyclopédie", "Voltaire, Rousseau, Diderot"] }
      ]
    }$json$),
    ('Dissertation et oral du bac', $json${
      "centre": "Dissertation et oral du bac",
      "branches": [
        { "titre": "La dissertation", "enfants": ["Analyser le sujet", "Définir les mots-clés", "Formuler une problématique"] },
        { "titre": "Plan dialectique", "enfants": ["Thèse", "Antithèse", "Synthèse"] },
        { "titre": "Le commentaire", "enfants": ["Axes de lecture", "Relier procédé et effet", "Intro, développement, conclusion"] },
        { "titre": "L'oral", "enfants": ["Explication linéaire (dans l'ordre)", "Question de grammaire", "Entretien sur une œuvre"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'francais'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 1re ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Français', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13019999-0000-4000-8000-000000000001'::uuid, 'La poésie du XIXe au XXIe siècle'),
  ('13019999-0000-4000-8000-000000000002'::uuid, 'Le roman : parcours bac'),
  ('13019999-0000-4000-8000-000000000003'::uuid, 'Le théâtre : parcours bac'),
  ('13019999-0000-4000-8000-000000000004'::uuid, 'La littérature d''idées'),
  ('13019999-0000-4000-8000-000000000005'::uuid, 'Dissertation et oral du bac')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
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
  -- Chapitre 1 — La poésie du XIXe au XXIe siècle
  ('13010000-0000-4000-8000-000000000104'::uuid, 'La poésie du XIXe au XXIe siècle',
   'Combien de syllabes compte un alexandrin ?', 'mcq',
   '["Douze", "Dix", "Huit", "Quatorze"]', 0,
   'L''alexandrin est un vers de douze syllabes.', 4),
  ('13010000-0000-4000-8000-000000000105'::uuid, 'La poésie du XIXe au XXIe siècle',
   'Quel mouvement place le « moi » et les sentiments au cœur du poème ?', 'mcq',
   '["Le romantisme", "Le naturalisme", "Le classicisme", "Le surréalisme"]', 0,
   'Le romantisme met en avant le moi, les sentiments et la nature.', 5),
  ('13010000-0000-4000-8000-000000000106'::uuid, 'La poésie du XIXe au XXIe siècle',
   'La métaphore se distingue de la comparaison parce qu''elle : ', 'mcq',
   '["n''emploie pas d''outil de comparaison", "emploie toujours « comme »", "répète un même mot", "exagère la réalité"]', 0,
   'La métaphore rapproche deux éléments sans outil de comparaison (contrairement à « comme »).', 6),
  ('13010000-0000-4000-8000-000000000107'::uuid, 'La poésie du XIXe au XXIe siècle',
   'Le symbolisme cherche à suggérer plutôt qu''à décrire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le symbolisme privilégie la suggestion et les correspondances entre le sensible et l''invisible.', 7),
  ('13010000-0000-4000-8000-000000000108'::uuid, 'La poésie du XIXe au XXIe siècle',
   'Qui a supprimé la ponctuation dans le recueil « Alcools » ?', 'mcq',
   '["Apollinaire", "Victor Hugo", "Ronsard", "Lamartine"]', 0,
   'Guillaume Apollinaire a retiré la ponctuation d''« Alcools » (1913).', 8),
  ('13010000-0000-4000-8000-000000000109'::uuid, 'La poésie du XIXe au XXIe siècle',
   'Comment nomme-t-on le rapprochement de deux mots opposés comme « soleil noir » ?', 'mcq',
   '["Un oxymore", "Une anaphore", "Une hyperbole", "Une allégorie"]', 0,
   'L''oxymore réunit dans une même expression deux termes de sens contraire.', 9),
  ('13010000-0000-4000-8000-000000000110'::uuid, 'La poésie du XIXe au XXIe siècle',
   'Une rime est dite « embrassée » lorsqu''elle suit le schéma ABBA.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Rimes embrassées : ABBA ; croisées : ABAB ; plates : AABB.', 10),

  -- Chapitre 2 — Le roman : parcours bac
  ('13010000-0000-4000-8000-000000000204'::uuid, 'Le roman : parcours bac',
   'Comment appelle-t-on un personnage qui n''a rien d''héroïque ?', 'mcq',
   '["Un antihéros", "Un narrateur", "Un dramaturge", "Un protagoniste tragique"]', 0,
   'L''antihéros est un personnage ordinaire, voire médiocre, opposé au héros traditionnel.', 4),
  ('13010000-0000-4000-8000-000000000205'::uuid, 'Le roman : parcours bac',
   'Dans la focalisation zéro, le narrateur : ', 'mcq',
   '["sait tout des personnages", "ne connaît que ce qu''il voit", "est un personnage du récit", "ignore la fin de l''histoire"]', 0,
   'La focalisation zéro correspond au narrateur omniscient, qui sait tout.', 5),
  ('13010000-0000-4000-8000-000000000206'::uuid, 'Le roman : parcours bac',
   'Quel écrivain est le chef de file du naturalisme ?', 'mcq',
   '["Émile Zola", "Pierre Corneille", "Arthur Rimbaud", "Michel de Montaigne"]', 0,
   'Émile Zola a théorisé et illustré le naturalisme.', 6),
  ('13010000-0000-4000-8000-000000000207'::uuid, 'Le roman : parcours bac',
   'Le naturalisme insiste sur l''influence du milieu et de l''hérédité.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Zola applique une démarche « scientifique » : le milieu social et l''hérédité pèsent sur les personnages.', 7),
  ('13010000-0000-4000-8000-000000000208'::uuid, 'Le roman : parcours bac',
   'Comment appelle-t-on les toutes premières lignes d''un roman ?', 'mcq',
   '["L''incipit", "L''excipit", "La didascalie", "La tirade"]', 0,
   'L''incipit est le début du roman ; l''excipit en est la fin.', 8),
  ('13010000-0000-4000-8000-000000000209'::uuid, 'Le roman : parcours bac',
   'Un récit à la première personne (« je ») emploie un narrateur : ', 'mcq',
   '["interne", "omniscient externe", "absent", "didascalique"]', 0,
   'Le « je » correspond à un narrateur interne, qui participe au récit.', 9),
  ('13010000-0000-4000-8000-000000000210'::uuid, 'Le roman : parcours bac',
   'Une ellipse narrative passe sous silence une période de l''histoire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''ellipse saute un moment du récit pour en accélérer le rythme.', 10),

  -- Chapitre 3 — Le théâtre : parcours bac
  ('13010000-0000-4000-8000-000000000304'::uuid, 'Le théâtre : parcours bac',
   'Comment nomme-t-on les indications de mise en scène dans un texte de théâtre ?', 'mcq',
   '["Les didascalies", "Les répliques", "Les strophes", "Les quatrains"]', 0,
   'Les didascalies donnent les indications de jeu, de décor et de ton.', 4),
  ('13010000-0000-4000-8000-000000000305'::uuid, 'Le théâtre : parcours bac',
   'La catharsis est propre à quel genre théâtral ?', 'mcq',
   '["La tragédie", "La comédie", "Le roman", "L''essai"]', 0,
   'La tragédie vise la catharsis, purification des passions par la terreur et la pitié.', 5),
  ('13010000-0000-4000-8000-000000000306'::uuid, 'Le théâtre : parcours bac',
   'Selon la formule classique, la comédie corrige les mœurs par : ', 'mcq',
   '["le rire", "la terreur", "le destin", "la raison"]', 0,
   '« Castigat ridendo mores » : la comédie corrige les mœurs en faisant rire.', 6),
  ('13010000-0000-4000-8000-000000000307'::uuid, 'Le théâtre : parcours bac',
   'La règle classique des trois unités concerne l''action, le temps et le lieu.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les trois unités classiques : une seule action, en un jour, en un lieu.', 7),
  ('13010000-0000-4000-8000-000000000308'::uuid, 'Le théâtre : parcours bac',
   'Comment appelle-t-on le discours d''un personnage seul en scène qui se parle à lui-même ?', 'mcq',
   '["Le monologue", "La stichomythie", "L''aparté", "La tirade"]', 0,
   'Le monologue est la parole d''un personnage seul ; l''aparté s''adresse au seul spectateur.', 8),
  ('13010000-0000-4000-8000-000000000309'::uuid, 'Le théâtre : parcours bac',
   'Quel dramaturge a brisé les règles classiques avec le drame romantique ?', 'mcq',
   '["Victor Hugo", "Jean Racine", "Molière", "Voltaire"]', 0,
   'Victor Hugo, notamment dans la préface de « Cromwell », défend le drame romantique.', 9),
  ('13010000-0000-4000-8000-000000000310'::uuid, 'Le théâtre : parcours bac',
   'Des répliques très courtes échangées rapidement forment une stichomythie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La stichomythie accélère le dialogue et crée de la tension dramatique.', 10),

  -- Chapitre 4 — La littérature d'idées
  ('13010000-0000-4000-8000-000000000404'::uuid, 'La littérature d''idées',
   'Convaincre, c''est s''adresser d''abord à : ', 'mcq',
   '["la raison", "les émotions", "l''imagination", "la mémoire"]', 0,
   'Convaincre repose sur la raison et des arguments logiques ; persuader vise les émotions.', 4),
  ('13010000-0000-4000-8000-000000000405'::uuid, 'La littérature d''idées',
   'Un conte philosophique comme « Candide » relève d''une argumentation : ', 'mcq',
   '["indirecte", "directe", "scientifique", "purement lyrique"]', 0,
   'L''apologue et le conte philosophique défendent une thèse par la fiction : argumentation indirecte.', 5),
  ('13010000-0000-4000-8000-000000000406'::uuid, 'La littérature d''idées',
   'À quel siècle appartient le mouvement des Lumières ?', 'mcq',
   '["Le XVIIIe siècle", "Le XVIe siècle", "Le XIXe siècle", "Le XVIIe siècle"]', 0,
   'Les Lumières se développent au XVIIIe siècle (Voltaire, Rousseau, Diderot).', 6),
  ('13010000-0000-4000-8000-000000000407'::uuid, 'La littérature d''idées',
   'Quel auteur a inventé une écriture de soi avec les « Essais » ?', 'mcq',
   '["Montaigne", "Zola", "Racine", "Apollinaire"]', 0,
   'Montaigne, humaniste du XVIe siècle, invente l''essai et une écriture de soi.', 7),
  ('13010000-0000-4000-8000-000000000408'::uuid, 'La littérature d''idées',
   'Persuader consiste à toucher la sensibilité et les émotions du destinataire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Persuader s''appuie sur les émotions, là où convaincre s''appuie sur la raison.', 8),
  ('13010000-0000-4000-8000-000000000409'::uuid, 'La littérature d''idées',
   'Comment nomme-t-on un récit court à visée argumentative, comme la fable ?', 'mcq',
   '["Un apologue", "Un sonnet", "Un monologue", "Un incipit"]', 0,
   'L''apologue (fable, conte) illustre une leçon ou une thèse par le récit.', 9),
  ('13010000-0000-4000-8000-000000000410'::uuid, 'La littérature d''idées',
   'L''ironie consiste à feindre de dire le contraire de ce que l''on pense.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''ironie, arme des Lumières, dit le contraire de sa pensée pour mieux critiquer.', 10),

  -- Chapitre 5 — Dissertation et oral du bac
  ('13010000-0000-4000-8000-000000000504'::uuid, 'Dissertation et oral du bac',
   'Comment s''appelle le plan qui oppose thèse et antithèse avant une synthèse ?', 'mcq',
   '["Le plan dialectique", "Le plan thématique", "Le plan chronologique", "Le plan analytique"]', 0,
   'Le plan dialectique s''organise en thèse, antithèse, synthèse.', 4),
  ('13010000-0000-4000-8000-000000000505'::uuid, 'Dissertation et oral du bac',
   'Dans un commentaire, on doit toujours relier un procédé à : ', 'mcq',
   '["un effet de sens", "une date", "un auteur", "une rime"]', 0,
   'Commenter, c''est lier un procédé (figure, rythme, lexique) à un effet ou un sens.', 5),
  ('13010000-0000-4000-8000-000000000506'::uuid, 'Dissertation et oral du bac',
   'En quoi consiste l''explication linéaire à l''oral ?', 'mcq',
   '["étudier le texte dans l''ordre, mouvement par mouvement", "résumer l''intrigue du texte", "réciter le texte par cœur", "comparer deux textes différents"]', 0,
   'L''explication linéaire suit le texte dans l''ordre, guidée par un projet de lecture.', 6),
  ('13010000-0000-4000-8000-000000000507'::uuid, 'Dissertation et oral du bac',
   'La problématique est la question centrale que soulève le sujet de dissertation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La problématique formule la question à laquelle la dissertation va répondre.', 7),
  ('13010000-0000-4000-8000-000000000508'::uuid, 'Dissertation et oral du bac',
   'À l''oral de français, la question de grammaire peut porter sur : ', 'mcq',
   '["une proposition subordonnée", "une figure de style", "le nombre de strophes", "la biographie de l''auteur"]', 0,
   'La question de grammaire analyse une phrase du texte (subordonnée, négation, interrogation).', 8),
  ('13010000-0000-4000-8000-000000000509'::uuid, 'Dissertation et oral du bac',
   'Dans un plan dialectique, la partie qui nuance ou conteste la thèse s''appelle : ', 'mcq',
   '["l''antithèse", "la synthèse", "l''introduction", "la conclusion"]', 0,
   'L''antithèse nuance ou s''oppose à la thèse, avant la synthèse.', 9),
  ('13010000-0000-4000-8000-000000000510'::uuid, 'Dissertation et oral du bac',
   'L''entretien de l''oral porte sur une œuvre choisie et présentée par le candidat.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Lors de l''entretien, le candidat présente et défend une œuvre qu''il a choisie.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type bac corrigés pas à pas par chapitre.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La poésie du XIXe au XXIe siècle', $md$# Exercices types — La poésie du XIXe au XXIe siècle

## Exercice 1 — Commentaire d'un extrait
Lis ces vers de Paul Verlaine (« Chanson d'automne », Poèmes saturniens, 1866) :
« Les sanglots longs / Des violons / De l'automne / Blessent mon cœur / D'une langueur / Monotone. »

a) Relève les sonorités qui dominent et explique l'effet qu'elles produisent.
b) Propose deux axes de lecture possibles pour un commentaire de ce passage.

### Correction
a) On entend surtout des **sons nasals** (« long », « violon », « automne », « monotone ») et la voyelle **[on]** répétée. Cette **assonance** crée une musique lente, une plainte étirée qui **imite la langueur** évoquée. Les vers très courts (deux à trois syllabes) renforcent cette lenteur mélancolique.
b) Deux axes possibles :
- **Axe 1 — Une musique de la tristesse** : la poésie se fait chant (les violons, les sonorités douces) au service du « mal du siècle ».
- **Axe 2 — L'expression du moi souffrant** : le lyrisme, avec « mon cœur » et « langueur », traduit la mélancolie du poète.
Dans chaque axe, il faut relier un **procédé** (sonorité, mètre, champ lexical) à un **effet de sens**.

## Exercice 2 — Préparation d'une explication linéaire (oral)
On te demande d'expliquer ce même passage à l'oral.

a) Formule un **projet de lecture** (la question à laquelle ton explication répond).
b) Découpe le texte en mouvements et indique un procédé à commenter dans chacun.

### Correction
a) Projet de lecture possible : **« Comment Verlaine transforme-t-il ce poème en une musique de la mélancolie ? »**
b) Deux mouvements :
- **Mouvement 1** (« Les sanglots longs… De l'automne ») : la mise en place d'une **atmosphère sonore** ; on commente les nasales et la personnification des violons.
- **Mouvement 2** (« Blessent mon cœur… Monotone ») : le passage au **sentiment intime** ; on commente le champ lexical de la souffrance (« Blessent », « langueur ») et l'adjectif « Monotone » rejeté en fin de strophe.
On conclut en montrant l'unité entre la forme musicale et l'émotion exprimée.$md$),

    ('Le roman : parcours bac', $md$# Exercices types — Le roman : parcours bac

## Exercice 1 — Plan de dissertation guidé
Sujet : **« Un personnage de roman doit-il être admirable pour intéresser le lecteur ? »**

a) Reformule la problématique du sujet.
b) Propose un plan dialectique en trois parties, avec une idée directrice pour chacune.

### Correction
a) Problématique possible : **le lecteur s'attache-t-il seulement aux héros admirables, ou l'imperfection et la médiocrité d'un personnage peuvent-elles aussi le captiver ?**
b) Plan dialectique :
- **Thèse — Le personnage admirable séduit** : le héros courageux ou vertueux suscite l'admiration et l'identification (par exemple Jean Valjean chez Hugo).
- **Antithèse — L'antihéros intéresse aussi** : un personnage faible, ordinaire ou immoral peut fasciner et faire réfléchir (par exemple les personnages de Flaubert ou de Zola).
- **Synthèse — L'essentiel est la vérité humaine** : ce qui compte, c'est que le personnage soit **complexe** et révèle quelque chose de l'homme, qu'il soit admirable ou non.
Chaque partie doit s'appuyer sur des **exemples précis** tirés des œuvres au programme.

## Exercice 2 — Question de grammaire et point de vue
Soit la phrase : « Elle regardait la mer, qui scintillait sous le soleil. »

a) Identifie la proposition subordonnée relative et son antécédent.
b) Quel point de vue (focalisation) semble adopté ? Justifie ta réponse.

### Correction
a) La proposition subordonnée relative est **« qui scintillait sous le soleil »**. Elle est introduite par le pronom relatif **« qui »**, dont l'**antécédent** est le nom **« la mer »**. Cette relative apporte une précision sur la mer.
b) On suit ici ce que **le personnage (« Elle ») perçoit** : la description de la mer passe par son regard. Il s'agit donc plutôt d'une **focalisation interne**. Si le narrateur ajoutait des informations que le personnage ignore, on basculerait vers la focalisation zéro (le narrateur omniscient).$md$),

    ('Le théâtre : parcours bac', $md$# Exercices types — Le théâtre : parcours bac

## Exercice 1 — Commentaire d'un échange
Lis cet échange fictif :
LE PÈRE. — Tu m'obéiras !
LA FILLE. — Jamais, monsieur.
LE PÈRE. — Songe à mon honneur.
LA FILLE. — Je songe à mon amour.

a) Comment appelle-t-on ce type de dialogue fait de répliques très brèves ? Quel effet produit-il ?
b) Quel conflit de valeurs se joue ici ? Rattache-le à un genre théâtral.

### Correction
a) Il s'agit d'une **stichomythie** : des répliques très courtes qui s'enchaînent. L'effet est une **tension** dramatique croissante, un affrontement rapide, comme un duel verbal.
b) Le conflit oppose le **devoir** et l'**honneur** (le père) à la **passion** amoureuse (la fille). Ce dilemme entre devoir et sentiment est caractéristique de la **tragédie** classique (on pense à Corneille et à Racine), où les personnages sont déchirés entre des exigences contraires.

## Exercice 2 — Préparation d'explication linéaire (oral)
On te donne une tirade à expliquer à l'oral, où un personnage hésite longuement avant de prendre une décision.

a) Quelles informations les **didascalies** peuvent-elles apporter pour l'analyse ?
b) Propose un projet de lecture et deux procédés à commenter dans ce monologue délibératif.

### Correction
a) Les **didascalies** indiquent le **ton**, les **gestes**, les silences et le décor : elles montrent le jeu attendu et le trouble du personnage (hésitations, déplacements). Elles rappellent que le texte est fait pour être **joué**.
b) Projet de lecture possible : **« Comment ce monologue met-il en scène un personnage déchiré ? »**
Procédés à commenter :
- Les **questions rhétoriques** et les **exclamations**, qui traduisent le débat intérieur.
- Le **rythme** heurté (phrases coupées, antithèses entre les deux choix), qui montre l'hésitation.
On conclut sur la fonction du **monologue délibératif** : donner à voir une conscience en train de choisir.$md$),

    ('La littérature d''idées', $md$# Exercices types — La littérature d'idées

## Exercice 1 — Plan de dissertation guidé
Sujet : **« La fiction est-elle plus efficace que le discours direct pour défendre une idée ? »**

a) Distingue l'argumentation directe de l'argumentation indirecte.
b) Propose un plan dialectique avec un exemple par partie.

### Correction
a) L'**argumentation directe** expose la thèse ouvertement (essai, discours, pamphlet). L'**argumentation indirecte** fait passer la thèse par une **fiction** (apologue, conte philosophique, fable).
b) Plan dialectique :
- **Thèse — La fiction est efficace** : elle plaît, touche les émotions et fait réfléchir sans imposer (« Candide » de Voltaire, les fables de La Fontaine).
- **Antithèse — Le discours direct est plus clair** : il défend une thèse sans détour, avec des arguments explicites (un discours de Voltaire contre l'intolérance, un article de l'Encyclopédie).
- **Synthèse — Les deux se complètent** : selon le public et le but visé, l'écrivain choisit la fiction séduisante ou la force du raisonnement direct.

## Exercice 2 — Repérer une stratégie argumentative
Lis cette phrase : « Quel bonheur d'être gouverné par des gens si sages qu'ils nous interdisent même de penser ! »

a) Quel procédé argumentatif est employé ? Explique-le.
b) Quelle est la thèse réellement défendue par l'auteur ?

### Correction
a) Le procédé est l'**ironie** : l'auteur feint de **louer** (« Quel bonheur », « si sages ») ce qu'il veut en réalité **critiquer**. Le décalage entre les mots élogieux et la réalité absurde (« nous interdisent de penser ») révèle la moquerie.
b) La thèse réellement défendue est **une critique de la censure et de la tyrannie** : l'auteur dénonce un pouvoir qui empêche la liberté de penser. L'ironie, arme des Lumières, pousse le lecteur à réagir et à adhérer par lui-même à cette critique.$md$),

    ('Dissertation et oral du bac', $md$# Exercices types — Dissertation et oral du bac

## Exercice 1 — Construire une introduction de dissertation
Sujet : **« La poésie n'a-t-elle pour but que d'exprimer des sentiments ? »**

a) Rappelle les trois étapes attendues d'une introduction de dissertation.
b) Rédige une introduction complète pour ce sujet.

### Correction
a) Une introduction comporte : une **amorce** (phrase d'entrée en matière), la **présentation du sujet** et l'analyse de ses mots-clés aboutissant à la **problématique**, puis l'**annonce du plan**.
b) Introduction possible :
« Depuis le romantisme, on associe souvent la poésie à l'expression du moi et des émotions. Pourtant, réduire la poésie à ce seul rôle reviendrait à oublier ses autres fonctions. **La poésie n'a-t-elle vraiment pour but que d'exprimer des sentiments ?** Nous verrons d'abord que la poésie exprime en effet la sensibilité du poète, puis qu'elle poursuit aussi d'autres visées (décrire, célébrer, dénoncer, jouer avec le langage), avant de montrer qu'elle transforme surtout le sentiment en art. »
On veille à **définir les termes** (« sentiments », « but ») et à formuler une **problématique** claire.

## Exercice 2 — Question de grammaire (oral)
Soit la phrase du texte : « Je ne crois pas que le bonheur soit impossible. »

a) Identifie et nomme la négation employée.
b) Analyse la proposition subordonnée et justifie le mode du verbe.

### Correction
a) La négation est **« ne… pas »**, une négation **totale** qui porte sur le verbe principal « crois » (« ne » est l'adverbe de négation, renforcé par « pas »).
b) La proposition subordonnée est **« que le bonheur soit impossible »** : c'est une **subordonnée conjonctive complétive**, COD du verbe « crois ». Le verbe « soit » est au **subjonctif** parce qu'il dépend d'un verbe d'opinion employé à la forme **négative** (« je ne crois pas que… »), qui exprime le doute et entraîne le subjonctif.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
