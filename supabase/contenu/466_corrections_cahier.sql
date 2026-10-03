-- =============================================================================
-- Studuel — Migration 466 : ERREURS DE COURS RELEVÉES PAR LE CAHIER D’EXERCICES
--
-- 22 fragments, remplacés à l’endroit exact où ils sont.
-- Relevées par les rédacteurs du cahier (02/10/2026), vérifiées à une source : chiffres, dates, citations.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 466 --fichiers lot-l-cahier --titre … --motif … (ceux de l’en-tête)
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text);
INSERT INTO _corrections VALUES
  (1, 'enseignement-scientifique', '1re', 'Un niveau d’organisation : les éléments chimiques', 'cours', '**O, C, H, N** font plus de **99 %** de la masse', '**O, C, H, N** font environ **96 %** de la masse'),
  (2, 'enseignement-scientifique', '1re', 'Un niveau d’organisation : les éléments chimiques', 'question', 'Quels quatre éléments forment plus de 99 % de la masse du corps humain ?', 'Quels quatre éléments forment environ 96 % de la masse du corps humain ?'),
  (3, 'enseignement-scientifique', '1re', 'Un niveau d’organisation : les éléments chimiques', 'controle', 'oxygène, carbone, hydrogène, azote : plus de 99 % de la masse', 'oxygène, carbone, hydrogène, azote : environ 96 % de la masse'),
  (4, 'physique-chimie-sante', '1re', 'Les molécules d’intérêt biologique', 'cours', 'Acide α-linoléique', 'Acide α-linolénique'),
  (5, 'physique-chimie-sante', '1re', 'Les molécules d’intérêt biologique', 'controle', 'α-linoléique', 'α-linolénique'),
  (6, 'histoire-geo', '2de', 'L’élargissement du monde au XVe siècle', 'cours', '| **1487** | **Bartolomeu Dias** |', '| **1488** | **Bartolomeu Dias** |'),
  (7, 'histoire-geo', '2de', 'L’élargissement du monde au XVe siècle', 'question', 'Qui franchit le cap de Bonne-Espérance en 1487 ?', 'Qui franchit le cap de Bonne-Espérance en 1488 ?'),
  (8, 'histoire-geo', '2de', 'L’élargissement du monde au XVe siècle', 'controle', '**Dias (1487)**', '**Dias (1488)**'),
  (9, 'histoire-geo', '2de', 'L’élargissement du monde au XVe siècle', 'controle', 'passe le cap de Bonne-Espérance (**1487**)', 'passe le cap de Bonne-Espérance (**1488**)'),
  (10, 'histoire-geo', '5e', 'Empire et civilisation arabo-musulmans', 'cours', '| Les **Abbassides** | **Bagdad** | 750 |', '| Les **Abbassides** | **Bagdad** | 762 |'),
  (11, 'histoire-geo', '5e', 'Empire et civilisation arabo-musulmans', 'question', 'Quelle dynastie installe sa capitale à Bagdad en 750 ?', 'Quelle dynastie fonde sa capitale, Bagdad, en 762 ?'),
  (12, 'histoire-geo', '5e', 'Empire et civilisation arabo-musulmans', 'controle', 'ont pour capitale **Bagdad**, depuis **750**.', 'ont pour capitale **Bagdad**, fondée en **762**.'),
  (13, 'francais', '4e', 'Un roman naturaliste : L’Assommoir de Zola', 'cours', 'le romancier est « un observateur et un expérimentateur »', 'le romancier est « fait d’un observateur et d’un expérimentateur »'),
  (14, 'francais', '4e', 'Un roman naturaliste : L’Assommoir de Zola', 'controle', 'le romancier est « un observateur et un expérimentateur »', 'le romancier est « fait d’un observateur et d’un expérimentateur »'),
  (15, 'francais', '6e', 'Créer une autre manière de s’exprimer grâce à la poésie', 'cours', 'qui sifflent sur nos têtes', 'qui sifflent sur vos têtes'),
  (16, 'francais', '3e', 'Le poète métamorphose le monde', 'cours', 'qui sifflent sur nos têtes', 'qui sifflent sur vos têtes'),
  (17, 'francais', '6e', 'Création et recréation du monde dans les différentes religions polythéistes', 'cours', 'Le même motif traverse des cultures qui ne se connaissaient pas.', 'Le même motif passe d’une culture à l’autre : les récits voyagent et se transforment.'),
  (18, 'francais', '1re', 'La Princesse de Montpensier, Madame de La Fayette', 'cours', '« aurait sans doute été la plus heureuse,', '« en aurait été sans doute la plus heureuse,'),
  (19, 'francais', '1re', 'La Princesse de Montpensier, Madame de La Fayette', 'controle', '« aurait sans doute été la plus heureuse,', '« en aurait été sans doute la plus heureuse,'),
  (20, 'francais', '1re', 'Zadig ou la Destinée, Voltaire', 'cours', '**démolira douze ans plus tard**', '**démolira onze ans plus tard**'),
  (21, 'francais', '1re', 'Zadig ou la Destinée, Voltaire', 'controle', '**démolira douze ans plus tard**', '**démolira onze ans plus tard**'),
  (22, 'francais', '1re', 'Sido, suivi de Les Vrilles de la vigne', 'cours', '**deux textes que quinze ans séparent**', '**deux textes que vingt-deux ans séparent**');

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
  RAISE NOTICE 'Migration 466 : % correction(s) sur 22 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 466 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
