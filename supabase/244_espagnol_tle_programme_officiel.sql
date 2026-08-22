-- =============================================================================
-- Studuel — Migration 244 : L'ESPAGNOL DE TERMINALE, RANGÉ SOUS SES 4 CHAPITRES
--
-- LA SUITE DE LA 243. L'anglais de Terminale a été rendu à son programme de
-- langue : 4 chapitres, leurs fiches dessous. L'espagnol suit, et le travail y
-- est bien plus court — la migration 231 avait déjà installé les 34 fiches du
-- programme, DANS L'ORDRE de ses quatre chapitres (sondé le 19/08/2026, node
-- _ASSOCIE/sonde-chapitres.mjs Tle espagnol : positions 1 à 34, exactement la
-- suite attendue). Il ne manquait que deux choses :
--   · le CHAPITRE qui coiffe chaque fiche, sans quoi la page aligne 35 lignes
--     à plat au lieu d'afficher les quatre sections du programme ;
--   · le départ de la fiche « Le monde hispanique aujourd’hui ».
--
-- CE QUE L'ÉLÈVE DOIT VOIR — les quatre chapitres du programme, et rien d'autre :
--   1. La phrase             (4 fiches)
--   2. Le groupe nominal     (12 fiches)
--   3. Le groupe verbal      (12 fiches)
--   4. Les temps             (6 fiches)
--
-- LA FICHE CULTURELLE S'EN VA. « Le monde hispanique aujourd’hui » vient de la
-- migration 220 ; la 231 l'avait CONSERVÉE en la renvoyant en position 90, au
-- motif que « les axes du bac ne sont pas de la grammaire ». Cette décision est
-- annulée pour la même raison qui a fait retirer les quatre faux axes d'anglais :
-- le dossier d'une matière doit montrer le programme que l'élève a sous les yeux
-- en cours, et rien à côté. Une fiche unique qui prétend tenir tous les axes
-- culturels d'une année n'est pas un chapitre du programme — c'est une cinquième
-- ligne qui rouvre le doute sur les quatre autres. Le ménage est borné au niveau
-- Tle : la 2de et la 1re gardent la leur, elles n'ont pas encore leur programme.
--
-- CE QUE FAIT CETTE MIGRATION.
--   1. les lignes de la file « À revoir » qui pointent les questions de la fiche
--      culturelle partent (`review_items.item_id` n'a pas de clé étrangère) ;
--   2. son quiz est supprimé (ses questions partent en cascade) ; sans ça il
--      survivrait à son chapitre, orphelin mais toujours tirable par le moteur
--      de questions (`quizzes.lesson_id` est ON DELETE SET NULL) ;
--   3. le chapitre est supprimé (sa leçon part en cascade) ;
--   4. les 34 fiches reçoivent leur chapitre de programme dans `chapters.theme`
--      et voient leurs positions RÉÉCRITES UNE À UNE (1 à 34) — elles y sont
--      déjà, l'UPDATE ne les touchera pas (`IS DISTINCT FROM`), mais les écrire
--      rend la migration vraie même si une position avait dérivé.
--
-- LA COLONNE `chapters.theme` (migration 234) est REPRISE en ADD COLUMN IF NOT
-- EXISTS, comme dans la 243 : 234 n'a jamais été exécutée. Le GRANT n'est pas
-- décoratif — la 182 a révoqué le SELECT de table sur `chapters` et ne l'a rendu
-- que colonne par colonne : une colonne ajoutée après elle n'hérite d'aucun
-- droit, et l'app lirait « permission denied » au lieu du chapitre.
--
-- Idempotent : les DELETE sont bornés au titre exact (rejoués, ils ne trouvent
-- plus rien) et l'UPDATE est gardé par IS DISTINCT FROM.
--
-- PRÉREQUIS : 008 (chapters/lessons), 021 (review_items), 182 (grants par
-- colonne), 231 (les 34 fiches). Aucun ordre imposé vis-à-vis de 234 ni de 243.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 0. La colonne du chapitre de programme -------------------------------------
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- 1. La file « À revoir » d'abord --------------------------------------------
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.subject = 'Espagnol'
   AND qz.grade_level = 'Tle'
   AND qz.chapter = 'Le monde hispanique aujourd’hui';

-- 2. Le quiz de la fiche culturelle ------------------------------------------
DELETE FROM public.quizzes
 WHERE subject = 'Espagnol'
   AND grade_level = 'Tle'
   AND chapter = 'Le monde hispanique aujourd’hui';

-- 3. La fiche culturelle -----------------------------------------------------
-- Sa leçon (« Repères pour les axes du programme ») part en cascade. Le DELETE
-- est borné au titre exact ET au niveau Tle : les fiches de 2de et de 1re, qui
-- portent le même titre, ne sont pas touchées.
DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = 'Tle'
   AND c.title = 'Le monde hispanique aujourd’hui';

-- 4. Les 34 fiches, rangées sous leurs quatre chapitres ----------------------
UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
    ('Les questions', 1, 'La phrase'),
    ('La négation', 2, 'La phrase'),
    ('La proposition subordonnée relative', 3, 'La phrase'),
    ('La proposition subordonnée complétive', 4, 'La phrase'),
    ('Genre et nombre', 5, 'Le groupe nominal'),
    ('Les articles', 6, 'Le groupe nominal'),
    ('Les démonstratifs', 7, 'Le groupe nominal'),
    ('Les adjectifs', 8, 'Le groupe nominal'),
    ('Les pronoms personnels sujets', 9, 'Le groupe nominal'),
    ('Les pronoms personnels compléments', 10, 'Le groupe nominal'),
    ('Les possessifs', 11, 'Le groupe nominal'),
    ('Les pronoms relatifs', 12, 'Le groupe nominal'),
    ('Les indéfinis', 13, 'Le groupe nominal'),
    ('La comparaison', 14, 'Le groupe nominal'),
    ('Le superlatif', 15, 'Le groupe nominal'),
    ('L’apocope', 16, 'Le groupe nominal'),
    ('L’auxiliaire haber', 17, 'Le groupe verbal'),
    ('Les verbes pronominaux', 18, 'Le groupe verbal'),
    ('Les verbes à diphtongue', 19, 'Le groupe verbal'),
    ('Les verbes à affaiblissement', 20, 'Le groupe verbal'),
    ('Ser et estar', 21, 'Le groupe verbal'),
    ('Le gérondif', 22, 'Le groupe verbal'),
    ('Le participe passé', 23, 'Le groupe verbal'),
    ('Les verbes du type « gustar »', 24, 'Le groupe verbal'),
    ('L’obligation', 25, 'Le groupe verbal'),
    ('L’habitude', 26, 'Le groupe verbal'),
    ('La probabilité', 27, 'Le groupe verbal'),
    ('Le conseil', 28, 'Le groupe verbal'),
    ('Le présent de l’indicatif', 29, 'Les temps'),
    ('Le subjonctif présent', 30, 'Les temps'),
    ('L’imparfait', 31, 'Les temps'),
    ('Le passé composé', 32, 'Les temps'),
    ('Le passé simple', 33, 'Les temps'),
    ('Le futur', 34, 'Les temps')
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);

-- 5. Filet de vérification ---------------------------------------------------
-- Le compte doit tomber sur 34 fiches, toutes rangées. S'il n'y tombe pas, la
-- migration le DIT au lieu de laisser passer une matière à moitié corrigée.
DO $$
DECLARE
  total INT;
  ranges INT;
BEGIN
  SELECT count(*), count(c.theme)
    INTO total, ranges
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug = 'espagnol' AND c.level = 'Tle';
  IF total <> 34 OR ranges <> 34 THEN
    RAISE WARNING 'Espagnol Tle : % chapitre(s) dont % range(s) — attendu 34 / 34.',
      total, ranges;
  ELSE
    RAISE NOTICE 'Espagnol Tle : 34 fiches rangees sous 4 chapitres.';
  END IF;
END $$;
