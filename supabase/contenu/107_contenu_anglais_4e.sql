-- =============================================================================
-- Studuel — Migration 107 : CONTENU Anglais 4e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres d'Anglais 4e (programme cycle 4, LV1 A2→B1) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de la structure)
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
-- PRÉREQUIS : subjects/chapters/lessons d'Anglais 4e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le present perfect', $md$# Le present perfect

## Ce que tu vas comprendre
Le **present perfect** est un temps anglais qui n'a pas d'équivalent exact en français. Il relie le **passé** au **présent** : une action passée qui a un **résultat** ou un **lien** avec maintenant. Ce chapitre t'apprend à le former, à l'employer avec *for* et *since*, et à ne plus le confondre avec le prétérit.

## 1. La formation
Le present perfect se construit avec l'auxiliaire **have / has** + le **participe passé** du verbe.

| Sujet | Auxiliaire | Participe passé |
|---|---|---|
| I / you / we / they | **have** | worked, seen, been… |
| he / she / it | **has** | worked, seen, been… |

*Exemple : **I have finished** my homework. → « J'ai fini mes devoirs » (et donc c'est fait maintenant).*

## 2. Le participe passé
- Verbes **réguliers** : base + **-ed** (*work → worked*, *play → played*).
- Verbes **irréguliers** : forme à apprendre (*go → gone*, *see → seen*, *be → been*, *write → written*).

## 3. *For* et *since*
On les utilise pour parler d'une action qui **dure encore** :
- **for** + une **durée** : *I have lived here **for** three years.* (« depuis trois ans »)
- **since** + un **point de départ** : *I have lived here **since** 2021.* (« depuis 2021 »)

## 4. *Ever*, *never*, *already*, *yet*
- **ever** (déjà, dans une question) : *Have you **ever** been to London?*
- **never** (jamais) : *I have **never** eaten sushi.*
- **already** (déjà, affirmatif) / **yet** (encore, négatif/question).

## 5. Present perfect ou prétérit ?
- **Present perfect** : le moment n'est **pas précisé**, lien avec le présent. *I **have seen** this film.*
- **Prétérit** (simple past) : le moment est **daté et terminé**. *I **saw** this film **yesterday**.*

> **Attention :** avec une date passée précise (*yesterday*, *in 2010*, *last week*), on emploie le **prétérit**, jamais le present perfect.

