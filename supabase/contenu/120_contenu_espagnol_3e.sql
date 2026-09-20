-- =============================================================================
-- Studuel — Migration 120 : CONTENU Espagnol 3e (+ exercices types)
-- Remplit les 4 chapitres d'Espagnol 3e (LV2 année 3, niveau A2) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--   4. Exercices   → lessons.content de « Exercices types » (2 exercices corrigés
--                    par chapitre), même motif de jointure.
--
-- Motif idempotent (comme 090/111) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : les subjects/chapters/lessons d'Espagnol 3e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('El pretérito indefinido', $md$# El pretérito indefinido

## Ce que tu vas comprendre
Le **pretérito indefinido** (le « passé simple » espagnol) sert à raconter des actions **passées et terminées**, à un moment **précis** du passé. Il correspond souvent au passé composé ou au passé simple français : *ayer comí una pizza* = « hier, j'ai mangé une pizza ».

## 1. Les verbes réguliers en -ar
On enlève la terminaison **-ar** et on ajoute les terminaisons du passé.

| Personne | hablar (parler) |
|---|---|
| yo | hablé |
| tú | hablaste |
| él / ella / usted | habló |
| nosotros | hablamos |
| vosotros | hablasteis |
| ellos / ustedes | hablaron |

*Attention aux accents : **hablé** et **habló** en portent un.*

## 2. Les verbes réguliers en -er et -ir
Bonne nouvelle : les verbes en **-er** et en **-ir** partagent **les mêmes** terminaisons.

| Personne | comer (manger) | vivir (vivre) |
|---|---|---|
| yo | comí | viví |
| tú | comiste | viviste |
| él / ella | comió | vivió |
| nosotros | comimos | vivimos |
| vosotros | comisteis | vivisteis |
| ellos | comieron | vivieron |

## 3. Les irréguliers les plus fréquents
Certains verbes très courants sont irréguliers et **sans accent** :

| Personne | ir / ser | hacer | tener |
|---|---|---|---|
| yo | fui | hice | tuve |
| tú | fuiste | hiciste | tuviste |
| él / ella | fue | hizo | tuvo |
| nosotros | fuimos | hicimos | tuvimos |
| ellos | fueron | hicieron | tuvieron |

*Remarque : **ir** et **ser** ont exactly la même conjugaison ; le sens se devine avec le contexte.*

