-- =============================================================================
-- Studuel — Migration 456 : COURS, QUIZ ET CONTRÔLES REMIS À JOUR (3e → Tle)
--
-- 48 fragments, remplacés à l’endroit exact où ils sont.
-- Faits périmés ou inexacts relevés le 01/10/2026 : ASEAN à onze, zone euro à 21, 44 PMA, Grand oral de la session 2027 (deux temps, coefficient 8), ordonnance du 21 avril 1944 (CFLN), Objectifs de développement durable, web versé au domaine public en 1993, majorité à 18 ans, réchauffement de l’Arctique.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 456 --fichiers lot-h-actualite --titre … --motif … (ceux de l’en-tête)
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text, cible text);
INSERT INTO _corrections VALUES
  (1, 'hggsp', 'Tle', 'Le cyberespace : conflictualité et coopération entre les acteurs', 'cours', '| **1989-1991** | Le **web**, inventé au CERN par Tim Berners-Lee et **donné au domaine public** |', '| **1989-1993** | Le **web**, inventé au CERN par Tim Berners-Lee (1989) et **versé au domaine public en 1993** |', NULL),
  (2, 'hggsp', 'Tle', 'Le cyberespace : conflictualité et coopération entre les acteurs', 'explication', 'Il choisit de le placer dans le domaine public, ce qui accélère sa diffusion.', 'Le CERN verse ensuite le web dans le domaine public, en 1993, ce qui accélère sa diffusion.', NULL),
  (3, 'hggsp', 'Tle', 'Le cyberespace : conflictualité et coopération entre les acteurs', 'controle', 'web au CERN 1989-1991 par Tim Berners-Lee, domaine public', 'web au CERN 1989-1991 par Tim Berners-Lee, versé au domaine public en 1993', NULL),
  (4, 'hggsp', 'Tle', 'Le cyberespace : conflictualité et coopération entre les acteurs', 'controle', '**donné au domaine public**', '**versé au domaine public en 1993**', NULL),
  (5, 'histoire-geo', 'Tle', 'La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions', 'cours', '| Nombre d’États membres | **10** |', '| Nombre d’États membres | **11**, depuis l’entrée du Timor oriental en 2025 |', NULL),
  (6, 'histoire-geo', 'Tle', 'La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions', 'explication', 'Elle réunit aujourd’hui 10 États et plus de 650 millions d’habitants.', 'Elle réunit aujourd’hui 11 États et plus de 650 millions d’habitants.', NULL),
  (7, 'histoire-geo', 'Tle', 'La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions', 'explication', 'l’ASEAN réunit dix États d’Asie du Sud-Est, sur les grandes routes maritimes.', 'l’ASEAN réunit onze États d’Asie du Sud-Est depuis l’entrée du Timor oriental en 2025, sur les grandes routes maritimes.', NULL),
  (8, 'histoire-geo', 'Tle', 'La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions', 'reponse', '10', '11', 'Combien d’États compte l’ASEAN ?'),
  (9, 'histoire-geo', 'Tle', 'La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions', 'controle', 'ASEAN : 1967, 10 membres', 'ASEAN : 1967, 11 membres', NULL),
  (10, 'histoire-geo', 'Tle', 'La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions', 'controle', 'ASEAN (1967, 10 membres', 'ASEAN (1967, 11 membres', NULL),
  (11, 'histoire-geo', 'Tle', 'La France défaite et occupée', 'cours', 'Le **GPRF** rétablit la République, épure, nationalise — et accorde le **droit de vote aux femmes** par l’ordonnance d’avril 1944.', 'Le **GPRF** rétablit la République, épure, nationalise. Le **droit de vote des femmes** date de l’ordonnance du 21 avril 1944, prise à Alger par le Comité français de libération nationale, quelques semaines avant la naissance du GPRF.', NULL),
  (12, 'histoire-geo', 'Tle', 'La France défaite et occupée', 'question', 'Quelle avancée politique majeure le GPRF accorde-t-il en 1944 ?', 'Quelle avancée politique majeure l’ordonnance du 21 avril 1944 apporte-t-elle ?', NULL),
  (13, 'histoire-geo', 'Tle', 'La France défaite et occupée', 'controle', 'épure, nationalise et accorde le **droit de vote aux femmes** (ordonnance d''avril 1944).', 'épure et nationalise ; le **droit de vote des femmes** vient de l''ordonnance du 21 avril 1944, prise à Alger par le CFLN.', NULL),
  (14, 'histoire-geo', '3e', '1944-1947 : refonder la République, redéfinir la démocratie', 'controle', 'prise par le gouvernement provisoire, accorde', 'prise à Alger par le Comité français de libération nationale, accorde', NULL),
  (15, 'histoire-geo', 'Tle', 'Les efforts de coopération internationale depuis 1990', 'cours', '| 2015 | 17 cibles à l’horizon 2030, sans sanction |', '| 2015 | 17 objectifs (169 cibles) à l’horizon 2030, sans sanction |', NULL),
  (16, 'histoire-geo', 'Tle', 'Les efforts de coopération internationale depuis 1990', 'question', 'Combien de cibles comptent les Objectifs de développement durable fixés en 2015 ?', 'Combien d’Objectifs de développement durable l’ONU fixe-t-elle en 2015 ?', NULL),
  (17, 'histoire-geo', 'Tle', 'Les efforts de coopération internationale depuis 1990', 'controle', '17 cibles pour 2030', '17 objectifs pour 2030', NULL),
  (18, 'histoire-geo', 'Tle', 'Les mutations sociales et culturelles de la société française', 'cours', '| Un million d’électeurs de plus |', '| Environ 2,4 millions d’électeurs de plus |', NULL),
  (19, 'histoire-geo', 'Tle', 'Des territoires inégalement intégrés dans la mondialisation', 'cours', 'La plupart des **46 PMA**', 'La plupart des **44 PMA**', NULL),
  (20, 'histoire-geo', 'Tle', 'Des territoires inégalement intégrés dans la mondialisation', 'explication', 'Ce statut ONU ouvre des aides et des tarifs préférentiels.', 'Ils sont 44 depuis 2024 ; ce statut de l’ONU ouvre des aides et des tarifs préférentiels.', NULL),
  (21, 'histoire-geo', 'Tle', 'Des territoires inégalement intégrés dans la mondialisation', 'reponse', '46', '44', 'Combien y a-t-il de pays les moins avancés (PMA) ?'),
  (22, 'histoire-geo', 'Tle', 'Des territoires inégalement intégrés dans la mondialisation', 'controle', '**46 PMA**', '**44 PMA**', NULL),
  (23, 'histoire-geo', '3e', 'L’Union européenne : un territoire en construction', 'cours', 'la monnaie de 20 États', 'la monnaie de 21 États', NULL),
  (24, 'histoire-geo', '3e', 'L’Union européenne : un territoire en construction', 'explication', 'la monnaie de 20 des 27 États membres', 'la monnaie de 21 des 27 États membres', NULL),
  (25, 'histoire-geo', '3e', 'L’Union européenne : un territoire en construction', 'explication', 'la zone euro compte 20 États.', 'la zone euro compte 21 États depuis l’entrée de la Bulgarie en 2026.', NULL),
  (26, 'histoire-geo', '3e', 'L’Union européenne : un territoire en construction', 'reponse', '20', '21', 'Combien d’États utilisent aujourd’hui l’euro ?'),
  (27, 'histoire-geo', '3e', 'L’Union européenne : un territoire en construction', 'controle', 'la monnaie de 20 États', 'la monnaie de 21 États', NULL),
  (28, 'histoire-geo', '2de', 'Des trajectoires démographiques différenciées : les défis du nombre et du vieillissement', 'cours', 'La population mondiale approche 8 milliards d''habitants', 'La population mondiale dépasse 8 milliards d''habitants', NULL),
  (29, 'histoire-geo', '2de', 'Des trajectoires démographiques différenciées : les défis du nombre et du vieillissement', 'controle', 'La population mondiale approche **8 milliards**.', 'La population mondiale dépasse **8 milliards**.', NULL),
  (30, 'svt', '3e', 'L’évolution du climat, les risques climatiques et météorologiques', 'cours', '| Le réchauffement polaire, deux fois plus rapide |', '| Le réchauffement de l''Arctique, trois à quatre fois plus rapide que la moyenne mondiale |', NULL),
  (31, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'cours', '| Temps 1 | **5 minutes** de présentation, debout, sans notes |
| Temps 2 | **10 minutes** d’échange avec le jury |
| Temps 3 | **5 minutes** sur ton projet d’orientation |
| Coefficient | **10** dans la voie générale |', '| Temps 1 | **10 minutes** de présentation, debout : tu expliques ton choix, tu développes la question et tu y réponds |
| Temps 2 | **10 minutes** d’échange avec le jury, qui peut t’interroger sur tout le programme de tes spécialités |
| Coefficient | **8** dans la voie générale, à partir de la session 2027 |', NULL),
  (32, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'cours', 'permet une réponse argumentée en cinq minutes.', 'permet une réponse argumentée en dix minutes.', NULL),
  (33, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'explication', 'Elle se fait debout et sans notes.', 'Elle se fait debout ; tu peux t’aider du support préparé pendant les vingt minutes de préparation.', NULL),
  (34, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'explication', 'Puis viennent 5 minutes sur le projet d’orientation.', 'Présentation et échange durent dix minutes chacun : vingt minutes d’épreuve en tout.', NULL),
  (35, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'explication', 'Elle s’appuie sur le programme et se traite en cinq minutes.', 'Elle s’appuie sur le programme et se traite en dix minutes.', NULL),
  (36, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'question', 'Quel est le coefficient du Grand oral dans la voie générale ?', 'Quel est le coefficient du Grand oral dans la voie générale à la session 2027 ?', NULL),
  (37, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'explication', 'C’est l’une des épreuves les plus lourdes du baccalauréat.', 'Il valait 10 jusqu’en 2026 : l’épreuve anticipée de mathématiques, passée en première, lui a pris deux points.', NULL),
  (38, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'question', 'Sur quoi portent les 5 dernières minutes du Grand oral ?', 'Quelle partie de l’ancien Grand oral n’existe plus ?', NULL),
  (39, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'explication', 'Tu y expliques comment ta question s’inscrit dans ton parcours.', 'L’épreuve tient désormais en deux temps de dix minutes : la présentation, puis l’échange avec le jury.', NULL),
  (40, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', '10', '8', 'Quel est le coefficient du Grand oral dans la voie générale à la session 2027 ?'),
  (41, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', '5 minutes', 'Dix minutes', 'Combien de temps dure la présentation initiale du Grand oral ?'),
  (42, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', '10 minutes', 'Cinq minutes', 'Combien de temps dure la présentation initiale du Grand oral ?'),
  (43, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', '20 minutes', 'Vingt minutes', 'Combien de temps dure la présentation initiale du Grand oral ?'),
  (44, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', '2 minutes', 'Deux minutes', 'Combien de temps dure la présentation initiale du Grand oral ?'),
  (45, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', 'Le projet d’orientation', 'Les cinq minutes sur le projet d’orientation', 'Quelle partie de l’ancien Grand oral n’existe plus ?'),
  (46, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', 'Une question de physique', 'La présentation de la question', 'Quelle partie de l’ancien Grand oral n’existe plus ?'),
  (47, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', 'La correction de l’écrit', 'L’échange avec le jury', 'Quelle partie de l’ancien Grand oral n’existe plus ?'),
  (48, 'si', 'Tle', 'Le projet de Terminale et le Grand oral', 'reponse', 'Le règlement du lycée', 'Les vingt minutes de préparation', 'Quelle partie de l’ancien Grand oral n’existe plus ?');

-- Les cours, une correction à la fois (plusieurs peuvent viser la même leçon).
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'cours' ORDER BY n LOOP
    UPDATE public.lessons l SET content = replace(l.content, k.ancien, k.nouveau)
      FROM public.subjects s
      JOIN public.chapters c ON c.subject_id = s.id
     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND l.chapter_id = c.id AND strpos(l.content, k.ancien) > 0;
  END LOOP;
END $$;

-- Les questions de quiz (énoncé, explication, options), une correction à la fois.
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ IN ('question', 'explication', 'options') ORDER BY n LOOP
    UPDATE public.quiz_questions x
       SET question    = CASE WHEN k.champ = 'question'    THEN replace(x.question, k.ancien, k.nouveau) ELSE x.question END,
           explanation = CASE WHEN k.champ = 'explication' THEN replace(x.explanation, k.ancien, k.nouveau) ELSE x.explanation END,
           options     = CASE WHEN k.champ = 'options'     THEN replace(x.options::text, k.ancien, k.nouveau)::jsonb ELSE x.options END
      FROM public.quizzes qz
      JOIN public.lessons l ON l.id = qz.lesson_id
      JOIN public.chapters c ON c.id = l.chapter_id
      JOIN public.subjects s ON s.id = c.subject_id
     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND strpos(CASE k.champ WHEN 'question' THEN x.question WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.ancien) > 0;
  END LOOP;
END $$;

-- Les sujets de contrôle blanc du catalogue (énoncé, corrigé, barème).
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'controle' ORDER BY n LOOP
    UPDATE public.chapter_exercices e SET contenu = replace(e.contenu::text, k.ancien, k.nouveau)::jsonb
      FROM public.subjects s
      JOIN public.chapters c ON c.subject_id = s.id
     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND e.chapter_id = c.id AND e.origine = 'catalogue' AND strpos(e.contenu::text, k.ancien) > 0;
  END LOOP;
END $$;

-- Les réponses : une option entière d’une question nommée (après les énoncés).
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'reponse' ORDER BY n LOOP
    UPDATE public.quiz_questions x
       SET options = (SELECT jsonb_agg(CASE WHEN o.v = k.ancien THEN to_jsonb(k.nouveau) ELSE to_jsonb(o.v) END ORDER BY o.i)
                        FROM jsonb_array_elements_text(x.options) WITH ORDINALITY AS o(v, i))
      FROM public.quizzes qz
      JOIN public.lessons l ON l.id = qz.lesson_id
      JOIN public.chapters c ON c.id = l.chapter_id
      JOIN public.subjects s ON s.id = c.subject_id
     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND x.question = k.cible AND x.options ? k.ancien;
  END LOOP;
END $$;

-- Contrôle d’arrivée : chaque correction doit voir son texte juste en place.
DO $$
DECLARE n_absentes int;
BEGIN
  SELECT count(*) INTO n_absentes FROM _corrections k
   WHERE CASE k.champ WHEN 'controle' THEN NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.chapter_exercices e ON e.chapter_id = c.id AND e.origine = 'catalogue'
      WHERE s.slug = k.slug AND strpos(e.contenu::text, k.nouveau) > 0)
   WHEN 'reponse' THEN NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       JOIN public.quizzes qz ON qz.lesson_id = l.id
       JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug AND x.question = k.cible AND x.options ? k.nouveau)
   ELSE NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id
       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug
        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question
                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0) END;
  RAISE NOTICE 'Migration 456 : % correction(s) sur 48 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 456 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
