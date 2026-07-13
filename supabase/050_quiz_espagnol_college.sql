-- =============================================================================
-- Studuel — Migration 050 : quiz de leçon, Espagnol collège 5e·4e·3e
--   (12 quiz, 36 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés (tables quizzes,
--             quiz_questions, subjects/chapters/lessons + colonne quizzes.lesson_id).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon
--   (n'insère un quiz que si la leçon n'en a pas déjà un — le hub de leçon lit
--    le quiz en .maybeSingle(), donc une leçon ne doit porter qu'UN quiz).
-- Rattachement par clés stables : slug matière → (niveau, titre chapitre) →
--   titre leçon « L'essentiel du cours ». Aucune donnée existante n'est modifiée.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. QUIZZES — un quiz rattaché à « L'essentiel du cours » de chaque chapitre
--    d'Espagnol collège (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Espagnol', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 5e
  ('05000000-0000-4000-8000-000000000001'::uuid, '5e', 'Saludos : se présenter',    'Saludos : se présenter'),
  ('05000000-0000-4000-8000-000000000002'::uuid, '5e', 'Los artículos y el género', 'Los artículos y el género'),
  ('05000000-0000-4000-8000-000000000003'::uuid, '5e', 'La familia y la casa',      'La familia y la casa'),
  ('05000000-0000-4000-8000-000000000004'::uuid, '5e', 'El presente de indicativo', 'El presente de indicativo'),
  -- 4e
  ('05000000-0000-4000-8000-000000000005'::uuid, '4e', 'El pretérito perfecto',        'El pretérito perfecto'),
  ('05000000-0000-4000-8000-000000000006'::uuid, '4e', 'La ciudad y las direcciones',  'La ciudad y las direcciones'),
  ('05000000-0000-4000-8000-000000000007'::uuid, '4e', 'Gustos y opiniones',           'Gustos y opiniones'),
  ('05000000-0000-4000-8000-000000000008'::uuid, '4e', 'La vida cotidiana',            'La vida cotidiana'),
  -- 3e
  ('05000000-0000-4000-8000-000000000009'::uuid, '3e', 'El pretérito indefinido',      'El pretérito indefinido'),
  ('05000000-0000-4000-8000-000000000010'::uuid, '3e', 'Hablar del futuro',            'Hablar del futuro'),
  ('05000000-0000-4000-8000-000000000011'::uuid, '3e', 'El mundo hispánico',           'El mundo hispánico'),
  ('05000000-0000-4000-8000-000000000012'::uuid, '3e', 'Preparar la expresión oral',   'Preparar la expresión oral')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'espagnol'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (
  SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. QUIZ_QUESTIONS — 3 questions par quiz (créées seulement si le quiz existe).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Quiz 1 — Saludos : se présenter
  ('05010000-0000-4000-8000-000000000011'::uuid, '05000000-0000-4000-8000-000000000001'::uuid,
   'Quand emploie-t-on surtout la salutation « Buenos días » ?', 'mcq',
   '["Pour dire au revoir", "Le soir uniquement", "Le matin ou dans la journée", "Pour remercier"]', 2,
   '« Buenos días » se dit le matin et la journée ; le soir on utilise « Buenas tardes » ou « Buenas noches ».', 1),
  ('05010000-0000-4000-8000-000000000012'::uuid, '05000000-0000-4000-8000-000000000001'::uuid,
   'Pour se présenter, on complète : « Me ___ Lucía. »', 'mcq',
   '["llamo", "tengo", "gusta", "soy"]', 0,
   '« Me llamo Lucía » signifie « Je m''appelle Lucía » (verbe « llamarse »).', 2),
  ('05010000-0000-4000-8000-000000000013'::uuid, '05000000-0000-4000-8000-000000000001'::uuid,
   'En espagnol, « Adiós » veut dire « au revoir ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« Adiós » sert à prendre congé ; « Hola » sert au contraire à saluer quelqu''un.', 3),

  -- Quiz 2 — Los artículos y el género
  ('05010000-0000-4000-8000-000000000021'::uuid, '05000000-0000-4000-8000-000000000002'::uuid,
   'Quel est l''article défini masculin singulier en espagnol ?', 'mcq',
   '["la", "el", "las", "un"]', 1,
   '« el » est l''article défini masculin singulier ; « la » est son équivalent féminin.', 1),
  ('05010000-0000-4000-8000-000000000022'::uuid, '05000000-0000-4000-8000-000000000002'::uuid,
   'On dit « ___ casa » pour « la maison ».', 'mcq',
   '["el", "los", "la", "un"]', 2,
   '« casa » est un nom féminin : on emploie l''article « la » → « la casa ».', 2),
  ('05010000-0000-4000-8000-000000000023'::uuid, '05000000-0000-4000-8000-000000000002'::uuid,
   'Le mot « el problema » est masculin, bien qu''il se termine par -a.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Certains noms en -a d''origine grecque sont masculins : « el problema », « el día ».', 3),

  -- Quiz 3 — La familia y la casa
  ('05010000-0000-4000-8000-000000000031'::uuid, '05000000-0000-4000-8000-000000000003'::uuid,
   'Comment dit-on « le frère » en espagnol ?', 'mcq',
   '["la hermana", "el padre", "la madre", "el hermano"]', 3,
   '« el hermano » = le frère ; « la hermana » = la sœur.', 1),
  ('05010000-0000-4000-8000-000000000032'::uuid, '05000000-0000-4000-8000-000000000003'::uuid,
   'Quelle pièce de la maison désigne le mot « la cocina » ?', 'mcq',
   '["La chambre", "Le salon", "La cuisine", "La salle de bain"]', 2,
   '« la cocina » est la cuisine ; la chambre se dit « el dormitorio ».', 2),
  ('05010000-0000-4000-8000-000000000033'::uuid, '05000000-0000-4000-8000-000000000003'::uuid,
   'Le mot « la madre » signifie « le père ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   '« la madre » veut dire « la mère » ; « le père » se dit « el padre ».', 3),

  -- Quiz 4 — El presente de indicativo
  ('05010000-0000-4000-8000-000000000041'::uuid, '05000000-0000-4000-8000-000000000004'::uuid,
   'Comment conjugue-t-on « hablar » (parler) à « yo » au présent ?', 'mcq',
   '["hablo", "hablas", "habla", "hablamos"]', 0,
   'Pour « yo », la terminaison des verbes en -ar est -o : « yo hablo ».', 1),
  ('05010000-0000-4000-8000-000000000042'::uuid, '05000000-0000-4000-8000-000000000004'::uuid,
   'Comment dit-on « nous mangeons » avec le verbe « comer » ?', 'mcq',
   '["como", "comes", "come", "comemos"]', 3,
   'À « nosotros », les verbes en -er prennent -emos : « nosotros comemos ».', 2),
  ('05010000-0000-4000-8000-000000000043'::uuid, '05000000-0000-4000-8000-000000000004'::uuid,
   'Le verbe « ser » (être) est irrégulier au présent de l''indicatif.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« ser » est irrégulier : soy, eres, es, somos, sois, son.', 3),

  -- Quiz 5 — El pretérito perfecto
  ('05010000-0000-4000-8000-000000000051'::uuid, '05000000-0000-4000-8000-000000000005'::uuid,
   'Comment se forme le « pretérito perfecto » (passé composé espagnol) ?', 'mcq',
   '["ser au présent + gérondif", "haber au présent + participe passé", "tener + infinitif", "ir + a + infinitif"]', 1,
   'Le pretérito perfecto = auxiliaire « haber » au présent + participe passé : « he hablado ».', 1),
  ('05010000-0000-4000-8000-000000000052'::uuid, '05000000-0000-4000-8000-000000000005'::uuid,
   'Quel est le participe passé du verbe « hablar » ?', 'mcq',
   '["hablando", "habló", "hablado", "hablar"]', 2,
   'Les verbes en -ar font leur participe passé en -ado : « hablado ».', 2),
  ('05010000-0000-4000-8000-000000000053'::uuid, '05000000-0000-4000-8000-000000000005'::uuid,
   'La phrase « He comido » signifie « j''ai mangé ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« He comido » = « haber » (he) + participe « comido » → « j''ai mangé ».', 3),

  -- Quiz 6 — La ciudad y las direcciones
  ('05010000-0000-4000-8000-000000000061'::uuid, '05000000-0000-4000-8000-000000000006'::uuid,
   'Pour demander où se trouve la gare : « ¿Dónde ___ la estación? »', 'mcq',
   '["es", "está", "tiene", "va"]', 1,
   'On situe un lieu avec « estar » : « ¿Dónde está la estación? ».', 1),
  ('05010000-0000-4000-8000-000000000062'::uuid, '05000000-0000-4000-8000-000000000006'::uuid,
   'Que signifie l''indication « Gira a la derecha » ?', 'mcq',
   '["Va tout droit", "Tourne à gauche", "Arrête-toi", "Tourne à droite"]', 3,
   '« Gira a la derecha » veut dire « tourne à droite » ; « a la izquierda » = à gauche.', 2),
  ('05010000-0000-4000-8000-000000000063'::uuid, '05000000-0000-4000-8000-000000000006'::uuid,
   'Le mot « la izquierda » signifie « la droite ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   '« la izquierda » veut dire « la gauche » ; « la droite » se dit « la derecha ».', 3),

  -- Quiz 7 — Gustos y opiniones
  ('05010000-0000-4000-8000-000000000071'::uuid, '05000000-0000-4000-8000-000000000007'::uuid,
   'Que signifie la phrase « Me gusta el fútbol » ?', 'mcq',
   '["J''aime le football", "Je déteste le football", "Je joue au football", "Je regarde le football"]', 0,
   '« Me gusta » = « j''aime » ; littéralement « le football me plaît ».', 1),
  ('05010000-0000-4000-8000-000000000072'::uuid, '05000000-0000-4000-8000-000000000007'::uuid,
   'Pour dire qu''on aime plusieurs choses : « Me ___ los libros. »', 'mcq',
   '["gusta", "gusto", "gustan", "gustas"]', 2,
   'Quand ce qui plaît est au pluriel, le verbe s''accorde : « Me gustan los libros ».', 2),
  ('05010000-0000-4000-8000-000000000073'::uuid, '05000000-0000-4000-8000-000000000007'::uuid,
   'L''expression « No me gusta nada » veut dire qu''on aime beaucoup.', 'true_false',
   '["Vrai", "Faux"]', 1,
   '« No me gusta nada » signifie « je n''aime pas du tout » : c''est le contraire.', 3),

  -- Quiz 8 — La vida cotidiana
  ('05010000-0000-4000-8000-000000000081'::uuid, '05000000-0000-4000-8000-000000000008'::uuid,
   'Que signifie « Me levanto a las siete » ?', 'mcq',
   '["Je me couche à sept heures", "Je me lève à sept heures", "Je mange à sept heures", "Je pars à sept heures"]', 1,
   '« levantarse » = se lever ; « Me levanto a las siete » = « je me lève à sept heures ».', 1),
  ('05010000-0000-4000-8000-000000000082'::uuid, '05000000-0000-4000-8000-000000000008'::uuid,
   'Comment appelle-t-on les verbes comme « levantarse » ou « ducharse » ?', 'mcq',
   '["Des verbes irréguliers", "Des verbes au futur", "Des verbes pronominaux (réfléchis)", "Des verbes impersonnels"]', 2,
   'Ces verbes se conjuguent avec un pronom réfléchi (me, te, se…) : ce sont des pronominaux.', 2),
  ('05010000-0000-4000-8000-000000000083'::uuid, '05000000-0000-4000-8000-000000000008'::uuid,
   'Le verbe « desayunar » signifie « prendre le petit-déjeuner ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« desayunar » = prendre le petit-déjeuner ; « el desayuno » est le petit-déjeuner.', 3),

  -- Quiz 9 — El pretérito indefinido
  ('05010000-0000-4000-8000-000000000091'::uuid, '05000000-0000-4000-8000-000000000009'::uuid,
   'À quoi sert le « pretérito indefinido » ?', 'mcq',
   '["À décrire une habitude au présent", "À raconter une action passée, terminée et datée", "À parler du futur", "À décrire une action en cours"]', 1,
   'L''indefinido raconte un fait passé et achevé, souvent daté : « Ayer comí paella ».', 1),
  ('05010000-0000-4000-8000-000000000092'::uuid, '05000000-0000-4000-8000-000000000009'::uuid,
   'Complète au pretérito indefinido : « Ayer (yo) ___ paella. » (comer)', 'mcq',
   '["comí", "como", "comía", "comeré"]', 0,
   'À « yo », les verbes en -er/-ir font -í à l''indefinido : « comí ».', 2),
  ('05010000-0000-4000-8000-000000000093'::uuid, '05000000-0000-4000-8000-000000000009'::uuid,
   'La forme « fui » peut correspondre aussi bien à « ser » qu''à « ir » à l''indefinido.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« ser » et « ir » ont la même conjugaison à l''indefinido : fui, fuiste, fue…', 3),

  -- Quiz 10 — Hablar del futuro
  ('05010000-0000-4000-8000-000000000101'::uuid, '05000000-0000-4000-8000-000000000010'::uuid,
   'Quelle est la forme de « hablar » au futur simple à « yo » ?', 'mcq',
   '["hablaba", "hablo", "hablé", "hablaré"]', 3,
   'Le futur simple ajoute -é à l''infinitif pour « yo » : « hablaré » (je parlerai).', 1),
  ('05010000-0000-4000-8000-000000000102'::uuid, '05000000-0000-4000-8000-000000000010'::uuid,
   'Que exprime la tournure « ir a + infinitif » (ex. « voy a comer ») ?', 'mcq',
   '["Le passé", "Un futur proche", "Une habitude", "Une obligation"]', 1,
   '« ir a + infinitif » exprime un futur proche : « voy a comer » = « je vais manger ».', 2),
  ('05010000-0000-4000-8000-000000000103'::uuid, '05000000-0000-4000-8000-000000000010'::uuid,
   'Au futur simple, la forme « nosotros » (ex. « hablaremos ») ne porte pas d''accent écrit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Toutes les personnes du futur portent un accent, sauf « nosotros » : « hablaremos ».', 3),

  -- Quiz 11 — El mundo hispánico
  ('05010000-0000-4000-8000-000000000111'::uuid, '05000000-0000-4000-8000-000000000011'::uuid,
   'Quelle est la capitale de l''Espagne ?', 'mcq',
   '["Barcelone", "Séville", "Madrid", "Valence"]', 2,
   'Madrid est la capitale de l''Espagne ; Barcelone est la grande ville de Catalogne.', 1),
  ('05010000-0000-4000-8000-000000000112'::uuid, '05000000-0000-4000-8000-000000000011'::uuid,
   'Environ combien de pays ont l''espagnol comme langue officielle ?', 'mcq',
   '["Deux", "Cinq", "Dix", "Une vingtaine"]', 3,
   'L''espagnol est langue officielle dans une vingtaine de pays, surtout en Amérique latine.', 2),
  ('05010000-0000-4000-8000-000000000113'::uuid, '05000000-0000-4000-8000-000000000011'::uuid,
   'Au Mexique, on parle espagnol.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le Mexique est le pays hispanophone le plus peuplé du monde.', 3),

  -- Quiz 12 — Preparar la expresión oral
  ('05010000-0000-4000-8000-000000000121'::uuid, '05000000-0000-4000-8000-000000000012'::uuid,
   'Quelle expression permet de donner son opinion à l''oral ?', 'mcq',
   '["« Hasta luego »", "« En mi opinión… »", "« Buenos días »", "« Lo siento »"]', 1,
   '« En mi opinión… » (« à mon avis… ») introduit un point de vue à l''oral.', 1),
  ('05010000-0000-4000-8000-000000000122'::uuid, '05000000-0000-4000-8000-000000000012'::uuid,
   'Quel petit mot relie deux idées en marquant une opposition (« mais ») ?', 'mcq',
   '["« pero »", "« y »", "« también »", "« porque »"]', 0,
   '« pero » = « mais » ; « y » = « et », « también » = « aussi », « porque » = « parce que ».', 2),
  ('05010000-0000-4000-8000-000000000123'::uuid, '05000000-0000-4000-8000-000000000012'::uuid,
   'Bien articuler et parler à un rythme posé aide à se faire comprendre à l''oral.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une bonne prononciation et un débit calme rendent l''expression orale plus claire.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05000000-%' GROUP BY q.title;
-- =============================================================================
