-- =============================================================================
-- Studuel — Migration 112 : CONTENU Latin 4e (cours + carte mentale + quiz)
-- Remplit les 3 chapitres de Latin 4e (langue + civilisation) :
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
-- PRÉREQUIS : subjects/chapters/lessons (Latin 4e), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Les verbes : temps du récit', $md$# Les verbes : temps du récit

## Ce que tu vas comprendre
Pour raconter au passé, le latin utilise surtout deux temps de l'indicatif : l'**imparfait** et le **parfait**. Bien les distinguer, c'est comprendre le rythme d'un récit : une action qui dure ou se répète, ou une action achevée qui fait avancer l'histoire.

## 1. L'imparfait de l'indicatif
L'imparfait décrit une action **qui dure**, une **description**, une **habitude** ou une action **en train de se dérouler** dans le passé. On le reconnaît à sa marque **-ba-** insérée entre le radical et la terminaison.

*Exemple : **amabat** = « il aimait » ; **portabant** = « ils portaient ».*

En français, on le traduit par un **imparfait** : « il marchait », « ils habitaient ».

## 2. Le parfait de l'indicatif
Le parfait exprime une action **achevée**, un fait **ponctuel** qui fait progresser le récit. Il correspond en français au **passé simple** (« il fit ») ou au **passé composé** (« il a fait »).

*Exemple : **amavit** = « il aima / il a aimé » ; **venit** = « il vint / il est venu ».*

Le parfait a souvent un **radical particulier**, différent de celui du présent : on l'apprend dans les temps primitifs du verbe.

## 3. Les valeurs dans le récit
Dans un texte, les deux temps se répondent :
- l'**imparfait** pose le **décor**, ce qui dure (le fond du tableau) ;
- le **parfait** rapporte les **actions successives** qui font avancer l'histoire (le premier plan).

| Temps | Valeur | Traduction |
|---|---|---|
| Imparfait | durée, description, habitude | il marchait, il habitait |
| Parfait | action achevée, ponctuelle | il marcha, il a marché |

*Exemple : « **Dum ambulabat** (il marchait), **subito cecidit** (soudain il tomba). » L'imparfait décrit, le parfait fait basculer l'action.*

## 4. Repérer le temps d'un verbe
Pour distinguer les deux, on cherche les indices :
- la marque **-ba-** signale l'**imparfait** ;
- un **radical de parfait** (souvent avec **-v-**, un redoublement, ou un changement de voyelle) signale le **parfait**.

