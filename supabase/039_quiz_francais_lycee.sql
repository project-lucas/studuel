-- =============================================================================
-- Studuel — Migration 039 : quiz de leçon, Français lycée 2de·1re
--   (10 quiz, 30 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'francais' → (niveau, titre chapitre) → « L'essentiel du
--   cours ». (Le français au lycée se traite en 2de et 1re, jusqu'au bac.)
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Français', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 2de
  ('03900000-0000-4000-8000-000000000021'::uuid, '2de', 'Le roman et le récit',                'Le roman et le récit'),
  ('03900000-0000-4000-8000-000000000022'::uuid, '2de', 'La poésie du Moyen Âge au XVIIIe',    'La poésie du Moyen Âge au XVIIIe'),
  ('03900000-0000-4000-8000-000000000023'::uuid, '2de', 'Le théâtre du XVIIe au XXIe',         'Le théâtre du XVIIe au XXIe'),
  ('03900000-0000-4000-8000-000000000024'::uuid, '2de', 'La littérature d''idées et la presse','La littérature d''idées et la presse'),
  ('03900000-0000-4000-8000-000000000025'::uuid, '2de', 'Méthode du commentaire',              'Méthode du commentaire'),
  -- 1re
  ('03900000-0000-4000-8000-000000000011'::uuid, '1re', 'La poésie du XIXe au XXIe siècle', 'La poésie du XIXe au XXIe siècle'),
  ('03900000-0000-4000-8000-000000000012'::uuid, '1re', 'Le roman : parcours bac',          'Le roman : parcours bac'),
  ('03900000-0000-4000-8000-000000000013'::uuid, '1re', 'Le théâtre : parcours bac',        'Le théâtre : parcours bac'),
  ('03900000-0000-4000-8000-000000000014'::uuid, '1re', 'La littérature d''idées',          'La littérature d''idées'),
  ('03900000-0000-4000-8000-000000000015'::uuid, '1re', 'Dissertation et oral du bac',      'Dissertation et oral du bac')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 2de =====
  -- 21 — Le roman et le récit
  ('03910000-0000-4000-8000-000000000211'::uuid, '03900000-0000-4000-8000-000000000021'::uuid,
   'Qui raconte l''histoire dans un roman ?', 'mcq',
   '["le narrateur", "l''imprimeur", "le libraire", "le lecteur"]', 0,
   'Le narrateur raconte ; il ne se confond pas forcément avec l''auteur.', 1),
  ('03910000-0000-4000-8000-000000000212'::uuid, '03900000-0000-4000-8000-000000000021'::uuid,
   'Un récit où le narrateur dit « je » est un récit…', 'mcq',
   '["à la première personne", "à la troisième personne", "sans narrateur", "théâtral"]', 0,
   'Le narrateur y participe à l''histoire (narration à la première personne).', 2),
  ('03910000-0000-4000-8000-000000000213'::uuid, '03900000-0000-4000-8000-000000000021'::uuid,
   'Le narrateur omniscient connaît les pensées de tous les personnages.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le point de vue (focalisation) omniscient.', 3),

  -- 22 — La poésie du Moyen Âge au XVIIIe
  ('03910000-0000-4000-8000-000000000221'::uuid, '03900000-0000-4000-8000-000000000022'::uuid,
   'Comment appelle-t-on un poème de 14 vers (souvent 2 quatrains et 2 tercets) ?', 'mcq',
   '["un sonnet", "une fable", "une ode", "un roman"]', 0,
   'Le sonnet est une forme fixe de 14 vers.', 1),
  ('03910000-0000-4000-8000-000000000222'::uuid, '03900000-0000-4000-8000-000000000022'::uuid,
   'Comment nomme-t-on un vers de 12 syllabes ?', 'mcq',
   '["un alexandrin", "un octosyllabe", "un décasyllabe", "un quatrain"]', 0,
   'L''alexandrin compte 12 syllabes.', 2),
  ('03910000-0000-4000-8000-000000000223'::uuid, '03900000-0000-4000-8000-000000000022'::uuid,
   'La versification étudie notamment les rimes et le nombre de syllabes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle s''intéresse au mètre, aux rimes et aux strophes.', 3),

  -- 23 — Le théâtre du XVIIe au XXIe
  ('03910000-0000-4000-8000-000000000231'::uuid, '03900000-0000-4000-8000-000000000023'::uuid,
   'Au théâtre classique, une tragédie se termine généralement…', 'mcq',
   '["de façon malheureuse (souvent la mort)", "toujours par un mariage", "par une chanson comique", "sans fin"]', 0,
   'La tragédie mène le héros à un destin funeste.', 1),
  ('03910000-0000-4000-8000-000000000232'::uuid, '03900000-0000-4000-8000-000000000023'::uuid,
   'Comment appelle-t-on les paroles échangées entre personnages au théâtre ?', 'mcq',
   '["un dialogue", "une strophe", "un chapitre", "un paragraphe"]', 0,
   'Le dialogue théâtral est fait de répliques.', 2),
  ('03910000-0000-4000-8000-000000000233'::uuid, '03900000-0000-4000-8000-000000000023'::uuid,
   'Une tirade est une longue réplique dite par un seul personnage.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À distinguer du monologue, où le personnage est seul en scène.', 3),

  -- 24 — La littérature d'idées et la presse
  ('03910000-0000-4000-8000-000000000241'::uuid, '03900000-0000-4000-8000-000000000024'::uuid,
   'Un texte qui défend une opinion à l''aide d''arguments est…', 'mcq',
   '["argumentatif", "descriptif", "purement narratif", "uniquement lyrique"]', 0,
   'L''argumentation cherche à convaincre ou à persuader.', 1),
  ('03910000-0000-4000-8000-000000000242'::uuid, '03900000-0000-4000-8000-000000000024'::uuid,
   'Un apologue, comme la fable, délivre souvent…', 'mcq',
   '["une morale", "une recette", "un tableau chiffré", "une adresse postale"]', 0,
   'L''apologue illustre une leçon de façon plaisante.', 2),
  ('03910000-0000-4000-8000-000000000243'::uuid, '03900000-0000-4000-8000-000000000024'::uuid,
   'Un essai est un texte où l''auteur expose et défend son point de vue.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est une réflexion argumentée et personnelle.', 3),

  -- 25 — Méthode du commentaire
  ('03910000-0000-4000-8000-000000000251'::uuid, '03900000-0000-4000-8000-000000000025'::uuid,
   'En quoi consiste le commentaire littéraire ?', 'mcq',
   '["analyser un texte de façon organisée", "résumer l''intrigue seulement", "réécrire le texte", "donner uniquement son avis"]', 0,
   'On analyse la forme et le sens de manière structurée.', 1),
  ('03910000-0000-4000-8000-000000000252'::uuid, '03900000-0000-4000-8000-000000000025'::uuid,
   'Un commentaire s''organise généralement en…', 'mcq',
   '["axes de lecture (parties argumentées)", "une seule phrase", "une liste de mots", "un dessin"]', 0,
   'Chaque axe regroupe des analyses autour d''une idée directrice.', 2),
  ('03910000-0000-4000-8000-000000000253'::uuid, '03900000-0000-4000-8000-000000000025'::uuid,
   'Dans un commentaire, chaque analyse doit s''appuyer sur des citations du texte.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On cite le texte pour justifier son interprétation.', 3),

  -- ===== 1re =====
  -- 11 — La poésie du XIXe au XXIe siècle
  ('03910000-0000-4000-8000-000000000111'::uuid, '03900000-0000-4000-8000-000000000011'::uuid,
   'Comment appelle-t-on une image qui rapproche deux réalités sans mot de comparaison ?', 'mcq',
   '["une métaphore", "une comparaison", "une énumération", "une anaphore"]', 0,
   'La métaphore est une comparaison implicite (sans « comme »).', 1),
  ('03910000-0000-4000-8000-000000000112'::uuid, '03900000-0000-4000-8000-000000000011'::uuid,
   'Le registre lyrique exprime surtout…', 'mcq',
   '["les sentiments personnels", "le comique", "la peur", "des données chiffrées"]', 0,
   'Le lyrisme chante les émotions : amour, mélancolie, joie…', 2),
  ('03910000-0000-4000-8000-000000000113'::uuid, '03900000-0000-4000-8000-000000000011'::uuid,
   'Un poème en prose est un texte poétique sans vers réguliers.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Baudelaire et Rimbaud en ont écrit.', 3),

  -- 12 — Le roman : parcours bac
  ('03910000-0000-4000-8000-000000000121'::uuid, '03900000-0000-4000-8000-000000000012'::uuid,
   'Comment appelle-t-on le personnage principal autour duquel s''organise le récit ?', 'mcq',
   '["le héros (ou protagoniste)", "le narrateur externe", "l''éditeur", "le lecteur"]', 0,
   'Le protagoniste est au centre de l''intrigue.', 1),
  ('03910000-0000-4000-8000-000000000122'::uuid, '03900000-0000-4000-8000-000000000012'::uuid,
   'Un personnage qui évolue au fil du roman est dit…', 'mcq',
   '["dynamique", "figé pour toujours", "absent", "secondaire par nature"]', 0,
   'Le personnage dynamique change au cours de l''histoire.', 2),
  ('03910000-0000-4000-8000-000000000123'::uuid, '03900000-0000-4000-8000-000000000012'::uuid,
   'Le cadre spatio-temporel situe l''action dans un lieu et une époque.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il précise où et quand se déroule l''histoire.', 3),

  -- 13 — Le théâtre : parcours bac
  ('03910000-0000-4000-8000-000000000131'::uuid, '03900000-0000-4000-8000-000000000013'::uuid,
   'Une pièce de théâtre est découpée en…', 'mcq',
   '["actes et scènes", "chapitres et strophes", "couplets et refrains", "titres et sous-titres"]', 0,
   'Les actes sont de grandes unités, subdivisées en scènes.', 1),
  ('03910000-0000-4000-8000-000000000132'::uuid, '03900000-0000-4000-8000-000000000013'::uuid,
   'Comment appelle-t-on le moment de plus forte tension dramatique ?', 'mcq',
   '["le nœud de l''action", "le décor", "la préface", "la table des matières"]', 0,
   'Le nœud est le sommet de l''intrigue, avant le dénouement.', 2),
  ('03910000-0000-4000-8000-000000000133'::uuid, '03900000-0000-4000-8000-000000000013'::uuid,
   'Le dénouement est la résolution finale de l''intrigue au théâtre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il clôt la pièce en réglant le sort des personnages.', 3),

  -- 14 — La littérature d'idées
  ('03910000-0000-4000-8000-000000000141'::uuid, '03900000-0000-4000-8000-000000000014'::uuid,
   'Comment appelle-t-on les philosophes du XVIIIᵉ siècle défendant la raison et la tolérance ?', 'mcq',
   '["les Lumières", "les romantiques", "les surréalistes", "les classiques du Moyen Âge"]', 0,
   'Voltaire, Rousseau, Montesquieu et Diderot en sont les figures.', 1),
  ('03910000-0000-4000-8000-000000000142'::uuid, '03900000-0000-4000-8000-000000000014'::uuid,
   'Dans un texte argumentatif, la thèse est…', 'mcq',
   '["l''opinion défendue par l''auteur", "un simple exemple", "une description", "une rime"]', 0,
   'La thèse est le point de vue soutenu par l''auteur.', 2),
  ('03910000-0000-4000-8000-000000000143'::uuid, '03900000-0000-4000-8000-000000000014'::uuid,
   'L''ironie consiste à dire le contraire de ce que l''on pense pour critiquer.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est une arme fréquente de la satire.', 3),

  -- 15 — Dissertation et oral du bac
  ('03910000-0000-4000-8000-000000000151'::uuid, '03900000-0000-4000-8000-000000000015'::uuid,
   'Une dissertation littéraire s''organise autour d''une…', 'mcq',
   '["problématique", "recette", "liste de courses", "seule citation"]', 0,
   'On répond à une problématique par un raisonnement structuré.', 1),
  ('03910000-0000-4000-8000-000000000152'::uuid, '03900000-0000-4000-8000-000000000015'::uuid,
   'Un plan de dissertation comporte…', 'mcq',
   '["une introduction, un développement en parties et une conclusion", "seulement une conclusion", "des dessins", "une seule phrase"]', 0,
   'Introduction (problématique), parties argumentées, conclusion.', 2),
  ('03910000-0000-4000-8000-000000000153'::uuid, '03900000-0000-4000-8000-000000000015'::uuid,
   'À l''oral du bac de français, on présente une lecture et on répond à une question de grammaire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''épreuve comprend l''explication d''un texte, une question de grammaire et un entretien.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03900000-%' GROUP BY 1,2 ORDER BY 1,2;
