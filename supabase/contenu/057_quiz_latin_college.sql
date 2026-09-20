-- =============================================================================
-- Studuel — Migration 057 : quiz de leçon, Latin collège 5e·4e·3e
--   (9 quiz, 27 questions — un quiz par chapitre sur « L'essentiel du cours »)
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
--    de Latin collège (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Latin', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 5e
  ('05700000-0000-4000-8000-000000000001'::uuid, '5e', 'Premiers pas : les déclinaisons', 'Premiers pas : les déclinaisons'),
  ('05700000-0000-4000-8000-000000000002'::uuid, '5e', 'La vie quotidienne à Rome',       'La vie quotidienne à Rome'),
  ('05700000-0000-4000-8000-000000000003'::uuid, '5e', 'La fondation de Rome',            'La fondation de Rome'),
  -- 4e
  ('05700000-0000-4000-8000-000000000004'::uuid, '4e', 'Les verbes : temps du récit', 'Les verbes : temps du récit'),
  ('05700000-0000-4000-8000-000000000005'::uuid, '4e', 'La société romaine',          'La société romaine'),
  ('05700000-0000-4000-8000-000000000006'::uuid, '4e', 'Mythes et héros',             'Mythes et héros'),
  -- 3e
  ('05700000-0000-4000-8000-000000000007'::uuid, '3e', 'Rhétorique et citoyenneté',        'Rhétorique et citoyenneté'),
  ('05700000-0000-4000-8000-000000000008'::uuid, '3e', 'L''Empire romain',                 'L''Empire romain'),
  ('05700000-0000-4000-8000-000000000009'::uuid, '3e', 'Traduire des textes authentiques', 'Traduire des textes authentiques')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'latin'
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
  -- Quiz 1 — Premiers pas : les déclinaisons
  ('05710000-0000-4000-8000-000000000011'::uuid, '05700000-0000-4000-8000-000000000001'::uuid,
   'Combien de déclinaisons compte la grammaire latine ?', 'mcq',
   '["Trois", "Quatre", "Cinq", "Six"]', 2,
   'Le latin classe les noms en cinq déclinaisons, selon leurs terminaisons.', 1),
  ('05710000-0000-4000-8000-000000000012'::uuid, '05700000-0000-4000-8000-000000000001'::uuid,
   'Quel est le nominatif pluriel de « rosa » (la rose, 1re déclinaison) ?', 'mcq',
   '["rosam", "rosae", "rosarum", "rosis"]', 1,
   'À la 1re déclinaison, le nominatif pluriel se forme en -ae : « rosae » (les roses).', 2),
  ('05710000-0000-4000-8000-000000000013'::uuid, '05700000-0000-4000-8000-000000000001'::uuid,
   'En latin, le cas nominatif sert à exprimer le sujet du verbe.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le nominatif marque le sujet ; l''accusatif marque, lui, le complément d''objet direct (COD).', 3),

  -- Quiz 2 — La vie quotidienne à Rome
  ('05710000-0000-4000-8000-000000000021'::uuid, '05700000-0000-4000-8000-000000000002'::uuid,
   'Où les Romains se rendaient-ils pour se baigner et se détendre ?', 'mcq',
   '["Au forum", "Aux thermes", "À la curie", "Au champ de Mars"]', 1,
   'Les thermes étaient les bains publics : on s''y lavait, mais on y discutait et s''y détendait aussi.', 1),
  ('05710000-0000-4000-8000-000000000022'::uuid, '05700000-0000-4000-8000-000000000002'::uuid,
   'Comment appelle-t-on la grande place publique, cœur de la vie de la cité romaine ?', 'mcq',
   '["Les thermes", "L''atrium", "La domus", "Le forum"]', 3,
   'Le forum était la place centrale : politique, commerce et religion s''y rejoignaient.', 2),
  ('05710000-0000-4000-8000-000000000023'::uuid, '05700000-0000-4000-8000-000000000002'::uuid,
   'À Rome, l''esclavage n''existait pas : tous les habitants étaient des citoyens libres.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la société romaine reposait en partie sur les esclaves (servi), privés de liberté et de droits.', 3),

  -- Quiz 3 — La fondation de Rome
  ('05710000-0000-4000-8000-000000000031'::uuid, '05700000-0000-4000-8000-000000000003'::uuid,
   'Selon la légende, quels jumeaux sont à l''origine de la fondation de Rome ?', 'mcq',
   '["Romulus et Rémus", "Castor et Pollux", "Énée et Ascagne", "Numa et Tullus"]', 0,
   'La légende attribue la fondation de Rome aux jumeaux Romulus et Rémus.', 1),
  ('05710000-0000-4000-8000-000000000032'::uuid, '05700000-0000-4000-8000-000000000003'::uuid,
   'D''après la légende, une louve (lupa) aurait allaité Romulus et Rémus abandonnés.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La louve nourricière est un symbole célèbre de Rome ; « lupa » signifie « louve » en latin.', 2),
  ('05710000-0000-4000-8000-000000000033'::uuid, '05700000-0000-4000-8000-000000000003'::uuid,
   'En quelle année, selon la tradition romaine, Rome fut-elle fondée ?', 'mcq',
   '["En 44 av. J.-C.", "En 476 apr. J.-C.", "En 753 av. J.-C.", "En 27 av. J.-C."]', 2,
   'La tradition fixe la fondation de Rome en 753 av. J.-C. ; les Romains comptaient les années « ab urbe condita ».', 3),

  -- Quiz 4 — Les verbes : temps du récit
  ('05710000-0000-4000-8000-000000000041'::uuid, '05700000-0000-4000-8000-000000000004'::uuid,
   'Quel temps latin exprime une action passée et achevée (« il fit », « il a fait ») ?', 'mcq',
   '["Le présent", "Le parfait", "Le futur", "L''impératif"]', 1,
   'Le parfait exprime une action passée et terminée ; c''est un temps clé du récit.', 1),
  ('05710000-0000-4000-8000-000000000042'::uuid, '05700000-0000-4000-8000-000000000004'::uuid,
   'Quel temps décrit une action passée qui dure ou qui se répète (« il faisait ») ?', 'mcq',
   '["Le parfait", "Le présent", "L''imparfait", "Le futur"]', 2,
   'L''imparfait peint l''arrière-plan du récit : une action en cours ou habituelle dans le passé.', 2),
  ('05710000-0000-4000-8000-000000000043'::uuid, '05700000-0000-4000-8000-000000000004'::uuid,
   'Au présent de l''indicatif, la 3e personne du singulier de « amare » (aimer) est « amat ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« amat » signifie « il/elle aime » : la terminaison -t marque la 3e personne du singulier.', 3),

  -- Quiz 5 — La société romaine
  ('05710000-0000-4000-8000-000000000051'::uuid, '05700000-0000-4000-8000-000000000005'::uuid,
   'Comment nomme-t-on les familles nobles et privilégiées de Rome ?', 'mcq',
   '["Les patriciens", "Les plébéiens", "Les esclaves", "Les affranchis"]', 0,
   'Les patriciens formaient l''aristocratie, détentrice du pouvoir et des grandes charges.', 1),
  ('05710000-0000-4000-8000-000000000052'::uuid, '05700000-0000-4000-8000-000000000005'::uuid,
   'Comment appelle-t-on le peuple, les citoyens ordinaires par opposition aux nobles ?', 'mcq',
   '["Les patriciens", "Les plébéiens", "Les sénateurs", "Les consuls"]', 1,
   'Les plébéiens constituaient le peuple ; ils luttèrent longtemps pour obtenir plus de droits.', 2),
  ('05710000-0000-4000-8000-000000000053'::uuid, '05700000-0000-4000-8000-000000000005'::uuid,
   'L''expression « res publica » désigne un empereur au pouvoir absolu.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : « res publica » signifie « la chose publique », c''est-à-dire la République, l''État des citoyens.', 3),

  -- Quiz 6 — Mythes et héros
  ('05710000-0000-4000-8000-000000000061'::uuid, '05700000-0000-4000-8000-000000000006'::uuid,
   'Quel héros troyen, ancêtre légendaire des Romains, fuit Troie en flammes chez Virgile ?', 'mcq',
   '["Hercule", "Ulysse", "Achille", "Énée"]', 3,
   'Énée, héros de l''Énéide, quitte Troie et gagne l''Italie : la légende en fait l''ancêtre des Romains.', 1),
  ('05710000-0000-4000-8000-000000000062'::uuid, '05700000-0000-4000-8000-000000000006'::uuid,
   'Dans la mythologie romaine, Jupiter (Iuppiter) est le roi des dieux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Jupiter, maître du ciel et de la foudre, correspond au Zeus grec : il règne sur les dieux.', 2),
  ('05710000-0000-4000-8000-000000000063'::uuid, '05700000-0000-4000-8000-000000000006'::uuid,
   'Comment se nomme la déesse romaine de l''amour, identifiée à l''Aphrodite grecque ?', 'mcq',
   '["Junon", "Minerve", "Vénus", "Diane"]', 2,
   'Vénus est la déesse de l''amour et de la beauté ; elle correspond à l''Aphrodite des Grecs.', 3),

  -- Quiz 7 — Rhétorique et citoyenneté
  ('05710000-0000-4000-8000-000000000071'::uuid, '05700000-0000-4000-8000-000000000007'::uuid,
   'Qu''est-ce que la rhétorique chez les Romains ?', 'mcq',
   '["L''art de la guerre", "L''art de bien parler et de convaincre", "L''art de bâtir", "L''art de compter"]', 1,
   'La rhétorique est l''art du discours : bien parler pour persuader, indispensable en politique et au tribunal.', 1),
  ('05710000-0000-4000-8000-000000000072'::uuid, '05700000-0000-4000-8000-000000000007'::uuid,
   'Quel célèbre orateur romain prononça les « Catilinaires » contre Catilina ?', 'mcq',
   '["Cicéron", "César", "Néron", "Virgile"]', 0,
   'Cicéron, grand orateur et homme politique, dénonça la conjuration de Catilina dans ses Catilinaires.', 2),
  ('05710000-0000-4000-8000-000000000073'::uuid, '05700000-0000-4000-8000-000000000007'::uuid,
   'À Rome, un « citoyen » (civis) possédait des droits que n''avaient ni les esclaves ni les étrangers.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La citoyenneté (civitas) donnait des droits (voter, être jugé, posséder) réservés aux citoyens.', 3),

  -- Quiz 8 — L'Empire romain
  ('05710000-0000-4000-8000-000000000081'::uuid, '05700000-0000-4000-8000-000000000008'::uuid,
   'Qui devient le premier empereur romain, en 27 av. J.-C. ?', 'mcq',
   '["Jules César", "Néron", "Auguste", "Constantin"]', 2,
   'Auguste (Octave) est considéré comme le premier empereur ; il inaugure le régime impérial.', 1),
  ('05710000-0000-4000-8000-000000000082'::uuid, '05700000-0000-4000-8000-000000000008'::uuid,
   'L''Empire romain a précédé la République : les empereurs ont régné avant les consuls.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : Rome fut d''abord une République (gouvernée par des consuls), puis devint un Empire avec Auguste.', 2),
  ('05710000-0000-4000-8000-000000000083'::uuid, '05700000-0000-4000-8000-000000000008'::uuid,
   'De quel mot latin, porté par le chef militaire victorieux puis par l''empereur, vient « empereur » ?', 'mcq',
   '["Consul", "Imperator", "Tribunus", "Praetor"]', 1,
   'Le titre « imperator » (chef victorieux) a donné notre mot « empereur ».', 3),

  -- Quiz 9 — Traduire des textes authentiques
  ('05710000-0000-4000-8000-000000000091'::uuid, '05700000-0000-4000-8000-000000000009'::uuid,
   'Dans la phrase « Puella rosam amat », quel mot est le COD (à l''accusatif) ?', 'mcq',
   '["Puella", "Rosam", "Amat", "Aucun mot"]', 1,
   '« rosam » est à l''accusatif (terminaison -am) : c''est le COD. La phrase signifie « La jeune fille aime la rose ».', 1),
  ('05710000-0000-4000-8000-000000000092'::uuid, '05700000-0000-4000-8000-000000000009'::uuid,
   'Dans « Puella rosam amat », que signifie « puella », le sujet au nominatif ?', 'mcq',
   '["La jeune fille", "La rose", "Aime", "Le jardin"]', 0,
   '« puella » (nominatif, sujet) signifie « la jeune fille » ; elle fait l''action du verbe « amat ».', 2),
  ('05710000-0000-4000-8000-000000000093'::uuid, '05700000-0000-4000-8000-000000000009'::uuid,
   'Le génitif « rosae » peut se traduire par « de la rose » (complément du nom).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le génitif marque l''appartenance ou le complément du nom : « rosae » = « de la rose ».', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05700000-%' GROUP BY q.title;
-- =============================================================================
