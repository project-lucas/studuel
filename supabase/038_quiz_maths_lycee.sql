-- =============================================================================
-- Studuel — Migration 038 : quiz de leçon, Maths lycée 2de·1re·Tle
--   (15 quiz, 45 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'maths' → (niveau, titre chapitre) → « L'essentiel du
--   cours ». Niveaux lycée : 2de, 1re, Tle.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Maths', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 2de
  ('03800000-0000-4000-8000-000000000021'::uuid, '2de', 'Ensembles de nombres et calculs', 'Ensembles de nombres et calculs'),
  ('03800000-0000-4000-8000-000000000022'::uuid, '2de', 'Équations et inéquations',        'Équations et inéquations'),
  ('03800000-0000-4000-8000-000000000023'::uuid, '2de', 'Fonctions de référence',          'Fonctions de référence'),
  ('03800000-0000-4000-8000-000000000024'::uuid, '2de', 'Vecteurs',                         'Vecteurs'),
  ('03800000-0000-4000-8000-000000000025'::uuid, '2de', 'Statistiques et probabilités',     'Statistiques et probabilités'),
  -- 1re
  ('03800000-0000-4000-8000-000000000011'::uuid, '1re', 'Suites numériques',           'Suites numériques'),
  ('03800000-0000-4000-8000-000000000012'::uuid, '1re', 'Second degré',                'Second degré'),
  ('03800000-0000-4000-8000-000000000013'::uuid, '1re', 'Dérivation',                  'Dérivation'),
  ('03800000-0000-4000-8000-000000000014'::uuid, '1re', 'Produit scalaire',            'Produit scalaire'),
  ('03800000-0000-4000-8000-000000000015'::uuid, '1re', 'Probabilités conditionnelles','Probabilités conditionnelles'),
  -- Tle
  ('03800000-0000-4000-8000-000000000031'::uuid, 'Tle', 'Limites de fonctions',                     'Limites de fonctions'),
  ('03800000-0000-4000-8000-000000000032'::uuid, 'Tle', 'Continuité et convexité',                  'Continuité et convexité'),
  ('03800000-0000-4000-8000-000000000033'::uuid, 'Tle', 'Logarithme népérien',                      'Logarithme népérien'),
  ('03800000-0000-4000-8000-000000000034'::uuid, 'Tle', 'Primitives et équations différentielles',  'Primitives et équations différentielles'),
  ('03800000-0000-4000-8000-000000000035'::uuid, 'Tle', 'Lois de probabilité',                      'Lois de probabilité')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 2de =====
  -- 21 — Ensembles de nombres
  ('03810000-0000-4000-8000-000000000211'::uuid, '03800000-0000-4000-8000-000000000021'::uuid,
   'À quel ensemble appartient le nombre −5 ?', 'mcq',
   '["aux entiers relatifs ℤ", "aux entiers naturels ℕ", "aux irrationnels", "à aucun ensemble"]', 0,
   '−5 est un entier relatif (ℤ) ; il n''est pas naturel car négatif.', 1),
  ('03810000-0000-4000-8000-000000000212'::uuid, '03800000-0000-4000-8000-000000000021'::uuid,
   'Le nombre √2 est…', 'mcq',
   '["irrationnel", "un entier", "un décimal", "impossible à définir"]', 0,
   '√2 ne peut pas s''écrire comme une fraction : il est irrationnel.', 2),
  ('03810000-0000-4000-8000-000000000213'::uuid, '03800000-0000-4000-8000-000000000021'::uuid,
   'Tout entier naturel est aussi un nombre rationnel.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'n peut s''écrire n/1, donc ℕ est inclus dans ℚ.', 3),

  -- 22 — Équations et inéquations
  ('03810000-0000-4000-8000-000000000221'::uuid, '03800000-0000-4000-8000-000000000022'::uuid,
   'Quelle est la solution de l''équation 2x + 6 = 0 ?', 'mcq',
   '["x = −3", "x = 3", "x = −6", "x = 6"]', 0,
   '2x = −6, donc x = −3.', 1),
  ('03810000-0000-4000-8000-000000000222'::uuid, '03800000-0000-4000-8000-000000000022'::uuid,
   'En résolvant une inéquation, si on multiplie les deux membres par un nombre négatif, on…', 'mcq',
   '["change le sens de l''inégalité", "garde le même sens", "supprime l''inégalité", "double la solution"]', 0,
   'Multiplier ou diviser par un négatif inverse le sens de l''inégalité.', 2),
  ('03810000-0000-4000-8000-000000000223'::uuid, '03800000-0000-4000-8000-000000000022'::uuid,
   'L''équation x² = 9 admet deux solutions : 3 et −3.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '3² = 9 et (−3)² = 9.', 3),

  -- 23 — Fonctions de référence
  ('03810000-0000-4000-8000-000000000231'::uuid, '03800000-0000-4000-8000-000000000023'::uuid,
   'Quelle est l''allure de la courbe de la fonction carré f(x) = x² ?', 'mcq',
   '["une parabole", "une droite", "un cercle", "une hyperbole"]', 0,
   'La fonction carré est représentée par une parabole.', 1),
  ('03810000-0000-4000-8000-000000000232'::uuid, '03800000-0000-4000-8000-000000000023'::uuid,
   'La fonction identité f(x) = x est représentée par…', 'mcq',
   '["une droite passant par l''origine", "une parabole", "un cercle", "une courbe en cloche"]', 0,
   'C''est la droite d''équation y = x.', 2),
  ('03810000-0000-4000-8000-000000000233'::uuid, '03800000-0000-4000-8000-000000000023'::uuid,
   'La fonction inverse f(x) = 1/x n''est pas définie en 0.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On ne peut pas diviser par 0.', 3),

  -- 24 — Vecteurs
  ('03810000-0000-4000-8000-000000000241'::uuid, '03800000-0000-4000-8000-000000000024'::uuid,
   'Deux vecteurs égaux ont…', 'mcq',
   '["même direction, même sens et même norme", "seulement la même norme", "des sens opposés", "la même origine"]', 0,
   'L''égalité de deux vecteurs impose direction, sens et longueur identiques.', 1),
  ('03810000-0000-4000-8000-000000000242'::uuid, '03800000-0000-4000-8000-000000000024'::uuid,
   'Que traduit la relation de Chasles ?', 'mcq',
   '["AB + BC = AC", "AB + BC = 0", "AB × BC = AC", "AB − AC = BC"]', 0,
   'La relation de Chasles enchaîne les vecteurs : AB + BC = AC.', 2),
  ('03810000-0000-4000-8000-000000000243'::uuid, '03800000-0000-4000-8000-000000000024'::uuid,
   'Le vecteur AB va du point A vers le point B.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'A est l''origine, B l''extrémité du vecteur AB.', 3),

  -- 25 — Statistiques et probabilités
  ('03810000-0000-4000-8000-000000000251'::uuid, '03800000-0000-4000-8000-000000000025'::uuid,
   'Quelle est la moyenne de la série 2, 4, 9 ?', 'mcq',
   '["5", "4", "15", "6"]', 0,
   '(2 + 4 + 9) ÷ 3 = 15 ÷ 3 = 5.', 1),
  ('03810000-0000-4000-8000-000000000252'::uuid, '03800000-0000-4000-8000-000000000025'::uuid,
   'On lance une pièce équilibrée. Quelle est la probabilité d''obtenir « pile » ?', 'mcq',
   '["1/2", "1/6", "1", "0"]', 0,
   'Deux issues équiprobables : pile ou face.', 2),
  ('03810000-0000-4000-8000-000000000253'::uuid, '03800000-0000-4000-8000-000000000025'::uuid,
   'La médiane d''une série partage les valeurs ordonnées en deux moitiés.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La moitié des valeurs lui sont inférieures, l''autre moitié supérieures.', 3),

  -- ===== 1re =====
  -- 11 — Suites numériques
  ('03810000-0000-4000-8000-000000000111'::uuid, '03800000-0000-4000-8000-000000000011'::uuid,
   'Une suite où l''on ajoute toujours le même nombre d''un terme au suivant est…', 'mcq',
   '["arithmétique", "géométrique", "constante", "bornée"]', 0,
   'La suite arithmétique a une raison ajoutée à chaque étape.', 1),
  ('03810000-0000-4000-8000-000000000112'::uuid, '03800000-0000-4000-8000-000000000011'::uuid,
   'Dans une suite géométrique, on passe d''un terme au suivant en…', 'mcq',
   '["multipliant par la raison", "ajoutant la raison", "élevant au carré", "soustrayant 1"]', 0,
   'La suite géométrique multiplie par sa raison q à chaque étape.', 2),
  ('03810000-0000-4000-8000-000000000113'::uuid, '03800000-0000-4000-8000-000000000011'::uuid,
   'Pour une suite arithmétique de premier terme u₀ et de raison r, on a uₙ = u₀ + n × r.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la formule explicite de la suite arithmétique.', 3),

  -- 12 — Second degré
  ('03810000-0000-4000-8000-000000000121'::uuid, '03800000-0000-4000-8000-000000000012'::uuid,
   'Quel est le discriminant Δ du trinôme ax² + bx + c ?', 'mcq',
   '["b² − 4ac", "2a + b", "b² + 4ac", "−b/2a"]', 0,
   'Le discriminant vaut Δ = b² − 4ac.', 1),
  ('03810000-0000-4000-8000-000000000122'::uuid, '03800000-0000-4000-8000-000000000012'::uuid,
   'Si Δ > 0, l''équation ax² + bx + c = 0 admet…', 'mcq',
   '["deux solutions réelles distinctes", "une seule solution", "aucune solution réelle", "une infinité de solutions"]', 0,
   'Un discriminant strictement positif donne deux racines réelles.', 2),
  ('03810000-0000-4000-8000-000000000123'::uuid, '03800000-0000-4000-8000-000000000012'::uuid,
   'Si Δ = 0, l''équation du second degré admet une unique solution (racine double).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Cette solution est x = −b/(2a).', 3),

  -- 13 — Dérivation
  ('03810000-0000-4000-8000-000000000131'::uuid, '03800000-0000-4000-8000-000000000013'::uuid,
   'Quelle est la dérivée de f(x) = x² ?', 'mcq',
   '["2x", "x", "x²/2", "2"]', 0,
   'La dérivée de xⁿ est n·xⁿ⁻¹, donc (x²)′ = 2x.', 1),
  ('03810000-0000-4000-8000-000000000132'::uuid, '03800000-0000-4000-8000-000000000013'::uuid,
   'La dérivée d''une fonction en un point donne…', 'mcq',
   '["le coefficient directeur de la tangente", "l''ordonnée à l''origine", "l''aire sous la courbe", "la limite en +∞"]', 0,
   'f′(a) est la pente de la tangente au point d''abscisse a.', 2),
  ('03810000-0000-4000-8000-000000000133'::uuid, '03800000-0000-4000-8000-000000000013'::uuid,
   'Si f′(x) > 0 sur un intervalle, alors f est croissante sur cet intervalle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le signe de la dérivée donne le sens de variation.', 3),

  -- 14 — Produit scalaire
  ('03810000-0000-4000-8000-000000000141'::uuid, '03800000-0000-4000-8000-000000000014'::uuid,
   'Deux vecteurs non nuls sont orthogonaux si et seulement si leur produit scalaire est…', 'mcq',
   '["nul", "égal à 1", "négatif", "positif"]', 0,
   'u·v = 0 équivaut à des vecteurs orthogonaux.', 1),
  ('03810000-0000-4000-8000-000000000142'::uuid, '03800000-0000-4000-8000-000000000014'::uuid,
   'Quelle formule donne le produit scalaire de deux vecteurs ?', 'mcq',
   '["‖u‖ × ‖v‖ × cos(θ)", "‖u‖ + ‖v‖", "u + v", "‖u‖ / ‖v‖"]', 0,
   'θ est l''angle entre les deux vecteurs.', 2),
  ('03810000-0000-4000-8000-000000000143'::uuid, '03800000-0000-4000-8000-000000000014'::uuid,
   'Le produit scalaire d''un vecteur par lui-même est égal au carré de sa norme.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'u·u = ‖u‖².', 3),

  -- 15 — Probabilités conditionnelles
  ('03810000-0000-4000-8000-000000000151'::uuid, '03800000-0000-4000-8000-000000000015'::uuid,
   'Comment note-t-on la probabilité de A sachant B ?', 'mcq',
   '["P_B(A)", "P(A) + P(B)", "P(A) × B", "A/B"]', 0,
   'On écrit P_B(A) (ou P(A|B)).', 1),
  ('03810000-0000-4000-8000-000000000152'::uuid, '03800000-0000-4000-8000-000000000015'::uuid,
   'Deux événements A et B sont indépendants si…', 'mcq',
   '["P(A ∩ B) = P(A) × P(B)", "P(A ∩ B) = P(A) + P(B)", "P(A) = P(B)", "A = B"]', 0,
   'C''est la définition de l''indépendance de deux événements.', 2),
  ('03810000-0000-4000-8000-000000000153'::uuid, '03800000-0000-4000-8000-000000000015'::uuid,
   'Un arbre pondéré permet de représenter des probabilités conditionnelles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Chaque branche porte une probabilité (conditionnelle après la première).', 3),

  -- ===== Tle =====
  -- 31 — Limites de fonctions
  ('03810000-0000-4000-8000-000000000311'::uuid, '03800000-0000-4000-8000-000000000031'::uuid,
   'Quelle est la limite de 1/x quand x tend vers +∞ ?', 'mcq',
   '["0", "+∞", "1", "−∞"]', 0,
   '1/x se rapproche de 0 quand x devient très grand.', 1),
  ('03810000-0000-4000-8000-000000000312'::uuid, '03800000-0000-4000-8000-000000000031'::uuid,
   'Quelle est la limite de x² quand x tend vers +∞ ?', 'mcq',
   '["+∞", "0", "1", "−∞"]', 0,
   'x² croît sans borne quand x tend vers +∞.', 2),
  ('03810000-0000-4000-8000-000000000313'::uuid, '03800000-0000-4000-8000-000000000031'::uuid,
   'Une asymptote horizontale correspond à une limite finie de la fonction en ±∞.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Si la limite vaut L (fini), la droite y = L est asymptote horizontale.', 3),

  -- 32 — Continuité et convexité
  ('03810000-0000-4000-8000-000000000321'::uuid, '03800000-0000-4000-8000-000000000032'::uuid,
   'Une fonction est convexe sur un intervalle lorsque sa courbe est…', 'mcq',
   '["au-dessus de ses tangentes", "en dessous de ses tangentes", "toujours une droite", "toujours décroissante"]', 0,
   'Convexe : courbe au-dessus de ses tangentes (dérivée seconde positive).', 1),
  ('03810000-0000-4000-8000-000000000322'::uuid, '03800000-0000-4000-8000-000000000032'::uuid,
   'Comment appelle-t-on le point où la courbe change de convexité ?', 'mcq',
   '["un point d''inflexion", "un maximum", "une asymptote", "une racine"]', 0,
   'Au point d''inflexion, la fonction passe de convexe à concave (ou l''inverse).', 2),
  ('03810000-0000-4000-8000-000000000323'::uuid, '03800000-0000-4000-8000-000000000032'::uuid,
   'Une fonction dérivable sur un intervalle y est nécessairement continue.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La dérivabilité entraîne la continuité (mais pas l''inverse).', 3),

  -- 33 — Logarithme népérien
  ('03810000-0000-4000-8000-000000000331'::uuid, '03800000-0000-4000-8000-000000000033'::uuid,
   'Que vaut ln(1) ?', 'mcq',
   '["0", "1", "e", "−1"]', 0,
   'Par définition, ln(1) = 0.', 1),
  ('03810000-0000-4000-8000-000000000332'::uuid, '03800000-0000-4000-8000-000000000033'::uuid,
   'Quelle propriété du logarithme népérien est correcte ?', 'mcq',
   '["ln(a × b) = ln(a) + ln(b)", "ln(a × b) = ln(a) × ln(b)", "ln(a + b) = ln(a) + ln(b)", "ln(a/b) = ln(a) × ln(b)"]', 0,
   'Le logarithme transforme un produit en somme.', 2),
  ('03810000-0000-4000-8000-000000000333'::uuid, '03800000-0000-4000-8000-000000000033'::uuid,
   'La fonction ln est définie uniquement pour les nombres strictement positifs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'ln(x) n''existe que pour x > 0.', 3),

  -- 34 — Primitives
  ('03810000-0000-4000-8000-000000000341'::uuid, '03800000-0000-4000-8000-000000000034'::uuid,
   'Une primitive de f(x) = 2x est…', 'mcq',
   '["x² (+ une constante)", "2", "x²/2", "2x²"]', 0,
   'F′ = f, et la dérivée de x² est 2x.', 1),
  ('03810000-0000-4000-8000-000000000342'::uuid, '03800000-0000-4000-8000-000000000034'::uuid,
   'La primitive et la dérivée sont des opérations…', 'mcq',
   '["réciproques (l''une défait l''autre)", "identiques", "sans aucun lien", "toujours nulles"]', 0,
   'Dériver une primitive de f redonne f.', 2),
  ('03810000-0000-4000-8000-000000000343'::uuid, '03800000-0000-4000-8000-000000000034'::uuid,
   'Deux primitives d''une même fonction diffèrent d''une constante.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Si F et G sont deux primitives de f, alors F − G est constante.', 3),

  -- 35 — Lois de probabilité
  ('03810000-0000-4000-8000-000000000351'::uuid, '03800000-0000-4000-8000-000000000035'::uuid,
   'Pour une loi binomiale de paramètres n et p, l''espérance vaut…', 'mcq',
   '["n × p", "n + p", "p/n", "n/p"]', 0,
   'E(X) = n × p pour une loi binomiale.', 1),
  ('03810000-0000-4000-8000-000000000352'::uuid, '03800000-0000-4000-8000-000000000035'::uuid,
   'Quelle loi continue modélise un temps d''attente « sans mémoire » ?', 'mcq',
   '["la loi exponentielle", "la loi binomiale", "la loi de Bernoulli", "la loi uniforme discrète"]', 0,
   'La loi exponentielle est continue et sans vieillissement.', 2),
  ('03810000-0000-4000-8000-000000000353'::uuid, '03800000-0000-4000-8000-000000000035'::uuid,
   'Pour une variable aléatoire, l''espérance représente la valeur « moyenne » attendue.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'E(X) est la moyenne des valeurs pondérées par leurs probabilités.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03800000-%' GROUP BY 1,2 ORDER BY 1,2;
