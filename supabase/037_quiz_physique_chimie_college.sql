-- =============================================================================
-- Studuel — Migration 037 : quiz de leçon, Physique-Chimie collège 5e·4e·3e
--   (11 quiz, 33 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'physique-chimie' → (niveau, titre chapitre) →
--   « L'essentiel du cours ». Le chapitre 5e « Les états de la matière » a déjà
--   son quiz. (La Physique-Chimie débute au collège en 5e.)
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Physique-Chimie', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 5e (Les états de la matière déjà couvert)
  ('03700000-0000-4000-8000-000000000051'::uuid, '5e', 'Les mélanges et solutions',            'Les mélanges et solutions'),
  ('03700000-0000-4000-8000-000000000052'::uuid, '5e', 'Circuits électriques simples',         'Circuits électriques simples'),
  ('03700000-0000-4000-8000-000000000053'::uuid, '5e', 'La lumière : sources et propagation',  'La lumière : sources et propagation'),
  -- 4e
  ('03700000-0000-4000-8000-000000000041'::uuid, '4e', 'L''air et ses propriétés',       'L''air et ses propriétés'),
  ('03700000-0000-4000-8000-000000000042'::uuid, '4e', 'Les transformations chimiques',  'Les transformations chimiques'),
  ('03700000-0000-4000-8000-000000000043'::uuid, '4e', 'Intensité et tension électriques','Intensité et tension électriques'),
  ('03700000-0000-4000-8000-000000000044'::uuid, '4e', 'Vitesse et mouvement',           'Vitesse et mouvement'),
  -- 3e
  ('03700000-0000-4000-8000-000000000031'::uuid, '3e', 'Ions et pH',                        'Ions et pH'),
  ('03700000-0000-4000-8000-000000000032'::uuid, '3e', 'L''énergie et ses conversions',     'L''énergie et ses conversions'),
  ('03700000-0000-4000-8000-000000000033'::uuid, '3e', 'La gravitation',                    'La gravitation'),
  ('03700000-0000-4000-8000-000000000034'::uuid, '3e', 'Puissance et énergie électriques',  'Puissance et énergie électriques')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 5e =====
  -- 51 — Les mélanges et solutions
  ('03710000-0000-4000-8000-000000000511'::uuid, '03700000-0000-4000-8000-000000000051'::uuid,
   'Comment appelle-t-on un mélange où l''on ne distingue pas les constituants (eau salée) ?', 'mcq',
   '["un mélange homogène", "un mélange hétérogène", "un solide", "un gaz"]', 0,
   'Un mélange homogène a un aspect uniforme ; eau + huile est hétérogène.', 1),
  ('03710000-0000-4000-8000-000000000512'::uuid, '03700000-0000-4000-8000-000000000051'::uuid,
   'Quand on dissout du sel dans l''eau, le sel joue le rôle de…', 'mcq',
   '["soluté", "solvant", "précipité", "gaz"]', 0,
   'Le soluté (sel) se dissout dans le solvant (eau).', 2),
  ('03710000-0000-4000-8000-000000000513'::uuid, '03700000-0000-4000-8000-000000000051'::uuid,
   'On peut séparer l''eau et le sable par filtration.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le filtre retient le sable et laisse passer l''eau.', 3),

  -- 52 — Circuits électriques simples
  ('03710000-0000-4000-8000-000000000521'::uuid, '03700000-0000-4000-8000-000000000052'::uuid,
   'Pour qu''une lampe brille, le circuit électrique doit être…', 'mcq',
   '["fermé", "ouvert", "coupé", "débranché"]', 0,
   'Le courant ne circule que dans un circuit fermé.', 1),
  ('03710000-0000-4000-8000-000000000522'::uuid, '03700000-0000-4000-8000-000000000052'::uuid,
   'Quel composant permet d''ouvrir ou de fermer un circuit ?', 'mcq',
   '["l''interrupteur", "la pile", "la lampe", "le fil seul"]', 0,
   'L''interrupteur commande le passage du courant.', 2),
  ('03710000-0000-4000-8000-000000000523'::uuid, '03700000-0000-4000-8000-000000000052'::uuid,
   'Une pile est un générateur qui fournit l''énergie électrique au circuit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La pile met le courant électrique en mouvement.', 3),

  -- 53 — La lumière
  ('03710000-0000-4000-8000-000000000531'::uuid, '03700000-0000-4000-8000-000000000053'::uuid,
   'Lequel est une source primaire de lumière ?', 'mcq',
   '["le Soleil", "la Lune", "un miroir", "une table"]', 0,
   'Le Soleil produit sa propre lumière ; la Lune ne fait que la renvoyer.', 1),
  ('03710000-0000-4000-8000-000000000532'::uuid, '03700000-0000-4000-8000-000000000053'::uuid,
   'Dans un milieu homogène, la lumière se propage…', 'mcq',
   '["en ligne droite", "en zigzag", "en cercle", "en spirale"]', 0,
   'La lumière se propage de façon rectiligne.', 2),
  ('03710000-0000-4000-8000-000000000533'::uuid, '03700000-0000-4000-8000-000000000053'::uuid,
   'Une source secondaire, comme la Lune, ne fait que renvoyer la lumière reçue.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La Lune réfléchit la lumière du Soleil.', 3),

  -- ===== 4e =====
  -- 41 — L'air et ses propriétés
  ('03710000-0000-4000-8000-000000000411'::uuid, '03700000-0000-4000-8000-000000000041'::uuid,
   'De quels gaz l''air est-il principalement composé ?', 'mcq',
   '["diazote et dioxygène", "eau et sel", "hélium pur", "dioxyde de carbone seul"]', 0,
   'L''air contient environ 78 % de diazote et 21 % de dioxygène.', 1),
  ('03710000-0000-4000-8000-000000000412'::uuid, '03700000-0000-4000-8000-000000000041'::uuid,
   'L''air est…', 'mcq',
   '["de la matière (il a une masse)", "sans masse", "un solide", "un liquide"]', 0,
   'L''air est un gaz : c''est de la matière, qui possède une masse.', 2),
  ('03710000-0000-4000-8000-000000000413'::uuid, '03700000-0000-4000-8000-000000000041'::uuid,
   'Un gaz est compressible : on peut réduire son volume en le comprimant.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Contrairement aux liquides, les gaz se compriment facilement.', 3),

  -- 42 — Les transformations chimiques
  ('03710000-0000-4000-8000-000000000421'::uuid, '03700000-0000-4000-8000-000000000042'::uuid,
   'Lors d''une combustion, une substance réagit surtout avec…', 'mcq',
   '["le dioxygène", "le sel", "le sable", "le sucre"]', 0,
   'La combustion consomme du dioxygène.', 1),
  ('03710000-0000-4000-8000-000000000422'::uuid, '03700000-0000-4000-8000-000000000042'::uuid,
   'Dans une transformation chimique, les substances formées s''appellent les…', 'mcq',
   '["produits", "solvants", "filtres", "mélanges"]', 0,
   'Les réactifs de départ se transforment en produits.', 2),
  ('03710000-0000-4000-8000-000000000423'::uuid, '03700000-0000-4000-8000-000000000042'::uuid,
   'La combustion du carbone produit du dioxyde de carbone.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Carbone + dioxygène → dioxyde de carbone.', 3),

  -- 43 — Intensité et tension
  ('03710000-0000-4000-8000-000000000431'::uuid, '03700000-0000-4000-8000-000000000043'::uuid,
   'Avec quel appareil mesure-t-on l''intensité d''un courant électrique ?', 'mcq',
   '["un ampèremètre", "un voltmètre", "un thermomètre", "une balance"]', 0,
   'L''ampèremètre mesure l''intensité, en ampères (A).', 1),
  ('03710000-0000-4000-8000-000000000432'::uuid, '03700000-0000-4000-8000-000000000043'::uuid,
   'En quelle unité mesure-t-on la tension électrique ?', 'mcq',
   '["le volt (V)", "le gramme (g)", "le mètre (m)", "la seconde (s)"]', 0,
   'La tension se mesure en volts, avec un voltmètre.', 2),
  ('03710000-0000-4000-8000-000000000433'::uuid, '03700000-0000-4000-8000-000000000043'::uuid,
   'L''ampèremètre se branche en série dans le circuit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En série, pour mesurer l''intensité qui le traverse.', 3),

  -- 44 — Vitesse et mouvement
  ('03710000-0000-4000-8000-000000000441'::uuid, '03700000-0000-4000-8000-000000000044'::uuid,
   'Comment calcule-t-on une vitesse moyenne ?', 'mcq',
   '["distance ÷ durée", "distance × durée", "durée ÷ distance", "distance + durée"]', 0,
   'Vitesse = distance parcourue divisée par la durée.', 1),
  ('03710000-0000-4000-8000-000000000442'::uuid, '03700000-0000-4000-8000-000000000044'::uuid,
   'Une voiture parcourt 100 km en 2 h. Quelle est sa vitesse moyenne ?', 'mcq',
   '["50 km/h", "200 km/h", "102 km/h", "25 km/h"]', 0,
   '100 ÷ 2 = 50 km/h.', 2),
  ('03710000-0000-4000-8000-000000000443'::uuid, '03700000-0000-4000-8000-000000000044'::uuid,
   'Le mouvement d''un objet se décrit par rapport à un point de référence (un référentiel).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le mouvement est toujours relatif à un référentiel choisi.', 3),

  -- ===== 3e =====
  -- 31 — Ions et pH
  ('03710000-0000-4000-8000-000000000311'::uuid, '03700000-0000-4000-8000-000000000031'::uuid,
   'Une solution dont le pH est inférieur à 7 est…', 'mcq',
   '["acide", "basique", "neutre", "solide"]', 0,
   'pH < 7 : acide ; pH = 7 : neutre ; pH > 7 : basique.', 1),
  ('03710000-0000-4000-8000-000000000312'::uuid, '03700000-0000-4000-8000-000000000031'::uuid,
   'Un atome qui a gagné ou perdu des électrons devient…', 'mcq',
   '["un ion", "un gaz", "un solvant", "un cristal"]', 0,
   'L''ion porte alors une charge électrique.', 2),
  ('03710000-0000-4000-8000-000000000313'::uuid, '03700000-0000-4000-8000-000000000031'::uuid,
   'L''eau pure a un pH d''environ 7 : elle est neutre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un pH de 7 correspond à une solution neutre.', 3),

  -- 32 — L'énergie et ses conversions
  ('03710000-0000-4000-8000-000000000321'::uuid, '03700000-0000-4000-8000-000000000032'::uuid,
   'Une lampe convertit l''énergie électrique surtout en…', 'mcq',
   '["lumière (et un peu de chaleur)", "son", "eau", "essence"]', 0,
   'La lampe transforme l''électricité en lumière et en chaleur.', 1),
  ('03710000-0000-4000-8000-000000000322'::uuid, '03700000-0000-4000-8000-000000000032'::uuid,
   'Que dit le principe de conservation de l''énergie ?', 'mcq',
   '["l''énergie se transforme d''une forme à une autre, sans se perdre", "l''énergie disparaît", "l''énergie se crée à partir de rien", "l''énergie n''existe pas"]', 0,
   'L''énergie ne se crée pas et ne se détruit pas : elle se convertit.', 2),
  ('03710000-0000-4000-8000-000000000323'::uuid, '03700000-0000-4000-8000-000000000032'::uuid,
   'Un panneau solaire convertit l''énergie lumineuse en énergie électrique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il transforme la lumière du Soleil en électricité.', 3),

  -- 33 — La gravitation
  ('03710000-0000-4000-8000-000000000331'::uuid, '03700000-0000-4000-8000-000000000033'::uuid,
   'Qu''est-ce qui retient la Lune en orbite autour de la Terre ?', 'mcq',
   '["l''attraction gravitationnelle", "un câble", "le vent", "l''électricité"]', 0,
   'La gravitation attire les corps les uns vers les autres.', 1),
  ('03710000-0000-4000-8000-000000000332'::uuid, '03700000-0000-4000-8000-000000000033'::uuid,
   'Sur la Lune, le poids d''un objet est… par rapport à la Terre.', 'mcq',
   '["plus faible", "plus grand", "identique", "nul"]', 0,
   'La Lune attire moins : le poids y est environ 6 fois plus faible.', 2),
  ('03710000-0000-4000-8000-000000000333'::uuid, '03700000-0000-4000-8000-000000000033'::uuid,
   'La masse d''un objet reste la même sur la Terre et sur la Lune, mais son poids change.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La masse (en kg) est invariable ; le poids (en N) dépend de l''astre.', 3),

  -- 34 — Puissance et énergie électriques
  ('03710000-0000-4000-8000-000000000341'::uuid, '03700000-0000-4000-8000-000000000034'::uuid,
   'En quelle unité mesure-t-on la puissance électrique d''un appareil ?', 'mcq',
   '["le watt (W)", "le litre (L)", "le mètre (m)", "le degré (°C)"]', 0,
   'La puissance électrique se mesure en watts.', 1),
  ('03710000-0000-4000-8000-000000000342'::uuid, '03700000-0000-4000-8000-000000000034'::uuid,
   'À durée égale, un appareil de forte puissance consomme l''énergie…', 'mcq',
   '["plus vite", "plus lentement", "jamais", "sans consommer d''énergie"]', 0,
   'Plus la puissance est grande, plus l''énergie est consommée rapidement.', 2),
  ('03710000-0000-4000-8000-000000000343'::uuid, '03700000-0000-4000-8000-000000000034'::uuid,
   'L''énergie consommée par un appareil dépend de sa puissance et de sa durée d''utilisation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Énergie = puissance × durée.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03700000-%' GROUP BY 1,2 ORDER BY 1,2;
