-- =============================================================================
-- Studuel — Migration 243 : L'ANGLAIS DE TERMINALE, RENDU À SON PROGRAMME
--
-- LE DÉFAUT. La page « Anglais » d'un élève de terminale s'ouvre aujourd'hui sur
-- quatre chapitres qui ne sont pas à son programme :
--   « Faire société : unité et pluralité », « Environnements en mutation »,
--   « Art et débats d'idées », « Innovations et responsabilité ».
-- Ces quatre intitulés viennent du tout premier jeu de données de l'app
-- (migration 008), qui les donnait pour « les axes du programme de LV ». Deux
-- d'entre eux appartiennent en réalité à un AUTRE enseignement (la spécialité
-- « Anglais, monde contemporain »), les deux autres à aucun texte. Sondé le
-- 19/08/2026 (node _ASSOCIE/sonde-chapitres.mjs Tle anglais) : ils occupent
-- toujours les positions 1 à 4, devant les 24 fiches de langue.
--
-- CE QUE L'ÉLÈVE DOIT VOIR. Le programme d'anglais de terminale tient en QUATRE
-- chapitres de langue, et rien d'autre :
--   1. Le groupe nominal      (3 fiches)
--   2. Le groupe verbal       (5 fiches)
--   3. Les temps              (5 fiches)
--   4. La phrase              (11 fiches)
-- Les 24 fiches correspondantes sont DÉJÀ en base (migration 226, exécutée) :
-- rien à réécrire, tout est déjà là. Il manquait deux choses — que les quatre
-- chapitres hors programme s'en aillent, et que les fiches portent le chapitre
-- qui les coiffe, pour que la page les range au lieu de les aligner à plat.
--
-- CE QUE FAIT CETTE MIGRATION.
--   1. les lignes de la file « À revoir » qui pointent leurs questions partent
--      (`review_items.item_id` n'a pas de clé étrangère) ;
--   2. les 4 quiz des chapitres hors programme sont supprimés (leurs questions
--      partent en cascade) ; sans ça ils survivraient à leur chapitre, orphelins
--      mais toujours tirables par le moteur de questions ;
--   3. les 4 chapitres hors programme sont supprimés (leçons en cascade) ;
--   4. les 24 fiches reculent aux positions 1 à 24 et reçoivent leur chapitre
--      de programme dans `chapters.theme`.
--
-- LA COLONNE `chapters.theme` (migration 234) est REPRISE ici en ADD COLUMN IF
-- NOT EXISTS : 234 n'a jamais été exécutée en production (sondé le 19/08/2026).
-- Sans elle, cette migration échouerait à mi-parcours — les quatre chapitres
-- déjà supprimés, les 24 fiches pas encore rangées. Les deux migrations sont
-- idempotentes : jouer 234 avant ou après ne change rien.
-- LE GRANT N'EST PAS DÉCORATIF : la migration 182 a révoqué le SELECT de table
-- sur `chapters` (pour cacher `mind_map`) et ne l'a rendu que colonne par
-- colonne. Une colonne ajoutée après elle n'hérite d'aucun droit — sans ce
-- GRANT, l'app lirait « permission denied » au lieu du chapitre.
--
-- Idempotent : les DELETE sont bornés aux quatre titres exacts (rejoués, ils ne
-- trouvent plus rien) et l'UPDATE est gardé par IS DISTINCT FROM.
--
-- PRÉREQUIS : 008 (chapters/lessons), 182 (grants par colonne), 226 (les 24
-- fiches de grammaire). Aucun ordre imposé vis-à-vis de 234.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 0. La colonne du chapitre de programme -------------------------------------
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- 1. La file « À revoir » d'abord --------------------------------------------
-- `review_items.item_id` n'a PAS de clé étrangère (il pointe soit une question,
-- soit une carte) : les lignes des questions supprimées survivraient à leur
-- question. Rien ne casse — le lecteur écarte déjà un contenu disparu — mais le
-- compteur « X à revoir » continuerait de compter des questions qui n'existent
-- plus. Même ménage que la migration 233 (SVT).
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.subject = 'Anglais'
   AND qz.grade_level = 'Tle'
   AND qz.chapter IN (
     'Faire société : unité et pluralité',
     'Environnements en mutation',
     'Art et débats d''idées',
     'Innovations et responsabilité'
   );