## L'essentiel à retenir
- Present perfect = **have / has + participe passé**.
- Il relie le **passé au présent** (résultat, expérience, action non datée).
- **for** + durée, **since** + point de départ.
- Avec un moment passé **précis**, on utilise le **prétérit**, pas le present perfect.$md$),

    ('Comparatifs et superlatifs', $md$# Comparatifs et superlatifs

## Ce que tu vas comprendre
Pour **comparer** deux choses ou dire qu'une chose est « la plus… », l'anglais a des règles précises qui dépendent de la **longueur** de l'adjectif. Ce chapitre t'apprend à former les comparatifs, les superlatifs, l'égalité, et à retenir les irréguliers.

## 1. Le comparatif de supériorité (« plus… que »)
- Adjectif **court** (1 syllabe) : adjectif + **-er** + *than*. *Tom is **taller than** Ben.* (« plus grand que »)
- Adjectif **long** (2 syllabes et +) : **more** + adjectif + *than*. *This book is **more interesting than** that one.*

| Adjectif | Comparatif |
|---|---|
| tall | tall**er** than |
| big | big**ger** than (on double la consonne) |
| expensive | **more** expensive than |

## 2. Le superlatif (« le plus… »)
- Adjectif **court** : **the** + adjectif + **-est**. *This is **the tallest** tower.*
- Adjectif **long** : **the most** + adjectif. *This is **the most beautiful** city.*

*Exemple : *Everest is **the highest** mountain in the world.* (« la plus haute montagne »)*

## 3. L'égalité et l'infériorité
- Égalité : **as** + adjectif + **as**. *She is **as tall as** her brother.* (« aussi grande que »)
- Infériorité : **less** + adjectif + *than* / **not as … as**.

## 4. Les comparatifs irréguliers
Certains adjectifs très courants ne suivent pas la règle :

| Adjectif | Comparatif | Superlatif |
|---|---|---|
| good | **better** | **the best** |
| bad | **worse** | **the worst** |
| far | **further** | **the furthest** |

*Exemple : *This is the **best** film I have ever seen.* (« le meilleur film »)*

## L'essentiel à retenir
- Adjectif **court** : **-er / the …-est** (*taller, the tallest*).
- Adjectif **long** : **more / the most** (*more useful, the most useful*).
- Égalité : **as … as** ; infériorité : **less … than**.
- Irréguliers : **good → better → the best**, **bad → worse → the worst**.$md$),

    ('Exprimer le futur', $md$# Exprimer le futur

## Ce que tu vas comprendre
L'anglais n'a pas un seul futur, mais **plusieurs façons** d'en parler, selon qu'il s'agit d'une intention, d'une prédiction ou d'un projet déjà organisé. Ce chapitre t'apprend à choisir entre *will*, *be going to* et le présent continu.

## 1. *Will* (+ base verbale)
On utilise **will** pour :
- une **décision spontanée** : *The phone is ringing! I **will** answer it.*
- une **prédiction**, une opinion sur le futur : *I think it **will** rain tomorrow.*
- une **promesse** : *I **will** help you.*

Forme : **will** + verbe à la base (*will go, will be, will see*). Négation : **won't** (= will not).

## 2. *Be going to* (+ base verbale)
On utilise **be going to** pour :
- une **intention**, un projet déjà décidé : *I **am going to** visit my grandmother.*
- une prédiction fondée sur un **indice présent** : *Look at those clouds! It **is going to** rain.*

Forme : *am / is / are* + **going to** + verbe.

## 3. Le présent continu pour le futur proche
On utilise le **présent en be + -ing** pour un **arrangement** déjà fixé (rendez-vous, réservation), souvent avec une indication de temps :

*Exemple : *We **are meeting** our friends **tonight**.* (« On retrouve nos amis ce soir. »)*

## 4. Comment choisir ?

| Situation | Temps |
|---|---|
| Décision sur le moment | **will** |
| Prédiction générale | **will** |
| Intention, projet | **be going to** |
| Indice visible maintenant | **be going to** |
| Rendez-vous déjà organisé | présent en **-ing** |

## L'essentiel à retenir
- **will** + base : décision spontanée, prédiction, promesse.
- **be going to** + base : intention, projet, indice présent.
- **présent en -ing** : arrangement futur déjà fixé (*I am leaving tomorrow*).
- Négation de will = **won't**.$md$),

    ('Les médias et les réseaux', $md$# Les médias et les réseaux sociaux

## Ce que tu vas comprendre
Presse, télévision, radio et réseaux sociaux ont chacun leur **vocabulaire** en anglais. Ce chapitre te donne les mots essentiels pour comprendre un article, décrire tes usages numériques et parler de l'information.

## 1. La presse et l'information
- **the news** : les informations, l'actualité.
- **a newspaper** : un journal ; **a magazine** : un magazine.
- **a headline** : un gros titre ; **an article** : un article.
- **a journalist / a reporter** : un journaliste.
- **breaking news** : une information de dernière minute.

## 2. La télévision et la radio
- **to broadcast** : diffuser ; **a channel** : une chaîne.
- **a TV show / a programme** : une émission.
- **an advert / an advertisement** : une publicité.
- **the audience** : le public, les téléspectateurs.

## 3. Les réseaux sociaux
- **to post** : publier ; **a post** : une publication.
- **to share** : partager ; **to like** : aimer.
- **a follower** : un abonné ; **to follow** : suivre.
- **to comment** : commenter ; **a feed** : un fil d'actualité.
- **to go viral** : devenir viral.

## 4. En parler
- *I **spend** two hours a day on social media.* (« Je passe deux heures par jour… »)
- *This video **went viral** last week.* (« Cette vidéo est devenue virale… »)
- *You should not **believe** everything you read online.* (« Il ne faut pas croire tout… »)

> **Culture :** attention aux **fake news** (fausses informations). Un bon lecteur **vérifie ses sources** (*to check the sources*).

## L'essentiel à retenir
- Presse : **the news**, **a headline**, **an article**, **a journalist**.
- TV / radio : **to broadcast**, **a channel**, **an advert**, **the audience**.
- Réseaux : **to post**, **to share**, **a follower**, **to go viral**.
- Esprit critique : méfie-toi des **fake news**, vérifie tes sources.$md$),

    ('Portraits d''artistes anglophones', $md$# Portraits d'artistes anglophones

## Ce que tu vas comprendre
Raconter la **vie d'un artiste** (musicien, acteur, peintre, écrivain), c'est parler d'événements passés et terminés : c'est le domaine du **prétérit** (simple past). Ce chapitre te donne le vocabulaire de la biographie et révise le passé.

## 1. Le vocabulaire de la biographie
- **to be born** : naître (*He **was born** in 1940.*).
- **to grow up** : grandir ; **a childhood** : une enfance.
- **a career** : une carrière ; **an artwork / a masterpiece** : une œuvre / un chef-d'œuvre.
- **famous / well-known** : célèbre / connu ; **an award** : une récompense.
- **to die** : mourir (*She **died** in 2011.*).

## 2. Le prétérit pour raconter
Le **prétérit** (simple past) sert à raconter des faits passés **datés et terminés**.
- Verbes **réguliers** : base + **-ed** (*paint → painted*, *record → recorded*).
- Verbes **irréguliers** : forme à connaître (*write → wrote*, *become → became*, *sing → sang*, *win → won*).

*Exemple : *The Beatles **became** famous in the 1960s and **sold** millions of records.* (« Les Beatles sont devenus célèbres… »)*

## 3. Les mots-clés de la chronologie
- **in 1985**, **during the 1990s**, **at the age of 20**.
- **first** (d'abord), **then** (puis), **finally** (enfin).
- **before / after** : avant / après.

## 4. Prétérit et non present perfect
Comme la biographie donne des **dates précises**, on emploie le **prétérit**, pas le present perfect.

*Exemple : *Shakespeare **wrote** many plays.* (et non « has written » ici, car c'est un fait historique daté).*

## L'essentiel à retenir
- Biographie : **to be born**, **to grow up**, **a career**, **an award**, **to die**.
- On raconte au **prétérit** (faits passés datés et terminés).
- Réguliers en **-ed**, irréguliers à apprendre (*wrote, became, sang, won*).
- Avec une **date précise**, on utilise le **prétérit**, jamais le present perfect.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le present perfect', $json${
      "centre": "Le present perfect",
      "branches": [
        { "titre": "Formation", "enfants": ["have / has + participe passé", "he/she/it → has", "I have finished"] },
        { "titre": "Participe passé", "enfants": ["Réguliers : base + -ed", "Irréguliers : gone, seen, been", "write → written"] },
        { "titre": "for et since", "enfants": ["for + durée (three years)", "since + point de départ (2021)", "Action qui dure encore"] },
        { "titre": "vs prétérit", "enfants": ["Moment non précisé → present perfect", "Date passée précise → prétérit", "ever, never, already, yet"] }
      ]
    }$json$),
    ('Comparatifs et superlatifs', $json${
      "centre": "Comparatifs et superlatifs",
      "branches": [
        { "titre": "Comparatif", "enfants": ["Court : -er + than (taller than)", "Long : more + adj + than", "big → bigger (on double)"] },
        { "titre": "Superlatif", "enfants": ["Court : the …-est (the tallest)", "Long : the most + adj", "the highest mountain"] },
        { "titre": "Égalité / infériorité", "enfants": ["as … as (aussi… que)", "less … than", "not as … as"] },
        { "titre": "Irréguliers", "enfants": ["good → better → the best", "bad → worse → the worst", "far → further"] }
      ]
    }$json$),
    ('Exprimer le futur', $json${
      "centre": "Exprimer le futur",
      "branches": [
        { "titre": "will + base", "enfants": ["Décision spontanée", "Prédiction, promesse", "Négation : won't"] },
        { "titre": "be going to", "enfants": ["Intention, projet décidé", "Indice présent visible", "am/is/are going to"] },
        { "titre": "Présent en -ing", "enfants": ["Arrangement déjà fixé", "Rendez-vous, réservation", "We are meeting tonight"] },
        { "titre": "Comment choisir", "enfants": ["Sur le moment → will", "Projet → be going to", "Organisé → présent -ing"] }
      ]
    }$json$),
    ('Les médias et les réseaux', $json${
      "centre": "Médias et réseaux",
      "branches": [
        { "titre": "Presse", "enfants": ["the news, an article", "a headline (gros titre)", "a journalist, breaking news"] },
        { "titre": "TV et radio", "enfants": ["to broadcast (diffuser)", "a channel, an advert", "the audience (public)"] },
        { "titre": "Réseaux sociaux", "enfants": ["to post, to share, to like", "a follower (abonné)", "to go viral"] },
        { "titre": "Esprit critique", "enfants": ["fake news (fausses infos)", "to check the sources", "Vérifier avant de partager"] }
      ]
    }$json$),
    ('Portraits d''artistes anglophones', $json${
      "centre": "Portraits d'artistes",
      "branches": [
        { "titre": "Biographie", "enfants": ["to be born (naître)", "to grow up, a career", "an award, to die"] },
        { "titre": "Le prétérit", "enfants": ["Faits passés datés", "Réguliers : base + -ed", "Irréguliers : wrote, became"] },
        { "titre": "Chronologie", "enfants": ["in 1985, at the age of 20", "first, then, finally", "before / after"] },
        { "titre": "Pas de present perfect", "enfants": ["Date précise → prétérit", "Shakespeare wrote…", "Fait historique daté"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'anglais'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal la structure a déjà créé les quiz d'Anglais 4e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Anglais', '4e', v.chapter, true, l.id
FROM (VALUES
  ('10719999-0000-4000-8000-000000000001'::uuid, 'Le present perfect'),
  ('10719999-0000-4000-8000-000000000002'::uuid, 'Comparatifs et superlatifs'),
  ('10719999-0000-4000-8000-000000000003'::uuid, 'Exprimer le futur'),
  ('10719999-0000-4000-8000-000000000004'::uuid, 'Les médias et les réseaux'),
  ('10719999-0000-4000-8000-000000000005'::uuid, 'Portraits d''artistes anglophones')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
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
  -- Chapitre 1 — Le present perfect
  ('10710000-0000-4000-8000-000000000104'::uuid, 'Le present perfect',
   'Comment forme-t-on le present perfect ?', 'mcq',
   '["have / has + participe passé", "be + base + -ing", "will + base verbale", "did + base verbale"]', 0,
   'Le present perfect se construit avec l''auxiliaire have ou has suivi du participe passé.', 4),
  ('10710000-0000-4000-8000-000000000105'::uuid, 'Le present perfect',
   'Complète : « I ___ never been to London. »', 'mcq',
   '["have", "has", "am", "did"]', 0,
   'Avec I, l''auxiliaire du present perfect est have : I have never been.', 5),
  ('10710000-0000-4000-8000-000000000106'::uuid, 'Le present perfect',
   'On emploie « since » devant un point de départ (ex. since 2021).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'since + point de départ (since 2021) ; for + durée (for three years).', 6),
  ('10710000-0000-4000-8000-000000000107'::uuid, 'Le present perfect',
   'Complète : « She has lived here ___ 2019. »', 'mcq',
   '["since", "for", "during", "ago"]', 0,
   '2019 est un point de départ précis : on utilise since.', 7),
  ('10710000-0000-4000-8000-000000000108'::uuid, 'Le present perfect',
   'Quel est le participe passé du verbe « go » ?', 'mcq',
   '["gone", "went", "goed", "going"]', 0,
   'go est irrégulier : go → went (prétérit) → gone (participe passé).', 8),
  ('10710000-0000-4000-8000-000000000109'::uuid, 'Le present perfect',
   'Avec une date passée précise comme « yesterday », on utilise le present perfect.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : avec un moment passé précis (yesterday, in 2010), on emploie le prétérit.', 9),
  ('10710000-0000-4000-8000-000000000110'::uuid, 'Le present perfect',
   'Complète : « He ___ finished his homework. »', 'mcq',
   '["has", "have", "is", "was"]', 0,
   'Avec he (3e personne du singulier), l''auxiliaire est has.', 10),

  -- Chapitre 2 — Comparatifs et superlatifs
  ('10710000-0000-4000-8000-000000000204'::uuid, 'Comparatifs et superlatifs',
   'Quel est le comparatif de « tall » (grand) ?', 'mcq',
   '["taller", "more tall", "tallest", "the taller"]', 0,
   'tall est un adjectif court : on ajoute -er → taller (than).', 4),
  ('10710000-0000-4000-8000-000000000205'::uuid, 'Comparatifs et superlatifs',
   'Quel est le superlatif de « big » (grand) ?', 'mcq',
   '["the biggest", "the most big", "the bigest", "the bigger"]', 0,
   'big est court : on double la consonne et on ajoute -est → the biggest.', 5),
  ('10710000-0000-4000-8000-000000000206'::uuid, 'Comparatifs et superlatifs',
   'Quel est le comparatif de « good » (bon) ?', 'mcq',
   '["better", "gooder", "more good", "best"]', 0,
   'good est irrégulier : good → better → the best.', 6),
  ('10710000-0000-4000-8000-000000000207'::uuid, 'Comparatifs et superlatifs',
   'Pour un adjectif long comme « interesting », on utilise « more » (more interesting).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les adjectifs longs forment leur comparatif avec more : more interesting than.', 7),
  ('10710000-0000-4000-8000-000000000208'::uuid, 'Comparatifs et superlatifs',
   'Que signifie la structure « as tall as » ?', 'mcq',
   '["aussi grand que (égalité)", "plus grand que", "le plus grand", "moins grand que"]', 0,
   'as + adjectif + as exprime l''égalité : aussi… que.', 8),
  ('10710000-0000-4000-8000-000000000209'::uuid, 'Comparatifs et superlatifs',
   'Quel est le superlatif de « beautiful » (beau) ?', 'mcq',
   '["the most beautiful", "the beautifulest", "the more beautiful", "most beautiful"]', 0,
   'beautiful est long : superlatif = the most beautiful.', 9),
  ('10710000-0000-4000-8000-000000000210'::uuid, 'Comparatifs et superlatifs',
   '« The best » est le superlatif de « good ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'good → better → the best : the best est bien le superlatif de good.', 10),

  -- Chapitre 3 — Exprimer le futur
  ('10710000-0000-4000-8000-000000000304'::uuid, 'Exprimer le futur',
   'Pour exprimer une intention ou un projet déjà décidé, on utilise : ', 'mcq',
   '["be going to", "will", "the present perfect", "the past simple"]', 0,
   'be going to exprime une intention ou un projet : I am going to visit my aunt.', 4),
  ('10710000-0000-4000-8000-000000000305'::uuid, 'Exprimer le futur',
   'Le téléphone sonne, tu décides de répondre sur le moment : « I ___ answer it. »', 'mcq',
   '["will", "am going to", "answered", "am"]', 0,
   'Une décision spontanée s''exprime avec will : I will answer it.', 5),
  ('10710000-0000-4000-8000-000000000306'::uuid, 'Exprimer le futur',
   'Le présent continu (be + -ing) peut exprimer un futur déjà organisé.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : We are meeting our friends tonight exprime un arrangement futur fixé.', 6),
  ('10710000-0000-4000-8000-000000000307'::uuid, 'Exprimer le futur',
   'Complète : « Look at those clouds! It ___ rain. »', 'mcq',
   '["is going to", "will", "rains", "would"]', 0,
   'Un indice visible dans le présent (les nuages) appelle be going to : it is going to rain.', 7),
  ('10710000-0000-4000-8000-000000000308'::uuid, 'Exprimer le futur',
   'Quelle est la forme négative de « will » ?', 'mcq',
   '["won''t", "willn''t", "don''t will", "not will"]', 0,
   'will not se contracte en won''t.', 8),
  ('10710000-0000-4000-8000-000000000309'::uuid, 'Exprimer le futur',
   'Complète (rendez-vous déjà fixé) : « We ___ meeting friends tonight. »', 'mcq',
   '["are", "will", "go", "have"]', 0,
   'Un arrangement futur s''exprime au présent continu : we are meeting.', 9),
  ('10710000-0000-4000-8000-000000000310'::uuid, 'Exprimer le futur',
   'Après « will », le verbe se met à sa forme de base (sans -s, sans to).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : will + base verbale (will go, will be), jamais will to go.', 10),

  -- Chapitre 4 — Les médias et les réseaux
  ('10710000-0000-4000-8000-000000000404'::uuid, 'Les médias et les réseaux',
   'Que signifie le verbe « to post » ?', 'mcq',
   '["publier", "supprimer", "s''abonner", "télécharger"]', 0,
   'to post signifie publier (une photo, un message) ; a post = une publication.', 4),
  ('10710000-0000-4000-8000-000000000405'::uuid, 'Les médias et les réseaux',
   'Que signifie « a follower » ?', 'mcq',
   '["un abonné", "un article", "une chaîne", "un journaliste"]', 0,
   'a follower est un abonné ; to follow = suivre un compte.', 5),
  ('10710000-0000-4000-8000-000000000406'::uuid, 'Les médias et les réseaux',
   'Que signifie « the news » ?', 'mcq',
   '["les informations", "les nouveautés d''un magasin", "les nouveaux abonnés", "les commentaires"]', 0,
   'the news désigne les informations, l''actualité.', 6),
  ('10710000-0000-4000-8000-000000000407'::uuid, 'Les médias et les réseaux',
   'Que signifie le verbe « to share » ?', 'mcq',
   '["partager", "aimer", "commenter", "signaler"]', 0,
   'to share signifie partager un contenu.', 7),
  ('10710000-0000-4000-8000-000000000408'::uuid, 'Les médias et les réseaux',
   '« A headline » désigne un gros titre dans la presse.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : a headline est le gros titre d''un article ou d''un journal.', 8),
  ('10710000-0000-4000-8000-000000000409'::uuid, 'Les médias et les réseaux',
   'Que signifie le verbe « to broadcast » ?', 'mcq',
   '["diffuser", "imprimer", "abonner", "traduire"]', 0,
   'to broadcast signifie diffuser (à la télé ou à la radio).', 9),
  ('10710000-0000-4000-8000-000000000410'::uuid, 'Les médias et les réseaux',
   'Que signifie « an advert » (advertisement) ?', 'mcq',
   '["une publicité", "un avertissement", "un conseil", "une annonce d''emploi"]', 0,
   'an advert / advertisement est une publicité.', 10),

  -- Chapitre 5 — Portraits d'artistes anglophones
  ('10710000-0000-4000-8000-000000000504'::uuid, 'Portraits d''artistes anglophones',
   'Comment dit-on « il est né en 1940 » ?', 'mcq',
   '["He was born in 1940", "He is born in 1940", "He borned in 1940", "He has born in 1940"]', 0,
   'to be born au prétérit : He was born in 1940.', 4),
  ('10710000-0000-4000-8000-000000000505'::uuid, 'Portraits d''artistes anglophones',
   'Complète au prétérit : « He ___ many songs. » (write)', 'mcq',
   '["wrote", "writed", "written", "writes"]', 0,
   'write est irrégulier : write → wrote au prétérit.', 5),
  ('10710000-0000-4000-8000-000000000506'::uuid, 'Portraits d''artistes anglophones',
   'On raconte la vie d''un artiste (faits passés datés) au prétérit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : le prétérit sert à raconter des faits passés terminés et datés.', 6),
  ('10710000-0000-4000-8000-000000000507'::uuid, 'Portraits d''artistes anglophones',
   'Quel est le prétérit du verbe « become » ?', 'mcq',
   '["became", "becomed", "become", "becames"]', 0,
   'become est irrégulier : become → became.', 7),
  ('10710000-0000-4000-8000-000000000508'::uuid, 'Portraits d''artistes anglophones',
   'Complète : « She ___ in 2011. » (die)', 'mcq',
   '["died", "dead", "dies", "has died"]', 0,
   'to die est régulier : die → died au prétérit (avec la date 2011).', 8),
  ('10710000-0000-4000-8000-000000000509'::uuid, 'Portraits d''artistes anglophones',
   'Que signifie « a biography » ?', 'mcq',
   '["une biographie", "une bibliothèque", "un biologiste", "un autographe"]', 0,
   'a biography est le récit de la vie d''une personne : une biographie.', 9),
  ('10710000-0000-4000-8000-000000000510'::uuid, 'Portraits d''artistes anglophones',
   'Avec une date passée précise (in 1965), on utilise le present perfect.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : avec une date passée précise, on utilise le prétérit (She died in 1965).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
