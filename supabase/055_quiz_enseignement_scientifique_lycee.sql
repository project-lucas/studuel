-- =============================================================================
-- Studuel — Migration 055 : quiz de leçon, Ens. scientifique lycée 1re·Tle
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
--    d'Enseignement scientifique lycée (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Ens. scientifique', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 1re
  ('05500000-0000-4000-8000-000000000001'::uuid, '1re', 'La Terre, un astre singulier',        'La Terre, un astre singulier'),
  ('05500000-0000-4000-8000-000000000002'::uuid, '1re', 'Le Soleil, source d''énergie',         'Le Soleil, source d''énergie'),
  ('05500000-0000-4000-8000-000000000003'::uuid, '1re', 'Une longue histoire de la matière',    'Une longue histoire de la matière'),
  ('05500000-0000-4000-8000-000000000004'::uuid, '1re', 'Son et musique',                       'Son et musique'),
  -- Tle
  ('05500000-0000-4000-8000-000000000005'::uuid, 'Tle', 'L''atmosphère et le climat',           'L''atmosphère et le climat'),
  ('05500000-0000-4000-8000-000000000006'::uuid, 'Tle', 'L''énergie : conversions et enjeux',   'L''énergie : conversions et enjeux'),
  ('05500000-0000-4000-8000-000000000007'::uuid, 'Tle', 'Une histoire du vivant',               'Une histoire du vivant'),
  ('05500000-0000-4000-8000-000000000008'::uuid, 'Tle', 'L''intelligence artificielle',         'L''intelligence artificielle')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
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
  -- Quiz 1 — La Terre, un astre singulier
  ('05510000-0000-4000-8000-000000000011'::uuid, '05500000-0000-4000-8000-000000000001'::uuid,
   'Comment Ératosthène a-t-il, dès l''Antiquité, estimé la circonférence de la Terre ?', 'mcq',
   '["En mesurant l''ombre du Soleil au même moment dans deux villes éloignées", "En photographiant la Terre depuis l''espace", "En pesant une grande sphère de métal", "En comptant les étoiles du ciel"]', 0,
   'Ératosthène a comparé l''inclinaison des rayons solaires entre Syène et Alexandrie pour déduire la circonférence.', 1),
  ('05510000-0000-4000-8000-000000000012'::uuid, '05500000-0000-4000-8000-000000000001'::uuid,
   'La Terre n''est pas une sphère parfaite : elle est légèrement aplatie aux pôles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sa rotation lui donne la forme d''un géoïde, un peu renflé à l''équateur et aplati aux pôles.', 2),
  ('05510000-0000-4000-8000-000000000013'::uuid, '05500000-0000-4000-8000-000000000001'::uuid,
   'Quel est l''ordre de grandeur du rayon de la Terre ?', 'mcq',
   '["Environ 640 km", "Environ 6 400 km", "Environ 64 000 km", "Environ 640 000 km"]', 1,
   'Le rayon terrestre vaut à peu près 6 400 km (circonférence d''environ 40 000 km).', 3),

  -- Quiz 2 — Le Soleil, source d'énergie
  ('05510000-0000-4000-8000-000000000021'::uuid, '05500000-0000-4000-8000-000000000002'::uuid,
   'D''où provient l''énergie rayonnée en permanence par le Soleil ?', 'mcq',
   '["De la combustion du charbon", "De réactions de fusion nucléaire de l''hydrogène", "De la fission de l''uranium", "D''une réaction chimique lente"]', 1,
   'Au cœur du Soleil, la fusion de noyaux d''hydrogène en hélium libère d''énormes quantités d''énergie.', 1),
  ('05510000-0000-4000-8000-000000000022'::uuid, '05500000-0000-4000-8000-000000000002'::uuid,
   'Pourquoi la puissance solaire reçue par le sol est-elle plus forte à l''équateur qu''aux pôles ?', 'mcq',
   '["Parce que l''équateur est beaucoup plus proche du Soleil", "Parce que les rayons y arrivent plus perpendiculairement, concentrant l''énergie", "Parce que le Soleil n''éclaire jamais les pôles", "Parce que l''atmosphère y est absente"]', 1,
   'Aux pôles, les rayons frappent le sol de façon rasante : la même énergie est étalée sur une plus grande surface.', 2),
  ('05510000-0000-4000-8000-000000000023'::uuid, '05500000-0000-4000-8000-000000000002'::uuid,
   'Le Soleil produit son énergie en brûlant du bois ou du charbon, comme un feu ordinaire.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il ne s''agit pas d''une combustion chimique mais d''une fusion nucléaire de l''hydrogène.', 3),

  -- Quiz 3 — Une longue histoire de la matière
  ('05510000-0000-4000-8000-000000000031'::uuid, '05500000-0000-4000-8000-000000000003'::uuid,
   'Où se forment la plupart des éléments chimiques plus lourds que l''hydrogène ?', 'mcq',
   '["Dans les océans terrestres", "Au cœur des étoiles", "Dans l''atmosphère de la Terre", "Dans les volcans"]', 1,
   'La nucléosynthèse stellaire fabrique les éléments lourds ; ils sont dispersés quand les étoiles meurent.', 1),
  ('05510000-0000-4000-8000-000000000032'::uuid, '05500000-0000-4000-8000-000000000003'::uuid,
   'Quel est l''élément chimique le plus abondant dans l''Univers ?', 'mcq',
   '["Le fer", "L''oxygène", "L''hydrogène", "Le carbone"]', 2,
   'L''hydrogène, l''atome le plus simple, représente l''essentiel de la matière ordinaire de l''Univers.', 2),
  ('05510000-0000-4000-8000-000000000033'::uuid, '05500000-0000-4000-8000-000000000003'::uuid,
   'Tous les atomes d''un même élément chimique possèdent le même nombre de protons.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le nombre de protons (numéro atomique) qui définit l''élément chimique.', 3),

  -- Quiz 4 — Son et musique
  ('05510000-0000-4000-8000-000000000041'::uuid, '05500000-0000-4000-8000-000000000004'::uuid,
   'Le son est une onde qui a besoin d''un milieu matériel pour se propager. Dans le vide, le son...', 'mcq',
   '["se propage plus vite que dans l''air", "devient une onde lumineuse", "se propage à la vitesse de la lumière", "ne se propage pas du tout"]', 3,
   'Sans matière (air, eau, solide) à faire vibrer, aucune onde sonore ne peut se propager : le vide est silencieux.', 1),
  ('05510000-0000-4000-8000-000000000042'::uuid, '05500000-0000-4000-8000-000000000004'::uuid,
   'À quelle grandeur physique correspond la hauteur d''un son (grave ou aigu) ?', 'mcq',
   '["À son amplitude", "À sa durée", "À sa fréquence", "À sa couleur"]', 2,
   'La hauteur dépend de la fréquence : plus la fréquence est grande, plus le son est aigu.', 2),
  ('05510000-0000-4000-8000-000000000043'::uuid, '05500000-0000-4000-8000-000000000004'::uuid,
   'Plus la fréquence d''un son est élevée, plus ce son est aigu.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une fréquence basse donne un son grave, une fréquence élevée un son aigu.', 3),

  -- Quiz 5 — L'atmosphère et le climat
  ('05510000-0000-4000-8000-000000000051'::uuid, '05500000-0000-4000-8000-000000000005'::uuid,
   'Quel gaz, dont la concentration augmente à cause des activités humaines, renforce l''effet de serre ?', 'mcq',
   '["Le diazote (N2)", "Le dioxygène (O2)", "L''argon", "Le dioxyde de carbone (CO2)"]', 3,
   'Le CO2, émis notamment par les énergies fossiles, est un gaz à effet de serre majeur en hausse.', 1),
  ('05510000-0000-4000-8000-000000000052'::uuid, '05500000-0000-4000-8000-000000000005'::uuid,
   'L''effet de serre naturel est indispensable à la vie : sans lui, la température moyenne de la Terre serait bien plus basse.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sans effet de serre naturel, la surface terrestre avoisinerait -18 °C au lieu d''environ +15 °C.', 2),
  ('05510000-0000-4000-8000-000000000053'::uuid, '05500000-0000-4000-8000-000000000005'::uuid,
   'Quelle est la principale cause de l''augmentation du CO2 atmosphérique depuis l''ère industrielle ?', 'mcq',
   '["La combustion des énergies fossiles", "La respiration des plantes", "Les éruptions volcaniques", "La fonte des glaciers"]', 0,
   'Brûler charbon, pétrole et gaz relâche massivement du carbone longtemps stocké dans le sous-sol.', 3),

  -- Quiz 6 — L'énergie : conversions et enjeux
  ('05510000-0000-4000-8000-000000000061'::uuid, '05500000-0000-4000-8000-000000000006'::uuid,
   'Le rendement d''un convertisseur d''énergie réel est toujours...', 'mcq',
   '["supérieur à 1", "inférieur ou égal à 1", "égal à zéro", "négatif"]', 1,
   'On ne peut pas récupérer plus d''énergie utile que ce qui est fourni : le rendement reste inférieur ou égal à 1.', 1),
  ('05510000-0000-4000-8000-000000000062'::uuid, '05500000-0000-4000-8000-000000000006'::uuid,
   'Une lampe à incandescence convertit l''énergie électrique principalement en...', 'mcq',
   '["énergie chimique", "énergie mécanique", "énergie sonore", "énergie lumineuse et thermique"]', 3,
   'Une grande part de l''électricité y devient de la chaleur, et seulement une petite part de la lumière.', 2),
  ('05510000-0000-4000-8000-000000000063'::uuid, '05500000-0000-4000-8000-000000000006'::uuid,
   'Lors d''une conversion d''énergie, une partie de l''énergie est toujours dissipée, souvent sous forme de chaleur.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''énergie se conserve mais se dégrade : une part est perdue en chaleur, ce qui abaisse le rendement.', 3),

  -- Quiz 7 — Une histoire du vivant
  ('05510000-0000-4000-8000-000000000071'::uuid, '05500000-0000-4000-8000-000000000007'::uuid,
   'Quelle molécule porte l''information génétique et se transmet des parents aux descendants ?', 'mcq',
   '["Le glucose", "L''eau", "L''ADN", "Le calcium"]', 2,
   'L''ADN contient l''information héréditaire ; sa copie est transmise lors de la reproduction.', 1),
  ('05510000-0000-4000-8000-000000000072'::uuid, '05500000-0000-4000-8000-000000000007'::uuid,
   'Selon la théorie de l''évolution, la diversité des espèces s''explique surtout par...', 'mcq',
   '["la volonté des animaux de changer", "la sélection naturelle agissant sur des variations héréditaires", "l''influence des astres", "un plan fixé une fois pour toutes"]', 1,
   'Les individus les mieux adaptés à leur milieu se reproduisent davantage : c''est la sélection naturelle.', 2),
  ('05510000-0000-4000-8000-000000000073'::uuid, '05500000-0000-4000-8000-000000000007'::uuid,
   'Deux espèces qui partagent un ancêtre commun récent ont en général un ADN plus proche.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Plus la parenté est proche, plus les séquences d''ADN se ressemblent : c''est un indice de l''évolution.', 3),

  -- Quiz 8 — L'intelligence artificielle
  ('05510000-0000-4000-8000-000000000081'::uuid, '05500000-0000-4000-8000-000000000008'::uuid,
   'En apprentissage automatique (machine learning), un modèle apprend principalement à partir de...', 'mcq',
   '["données d''exemples", "sa seule intuition", "règles gravées définitivement par le programmeur", "hasard pur, sans aucune donnée"]', 0,
   'Le modèle ajuste ses paramètres en analysant de nombreux exemples : il apprend à partir des données.', 1),
  ('05510000-0000-4000-8000-000000000082'::uuid, '05500000-0000-4000-8000-000000000008'::uuid,
   'Dans l''apprentissage supervisé, les données d''entraînement sont...', 'mcq',
   '["dépourvues de toute information", "étiquetées : on connaît la réponse attendue pour chaque exemple", "toujours des images", "générées au hasard"]', 1,
   'En apprentissage supervisé, chaque exemple est associé à sa bonne réponse, qui sert de référence.', 2),
  ('05510000-0000-4000-8000-000000000083'::uuid, '05500000-0000-4000-8000-000000000008'::uuid,
   'Un modèle d''IA entraîné sur des données biaisées peut reproduire, voire amplifier, ces biais.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''IA apprend des données : si elles sont biaisées, ses résultats le seront aussi. D''où l''importance des données.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05500000-%' GROUP BY q.title;
-- =============================================================================