-- 2. Les quiz des quatre chapitres hors programme ----------------------------
-- `quizzes.lesson_id` est ON DELETE SET NULL : supprimer le chapitre laisserait
-- ces quatre quiz en base, sans leçon mais toujours rattachés à « Anglais / Tle »
-- par `subject` + `grade_level` — donc toujours servis. On les supprime d'abord ;
-- leurs questions partent en cascade (002).
DELETE FROM public.quizzes
 WHERE subject = 'Anglais'
   AND grade_level = 'Tle'
   AND chapter IN (
     'Faire société : unité et pluralité',
     'Environnements en mutation',
     'Art et débats d''idées',
     'Innovations et responsabilité'
   );

-- 3. Les quatre chapitres hors programme -------------------------------------
-- Leurs leçons (cours, fiches de révision, cartes mentales) partent en cascade :
-- les garder « au cas où » laisserait quatre portes vers du hors-programme.
-- Le DELETE est borné aux quatre titres exacts et au seul niveau Tle — les axes
-- de 2de et de 1re, eux, ne sont pas touchés.
DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = 'Tle'
   AND c.title IN (
     'Faire société : unité et pluralité',
     'Environnements en mutation',
     'Art et débats d''idées',
     'Innovations et responsabilité'
   );

-- 4. Les 24 fiches, rangées sous leurs quatre chapitres ----------------------
-- Positions ÉCRITES UNE À UNE et non décalées d'un « -4 » : un décalage relatif
-- rejoué décalerait une seconde fois.
UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
    ('Les déterminants', 1, 'Le groupe nominal'),
    ('Exprimer une quantité', 2, 'Le groupe nominal'),
    ('Les adjectifs qualificatifs', 3, 'Le groupe nominal'),
    ('Les verbes lexicaux et les auxiliaires', 4, 'Le groupe verbal'),
    ('Les auxiliaires modaux', 5, 'Le groupe verbal'),
    ('Les verbes à particule et les verbes prépositionnels', 6, 'Le groupe verbal'),
    ('Infinitif et gérondif', 7, 'Le groupe verbal'),
    ('Les adverbes', 8, 'Le groupe verbal'),
    ('Le présent simple et le présent en BE + -ING', 9, 'Les temps'),
    ('Le prétérit simple et le prétérit BE + -ING', 10, 'Les temps'),
    ('Le present perfect et le present perfect BE + -ING', 11, 'Les temps'),
    ('Le past perfect et le past perfect BE + -ING', 12, 'Les temps'),
    ('Exprimer le futur et le conditionnel', 13, 'Les temps'),
    ('Les questions', 14, 'La phrase'),
    ('La phrase exclamative', 15, 'La phrase'),
    ('Le comparatif et le superlatif', 16, 'La phrase'),
    ('Les subordonnées', 17, 'La phrase'),
    ('Exprimer la temporalité et la durée', 18, 'La phrase'),
    ('Exprimer la cause et le but', 19, 'La phrase'),
    ('Exprimer la condition, la concession et l’opposition', 20, 'La phrase'),
    ('Exprimer l’habitude', 21, 'La phrase'),
    ('Faire faire quelque chose à quelqu’un', 22, 'La phrase'),
    ('La voix passive', 23, 'La phrase'),
    ('Le discours indirect', 24, 'La phrase')
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);

-- 5. Filet de vérification ---------------------------------------------------
-- Le compte doit tomber sur 24 fiches, toutes rangées. S'il n'y tombe pas, la
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
   WHERE s.slug = 'anglais' AND c.level = 'Tle';
  IF total <> 24 OR ranges <> 24 THEN
    RAISE WARNING 'Anglais Tle : % chapitre(s) dont % range(s) — attendu 24 / 24.',
      total, ranges;
  ELSE
    RAISE NOTICE 'Anglais Tle : 24 fiches rangees sous 4 chapitres.';
  END IF;
END $$;
