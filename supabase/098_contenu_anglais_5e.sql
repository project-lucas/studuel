-- =============================================================================
-- Studuel — Migration 098 : CONTENU Anglais 5e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres d'Anglais 5e (LV A, niveau A2) :
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
    ('Present simple vs continuous', $md$# Present simple vs continuous

## Ce que tu vas comprendre
L'anglais a **deux présents** là où le français n'en a qu'un. Le **present simple** parle de ce qui est **habituel ou toujours vrai** ; le **present continuous** (ou progressif) parle de ce qui se passe **en ce moment**. Ce chapitre t'apprend à ne plus les confondre.

## 1. Le present simple (habitudes, vérités)
On l'utilise pour une **habitude**, une **routine** ou une **vérité générale**.
- *I **play** football on Sundays.* (Je joue au foot le dimanche.)
- *Water **boils** at 100 °C.* (L'eau bout à 100 °C.)

À la **3ᵉ personne du singulier** (he, she, it), on ajoute **-s** au verbe :

| Personne | Verbe (to work) |
|---|---|
| I / you / we / they | work |
| **he / she / it** | work**s** |

*Attention : go → go**es**, study → stud**ies**.*

## 2. Le present continuous (action en cours)
On l'utilise pour une action **en train de se passer maintenant**. On le forme avec **be + verbe-ing** :
- *I **am eating** now.* (Je suis en train de manger.)
- *Look! It **is raining**.* (Regarde ! Il pleut.)
- *They **are playing** outside.* (Ils jouent dehors.)

## 3. Repérer avec les « mots-signaux »
Certains mots aident à choisir le bon temps :

| Present simple | Present continuous |
|---|---|
| always, usually, often | now, right now |
| every day, on Mondays | at the moment, look!, listen! |
| sometimes, never | today (en ce moment) |

## 4. Les verbes d'état (non progressifs)
Certains verbes **ne se mettent pas** au continuous : *like, love, want, know, understand*.
- On dit *I **like** it* (pas « I am liking »).

## L'essentiel à retenir
- **Present simple** = habitude / vérité ; **-s** à he/she/it.
- **Present continuous** = *be + V-ing* = action **en cours maintenant**.
- Mots-signaux : *usually, every day* → simple ; *now, look!, at the moment* → continuous.
- Les verbes comme *like, want, know* restent au **simple**.$md$),

    ('Le prétérit : raconter au passé', $md$# Le prétérit : raconter au passé

## Ce que tu vas comprendre
Le **prétérit** (simple past) est le temps du **récit au passé** : ce qui est **terminé**. Ce chapitre t'apprend à conjuguer les verbes réguliers et irréguliers, et à poser une question au passé.

## 1. Les verbes réguliers (-ed)
Pour la plupart des verbes, on ajoute **-ed** à toutes les personnes :
- *play → play**ed*** : *I played tennis.* (J'ai joué au tennis.)
- *watch → watch**ed*** : *She watched a film.* (Elle a regardé un film.)

Petites règles d'orthographe :

| Fin du verbe | Règle | Exemple |
|---|---|---|
| -e | + d | live → lived |
| consonne + y | y → ied | study → studied |
| 1 voyelle + 1 consonne | on double | stop → stopped |

## 2. Les verbes irréguliers
Beaucoup de verbes courants ont une forme **à apprendre par cœur** :

| Base | Prétérit | Sens |
|---|---|---|
| go | went | aller |
| have | had | avoir |
| see | saw | voir |
| eat | ate | manger |
| make | made | faire |

*Example : Yesterday I **went** to London and I **saw** Big Ben.*

## 3. La forme négative
On utilise **did not (didn't) + base verbale** (sans -ed !) :
- *I **didn't play**.* (Je n'ai pas joué.)
- *She **didn't go**.* (Elle n'est pas allée.)

## 4. La question
On commence par **did + sujet + base verbale** :
- ***Did** you **watch** the match?* (As-tu regardé le match ?)
- *Réponse courte : Yes, I did. / No, I didn't.*

## L'essentiel à retenir
- **Réguliers** : base + **-ed** (played, watched).
- **Irréguliers** : forme à mémoriser (go → **went**, see → **saw**).
- Négation : **didn't + base** (pas de -ed).
- Question : **did + sujet + base** (Did you go?).$md$),

    ('Décrire un lieu, une ville', $md$# Décrire un lieu, une ville

## Ce que tu vas comprendre
Pour décrire un endroit en anglais, on dit **ce qu'il y a** et **où c'est**. Ce chapitre t'apprend les tournures *there is / there are*, les prépositions de lieu et le vocabulaire de la ville.

## 1. There is / There are (« il y a »)
- **There is** + **singulier** : *There is a park.* (Il y a un parc.)
- **There are** + **pluriel** : *There are two museums.* (Il y a deux musées.)

Formes utiles :
- Négatif : *There **isn't** a cinema. / There **aren't** any shops.*
- Question : ***Is there** a station? / **Are there** any cafés?*

## 2. Le vocabulaire de la ville

| English | Français |
|---|---|
| a street | une rue |
| a square | une place |
| a bridge | un pont |
| a shop / a store | un magasin |
| a station | une gare |
| a church | une église |

## 3. Les prépositions de lieu
Elles disent **où** se trouve quelque chose :

| Préposition | Sens |
|---|---|
| in | dans |
| on | sur |
| under | sous |
| next to | à côté de |
| between | entre |
| opposite | en face de |
| behind | derrière |

*Example : The bank is **next to** the church, **opposite** the park.*

## 4. Demander et indiquer le chemin
- *Excuse me, **where is** the station?* (Où est la gare ?)
- ***Go straight on**, then **turn left**.* (Continue tout droit, puis tourne à gauche.)

## L'essentiel à retenir
- **There is** + singulier, **There are** + pluriel (« il y a »).
- Négation : *there isn't / there aren't any*.
- Prépositions de lieu : *in, on, under, next to, between, opposite, behind*.
- Chemin : *go straight on, turn left / right*.$md$),

    ('La nourriture et les quantités', $md$# La nourriture et les quantités

## Ce que tu vas comprendre
En anglais, on distingue ce qui se **compte** de ce qui **ne se compte pas**. Ce choix change les mots *some / any* et *how much / how many*. Ce chapitre t'apprend à parler de nourriture et de quantités.

## 1. Countable vs uncountable
- Les noms **comptables (countable)** ont un pluriel : *an apple → two apples*, *an egg → eggs*.
- Les noms **indénombrables (uncountable)** n'ont pas de pluriel : *water, milk, bread, rice, cheese*.

*On ne dit pas « two breads » mais « two **slices of** bread ».*

## 2. Some et any
- **Some** = « du / de la / des » dans les phrases **affirmatives** : *I want **some** water.*
- **Any** = dans les phrases **négatives** et les **questions** : *Is there **any** juice? / There isn't **any** milk.*

| Phrase | Mot |
|---|---|
| affirmative | some |
| négative | any |
| question | any |

## 3. How much / How many
Pour demander **une quantité** :
- **How many** + comptable (pluriel) : ***How many** eggs?* (Combien d'œufs ?)
- **How much** + indénombrable : ***How much** water?* (Combien d'eau ?)

## 4. Exprimer la quantité
- *a lot of* (beaucoup de) — comptable **et** indénombrable.
- *a little* (un peu de) + indénombrable ; *a few* (quelques) + comptable.
- *a bottle of / a glass of / a kilo of…* pour préciser.

*Example : There is **a lot of** cheese but only **a few** tomatoes.*

## L'essentiel à retenir
- **Countable** = pluriel possible (apples) ; **uncountable** = pas de pluriel (water, bread).
- **some** (affirmatif) / **any** (négatif, question).
- **How many** + comptable, **How much** + indénombrable.
- Quantités : *a lot of, a little, a few, a bottle of…*$md$),

    ('Les pays anglophones', $md$# Les pays anglophones

## Ce que tu vas comprendre
L'anglais est parlé sur toute la planète. Ce chapitre te présente les principaux **pays anglophones**, leur **géographie**, leurs **symboles** et le vocabulaire pour parler des nationalités.

## 1. Les grands pays anglophones

| Country | Capital | Adjectif |
|---|---|---|
| the United Kingdom (UK) | London | British |
| the United States (USA) | Washington D.C. | American |
| Canada | Ottawa | Canadian |
| Australia | Canberra | Australian |
| Ireland | Dublin | Irish |
| New Zealand | Wellington | New Zealander |

## 2. Le Royaume-Uni de plus près
Le **United Kingdom** réunit **quatre nations** : *England, Scotland, Wales* et *Northern Ireland*. Ne confonds pas :
- **England** = l'Angleterre (une seule nation) ;
- **Great Britain** = England + Scotland + Wales ;
- **the UK** = Great Britain + Northern Ireland.

Le drapeau britannique s'appelle le ***Union Jack***.

## 3. Les États-Unis
Les **USA** comptent **50 states** (50 États) et leur drapeau, le ***Stars and Stripes***, a 50 étoiles. Villes connues : *New York, Los Angeles, Chicago*. Monuments : *the Statue of Liberty, the White House*.

## 4. Symboles et culture
- UK : *the Queen / the King, red buses, fish and chips, Big Ben*.
- USA : *Hollywood, baseball, Thanksgiving, hamburgers*.
- On fête **Halloween** (31 October) et **Christmas** (25 December) dans le monde anglophone.

*Example : London is the capital of the **UK**; its flag is the **Union Jack**.*

## L'essentiel à retenir
- Pays clés : **UK** (London), **USA** (Washington), **Canada, Australia, Ireland**.
- Le **UK** = 4 nations : England, Scotland, Wales, Northern Ireland.
- Drapeaux : **Union Jack** (UK), **Stars and Stripes** (USA, 50 étoiles).
- Adjectifs de nationalité : *British, American, Irish, Australian…*$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Present simple vs continuous', $json${
      "centre": "Present simple vs continuous",
      "branches": [
        { "titre": "Present simple", "enfants": ["Habitude, vérité générale", "-s à he/she/it", "I play / She works"] },
        { "titre": "Present continuous", "enfants": ["be + verbe-ing", "Action en cours maintenant", "It is raining"] },
        { "titre": "Mots-signaux", "enfants": ["usually, every day → simple", "now, look!, at the moment → continuous", "Repérer le bon temps"] },
        { "titre": "Verbes d'état", "enfants": ["like, love, want, know", "Restent au simple", "I like it (pas liking)"] }
      ]
    }$json$),
    ('Le prétérit : raconter au passé', $json${
      "centre": "Le prétérit (simple past)",
      "branches": [
        { "titre": "Réguliers -ed", "enfants": ["base + ed", "played, watched", "study → studied, stop → stopped"] },
        { "titre": "Irréguliers", "enfants": ["Forme à apprendre", "go → went, see → saw", "eat → ate, have → had"] },
        { "titre": "Négation", "enfants": ["didn't + base", "Pas de -ed", "I didn't play"] },
        { "titre": "Question", "enfants": ["did + sujet + base", "Did you watch?", "Yes, I did / No, I didn't"] }
      ]
    }$json$),
    ('Décrire un lieu, une ville', $json${
      "centre": "Décrire un lieu, une ville",
      "branches": [
        { "titre": "There is / are", "enfants": ["is + singulier", "are + pluriel", "isn't / aren't any"] },
        { "titre": "Vocabulaire ville", "enfants": ["street, square, bridge", "shop, station, church", "a park, a museum"] },
        { "titre": "Prépositions de lieu", "enfants": ["in, on, under", "next to, between", "opposite, behind"] },
        { "titre": "Le chemin", "enfants": ["Where is...?", "Go straight on", "Turn left / right"] }
      ]
    }$json$),
    ('La nourriture et les quantités', $json${
      "centre": "Nourriture et quantités",
      "branches": [
        { "titre": "Countable / uncountable", "enfants": ["apples (pluriel)", "water, bread (pas de pluriel)", "a slice of bread"] },
        { "titre": "Some / any", "enfants": ["some → affirmatif", "any → négatif et question", "I want some water"] },
        { "titre": "How much / many", "enfants": ["How many + comptable", "How much + indénombrable", "How many eggs?"] },
        { "titre": "Quantités", "enfants": ["a lot of", "a little / a few", "a bottle of, a glass of"] }
      ]
    }$json$),
    ('Les pays anglophones', $json${
      "centre": "Les pays anglophones",
      "branches": [
        { "titre": "Grands pays", "enfants": ["UK → London", "USA → Washington", "Canada, Australia, Ireland"] },
        { "titre": "Le Royaume-Uni", "enfants": ["4 nations", "England, Scotland, Wales, N. Ireland", "Drapeau : Union Jack"] },
        { "titre": "Les États-Unis", "enfants": ["50 states", "Stars and Stripes", "Statue of Liberty"] },
        { "titre": "Nationalités", "enfants": ["British, American", "Irish, Australian", "Canadian"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'anglais'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 5e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Anglais', '5e', v.chapter, true, l.id
FROM (VALUES
  ('09819999-0000-4000-8000-000000000001'::uuid, 'Present simple vs continuous'),
  ('09819999-0000-4000-8000-000000000002'::uuid, 'Le prétérit : raconter au passé'),
  ('09819999-0000-4000-8000-000000000003'::uuid, 'Décrire un lieu, une ville'),
  ('09819999-0000-4000-8000-000000000004'::uuid, 'La nourriture et les quantités'),
  ('09819999-0000-4000-8000-000000000005'::uuid, 'Les pays anglophones')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
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
  -- Chapitre 1 — Present simple vs continuous
  ('09810000-0000-4000-8000-000000000104'::uuid, 'Present simple vs continuous',
   'Quelle phrase décrit une habitude ?', 'mcq',
   '["I play football every Sunday.", "Look! I am playing football.", "I am playing now.", "She is playing at the moment."]', 0,
   'Une habitude (every Sunday) se dit au present simple ; les autres, en cours, sont au continuous.', 4),
  ('09810000-0000-4000-8000-000000000105'::uuid, 'Present simple vs continuous',
   'Complète : « Look! It ___ raining. »', 'mcq',
   '["is", "rains", "are", "be"]', 0,
   'Action en cours (Look!) → present continuous : be + V-ing = « is raining ».', 5),
  ('09810000-0000-4000-8000-000000000106'::uuid, 'Present simple vs continuous',
   'À la 3e personne du singulier au present simple, on ajoute -s au verbe.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'He/she/it prennent un -s : she work becomes she works.', 6),
  ('09810000-0000-4000-8000-000000000107'::uuid, 'Present simple vs continuous',
   'Comment traduire « Ils jouent dehors (en ce moment) » ?', 'mcq',
   '["They are playing outside.", "They play outside.", "They plays outside.", "They is playing outside."]', 0,
   'Action en cours → present continuous pluriel : « They are playing ».', 7),
  ('09810000-0000-4000-8000-000000000108'::uuid, 'Present simple vs continuous',
   'Le verbe « like » se met normalement au present continuous.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les verbes d''état (like, want, know) restent au present simple : « I like it ».', 8),
  ('09810000-0000-4000-8000-000000000109'::uuid, 'Present simple vs continuous',
   'Quel mot annonce plutôt le present continuous ?', 'mcq',
   '["now", "usually", "every day", "never"]', 0,
   '« now » indique une action en cours ; usually/every day/never vont avec le present simple.', 9),
  ('09810000-0000-4000-8000-000000000110'::uuid, 'Present simple vs continuous',
   'Quelle est la forme correcte de « to go » à la 3e personne au present simple ?', 'mcq',
   '["goes", "gos", "going", "go"]', 0,
   'go → goes (on ajoute -es après le -o).', 10),

  -- Chapitre 2 — Le prétérit : raconter au passé
  ('09810000-0000-4000-8000-000000000204'::uuid, 'Le prétérit : raconter au passé',
   'Quel est le prétérit du verbe « to go » ?', 'mcq',
   '["went", "goed", "gone", "going"]', 0,
   '« go » est irrégulier : son prétérit est « went ».', 4),
  ('09810000-0000-4000-8000-000000000205'::uuid, 'Le prétérit : raconter au passé',
   'On forme le prétérit des verbes réguliers en ajoutant -ed.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Verbes réguliers : base + -ed (play → played, watch → watched).', 5),
  ('09810000-0000-4000-8000-000000000206'::uuid, 'Le prétérit : raconter au passé',
   'Complète : « She ___ a film yesterday. »', 'mcq',
   '["watched", "watch", "watchs", "watching"]', 0,
   'Verbe régulier au passé : watch → watched.', 6),
  ('09810000-0000-4000-8000-000000000207'::uuid, 'Le prétérit : raconter au passé',
   'Quelle est la forme négative correcte au prétérit ?', 'mcq',
   '["I didn''t play.", "I didn''t played.", "I don''t play.", "I not played."]', 0,
   'Négation : didn''t + base verbale (sans -ed) → « I didn''t play ».', 7),
  ('09810000-0000-4000-8000-000000000208'::uuid, 'Le prétérit : raconter au passé',
   'Comment poser la question « As-tu regardé le match ? » ?', 'mcq',
   '["Did you watch the match?", "Do you watched the match?", "Did you watched the match?", "You watched the match?"]', 0,
   'Question au prétérit : did + sujet + base verbale → « Did you watch...? ».', 8),
  ('09810000-0000-4000-8000-000000000209'::uuid, 'Le prétérit : raconter au passé',
   'Quel est le prétérit de « to see » ?', 'mcq',
   '["saw", "seed", "seen", "sawed"]', 0,
   '« see » est irrégulier : son prétérit est « saw ».', 9),
  ('09810000-0000-4000-8000-000000000210'::uuid, 'Le prétérit : raconter au passé',
   'Le verbe « study » au prétérit s''écrit « studied ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Consonne + y → on change y en ied : study → studied.', 10),

  -- Chapitre 3 — Décrire un lieu, une ville
  ('09810000-0000-4000-8000-000000000304'::uuid, 'Décrire un lieu, une ville',
   'Complète : « ___ two museums in my town. »', 'mcq',
   '["There are", "There is", "There has", "It is"]', 0,
   'Pluriel (two museums) → « There are ».', 4),
  ('09810000-0000-4000-8000-000000000305'::uuid, 'Décrire un lieu, une ville',
   'On utilise « There is » avec un nom au pluriel.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : « There is » va avec le singulier, « There are » avec le pluriel.', 5),
  ('09810000-0000-4000-8000-000000000306'::uuid, 'Décrire un lieu, une ville',
   'Que veut dire « next to » ?', 'mcq',
   '["à côté de", "en face de", "derrière", "sous"]', 0,
   '« next to » = à côté de ; opposite = en face de, behind = derrière, under = sous.', 6),
  ('09810000-0000-4000-8000-000000000307'::uuid, 'Décrire un lieu, une ville',
   'Comment traduit-on « une gare » ?', 'mcq',
   '["a station", "a square", "a street", "a bridge"]', 0,
   'a station = une gare ; a square = une place, a street = une rue, a bridge = un pont.', 7),
  ('09810000-0000-4000-8000-000000000308'::uuid, 'Décrire un lieu, une ville',
   'Quelle préposition signifie « entre » ?', 'mcq',
   '["between", "opposite", "next to", "behind"]', 0,
   '« between » = entre ; opposite = en face de, behind = derrière.', 8),
  ('09810000-0000-4000-8000-000000000309'::uuid, 'Décrire un lieu, une ville',
   'Pour indiquer « continue tout droit », on dit :', 'mcq',
   '["Go straight on.", "Turn left.", "Turn right.", "Stop here."]', 0,
   '« Go straight on » = continue tout droit ; turn left/right = tourne à gauche/droite.', 9),
  ('09810000-0000-4000-8000-000000000310'::uuid, 'Décrire un lieu, une ville',
   'Quelle est la forme négative correcte ?', 'mcq',
   '["There isn''t a cinema.", "There not a cinema.", "There aren''t a cinema.", "There no cinema."]', 0,
   'Singulier → « There isn''t a cinema » (there is not).', 10),

  -- Chapitre 4 — La nourriture et les quantités
  ('09810000-0000-4000-8000-000000000404'::uuid, 'La nourriture et les quantités',
   'Quel nom est indénombrable (uncountable) ?', 'mcq',
   '["water", "apple", "egg", "tomato"]', 0,
   '« water » ne se compte pas (pas de pluriel) ; apple, egg, tomato sont comptables.', 4),
  ('09810000-0000-4000-8000-000000000405'::uuid, 'La nourriture et les quantités',
   'Complète : « I want ___ water. »', 'mcq',
   '["some", "any", "many", "a"]', 0,
   'Phrase affirmative → « some » ; « any » s''emploie au négatif et à la question.', 5),
  ('09810000-0000-4000-8000-000000000406'::uuid, 'La nourriture et les quantités',
   'On utilise « How many » avec un nom indénombrable comme water.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : « How many » va avec le comptable ; pour water (indénombrable) on dit « How much ».', 6),
  ('09810000-0000-4000-8000-000000000407'::uuid, 'La nourriture et les quantités',
   'Complète : « ___ eggs do you need? »', 'mcq',
   '["How many", "How much", "How long", "How old"]', 0,
   'eggs est comptable (pluriel) → « How many ».', 7),
  ('09810000-0000-4000-8000-000000000408'::uuid, 'La nourriture et les quantités',
   'Quelle phrase est correcte au négatif ?', 'mcq',
   '["There isn''t any milk.", "There isn''t some milk.", "There aren''t some milk.", "There is any milk."]', 0,
   'Au négatif on emploie « any » : « There isn''t any milk ».', 8),
  ('09810000-0000-4000-8000-000000000409'::uuid, 'La nourriture et les quantités',
   'Que signifie « a few » ?', 'mcq',
   '["quelques", "beaucoup", "un peu (liquide)", "aucun"]', 0,
   '« a few » = quelques (+ comptable) ; « a little » = un peu (+ indénombrable).', 9),
  ('09810000-0000-4000-8000-000000000410'::uuid, 'La nourriture et les quantités',
   'Comment dit-on « une bouteille d''eau » ?', 'mcq',
   '["a bottle of water", "a glass of bread", "a slice of water", "a kilo of milk"]', 0,
   '« a bottle of water » = une bouteille d''eau.', 10),

  -- Chapitre 5 — Les pays anglophones
  ('09810000-0000-4000-8000-000000000504'::uuid, 'Les pays anglophones',
   'Quelle est la capitale du Royaume-Uni (UK) ?', 'mcq',
   '["London", "Washington", "Dublin", "Ottawa"]', 0,
   'La capitale du UK est London ; Washington = USA, Dublin = Ireland, Ottawa = Canada.', 4),
  ('09810000-0000-4000-8000-000000000505'::uuid, 'Les pays anglophones',
   'Comment s''appelle le drapeau britannique ?', 'mcq',
   '["the Union Jack", "the Stars and Stripes", "the Maple Leaf", "the Tricolour"]', 0,
   'Le drapeau du UK est le « Union Jack » ; le « Stars and Stripes » est celui des USA.', 5),
  ('09810000-0000-4000-8000-000000000506'::uuid, 'Les pays anglophones',
   'Le Royaume-Uni (UK) réunit quatre nations.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : England, Scotland, Wales et Northern Ireland.', 6),
  ('09810000-0000-4000-8000-000000000507'::uuid, 'Les pays anglophones',
   'Combien d''États compte les États-Unis ?', 'mcq',
   '["50", "13", "48", "60"]', 0,
   'Les USA comptent 50 states (d''où les 50 étoiles du drapeau).', 7),
  ('09810000-0000-4000-8000-000000000508'::uuid, 'Les pays anglophones',
   'Quel est l''adjectif de nationalité pour l''Irlande (Ireland) ?', 'mcq',
   '["Irish", "Irland", "Irishman", "Ireland"]', 0,
   'L''adjectif de nationalité est « Irish ».', 8),
  ('09810000-0000-4000-8000-000000000509'::uuid, 'Les pays anglophones',
   'La capitale de l''Australie est Sydney.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la capitale de l''Australie est Canberra (Sydney est la plus grande ville).', 9),
  ('09810000-0000-4000-8000-000000000510'::uuid, 'Les pays anglophones',
   'Quel monument se trouve à New York ?', 'mcq',
   '["the Statue of Liberty", "Big Ben", "the Eiffel Tower", "the Colosseum"]', 0,
   'La Statue of Liberty est à New York ; Big Ben est à London.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
