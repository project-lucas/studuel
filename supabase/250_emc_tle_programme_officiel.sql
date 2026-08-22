-- =============================================================================
-- Studuel — Migration 250 : L'EMC DE TERMINALE, RANGÉ SOUS SES 2 CHAPITRES
--
-- LA SUITE DES 243 → 249. Le dossier d'une matière ne montre que son programme,
-- rangé sous les chapitres que l'élève a sur le cahier de son professeur.
-- L'EMC de Terminale y vient à son tour, et le travail y est court : la
-- migration 230 a DÉJÀ installé les 12 fiches du programme, DANS L'ORDRE de ses
-- deux chapitres (sondé le 20/08/2026, node _ASSOCIE/sonde-chapitres.mjs Tle
-- emc : positions 4 à 15, exactement la suite attendue). Il manquait deux
-- choses :
--   · le CHAPITRE qui coiffe chaque fiche, sans quoi la page aligne 15 lignes
--     à plat au lieu d'afficher les deux sections du programme ;
--   · le départ des 3 fiches du socle lycée, qui occupent les positions 1 à 3.
--
-- CE QUE L'ÉLÈVE DOIT VOIR — les deux chapitres du programme, et rien d'autre :
--   1. Fondements et expériences de la démocratie   (7 fiches)
--   2. Repenser et faire vivre la démocratie        (5 fiches)
--
-- LES TROIS FICHES DU SOCLE S'EN VONT, AU SEUL NIVEAU Tle. « La liberté
-- d'expression et ses limites », « Démocratie et État de droit » et « Enjeux du
-- numérique et de l'information » viennent de la migration 216, qui les pose
-- pour la 2de, la 1re ET la Tle. La 230 les avait CONSERVÉES et démarrait son
-- bloc à la position 4, au motif qu'un rejeu de la 216 les recréerait de toute
-- façon. Cette décision est annulée pour la raison qui a fait retirer les quatre
-- faux axes d'anglais (243) et la fiche culturelle d'espagnol (244) : trois
-- lignes hors programme en TÊTE de liste rouvrent le doute sur les douze autres.
-- La 2de et la 1re les gardent : elles n'ont pas encore leur programme propre,
-- et rien ne vient les remplacer à ces niveaux.
--
-- ⚠️ LA 216 EST REJOUABLE : la recoller un jour ferait revenir les trois fiches
-- au niveau Tle (sans leur position, qu'un INSERT ne met jamais à jour). C'est
-- le prix de l'idempotence — 216 ne peut pas être modifiée.
--
-- CE QUE FAIT CETTE MIGRATION.
--   1. les lignes de la file « À revoir » qui pointent les questions des trois
--      fiches partent (`review_items.item_id` n'a pas de clé étrangère) ;
--   2. leurs quiz sont supprimés (questions en cascade) ; sans ça ils
--      survivraient à leur chapitre, orphelins mais toujours tirables par le
--      moteur de questions (`quizzes.lesson_id` est ON DELETE SET NULL) ;
--   3. les trois chapitres sont supprimés (leçons en cascade) ;
--   4. les 12 fiches reculent aux positions 1 à 12 et reçoivent leur chapitre
--      de programme dans `chapters.theme`.
--
-- LA COLONNE `chapters.theme` (migration 234) est REPRISE en ADD COLUMN IF NOT
-- EXISTS, comme dans les 243 à 249 : 234 n'a jamais été exécutée. Le GRANT n'est
-- pas décoratif — la 182 a révoqué le SELECT de table sur `chapters` et ne l'a
-- rendu que colonne par colonne : une colonne ajoutée après elle n'hérite
-- d'aucun droit, et l'app lirait « permission denied » au lieu du chapitre.
--
-- ⚠️ LES TITRES SONT ÉCRITS AVEC L'APOSTROPHE TYPOGRAPHIQUE (U+2019), celle que
-- portent les migrations 216 et 230, donc la base. Écrits avec l'apostrophe
-- droite, les DELETE et l'UPDATE ne trouveraient rien — et la migration se
-- terminerait « avec succès » sans avoir rien fait.
--
-- Idempotent : les DELETE sont bornés aux trois titres exacts (rejoués, ils ne
-- trouvent plus rien) et l'UPDATE est gardé par IS DISTINCT FROM.
--
-- PRÉREQUIS : 008 (chapters/lessons), 021 (review_items), 182 (grants par
-- colonne), 230 (les 12 fiches). Aucun ordre imposé vis-à-vis de 234.
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
-- plus.
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = 'Tle'
   AND c.title IN ('La liberté d’expression et ses limites',
                   'Démocratie et État de droit',
                   'Enjeux du numérique et de l’information');

-- 2. Les quiz des trois fiches du socle --------------------------------------
DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = 'Tle'
   AND c.title IN ('La liberté d’expression et ses limites',
                   'Démocratie et État de droit',
                   'Enjeux du numérique et de l’information');

-- 3. Les trois fiches du socle, en Terminale seulement -----------------------
-- Leurs leçons partent en cascade. Le DELETE est borné aux trois titres exacts
-- ET au niveau Tle : les fiches de 2de et de 1re, qui portent les mêmes titres,
-- ne sont pas touchées.
DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = 'Tle'
   AND c.title IN ('La liberté d’expression et ses limites',
                   'Démocratie et État de droit',
                   'Enjeux du numérique et de l’information');

-- 4. Les 12 fiches, rangées sous leurs deux chapitres ------------------------
-- Positions ÉCRITES UNE À UNE et non décalées d'un « -3 » : un décalage relatif
-- rejoué décalerait une seconde fois.
UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
    ('Histoire de la démocratie', 1, 'Fondements et expériences de la démocratie'),
    ('La démocratie et le peuple souverain', 2, 'Fondements et expériences de la démocratie'),
    ('Les élections, outils de la démocratie', 3, 'Fondements et expériences de la démocratie'),
    ('Laïcité et démocratie', 4, 'Fondements et expériences de la démocratie'),
    ('Contestation de la démocratie et transformations des régimes politiques', 5, 'Fondements et expériences de la démocratie'),
    ('La protection des démocraties : les enjeux de sécurité', 6, 'Fondements et expériences de la démocratie'),
    ('La construction européenne et la démocratie', 7, 'Fondements et expériences de la démocratie'),
    ('Faire vivre le débat dans une démocratie', 8, 'Repenser et faire vivre la démocratie'),
    ('Le modèle démocratique en question : exemplarité et transparence', 9, 'Repenser et faire vivre la démocratie'),
    ('S’engager dans la démocratie au XXIe siècle', 10, 'Repenser et faire vivre la démocratie'),
    ('Nouvelles aspirations démocratiques', 11, 'Repenser et faire vivre la démocratie'),
    ('Conscience démocratique et relations internationales', 12, 'Repenser et faire vivre la démocratie')
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);

-- 5. Filet de vérification ---------------------------------------------------
-- Le compte doit tomber sur 12 fiches, toutes rangées. S'il n'y tombe pas, la
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
   WHERE s.slug = 'emc' AND c.level = 'Tle';
  IF total <> 12 OR ranges <> 12 THEN
    RAISE WARNING 'EMC Tle : % fiche(s) dont % rangee(s) — attendu 12 / 12.',
      total, ranges;
  ELSE
    RAISE NOTICE 'EMC Tle : 12 fiches rangees sous 2 chapitres.';
  END IF;
END $$;
