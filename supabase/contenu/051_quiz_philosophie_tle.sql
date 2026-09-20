-- =============================================================================
-- Studuel — Migration 051 : quiz de leçon, Philosophie Tle
--   (5 quiz, 15 questions — un quiz par chapitre sur « L'essentiel du cours »)
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
--    de Philosophie Tle (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Philosophie', v.level, v.chapter, true, l.id
FROM (VALUES
  -- Tle
  ('05100000-0000-4000-8000-000000000001'::uuid, 'Tle', 'La conscience et l''inconscient', 'La conscience et l''inconscient'),
  ('05100000-0000-4000-8000-000000000002'::uuid, 'Tle', 'La liberté',                      'La liberté'),
  ('05100000-0000-4000-8000-000000000003'::uuid, 'Tle', 'Le bonheur',                       'Le bonheur'),
  ('05100000-0000-4000-8000-000000000004'::uuid, 'Tle', 'La justice et le droit',           'La justice et le droit'),
  ('05100000-0000-4000-8000-000000000005'::uuid, 'Tle', 'La vérité et la raison',           'La vérité et la raison')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'philosophie'
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
  -- Quiz 1 — La conscience et l'inconscient
  ('05110000-0000-4000-8000-000000000011'::uuid, '05100000-0000-4000-8000-000000000001'::uuid,
   'À quel philosophe attribue-t-on le « cogito » (« Je pense, donc je suis ») fondant la certitude sur la conscience de soi ?', 'mcq',
   '["Freud", "Platon", "Descartes", "Épicure"]', 2,
   'Descartes établit, dans les Méditations, que la pensée consciente de soi est la première certitude indubitable.', 1),
  ('05110000-0000-4000-8000-000000000012'::uuid, '05100000-0000-4000-8000-000000000001'::uuid,
   'Pour Freud, l''hypothèse de l''inconscient signifie que le psychisme ne se réduit pas à la conscience.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Freud pose l''inconscient comme un ensemble de désirs refoulés qui échappent à la conscience mais agissent sur nous.', 2),
  ('05110000-0000-4000-8000-000000000013'::uuid, '05100000-0000-4000-8000-000000000001'::uuid,
   'Comment nomme-t-on la conscience par laquelle le sujet se prend lui-même pour objet et se juge ?', 'mcq',
   '["La conscience réflexive", "La conscience immédiate", "L''inconscient collectif", "La perception sensible"]', 0,
   'La conscience réflexive est un retour du sujet sur lui-même ; la conscience immédiate n''est que présence spontanée au monde.', 3),

  -- Quiz 2 — La liberté
  ('05110000-0000-4000-8000-000000000021'::uuid, '05100000-0000-4000-8000-000000000002'::uuid,
   'Quelle thèse s''oppose le plus directement à la liberté humaine en affirmant que tout événement a une cause qui le détermine ?', 'mcq',
   '["L''existentialisme", "Le déterminisme", "Le libre arbitre", "Le stoïcisme"]', 1,
   'Le déterminisme soutient que tout est enchaîné par des causes ; il questionne la réalité d''un libre choix.', 1),
  ('05110000-0000-4000-8000-000000000022'::uuid, '05100000-0000-4000-8000-000000000002'::uuid,
   'Selon Sartre, l''homme est « condamné à être libre » et responsable de ce qu''il fait de lui-même.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Pour Sartre, l''existence précède l''essence : rien ne définit l''homme d''avance, il se choisit et en répond.', 2),
  ('05110000-0000-4000-8000-000000000023'::uuid, '05100000-0000-4000-8000-000000000002'::uuid,
   'Que désigne le « libre arbitre » ?', 'mcq',
   '["L''absence totale de lois dans la société", "Le pouvoir de la volonté de choisir par elle-même entre plusieurs possibles", "L''obéissance aux passions", "La soumission au destin"]', 1,
   'Le libre arbitre est la capacité de la volonté à se déterminer elle-même, sans y être contrainte.', 3),

  -- Quiz 3 — Le bonheur
  ('05110000-0000-4000-8000-000000000031'::uuid, '05100000-0000-4000-8000-000000000003'::uuid,
   'Quelle doctrine fait du plaisir le principe et la fin de la vie heureuse, comme chez Épicure ?', 'mcq',
   '["Le stoïcisme", "Le rationalisme", "L''hédonisme", "Le scepticisme"]', 2,
   'L''hédonisme place le plaisir au fondement du bonheur ; Épicure vise surtout l''absence de troubles (ataraxie).', 1),
  ('05110000-0000-4000-8000-000000000032'::uuid, '05100000-0000-4000-8000-000000000003'::uuid,
   'Pour Aristote, le bonheur (eudaimonia) est la fin ultime que l''on recherche pour elle-même et non en vue d''autre chose.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Dans l''Éthique à Nicomaque, le bonheur est le souverain bien : on le veut pour lui-même, jamais comme moyen.', 2),
  ('05110000-0000-4000-8000-000000000033'::uuid, '05100000-0000-4000-8000-000000000003'::uuid,
   'Chez Épicure, à quoi correspond l''« ataraxie » recherchée par le sage ?', 'mcq',
   '["L''accumulation illimitée de plaisirs", "La tranquillité de l''âme, l''absence de trouble", "La richesse matérielle", "La gloire et les honneurs"]', 1,
   'L''ataraxie est l''état de paix intérieure obtenu en supprimant les désirs vains et les craintes inutiles.', 3),

  -- Quiz 4 — La justice et le droit
  ('05110000-0000-4000-8000-000000000041'::uuid, '05100000-0000-4000-8000-000000000004'::uuid,
   'Comment nomme-t-on la justice qui répartit biens, honneurs et charges selon le mérite de chacun ?', 'mcq',
   '["La justice commutative", "La justice distributive", "La justice pénale", "La force"]', 1,
   'La justice distributive (Aristote) partage selon le mérite ; la justice commutative règle les échanges à égalité.', 1),
  ('05110000-0000-4000-8000-000000000042'::uuid, '05100000-0000-4000-8000-000000000004'::uuid,
   'Il faut distinguer le droit positif (les lois écrites en vigueur) du droit naturel (principes universels indépendants des lois).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le droit positif est ce qui est institué par une société donnée ; le droit naturel prétend valoir pour tous, partout.', 2),
  ('05110000-0000-4000-8000-000000000043'::uuid, '05100000-0000-4000-8000-000000000004'::uuid,
   'Selon Rousseau (Du contrat social), sur quoi repose la légitimité de l''autorité politique ?', 'mcq',
   '["La force du plus fort", "Un contrat social exprimant la volonté générale", "Le droit divin des rois", "Le hasard de la naissance"]', 1,
   'Pour Rousseau, seule la volonté générale, issue du pacte social, peut fonder un pouvoir légitime — non la force.', 3),

  -- Quiz 5 — La vérité et la raison
  ('05110000-0000-4000-8000-000000000051'::uuid, '05100000-0000-4000-8000-000000000005'::uuid,
   'Selon la conception classique de la vérité comme correspondance, une proposition est vraie quand...', 'mcq',
   '["elle est utile à celui qui l''énonce", "elle est admise par le plus grand nombre", "elle est conforme à la réalité qu''elle décrit", "elle est formulée avec de beaux mots"]', 2,
   'La vérité-correspondance (adéquation) définit le vrai comme l''accord du jugement avec la chose telle qu''elle est.', 1),
  ('05110000-0000-4000-8000-000000000052'::uuid, '05100000-0000-4000-8000-000000000005'::uuid,
   'Chez Kant, la raison ne peut pas connaître valablement les choses au-delà de toute expérience possible.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Kant montre que la connaissance objective se limite au champ de l''expérience ; hors de là, la raison s''égare en illusions.', 2),
  ('05110000-0000-4000-8000-000000000053'::uuid, '05100000-0000-4000-8000-000000000005'::uuid,
   'Comment appelle-t-on une croyance tenue pour vraie sans examen critique ni justification rationnelle ?', 'mcq',
   '["Une démonstration", "Une hypothèse", "Un raisonnement", "un préjugé"]', 3,
   'Le préjugé est une opinion reçue toute faite ; la raison exige au contraire de justifier et d''examiner ce qu''on affirme.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05100000-%' GROUP BY q.title;
-- =============================================================================
