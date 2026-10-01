-- =============================================================================
-- Studuel — Migration 425 : ERREURS DE COURS ET DE QUIZ CORRIGÉES
--
-- 17 fragments faux ou approximatifs, relevés par les relecteurs des
-- contrôles blancs (28-29/09/2026), remplacés à l’endroit exact où ils sont.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 425 --fichiers lot-g-erreurs
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text);
INSERT INTO _corrections VALUES
  (1, 'francais', '1re', 'Œdipe roi, Sophocle', 'cours', '— et part **en exil** |', '— et **réclame l’exil** ; Créon s’en remet à l’oracle |'),
  (2, 'francais', '1re', 'Œdipe roi, Sophocle', 'options', 'Jocaste se pend, Œdipe se crève les yeux et part en exil', 'Jocaste se pend, Œdipe se crève les yeux et réclame l’exil'),
  (3, 'francais', '1re', 'Micromégas, Voltaire', 'cours', 'il vit **plusieurs centaines de siècles**', 'il vit **des millions d’années**'),
  (4, 'francais', '1re', 'Micromégas, Voltaire', 'cours', 'pour **quelques arpents de boue**', 'pour **quelques tas de boue** grands comme un talon'),
  (5, 'francais', '1re', 'Nana, Émile Zola', 'cours', '**meurt seule** dans', '**meurt** dans'),
  (6, 'francais', '5e', 'Les voyages et la séduction de l’ailleurs dans la poésie', 'cours', '**Rimbaud**, lui, part vraiment — à dix-sept ans — et n’écrira plus.', '**Rimbaud**, lui, part vraiment : il fugue dès quinze ans, cesse d’écrire vers vingt ans et finit par partir jusqu’en Afrique.'),
  (7, 'technologie', '6e', 'Fabriquer un objet', 'cours', '!> Lunettes, gants, cheveux attachés,', '!> Lunettes, cheveux attachés, **jamais de gants près d’une pièce qui tourne** (ils peuvent être happés),'),
  (8, 'physique-chimie', '5e', 'Les mouvements', 'cours', 'C''est le seul cas où l''objet ne subit aucune force résultante.', 'Avec l''immobilité, c''est le seul cas où les forces qui agissent sur l''objet se compensent.'),
  (9, 'anglais', '3e', 'Exprimer le but', 'cours', '| Le but **négatif** — la seule forme possible |', '| Le but **négatif** — la forme la plus courante (*in order not to* existe aussi) |'),
  (10, 'anglais', '4e', 'Exprimer le but', 'cours', '| Le but **négatif** — la seule forme possible |', '| Le but **négatif** — la forme la plus courante (*in order not to* existe aussi) |'),
  (11, 'anglais', '5e', 'Exprimer le but', 'cours', '| Le but **négatif** — la seule forme possible |', '| Le but **négatif** — la forme la plus courante (*in order not to* existe aussi) |'),
  (12, 'anglais', '3e', 'Exprimer une quantité', 'cours', '| **a few** | Dénombrable | Quelques, **assez** |
| **a little** | Indénombrable | Un peu, assez |', '| **a few** | Dénombrable | **Quelques** : un peu, et c’est positif |
| **a little** | Indénombrable | **Un peu** : et c’est positif |'),
  (13, 'anglais', '4e', 'Exprimer une quantité', 'cours', '| **a few** | Dénombrable | Quelques, **assez** |
| **a little** | Indénombrable | Un peu, assez |', '| **a few** | Dénombrable | **Quelques** : un peu, et c’est positif |
| **a little** | Indénombrable | **Un peu** : et c’est positif |'),
  (14, 'anglais', '5e', 'Exprimer une quantité', 'cours', '| **a few** | Dénombrable | Quelques, **assez** |
| **a little** | Indénombrable | Un peu, assez |', '| **a few** | Dénombrable | **Quelques** : un peu, et c’est positif |
| **a little** | Indénombrable | **Un peu** : et c’est positif |'),
  (15, 'anglais', '3e', 'Les noms', 'cours', '| **-s, -sh, -ch, -x, -o** | **-es** | boxes, watches, potatoes |', '| **-s, -sh, -ch, -x**, souvent **-o** | **-es** | boxes, watches, potatoes (mais photos, pianos) |'),
  (16, 'anglais', '4e', 'Les noms', 'cours', '| **-s, -sh, -ch, -x, -o** | **-es** | boxes, watches, potatoes |', '| **-s, -sh, -ch, -x**, souvent **-o** | **-es** | boxes, watches, potatoes (mais photos, pianos) |'),
  (17, 'anglais', '5e', 'Les noms', 'cours', '| **-s, -sh, -ch, -x, -o** | **-es** | boxes, watches, potatoes |', '| **-s, -sh, -ch, -x**, souvent **-o** | **-es** | boxes, watches, potatoes (mais photos, pianos) |');

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
  FOR k IN SELECT * FROM _corrections WHERE champ <> 'cours' ORDER BY n LOOP
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

-- Contrôle d’arrivée : chaque correction doit voir son texte juste en place.
DO $$
DECLARE n_absentes int;
BEGIN
  SELECT count(*) INTO n_absentes FROM _corrections k
   WHERE NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id
       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug
        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question
                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0);
  RAISE NOTICE 'Migration 425 : % correction(s) sur 17 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 425 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