## L'essentiel à retenir
- **Imparfait** (marque **-ba-**) : action qui **dure**, description, habitude → « il aimait ».
- **Parfait** : action **achevée** et ponctuelle → « il aima / il a aimé ».
- Dans le récit : l'imparfait pose le **décor**, le parfait rapporte les **actions**.
- Le parfait a souvent un **radical propre** à mémoriser (temps primitifs).$md$),

    ('La société romaine', $md$# La société romaine

## Ce que tu vas comprendre
La société romaine est fortement **hiérarchisée** : on n'a pas les mêmes droits selon sa naissance et son statut. Ce chapitre présente les grands groupes (patriciens, plébéiens, esclaves, affranchis) et la carrière politique, le **cursus honorum**.

## 1. Patriciens et plébéiens
À l'origine, Rome distingue deux groupes de citoyens :
- les **patriciens** (*patricii*) : les grandes familles nobles, riches, qui détiennent longtemps le pouvoir et les prêtrises ;
- les **plébéiens** (*plebs*) : le reste du peuple libre (paysans, artisans, commerçants).

Après de longues luttes, les plébéiens obtiennent des droits et une magistrature qui les défend : le **tribun de la plèbe** (*tribunus plebis*).

## 2. Les citoyens
Le **citoyen romain** (*civis Romanus*) jouit de droits précieux : voter, être protégé par la loi, faire du commerce, se marier légalement. La formule **« civis Romanus sum »** (« je suis citoyen romain ») était une véritable protection.

Les femmes, elles, ne votaient pas et restaient sous l'autorité du chef de famille, le **pater familias**.

## 3. Esclaves et affranchis
- Les **esclaves** (*servi*) n'étaient pas des personnes libres mais la **propriété** de leur maître (guerres, dettes, naissance). Ils travaillaient dans les champs, les mines, les maisons.
- Un maître pouvait libérer un esclave : celui-ci devenait un **affranchi** (*libertus*). L'affranchi obtenait une liberté et certains droits, mais restait lié à son ancien maître, devenu son **patron**.

## 4. Le cursus honorum
La carrière politique suivait un ordre précis de magistratures, le **cursus honorum** (« la carrière des honneurs »), du poste le plus modeste au plus prestigieux :

| Magistrature | Rôle |
|---|---|
| Questeur | finances |
| Édile | fêtes, marchés, voirie |
| Préteur | justice |
| Consul | le plus haut pouvoir (2 par an) |

Après le consulat, les plus éminents pouvaient devenir **censeurs** ou entrer au **Sénat**, l'assemblée qui guidait la République.

## L'essentiel à retenir
- **Patriciens** = nobles ; **plébéiens** = peuple libre ; le **tribun de la plèbe** défend ce dernier.
- Le **citoyen** (*civis*) a des droits : voter, être protégé par la loi.
- **Esclave** (*servus*) = non libre ; une fois libéré, il devient **affranchi** (*libertus*).
- Le **cursus honorum** : questeur → édile → préteur → consul.$md$),

    ('Mythes et héros', $md$# Mythes et héros

## Ce que tu vas comprendre
Les Romains se racontaient leurs origines à travers des **mythes** et des **héros**. Le plus célèbre récit est celui d'**Énée**, ancêtre légendaire de Rome, chanté par le poète **Virgile**. Ce chapitre présente ces légendes et les grands dieux romains.

## 1. Énée et l'Énéide
**Énée** (*Aeneas*) est un prince troyen, fils de la déesse **Vénus**. Après la chute de **Troie**, il fuit la ville en flammes en portant son vieux père **Anchise** sur son dos et en tenant son fils **Ascagne** par la main : c'est l'image du héros **pieux** (*pius Aeneas*), respectueux des dieux et de sa famille.

Guidé par le destin, il voyage jusqu'en **Italie**, où ses descendants fonderont Rome. Ses aventures sont racontées par **Virgile** dans un grand poème épique, l'**Énéide** (*Aeneis*).

## 2. Romulus et Remus
Une autre légende explique la **fondation de Rome**. Les jumeaux **Romulus** et **Remus**, descendants d'Énée, sont abandonnés puis allaités par une **louve** (*lupa*). Devenus grands, ils décident de fonder une ville ; après une querelle, **Romulus** tue son frère et donne son nom à **Rome** (753 av. J.-C. selon la tradition).

## 3. Les dieux romains
Les Romains honoraient de nombreux dieux, souvent proches des dieux grecs :

| Dieu romain | Domaine | Équivalent grec |
|---|---|---|
| Jupiter | roi des dieux, ciel | Zeus |
| Junon | mariage, reine | Héra |
| Minerve | sagesse, guerre | Athéna |
| Mars | la guerre | Arès |
| Vénus | amour, beauté | Aphrodite |
| Neptune | la mer | Poséidon |

On leur rendait un culte avec des **prières**, des **offrandes** et des **sacrifices** dans les **temples**.

## 4. Héros et légendes
Les héros incarnent des **valeurs** que Rome admire : le courage, la fidélité, le sens du devoir (*pietas*), l'amour de la patrie. Ces récits n'étaient pas de simples histoires : ils servaient à **enseigner** ces vertus et à donner à Rome un passé glorieux.

## L'essentiel à retenir
- **Énée**, prince troyen fils de **Vénus**, est l'ancêtre légendaire de Rome ; ses voyages sont racontés dans l'**Énéide** de **Virgile**.
- **Romulus et Remus**, allaités par une **louve**, sont les fondateurs de Rome ; Romulus lui donne son nom.
- Grands dieux : **Jupiter** (Zeus), **Junon** (Héra), **Minerve** (Athéna), **Mars**, **Vénus**, **Neptune**.
- Les mythes transmettent des **valeurs** : courage, *pietas*, amour de la patrie.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'latin'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Les verbes : temps du récit', $json${
      "centre": "Les verbes : temps du récit",
      "branches": [
        { "titre": "Imparfait", "enfants": ["Marque -ba-", "Action qui dure, description", "amabat = il aimait"] },
        { "titre": "Parfait", "enfants": ["Action achevée, ponctuelle", "Passé simple / composé", "amavit = il aima"] },
        { "titre": "Valeurs dans le récit", "enfants": ["Imparfait = le décor", "Parfait = les actions", "Ils se répondent"] },
        { "titre": "Repérer le temps", "enfants": ["-ba- → imparfait", "Radical de parfait (-v-…)", "Temps primitifs à apprendre"] }
      ]
    }$json$),
    ('La société romaine', $json${
      "centre": "La société romaine",
      "branches": [
        { "titre": "Patriciens et plébéiens", "enfants": ["Patriciens = nobles", "Plébéiens = peuple libre", "Tribun de la plèbe"] },
        { "titre": "Les citoyens", "enfants": ["Civis Romanus", "Voter, protégé par la loi", "Pater familias"] },
        { "titre": "Esclaves et affranchis", "enfants": ["Servus = non libre", "Libertus = affranchi", "Lié à son patron"] },
        { "titre": "Cursus honorum", "enfants": ["Questeur, édile", "Préteur, consul", "Sénat"] }
      ]
    }$json$),
    ('Mythes et héros', $json${
      "centre": "Mythes et héros",
      "branches": [
        { "titre": "Énée", "enfants": ["Prince troyen, fils de Vénus", "Fuit Troie avec Anchise", "Ancêtre de Rome"] },
        { "titre": "L'Énéide", "enfants": ["Poème de Virgile", "Voyage vers l'Italie", "Pius Aeneas"] },
        { "titre": "Romulus et Remus", "enfants": ["Allaités par la louve", "Fondation de Rome", "753 av. J.-C."] },
        { "titre": "Les dieux romains", "enfants": ["Jupiter, Junon, Minerve", "Mars, Vénus, Neptune", "Proches des dieux grecs"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'latin'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Latin', '4e', v.chapter, true, l.id
FROM (VALUES
  ('11219999-0000-4000-8000-000000000001'::uuid, 'Les verbes : temps du récit'),
  ('11219999-0000-4000-8000-000000000002'::uuid, 'La société romaine'),
  ('11219999-0000-4000-8000-000000000003'::uuid, 'Mythes et héros')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'latin'
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
  -- Chapitre 1 — Les verbes : temps du récit
  ('11210000-0000-4000-8000-000000000104'::uuid, 'Les verbes : temps du récit',
   'Quelle marque reconnaît-on dans un verbe à l''imparfait latin ?', 'mcq',
   '["-ba-", "-v-", "-nt", "-us"]', 0,
   'La marque -ba- s''insère entre le radical et la terminaison : amabat = il aimait.', 4),
  ('11210000-0000-4000-8000-000000000105'::uuid, 'Les verbes : temps du récit',
   'Que traduit-on par « il aimait » ?', 'mcq',
   '["amabat", "amavit", "amat", "amabit"]', 0,
   'amabat est un imparfait : action qui dure dans le passé → « il aimait ».', 5),
  ('11210000-0000-4000-8000-000000000106'::uuid, 'Les verbes : temps du récit',
   'Le parfait latin exprime une action achevée, souvent traduite par le passé simple.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le parfait rapporte un fait ponctuel et achevé : « il aima / il a aimé ».', 6),
  ('11210000-0000-4000-8000-000000000107'::uuid, 'Les verbes : temps du récit',
   'Dans un récit, quel temps sert surtout à planter le décor et décrire ?', 'mcq',
   '["L''imparfait", "Le parfait", "Le présent", "Le futur"]', 0,
   'L''imparfait pose le décor et ce qui dure ; le parfait rapporte les actions successives.', 7),
  ('11210000-0000-4000-8000-000000000108'::uuid, 'Les verbes : temps du récit',
   'Comment traduit-on le parfait « venit » ?', 'mcq',
   '["il vint / il est venu", "il venait", "il viendra", "il vient toujours"]', 0,
   'venit (parfait) = « il vint / il est venu » : action achevée.', 8),
  ('11210000-0000-4000-8000-000000000109'::uuid, 'Les verbes : temps du récit',
   'Le radical du parfait est toujours identique à celui du présent.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le parfait a souvent un radical propre (avec -v-, redoublement, changement de voyelle), à apprendre dans les temps primitifs.', 9),
  ('11210000-0000-4000-8000-000000000110'::uuid, 'Les verbes : temps du récit',
   'Dans « Dum ambulabat, subito cecidit », quel verbe est au parfait ?', 'mcq',
   '["cecidit", "ambulabat", "les deux", "aucun"]', 0,
   'ambulabat est un imparfait (il marchait), cecidit un parfait (il tomba) qui fait basculer l''action.', 10),

  -- Chapitre 2 — La société romaine
  ('11210000-0000-4000-8000-000000000204'::uuid, 'La société romaine',
   'Comment appelle-t-on les grandes familles nobles de Rome ?', 'mcq',
   '["Les patriciens", "Les plébéiens", "Les esclaves", "Les affranchis"]', 0,
   'Les patriciens (patricii) sont les familles nobles qui détiennent longtemps le pouvoir.', 4),
  ('11210000-0000-4000-8000-000000000205'::uuid, 'La société romaine',
   'Quelle magistrature défendait spécialement le peuple, la plèbe ?', 'mcq',
   '["Le tribun de la plèbe", "Le consul", "Le préteur", "Le censeur"]', 0,
   'Le tribun de la plèbe (tribunus plebis) protégeait les droits des plébéiens.', 5),
  ('11210000-0000-4000-8000-000000000206'::uuid, 'La société romaine',
   'Un esclave (servus) était considéré comme la propriété de son maître.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''esclave n''était pas libre : il était la propriété de son maître.', 6),
  ('11210000-0000-4000-8000-000000000207'::uuid, 'La société romaine',
   'Comment nomme-t-on un esclave qui a été libéré par son maître ?', 'mcq',
   '["Un affranchi (libertus)", "Un patricien", "Un citoyen de naissance", "Un tribun"]', 0,
   'Libéré, l''esclave devient un affranchi (libertus), lié à son ancien maître devenu son patron.', 7),
  ('11210000-0000-4000-8000-000000000208'::uuid, 'La société romaine',
   'Quel était le poste le plus élevé du cursus honorum ?', 'mcq',
   '["Le consul", "Le questeur", "L''édile", "Le préteur"]', 0,
   'Le cursus honorum montait du questeur au consul, le poste le plus haut (2 consuls par an).', 8),
  ('11210000-0000-4000-8000-000000000209'::uuid, 'La société romaine',
   'Le citoyen romain (civis) avait le droit de voter et d''être protégé par la loi.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La citoyenneté donnait des droits : voter, être protégé par la loi, commercer, se marier légalement.', 9),
  ('11210000-0000-4000-8000-000000000210'::uuid, 'La société romaine',
   'Dans le cursus honorum, quelle magistrature s''occupait surtout de la justice ?', 'mcq',
   '["Le préteur", "L''édile", "Le questeur", "Le censeur"]', 0,
   'Le préteur était chargé de la justice ; le questeur des finances, l''édile des fêtes et marchés.', 10),

  -- Chapitre 3 — Mythes et héros
  ('11210000-0000-4000-8000-000000000304'::uuid, 'Mythes et héros',
   'Qui est le héros troyen considéré comme l''ancêtre légendaire de Rome ?', 'mcq',
   '["Énée", "Romulus", "Jupiter", "Ulysse"]', 0,
   'Énée (Aeneas), prince troyen fils de Vénus, est l''ancêtre légendaire de Rome.', 4),
  ('11210000-0000-4000-8000-000000000305'::uuid, 'Mythes et héros',
   'Quel poète a raconté les aventures d''Énée dans l''Énéide ?', 'mcq',
   '["Virgile", "Ovide", "César", "Cicéron"]', 0,
   'C''est Virgile qui chante Énée dans son poème épique, l''Énéide.', 5),
  ('11210000-0000-4000-8000-000000000306'::uuid, 'Mythes et héros',
   'Selon la légende, les jumeaux Romulus et Remus ont été allaités par une louve.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Abandonnés, Romulus et Remus sont allaités par une louve (lupa) avant de fonder Rome.', 6),
  ('11210000-0000-4000-8000-000000000307'::uuid, 'Mythes et héros',
   'Quel dieu romain est le roi des dieux, équivalent du grec Zeus ?', 'mcq',
   '["Jupiter", "Mars", "Neptune", "Mercure"]', 0,
   'Jupiter, dieu du ciel et roi des dieux, correspond au grec Zeus.', 7),
  ('11210000-0000-4000-8000-000000000308'::uuid, 'Mythes et héros',
   'Quelle déesse romaine, mère d''Énée, correspond à la grecque Aphrodite ?', 'mcq',
   '["Vénus", "Junon", "Minerve", "Diane"]', 0,
   'Vénus, déesse de l''amour et de la beauté, correspond à Aphrodite ; elle est la mère d''Énée.', 8),
  ('11210000-0000-4000-8000-000000000309'::uuid, 'Mythes et héros',
   'Fuyant Troie, Énée porte son vieux père Anchise sur son dos : c''est l''image du héros pieux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Cette scène illustre la pietas d''Énée (pius Aeneas), respectueux des dieux et de sa famille.', 9),
  ('11210000-0000-4000-8000-000000000310'::uuid, 'Mythes et héros',
   'Quel dieu romain, équivalent de Poséidon, règne sur la mer ?', 'mcq',
   '["Neptune", "Mars", "Jupiter", "Vulcain"]', 0,
   'Neptune est le dieu de la mer, équivalent du grec Poséidon.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'latin'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