## 4. Les marqueurs de temps
Le pretérito indefinido s'emploie avec des mots qui situent l'action dans un passé **fini** :
- **ayer** (hier), **anteayer** (avant-hier)
- **el año pasado** (l'an dernier), **la semana pasada** (la semaine dernière)
- **hace dos días** (il y a deux jours), **en 2015**

*Exemple : **El año pasado viajé a España** = « l'an dernier, j'ai voyagé en Espagne ».*

## L'essentiel à retenir
- -ar → **-é, -aste, -ó, -amos, -asteis, -aron** ; -er/-ir → **-í, -iste, -ió, -imos, -isteis, -ieron**.
- Irréguliers clés : ir/ser (**fui, fue, fueron**), hacer (**hice, hizo**), tener (**tuve, tuvo**).
- Marqueurs : ayer, el año pasado, la semana pasada, hace…
- On l'utilise pour une action **passée et terminée**.$md$),

    ('Hablar del futuro', $md$# Hablar del futuro

## Ce que tu vas comprendre
Pour parler de l'**avenir** en espagnol, tu disposes de deux outils : le **futuro simple** (un temps à part entière) et la tournure **ir a + infinitivo** (le futur proche). Ce chapitre t'apprend à les former et à choisir le bon.

## 1. Le futuro simple : formation
On part de l'**infinitif entier** (hablar, comer, vivir) et on ajoute **les mêmes terminaisons** pour les trois groupes.

| Personne | Terminaison | hablar |
|---|---|---|
| yo | -é | hablaré |
| tú | -ás | hablarás |
| él / ella | -á | hablará |
| nosotros | -emos | hablaremos |
| vosotros | -éis | hablaréis |
| ellos | -án | hablarán |

*Toutes les terminaisons portent un accent, sauf **-emos**.*

## 2. Les futurs irréguliers
Quelques verbes changent leur **radical**, mais gardent les mêmes terminaisons :
- tener → **tendré**, poner → **pondré**, salir → **saldré**, venir → **vendré**
- hacer → **haré**, decir → **diré**, poder → **podré**, querer → **querré**, saber → **sabré**

*Exemple : **Mañana tendré tiempo** = « demain, j'aurai du temps ».*

## 3. Le futur proche : ir a + infinitivo
On conjugue **ir** au présent, puis **a**, puis le verbe à l'**infinitif**. C'est le futur le plus courant à l'oral.

| Personne | ir a + infinitif |
|---|---|
| yo | voy a estudiar |
| tú | vas a comer |
| él / ella | va a salir |
| nosotros | vamos a viajar |
| ellos | van a jugar |

*Exemple : **Voy a estudiar** esta tarde = « je vais étudier cet après-midi ».*

## 4. Les marqueurs de temps
- **mañana** (demain), **pasado mañana** (après-demain)
- **la próxima semana** (la semaine prochaine), **el año que viene** (l'année prochaine)
- **dentro de dos días** (dans deux jours)

## L'essentiel à retenir
- Futuro simple : **infinitif + -é, -ás, -á, -emos, -éis, -án**.
- Irréguliers : tendré, pondré, saldré, vendré, haré, diré, podré.
- Futur proche : **ir (présent) + a + infinitif** (voy a comer).
- Marqueurs : mañana, la próxima semana, el año que viene, dentro de…$md$),

    ('El mundo hispánico', $md$# El mundo hispánico

## Ce que tu vas comprendre
L'espagnol n'est pas parlé qu'en Espagne : c'est une langue **mondiale**. Ce chapitre te fait découvrir la **géographie**, les **pays** et la **culture** du monde hispanique, en Espagne comme en Amérique latine.

## 1. Une langue mondiale
L'espagnol est la langue officielle d'une **vingtaine de pays** et il est parlé par environ **500 millions** de personnes. C'est l'une des langues les plus parlées au monde.

## 2. L'Espagne (España)
- Capitale : **Madrid**. Grandes villes : **Barcelona, Sevilla, Valencia**.
- Régions et langues : le castillan (**castellano**), mais aussi le catalan, le galicien, le basque.
- Culture : le **flamenco** (Andalousie), les **tapas**, les fêtes comme **La Tomatina** ou les **Fallas**.

## 3. L'Amérique latine (Hispanoamérica)
De nombreux pays et leurs capitales :

| Pays | Capitale |
|---|---|
| México | Ciudad de México |
| Argentina | Buenos Aires |
| Perú | Lima |
| Colombia | Bogotá |
| Chile | Santiago |

*Le Brésil (Brasil) fait exception : on y parle **portugais**, pas espagnol.*

## 4. Géographie et culture
- Reliefs : la cordillère des **Andes** (la plus longue du monde), la forêt de l'**Amazonas**.
- Fêtes : le **Día de los Muertos** (Mexique), le **carnaval**.
- Danses : le **tango** (Argentine), la **salsa** (Caraïbes).
- Personnalités : Frida Kahlo, Pablo Neruda, Gabriel García Márquez.

## L'essentiel à retenir
- L'espagnol : ~**20 pays**, ~**500 millions** de locuteurs.
- Espagne : capitale **Madrid** ; flamenco, tapas.
- Amérique latine : México, Argentina (Buenos Aires), Perú (Lima), Colombia (Bogotá).
- Reliefs **Andes / Amazonas** ; fêtes **Día de los Muertos** ; le Brésil parle portugais.$md$),

    ('Preparar la expresión oral', $md$# Preparar la expresión oral

## Ce que tu vas comprendre
À l'examen, tu dois souvent **te présenter**, **décrire une image** et **donner ton avis** en espagnol. Ce chapitre te donne les **phrases-clés** et une méthode pour réussir ton oral avec assurance.

## 1. Se présenter (presentarse)
Quelques structures indispensables :
- **Me llamo Lucas** = « je m'appelle Lucas ».
- **Tengo quince años** = « j'ai quinze ans » (âge avec **tener**, pas *ser* !).
- **Vivo en Toulouse** = « je vis à Toulouse ».
- **Me gusta el deporte y estudiar idiomas** = « j'aime le sport et étudier les langues ».

## 2. Décrire une image (describir una imagen)
On situe les éléments dans l'espace :

| Expression | Sens |
|---|---|
| en la foto / imagen veo… | sur la photo, je vois… |
| en primer plano | au premier plan |
| al fondo | à l'arrière-plan |
| a la derecha / a la izquierda | à droite / à gauche |
| en el centro | au centre |
| hay… | il y a… |

*Exemple : **En la foto veo a una familia. En primer plano hay dos niños** = « sur la photo, je vois une famille. Au premier plan, il y a deux enfants ».*

## 3. Donner son avis (dar su opinión)
- **Creo que…** / **Pienso que…** = « je crois que… / je pense que… »
- **En mi opinión…** = « à mon avis… »
- **Me parece que…** = « il me semble que… »
- **Estoy de acuerdo** / **No estoy de acuerdo** = « je suis d'accord / pas d'accord ».

## 4. Structurer son propos
- Commencer : **Para empezar…** (pour commencer).
- Ajouter : **además** (de plus), **también** (aussi).
- Conclure : **para terminar…** (pour finir), **en conclusión…**

## L'essentiel à retenir
- Se présenter : **Me llamo…**, **Tengo … años**, **Vivo en…**
- Décrire : **en la foto veo…**, **en primer plano**, **al fondo**, **a la derecha**, **hay…**
- Donner son avis : **Creo que…**, **En mi opinión…**, **Me parece que…**
- Structurer : para empezar, además, para terminar.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'espagnol'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('El pretérito indefinido', $json${
      "centre": "El pretérito indefinido",
      "branches": [
        { "titre": "Verbes en -ar", "enfants": ["hablé, hablaste, habló", "hablamos, hablasteis, hablaron", "Accents : hablé, habló"] },
        { "titre": "Verbes en -er / -ir", "enfants": ["Mêmes terminaisons", "comí, comió, comieron", "viví, vivió, vivieron"] },
        { "titre": "Irréguliers clés", "enfants": ["ir/ser : fui, fue, fueron", "hacer : hice, hizo", "tener : tuve, tuvo"] },
        { "titre": "Marqueurs de temps", "enfants": ["ayer, anteayer", "el año pasado", "la semana pasada, hace…"] }
      ]
    }$json$),
    ('Hablar del futuro', $json${
      "centre": "Hablar del futuro",
      "branches": [
        { "titre": "Futuro simple", "enfants": ["Infinitif + terminaisons", "-é, -ás, -á, -emos, -éis, -án", "hablaré, comeré, viviré"] },
        { "titre": "Irréguliers", "enfants": ["tendré, pondré, saldré", "haré, diré, podré", "vendré, querré, sabré"] },
        { "titre": "Ir a + infinitivo", "enfants": ["Futur proche", "voy a estudiar", "vamos a viajar"] },
        { "titre": "Marqueurs", "enfants": ["mañana, pasado mañana", "la próxima semana", "el año que viene, dentro de…"] }
      ]
    }$json$),
    ('El mundo hispánico', $json${
      "centre": "El mundo hispánico",
      "branches": [
        { "titre": "Une langue mondiale", "enfants": ["~20 pays", "~500 millions de locuteurs", "Langue officielle"] },
        { "titre": "España", "enfants": ["Capitale : Madrid", "Barcelona, Sevilla, Valencia", "flamenco, tapas"] },
        { "titre": "Hispanoamérica", "enfants": ["México, Argentina, Perú", "Buenos Aires, Lima, Bogotá", "Brésil = portugais"] },
        { "titre": "Géo et culture", "enfants": ["Andes, Amazonas", "Día de los Muertos", "tango, salsa"] }
      ]
    }$json$),
    ('Preparar la expresión oral', $json${
      "centre": "Preparar la expresión oral",
      "branches": [
        { "titre": "Se présenter", "enfants": ["Me llamo…", "Tengo … años (tener)", "Vivo en…"] },
        { "titre": "Décrire une image", "enfants": ["En la foto veo…", "en primer plano / al fondo", "a la derecha, hay…"] },
        { "titre": "Donner son avis", "enfants": ["Creo que… / Pienso que…", "En mi opinión…", "Me parece que…"] },
        { "titre": "Structurer", "enfants": ["Para empezar…", "además, también", "para terminar…"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'espagnol'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds ont déjà créé les quiz ; ce bloc ne fait rien
--     si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Espagnol', '3e', v.chapter, true, l.id
FROM (VALUES
  ('12019999-0000-4000-8000-000000000001'::uuid, 'El pretérito indefinido'),
  ('12019999-0000-4000-8000-000000000002'::uuid, 'Hablar del futuro'),
  ('12019999-0000-4000-8000-000000000003'::uuid, 'El mundo hispánico'),
  ('12019999-0000-4000-8000-000000000004'::uuid, 'Preparar la expresión oral')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'espagnol'
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
  -- Chapitre 1 — El pretérito indefinido
  ('12010000-0000-4000-8000-000000000104'::uuid, 'El pretérito indefinido',
   'Quelle est la forme de « hablar » à la 1re personne du singulier au pretérito indefinido ?', 'mcq',
   '["hablé", "hablo", "hablaré", "hablaba"]', 0,
   'Verbe en -ar, yo → -é : hablé (« j''ai parlé »).', 4),
  ('12010000-0000-4000-8000-000000000105'::uuid, 'El pretérito indefinido',
   'Choisis la forme de « comer » à la 3e personne du singulier (él).', 'mcq',
   '["comió", "comé", "comí", "comía"]', 0,
   'Verbe en -er, él → -ió : comió (« il / elle a mangé »).', 5),
  ('12010000-0000-4000-8000-000000000106'::uuid, 'El pretérito indefinido',
   'Au pretérito indefinido, « ir » et « ser » se conjuguent de la même façon.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les deux verbes partagent la même conjugaison : fui, fuiste, fue, fuimos, fuisteis, fueron.', 6),
  ('12010000-0000-4000-8000-000000000107'::uuid, 'El pretérito indefinido',
   'Quel marqueur de temps accompagne le pretérito indefinido ?', 'mcq',
   '["Ayer", "Hoy", "Mañana", "Ahora"]', 0,
   'Ayer (hier) situe l''action dans un passé terminé, comme el año pasado ou la semana pasada.', 7),
  ('12010000-0000-4000-8000-000000000108'::uuid, 'El pretérito indefinido',
   'Quelle est la forme de « hacer » avec « yo » ?', 'mcq',
   '["hice", "hací", "hago", "hacé"]', 0,
   'hacer est irrégulier : yo hice (« j''ai fait »).', 8),
  ('12010000-0000-4000-8000-000000000109'::uuid, 'El pretérito indefinido',
   'Quelle est la forme de « tener » avec « él » ?', 'mcq',
   '["tuvo", "tenió", "tuve", "tiene"]', 0,
   'tener est irrégulier : él tuvo (« il / elle a eu »).', 9),
  ('12010000-0000-4000-8000-000000000110'::uuid, 'El pretérito indefinido',
   'La phrase « El año pasado viajé a España » raconte une action passée et terminée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« El año pasado » situe l''action dans un passé fini : on emploie le pretérito indefinido (viajé).', 10),

  -- Chapitre 2 — Hablar del futuro
  ('12010000-0000-4000-8000-000000000204'::uuid, 'Hablar del futuro',
   'Quelle est la forme de « hablar » au futuro simple avec « yo » ?', 'mcq',
   '["hablaré", "hablaría", "hablo", "hablaba"]', 0,
   'Futuro simple : infinitif + terminaison -é → hablaré (« je parlerai »).', 4),
  ('12010000-0000-4000-8000-000000000205'::uuid, 'Hablar del futuro',
   'Que exprime la tournure « ir a + infinitivo » ?', 'mcq',
   '["Un futur proche", "Le passé", "Une habitude", "Un ordre"]', 0,
   '« ir a + infinitif » (voy a comer) exprime un futur proche, comme « je vais manger ».', 5),
  ('12010000-0000-4000-8000-000000000206'::uuid, 'Hablar del futuro',
   'Quel est le futuro simple irrégulier de « tener » (yo) ?', 'mcq',
   '["tendré", "teneré", "tendría", "tuve"]', 0,
   'tener a un radical irrégulier au futur : tendré (« j''aurai »).', 6),
  ('12010000-0000-4000-8000-000000000207'::uuid, 'Hablar del futuro',
   'Que signifie « Voy a estudiar » ?', 'mcq',
   '["Je vais étudier", "J''ai étudié", "J''étudiais", "Étudie !"]', 0,
   '« Voy a estudiar » est un futur proche : « je vais étudier ».', 7),
  ('12010000-0000-4000-8000-000000000208'::uuid, 'Hablar del futuro',
   'Au futuro simple, les terminaisons sont les mêmes pour les verbes en -ar, -er et -ir.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les trois groupes prennent les mêmes terminaisons (-é, -ás, -á, -emos, -éis, -án) ajoutées à l''infinitif.', 8),
  ('12010000-0000-4000-8000-000000000209'::uuid, 'Hablar del futuro',
   'Quel est le futuro simple irrégulier de « hacer » (yo) ?', 'mcq',
   '["haré", "haceré", "hice", "haría"]', 0,
   'hacer est irrégulier au futur : haré (« je ferai »).', 9),
  ('12010000-0000-4000-8000-000000000210'::uuid, 'Hablar del futuro',
   'Quel marqueur de temps annonce le futur ?', 'mcq',
   '["Mañana", "Ayer", "Anteayer", "Hace un año"]', 0,
   'Mañana (demain) situe l''action dans l''avenir, comme la próxima semana.', 10),

  -- Chapitre 3 — El mundo hispánico
  ('12010000-0000-4000-8000-000000000304'::uuid, 'El mundo hispánico',
   'Dans combien de pays l''espagnol est-il langue officielle (environ) ?', 'mcq',
   '["Une vingtaine", "Deux", "Cinquante", "Cinq"]', 0,
   'L''espagnol est langue officielle d''une vingtaine de pays et parlé par ~500 millions de personnes.', 4),
  ('12010000-0000-4000-8000-000000000305'::uuid, 'El mundo hispánico',
   'Quelle est la capitale de l''Espagne ?', 'mcq',
   '["Madrid", "Barcelona", "Lisboa", "México"]', 0,
   'La capitale de l''Espagne est Madrid ; Barcelona est une grande ville, mais pas la capitale.', 5),
  ('12010000-0000-4000-8000-000000000306'::uuid, 'El mundo hispánico',
   'Quelle est la plus longue cordillère d''Amérique du Sud ?', 'mcq',
   '["Les Andes", "Les Alpes", "L''Himalaya", "Les Pyrénées"]', 0,
   'La cordillère des Andes traverse l''Amérique du Sud du nord au sud.', 6),
  ('12010000-0000-4000-8000-000000000307'::uuid, 'El mundo hispánico',
   'Le « Día de los Muertos » est une fête traditionnelle de quel pays ?', 'mcq',
   '["Le Mexique", "Le Japon", "Le Portugal", "Le Maroc"]', 0,
   'Le Día de los Muertos est une célèbre fête mexicaine en hommage aux défunts.', 7),
  ('12010000-0000-4000-8000-000000000308'::uuid, 'El mundo hispánico',
   'L''espagnol est parlé par environ 500 millions de personnes dans le monde.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est l''une des langues les plus parlées au monde, avec près de 500 millions de locuteurs.', 8),
  ('12010000-0000-4000-8000-000000000309'::uuid, 'El mundo hispánico',
   'Buenos Aires est la capitale de quel pays ?', 'mcq',
   '["L''Argentine", "Le Chili", "Le Pérou", "La Colombie"]', 0,
   'Buenos Aires est la capitale de l''Argentine (Santiago = Chili, Lima = Pérou).', 9),
  ('12010000-0000-4000-8000-000000000310'::uuid, 'El mundo hispánico',
   'Quelle danse traditionnelle est associée à l''Argentine ?', 'mcq',
   '["Le tango", "Le flamenco", "La salsa", "Le reggaeton"]', 0,
   'Le tango est né à Buenos Aires ; le flamenco vient d''Espagne (Andalousie).', 10),

  -- Chapitre 4 — Preparar la expresión oral
  ('12010000-0000-4000-8000-000000000404'::uuid, 'Preparar la expresión oral',
   'Comment dit-on « je m''appelle » pour se présenter ?', 'mcq',
   '["Me llamo…", "Se llama…", "Te llamas…", "Nos llamamos…"]', 0,
   'Pour se présenter, on utilise « Me llamo… » (je m''appelle).', 4),
  ('12010000-0000-4000-8000-000000000405'::uuid, 'Preparar la expresión oral',
   'À quoi sert l''expression « En la foto veo… » ?', 'mcq',
   '["À décrire une image", "À donner l''heure", "À se présenter", "À conjuguer"]', 0,
   '« En la foto veo… » (sur la photo, je vois…) sert à décrire une image.', 5),
  ('12010000-0000-4000-8000-000000000406'::uuid, 'Preparar la expresión oral',
   'Que signifie « en primer plano » ?', 'mcq',
   '["Au premier plan", "À l''arrière-plan", "À droite", "En haut"]', 0,
   '« en primer plano » = au premier plan ; « al fondo » = à l''arrière-plan.', 6),
  ('12010000-0000-4000-8000-000000000407'::uuid, 'Preparar la expresión oral',
   'Quelle expression sert à donner son avis ?', 'mcq',
   '["Creo que…", "Tengo que…", "Voy a…", "Hace…"]', 0,
   '« Creo que… » (je crois que…) introduit une opinion, comme « En mi opinión… ».', 7),
  ('12010000-0000-4000-8000-000000000408'::uuid, 'Preparar la expresión oral',
   'L''expression « al fondo » signifie « à l''arrière-plan ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« al fondo » = à l''arrière-plan, par opposition à « en primer plano » (au premier plan).', 8),
  ('12010000-0000-4000-8000-000000000409'::uuid, 'Preparar la expresión oral',
   'Comment dit-on son âge en espagnol ?', 'mcq',
   '["Tengo 15 años", "Soy 15 años", "Estoy 15 años", "Hago 15 años"]', 0,
   'On exprime l''âge avec le verbe tener : « Tengo 15 años » (j''ai 15 ans).', 9),
  ('12010000-0000-4000-8000-000000000410'::uuid, 'Preparar la expresión oral',
   'L''expression « En mi opinión » introduit une opinion personnelle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« En mi opinión… » (à mon avis…) sert à donner son opinion, comme « Me parece que… ».', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'espagnol'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPES — lessons.content de « Exercices types » (4 chapitres)
--     Même motif de jointure que la section 1, mais sur la leçon 'Exercices types'
--     (position 2). Garde IS DISTINCT FROM → idempotent.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('El pretérito indefinido', $md$# Exercices — El pretérito indefinido

Entraîne-toi au passé simple espagnol. Fais chaque exercice **avant** de regarder la correction.

## Exercice 1 — Conjuguer au pretérito indefinido
Mets le verbe entre parenthèses à la personne demandée.
1. Ayer (hablar, yo) ______ con mi abuela.
2. El año pasado (viajar, nosotros) ______ a México.
3. (comer, ella) ______ una paella el domingo.
4. La semana pasada (escribir, ellos) ______ una carta.

### Correction
1. **hablé** — verbe en -ar, yo → -é.
2. **viajamos** — verbe en -ar, nosotros → -amos.
3. **comió** — verbe en -er, ella → -ió.
4. **escribieron** — verbe en -ir, ellos → -ieron.

## Exercice 2 — Compléter avec un verbe irrégulier
Choisis la bonne forme (ir/ser, hacer, tener).
1. La fiesta ______ (ser, él) muy divertida.
2. El sábado (hacer, yo) ______ mis deberes.
3. Ellos (tener, ellos) ______ mucha suerte.
4. Anteayer (ir, nosotros) ______ al cine.

### Correction
1. **fue** — ser au indefinido : fui, fuiste, **fue**…
2. **hice** — hacer, yo → **hice**.
3. **tuvieron** — tener, ellos → **tuvieron**.
4. **fuimos** — ir, nosotros → **fuimos** (même conjugaison que ser).$md$),

    ('Hablar del futuro', $md$# Exercices — Hablar del futuro

Entraîne-toi à parler de l'avenir avec le futuro simple et « ir a + infinitivo ».

## Exercice 1 — Conjuguer au futuro simple
Mets le verbe au futur simple à la personne demandée.
1. Mañana (hablar, yo) ______ con el profesor.
2. La próxima semana (comer, nosotros) ______ en un restaurante.
3. (tener, tú) ______ tiempo el domingo.
4. El año que viene (hacer, ellos) ______ un viaje.

### Correction
1. **hablaré** — infinitif + -é.
2. **comeremos** — infinitif + -emos.
3. **tendrás** — irrégulier : radical tendr- + -ás.
4. **harán** — irrégulier : radical har- + -án.

## Exercice 2 — Transformer avec « ir a + infinitivo »
Réécris la phrase au futur proche (ir a + infinitif).
1. (yo / estudiar) esta tarde → ______
2. (nosotros / viajar) en verano → ______
3. (ella / salir) esta noche → ______

### Correction
1. **Voy a estudiar** esta tarde — voy + a + infinitif.
2. **Vamos a viajar** en verano — vamos + a + infinitif.
3. **Va a salir** esta noche — va + a + infinitif.$md$),

    ('El mundo hispánico', $md$# Exercices — El mundo hispánico

Teste tes connaissances sur la géographie et la culture du monde hispanique.

## Exercice 1 — Associer pays et capitale
Relie chaque pays à sa capitale.
1. España → ______
2. Argentina → ______
3. Perú → ______
4. Colombia → ______

### Correction
1. España → **Madrid**.
2. Argentina → **Buenos Aires**.
3. Perú → **Lima**.
4. Colombia → **Bogotá**.

## Exercice 2 — Compréhension : vrai ou faux ?
Lis chaque affirmation et réponds *verdadero* (vrai) ou *falso* (faux), puis corrige si c'est faux.
1. En Brasil se habla español.
2. Los Andes son una cordillera de América del Sur.
3. El flamenco es una danza típica de Japón.
4. El español lo hablan unos 500 millones de personas.

### Correction
1. **Falso** — au Brésil, on parle **portugais**, pas espagnol.
2. **Verdadero** — les Andes traversent l'Amérique du Sud.
3. **Falso** — le flamenco est une danse **espagnole** (Andalousie).
4. **Verdadero** — environ 500 millions de locuteurs.$md$),

    ('Preparar la expresión oral', $md$# Exercices — Preparar la expresión oral

Prépare-toi à l'oral : présentation, description d'image et opinion.

## Exercice 1 — Compléter une présentation
Complète avec le bon verbe (llamarse, tener, vivir).
1. Me ______ Marta.
2. ______ catorce años.
3. ______ en Sevilla.

### Correction
1. **llamo** — Me **llamo** Marta.
2. **Tengo** — l'âge se dit avec tener : **Tengo** catorce años.
3. **Vivo** — **Vivo** en Sevilla.

## Exercice 2 — Décrire une image et donner son avis
Complète la description avec les expressions proposées (en la foto veo, en primer plano, al fondo, creo que).
1. ______ una playa.
2. ______ hay dos niños jugando.
3. ______ se ve el mar.
4. ______ es una imagen muy alegre.

### Correction
1. **En la foto veo** una playa — pour introduire ce qu'on voit.
2. **En primer plano** hay dos niños jugando — au premier plan.
3. **Al fondo** se ve el mar — à l'arrière-plan.
4. **Creo que** es una imagen muy alegre — pour donner son avis.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'espagnol'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
