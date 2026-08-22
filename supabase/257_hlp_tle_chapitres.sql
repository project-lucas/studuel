-- =============================================================================
-- Studuel — Migration 257 : HLP Tle, RANGÉ SOUS SES 6 CHAPITRES
--
-- LA SUITE DE LA 248, ET LE MÊME GESTE. L'enseignement scientifique (248) avait
-- déjà ses 16 fiches dans le bon ordre : il ne manquait que le chapitre qui les
-- coiffe. HLP de Terminale est dans le même cas, et c'est le dernier du dépôt —
-- la migration 232 y a installé les 18 fiches du programme officiel, DANS
-- L'ORDRE de ses six chapitres (sondé le 20/08/2026 : positions 1 à 18,
-- exactement la suite attendue, plus la fiche de méthode en 90). Sans la
-- colonne `theme`, la page aligne 19 lignes à plat au lieu d'afficher les six
-- chapitres du programme.
--
-- CE QUE L'ÉLÈVE DOIT VOIR — les six chapitres du programme, trois fiches
-- chacun, dans l'ordre des deux semestres :
--   Semestre 1 « La recherche de soi »
--     1. Éducation, transmission et émancipation            (3 fiches)
--     2. Les expressions de la sensibilité                  (3 fiches)
--     3. Les métamorphoses du moi                           (3 fiches)
--   Semestre 2 « L'Humanité en question »
--     4. Création, continuités et ruptures                  (3 fiches)
--     5. Histoire et violence                               (3 fiches)
--     6. L'humain et ses limites                            (3 fiches)
--
-- POURQUOI LES CHAPITRES ET NON LES SEMESTRES. Le BO de HLP découpe l'année en
-- deux SEMESTRES, chacun portant trois thèmes. Ranger les 18 fiches sous les
-- deux semestres donnerait deux blocs de neuf : l'en-tête n'aiderait personne,
-- un élève qui cherche la bioéthique devant encore parcourir tout « L'Humanité
-- en question ». Ce sont donc les six THÈMES qui deviennent les chapitres —
-- c'est aussi le découpage de la maquette de référence. Les deux semestres
-- restent lisibles dans l'ordre : chapitres 1-3 puis 4-6.
--
-- AUCUNE SUPPRESSION ICI, comme dans la 248 : les deux fiches de semestre
-- héritées de la 219 (« Éducation, sensibilité, métamorphoses du moi » et
-- « Nature, technique et limites de l'humain ») sont déjà parties avec la 232,
-- qui les recouvrait entièrement. Cette migration ne fait qu'ÉCRIRE.
--
-- ⚠️ LA FICHE « MÉTHODE DE L'ÉPREUVE » N'EST PAS TOUCHÉE, et c'est délibéré.
-- Elle n'appartient à aucun chapitre du programme (l'interprétation littéraire
-- et l'essai philosophique ne relèvent d'aucune entrée du BO), la 232 l'a
-- renvoyée en position 90, et l'épreuve du bac de la migration 237 la désigne
-- comme son chapitre de rattachement — la supprimer casserait l'annale. Lui
-- inventer un septième chapitre contredirait la maquette, qui en montre six.
-- Elle reste donc à `theme IS NULL` : `groupChaptersByTheme` (lib/subject-
-- template.ts) la rend alors dans un groupe SANS en-tête, à sa place d'appari-
-- tion — donc en fin de liste — et `ChapterList` ne lui fait PAS consommer de
-- numéro de chapitre. Vérifié dans le code avant d'écrire : les six chapitres
-- restent numérotés 1 à 6.
--
-- LA COLONNE `chapters.theme` (migration 234) est REPRISE en ADD COLUMN IF NOT
-- EXISTS, comme dans les 243 à 256 : la 234 elle-même n'a jamais été exécutée.
-- Le GRANT n'est pas décoratif — la 182 a révoqué le SELECT de table sur
-- `chapters` et ne l'a rendu que colonne par colonne : une colonne ajoutée
-- après elle n'hérite d'aucun droit, et l'app lirait « permission denied » au
-- lieu du chapitre.
--
-- LES POSITIONS SONT RÉÉCRITES UNE À UNE (1 à 18). Elles y sont déjà, l'UPDATE
-- ne les touchera pas (`IS DISTINCT FROM`), mais les écrire rend la migration
-- vraie même si une position avait dérivé : un thème posé sur des fiches mal
-- ordonnées produirait des sections entrelacées, pire que la liste à plat.
--
-- LES TITRES CI-DESSOUS ONT ÉTÉ EXTRAITS DE LA BASE, PAS RECOPIÉS. Ils portent
-- les apostrophes typographiques (’ et non ') et les guillemets français de la
-- 232, qui est un fichier généré. Une apostrophe droite ne ferait pas échouer
-- la migration — elle ne trouverait simplement pas la ligne, en silence. C'est
-- le piège de la 249, et c'est pourquoi le filet de fin de fichier compte.
--
-- Idempotent : un seul UPDATE, gardé par IS DISTINCT FROM. Rejouable sans
-- risque, et sans effet au second passage.
--
-- PRÉREQUIS : 008 (chapters), 182 (grants par colonne), 232 (les 18 fiches).
-- Aucun ordre imposé vis-à-vis des autres migrations en attente.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 0. La colonne du chapitre de programme -------------------------------------
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- 1. Les 18 fiches, rangées sous leurs six chapitres -------------------------
UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
    ('Le renouveau de l’éducation', 1, 'Éducation, transmission et émancipation'),
    ('La transmission des savoirs', 2, 'Éducation, transmission et émancipation'),
    ('L’émancipation pour tous ?', 3, 'Éducation, transmission et émancipation'),
    ('« Un seul être vous manque et tout est dépeuplé » : le sentiment romantique', 4, 'Les expressions de la sensibilité'),
    ('Les sentiments et la raison', 5, 'Les expressions de la sensibilité'),
    ('Musique et sensibilité artistique', 6, 'Les expressions de la sensibilité'),
    ('Les transformations historiques de l’ego', 7, 'Les métamorphoses du moi'),
    ('Identité et genre', 8, 'Les métamorphoses du moi'),
    ('Mutilations de la guerre et détention', 9, 'Les métamorphoses du moi'),
    ('La science en question', 10, 'Création, continuités et ruptures'),
    ('Les arts contemporains : héritages et reniements', 11, 'Création, continuités et ruptures'),
    ('La question de la pop culture', 12, 'Création, continuités et ruptures'),
    ('La dystopie : la fin de l’utopie', 13, 'Histoire et violence'),
    ('Violence et société', 14, 'Histoire et violence'),
    ('L’histoire de la psychiatrie (Foucault)', 15, 'Histoire et violence'),
    ('Le fantasme de la toute-puissance humaine', 16, 'L’humain et ses limites'),
    ('La conscience écologique', 17, 'L’humain et ses limites'),
    ('La bioéthique', 18, 'L’humain et ses limites')
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'hlp'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);

-- 2. Filet de vérification ---------------------------------------------------
-- Le compte doit tomber sur 19 fiches — 18 rangées sous 6 chapitres, plus la
-- fiche de méthode volontairement laissée sans chapitre. S'il n'y tombe pas, la
-- migration le DIT au lieu de laisser passer une matière à moitié corrigée :
-- c'est ainsi qu'on repère une apostrophe qui aurait dérivé (le titre ne serait
-- pas trouvé, l'UPDATE ne dirait rien, et la fiche resterait à plat).
DO $$
DECLARE
  total     INT;
  rangees   INT;
  chapitres INT;
BEGIN
  SELECT count(*), count(c.theme), count(DISTINCT c.theme)
    INTO total, rangees, chapitres
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug = 'hlp' AND c.level = 'Tle';
  IF total <> 19 OR rangees <> 18 OR chapitres <> 6 THEN
    RAISE WARNING 'HLP Tle : % fiche(s), % rangee(s), % chapitre(s) — attendu 19 / 18 / 6.',
      total, rangees, chapitres;
  ELSE
    RAISE NOTICE 'HLP Tle OK : 18 fiches rangees sous 6 chapitres, plus la fiche de methode.';
  END IF;
END $$;
