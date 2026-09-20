-- =============================================================================
-- Studuel — Migration 251 : LA SVT DE TERMINALE, RANGÉE SOUS SES 7 CHAPITRES
--
-- LA SUITE DES 243 → 250. La migration 233 a installé les 22 fiches du programme
-- de spécialité SVT, DANS L'ORDRE des 7 chapitres du BO (sondé le 20/08/2026,
-- node _ASSOCIE/sonde-chapitres.mjs Tle svt : positions 1 à 22, exactement la
-- suite attendue, et rien d'autre dans le dossier). Il ne manquait qu'une
-- chose : le CHAPITRE qui coiffe chaque fiche.
--
-- LE DÉFAUT QUE ÇA CORRIGE. Vingt-deux lignes à plat, dont plusieurs intitulés
-- longs et jumeaux (« La chronologie relative : décrypter le temps des roches
-- par l'observation », puis « La chronologie absolue : … par des mesures »).
-- L'élève doit lire les vingt-deux titres pour situer le sien, alors que son
-- cours est écrit en sept chapitres.
--
-- CE QUE L'ÉLÈVE DOIT VOIR — les 7 chapitres du programme :
--   1. Origine de la diversité génétique des espèces et conséquences sur
--      l'évolution                                              (4 fiches)
--   2. À la recherche du passé géologique de notre planète       (3 fiches)
--   3. De la plante sauvage à la plante domestiquée              (4 fiches)
--   4. Les climats de la Terre, comprendre le passé pour agir
--      aujourd'hui et demain                                     (3 fiches)
--   5. Comportements, mouvement et système nerveux               (3 fiches)
--   6. Produire le mouvement : contraction musculaire et apport
--      d'énergie                                                 (3 fiches)
--   7. Comportement et stress : vers une vision intégrée de
--      l'organisme                                               (2 fiches)
--
-- MIGRATION D'ÉCRITURE PURE : un seul UPDATE, aucune suppression. Les 5 fiches
-- composites héritées de 008/142 sont déjà parties avec la 233, et la sonde
-- confirme que le dossier ne contient plus que les 22 fiches du programme.
-- Aucune fiche n'est déplacée non plus : l'ordre du BO est déjà celui de la
-- base, seules les frontières de sections sont posées. Les positions sont
-- réécrites une à une malgré tout (1 à 22) — elles y sont déjà, l'UPDATE ne les
-- touchera pas (`IS DISTINCT FROM`), mais les écrire rend la migration vraie
-- même si une position avait dérivé.
--
-- LE DÉCOUPAGE EST CELUI DES 7 CHAPITRES, pas des 3 thèmes du BO. Le BO range
-- ces sept chapitres sous trois thèmes (« La Terre, la vie et l'organisation du
-- vivant » → 1-2, « Enjeux planétaires contemporains » → 3-4, « Corps humain et
-- santé » → 5-7). Trois en-têtes pour vingt-deux fiches ne rangeraient presque
-- rien — « Corps humain et santé » pèserait à lui seul 8 fiches — et ce sont
-- les chapitres, pas les thèmes, que l'élève lit sur le cahier de son
-- professeur. Même arbitrage que pour l'enseignement scientifique (248).
--
-- LA COLONNE `chapters.theme` (migration 234) est REPRISE en ADD COLUMN IF NOT
-- EXISTS, comme dans les 243 à 250 : 234 n'a jamais été exécutée. Le GRANT n'est
-- pas décoratif — la 182 a révoqué le SELECT de table sur `chapters` et ne l'a
-- rendu que colonne par colonne : une colonne ajoutée après elle n'hérite
-- d'aucun droit, et l'app lirait « permission denied » au lieu du chapitre.
--
-- ⚠️ LES TITRES SONT ÉCRITS AVEC L'APOSTROPHE TYPOGRAPHIQUE (U+2019), celle que
-- porte la 233, donc la base. Écrits avec l'apostrophe droite, l'UPDATE ne
-- trouverait rien — et la migration se terminerait « avec succès » sans avoir
-- rien fait.
--
-- Idempotent : l'UPDATE est gardé par IS DISTINCT FROM, et vise des titres
-- exacts au seul niveau Tle. Les six autres niveaux de SVT ne sont pas touchés.
--
-- PRÉREQUIS : 008 (chapters), 182 (grants par colonne), 233 (les 22 fiches).
-- Aucun ordre imposé vis-à-vis de 234.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 0. La colonne du chapitre de programme -------------------------------------
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- 1. Les 22 fiches, rangées sous leurs 7 chapitres ---------------------------
UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
    ('La conservation des génomes : stabilité génétique et évolution clonale', 1, 'Origine de la diversité génétique des espèces et conséquences sur l’évolution'),
    ('Le brassage des génomes à chaque génération : la reproduction sexuée des eucaryotes', 2, 'Origine de la diversité génétique des espèces et conséquences sur l’évolution'),
    ('Mécanismes de diversification des êtres vivants', 3, 'Origine de la diversité génétique des espèces et conséquences sur l’évolution'),
    ('De la diversification des êtres vivants à l’évolution de la biodiversité', 4, 'Origine de la diversité génétique des espèces et conséquences sur l’évolution'),
    ('La chronologie relative : décrypter le temps des roches par l’observation', 5, 'À la recherche du passé géologique de notre planète'),
    ('La chronologie absolue : décrypter le temps des roches par des mesures', 6, 'À la recherche du passé géologique de notre planète'),
    ('Formation et disparition des océans : témoins d’un passé mouvementé de la Terre', 7, 'À la recherche du passé géologique de notre planète'),
    ('Organisation fonctionnelle des plantes à fleurs et adaptation à leurs milieux de vie', 8, 'De la plante sauvage à la plante domestiquée'),
    ('La plante, productrice de la matière organique grâce à la photosynthèse', 9, 'De la plante sauvage à la plante domestiquée'),
    ('Reproduction de la plante entre vie fixée et mobilité', 10, 'De la plante sauvage à la plante domestiquée'),
    ('La domestication des plantes', 11, 'De la plante sauvage à la plante domestiquée'),
    ('Comprendre les variations climatiques', 12, 'Les climats de la Terre, comprendre le passé pour agir aujourd’hui et demain'),
    ('Les méthodes d’observation du climat passé', 13, 'Les climats de la Terre, comprendre le passé pour agir aujourd’hui et demain'),
    ('Comprendre les conséquences du réchauffement climatique et les possibilités d’actions', 14, 'Les climats de la Terre, comprendre le passé pour agir aujourd’hui et demain'),
    ('Les réflexes', 15, 'Comportements, mouvement et système nerveux'),
    ('Cerveau et mouvement volontaire', 16, 'Comportements, mouvement et système nerveux'),
    ('Le cerveau : un organe fragile à préserver', 17, 'Comportements, mouvement et système nerveux'),
    ('La cellule musculaire : une structure spécialisée permettant son propre raccourcissement', 18, 'Produire le mouvement : contraction musculaire et apport d’énergie'),
    ('Origine de l’énergie (ATP) nécessaire à la contraction de la cellule musculaire', 19, 'Produire le mouvement : contraction musculaire et apport d’énergie'),
    ('Le contrôle des flux de glucose, source essentielle d’énergie des cellules musculaires', 20, 'Produire le mouvement : contraction musculaire et apport d’énergie'),
    ('L’adaptabilité de l’organisme face aux perturbations de l’environnement', 21, 'Comportement et stress : vers une vision intégrée de l’organisme'),
    ('L’organisme débordé dans ses capacités d’adaptation', 22, 'Comportement et stress : vers une vision intégrée de l’organisme')
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);

-- 2. Filet de verification ---------------------------------------------------
DO $$
DECLARE
  total INT;
  ranges INT;
BEGIN
  SELECT count(*), count(c.theme)
    INTO total, ranges
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug = 'svt' AND c.level = 'Tle';
  IF total <> 22 OR ranges <> 22 THEN
    RAISE WARNING 'SVT Tle : % fiche(s) dont % rangee(s) — attendu 22 / 22.',
      total, ranges;
  ELSE
    RAISE NOTICE 'SVT Tle : 22 fiches rangees sous 7 chapitres.';
  END IF;
END $$;
