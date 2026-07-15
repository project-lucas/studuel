-- =============================================================================
-- Studuel — Migration 125 : CONTENU Anglais 2de (cours + carte mentale + quiz)
-- Remplit les 4 chapitres d'Anglais 2de (programme de seconde, axes culturels,
-- niveau B1) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
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
-- PRÉREQUIS : subjects/chapters/lessons d'Anglais 2de, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Vivre entre générations', $md$# Vivre entre générations

## Ce que tu vas comprendre
Cet axe explore la **famille**, la **transmission** entre les âges et les liens entre grands-parents, parents et enfants. Tu réviseras aussi les **temps du présent et du passé**, indispensables pour raconter et décrire.

## 1. Le vocabulaire de la famille et des âges
Apprends à parler des générations avec précision :
- **relatives** = les proches / la famille au sens large ; **siblings** = frères et sœurs.
- **to raise / to bring up a child** = élever un enfant.
- **a toddler** (tout-petit), **a teenager** (ado), **a grown-up** (adulte), **the elderly** (les personnes âgées).
- **to pass down / to hand down** = transmettre (*« Grandma handed down her recipes. »* = « Mamie a transmis ses recettes. »).

## 2. La transmission et les valeurs
On parle de ce qui se transmet entre générations :
- **heritage** (héritage culturel), **memories** (souvenirs), **traditions**, **values** (valeurs).
- *« Older people share their wisdom with the young. »* = « Les aînés partagent leur sagesse avec les jeunes. »

## 3. Grammaire : le présent simple vs le présent en BE + -ING
- Le **present simple** exprime une habitude ou une vérité générale : *« My grandfather tells stories every Sunday. »*
- Le **present continuous** (BE + -ing) exprime une action en cours : *« Right now, he is telling a story. »*

> **Astuce :** les marqueurs *always, usually, every day* appellent le présent simple ; *now, at the moment, currently* appellent le présent continu.

## 4. Grammaire : le prétérit (past simple)
Le **prétérit** raconte un fait **terminé** et daté du passé :
- réguliers : *« They **lived** in London for ten years. »* (verbe + -ed) ;
- irréguliers : *« She **grew up** in a big family. »* (grow → grew).
- Marqueurs typiques : *yesterday, last year, in 1990, when I was a child*.

