-- =============================================================================
-- Studuel — Migration 043 : quiz de leçon, Anglais lycée 2de·1re·Tle
--   (12 quiz, 36 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'anglais' → (niveau, titre chapitre) → « L'essentiel du
--   cours ». Chapitres = axes thématiques du programme ; questions en français
--   portant sur le lexique et les notions clés de chaque axe.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Anglais', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 2de
  ('04300000-0000-4000-8000-000000000021'::uuid, '2de', 'Vivre entre générations',          'Vivre entre générations'),
  ('04300000-0000-4000-8000-000000000022'::uuid, '2de', 'Les univers professionnels',        'Les univers professionnels'),
  ('04300000-0000-4000-8000-000000000023'::uuid, '2de', 'Représentation de soi et d''autrui','Représentation de soi et d''autrui'),
  ('04300000-0000-4000-8000-000000000024'::uuid, '2de', 'Le passé dans le présent',          'Le passé dans le présent'),
  -- 1re
  ('04300000-0000-4000-8000-000000000011'::uuid, '1re', 'Identités et échanges',           'Identités et échanges'),
  ('04300000-0000-4000-8000-000000000012'::uuid, '1re', 'Espace privé et espace public',   'Espace privé et espace public'),
  ('04300000-0000-4000-8000-000000000013'::uuid, '1re', 'Art et pouvoir',                  'Art et pouvoir'),
  ('04300000-0000-4000-8000-000000000014'::uuid, '1re', 'Citoyenneté et mondes virtuels',  'Citoyenneté et mondes virtuels'),
  -- Tle
  ('04300000-0000-4000-8000-000000000031'::uuid, 'Tle', 'Faire société : unité et pluralité', 'Faire société : unité et pluralité'),
  ('04300000-0000-4000-8000-000000000032'::uuid, 'Tle', 'Environnements en mutation',         'Environnements en mutation'),
  ('04300000-0000-4000-8000-000000000033'::uuid, 'Tle', 'Art et débats d''idées',             'Art et débats d''idées'),
  ('04300000-0000-4000-8000-000000000034'::uuid, 'Tle', 'Innovations et responsabilité',      'Innovations et responsabilité')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 2de =====
  -- 21 — Vivre entre générations
  ('04310000-0000-4000-8000-000000000211'::uuid, '04300000-0000-4000-8000-000000000021'::uuid,
   'Que signifie « grandparents » ?', 'mcq',
   '["les grands-parents", "les parents", "les cousins", "les voisins"]', 0,
   'grand + parents = les grands-parents.', 1),
  ('04310000-0000-4000-8000-000000000212'::uuid, '04300000-0000-4000-8000-000000000021'::uuid,
   'Le thème « vivre entre générations » évoque les relations entre…', 'mcq',
   '["les âges (jeunes, adultes, aînés)", "les pays", "les planètes", "les entreprises"]', 0,
   'Il porte sur les rapports entre générations.', 2),
  ('04310000-0000-4000-8000-000000000213'::uuid, '04300000-0000-4000-8000-000000000021'::uuid,
   '« Elderly people » désigne les personnes âgées.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elderly = âgé.', 3),

  -- 22 — Les univers professionnels
  ('04310000-0000-4000-8000-000000000221'::uuid, '04300000-0000-4000-8000-000000000022'::uuid,
   'Que signifie « a job interview » ?', 'mcq',
   '["un entretien d''embauche", "un jour férié", "une réunion de famille", "un salaire"]', 0,
   'Interview = entretien ; job = emploi.', 1),
  ('04310000-0000-4000-8000-000000000222'::uuid, '04300000-0000-4000-8000-000000000022'::uuid,
   'Comment dit-on « un métier / une profession » en anglais ?', 'mcq',
   '["a job / an occupation", "a holiday", "a hobby", "a meal"]', 0,
   'Job ou occupation.', 2),
  ('04310000-0000-4000-8000-000000000223'::uuid, '04300000-0000-4000-8000-000000000022'::uuid,
   '« Skills » signifie « compétences ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Skills = compétences, savoir-faire.', 3),

  -- 23 — Représentation de soi et d'autrui
  ('04310000-0000-4000-8000-000000000231'::uuid, '04300000-0000-4000-8000-000000000023'::uuid,
   'Que signifie « self-portrait » ?', 'mcq',
   '["un autoportrait", "un paysage", "une nature morte", "un roman"]', 0,
   'self = soi-même ; portrait de soi.', 1),
  ('04310000-0000-4000-8000-000000000232'::uuid, '04300000-0000-4000-8000-000000000023'::uuid,
   'Que signifie « to describe someone » ?', 'mcq',
   '["décrire quelqu''un", "oublier quelqu''un", "appeler quelqu''un", "suivre quelqu''un"]', 0,
   'describe = décrire.', 2),
  ('04310000-0000-4000-8000-000000000233'::uuid, '04300000-0000-4000-8000-000000000023'::uuid,
   '« Identity » signifie « identité ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Identity = identité.', 3),

  -- 24 — Le passé dans le présent
  ('04310000-0000-4000-8000-000000000241'::uuid, '04300000-0000-4000-8000-000000000024'::uuid,
   'Que signifie « heritage » ?', 'mcq',
   '["l''héritage / le patrimoine", "l''avenir", "un magasin", "un voyage"]', 0,
   'Heritage = patrimoine, héritage culturel.', 1),
  ('04310000-0000-4000-8000-000000000242'::uuid, '04300000-0000-4000-8000-000000000024'::uuid,
   'Quel temps anglais relie une action passée au présent ?', 'mcq',
   '["le present perfect", "le futur", "l''impératif", "le conditionnel"]', 0,
   'Le present perfect : have/has + participe passé.', 2),
  ('04310000-0000-4000-8000-000000000243'::uuid, '04300000-0000-4000-8000-000000000024'::uuid,
   '« A memory » peut signifier « un souvenir ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Memory = souvenir ou mémoire.', 3),

  -- ===== 1re =====
  -- 11 — Identités et échanges
  ('04310000-0000-4000-8000-000000000111'::uuid, '04300000-0000-4000-8000-000000000011'::uuid,
   'Que signifie « to exchange » ?', 'mcq',
   '["échanger", "oublier", "détruire", "dormir"]', 0,
   'exchange = échanger.', 1),
  ('04310000-0000-4000-8000-000000000112'::uuid, '04300000-0000-4000-8000-000000000011'::uuid,
   'Que signifie « cultural diversity » ?', 'mcq',
   '["la diversité culturelle", "un désert", "une équation", "une frontière fermée"]', 0,
   'Diversité culturelle.', 2),
  ('04310000-0000-4000-8000-000000000113'::uuid, '04300000-0000-4000-8000-000000000011'::uuid,
   '« A border » désigne une frontière.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Border = frontière.', 3),

  -- 12 — Espace privé et espace public
  ('04310000-0000-4000-8000-000000000121'::uuid, '04300000-0000-4000-8000-000000000012'::uuid,
   'Que signifie « privacy » ?', 'mcq',
   '["la vie privée / l''intimité", "la publicité", "un espace public", "une place de marché"]', 0,
   'Privacy = vie privée.', 1),
  ('04310000-0000-4000-8000-000000000122'::uuid, '04300000-0000-4000-8000-000000000012'::uuid,
   'Que signifie « public space » ?', 'mcq',
   '["un espace public", "une chambre privée", "un jardin secret", "un coffre-fort"]', 0,
   'Espace public.', 2),
  ('04310000-0000-4000-8000-000000000123'::uuid, '04300000-0000-4000-8000-000000000012'::uuid,
   '« Freedom » signifie « liberté ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Freedom = liberté.', 3),

  -- 13 — Art et pouvoir
  ('04310000-0000-4000-8000-000000000131'::uuid, '04300000-0000-4000-8000-000000000013'::uuid,
   'Que signifie « power » ?', 'mcq',
   '["le pouvoir", "la peinture", "la musique", "la paix"]', 0,
   'Power = pouvoir.', 1),
  ('04310000-0000-4000-8000-000000000132'::uuid, '04300000-0000-4000-8000-000000000013'::uuid,
   'Une œuvre d''art qui prend position face au pouvoir est souvent…', 'mcq',
   '["engagée (ou de propagande)", "un simple objet sans sens", "une équation", "une recette"]', 0,
   'L''art peut servir le pouvoir ou, au contraire, le dénoncer.', 2),
  ('04310000-0000-4000-8000-000000000133'::uuid, '04300000-0000-4000-8000-000000000013'::uuid,
   '« Freedom of speech » signifie « la liberté d''expression ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Liberté d''expression.', 3),

  -- 14 — Citoyenneté et mondes virtuels
  ('04310000-0000-4000-8000-000000000141'::uuid, '04300000-0000-4000-8000-000000000014'::uuid,
   'Que signifie « social media » ?', 'mcq',
   '["les réseaux sociaux", "la presse papier", "la radio", "le cinéma muet"]', 0,
   'Social media = réseaux sociaux.', 1),
  ('04310000-0000-4000-8000-000000000142'::uuid, '04300000-0000-4000-8000-000000000014'::uuid,
   'Que signifie « a citizen » ?', 'mcq',
   '["un citoyen", "une ville", "une loi", "un vote"]', 0,
   'Citizen = citoyen.', 2),
  ('04310000-0000-4000-8000-000000000143'::uuid, '04300000-0000-4000-8000-000000000014'::uuid,
   '« Fake news » désigne de fausses informations.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Fake = faux ; news = informations.', 3),

  -- ===== Tle =====
  -- 31 — Faire société : unité et pluralité
  ('04310000-0000-4000-8000-000000000311'::uuid, '04300000-0000-4000-8000-000000000031'::uuid,
   'Que signifie « society » ?', 'mcq',
   '["la société", "un secret", "un magasin", "une saison"]', 0,
   'Society = société.', 1),
  ('04310000-0000-4000-8000-000000000312'::uuid, '04300000-0000-4000-8000-000000000031'::uuid,
   'Que signifie « diversity » ?', 'mcq',
   '["la diversité", "la difficulté", "le désert", "la distance"]', 0,
   'Diversity = diversité.', 2),
  ('04310000-0000-4000-8000-000000000313'::uuid, '04300000-0000-4000-8000-000000000031'::uuid,
   '« Community » peut se traduire par « communauté ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Community = communauté.', 3),

  -- 32 — Environnements en mutation
  ('04310000-0000-4000-8000-000000000321'::uuid, '04300000-0000-4000-8000-000000000032'::uuid,
   'Que signifie « climate change » ?', 'mcq',
   '["le changement climatique", "un bulletin météo local", "une saison", "un climat stable"]', 0,
   'Climate change = changement climatique.', 1),
  ('04310000-0000-4000-8000-000000000322'::uuid, '04300000-0000-4000-8000-000000000032'::uuid,
   'Que signifie « sustainable development » ?', 'mcq',
   '["le développement durable", "un développement polluant", "un désert", "une usine"]', 0,
   'Sustainable development = développement durable.', 2),
  ('04310000-0000-4000-8000-000000000323'::uuid, '04300000-0000-4000-8000-000000000032'::uuid,
   '« Pollution » se traduit par « pollution ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le mot est quasi identique en français et en anglais.', 3),

  -- 33 — Art et débats d'idées
  ('04310000-0000-4000-8000-000000000331'::uuid, '04300000-0000-4000-8000-000000000033'::uuid,
   'Que signifie « to debate » ?', 'mcq',
   '["débattre", "peindre", "danser", "dormir"]', 0,
   'Debate = débattre.', 1),
  ('04310000-0000-4000-8000-000000000332'::uuid, '04300000-0000-4000-8000-000000000033'::uuid,
   'Que signifie « an opinion » ?', 'mcq',
   '["une opinion", "une image", "une chanson", "un bâtiment"]', 0,
   'Opinion = opinion, avis.', 2),
  ('04310000-0000-4000-8000-000000000333'::uuid, '04300000-0000-4000-8000-000000000033'::uuid,
   '« An idea » signifie « une idée ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Idea = idée.', 3),

  -- 34 — Innovations et responsabilité
  ('04310000-0000-4000-8000-000000000341'::uuid, '04300000-0000-4000-8000-000000000034'::uuid,
   'Que signifie « innovation » ?', 'mcq',
   '["l''innovation", "l''imitation", "l''oubli", "le repos"]', 0,
   'Innovation = innovation, nouveauté.', 1),
  ('04310000-0000-4000-8000-000000000342'::uuid, '04300000-0000-4000-8000-000000000034'::uuid,
   'Que signifie « responsibility » ?', 'mcq',
   '["la responsabilité", "la publicité", "la rapidité", "la répétition"]', 0,
   'Responsibility = responsabilité.', 2),
  ('04310000-0000-4000-8000-000000000343'::uuid, '04300000-0000-4000-8000-000000000034'::uuid,
   '« Research » peut signifier « la recherche ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Research = recherche.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '04300000-%' GROUP BY 1,2 ORDER BY 1,2;
