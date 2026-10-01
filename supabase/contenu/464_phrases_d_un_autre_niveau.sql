-- =============================================================================
-- Studuel — Migration 464 : PHRASES ÉCRITES POUR UN AUTRE NIVEAU (fiches jumelles)
--
-- 24 fragments, remplacés à l’endroit exact où ils sont.
-- Des cours et des sujets partagés entre le collège et le lycée parlaient du bac à un élève de 3e (ou de 5e) et du brevet à un élève de Terminale. Une formulation valable partout les remplace, à chaque niveau où elles se trouvent.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 464 --fichiers lot-k-niveaux --titre … --motif … (ceux de l’en-tête)
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text);
INSERT INTO _corrections VALUES
  (1, 'allemand', '1re', 'La phrase à la voix passive', 'cours', 'est un réflexe qui paie au bac.', 'est un réflexe qui paie à l’oral comme à l’écrit.'),
  (2, 'allemand', '2de', 'La phrase à la voix passive', 'cours', 'est un réflexe qui paie au bac.', 'est un réflexe qui paie à l’oral comme à l’écrit.'),
  (3, 'allemand', '3e', 'La phrase à la voix passive', 'cours', 'est un réflexe qui paie au bac.', 'est un réflexe qui paie à l’oral comme à l’écrit.'),
  (4, 'allemand', 'Tle', 'La phrase à la voix passive', 'cours', 'est un réflexe qui paie au bac.', 'est un réflexe qui paie à l’oral comme à l’écrit.'),
  (5, 'espagnol', '1re', 'La proposition subordonnée complétive', 'cours', 'La bascule la plus rentable au bac :', 'La bascule la plus rentable à l’écrit :'),
  (6, 'espagnol', '2de', 'La proposition subordonnée complétive', 'cours', 'La bascule la plus rentable au bac :', 'La bascule la plus rentable à l’écrit :'),
  (7, 'espagnol', '3e', 'La proposition subordonnée complétive', 'cours', 'La bascule la plus rentable au bac :', 'La bascule la plus rentable à l’écrit :'),
  (8, 'espagnol', '4e', 'La proposition subordonnée complétive', 'cours', 'La bascule la plus rentable au bac :', 'La bascule la plus rentable à l’écrit :'),
  (9, 'espagnol', '5e', 'La proposition subordonnée complétive', 'cours', 'La bascule la plus rentable au bac :', 'La bascule la plus rentable à l’écrit :'),
  (10, 'espagnol', 'Tle', 'La proposition subordonnée complétive', 'cours', 'La bascule la plus rentable au bac :', 'La bascule la plus rentable à l’écrit :'),
  (11, 'espagnol', '1re', 'Le conseil', 'cours', '— et le bac valorise celui qui sait en changer de barreau.', '— et l’on valorise celui qui sait en changer de barreau.'),
  (12, 'espagnol', '2de', 'Le conseil', 'cours', '— et le bac valorise celui qui sait en changer de barreau.', '— et l’on valorise celui qui sait en changer de barreau.'),
  (13, 'espagnol', '3e', 'Le conseil', 'cours', '— et le bac valorise celui qui sait en changer de barreau.', '— et l’on valorise celui qui sait en changer de barreau.'),
  (14, 'espagnol', '4e', 'Le conseil', 'cours', '— et le bac valorise celui qui sait en changer de barreau.', '— et l’on valorise celui qui sait en changer de barreau.'),
  (15, 'espagnol', '5e', 'Le conseil', 'cours', '— et le bac valorise celui qui sait en changer de barreau.', '— et l’on valorise celui qui sait en changer de barreau.'),
  (16, 'espagnol', 'Tle', 'Le conseil', 'cours', '— et le bac valorise celui qui sait en changer de barreau.', '— et l’on valorise celui qui sait en changer de barreau.'),
  (17, 'anglais', '1re', 'Les verbes à particule et les verbes prépositionnels', 'controle', 'Les verbes à particule du brevet', 'Les verbes à particule à connaître'),
  (18, 'anglais', '2de', 'Les verbes à particule et les verbes prépositionnels', 'controle', 'Les verbes à particule du brevet', 'Les verbes à particule à connaître'),
  (19, 'anglais', '3e', 'Les verbes à particule et les verbes prépositionnels', 'controle', 'Les verbes à particule du brevet', 'Les verbes à particule à connaître'),
  (20, 'anglais', 'Tle', 'Les verbes à particule et les verbes prépositionnels', 'controle', 'Les verbes à particule du brevet', 'Les verbes à particule à connaître'),
  (21, 'espagnol', '1re', 'Le superlatif', 'controle', 'Résultats du cross du collège, classe de 3e B.', 'Résultats du cross de l’établissement.'),
  (22, 'espagnol', '2de', 'Le superlatif', 'controle', 'Résultats du cross du collège, classe de 3e B.', 'Résultats du cross de l’établissement.'),
  (23, 'espagnol', '3e', 'Le superlatif', 'controle', 'Résultats du cross du collège, classe de 3e B.', 'Résultats du cross de l’établissement.'),
  (24, 'espagnol', 'Tle', 'Le superlatif', 'controle', 'Résultats du cross du collège, classe de 3e B.', 'Résultats du cross de l’établissement.');

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
   ELSE NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id
       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug
        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question
                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0) END;
  RAISE NOTICE 'Migration 464 : % correction(s) sur 24 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 464 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