## L'essentiel à retenir
- Vocabulaire clé : **relatives, siblings, to raise, to hand down, heritage, values**.
- **Present simple** = habitude / vérité générale ; **present continuous** (BE + -ing) = action en cours.
- **Prétérit** = fait passé terminé et daté (réguliers en -ed, irréguliers à mémoriser).
- Repère les **marqueurs de temps** : ils t'indiquent le temps à employer.$md$),

    ('Les univers professionnels', $md$# Les univers professionnels

## Ce que tu vas comprendre
Cet axe présente le **monde du travail** : les métiers, la recherche d'emploi et les conditions de travail. Tu apprendras à exprimer la **capacité**, l'**obligation** et le **conseil** grâce aux **auxiliaires modaux**.

## 1. Le vocabulaire du travail
Le lexique de base pour parler d'un emploi :
- **a job / an occupation** = un emploi ; **a career** = une carrière.
- **an employer** (employeur) / **an employee** (salarié) ; **a co-worker** (collègue).
- **wages / salary** (salaire), **skills** (compétences), **a résumé / CV** (curriculum).
- **to apply for a job** = postuler à un emploi ; **a job interview** = un entretien.

## 2. Chercher et décrire un emploi
- *« She **applied for** a summer job. »* = « Elle a postulé pour un job d'été. »
- **full-time / part-time** = à temps plein / partiel ; **an internship** = un stage.
- **to hire** (embaucher) ≠ **to fire** (licencier).

## 3. Grammaire : les modaux de capacité et d'obligation
Les **auxiliaires modaux** ne prennent jamais de -s et sont suivis d'un verbe à la base verbale :
- **can / could** = capacité ou possibilité : *« I **can** speak three languages. »*
- **must / have to** = obligation forte : *« You **must** be on time. »*
- **mustn't** = interdiction : *« You **mustn't** be late. »*

## 4. Grammaire : les modaux de conseil et de probabilité
- **should / shouldn't** = conseil : *« You **should** prepare for the interview. »* (« Tu devrais te préparer. »)
- **may / might** = probabilité : *« She **might** get the job. »* (« Elle décrochera peut-être le poste. »)

> **Attention :** après un modal, jamais de *to* (*I can go*, pas *I can to go*).

## L'essentiel à retenir
- Vocabulaire clé : **job, career, employer, skills, to apply for, an interview**.
- **can/could** = capacité ; **must / have to** = obligation ; **mustn't** = interdiction.
- **should** = conseil ; **may / might** = probabilité.
- Un **modal** est suivi de la **base verbale** (sans *to*) et ne prend pas de -s.$md$),

    ('Représentation de soi et d''autrui', $md$# Représentation de soi et d'autrui

## Ce que tu vas comprendre
Cet axe interroge l'**identité**, l'image de soi et le regard des autres, notamment à travers les **réseaux sociaux**. Tu apprendras à **comparer** des personnes et des choses grâce aux comparatifs et superlatifs.

## 1. Le vocabulaire de l'identité
Décrire qui l'on est et comment on se montre :
- **identity** (identité), **self-image** (image de soi), **appearance** (apparence).
- **a profile** (profil), **a selfie**, **followers** (abonnés), **to post** (publier).
- **self-confidence** (confiance en soi), **peer pressure** (pression des pairs).

## 2. Réseaux sociaux et image de soi
- *« Many teenagers **compare themselves** to influencers online. »* = « Beaucoup d'ados se comparent aux influenceurs. »
- **to fit in** = s'intégrer ; **to stand out** = se démarquer.
- **fake** (faux) ≠ **genuine / real** (authentique).

## 3. Grammaire : le comparatif
Pour comparer deux éléments :
- adjectifs **courts** : adjectif + **-er** + *than* → *« She is **taller than** her sister. »*
- adjectifs **longs** : **more** + adjectif + *than* → *« This app is **more popular than** that one. »*
- égalité : **as … as** → *« He is **as tall as** his father. »*

## 4. Grammaire : le superlatif
Pour désigner l'extrême d'un groupe :
- adjectifs **courts** : **the** + adjectif + **-est** → *« the **biggest** platform »*.
- adjectifs **longs** : **the most** + adjectif → *« the **most famous** influencer »*.
- Irréguliers utiles : *good → better → the best* ; *bad → worse → the worst*.

> **Astuce :** un adjectif court a une syllabe (ou deux se terminant par -y : *happy → happier*).

## L'essentiel à retenir
- Vocabulaire clé : **identity, self-image, followers, to post, to fit in, to stand out**.
- **Comparatif** : adjectif court + *-er than*, ou *more … than* pour les longs ; égalité *as … as*.
- **Superlatif** : *the …-est* (courts) ou *the most …* (longs).
- Irréguliers à connaître : **good/better/best** et **bad/worse/worst**.$md$),

    ('Le passé dans le présent', $md$# Le passé dans le présent

## Ce que tu vas comprendre
Cet axe montre comment l'**histoire** et la **mémoire** restent vivantes aujourd'hui : monuments, commémorations, traces du passé. Tu apprendras la différence essentielle entre le **present perfect** et le **prétérit**.

## 1. Le vocabulaire de l'histoire et de la mémoire
Parler du passé et de ses traces :
- **history** (l'histoire) ≠ **a story** (une histoire, un récit).
- **memory** (mémoire / souvenir), **a memorial** (un mémorial), **to commemorate** (commémorer).
- **heritage** (patrimoine), **an event** (un événement), **a landmark** (un monument).
- **to remember** (se souvenir) ≠ **to forget** (oublier).

## 2. Le passé qui vit dans le présent
- *« This monument **reminds** us of the war. »* = « Ce monument nous rappelle la guerre. »
- **ancestors** (ancêtres), **roots** (racines), **a legacy** (un héritage laissé).

## 3. Grammaire : le prétérit (fait daté et terminé)
Le **prétérit** raconte un événement **coupé du présent**, souvent daté :
- *« The war **ended** in 1945. »* (date précise → prétérit)
- Marqueurs : *yesterday, ago, last week, in 1945, then*.

## 4. Grammaire : le present perfect (lien avec le présent)
Le **present perfect** (HAVE + participe passé) relie le passé au présent : bilan, expérience ou action sans date précise.
- *« I **have visited** that museum. »* (expérience, on ne dit pas quand)
- *« She **has lived** here **since** 2010. »* (action qui dure encore)
- Marqueurs : *ever, never, already, yet, since, for, just*.

> **La règle d'or :** si l'événement est **daté** → prétérit ; s'il est **relié au présent** (bilan, durée) → present perfect. *« I **saw** her yesterday »* mais *« I **have** just **seen** her. »*

## L'essentiel à retenir
- Vocabulaire clé : **history, memory, memorial, to commemorate, heritage, roots**.
- **Prétérit** = fait daté et terminé (marqueurs : *yesterday, ago, in 1945*).
- **Present perfect** (HAVE + participe passé) = lien avec le présent (*since, for, ever, already*).
- La date tranche : datée → **prétérit** ; reliée au présent → **present perfect**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Vivre entre générations', $json${
      "centre": "Vivre entre générations",
      "branches": [
        { "titre": "Vocabulaire famille", "enfants": ["relatives, siblings", "to raise / bring up", "toddler, teenager, the elderly"] },
        { "titre": "Transmission", "enfants": ["to hand down / pass down", "heritage, values, memories", "share wisdom"] },
        { "titre": "Présent", "enfants": ["Present simple = habitude", "BE + -ing = action en cours", "always vs now"] },
        { "titre": "Prétérit", "enfants": ["Fait passé terminé", "Réguliers en -ed", "Irréguliers (grow→grew)"] }
      ]
    }$json$),
    ('Les univers professionnels', $json${
      "centre": "Les univers professionnels",
      "branches": [
        { "titre": "Vocabulaire travail", "enfants": ["job, career, occupation", "employer / employee", "skills, salary, résumé"] },
        { "titre": "Chercher un emploi", "enfants": ["to apply for a job", "a job interview", "to hire ≠ to fire"] },
        { "titre": "Capacité & obligation", "enfants": ["can / could = capacité", "must / have to = obligation", "mustn't = interdiction"] },
        { "titre": "Conseil & probabilité", "enfants": ["should = conseil", "may / might = probabilité", "modal + base verbale (sans to)"] }
      ]
    }$json$),
    ('Représentation de soi et d''autrui', $json${
      "centre": "Représentation de soi et d'autrui",
      "branches": [
        { "titre": "Identité", "enfants": ["identity, self-image", "appearance, self-confidence", "peer pressure"] },
        { "titre": "Réseaux sociaux", "enfants": ["profile, followers, to post", "to fit in / stand out", "fake ≠ genuine"] },
        { "titre": "Comparatif", "enfants": ["court : -er than", "long : more … than", "égalité : as … as"] },
        { "titre": "Superlatif", "enfants": ["court : the …-est", "long : the most …", "good/best, bad/worst"] }
      ]
    }$json$),
    ('Le passé dans le présent', $json${
      "centre": "Le passé dans le présent",
      "branches": [
        { "titre": "Histoire & mémoire", "enfants": ["history ≠ a story", "memory, memorial", "to commemorate, heritage"] },
        { "titre": "Traces du passé", "enfants": ["ancestors, roots", "a legacy, a landmark", "to remember ≠ forget"] },
        { "titre": "Prétérit", "enfants": ["Fait daté et terminé", "ended in 1945", "yesterday, ago, then"] },
        { "titre": "Present perfect", "enfants": ["HAVE + participe passé", "since, for, ever, already", "lien avec le présent"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'anglais'
 WHERE c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Anglais', '2de', v.chapter, true, l.id
FROM (VALUES
  ('12519999-0000-4000-8000-000000000001'::uuid, 'Vivre entre générations'),
  ('12519999-0000-4000-8000-000000000002'::uuid, 'Les univers professionnels'),
  ('12519999-0000-4000-8000-000000000003'::uuid, 'Représentation de soi et d''autrui'),
  ('12519999-0000-4000-8000-000000000004'::uuid, 'Le passé dans le présent')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
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
  -- Chapitre 1 — Vivre entre générations
  ('12510000-0000-4000-8000-000000000104'::uuid, 'Vivre entre générations',
   'Que signifie « siblings » ?', 'mcq',
   '["Frères et sœurs", "Grands-parents", "Cousins", "Voisins"]', 0,
   '« Siblings » désigne les frères et sœurs.', 4),
  ('12510000-0000-4000-8000-000000000105'::uuid, 'Vivre entre générations',
   'Quelle expression signifie « transmettre » (de génération en génération) ?', 'mcq',
   '["to hand down", "to give up", "to look after", "to grow up"]', 0,
   '« To hand down » (ou « to pass down ») veut dire transmettre.', 5),
  ('12510000-0000-4000-8000-000000000106'::uuid, 'Vivre entre générations',
   'Choisis la bonne phrase pour une habitude : « My grandfather ___ stories every Sunday. »', 'mcq',
   '["tells", "is telling", "told", "is going to tell"]', 0,
   'Une habitude (« every Sunday ») demande le présent simple : « tells ».', 6),
  ('12510000-0000-4000-8000-000000000107'::uuid, 'Vivre entre générations',
   'Le présent en BE + -ing (present continuous) exprime une action en cours au moment où l''on parle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le present continuous (BE + -ing) décrit une action en train de se dérouler.', 7),
  ('12510000-0000-4000-8000-000000000108'::uuid, 'Vivre entre générations',
   'Quel est le prétérit du verbe irrégulier « grow » ?', 'mcq',
   '["grew", "growed", "grown", "grows"]', 0,
   '« Grow » est irrégulier : grow → grew (→ grown au participe passé).', 8),
  ('12510000-0000-4000-8000-000000000109'::uuid, 'Vivre entre générations',
   'Le marqueur « yesterday » s''emploie avec le présent simple.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : « yesterday » renvoie à un fait passé daté, donc au prétérit.', 9),
  ('12510000-0000-4000-8000-000000000110'::uuid, 'Vivre entre générations',
   'Que signifie « to raise a child » ?', 'mcq',
   '["Élever un enfant", "Punir un enfant", "Adopter un enfant", "Suivre un enfant"]', 0,
   '« To raise » (ou « to bring up ») a child signifie élever un enfant.', 10),

  -- Chapitre 2 — Les univers professionnels
  ('12510000-0000-4000-8000-000000000204'::uuid, 'Les univers professionnels',
   'Que signifie « to apply for a job » ?', 'mcq',
   '["Postuler à un emploi", "Quitter un emploi", "Trouver un emploi", "Perdre un emploi"]', 0,
   '« To apply for a job » signifie postuler à un emploi.', 4),
  ('12510000-0000-4000-8000-000000000205'::uuid, 'Les univers professionnels',
   'Complète : « I ___ speak three languages. » (capacité)', 'mcq',
   '["can", "must", "should", "might"]', 0,
   '« Can » exprime la capacité : « I can speak three languages. »', 5),
  ('12510000-0000-4000-8000-000000000206'::uuid, 'Les univers professionnels',
   'Quel modal exprime une obligation forte ?', 'mcq',
   '["must", "may", "could", "should"]', 0,
   '« Must » (comme « have to ») exprime une obligation forte.', 6),
  ('12510000-0000-4000-8000-000000000207'::uuid, 'Les univers professionnels',
   'Après un modal (can, must, should…), on emploie « to » devant le verbe.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : après un modal, le verbe est à la base verbale, sans « to » (I can go, pas I can to go).', 7),
  ('12510000-0000-4000-8000-000000000208'::uuid, 'Les univers professionnels',
   'Quel modal donne un conseil dans « You ___ prepare for the interview. » ?', 'mcq',
   '["should", "must", "can", "will"]', 0,
   '« Should » exprime le conseil : « tu devrais te préparer ».', 8),
  ('12510000-0000-4000-8000-000000000209'::uuid, 'Les univers professionnels',
   'Que signifie « to hire » ?', 'mcq',
   '["Embaucher", "Licencier", "Démissionner", "Payer"]', 0,
   '« To hire » signifie embaucher (contraire : « to fire », licencier).', 9),
  ('12510000-0000-4000-8000-000000000210'::uuid, 'Les univers professionnels',
   '« Might » exprime une probabilité : « She might get the job. »', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : « may / might » expriment la probabilité (« elle décrochera peut-être le poste »).', 10),

  -- Chapitre 3 — Représentation de soi et d'autrui
  ('12510000-0000-4000-8000-000000000304'::uuid, 'Représentation de soi et d''autrui',
   'Que signifie « followers » sur les réseaux sociaux ?', 'mcq',
   '["Des abonnés", "Des amis proches", "Des messages", "Des photos"]', 0,
   '« Followers » désigne les abonnés qui suivent un profil.', 4),
  ('12510000-0000-4000-8000-000000000305'::uuid, 'Représentation de soi et d''autrui',
   'Comment forme-t-on le comparatif d''un adjectif court comme « tall » ?', 'mcq',
   '["taller than", "more tall than", "the tallest", "as tall"]', 0,
   'Adjectif court : adjectif + -er + than → « taller than ».', 5),
  ('12510000-0000-4000-8000-000000000306'::uuid, 'Représentation de soi et d''autrui',
   'Complète : « This app is ___ that one. » (popular)', 'mcq',
   '["more popular than", "popularer than", "the most popular", "as popular"]', 0,
   'Adjectif long : more + adjectif + than → « more popular than ».', 6),
  ('12510000-0000-4000-8000-000000000307'::uuid, 'Représentation de soi et d''autrui',
   'Le superlatif de « good » est « the goodest ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : « good » est irrégulier → good / better / the best.', 7),
  ('12510000-0000-4000-8000-000000000308'::uuid, 'Représentation de soi et d''autrui',
   'Que signifie « to stand out » ?', 'mcq',
   '["Se démarquer", "S''intégrer", "Se cacher", "Se comparer"]', 0,
   '« To stand out » signifie se démarquer (contraire : « to fit in », s''intégrer).', 8),
  ('12510000-0000-4000-8000-000000000309'::uuid, 'Représentation de soi et d''autrui',
   'Quelle structure exprime l''égalité entre deux éléments ?', 'mcq',
   '["as … as", "more … than", "the … -est", "-er than"]', 0,
   'L''égalité se dit « as … as » : « He is as tall as his father. »', 9),
  ('12510000-0000-4000-8000-000000000310'::uuid, 'Représentation de soi et d''autrui',
   'Que signifie l''adjectif « genuine » ?', 'mcq',
   '["Authentique", "Faux", "Célèbre", "Timide"]', 0,
   '« Genuine » (ou « real ») signifie authentique, contraire de « fake ».', 10),

  -- Chapitre 4 — Le passé dans le présent
  ('12510000-0000-4000-8000-000000000404'::uuid, 'Le passé dans le présent',
   'Quelle est la différence entre « history » et « a story » ?', 'mcq',
   '["history = l''Histoire ; a story = un récit", "Ce sont des synonymes", "history = un récit ; a story = l''Histoire", "Aucune différence de sens"]', 0,
   '« History » désigne l''Histoire (la discipline), « a story » un récit / une histoire racontée.', 4),
  ('12510000-0000-4000-8000-000000000405'::uuid, 'Le passé dans le présent',
   'Complète : « The war ___ in 1945. » (fait daté)', 'mcq',
   '["ended", "has ended", "ends", "is ending"]', 0,
   'Un fait daté (« in 1945 ») demande le prétérit : « ended ».', 5),
  ('12510000-0000-4000-8000-000000000406'::uuid, 'Le passé dans le présent',
   'Comment se forme le present perfect ?', 'mcq',
   '["HAVE + participe passé", "BE + -ing", "DO + base verbale", "WILL + base verbale"]', 0,
   'Le present perfect se construit avec HAVE + participe passé (ex. « I have visited »).', 6),
  ('12510000-0000-4000-8000-000000000407'::uuid, 'Le passé dans le présent',
   'On emploie « since 2010 » avec le present perfect pour une action qui dure encore.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : « since / for » + present perfect expriment une action commencée dans le passé et qui continue.', 7),
  ('12510000-0000-4000-8000-000000000408'::uuid, 'Le passé dans le présent',
   'Quel marqueur va avec le prétérit plutôt qu''avec le present perfect ?', 'mcq',
   '["yesterday", "already", "ever", "since"]', 0,
   '« Yesterday » date le fait dans un passé terminé → prétérit (already, ever, since → present perfect).', 8),
  ('12510000-0000-4000-8000-000000000409'::uuid, 'Le passé dans le présent',
   'Que signifie « to commemorate » ?', 'mcq',
   '["Commémorer", "Oublier", "Détruire", "Construire"]', 0,
   '« To commemorate » signifie commémorer, célébrer le souvenir d''un événement.', 9),
  ('12510000-0000-4000-8000-000000000410'::uuid, 'Le passé dans le présent',
   'Choisis la phrase correcte : « I ___ that museum. » (expérience, sans date précise)', 'mcq',
   '["have visited", "visited yesterday", "am visiting", "will visit"]', 0,
   'Une expérience sans date précise se dit au present perfect : « I have visited that museum. »', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
