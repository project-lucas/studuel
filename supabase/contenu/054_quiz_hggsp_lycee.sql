-- =============================================================================
-- Studuel — Migration 054 : quiz de leçon, HGGSP lycée 1re·Tle
--   (8 quiz, 24 questions — un quiz par chapitre sur « L'essentiel du cours »)
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
--    d'HGGSP lycée (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'HGGSP', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 1re
  ('05400000-0000-4000-8000-000000000001'::uuid, '1re', 'La démocratie : fragilités et évolutions', 'La démocratie : fragilités et évolutions'),
  ('05400000-0000-4000-8000-000000000002'::uuid, '1re', 'Les frontières dans le monde',             'Les frontières dans le monde'),
  ('05400000-0000-4000-8000-000000000003'::uuid, '1re', 'Le pouvoir des médias',                    'Le pouvoir des médias'),
  ('05400000-0000-4000-8000-000000000004'::uuid, '1re', 'États et religions',                       'États et religions'),
  -- Tle
  ('05400000-0000-4000-8000-000000000005'::uuid, 'Tle', 'Environnement : exploiter, préserver', 'Environnement : exploiter, préserver'),
  ('05400000-0000-4000-8000-000000000006'::uuid, 'Tle', 'Guerres et paix',                       'Guerres et paix'),
  ('05400000-0000-4000-8000-000000000007'::uuid, 'Tle', 'L''enjeu de la connaissance',           'L''enjeu de la connaissance'),
  ('05400000-0000-4000-8000-000000000008'::uuid, 'Tle', 'Le patrimoine',                         'Le patrimoine')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'hggsp'
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
  -- Quiz 1 — La démocratie : fragilités et évolutions
  ('05410000-0000-4000-8000-000000000011'::uuid, '05400000-0000-4000-8000-000000000001'::uuid,
   'Dans quelle cité grecque naît, au Ve siècle av. J.-C., la démocratie directe ?', 'mcq',
   '["Sparte", "Athènes", "Rome", "Thèbes"]', 1,
   'À Athènes, les citoyens votent directement les lois à l''Ecclésia : c''est la démocratie directe.', 1),
  ('05410000-0000-4000-8000-000000000012'::uuid, '05400000-0000-4000-8000-000000000001'::uuid,
   'Alexis de Tocqueville analyse la démocratie dans « De la démocratie en Amérique » (1835-1840).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Tocqueville y étudie la démocratie américaine et alerte sur le risque de « tyrannie de la majorité ».', 2),
  ('05410000-0000-4000-8000-000000000013'::uuid, '05400000-0000-4000-8000-000000000001'::uuid,
   'Qu''appelle-t-on une démocratie représentative ?', 'mcq',
   '["Les citoyens votent eux-mêmes toutes les lois", "Un seul homme concentre le pouvoir", "Les citoyens élisent des représentants qui gouvernent en leur nom", "Le pouvoir se transmet de façon héréditaire"]', 2,
   'Dans une démocratie représentative, le peuple délègue le pouvoir à des élus par le vote.', 3),

  -- Quiz 2 — Les frontières dans le monde
  ('05410000-0000-4000-8000-000000000021'::uuid, '05400000-0000-4000-8000-000000000002'::uuid,
   'Une frontière tracée en ligne droite (méridiens, parallèles), sans suivre le relief, est dite :', 'mcq',
   '["naturelle", "artificielle (géométrique)", "maritime", "linguistique"]', 1,
   'Une frontière géométrique ignore la géographie physique ; une frontière naturelle suit un fleuve ou une montagne.', 1),
  ('05410000-0000-4000-8000-000000000022'::uuid, '05400000-0000-4000-8000-000000000002'::uuid,
   'Malgré la mondialisation, certaines frontières se renforcent, comme le mur entre les États-Unis et le Mexique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La mondialisation n''efface pas les frontières : murs et barrières se multiplient (« retour des frontières »).', 2),
  ('05410000-0000-4000-8000-000000000023'::uuid, '05400000-0000-4000-8000-000000000002'::uuid,
   'Que fixe la convention de Montego Bay (1982) ?', 'mcq',
   '["Les frontières de l''Union européenne", "La création de l''ONU", "Le droit de la mer et la zone économique exclusive (200 milles marins)", "Le tracé du mur de Berlin"]', 2,
   'Cette convention sur le droit de la mer définit notamment la ZEE, large de 200 milles marins depuis la côte.', 3),

  -- Quiz 3 — Le pouvoir des médias
  ('05410000-0000-4000-8000-000000000031'::uuid, '05400000-0000-4000-8000-000000000003'::uuid,
   'Qu''appelle-t-on le « soft power », notion popularisée par Joseph Nye ?', 'mcq',
   '["La puissance militaire d''un État", "La capacité d''influencer par la culture, les idées et l''attraction", "Le poids économique brut d''un pays", "Le nombre d''armes nucléaires détenues"]', 1,
   'Le soft power séduit et convainc (culture, valeurs, médias) plutôt que de contraindre par la force.', 1),
  ('05410000-0000-4000-8000-000000000032'::uuid, '05400000-0000-4000-8000-000000000003'::uuid,
   'En France, la liberté de la presse est garantie par la loi du 29 juillet 1881.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La loi de 1881 sur la liberté de la presse encadre encore aujourd''hui la publication en France.', 2),
  ('05410000-0000-4000-8000-000000000033'::uuid, '05400000-0000-4000-8000-000000000003'::uuid,
   'Révélée par la presse, l''affaire du Watergate provoque en 1974 la démission de quel président américain ?', 'mcq',
   '["John Kennedy", "Ronald Reagan", "Bill Clinton", "Richard Nixon"]', 3,
   'Le travail d''enquête du Washington Post contraint Richard Nixon à démissionner en août 1974.', 3),

  -- Quiz 4 — États et religions
  ('05410000-0000-4000-8000-000000000041'::uuid, '05400000-0000-4000-8000-000000000004'::uuid,
   'En France, quelle loi établit la séparation des Églises et de l''État ?', 'mcq',
   '["La loi de 1905", "La déclaration de 1789", "La Constitution de 1958", "La loi de 2004"]', 0,
   'La loi du 9 décembre 1905 sépare les Églises et l''État et fonde la laïcité française.', 1),
  ('05410000-0000-4000-8000-000000000042'::uuid, '05400000-0000-4000-8000-000000000004'::uuid,
   'La laïcité garantit la liberté de conscience et la neutralité de l''État en matière religieuse.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''État laïque ne privilégie aucune religion et protège la liberté de croire ou de ne pas croire.', 2),
  ('05410000-0000-4000-8000-000000000043'::uuid, '05400000-0000-4000-8000-000000000004'::uuid,
   'Qu''appelle-t-on un État « théocratique » ?', 'mcq',
   '["Un État dépourvu de toute religion", "Un État démocratique et laïque", "Un État où le pouvoir politique se fonde sur l''autorité religieuse", "Un État strictement fédéral"]', 2,
   'Dans une théocratie, le pouvoir politique s''appuie sur la religion et une autorité religieuse.', 3),

  -- Quiz 5 — Environnement : exploiter, préserver
  ('05410000-0000-4000-8000-000000000051'::uuid, '05400000-0000-4000-8000-000000000005'::uuid,
   'Que désigne le « développement durable » ?', 'mcq',
   '["Une croissance qui ignore l''écologie", "Un développement qui répond aux besoins présents sans compromettre ceux des générations futures", "L''arrêt de toute activité économique", "La seule protection de la nature sauvage"]', 1,
   'Cette définition (rapport Brundtland, 1987) concilie besoins économiques, sociaux et environnementaux.', 1),
  ('05410000-0000-4000-8000-000000000052'::uuid, '05400000-0000-4000-8000-000000000005'::uuid,
   'Que sont les « COP » en matière de climat ?', 'mcq',
   '["De grandes entreprises pétrolières", "Des lois françaises sur l''environnement", "Des zones naturelles protégées", "Des conférences internationales des Parties sur le climat"]', 3,
   'Les COP (Conférences des Parties) réunissent les États pour négocier la lutte contre le réchauffement.', 2),
  ('05410000-0000-4000-8000-000000000053'::uuid, '05400000-0000-4000-8000-000000000005'::uuid,
   'L''accord de Paris sur le climat a été adopté lors de la COP21, en 2015.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La COP21 de Paris (2015) fixe l''objectif de limiter le réchauffement bien en dessous de 2 °C.', 3),

  -- Quiz 6 — Guerres et paix
  ('05410000-0000-4000-8000-000000000061'::uuid, '05400000-0000-4000-8000-000000000006'::uuid,
   'Pour Carl von Clausewitz, qu''est-ce que la guerre ?', 'mcq',
   '["La continuation de la politique par d''autres moyens", "Un simple accident sans logique", "Une pratique toujours illégitime", "Une affaire uniquement économique"]', 0,
   'Dans « De la guerre », Clausewitz définit la guerre comme le prolongement de la politique par la force.', 1),
  ('05410000-0000-4000-8000-000000000062'::uuid, '05400000-0000-4000-8000-000000000006'::uuid,
   'L''ONU a été créée en 1945 pour maintenir la paix et la sécurité internationales.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La charte de l''ONU est signée à San Francisco en 1945, au sortir de la Seconde Guerre mondiale.', 2),
  ('05410000-0000-4000-8000-000000000063'::uuid, '05400000-0000-4000-8000-000000000006'::uuid,
   'Quel organe de l''ONU est chargé du maintien de la paix et peut voter des sanctions ?', 'mcq',
   '["L''Assemblée générale", "Le Conseil de sécurité", "La Cour internationale de justice", "Le Secrétariat général"]', 1,
   'Le Conseil de sécurité (5 membres permanents avec droit de veto) décide des sanctions et des interventions.', 3),

  -- Quiz 7 — L'enjeu de la connaissance
  ('05410000-0000-4000-8000-000000000071'::uuid, '05400000-0000-4000-8000-000000000007'::uuid,
   'Que protège la « propriété intellectuelle » ?', 'mcq',
   '["Les biens immobiliers", "Les ressources minières", "Les frontières d''un pays", "Les créations de l''esprit (œuvres, inventions, brevets)"]', 3,
   'La propriété intellectuelle protège les fruits de la création : œuvres artistiques, inventions, marques.', 1),
  ('05410000-0000-4000-8000-000000000072'::uuid, '05400000-0000-4000-8000-000000000007'::uuid,
   'Une fois déposé, un brevet protège une invention pour toujours, sans aucune limite de durée.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un brevet protège l''invention pour une durée limitée (souvent 20 ans), en échange de sa divulgation.', 2),
  ('05410000-0000-4000-8000-000000000073'::uuid, '05400000-0000-4000-8000-000000000007'::uuid,
   'Quelle institution des Nations unies agit pour l''éducation, la science et la culture ?', 'mcq',
   '["L''OMS", "L''OTAN", "L''UNESCO", "Le FMI"]', 2,
   'L''UNESCO promeut la coopération dans l''éducation, la science, la culture et la circulation du savoir.', 3),

  -- Quiz 8 — Le patrimoine
  ('05410000-0000-4000-8000-000000000081'::uuid, '05400000-0000-4000-8000-000000000008'::uuid,
   'Quelle organisation établit la liste du patrimoine mondial ?', 'mcq',
   '["L''ONU directement", "L''UNESCO", "L''Union européenne", "L''OMS"]', 1,
   'L''UNESCO inscrit les sites remarquables sur la liste du patrimoine mondial de l''humanité.', 1),
  ('05410000-0000-4000-8000-000000000082'::uuid, '05400000-0000-4000-8000-000000000008'::uuid,
   'La convention de l''UNESCO sur la protection du patrimoine mondial date de 1972.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Adoptée en 1972, cette convention crée la liste du patrimoine mondial (culturel et naturel).', 2),
  ('05410000-0000-4000-8000-000000000083'::uuid, '05400000-0000-4000-8000-000000000008'::uuid,
   'Que désigne le « patrimoine immatériel » ?', 'mcq',
   '["Les monuments et bâtiments historiques", "Les sites naturels remarquables", "Les traditions, savoir-faire, musiques et fêtes", "Les collections des musées"]', 2,
   'Le patrimoine immatériel regroupe les pratiques vivantes : langues, savoir-faire, rituels, musiques.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05400000-%' GROUP BY q.title;
-- =============================================================================
